/**
 * Visual Director — phrase-level visual planning for DailyNewsShow.
 *
 * Analyses each segment's voiceover script and generates a visual plan:
 * - Splits text into phrases (2-4 second blocks) using subtitle timestamps
 * - Maps each phrase to a visual metaphor and effect
 * - Extracts numeric data for animated infographics (dataOverlays)
 * - Ensures variety between adjacent segments AND adjacent blocks
 *
 * Pipeline position: AFTER voiceover generation, BEFORE Remotion render.
 *
 * Usage:
 *   import { directVisuals } from './visual-director.js';
 *   const directives = await directVisuals(segmentScripts, segments, segmentVoiceovers);
 *   // directives[i] → { mood, transition, textReveal, visualBlocks[], dataOverlays[], ... }
 */

// ── Available options (must match design-system constants) ──

const MOODS = [
  'urgent', 'energetic', 'positive', 'analytical',
  'serious', 'contemplative', 'lighthearted', 'cautionary',
];

const TRANSITIONS = [
  'fade', 'wipeLeft', 'wipeRight', 'slideUp', 'slideDown',
  'zoomIn', 'zoomOut', 'filmBurn', 'glitchWipe',
];

const TEXT_EFFECTS = ['typewriter', 'fadeUp', 'blurReveal', 'springPop', 'splitScale'];

const HEADLINE_REVEALS = ['default', 'typewriter', 'splitFade', 'splitScale'];

const STATS_VISUAL_TYPES = ['list', 'counters', 'bars'];

const BACKGROUND_EFFECTS = ['kenBurns', 'zoomPulse', 'slowPan', 'colorShift'];

// ── Category → preferred mood/transition ──

const CATEGORY_MOOD_MAP = {
  tech:     ['energetic', 'analytical'],
  business: ['analytical', 'serious'],
  ai:       ['energetic', 'contemplative'],
  startup:  ['energetic', 'positive'],
  science:  ['analytical', 'contemplative'],
  politics: ['serious', 'cautionary'],
  crypto:   ['urgent', 'cautionary'],
  health:   ['serious', 'positive'],
  news:     ['positive', 'serious'],
};

const CATEGORY_TRANSITION_MAP = {
  tech:     ['wipeLeft', 'glitchWipe'],
  business: ['slideUp', 'fade'],
  ai:       ['glitchWipe', 'zoomIn'],
  startup:  ['wipeLeft', 'zoomIn'],
  science:  ['fade', 'slideUp'],
  politics: ['wipeRight', 'filmBurn'],
  crypto:   ['glitchWipe', 'zoomIn'],
  health:   ['fade', 'slideDown'],
  news:     ['fade', 'wipeLeft'],
};

// ── Keyword patterns for phrase classification (Norwegian + English + Ukrainian) ──

const KEYWORD_PATTERNS = {
  numbers: /(\d+[\.,]?\d*)\s*(%|prosent|percent|millioner|milliarder|kroner|dollar|euro|brukere|users|ganger|times|відсотків|процентів|мільйонів|мільярдів|тисяч|гривень|користувачів|разів|мов|секунд|хвилин|годин|каналів|статей|фіч)/i,
  comparison: /(sammenlignet med|compared to|versus|vs\.?|fra\s+\d+.*?til\s+\d+|from\s+\d+.*?to\s+\d+|økte?\s+fra|reduced from|dobl|tredobl|halvert|порівняно з|від\s+\d+.*?до\s+\d+|зросло?\s+від|зменшилося?\s+від|замість)/i,
  growth: /(vokser|vekst|øk[te]*|økning|increase|growth|rising|expanding|dobl|tredobl|oppsving|boost|surge|rekord|record|lansert|launch|зросло|зріс|збільшилось|зростання|підвищення|покращення|запуск|рекорд)/i,
  decline: /(fall[er]*|nedgang|reduksjon|decrease|decline|drop|falling|shrink|kutt|cuts|layoff|lost|mist[et]*|taper|зменшилось|впало|скоротилось|знизилось|втратили|скорочення)/i,
  list: /(for det første|for det andre|for det tredje|firstly|secondly|thirdly|blant annet|including|several|mange|multiple|tre ting|three|four|five|fire|fem|по-перше|по-друге|по-третє|серед них|включаючи|декілька|багато)/i,
  technology: /(teknologi|software|hardware|kunstig intelligens|algoritme|maskinlæring|machine learning|robot|automasjon|digital|chip|prosessor|GPU|server|cloud|sky|kode|plattform|технологія|алгоритм|штучний інтелект|автоматизація|платформа|нейромережа|бот|сервер)/i,
  geography: /(land|country|region|verden|world|global|europa|europe|asia|amerika|america|norge|norway|kina|china|usa|india|japan|storbritannia|uk|країна|світ|глобально|європа|норвегія|україна)/i,
  timeline: /(innen\s+\d{4}|by\s+\d{4}|neste år|next year|i fremtiden|in the future|planlegger|plans? to|roadmap|milestone|fase|phase|Q[1-4]\s+\d{4}|до\s+\d{4}|наступного року|в майбутньому|планує|етап|фаза)/i,
  focus: /(spesielt|especially|særlig|notably|viktigst|most importantly|nøkkelen|the key|fokus|focus|sentral|central|hovedsakelig|primarily|особливо|найважливіше|ключовий|головне|фокус|центральний|передусім)/i,
  urgency: /(umiddelbart|immediately|breaking|akutt|kritisk|critical|haster|urgent|rask|quick|plutselig|suddenly|nå må|must now|негайно|критично|терміново|швидко|раптово)/i,
};

// ── Metaphor → preferred text/background effects ──

const METAPHOR_TEXT_EFFECTS = {
  data:        ['springPop', 'fadeUp'],
  comparison:  ['splitScale', 'fadeUp'],
  growth:      ['springPop', 'blurReveal'],
  decline:     ['fadeUp', 'typewriter'],
  enumeration: ['fadeUp', 'splitScale'],
  technology:  ['blurReveal', 'typewriter'],
  geography:   ['fadeUp', 'blurReveal'],
  timeline:    ['typewriter', 'fadeUp'],
  focus:       ['springPop', 'blurReveal'],
  urgency:     ['springPop', 'typewriter'],
  narrative:   ['fadeUp', 'blurReveal', 'springPop'],
};

const METAPHOR_BG_EFFECTS = {
  data:        ['zoomPulse', 'static'],
  comparison:  ['slowPan', 'static'],
  growth:      ['kenBurns', 'zoomPulse'],
  decline:     ['slowPan', 'colorShift'],
  enumeration: ['static', 'kenBurns'],
  technology:  ['colorShift', 'zoomPulse'],
  geography:   ['kenBurns', 'slowPan'],
  timeline:    ['slowPan', 'kenBurns'],
  focus:       ['zoomPulse', 'kenBurns'],
  urgency:     ['zoomPulse', 'colorShift'],
  narrative:   ['kenBurns', 'slowPan'],
};

