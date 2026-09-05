/**
 * TTS Voiceover Generator
 *
 * Default provider is Microsoft's free Edge TTS endpoint (see
 * edge-tts-voice.py). Zvukogram, the paid reseller this used to call, is kept
 * behind TTS_PROVIDER=zvukogram as a fallback.
 *
 * Why the switch (2026-09-05): Zvukogram's balance ran out on 02.09 and every
 * digest render died at this step for four days. Its Norwegian voices "Финн"
 * and "Пернилла" ARE nb-NO-FinnNeural and nb-NO-PernilleNeural — the same
 * Microsoft voices, resold. Nothing about how the digest sounds changes.
 *
 * It also fixes the timings. Zvukogram's /subs endpoint was unavailable on
 * that account, so caption timings were inferred from ffmpeg silence gaps;
 * Edge emits a WordBoundary per spoken word, so they are now measured.
 *
 * API docs (fallback): https://zvukogram.com/node/api/
 *
 * This runs inside the GitHub Actions video-processor pipeline.
 */
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * @typedef {Object} SubtitleEntry
 * @property {string} text - The word or phrase
 * @property {number} startTime - Start time in seconds
 * @property {number} endTime - End time in seconds
 */

/**
 * @typedef {Object} VoiceoverResult
 * @property {string} audioPath - Path to the generated audio file
 * @property {SubtitleEntry[]} subtitles - Word-level timestamps
 * @property {number} durationSeconds - Total audio duration in seconds
 */

/**
 * Norwegian voice pairs for dual-narrator digest.
 * Male and female voices alternate between segments.
 */
export const VOICE_PRESETS = {
  no: {
    male: 'Финн',
    female: 'Пернилла',
  },
  en: {
    male: 'Brian US HD',
    female: 'Nova NO',
  },
  ua: {
    male: 'Alessio UA',
    female: 'Поліна',
  },
  ru: {
    male: 'Александр',
    female: 'Алена',
  },
};

/**
 * The same voices, addressed directly instead of through a reseller.
 * Norwegian is the pair the digest actually uses; the rest match the intent
 * of the Zvukogram presets above.
 */
export const EDGE_VOICE_PRESETS = {
  no: { male: 'nb-NO-FinnNeural', female: 'nb-NO-PernilleNeural' },
  en: { male: 'en-US-BrianNeural', female: 'en-US-AvaNeural' },
  ua: { male: 'uk-UA-OstapNeural', female: 'uk-UA-PolinaNeural' },
  ru: { male: 'ru-RU-DmitryNeural', female: 'ru-RU-SvetlanaNeural' },
};

/**
 * Speak a script with Edge TTS, returning audio plus per-word timings taken
 * from the WordBoundary events rather than estimated after the fact.
 *
 * @returns {Promise<VoiceoverResult>}
 */
async function generateWithEdgeTts(scriptText, language, gender) {
  const preset = EDGE_VOICE_PRESETS[language] || EDGE_VOICE_PRESETS.no;
  const voice = preset[gender] || preset.male;
  console.log(`🔊 Edge TTS voice: ${voice}`);

  const stamp = Date.now();
  const audioPath = path.join(os.tmpdir(), `voiceover_${stamp}.mp3`);
  const wordsPath = path.join(os.tmpdir(), `voiceover_${stamp}.words.json`);
  const scriptPath = path.join(os.tmpdir(), `voiceover_${stamp}.txt`);
  await fs.writeFile(scriptPath, scriptText, 'utf8');

  const helper = path.join(path.dirname(new URL(import.meta.url).pathname), 'edge-tts-voice.py');
  await execAsync(`python3 ${JSON.stringify(helper)} ${JSON.stringify(voice)} ` +
    `${JSON.stringify(audioPath)} ${JSON.stringify(wordsPath)} < ${JSON.stringify(scriptPath)}`,
    { maxBuffer: 10 * 1024 * 1024 });

  const parsed = JSON.parse(await fs.readFile(wordsPath, 'utf8'));
  const subtitles = parsed.words;
  const durationSeconds = parsed.durationSeconds;

  if (!subtitles || subtitles.length === 0) {
    throw new Error('Edge TTS returned no word boundaries');
  }

  const size = (await fs.stat(audioPath)).size;
  console.log(`✅ Audio: ${(size / 1024 / 1024).toFixed(2)} MB, ${durationSeconds}s → ${audioPath}`);
  console.log(`📝 ${subtitles.length} word timings (measured, not estimated)`);
  console.log('💰 Cost: 0 — Microsoft Edge endpoint');

  return { audioPath, subtitles, durationSeconds };
}

