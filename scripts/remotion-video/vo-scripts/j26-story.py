"""Generate per-beat VO for the j26 Story cut and print beat durations (s)."""
import asyncio, json, subprocess, os
import edge_tts

VOICE = "en-US-AndrewNeural"
OUT = os.path.dirname(os.path.abspath(__file__))

BEATS = [
    ("b1", "It's evening, and you're job hunting. Your assistant has already collected two hundred postings. Great — except now you're drowning in them."),
    ("b2", "You want something simple: IT jobs in Gjovik, strong matches only, from the last week — and no recruiter agencies. That used to take ten clicks and five minutes of scrolling."),
    ("b3", "So we rebuilt the table. Now it's three clicks: pick your filters, flip one switch — and recruiter agencies stay hidden forever."),
    ("b4", "Five scored matches appear in about two seconds. Like a librarian who sorted every book before you walked in."),
    ("b5", "And however long the list grows, the table only draws what's on your screen — so it never freezes."),
    ("b6", "Ten clicks and five minutes, down to three clicks and two seconds. About one hundred and fifty times faster."),
    ("b7", "Job search should be easy — not exhausting."),
]

async def main():
    durations = {}
    for name, text in BEATS:
        mp3 = os.path.join(OUT, f"{name}.mp3")
        await edge_tts.Communicate(text, VOICE).save(mp3)
        r = subprocess.run(
            ["ffprobe", "-v", "quiet", "-show_entries", "format=duration", "-of", "csv=p=0", mp3],
            capture_output=True, text=True,
        )
        durations[name] = round(float(r.stdout.strip()), 3)
    print(json.dumps(durations, indent=1))

asyncio.run(main())