// ═══════════════════════════════════════════════════════════════════
//  Variety Tracker — ensures no two adjacent picks are the same
// ═══════════════════════════════════════════════════════════════════

class VarietyTracker {
  constructor() {
    /** @type {Record<string, string>} last value per dimension */
    this.last = {};
  }

  /**
   * Pick a value from `options` that differs from the last pick
   * for the given dimension. If `preferred` is valid and different
   * from last, use it; otherwise pick randomly from remaining.
   */
  pick(dimension, options, preferred = null) {
    const prev = this.last[dimension];
    let pool = prev ? options.filter(o => o !== prev) : [...options];
    if (pool.length === 0) pool = [...options];

    if (preferred && pool.includes(preferred)) {
      this.last[dimension] = preferred;
      return preferred;
    }

    const choice = pool[Math.floor(Math.random() * pool.length)];
    this.last[dimension] = choice;
    return choice;
  }
}

// ═══════════════════════════════════════════════════════════════════
//  Phrase Splitting — timestamps → 2-4 second blocks
// ═══════════════════════════════════════════════════════════════════

/**
 * Split a voiceover script into phrases using subtitle word timestamps.
 * Each phrase targets ~3 seconds of narration.
 *
 * @param {string}   scriptText       Full script text
 * @param {Array}    subtitles        [{text, startTime, endTime}, ...]
 * @param {number}   targetDuration   Seconds per phrase (default 3)
 * @returns {Array}  [{text, startTime, endTime, duration}, ...]
 */
function splitIntoPhrases(scriptText, subtitles, targetDuration = 3) {
  if (!subtitles || subtitles.length === 0) {
    return splitBySentences(scriptText);
  }

  const phrases = [];
  let buf = { words: [], start: 0, end: 0 };

  for (let i = 0; i < subtitles.length; i++) {
    const s = subtitles[i];
    if (buf.words.length === 0) buf.start = s.startTime;
    buf.words.push(s.text);
    buf.end = s.endTime;

    const dur = buf.end - buf.start;
    const word = s.text;
    const isSentenceEnd = /[.!?]$/.test(word);
    const isNaturalBreak = /[,;:]$/.test(word);

    const shouldSplit =
      (isSentenceEnd && dur >= 1.5) ||
      (isNaturalBreak && dur >= targetDuration) ||
      (dur >= 5);

    if (shouldSplit) {
      phrases.push({
        text: buf.words.join(' '),
        startTime: buf.start,
        endTime: buf.end,
        duration: buf.end - buf.start,
      });
      buf = { words: [], start: 0, end: 0 };
    }
  }

  // Flush remaining words
  if (buf.words.length > 0) {
    phrases.push({
      text: buf.words.join(' '),
      startTime: buf.start,
      endTime: buf.end,
      duration: buf.end - buf.start,
    });
  }

  return mergeTinyPhrases(phrases, 1.5);
}

/** Fallback: split by sentences when no timestamps available. */
function splitBySentences(text) {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const WPS = 2; // words per second (TTS average)
  let t = 0;

  return sentences.map(raw => {
    const s = raw.trim();
    const dur = s.split(/\s+/).length / WPS;
    const phrase = { text: s, startTime: t, endTime: t + dur, duration: dur };
    t += dur;
    return phrase;
  });
}

/** Merge phrases shorter than `minDur` seconds with their neighbour. */
function mergeTinyPhrases(phrases, minDur) {
  if (phrases.length <= 1) return phrases;
  const out = [];
  let i = 0;

  while (i < phrases.length) {
    const cur = { ...phrases[i] };
    while (cur.duration < minDur && i + 1 < phrases.length) {
      i++;
      cur.text += ' ' + phrases[i].text;
      cur.endTime = phrases[i].endTime;
      cur.duration = cur.endTime - cur.startTime;
    }
    out.push(cur);
    i++;
  }

  return out;
}

// ═══════════════════════════════════════════════════════════════════
//  Phrase Classification (heuristic)
// ═══════════════════════════════════════════════════════════════════

/**
 * Classify a phrase's dominant visual metaphor.
 * Returns { metaphor, graphicType }.
 */
function classifyPhrase(text) {
  const lc = text.toLowerCase();

  if (KEYWORD_PATTERNS.numbers.test(lc))    return { metaphor: 'data', graphicType: 'counter' };
  if (KEYWORD_PATTERNS.comparison.test(lc)) return { metaphor: 'comparison', graphicType: 'comparison' };
  if (KEYWORD_PATTERNS.growth.test(lc))     return { metaphor: 'growth', graphicType: 'keyFigure' };
  if (KEYWORD_PATTERNS.decline.test(lc))    return { metaphor: 'decline', graphicType: 'keyFigure' };
  if (KEYWORD_PATTERNS.list.test(lc))       return { metaphor: 'enumeration', graphicType: 'bulletList' };
  if (KEYWORD_PATTERNS.technology.test(lc)) return { metaphor: 'technology', graphicType: 'none' };
  if (KEYWORD_PATTERNS.geography.test(lc))  return { metaphor: 'geography', graphicType: 'none' };
  if (KEYWORD_PATTERNS.timeline.test(lc))   return { metaphor: 'timeline', graphicType: 'none' };
  if (KEYWORD_PATTERNS.focus.test(lc))      return { metaphor: 'focus', graphicType: 'none' };
  if (KEYWORD_PATTERNS.urgency.test(lc))    return { metaphor: 'urgency', graphicType: 'none' };

  return { metaphor: 'narrative', graphicType: 'none' };
}

// ═══════════════════════════════════════════════════════════════════
//  Data Extraction — pull numbers for infographic overlays
// ═══════════════════════════════════════════════════════════════════

/**
 * Extract numeric data points from a phrase.
 * Returns an array of { type, value, label, raw, ... } objects.
 */