/**
 * Generate voiceover audio and word timestamps from a script.
 *
 * @param {string} scriptText - The voiceover script text
 * @param {string} language - Language code: 'en', 'no', 'ua'
 * @param {{ voice?: string, gender?: 'male' | 'female' }} options - Optional voice override or gender selection
 * @returns {Promise<VoiceoverResult>}
 */
export async function generateVoiceover(scriptText, language = 'en', options = {}) {
  console.log(`🎙️ Generating voiceover (${language})...`);
  console.log(`   Script length: ${scriptText.length} chars, ${scriptText.split(/\s+/).length} words`);

  // Edge unless explicitly told otherwise. An explicit options.voice is a
  // Zvukogram voice name, so that path still goes to Zvukogram.
  const provider = process.env.TTS_PROVIDER || (options.voice ? 'zvukogram' : 'edge');
  if (provider === 'edge') {
    return generateWithEdgeTts(scriptText, language, options.gender || 'male');
  }

  const ZVUKOGRAM_TOKEN = process.env.ZVUKOGRAM_TOKEN;
  const ZVUKOGRAM_EMAIL = process.env.ZVUKOGRAM_EMAIL;

  if (!ZVUKOGRAM_TOKEN || !ZVUKOGRAM_EMAIL) {
    throw new Error('Missing ZVUKOGRAM_TOKEN or ZVUKOGRAM_EMAIL');
  }

  // Pick voice: explicit override > gender preset > default male
  let voice;
  if (options.voice) {
    voice = options.voice;
  } else if (options.gender) {
    const preset = VOICE_PRESETS[language] || VOICE_PRESETS.no;
    voice = preset[options.gender] || preset.male;
  } else {
    const preset = VOICE_PRESETS[language] || VOICE_PRESETS.no;
    voice = preset.male;
  }

  const BASE = 'https://zvukogram.com/index.php?r=api';
  console.log(`🔊 Using voice: ${voice}`);

  // ── Step 1: Generate audio. (Zvukogram's /subs endpoint, which would give
  // real word timestamps, is confirmed unavailable on this account for any
  // voice/params — skip straight to plain TTS and align captions to the
  // audio ourselves in step 4.) ──
  let result;
  if (scriptText.length > 1500) {
    console.log(`📝 Using /longtext endpoint (${scriptText.length} chars > 1500)`);
    result = await longTextEndpoint(BASE, ZVUKOGRAM_TOKEN, ZVUKOGRAM_EMAIL, voice, scriptText);
  } else {
    console.log(`📝 Using /text endpoint (instant mode)`);
    try {
      result = await textEndpoint(BASE, ZVUKOGRAM_TOKEN, ZVUKOGRAM_EMAIL, voice, scriptText);
    } catch (textErr) {
      // Retry with /longtext if /text fails (partial voice failures, etc.)
      console.log(`⚠️ /text failed: ${textErr.message}`);
      console.log(`🔄 Retrying with /longtext...`);
      result = await longTextEndpoint(BASE, ZVUKOGRAM_TOKEN, ZVUKOGRAM_EMAIL, voice, scriptText);
    }
  }

  // ── Step 3: Download audio file ──
  const fileUrl = result.file_cors || result.file;
  if (!fileUrl) {
    throw new Error(`Zvukogram: no file URL in response: ${JSON.stringify(result)}`);
  }

  console.log(`📥 Downloading audio from: ${fileUrl}`);
  const audioResponse = await fetch(fileUrl);
  if (!audioResponse.ok) {
    throw new Error(`Failed to download audio: ${audioResponse.status}`);
  }

  const audioBuffer = Buffer.from(await audioResponse.arrayBuffer());
  const audioPath = path.join(os.tmpdir(), `voiceover_${Date.now()}.mp3`);
  await fs.writeFile(audioPath, audioBuffer);

  const fileSizeMB = (audioBuffer.length / 1024 / 1024).toFixed(2);
  const durationSeconds = result.duration || audioBuffer.length / 6000;
  console.log(`✅ Audio: ${fileSizeMB} MB, ${durationSeconds}s → ${audioPath}`);
  console.log(`💰 Cost: ${result.cost || '?'} tokens, balance: ${result.balans || '?'}`);

  // ── Step 4: Build subtitle timestamps (audio-aligned, see buildSubtitleTimestamps) ──
  const subtitles = await buildSubtitleTimestamps(scriptText, durationSeconds, audioPath);
  console.log(`📝 Generated ${subtitles.length} subtitle entries`);

  return {
    audioPath,
    subtitles,
    durationSeconds,
  };
}

