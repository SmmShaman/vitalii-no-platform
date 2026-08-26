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

## Two visual templates — pick ONE per clip (2026-08-21)

The Remotion feature-demo compositions now have two design systems in
`scripts/remotion-video/src/compositions/feature-demos/`:

| | **Dark schema** (v1) | **Bright infographic** (v2) |
|---|---|---|
| Files | `theme.ts` + `primitives.tsx` | `bright-theme.ts` + `bright-primitives.tsx` |
| Audience | developers / technical viewers | general audience ("explain it to a non-engineer") |
| Language | node boxes with tech labels, connectors, data tokens | problem/solution color zones, real UI mockups with real data, emoji icon cards, big before→after metrics |
| Reference clip | most existing `Feature*.tsx` | `FeatureJobTable.tsx` (j26, rebuilt 2026-08-21) |

**Bright (v2) is the DEFAULT for every new clip (owner decision 2026-08-26).**
Any feature that gets its first clip from now on is rendered bright — no
per-clip judgement call, no exceptions to argue about. Dark (v1) is allowed
only when the owner asks for it by name on a specific feature.

Why the rule got hard: between 22.08 and 26.08 the discovery run kept adding
features (j28–j31) whose clips were written dark, and the daily 08:00 UTC
social task published them to LinkedIn. Every day of "decide per clip" grew
the dark backlog faster than the lux wave shrank it. Reference for the choice
that used to be optional: bright suits time-saved / clicks-removed / chaos →
order stories, which is nearly every feature; dark only ever fit internal
plumbing where the viewer IS a developer.

**Dark debt cleared for j28–j31 (2026-08-26):** those four were rebuilt bright
and swapped on the same R2 keys (`features/feature-<id>.mp4`), so the site and
the already-published social posts now play the new clip without any DB change.
Owner decision: **rebuild only, no repost** — they are deliberately NOT in
`feature_video_repost_queue`, and no row was added to `feature_social_posts`.
That leaves the old LinkedIn/Facebook posts pointing at the new video, which is
the intended outcome.

Remaining dark debt: the ~120 features still on v1 clips that the lux wave has
not reached, tracked by the queue, not by this file.

**Bright template rules (all owner rules above still apply):**

1. **4-beat arc, plain language:** Problem (red zone, a human task in words a
   sticky-note could hold) → Solution (the SAME task solved on screen) →
   How-it-works strip (≤3 emoji icon cards with arrows) → Result (before/after
   cards + one big number). One beat = one full-screen scene, crossfade between
   beats, ≥3 s each.
2. **Real data, never lorem:** table rows / names / scores must be plausible
   project data (e.g. `Frontend Developer · TechCorp · Gjøvik · 92 · FINN`).
   A realistic `BrowserWindow` mockup beats an abstract node.
3. **Exactly ONE tech-credibility line per clip** (small caption: component
   name, library, size). Everything else is benefit language. Tech names still
   go in the YouTube SEO description as before.
4. **Numbers are the heroes:** every clip ends with a quantified before→after
   (clicks, minutes, ×-faster). If the feature has no number, find one before
   writing the scenario.
5. EN-only (owner decision 2026-08-20), silent 15 s loop, `loopFade` at the
   tail, same render/mux/queue steps as v1 — nothing downstream changes.

### Story cut (long-form, owner-approved 2026-08-21)

For ~20–30 flagship features with a strong human story, a **Story cut** exists
alongside the standard 15 s clip: 35–55 s, narrated, built **VOICE-FIRST**.
Reference: `FeatureJobTableStory.tsx` (j26) + `scripts/remotion-video/vo-scripts/j26-story.py`.