function extractDataPoints(text) {
  const pts = [];
  let m;

  // Percentages: "87%", "87 prosent"
  const pctRe = /(\d+[\.,]?\d*)\s*(%|prosent|percent)/gi;
  while ((m = pctRe.exec(text)) !== null) {
    pts.push({ type: 'percentage', value: m[1].replace(',', '.'), unit: '%', raw: m[0] });
  }

  // Comparisons: "from X to Y" / "fra X til Y"
  const cmpRe = /(?:fra|from)\s+(\d+[\.,]?\d*)\s*(%|prosent|percent)?\s+(?:til|to)\s+(\d+[\.,]?\d*)\s*(%|prosent|percent)?/gi;
  while ((m = cmpRe.exec(text)) !== null) {
    pts.push({
      type: 'comparison',
      from: m[1].replace(',', '.'),
      to: m[3].replace(',', '.'),
      unit: m[2] || m[4] || '',
      raw: m[0],
    });
  }

  // Money: "$5M", "50 millioner kroner"
  const monRe = /(?:\$\s*[\d,.]+(?:\s*(?:million|billion|trillion))?|(\d+[\.,]?\d*)\s*(millioner|milliarder|tusen|kroner|dollar|euro)(?:\s*(kroner|dollar|euro))?)/gi;
  while ((m = monRe.exec(text)) !== null) {
    pts.push({ type: 'money', value: m[0].trim(), raw: m[0] });
  }

  // Counts: "5000 brukere", "2.5 million users"
  const cntRe = /(\d+[\.,]?\d*)\s*(millioner?|milliarder?|million|billion|thousand|tusen)?\s*(brukere|users|enheter|devices|selskaper|companies|ansatte|employees|land|countries|kunder|customers)/gi;
  while ((m = cntRe.exec(text)) !== null) {
    pts.push({ type: 'count', value: m[0].trim(), raw: m[0] });
  }

  // Directional change: "økte med 40 prosent", "falt 12%", "grew by 30 percent"
  const dirRe = /(økte|steg|vokste|opp|økning|grew|rose|increased|up|falt|sank|ned|nedgang|fell|dropped|decreased|down)\D{0,20}?(\d+[\.,]?\d*)\s*(%|prosent|percent)/gi;
  while ((m = dirRe.exec(text)) !== null) {
    const down = /falt|sank|ned|nedgang|fell|dropped|decreased|down/i.test(m[1]);
    const magnitude = parseFloat(m[2].replace(',', '.'));
    pts.push({
      type: 'delta',
      value: m[2].replace(',', '.') + '%',
      changePct: down ? -magnitude : magnitude,
      raw: m[0],
    });
  }

  return pts;
}

/**
 * Build a bar-chart series when a phrase enumerates several comparable numbers,
 * e.g. "Norge 40 prosent, Sverige 25 prosent, Danmark 18 prosent".
 * Returns null unless at least two label+value pairs share a unit.
 */
function extractSeries(text) {
  const re = /([A-ZÆØÅА-ЯІЇЄҐ][\wæøåÆØÅ\-]{2,}(?:\s+[A-ZÆØÅ][\wæøå\-]+)?)\s*[:–-]?\s*(\d+[\.,]?\d*)\s*(%|prosent|percent|millioner?|milliarder?)/g;
  const items = [];
  let m;
  while ((m = re.exec(text)) !== null) {
    const unit = /%|prosent|percent/i.test(m[3]) ? '%' : ` ${m[3]}`;
    items.push({ label: m[1].trim(), value: m[2].replace(',', '.') + unit });
  }
  if (items.length < 2) return null;
  const units = new Set(items.map(it => it.value.replace(/[\d.,]/g, '')));
  if (units.size > 1) return null;
  return items.slice(0, 4);
}

/**
 * Convert a data point into a DataOverlayItem for InfoGraphicOverlay.
 *
 * @param {object}  dp          Extracted data point
 * @param {number}  showAt      0-1 fraction of segment
 * @param {number}  hideAt      0-1 fraction of segment
 * @param {string}  position    'left' | 'right'
 */
function dataPointToOverlay(dp, showAt, hideAt, position) {
  if (dp.type === 'percentage') {
    return {
      type: 'keyFigure',
      showAt, hideAt, position,
      data: {
        value: dp.value + '%',
        label: '',
        trend: parseFloat(dp.value) > 50 ? 'up' : 'neutral',
      },
    };
  }
  if (dp.type === 'comparison') {
    const u = dp.unit === '%' || dp.unit === 'prosent' || dp.unit === 'percent' ? '%' : '';
    return {
      type: 'comparison',
      showAt, hideAt, position,
      data: {
        left:  { label: 'Før', value: dp.from + u },
        right: { label: 'Nå',  value: dp.to + u },
      },
    };
  }
  if (dp.type === 'money' || dp.type === 'count') {
    return {
      type: 'keyFigure',
      showAt, hideAt, position,
      data: { value: dp.value, label: '', trend: 'neutral' },
    };
  }
  return null;
}

// ═══════════════════════════════════════════════════════════════════
//  AI Visual Director (NVIDIA NIM / Claude)
// ═══════════════════════════════════════════════════════════════════

import { callLLMJson } from './llm-helper.js';

/**
 * Per-segment AI Visual Director call.
 * Each segment gets its own prompt with FULL article context + creative hints.
 */
