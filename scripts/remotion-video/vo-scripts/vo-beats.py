#!/usr/bin/env python3
"""Voice-first build for any feature clip (generalised from p15-beats.py).

Usage:  python3 vo-beats.py <beats.json> [--fit <vo-id.json>]

beats.json = {"id": "p18", "voice": "en-US-AndrewNeural",
              "beats": [["b1", "text"], ["b2", "text"], ...]}

Generates one track per beat, measures it, then assembles the full track with
0.5 s lead, 0.3 s gaps, 1.5 s tail, and prints the frame windows (fps=30) to
paste into the Remotion composition and Root.tsx.

Voice (2026-10-12): Google Cloud Text-to-Speech, free tier only (owner rule:
WaveNet/Neural2, never Chirp 3 HD or Gemini TTS). Microsoft's Edge endpoint,
used until then, answers every client with a 403 since ~10.10.2026
(rany2/edge-tts#490). The voice is FEATURE_TTS_VOICE (default en-US-Neural2-J);
a beats file whose "voice" is an old Edge name ("…Neural") gets that default,
an explicit Google name in the beats file wins. Env GOOGLE_TTS_KEY is required.
Google is deterministic: the same text gives the same audio every run.

--fit: every clip drawn before the switch was timed against the Edge voice.
Given its committed measurement, each beat is re-spoken at a speakingRate that
lands it on the committed beat length, then trimmed/padded to exactly that
length — so the old picture, Root.tsx and the drift check all still hold.

Assembly is adelay+amix, never `concat -c copy`: mp3 frames are 26 ms and a
concat build measured 1.2 s short over five beats, which walks the picture off
the words by the last beat.
"""
import base64, json, os, subprocess, sys, time, urllib.error, urllib.request

FPS = 30
LEAD = 0.5
GAP = 0.3
TAIL = 1.5
RATE_HZ = 24000
DEFAULT_VOICE = os.environ.get("FEATURE_TTS_VOICE") or "en-US-Neural2-J"
API = "https://texttospeech.googleapis.com/v1/text:synthesize"
# Where the per-beat audio and the assembled track are written. Defaults to the
# VPS layout; GitHub Actions sets VO_OUT_ROOT to a workspace directory.
ROOT = os.environ.get("VO_OUT_ROOT", "/root/feature-demos")


def dur(path):
    r = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", path],
        capture_output=True, text=True, check=True)
    return float(r.stdout.strip())


def pick_voice(cfg_voice):
    if cfg_voice and not cfg_voice.endswith("Neural"):
        return cfg_voice
    return DEFAULT_VOICE


def synth(text, voice, wav_path, rate=1.0):
    """One beat to a WAV file. Retries transient failures; returns seconds."""
    key = os.environ.get("GOOGLE_TTS_KEY")
    if not key:
        raise SystemExit("GOOGLE_TTS_KEY is not set")
    body = json.dumps({
        "input": {"text": text},
        "voice": {"languageCode": "-".join(voice.split("-")[:2]), "name": voice},
        "audioConfig": {"audioEncoding": "LINEAR16", "sampleRateHertz": RATE_HZ,
                        "speakingRate": round(rate, 4)},
    }).encode()
    last = None
    for attempt in range(5):
        try:
            req = urllib.request.Request(f"{API}?key={key}", data=body,
                                         headers={"Content-Type": "application/json"})
            with urllib.request.urlopen(req, timeout=60) as r:
                audio = base64.b64decode(json.load(r)["audioContent"])
            with open(wav_path, "wb") as f:
                f.write(audio)
            return dur(wav_path)
        except urllib.error.HTTPError as exc:
            last = f"HTTP {exc.code}: {exc.read()[:300]!r}"
            if exc.code < 500 and exc.code != 429:
                break
        except Exception as exc:  # noqa: BLE001
            last = repr(exc)
        time.sleep(3 * (attempt + 1))
    raise RuntimeError(f"Google TTS failed for {wav_path}: {last}")


def fit(raw, target, out):
    """Trim/pad (speeding up only if still too long) to exactly `target` s."""
    have = dur(raw)
    chain = []
    ratio = have / target
    while ratio > 1.0005:
        step = min(ratio, 2.0)
        chain.append(f"atempo={step:.5f}")
        ratio /= step
    chain += ["apad", f"atrim=0:{target:.3f}"]
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", raw, "-af", ",".join(chain),
                    "-ar", str(RATE_HZ), out], check=True)


def main():
    args = sys.argv[1:]
    want = None
    if "--fit" in args:
        i = args.index("--fit")
        want = json.load(open(args[i + 1]))
        del args[i:i + 2]
    cfg = json.load(open(args[0]))
    fid = cfg["id"]
    voice = pick_voice(cfg.get("voice"))
    beats = [(b[0], b[1]) for b in cfg["beats"]]
    out = os.path.join(ROOT, f"vo-{fid}")
    os.makedirs(out, exist_ok=True)

    targets = {}
    if want:
        targets = {b["beat"]: round(b["end_s"] - b["start_s"], 3) for b in want["timeline"]}

    durations, rates = {}, {}
    for name, text in beats:
        wav = os.path.join(out, f"{name}.wav")
        d = synth(text, voice, wav)
        target = targets.get(name)
        if target:
            # Speak at the rate that lands on the committed length, within a
            # range that still sounds natural; fit() takes up the remainder.
            rate = max(0.8, min(1.3, d / target))
            raw = os.path.join(out, f"{name}.raw.wav")
            if abs(rate - 1.0) > 0.01:
                synth(text, voice, raw, rate)
            else:
                os.replace(wav, raw)
            fit(raw, target, wav)
            rates[name] = round(rate, 3)
        durations[name] = round(target or dur(wav), 3)

    timeline, t = [], LEAD
    inputs, filters, labels = [], [], []
    for i, (name, text) in enumerate(beats):
        start = t
        inputs += ["-i", os.path.join(out, f"{name}.wav")]
        ms = int(round(start * 1000))
        filters.append(f"[{i}:a]adelay={ms}|{ms}[a{i}]")
        labels.append(f"[a{i}]")
        t += durations[name]
        timeline.append({
            "beat": name, "text": text,
            "start_s": round(start, 3), "end_s": round(t, 3),
            "start_f": int(round(start * FPS)), "end_f": int(round(t * FPS)),
        })
        if i < len(beats) - 1:
            t += GAP
    t += TAIL

    full = os.path.join(out, f"vo-{fid}.mp3")
    fc = ";".join(filters) + ";" + "".join(labels) + f"amix=inputs={len(beats)}:normalize=0[out]"
    subprocess.run(["ffmpeg", "-y", "-v", "error", *inputs, "-filter_complex", fc,
                    "-map", "[out]", "-t", f"{t:.3f}", "-c:a", "libmp3lame", "-q:a", "2",
                    full], check=True)

    total = round(t, 3)
    result = {
        "id": fid,
        "voice": voice,
        "beat_durations": durations,
        "timeline": timeline,
        "total_s": total,
        "durationInFrames": int(round(total * FPS)),
        "measured_track_s": round(dur(full), 3),
        "track": full,
    }
    if want:
        result["fitted_to_committed"] = True
        result["fit_rates"] = rates
    print(json.dumps(result, indent=1))


main()