/**
 * Use /text endpoint for instant TTS (texts <1000 chars).
 */
async function textEndpoint(BASE, token, email, voice, text) {
  const resp = await fetch(`${BASE}/text`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ token, email, voice, text, format: 'mp3', speed: '0.9' }).toString(),
  });

  if (!resp.ok) {
    throw new Error(`Zvukogram /text error: ${resp.status} ${await resp.text()}`);
  }

  const data = await resp.json();
  if (data.status === -1) {
    throw new Error(`Zvukogram error: ${data.error || JSON.stringify(data)}`);
  }
  if (data.status !== 1) {
    throw new Error(`Zvukogram unexpected status: ${JSON.stringify(data)}`);
  }

  console.log(`✅ /text succeeded`);
  return data;
}

/**
 * Use /longtext endpoint for texts >2000 chars. Returns after polling.
 */
async function longTextEndpoint(BASE, token, email, voice, text) {
  const resp = await fetch(`${BASE}/longtext`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ token, email, voice, text, format: 'mp3', speed: '0.9' }).toString(),
  });

  if (!resp.ok) {
    throw new Error(`Zvukogram /longtext error: ${resp.status} ${await resp.text()}`);
  }

  let data = await resp.json();
  if (data.status === -1) {
    throw new Error(`Zvukogram /longtext error: ${data.error || JSON.stringify(data)}`);
  }

  // /longtext is async — poll until file URL appears
  const taskId = data.id;
  if (!taskId) {
    throw new Error(`Zvukogram /longtext: no task ID in response: ${JSON.stringify(data)}`);
  }

  console.log(`⏳ Processing longtext (id=${taskId}, parts=${data.parts || '?'})...`);
  for (let i = 0; i < 120; i++) {
    // Check if file is already available
    if (data.file || data.file_cors) break;

    await new Promise(r => setTimeout(r, 3000));
    const poll = await fetch(`${BASE}/result`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ token, email, id: String(taskId) }).toString(),
    });
    data = await poll.json();
    if (data.status === -1) {
      throw new Error(`Zvukogram /longtext failed: ${data.error || JSON.stringify(data)}`);
    }
    if (i % 10 === 9) console.log(`   Still processing... (${(i + 1) * 3}s, parts_done=${data.parts_done || 0}/${data.parts || '?'})`);
  }

  if (!data.file && !data.file_cors) {
    throw new Error(`Zvukogram /longtext: no file URL after polling: ${JSON.stringify(data)}`);
  }

  console.log(`✅ /longtext succeeded`);
  return data;
}

/**
 * Build subtitle timestamps for a script: align sentence groups to real
 * silence gaps detected in the generated audio, so on-screen caption
 * groups move in sync with actual pauses in speech. Falls back to a
 * plain word-count estimate if silence detection can't find enough gaps.
 *
 * @param {string} scriptText - Original script text
 * @param {number} totalDuration - Total audio duration
 * @param {string} audioPath - Path to the generated audio file
 * @returns {Promise<SubtitleEntry[]>}
 */
async function buildSubtitleTimestamps(scriptText, totalDuration, audioPath) {
  const aligned = await generateAudioAlignedTimestamps(audioPath, scriptText, totalDuration).catch(e => {
    console.log(`⚠️ Silence detection failed: ${e.message}`);
    return null;
  });
  if (aligned && aligned.length > 0) {
    return aligned;
  }

  console.log('⚠️ Falling back to plain word-count estimate');
  const words = scriptText.split(/\s+/).filter(w => w.length > 0);
  return generateEstimatedTimestamps(words, totalDuration);
}

/**
 * Split a script into sentences, keeping trailing punctuation.
 */