async function aiDirectSingleSegment(script, article, segmentMeta, segIndex, totalSegs, usedSoFar = null) {
  if (!process.env.NVIDIA_API_KEY && !process.env.ANTHROPIC_API_KEY) return null;

  const title = article?.title_en || article?.title_no || segmentMeta?.headline || '';
  const content = (article?.content_en || article?.content_no || article?.original_content || '').substring(0, 1500);
  const category = segmentMeta?.category || 'news';

  // Cross-segment variety: this video's segments are directed one at a time, but nothing
  // stops segment 3 and segment 7 from picking the same transition/textEffect/backgroundEffect.
  // Feed back what's already been used so far so the director actively spreads choices out
  // across the WHOLE video, not just within this one segment's phrases.
  const used = usedSoFar || { transitions: [], textEffects: [], backgroundEffects: [] };
  const crossSegmentNote = segIndex === 0 ? '' : `
CROSS-SEGMENT VARIETY (this video already used these in earlier segments — prefer options NOT in these lists, only repeat if you've genuinely exhausted the alternatives):
- transitions used so far: ${used.transitions.join(', ') || '(none yet)'}
- textEffects used so far: ${[...new Set(used.textEffects)].join(', ') || '(none yet)'}
- backgroundEffects used so far: ${[...new Set(used.backgroundEffects)].join(', ') || '(none yet)'}
`;

  const systemPrompt = `You are a Visual Director for segment ${segIndex + 1}/${totalSegs} of a news video.

ARTICLE:
Title: ${title}
Category: ${category}
Content: ${content}

VOICEOVER:
${script}
${crossSegmentNote}
TASK: Split voiceover into phrases (3-5 sec each). For EACH phrase, choose ONE effect that is CONTEXTUALLY MEANINGFUL to what the phrase says. An effect must ILLUSTRATE the specific content — never be generic decoration.

CRITICAL RULE — CONTEXT OVER DECORATION:
❌ BAD: "rotating globe" (generic, doesn't relate to article)
✅ GOOD: "rotating globe highlighting Norway and Canada" (specific to the story's countries)

❌ BAD: "counter ticks from 0 to 87" (just a number without meaning)
✅ GOOD: "counter ticks from 0 to 87% labeled 'Markedsandel foldbare telefoner'" (labeled, contextual)

❌ BAD: "icons appear with stagger" (generic icons)
✅ GOOD: "icons appear with stagger: laptop for tech sector, medical cross for healthcare, palette for creative industries" (specific to article's industries)

❌ BAD: "circuit board traces" (generic tech feel)
✅ GOOD: "circuit board traces forming the shape of a drone" (specific to article about drones)

EFFECT MUST MATCH PHRASE MEANING — ask yourself: "If I remove the voiceover, can the viewer understand what this scene is about just from the visuals?" If NO — the effect is too generic.

VARIETY RULE: You have 19 effects. Use AT LEAST 3 DIFFERENT effects across your 4-6 phrases. NEVER use the same effect twice in a row.

AVAILABLE EFFECTS (use exact keywords in sceneDescription):

📸 PHOTO-NATIVE (preferred — use article photos creatively):
- "zoom into detail" + describe what area to focus on
- "photos side by side" + describe what each panel shows
- "photo collage" with specific photo descriptions
- "vertical scroll" for long/detailed images
- "grayscale to color" or "blur to sharp" for dramatic reveals
- "before after slider" for comparisons
- "scrolling photos" / "photo stream" for parallax-drifting columns — needs 3+ article photos, don't force it if fewer are available

📊 DATA (only when article has REAL numbers):
- "counter ticks from 0 to [NUMBER]" + meaningful label
- "dashboard with analytics panels" + specific metrics from article
- "split screen" with labeled left/right values from article

🎨 CONTEXTUAL GRAPHICS:
- "icons appear with stagger: [icon1], [icon2], [icon3]" — name specific icons relevant to story
- "timeline with milestones: [step1], [step2], [step3]" — name actual milestones from article
- "rotating globe highlighting [COUNTRY/REGION]" — name the actual places

🌊 ATMOSPHERE (use sparingly, max 1 per segment):
- "wave flow" for organic/fluid topics
- "circuit board traces" ONLY for actual tech/AI articles
- "matrix" / "digital rain" ONLY for actual cybersecurity/hacking/AI-code articles — not generic "tech"
- "alert pulse" ONLY for genuine breaking/urgent news
- "dissolves pixel-by-pixel" for transformation stories

PHRASE FIELDS:
- "text": exact phrase
- "sceneDescription": WHAT the viewer sees, tied to article content (2-3 sentences). Write like a film director's storyboard. This is flavor text for imageSearchQuery/renderHint context — it is NOT how sceneEffect gets picked (see below).
- "sceneEffect": pick EXPLICITLY from the 19 values below, or "none" if this phrase should just show the background photo + key-phrase callout with no overlay graphic. Do NOT rely on sceneDescription keywords to trigger an effect — say what you want directly:
  counterMosaic | splitScreen | mosaicGrid | iconStagger | pixelDissolve | circuitBoard | progressTimeline | alertPulse | globe3D | noiseWave | dataDashboard | matrixRain | photoScrollColumns | photoSplitScreen | photoZoomReveal | photoCollage | photoCompareSlider | photoVerticalScroll | photoFilterTransition | none
- "imageSearchQuery": Google Images search query to find the PERFECT background photo for THIS phrase. Be SPECIFIC to the content:
  ❌ BAD: "technology" (too generic)
  ✅ GOOD: "NTNU Trondheim university campus aerial view"
  ❌ BAD: "map" (too generic)
  ✅ GOOD: "Norway Canada trade route map arctic cooperation"
  ❌ BAD: "drone" (too generic)
  ✅ GOOD: "hydrogen powered delivery drone flying over city"
  Write the query as if YOU are searching Google Images to find a photo that PERFECTLY illustrates this specific sentence.
- "renderHint": Remotion implementation details
- "metaphor": visual category
- "textEffect": typewriter | fadeUp | blurReveal | springPop | splitScale | wordFade | slideIn | glitchIn (vary between phrases! glitchIn only for urgent/breaking moods)
- "graphicType": counter | keyFigure | comparison | barChart | bulletList | none
- "graphicData": ONLY real numbers from article with meaningful labels
- "icons": REQUIRED when sceneEffect is "iconStagger" — 3-5 names from this list ONLY, chosen for THIS article's subject:
  laptop | brain | chart | shield | globe | medical | factory | rocket | palette | dollar | target | lightning
  (a fish-farming story is factory+globe, a tax story is dollar+chart — never a generic laptop+chart+globe)
- "milestones": REQUIRED when sceneEffect is "progressTimeline" — 3-5 SHORT real steps from the article
  (e.g. ["2019: pilot", "2024: 12 fartøy", "2030: hele flåten"]) — never generic "Start/Progress/Goal"
- "backgroundEffect": kenBurns | zoomPulse | slowPan | colorShift | pushIn | parallaxDrift | pulseGlow (vary!)
- "triggerImageChange": true every other phrase

RULES:
- NO effect without specific context — every effect must illustrate the phrase's MEANING
- sceneEffect is an explicit choice, not a guess — pick "none" rather than force-fitting one of the 17 types to a phrase it doesn't truly match
- AN EFFECT WITHOUT ITS DATA IS DROPPED, not rendered empty. If you pick counterMosaic/dataDashboard/splitScreen
  you MUST supply graphicData; iconStagger needs "icons"; progressTimeline needs "milestones". No data → write "none".
- splitScreen means TWO REAL LABELLED VALUES from the article (before/after, us/them). Never pick it just to
  divide the screen — an empty Før/Nå panel is the single worst frame this show can produce.
- Adjacent phrases: different textEffect AND different backgroundEffect
- graphicData labels must be DESCRIPTIVE (not empty "", but "Daglige ChatGPT-søk" or "Markedsandel")
- Use 3+ DIFFERENT effect types per segment — don't repeat the same pattern
- CROSS-SEGMENT: for "transition" (see list below) and for textEffect/backgroundEffect choices in this segment, actively avoid repeating what's listed in CROSS-SEGMENT VARIETY above unless every other option has already been used somewhere in the video — spread the full palette across all ${totalSegs} segments, don't let the same 2-3 favorites dominate

Return JSON:
{
  "mood": "urgent|energetic|positive|analytical|serious|contemplative|lighthearted|cautionary",
  "transition": "fade|wipeLeft|wipeRight|slideUp|slideDown|zoomIn|zoomOut|filmBurn|glitchWipe",
  "textReveal": "default|typewriter|splitFade|splitScale",
  "statsVisualType": "list|counters|bars",
  "phrases": [
    {
      "text": "exact phrase",
      "sceneDescription": "detailed cinematic description...",
      "sceneEffect": "counterMosaic",
      "imageSearchQuery": "NTNU Trondheim campus aerial winter",
      "renderHint": "Remotion: interpolate(), spring()...",
      "metaphor": "data",
      "textEffect": "springPop",
      "graphicType": "counter",
      "graphicData": { "value": "3000000", "label": "Daglige ChatGPT-søk" },
      "icons": [],
      "milestones": [],
      "backgroundEffect": "zoomPulse",
      "triggerImageChange": false
    }
  ]
}`;

  try {
    const parsed = await callLLMJson(
      systemPrompt,
      'Generate the frame-by-frame visual breakdown for this segment.',
      { maxTokens: 4000, temperature: 0.7 },
    );
    return parsed;
  } catch (err) {
    console.error(`    ⚠️ AI Seg ${segIndex + 1} failed: ${err.message}`);
    return null;
  }
}

/**
 * AI Visual Director — per-segment calls with full article context.
 * Each segment gets its own AI call for detailed cinematic scenes.
 */
