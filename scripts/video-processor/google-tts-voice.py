#!/usr/bin/env python3
"""Neural TTS with word timings, from Google Cloud Text-to-Speech.

Why this exists (2026-10-12): Microsoft's free Edge endpoint, which the digest
used since 2026-09-05, started answering every client with a 403 handshake on
~10.10.2026 (rany2/edge-tts#490, no fix). Google Cloud TTS replaces it.

OWNER RULE: free tier only. WaveNet (4M chars/month free) or Neural2 (1M free)
voices — never Chirp 3 HD (its free quota is spent by other projects) and
never Gemini TTS. The default nb-NO-Wavenet-G is a WaveNet voice.

Word timings: the text is sent as SSML with a <mark/> before every word and
v1beta1 `enableTimePointing: SSML_MARK` returns the time each mark is reached,
so the caption timings stay measured, not guessed. A word ends where the next
one starts; the last one ends with its chunk's audio.

Long scripts are split on sentence ends into chunks under the 5000-byte request
limit; each chunk comes back as LINEAR16, the PCM is joined and encoded once,
so chunk offsets are exact sample counts.

Usage:  google-tts-voice.py <voice> <mp3-out> <json-out>   # text on stdin
Env:    GOOGLE_TTS_KEY (required), GOOGLE_TTS_RATE (speakingRate, default 1.0)
"""
import base64, json, os, re, subprocess, sys, tempfile, time, urllib.request
from xml.sax.saxutils import escape

API = "https://texttospeech.googleapis.com/v1beta1/text:synthesize"
RATE_HZ = 24000
MAX_SSML_BYTES = 4500
RETRIES = 4


def call(ssml, voice, rate):
    key = os.environ.get("GOOGLE_TTS_KEY")
    if not key:
        raise SystemExit("GOOGLE_TTS_KEY is not set")
    body = json.dumps({
        "input": {"ssml": ssml},
        "voice": {"languageCode": "-".join(voice.split("-")[:2]), "name": voice},
        "audioConfig": {"audioEncoding": "LINEAR16", "sampleRateHertz": RATE_HZ,
                        "speakingRate": rate},
        "enableTimePointing": ["SSML_MARK"],
    }).encode()
    last = None
    for attempt in range(RETRIES):
        try:
            req = urllib.request.Request(f"{API}?key={key}", data=body,
                                         headers={"Content-Type": "application/json"})
            with urllib.request.urlopen(req, timeout=120) as r:
                return json.load(r)
        except urllib.error.HTTPError as exc:
            last = f"HTTP {exc.code}: {exc.read()[:300]!r}"
            if exc.code < 500 and exc.code != 429:
                break
        except Exception as exc:  # noqa: BLE001 — network hiccup is a retry
            last = repr(exc)
        time.sleep(3 * (attempt + 1))
    raise RuntimeError(f"Google TTS failed: {last}")


def chunks(words):
    """Group words into SSML documents under the request size limit, breaking
    after a sentence end when possible."""
    out, cur, size = [], [], 0
    for w in words:
        piece = len(f'<mark name="{len(cur)}"/>{escape(w)} '.encode())
        if cur and size + piece > MAX_SSML_BYTES:
            # move back to the last sentence end inside the chunk
            cut = max((i + 1 for i, x in enumerate(cur) if re.search(r"[.!?…:]$", x)), default=len(cur))
            out.append(cur[:cut]); cur = cur[cut:]
            size = sum(len(f'<mark name="{i}"/>{escape(x)} '.encode()) for i, x in enumerate(cur))
        cur.append(w); size += piece
    if cur:
        out.append(cur)
    return out


def pcm_of(wav_bytes):
    # LINEAR16 responses carry a RIFF header; the data chunk follows "data"+size
    i = wav_bytes.find(b"data")
    return wav_bytes[i + 8:] if wav_bytes[:4] == b"RIFF" and i >= 0 else wav_bytes


def main():
    voice, mp3_path, json_path = sys.argv[1], sys.argv[2], sys.argv[3]
    rate = float(os.environ.get("GOOGLE_TTS_RATE") or 1.0)
    text = sys.stdin.read().strip()
    if not text:
        raise SystemExit("no text on stdin")

    words_in = text.split()
    pcm = bytearray()
    words = []
    for group in chunks(words_in):
        ssml = "<speak>" + " ".join(
            f'<mark name="{i}"/>{escape(w)}' for i, w in enumerate(group)) + "</speak>"
        resp = call(ssml, voice, rate)
        audio = pcm_of(base64.b64decode(resp["audioContent"]))
        offset = len(pcm) / 2 / RATE_HZ
        chunk_len = len(audio) / 2 / RATE_HZ
        marks = {int(t["markName"]): float(t.get("timeSeconds", 0)) for t in resp.get("timepoints", [])}
        starts = [marks.get(i) for i in range(len(group))]
        # fill any missing mark by interpolation from its neighbours
        for i in range(len(starts)):
            if starts[i] is None:
                prev = starts[i - 1] if i else 0.0
                starts[i] = prev
        for i, w in enumerate(group):
            s = starts[i]
            e = starts[i + 1] if i + 1 < len(group) else max(s + 0.2, chunk_len - 0.15)
            words.append({"text": w, "startTime": round(offset + s, 3),
                          "endTime": round(offset + max(e, s), 3)})
        pcm.extend(audio)

    with tempfile.NamedTemporaryFile(suffix=".pcm", delete=False) as f:
        f.write(pcm)
        raw = f.name
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "s16le", "-ar", str(RATE_HZ), "-ac", "1",
                    "-i", raw, "-c:a", "libmp3lame", "-q:a", "2", mp3_path], check=True)
    os.unlink(raw)
    duration = round(len(pcm) / 2 / RATE_HZ, 3)

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump({"voice": voice, "durationSeconds": duration, "words": words},
                  f, ensure_ascii=False)
    print(json.dumps({"voice": voice, "words": len(words),
                      "durationSeconds": duration, "audio": mp3_path}))


main()
