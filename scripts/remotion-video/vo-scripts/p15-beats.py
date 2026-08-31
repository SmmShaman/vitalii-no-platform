#!/usr/bin/env python3
"""Voice-first build for feature p15.

Generates one mp3 per beat, measures it, then assembles the full track with the
same numbers the composition will use: 0.5 s lead, 0.3 s gaps, 1.5 s tail.
Prints the frame windows to paste into the Remotion composition (fps=30).
"""
import asyncio, json, os, subprocess

import edge_tts

VOICE = "en-US-AndrewNeural"
FPS = 30
LEAD = 0.5
GAP = 0.3
TAIL = 1.5
OUT = "/root/feature-demos/vo-p15"

BEATS = [
    ("b1", "Two out of every five Instagram posts simply vanished. Rejected."),
    ("b2", "Not with a reason — with a number. Error ten. Error twenty-four. Nothing about what to fix."),
    ("b3", "So the picture is measured before it ever leaves. Wrong shape, and it never gets sent."),
    ("b4", "For Reels, the function waits, checking every ten seconds until Instagram says it is ready."),
    ("b5", "Forty percent failing, down to under five. And every error now arrives with its fix."),
]


def dur(path):
    r = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", path],
        capture_output=True, text=True, check=True)
    return float(r.stdout.strip())


async def main():
    os.makedirs(OUT, exist_ok=True)
    durations = {}
    for name, text in BEATS:
        mp3 = os.path.join(OUT, f"{name}.mp3")
        # edge-tts intermittently returns an empty stream; retry rather than abort the build.
        for attempt in range(5):
            try:
                await edge_tts.Communicate(text, VOICE).save(mp3)
                break
            except Exception:
                if attempt == 4:
                    raise
                await asyncio.sleep(3)
        durations[name] = round(dur(mp3), 3)

    # Position each beat by sample-accurate delay instead of concatenating mp3s:
    # mp3 frames are 26 ms, so a `concat -c copy` build drifts (measured 1.2 s short
    # over five beats) and the picture stops matching the words. adelay + amix keeps
    # every beat exactly where the frame windows below say it is.
    timeline, t = [], LEAD
    inputs, filters, labels = [], [], []
    for i, (name, _) in enumerate(BEATS):
        start = t
        inputs += ["-i", os.path.join(OUT, f"{name}.mp3")]
        ms = int(round(start * 1000))
        filters.append(f"[{i}:a]adelay={ms}|{ms}[a{i}]")
        labels.append(f"[a{i}]")
        t += durations[name]
        timeline.append({
            "beat": name,
            "start_s": round(start, 3),
            "end_s": round(t, 3),
            "start_f": int(round(start * FPS)),
            "end_f": int(round(t * FPS)),
        })
        if i < len(BEATS) - 1:
            t += GAP
    t += TAIL

    full = os.path.join(OUT, "vo-p15.mp3")
    fc = ";".join(filters) + ";" + "".join(labels) + f"amix=inputs={len(BEATS)}:normalize=0[out]"
    subprocess.run(["ffmpeg", "-y", "-v", "error", *inputs, "-filter_complex", fc,
                    "-map", "[out]", "-t", f"{t:.3f}", "-c:a", "libmp3lame", "-q:a", "2",
                    full], check=True)

    total = round(t, 3)
    result = {
        "beat_durations": durations,
        "timeline": timeline,
        "total_s": total,
        "total_frames": int(round(total * FPS)),
        "measured_track_s": round(dur(full), 3),
    }
    print(json.dumps(result, indent=1))


asyncio.run(main())