async function aiDirectVisuals(segmentScripts, segments, articles) {
  if (!process.env.NVIDIA_API_KEY && !process.env.ANTHROPIC_API_KEY) return null;

  const totalSegs = segmentScripts.length;
  const results = [];

  // Accumulates transition/textEffect/backgroundEffect choices across segments so each
  // subsequent call's CROSS-SEGMENT VARIETY note reflects what's actually been used so far.
  const tracker = { transitions: [], textEffects: [], backgroundEffects: [] };

  for (let i = 0; i < totalSegs; i++) {
    console.log(`  🎬 Directing segment ${i + 1}/${totalSegs}...`);
    const article = articles?.[i] || {};
    const result = await aiDirectSingleSegment(
      segmentScripts[i], article, segments[i], i, totalSegs, tracker,
    );
    results.push(result);

    if (result) {
      if (result.transition) tracker.transitions.push(result.transition);
      for (const phrase of result.phrases || []) {
        if (phrase.textEffect) tracker.textEffects.push(phrase.textEffect);
        if (phrase.backgroundEffect) tracker.backgroundEffects.push(phrase.backgroundEffect);
      }
    }
  }

  // Check if we got enough valid results (need at least 50%)
  const validCount = results.filter(Boolean).length;
  if (validCount === 0) return null;
  if (validCount < Math.ceil(totalSegs * 0.5)) {
    console.warn(`  ⚠️ Only ${validCount}/${totalSegs} segments got AI direction — falling back`);
    return null;
  }

  console.log(`  ✅ AI visual directives: ${validCount}/${totalSegs} segments`);
  return results;
}

// ═══════════════════════════════════════════════════════════════════
//  Fallback Visual Director (heuristic, no AI)
// ═══════════════════════════════════════════════════════════════════

/**
 * Select a limited effect palette for the entire video based on dominant category.
 * 2-3 effects per type — consistency like NowThis/Vox, not PowerPoint randomness.
 */
function selectVideoPalette(segments) {
  const catCounts = {};
  for (const seg of segments) {
    const cat = seg.category || 'news';
    catCounts[cat] = (catCounts[cat] || 0) + 1;
  }
  const dominantCat = Object.entries(catCounts)
    .sort(([, a], [, b]) => b - a)[0]?.[0] || 'news';

  const PALETTE_MAP = {
    tech:     { te: ['blurReveal', 'typewriter'],    bg: ['colorShift', 'zoomPulse'] },
    business: { te: ['fadeUp', 'splitScale'],         bg: ['kenBurns', 'slowPan'] },
    ai:       { te: ['blurReveal', 'springPop'],      bg: ['colorShift', 'zoomPulse'] },
    startup:  { te: ['springPop', 'fadeUp'],           bg: ['kenBurns', 'zoomPulse'] },
    science:  { te: ['typewriter', 'fadeUp'],          bg: ['slowPan', 'kenBurns'] },
    politics: { te: ['fadeUp', 'splitScale'],          bg: ['slowPan', 'kenBurns'] },
    crypto:   { te: ['springPop', 'blurReveal'],       bg: ['zoomPulse', 'colorShift'] },
    health:   { te: ['fadeUp', 'blurReveal'],          bg: ['kenBurns', 'slowPan'] },
    news:     { te: ['fadeUp', 'springPop'],           bg: ['kenBurns', 'slowPan'] },
  };

  const palette = PALETTE_MAP[dominantCat] || PALETTE_MAP.news;
  console.log(`  🎨 Video palette: ${dominantCat} → text:[${palette.te}] bg:[${palette.bg}]`);
  return palette;
}

