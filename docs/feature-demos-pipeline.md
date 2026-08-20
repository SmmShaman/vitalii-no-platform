# Feature Demo Clips — Pipeline Prompt (canonical)

This is the instruction sheet for every session/agent that produces feature demo
clips. The pilot (v06, v12, j59 — 2026-08-11) proved the flow; follow it exactly.

## Owner rules (non-negotiable)

1. **NO SCHEDULED AUTOMATION UNTIL A FULL DRY-RUN PASSES.** Before enabling any
   cron/timer that produces 3–4 clips per day, run ONE complete end-to-end cycle
   in a supervised session and verify EVERY step:
   pick feature → render → frame-verify → R2 upload → public URL answers
   200/206 with `video/mp4` → DB `demo_media_url` set → live site HTML contains
   the URL → YouTube upload with full SEO description → video `processed` →
   playlist insert. Only after all checks pass may the schedule be enabled.
2. **Batch runs verify every artifact and stop on first failure.** A nightly
   batch must check each clip the same way as the dry-run; on any failure it
   stops and reports instead of continuing blind.
3. **Every YouTube video gets a full SEO description** (see template below).
   A two-line description is a defect, not a draft.
4. Scenario style rules from demo-video CLAUDE.md apply: ≥3 s per beat,
   framed callouts (not subtitles), commercial benefit-led voiceover,
   loop-friendly silent site version.

## The proven flow (per feature)

| Step | Tool | Where |
|---|---|---|
| 1. Pick feature + write 4-beat scenario | Sonnet 5 (Opus only for new templates) | Claude Code (subscription) |
| 2a. UI feature → film live site | `demo-video/pilot/v06-live.mjs` pattern (Playwright, cursor+callouts) | VPS |
| 2b. Backend feature → schema animation | `scripts/remotion-video` → `src/compositions/feature-demos/` primitives | local PC or VPS |
| 3. Silent 15 s loop, 1280×720, h264, ≤2.5 MB, loop-clean seam | ffmpeg `-an`, check frame 0 ≈ last frame | — |
| 4. Frame-verify (≤480px jpgs, ≤4 per clip, contact sheet preferred) | ffmpeg | — |
| 5. Upload R2 `news-images/features/feature-<id>.mp4` | curl inside VPS, creds from `portfolio-edge-functions` env (never print) | VPS |
| 6. `UPDATE features SET demo_media_url=...` | psql in `portfolio-db` | VPS |
| 7. Check live: hub HTML contains the URL | curl vitalii.no/features | — |
| 8. Voiced version: edge-tts (en-US-AndrewNeural), **LOOP the seamless clip** (`-stream_loop`) to cover VO+1.5 s — NEVER tpad/freeze the last frame (the 2026-08-13 defect: 21–24 s VO over a 15 s clip froze the visual for the last ~35–40% of every video), adelay 500 ms, trim to VO+1.5 s | `/root/feature-demos/yt/upload.py` pattern | VPS |
| 9. YouTube upload (public, categoryId 28) + SEO description + playlist | YouTube Data API, creds from same container env | VPS |

## YouTube SEO description template (MANDATORY per video)

**Title** (≤70 chars): main keyword first, concrete benefit, ` | vitalii.no`
(or ` | JobBot`) suffix. Never a bare feature name.

**Description** (150–300 words, structured):

```
<Line 1–2: hook with the primary keywords — this is what shows before "…more">

<Paragraph "Problem": 2–3 sentences, plain language, includes secondary keywords>

<Paragraph "How it works": 3–4 sentences naming the real tech (Next.js, Supabase,
Playwright, Groq, Remotion…) — tech names are search keywords>

<Paragraph "Result": 1–2 sentences with a number/metric where the feature has one>

🔗 Full write-up: https://vitalii.no/features/<slug>
📚 All 214 features: https://vitalii.no/features
👨‍💻 Built by Vitalii Berbeha — https://vitalii.no

#<3–5 hashtags: mix of broad (#webdevelopment #ai) and niche (#nextjs #llmops)>
```

**Tags:** 10–15, mixing broad ("web development", "ai automation") and long-tail
("nextjs isr seo", "llm fallback chain", "playwright automation demo").

**Playlist:** "Features — vitalii.no" (public). NOTE: current refresh token has
only `youtube.upload` + `youtube.readonly` scopes — playlist insert 403s until
the owner re-consents with the full `youtube` scope and updates
`YOUTUBE_REFRESH_TOKEN` on the VPS. Until then: upload works, playlist step is
queued (idempotent part of upload.py).

## Budget & session strategy (measured 2026-08-11, FINAL)

Measured from the session JSONL log: the pilot mega-session (analysis + fixes +
infra + 3 clips + YouTube) cost **≈$130 API-equivalent for the day**, of which
all 7 subagents were only ~630k tokens (~$10–15). The dominant term: **71.6M
cached-token reads across 231 main-loop calls (avg ~310k context re-read per
call) = $72 alone**. A long-lived session's context tail is the cost, not the
work itself. (The `/usage` screen shows only the current 5h window on one
machine — for real accounting sum the session log.)

**Therefore the conveyor rules are:**

1. **Every batch runs in a FRESH, dedicated session on Sonnet 5** (`/model
   sonnet` or `claude --model sonnet`). Never continue a long mixed session.
   Context = this doc + the 4 feature rows from the DB. Nothing else.
2. All batch agents explicitly `model: sonnet`. Opus 5 only for one-off
   template/harness work in its own short session.
3. Batch size: **4 features per session** (3 schema + 1 live-UI). Expected
   spend per batch: ~500–700k tokens ≈ $3–6 Sonnet API-equivalent (vs $75 for
   the pilot mega-session). Remaining ~211 features ≈ 53 batches.
4. Marginal per clip (templates ready): schema ≈ 30–40k, live-UI ≈ 50–70k,
   YouTube layer with full SEO description ≈ 25k. All-in per feature ≈ 60–100k.
5. Weekly: one short Opus QA pass over a random sample of the week's clips.

### Accelerated mode (owner-approved 2026-08-12, when weekly quota is abundant)

- After the 2-feature dry-run passes clean IN THE SAME DAY, batch size may grow
  to **15–20 features per fresh Sonnet session**, sessions run back-to-back.
- Prioritize SITE clips (render → R2 → DB → site check); the YouTube layer is
  hard-capped externally at **~6 uploads/day** (YouTube Data API quota: 10k
  units/day, upload = 1600) — maintain an upload queue table/list and drip 6
  per day, oldest first, full SEO description each.
- Stop-on-first-failure still applies within a batch; between batches check
  `/usage` and STOP for the week when weekly usage reserve drops to ~30–35%
  (jobbot and other projects share the same subscription).
- VPS render wall-clock is the other bottleneck (~3–5 min/clip): run renders
  sequentially in the background, never parallel Playwright recordings.
