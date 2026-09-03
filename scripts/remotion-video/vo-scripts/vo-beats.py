#!/usr/bin/env python3
"""Voice-first build for any feature clip (generalised from p15-beats.py).

Usage:  python3 vo-beats.py <beats.json>

beats.json = {"id": "p18", "voice": "en-US-AndrewNeural",
              "beats": [["b1", "text"], ["b2", "text"], ...]}

Generates one mp3 per beat, measures it, then assembles the full track with
0.5 s lead, 0.3 s gaps, 1.5 s tail, and prints the frame windows (fps=30) to
paste into the Remotion composition and Root.tsx.

Assembly is adelay+amix, never `concat -c copy`: mp3 frames are 26 ms and a
concat build measured 1.2 s short over five beats, which walks the picture off
the words by the last beat.
"""
import asyncio, json, os, subprocess, sys

import edge_tts

FPS = 30
LEAD = 0.5
GAP = 0.3
TAIL = 1.5
# Where the per-beat mp3s and the assembled track are written. Defaults to the
# VPS layout; GitHub Actions sets VO_OUT_ROOT to a workspace directory.
ROOT = os.environ.get("VO_OUT_ROOT", "/root/feature-demos")


def dur(path):
    r = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", path],
        capture_output=True, text=True, check=True)
    return float(r.stdout.strip())


async def main():
    cfg = json.load(open(sys.argv[1]))
    fid = cfg["id"]
    voice = cfg.get("voice", "en-US-AndrewNeural")
    beats = [(b[0], b[1]) for b in cfg["beats"]]
    out = os.path.join(ROOT, f"vo-{fid}")
    os.makedirs(out, exist_ok=True)

    durations = {}
    for name, text in beats:
        mp3 = os.path.join(out, f"{name}.mp3")
        # edge-tts intermittently returns an empty stream; retry rather than abort.
        for attempt in range(5):
            try:
                await edge_tts.Communicate(text, voice).save(mp3)
                if os.path.exists(mp3) and os.path.getsize(mp3) > 0:
                    break
            except Exception:
                pass
            if attempt == 4:
                raise RuntimeError(f"edge-tts failed for {fid}/{name}")
            await asyncio.sleep(3)
        durations[name] = round(dur(mp3), 3)

    timeline, t = [], LEAD
    inputs, filters, labels = [], [], []
    for i, (name, text) in enumerate(beats):
        start = t
        inputs += ["-i", os.path.join(out, f"{name}.mp3")]
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
    print(json.dumps({
        "id": fid,
        "beat_durations": durations,
        "timeline": timeline,
        "total_s": total,
        "durationInFrames": int(round(total * FPS)),
        "measured_track_s": round(dur(full), 3),
        "track": full,
    }, indent=1))


asyncio.run(main())