function fallbackDirectVisuals(segmentScripts, segments, segmentVoiceovers) {
  const segTracker = new VarietyTracker();
  const result = [];
  const totalSegs = segmentScripts.length;

  // Select a limited palette for the entire video (2-3 effects, not 5+)
  const palette = selectVideoPalette(segments);

  for (let i = 0; i < totalSegs; i++) {
    const script = segmentScripts[i] || '';
    const seg = segments[i] || {};
    const subs = segmentVoiceovers[i]?.subtitles || [];
    const segDur = seg.durationSeconds || Number(segmentVoiceovers[i]?.durationSeconds) || 15;

    // ── Rhythm system: phrase duration adapts to position in show ──
    const positionRatio = totalSegs > 1 ? i / (totalSegs - 1) : 0;
    const rhythmTarget = 3.5 - positionRatio * 1.5; // 3.5s → 2.0s

    // 1. Split into phrases (rhythm-adjusted target duration)
    const phrases = splitIntoPhrases(script, subs, rhythmTarget);

    // 2. Classify each phrase + extract data
    const blockTracker = new VarietyTracker();
    const visualBlocks = phrases.map((phrase, j) => {
      const cls = classifyPhrase(phrase.text);
      const dataPoints = extractDataPoints(phrase.text);

      // Pick from video-wide palette (consistent across all segments)
      const textEffect = blockTracker.pick('te', palette.te);
      const backgroundEffect = blockTracker.pick('bg', palette.bg);

      // Resolve graphic data from actual extracted numbers
      let graphicType = cls.graphicType;
      let graphicData = null;

      // Series (several comparable numbers) outranks a single figure — it's a real chart
      const series = extractSeries(phrase.text);

      // A phrase carrying real data deserves a chart even when the keyword
      // classifier saw no data cue — the numbers ARE the cue. (Before this,
      // graphics only appeared when both the keyword and the number matched,
      // which is why whole digests rendered without a single chart.)
      const hasStrongData =
        series ||
        dataPoints.some(p =>
          p.type === 'comparison' || p.type === 'delta' || p.type === 'percentage',
        );
      if (graphicType === 'none' && hasStrongData) {
        graphicType = 'keyFigure';
      }

      if (graphicType !== 'none' && series) {
        graphicType = 'barChart';
        graphicData = { items: series, label: '' };
      } else if (graphicType !== 'none' && dataPoints.length > 0) {
        // Prefer the richest form available in this phrase
        const dp =
          dataPoints.find(p => p.type === 'comparison') ||
          dataPoints.find(p => p.type === 'delta') ||
          dataPoints[0];

        if (dp.type === 'comparison') {
          graphicType = 'comparison';
          const u = (dp.unit === '%' || dp.unit === 'prosent') ? '%' : '';
          graphicData = {
            left:  { label: 'Før', value: dp.from + u },
            right: { label: 'Nå',  value: dp.to + u },
          };
        } else if (dp.type === 'delta') {
          graphicType = 'keyFigure';
          graphicData = {
            value: dp.value,
            label: dp.changePct >= 0 ? 'Økning' : 'Nedgang',
            changePct: dp.changePct,
          };
        } else if (dp.type === 'percentage') {
          graphicType = 'counter';
          graphicData = { value: dp.value + '%', label: '' };
        } else if (dp.type === 'money' || dp.type === 'count') {
          graphicType = 'keyFigure';
          graphicData = { value: dp.value, label: '' };
        }
      } else if (graphicType !== 'none' && dataPoints.length === 0) {
        // Keyword matched but no actual numbers — skip empty infographic
        graphicType = 'none';
      }

      return {
        phraseText: phrase.text,
        startTime: phrase.startTime,
        endTime: phrase.endTime,
        duration: phrase.duration,
        visualMetaphor: cls.metaphor,
        textEffect,
        graphicType,
        graphicData,
        backgroundEffect,
        triggerImageChange: j > 0 && j % 2 === 0,
      };
    });

    // 2b. Cap graphics per segment so charts stay an accent, not wallpaper.
    // Keep the richest forms and never two in a row.
    const GRAPHIC_RANK = { barChart: 4, comparison: 3, keyFigure: 2, counter: 1 };
    const MAX_GRAPHICS_PER_SEGMENT = 3;
    const graphicIdx = visualBlocks
      .map((b, j) => ({ j, rank: GRAPHIC_RANK[b.graphicType] || 0 }))
      .filter(x => x.rank > 0)
      .sort((a, b) => b.rank - a.rank || a.j - b.j);

    const keep = new Set();
    for (const cand of graphicIdx) {
      if (keep.size >= MAX_GRAPHICS_PER_SEGMENT) break;
      if (keep.has(cand.j - 1) || keep.has(cand.j + 1)) continue;
      keep.add(cand.j);
    }
    for (let j = 0; j < visualBlocks.length; j++) {
      if (visualBlocks[j].graphicType !== 'none' && !keep.has(j)) {
        visualBlocks[j].graphicType = 'none';
        visualBlocks[j].graphicData = null;
      }
    }
    const graphicCount = keep.size;
    if (graphicCount > 0) {
      console.log(`    📊 Seg ${i + 1}: ${graphicCount} data graphics (${[...keep].map(j => visualBlocks[j].graphicType).join(', ')})`);
    }

    // 3. Segment-level directives (variety across segments)
    const cat = seg.category || 'news';
    const moodOpts = CATEGORY_MOOD_MAP[cat] || MOODS.slice(0, 4);
    const transOpts = CATEGORY_TRANSITION_MAP[cat] || TRANSITIONS.slice(0, 4);

    const mood = segTracker.pick('mood', moodOpts, seg.mood);
    const transition = segTracker.pick('transition', transOpts, seg.transition);
    const textReveal = segTracker.pick('textReveal', HEADLINE_REVEALS);
    const statsVisualType = segTracker.pick('statsViz', STATS_VISUAL_TYPES);

    // 4. Extract facts for StatsScene
    const allDp = phrases.flatMap(p => extractDataPoints(p.text));
    const facts = allDp
      .filter(dp => dp.type === 'percentage' || dp.type === 'money')
      .slice(0, 3)
      .map(dp => ({
        value: dp.type === 'percentage' ? dp.value + '%' : dp.value,
        label: dp.raw,
      }));

    // 5. Build dataOverlays from blocks with data
    const dataOverlays = [];
    for (let j = 0; j < visualBlocks.length; j++) {
      const blk = visualBlocks[j];
      if (blk.graphicType === 'none' || !blk.graphicData) continue;

      const showAt = Math.max(0, blk.startTime / segDur - 0.02);
      const hideAt = Math.min(1, blk.endTime / segDur + 0.02);
      const position = dataOverlays.length % 2 === 0 ? 'right' : 'left';

      const overlayType = blk.graphicType === 'counter' ? 'keyFigure' : blk.graphicType;
      dataOverlays.push({
        type: overlayType,
        showAt, hideAt, position,
        data: blk.graphicData,
      });
    }

    // 6. Faster image cycling: adapt to number of visual blocks
    const imageCycleDuration = Math.max(2, Math.min(4,
      Math.round(segDur / Math.max(visualBlocks.length, 3)),
    ));

    result.push({
      mood,
      transition,
      textReveal,
      statsVisualType,
      facts: facts.length > 0 ? facts : undefined,
      dataOverlays,
      imageCycleDuration,
      visualBlocks,
    });
  }

  return result;
}

// ═══════════════════════════════════════════════════════════════════
//  Post-processing: guarantee cross-segment & intra-block variety
// ═══════════════════════════════════════════════════════════════════

function ensureVariety(directives) {
  // Cross-segment variety
  for (let i = 1; i < directives.length; i++) {
    const prev = directives[i - 1];
    const curr = directives[i];

    if (curr.transition === prev.transition) {
      const pool = TRANSITIONS.filter(t => t !== prev.transition);
      curr.transition = pool[Math.floor(Math.random() * pool.length)];
    }
    if (curr.mood === prev.mood) {
      const pool = MOODS.filter(m => m !== prev.mood);
      curr.mood = pool[Math.floor(Math.random() * pool.length)];
    }
    if (curr.textReveal === prev.textReveal) {
      const pool = HEADLINE_REVEALS.filter(r => r !== prev.textReveal);
      curr.textReveal = pool[Math.floor(Math.random() * pool.length)];
    }
    if (curr.statsVisualType === prev.statsVisualType) {
      const pool = STATS_VISUAL_TYPES.filter(s => s !== prev.statsVisualType);
      curr.statsVisualType = pool[Math.floor(Math.random() * pool.length)];
    }
  }

  // Intra-block variety (adjacent blocks within each segment)
  for (const dir of directives) {
    if (!dir.visualBlocks) continue;
    for (let j = 1; j < dir.visualBlocks.length; j++) {
      const prev = dir.visualBlocks[j - 1];
      const curr = dir.visualBlocks[j];

      if (curr.textEffect === prev.textEffect) {
        const pool = TEXT_EFFECTS.filter(e => e !== prev.textEffect);
        curr.textEffect = pool[Math.floor(Math.random() * pool.length)];
      }
      if (curr.backgroundEffect === prev.backgroundEffect) {
        const pool = BACKGROUND_EFFECTS.filter(e => e !== prev.backgroundEffect);
        curr.backgroundEffect = pool[Math.floor(Math.random() * pool.length)];
      }
    }
  }

  return directives;
}

// ═══════════════════════════════════════════════════════════════════
//  Merge AI phrases with subtitle timestamps
// ═══════════════════════════════════════════════════════════════════

// Effect types the renderer accepts. Anything else (including "none") means no effect.
const VALID_SCENE_EFFECTS = new Set([
  'counterMosaic', 'splitScreen', 'mosaicGrid', 'iconStagger', 'pixelDissolve',
  'circuitBoard', 'progressTimeline', 'alertPulse', 'globe3D', 'noiseWave',
  'dataDashboard', 'matrixRain', 'photoScrollColumns', 'photoSplitScreen',
  'photoZoomReveal', 'photoCollage', 'photoCompareSlider', 'photoVerticalScroll',
  'photoFilterTransition',
]);

const VALID_ICONS = new Set([
  'laptop', 'brain', 'chart', 'shield', 'globe', 'medical', 'factory',
  'rocket', 'palette', 'dollar', 'target', 'lightning',
]);