function splitIntoSentences(text) {
  const matches = text.match(/[^.!?]+[.!?]+(\s+|$)/g);
  if (!matches || matches.length === 0) return [text.trim()].filter(s => s.length > 0);
  return matches.map(s => s.trim()).filter(s => s.length > 0);
}

/**
 * Run ffmpeg silencedetect on the generated audio to find real pause
 * boundaries (sentence breaks), so captions can be grouped by actual
 * speech gaps instead of guessed word timing.
 *
 * @returns {Promise<number[]>} silence_start timestamps, in order
 */
async function detectSilenceGaps(audioPath, noiseDb = -30, minSilenceDur = 0.15) {
  const { stderr } = await execAsync(
    `ffmpeg -i "${audioPath}" -af silencedetect=noise=${noiseDb}dB:d=${minSilenceDur} -f null -`,
    { maxBuffer: 10 * 1024 * 1024 }
  );
  const output = stderr || '';
  return [...output.matchAll(/silence_start:\s*([\d.]+)/g)].map(m => parseFloat(m[1]));
}

/**
 * Distribute a sentence's words evenly (with a small long-word weight bump)
 * across a known real time window.
 */
function distributeWordsInWindow(words, windowStart, windowDuration) {
  const weights = words.map(word => (word.length > 8 ? 1.3 : 1.0));
  const totalWeight = weights.reduce((sum, w) => sum + w, 0) || 1;

  const subtitles = [];
  let t = windowStart;
  for (let i = 0; i < words.length; i++) {
    const wordDuration = (weights[i] / totalWeight) * windowDuration;
    subtitles.push({
      text: words[i].replace(/[.,!?;:"""''()—–\-]/g, ''),
      startTime: Math.round(t * 100) / 100,
      endTime: Math.round((t + wordDuration) * 100) / 100,
    });
    t += wordDuration;
  }
  return subtitles;
}

/**
 * Split the script into sentences, detect real silence gaps in the audio,
 * and match them 1:1 to get real per-sentence time windows. Returns null
 * (caller should fall back) if there aren't enough detected gaps to match
 * the sentence count.
 */
async function generateAudioAlignedTimestamps(audioPath, scriptText, totalDuration) {
  const sentences = splitIntoSentences(scriptText);
  if (sentences.length < 2) return null;

  const gaps = await detectSilenceGaps(audioPath);
  if (gaps.length < sentences.length - 1) {
    console.log(`⚠️ Silence detection found ${gaps.length} gap(s), need ${sentences.length - 1} for ${sentences.length} sentences`);
    return null;
  }

  const boundaries = [0, ...gaps.slice(0, sentences.length - 1), totalDuration];
  const subtitles = [];
  for (let i = 0; i < sentences.length; i++) {
    const words = sentences[i].split(/\s+/).filter(w => w.length > 0);
    if (words.length === 0) continue;
    const windowStart = boundaries[i];
    const windowDuration = Math.max(boundaries[i + 1] - boundaries[i], 0.1);
    subtitles.push(...distributeWordsInWindow(words, windowStart, windowDuration));
  }
  console.log(`✅ Audio-aligned timestamps: matched ${sentences.length} sentences to real silence gaps`);
  return subtitles;
}

/**
 * Fallback: distribute words evenly across audio duration.
 */
function generateEstimatedTimestamps(words, totalDuration) {
  if (words.length === 0) return [];

  const subtitles = [];
  const weights = words.map((word, i) => {
    let weight = 1.0;
    if (word.length > 8) weight += 0.3;
    if (i > 0) {
      const prev = words[i - 1];
      if (prev.match(/[.!?]$/)) weight += 0.8;
      else if (prev.match(/[,;:]$/)) weight += 0.3;
    }
    return weight;
  });

  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  let currentTime = 0.1;

  for (let i = 0; i < words.length; i++) {
    const wordDuration = (weights[i] / totalWeight) * (totalDuration - 0.2);
    subtitles.push({
      text: words[i].replace(/[.,!?;:"""''()—–\-]/g, ''),
      startTime: Math.round(currentTime * 100) / 100,
      endTime: Math.round((currentTime + wordDuration) * 100) / 100,
    });
    currentTime += wordDuration;
  }

  return subtitles;
}
