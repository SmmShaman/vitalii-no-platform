#!/usr/bin/env python3
"""Neural TTS with real word timings, from Microsoft's free Edge endpoint.

Why this exists (2026-09-05): the digest's voiceover ran through Zvukogram,
which is a paid reseller — and on 02.09 its balance ran out, so every render
died at the voiceover step for four days. Its two Norwegian voices, "Финн" and
"Пернилла", are Microsoft's nb-NO-FinnNeural and nb-NO-PernilleNeural: the same
voices this speaks to directly, for nothing.

It is also strictly better on the part that mattered. Zvukogram's /subs
endpoint was unavailable on that account, so caption timings were *inferred*
from ffmpeg silence detection. Edge sends a WordBoundary event for every word
it speaks, so the timings here are measured, not guessed.

Usage:  edge-tts-voice.py <voice> <mp3-out> <json-out>   # text on stdin
"""
import asyncio, json, sys

import edge_tts

# Edge reports offsets in 100-nanosecond ticks.
TICKS_PER_SECOND = 10_000_000
RETRIES = 5


async def synthesize(text, voice, mp3_path):
    """Returns the word list; writes the audio. Retries empty streams.

    edge-tts intermittently returns no audio for perfectly valid text — the
    same string succeeds moments later — so an empty result is a retry, not a
    diagnosis.
    """
    last_err = None
    for attempt in range(RETRIES):
        words = []
        audio = bytearray()
        try:
            # edge-tts defaults to SentenceBoundary; word timings are opt-in
            # and are the whole reason this exists.
            comm = edge_tts.Communicate(text, voice, boundary="WordBoundary")
            async for chunk in comm.stream():
                if chunk["type"] == "audio":
                    audio.extend(chunk["data"])
                elif chunk["type"] in ("WordBoundary", "SentenceBoundary"):
                    start = chunk["offset"] / TICKS_PER_SECOND
                    end = start + chunk["duration"] / TICKS_PER_SECOND
                    words.append({
                        "text": chunk["text"],
                        "startTime": round(start, 3),
                        "endTime": round(end, 3),
                    })
            if audio:
                with open(mp3_path, "wb") as f:
                    f.write(audio)
                return words
            last_err = "empty audio stream"
        except Exception as exc:  # noqa: BLE001 — any failure is a retry
            last_err = repr(exc)
        if attempt < RETRIES - 1:
            await asyncio.sleep(3)
    raise RuntimeError(f"edge-tts failed after {RETRIES} attempts: {last_err}")


async def main():
    voice, mp3_path, json_path = sys.argv[1], sys.argv[2], sys.argv[3]
    text = sys.stdin.read().strip()
    if not text:
        raise SystemExit("no text on stdin")

    words = await synthesize(text, voice, mp3_path)
    duration = max((w["endTime"] for w in words), default=0.0)

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump({"voice": voice, "durationSeconds": duration, "words": words},
                  f, ensure_ascii=False)

    print(json.dumps({"voice": voice, "words": len(words),
                      "durationSeconds": duration, "audio": mp3_path}))


asyncio.run(main())