/**
 * Gate an effect on the data it needs to say anything.
 *
 * A data effect with no data does not degrade gracefully: it dims the photo to
 * 30% and draws an empty shell — the "blurred screen showing only Før/Nå" the
 * owner flagged. Dropping it here (rather than in the renderer alone) also lets
 * b-roll reclaim the block, since b-roll skips effect blocks.
 *
 * Returns the effect name to keep, or 'none'.
 */
function gateSceneEffect(block) {
  const effect = block.sceneEffect;
  if (!effect || !VALID_SCENE_EFFECTS.has(effect)) return 'none';

  const data = block.graphicData || {};

  switch (effect) {
    case 'splitScreen': {
      const l = data.left, r = data.right;
      const filled = v => v && String(v.value ?? '').trim().length > 0;
      return filled(l) && filled(r) ? effect : 'none';
    }
    case 'counterMosaic': {
      const n = parseFloat(String(data.value ?? '').replace(/[^0-9.,]/g, '').replace(',', '.'));
      return isFinite(n) && n !== 0 ? effect : 'none';
    }
    case 'dataDashboard': {
      const hasItems = Array.isArray(data.items) && data.items.length > 0;
      const hasValue = String(data.value ?? '').trim().length > 0;
      return hasItems || hasValue ? effect : 'none';
    }
    case 'iconStagger':
      return Array.isArray(block.icons) && block.icons.length >= 2 ? effect : 'none';
    case 'progressTimeline':
      return Array.isArray(block.milestones) && block.milestones.length >= 2 ? effect : 'none';
    case 'photoCompareSlider':
      // Asserts a before/after — only honest with real comparison data
      return block.graphicType === 'comparison' && data.left && data.right ? effect : 'none';
    default:
      // Atmospheric effects (globe3D, noiseWave, circuitBoard, …) need no data
      return effect;
  }
}

// Effects that carry article content vs. effects that are pure atmosphere.
// Atmosphere passes the data gate for free, so it needs its own budget —
// otherwise it would crowd out the live b-roll (b-roll skips effect blocks).
const CONTENT_EFFECTS = new Set([
  'splitScreen', 'counterMosaic', 'dataDashboard', 'iconStagger', 'progressTimeline',
  'photoCompareSlider', 'photoSplitScreen', 'photoZoomReveal', 'photoCollage',
  'photoVerticalScroll', 'photoFilterTransition', 'photoScrollColumns',
]);

/**
 * Keep at most `max` effects per segment, content-bearing ones first,
 * never two in a row. Mutates blocks, returns the surviving effect names.
 */
function capSceneEffects(visualBlocks, max = 3) {
  const ranked = visualBlocks
    .map((b, j) => ({ j, effect: b.sceneEffect }))
    .filter(x => x.effect && x.effect !== 'none')
    .sort((a, b) => {
      const rank = e => (CONTENT_EFFECTS.has(e) ? 1 : 0);
      return rank(b.effect) - rank(a.effect) || a.j - b.j;
    });

  const keep = new Set();
  for (const cand of ranked) {
    if (keep.size >= max) break;
    if (keep.has(cand.j - 1) || keep.has(cand.j + 1)) continue;
    keep.add(cand.j);
  }
  for (let j = 0; j < visualBlocks.length; j++) {
    if (!keep.has(j)) visualBlocks[j].sceneEffect = 'none';
  }
  return [...keep].sort((a, b) => a - b).map(j => visualBlocks[j].sceneEffect);
}

/**
 * Derive a data graphic straight from a phrase's own numbers.
 * Used as the floor for BOTH paths: the LLM almost never fills graphicData,
 * so without this the digest renders with no charts at all.
 * Returns null when the phrase carries no chartable data.
 */
function deriveGraphicFromText(text) {
  const series = extractSeries(text);
  if (series) return { graphicType: 'barChart', graphicData: { items: series, label: '' } };

  const dps = extractDataPoints(text);
  const dp =
    dps.find(p => p.type === 'comparison') ||
    dps.find(p => p.type === 'delta') ||
    dps.find(p => p.type === 'percentage') ||
    dps.find(p => p.type === 'money' || p.type === 'count');
  if (!dp) return null;

  if (dp.type === 'comparison') {
    const u = (dp.unit === '%' || dp.unit === 'prosent') ? '%' : '';
    return {
      graphicType: 'comparison',
      graphicData: {
        left:  { label: 'Før', value: dp.from + u },
        right: { label: 'Nå',  value: dp.to + u },
      },
    };
  }
  if (dp.type === 'delta') {
    return {
      graphicType: 'keyFigure',
      graphicData: {
        value: dp.value,
        label: dp.changePct >= 0 ? 'Økning' : 'Nedgang',
        changePct: dp.changePct,
      },
    };
  }
  if (dp.type === 'percentage') {
    return { graphicType: 'counter', graphicData: { value: dp.value + '%', label: '' } };
  }
  return { graphicType: 'keyFigure', graphicData: { value: dp.value, label: '' } };
}

/**
 * Keep at most MAX graphics per segment, richest first, never two adjacent.
 * Charts should punctuate the segment, not wallpaper it.
 */
function capGraphics(visualBlocks, max = 3) {
  const RANK = { barChart: 4, comparison: 3, keyFigure: 2, counter: 1 };
  const ranked = visualBlocks
    .map((b, j) => ({ j, rank: RANK[b.graphicType] || 0 }))
    .filter(x => x.rank > 0 && visualBlocks[x.j].graphicData)
    .sort((a, b) => b.rank - a.rank || a.j - b.j);

  const keep = new Set();
  for (const cand of ranked) {
    if (keep.size >= max) break;
    if (keep.has(cand.j - 1) || keep.has(cand.j + 1)) continue;
    keep.add(cand.j);
  }
  for (let j = 0; j < visualBlocks.length; j++) {
    if (visualBlocks[j].graphicType !== 'none' && !keep.has(j)) {
      visualBlocks[j].graphicType = 'none';
      visualBlocks[j].graphicData = null;
    }
  }
  return [...keep].map(j => visualBlocks[j].graphicType);
}

/**
 * AI returns phrases without precise timestamps.
 * We align them with subtitle-based phrase boundaries.
 */