Recipe (all steps proven on the j26 pilot, runnable on the local PC):
1. Write the VO as 6–7 numbered beats (~100–140 words total, conversational,
   one plain-language analogy — e.g. "like a librarian who sorted every book
   before you walked in"). Generate each beat as its OWN mp3 with edge-tts
   (en-US-AndrewNeural) and measure durations with ffprobe.
2. Compute frame offsets: 0.5 s lead + beats back-to-back with 0.3 s gaps +
   ~1.5 s tail, fps 30. Bake the S/E constants into the story file header AND
   build the full audio track with the same numbers (ffmpeg aevalsrc silences +
   concat). Visual events must land on the words that name them.
3. The Story composition is a separate Root.tsx id (`Feature<X>Story`), same
   bright system, NOT loop-friendly (it ends, it doesn't loop). The 15 s
   silent clip remains the site-hub loop — two products, one style.
4. Render silent, then mux: `ffmpeg -map 0:v -map 1:a -c:v copy -c:a aac`.
5. Headless-render traps: ZWJ emoji (🧑‍💻) split into separate glyphs — use
   single-codepoint emoji only; two beats that use the same screen area must
   not crossfade — kill the earlier beat fully before the next fades in.

Standard clips stay the default; a Story cut is justified only when the
feature has a persona, a before/after number AND an everyday analogy.

**Bright primitives inventory:** `LightBg`, `Group` (beat wrapper), `Headline`,
`Panel` (toned zone), `BrowserWindow`, `SkeletonScroll` (the "wall of data"),
`JobsTable` (+`JobRow`), `FilterChip`, `ToggleSwitch`, `StatPill`, `IconCard`,
`FlowArrow`, `StickyNote`, `Cursor` (with click ripple), `CheckBadge`,
`CaptionBand`; shared `seg`/`loopFade`/`fontFamily` re-exported from v1, so
beat-timing code is identical across both styles.

## The proven flow (per feature)

| Step | Tool | Where |
|---|---|---|
| 1. Pick feature + write 4-beat scenario **in bright v2** (`bright-theme.ts` + `bright-primitives.tsx`) | Sonnet 5 (Opus only for new templates) | Claude Code (subscription) |
| 2a. UI feature → film live site | `demo-video/pilot/v06-live.mjs` pattern (Playwright, cursor+callouts) | VPS |
| 2b. Backend feature → schema animation | `scripts/remotion-video` → `src/compositions/feature-demos/` primitives | local PC or VPS |
| 3. Silent 15 s loop, 1280×720, h264, ≤2.5 MB, loop-clean seam | ffmpeg `-an`, check frame 0 ≈ last frame | — |
| 4. Frame-verify (≤480px jpgs, ≤4 per clip, contact sheet preferred) | ffmpeg | — |
| 5. Upload R2 `news-images/features/feature-<id>.mp4` | curl inside VPS, creds from `portfolio-edge-functions` env (never print) | VPS |
| 6. `UPDATE features SET demo_media_url=...` | psql in `portfolio-db` | VPS |
| 7. Check live: hub HTML contains the URL | curl vitalii.no/features | — |
| 8. Voiced version: edge-tts (en-US-AndrewNeural), **LOOP the seamless clip** (`-stream_loop`) to cover VO+1.5 s — NEVER tpad/freeze the last frame (the 2026-08-13 defect: 21–24 s VO over a 15 s clip froze the visual for the last ~35–40% of every video), adelay 500 ms, trim to VO+1.5 s | `/root/feature-demos/yt/mux_v2.sh <id>` (canonical implementation of this recipe) | VPS |
| 9. YouTube upload: append the id to the queue, the daily runner ships it | `echo <id> >> /root/feature-demos/yt/queue.txt` (see below) | VPS |

## YouTube upload queue runner (installed 2026-08-20)

The YouTube leg is no longer hand-fired per session. A systemd timer
`feature-yt-queue.timer` runs `/root/feature-demos/yt/upload_queue.sh` daily at
**07:30 UTC** (right after the quota reset at 07:00 UTC):

1. Processes `delete-queue.txt` (defective originals to remove — needs the
   full-scope `token-full.json`; the upload-only refresh token 403s on delete).
2. Uploads up to **4** videos/day from `queue.txt` (4×1600 units leaves room for
   the Norwegian daily digest's 1600-unit upload in the shared 10k quota).
   Line format: `<meta_id>[|<old_video_id_to_delete_after_success>]`.
   Stops on first failure (owner rule) and reports via Telegram.
3. Adds each uploaded video to the public playlist "Features — vitalii.no"
   (`playlist_sync.py`, needs full-scope token; skipped silently otherwise).

**A batch session's job is now only to produce artifacts:** write `vo-<id>.txt`
(55–75 words, benefit-led) + `meta-<id>.json` (full SEO template below), run
`edge-tts --voice en-US-AndrewNeural --file vo-<id>.txt --write-media vo-<id>.mp3`,
run `mux_v2.sh <id>`, frame-verify the tail is NOT frozen, then append the id to
`queue.txt`. The runner does the rest on its own schedule.

## Publishing model — owner rebuild 2026-08-26

Three owner rules replaced the old two-task setup:

1. **A dark v1 clip must NEVER reach LinkedIn.** Not "preferably not" — never.
2. **The post text is written on the day it goes out**, fitted to the clip that
   is actually going out. Texts written weeks ahead are forbidden.
3. **Site, LinkedIn and YouTube ship together and link to each other.**

### What enforces rule 1

`features.demo_style` (`bright` | `dark` | NULL), added by
`20260826120000_features_demo_style_and_youtube.sql`. Every publisher query
filters on `demo_style = 'bright'`. State at that date: **35 bright, 118 dark,
85 with no clip at all** out of 238 features.

The old morning task `task-1784111012050-zh8cby` (08:00 UTC, FB + LinkedIn, took
the oldest feature with no post regardless of style) is **PAUSED**
(`messages_in.status = 'paused'`, reversible by flipping back to `'pending'`).
It would have published j32 with a dark clip on 2026-08-27. Do not resume it —
it has no style gate.

### The single publisher — twice a day

`task-1787348379037-luxrp1`, cron **`0 8,20 * * *`** = **10:00 and 22:00
Europe/Oslo**, one feature per run, **two features a day**. LinkedIn **and**
Facebook, EN only.

⏰ **nanoclaw parses cron in UTC** — the host orchestrator has no `TZ` in its
environ and containers spawn with `-e TZ=UTC`, so `data/env/env`'s
`TZ=Europe/Oslo` does *not* reach it. Oslo is UTC+2 on CEST, hence 08:00/20:00.
**After the DST change on 2026-10-25 Oslo is UTC+1 and this cron must become
`0 9,21 * * *`**, or the posts silently slide an hour earlier.

The pre-task script selects from the **whole `features` table**, not the queue:

```sql
WHERE demo_style = 'bright' AND bright_posted_at IS NULL AND status = 'published'
ORDER BY <the feature's pending queue row's scheduled_for> ASC NULLS LAST,
         created_at ASC, feature_id ASC
LIMIT 1
```

`feature_video_repost_queue` now only supplies the preferred **order** while it
still has rows; `queue_id` comes back NULL for most features and that is normal,
not an error. A second query returns `runway` — how many bright features are
still owed a post — and the agent shouts in Telegram when that drops under 14
(≈7 days at two a day).

The agent then:

- writes **two different texts**, on the spot, out of `problem_en` /
  `solution_en` / `result_en`: 900–1400 chars for LinkedIn, 500–800 warmer chars
  for Facebook. It is explicitly forbidden from reading
  `feature_video_repost_queue.post_text`, which is NULL on a pending row and is
  filled in *after* posting with what actually went out;
- always links `https://vitalii.no/features/<slug_en>`, and additionally
  `https://www.youtube.com/watch?v=<youtube_video_id>` when that column is set;
- posts native video through `nano-social-publish` and treats
  `ok:true, videoUsed:false` as a partial failure worth shouting about;
- **stamps `features.bright_posted_at`** — that, not the queue, is what stops a
  feature being picked twice. One platform failing still counts as published;
  both failing leaves the column NULL so the next run retries;
- never fails silently: a broken query wakes the agent with `data.debug` set and
  the instruction to send a Telegram warning instead of posting.

The August texts that used to sit in the queue are backed up on the VPS at
`/root/feature-demos/queue-post_text-backup-20260826.json`.

**Render cadence must match:** two posts a day burns **14 clips/week**
(≈1M Sonnet tokens/week at the measured ~70k per feature, ~50 s render each).
A batch that lags behind that empties the runway.

### Closing the three-way loop

- YouTube description → site feature page (already did).
- LinkedIn post → site feature page **and** the YouTube video.
- Site feature page → YouTube (`FeatureArticle.tsx`, shown when
  `youtube_video_id` is set).
- `upload_queue.sh` writes `features.youtube_video_id` + `youtube_uploaded_at`
  back to `portfolio-db` after each successful upload, so the link appears
  everywhere without a manual step. Backup of the pre-patch script:
  `upload_queue.sh.bak-20260826`.

Historical note: pg_cron job#9 (`publish-feature-social-daily`) is deliberately
**disabled** — re-enabling it would double-post; the NO-language track died with
it (accepted). Facebook is currently NOT part of the daily publisher; the lux
wave was an owner-approved LinkedIn-only decision and was not silently widened.

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