function mergeAIWithTimestamps(aiDirective, scriptText, subtitles) {
  const timedPhrases = splitIntoPhrases(scriptText, subtitles);
  const aiPhrases = aiDirective.phrases || [];

  const visualBlocks = timedPhrases.map((tp, j) => {
    // Pick the closest AI phrase (by index, since order should match)
    const ap = aiPhrases[j] || aiPhrases[aiPhrases.length - 1] || {};

    // The LLM rarely fills graphicData — fall back to the phrase's own numbers
    let graphicType = ap.graphicType || 'none';
    let graphicData = ap.graphicData || null;
    if (graphicType === 'none' || !graphicData) {
      const derived = deriveGraphicFromText(tp.text);
      if (derived) {
        graphicType = derived.graphicType;
        graphicData = derived.graphicData;
      } else {
        graphicType = 'none';
        graphicData = null;
      }
    }

    // Structured content for symbol effects — taken from the model's explicit
    // fields, not scraped out of its English storyboard prose.
    const icons = Array.isArray(ap.icons)
      ? ap.icons.map(s => String(s).toLowerCase().trim()).filter(s => VALID_ICONS.has(s)).slice(0, 6)
      : [];
    const milestones = Array.isArray(ap.milestones)
      ? ap.milestones.map(s => String(s).trim()).filter(Boolean).slice(0, 5)
      : [];

    const block = {
      phraseText: tp.text,
      startTime: tp.startTime,
      endTime: tp.endTime,
      duration: tp.duration,
      sceneDescription: ap.sceneDescription || '',
      imageSearchQuery: ap.imageSearchQuery || '',
      renderHint: ap.renderHint || '',
      visualMetaphor: ap.metaphor || 'narrative',
      textEffect: ap.textEffect || 'fadeUp',
      // The model's explicit choice is now honoured; keyword-guessing the
      // storyboard prose was picking effects off words like "grid" and "wave".
      sceneEffect: ap.sceneEffect,
      icons,
      milestones,
      graphicType,
      graphicData,
      backgroundEffect: ap.backgroundEffect || 'kenBurns',
      triggerImageChange: ap.triggerImageChange ?? (j > 0 && j % 2 === 0),
    };

    block.sceneEffect = gateSceneEffect(block);
    return block;
  });

  const kept = capGraphics(visualBlocks);
  if (kept.length > 0) {
    console.log(`    📊 ${kept.length} data graphics: ${kept.join(', ')}`);
  }

  const asked = aiPhrases.filter(p => p.sceneEffect && p.sceneEffect !== 'none').length;
  const gated = visualBlocks.filter(b => b.sceneEffect !== 'none').length;
  const liveEffects = capSceneEffects(visualBlocks);
  console.log(
    `    🎭 scene effects: ${asked} requested → ${gated} had data → ${liveEffects.length} kept` +
    (liveEffects.length ? ` (${liveEffects.join(', ')})` : ''),
  );

  return visualBlocks;
}

/**
 * Build dataOverlays from visual blocks.
 */
function buildOverlaysFromBlocks(visualBlocks, segDuration) {
  const overlays = [];
  for (const blk of visualBlocks) {
    if (blk.graphicType === 'none' || !blk.graphicData) continue;

    const showAt = Math.max(0, blk.startTime / segDuration - 0.02);
    const hideAt = Math.min(1, blk.endTime / segDuration + 0.02);
    const position = overlays.length % 2 === 0 ? 'right' : 'left';
    const overlayType = blk.graphicType === 'counter' ? 'keyFigure' : blk.graphicType;

    overlays.push({ type: overlayType, showAt, hideAt, position, data: blk.graphicData });
  }
  return overlays;
}

// ═══════════════════════════════════════════════════════════════════
//  Main Export
// ═══════════════════════════════════════════════════════════════════

/**
 * Generate visual directives for all segments of a DailyNewsShow.
 *
 * @param {string[]}  segmentScripts     Voiceover script per segment
 * @param {object[]}  segments           Segment metadata from AI director
 * @param {object[]}  segmentVoiceovers  TTS output per segment
 * @param {object[]}  articles           Full article objects (for per-segment AI context)
 * @param {object[]|null} precomputedDirectives  Pre-merge, per-segment directives (mood/transition/
 *   textReveal/statsVisualType/phrases[], no timestamps) generated ahead of render time by the Nano
 *   agent via its own Claude subscription. When present, skips aiDirectVisuals() (NVIDIA/Claude API)
 *   entirely but still runs through the same timestamp-merge/fallback/variety pipeline below.
 * @returns {Promise<object[]>}          Visual directives per segment
 */
export async function directVisuals(segmentScripts, segments, segmentVoiceovers, articles = [], precomputedDirectives = null) {
  console.log(`\n🎨 Visual Director: planning ${segmentScripts.length} segments...`);

  // Prefer Nano-generated directives (own Claude subscription) over the live AI API chain
  let directives;
  if (precomputedDirectives && precomputedDirectives.length > 0) {
    console.log(`  🧠 Using ${precomputedDirectives.length} Nano-generated segment directives`);
    directives = precomputedDirectives;
  } else {
    directives = await aiDirectVisuals(segmentScripts, segments, articles);
  }

  if (directives && directives.length > 0) {
    // Merge per-segment AI results with subtitle timestamps
    // Some segments may have null (AI failed) — use fallback for those
    const fallback = fallbackDirectVisuals(segmentScripts, segments, segmentVoiceovers);

    for (let i = 0; i < segmentScripts.length; i++) {
      if (!directives[i]) {
        // AI failed for this segment — use heuristic fallback
        directives[i] = fallback[i] || {};
        continue;
      }

      const subs = segmentVoiceovers[i]?.subtitles || [];
      const segDur = segments[i]?.durationSeconds ||
        Number(segmentVoiceovers[i]?.durationSeconds) || 15;

      directives[i].visualBlocks = mergeAIWithTimestamps(
        directives[i], segmentScripts[i], subs,
      );
      delete directives[i].phrases;

      if (!directives[i].dataOverlays || directives[i].dataOverlays.length === 0) {
        directives[i].dataOverlays = buildOverlaysFromBlocks(
          directives[i].visualBlocks, segDur,
        );
      }

      directives[i].mood ??= 'positive';
      directives[i].transition ??= 'fade';
      directives[i].textReveal ??= 'default';
      directives[i].statsVisualType ??= 'list';

      const blockCount = directives[i].visualBlocks.length;
      directives[i].imageCycleDuration = Math.max(2, Math.min(4,
        Math.round(segDur / Math.max(blockCount, 3)),
      ));
    }
  } else {
    console.log('  📋 Using fallback visual director');
    directives = fallbackDirectVisuals(segmentScripts, segments, segmentVoiceovers);
  }

  // Post-process for guaranteed variety
  directives = ensureVariety(directives);

  // Summary
  for (let i = 0; i < directives.length; i++) {
    const d = directives[i];
    const blocks = d.visualBlocks ? d.visualBlocks.length : 0;
    const overlays = d.dataOverlays ? d.dataOverlays.length : 0;
    const metaphors = d.visualBlocks
      ? [...new Set(d.visualBlocks.map(b => b.visualMetaphor))].join(',')
      : '-';
    console.log(
      `  📊 Seg ${i + 1}: ${blocks} blocks, ${overlays} overlays ` +
      `| ${d.mood} | ${d.transition} | ${d.textReveal} | [${metaphors}]`,
    );
  }

  return directives;
}

// Also export internals for testing
export {
  splitIntoPhrases,
  classifyPhrase,
  extractDataPoints,
  VarietyTracker,
  ensureVariety,
  MOODS,
  TRANSITIONS,
  TEXT_EFFECTS,
  HEADLINE_REVEALS,
  STATS_VISUAL_TYPES,
  BACKGROUND_EFFECTS,
};
