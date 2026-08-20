# Feature Demos — YouTube Upload Queue

Tracking file for the YouTube-upload leg of the feature-demos pipeline (schema-diagram
clips on vitalii.no's `/features` hub). Not a DB table — `features.demo_media_url` has
no YouTube-status column, so this file is the source of truth for "already published
to YouTube" until/unless that changes.

Playlist step is intentionally skipped for all uploads: the current
`YOUTUBE_REFRESH_TOKEN` only has `youtube.upload` + `youtube.readonly` scopes;
playlist creation 403s (known limitation, see `/root/feature-demos/yt/upload.py`
comments in the pilot script history).

| feature_id | youtube_video_id | uploaded_at | title |
|---|---|---|---|
| v06 | `-9Q0iM5_TqM` | 2026-08-11 07:31 UTC (pilot) | From Modal-Only to Indexable — 214 Features Get Real URLs \| vitalii.no |
| v12 | `KODi-DlXyk0` | 2026-08-11 07:31 UTC (pilot) | LLM Fallback Chain — Zero Stuck Articles When a Pool Runs Dry \| vitalii.no |
| j59 | `kp3WzLQa30c` | 2026-08-11 07:31 UTC (pilot) | The Agent Submits the Job Form Itself — One Run, No Second Confirm \| JobBot |
| p41 | `YD3016Ovw-Y` | 2026-08-12 11:17 UTC | Round-Robin Telegram Scraper: Zero Rate Limits \| vitalii.no |
| p30 | `crg43E4HhsQ` | 2026-08-12 11:18 UTC | 200-Particle Three.js Background at 60fps \| vitalii.no |
| j01 | `TxpBwZ3auKM` | 2026-08-12 11:19 UTC | AI Job Analyzer: 4 Hours to 30 Minutes \| JobBot |
| j02 | `MYqAphYOB4Y` | 2026-08-12 11:19 UTC | AI Cover Letter in 8 Seconds, Bokmal Ready \| JobBot |
| j03 | `S1DUZX33TzQ` | 2026-08-12 11:20 UTC | AI CV Parser: PDF to JSON in 12 Seconds \| JobBot |
| j04 | `mbu0hZfgMrc` | 2026-08-12 11:20 UTC | MetaClaw: AI That Learns From Failed Job Forms \| JobBot |
| j05 | `TeG-GuN_FMY` | 2026-08-13 06:46 UTC | Job Aura: Feel the Vibe Before the Interview \| JobBot |
| j06 | `4_j0OMq1TPo` | 2026-08-13 06:46 UTC | One Click to Apply: Taming 10+ Norwegian Job Portals \| JobBot |
| j07 | `lq-4Rd0FlxA` | 2026-08-13 06:46 UTC | 2FA via Telegram: The Bot Becomes Your Fingers on FINN \| JobBot |
| j08 | `myt_eGuHyZ8` | 2026-08-13 06:46 UTC | Auto-Registration: Taming the 7-Platform Onboarding Gauntlet \| JobBot |
| p01 | `sYtAcLnL1iA` | 2026-08-13 06:46 UTC | AI Pre-Moderation: Killing Spam Before It Reaches My Eyes \| vitalii.no |
| p02 | `4-IcLKOSluE` | 2026-08-13 06:46 UTC | AI Content Rewriting: 3 Languages, Zero Translators \| vitalii.no |

## v2 re-uploads (freeze-defect replacements)

The 12 non-pilot videos above (p41, p30, j01–j08, p01, p02) were built with the
tpad/freeze defect (visual frozen for the last ~35–40% of every video). Fixed
`-v2` files + metas were prepared 2026-08-13 (`yt-feature-<id>-v2.mp4`,
`meta-<id>-v2.json`). Upload progress:

| feature_id | v2 youtube_video_id | uploaded_at | old (defective) id — NOT yet deleted |
|---|---|---|---|
| p41 | `4d7fdIazr7k` | 2026-08-13 12:18 UTC | `YD3016Ovw-Y` |
| j01 | `bgGpbFRB0wI` | 2026-08-20 | `TxpBwZ3auKM` |
| j02 | `vPyPU0syucI` | 2026-08-20 | `MYqAphYOB4Y` |
| j03 | `9xtjiJQfSJI` | 2026-08-20 | `S1DUZX33TzQ` |
| j04 | `DKqY5WW3hCk` | 2026-08-20 | `mbu0hZfgMrc` |
| j05 | `mzBcU7Tkv7k` | 2026-08-20 | `TeG-GuN_FMY` |
| j06 | — queued | | `4_j0OMq1TPo` |
| j07 | — queued | | `lq-4Rd0FlxA` |
| j08 | — queued | | `myt_eGuHyZ8` |
| p01 | — queued | | `sYtAcLnL1iA` |
| p02 | — queued | | `4-IcLKOSluE` |
| p30 | — queued | | `crg43E4HhsQ` |

All v2 uploads confirmed `uploadStatus=processed processing=succeeded`.
Only ~6 uploads/day fit the 10k-unit quota (upload = 1600 units) and the daily
Norwegian digest needs its own upload from the same quota — hence 5/day here.

**2026-08-20 evening — DONE:** owner completed the OAuth consent (playground
redirect is the one registered on the client; localhost is NOT). Full-scope
token saved as `/root/feature-demos/yt/token-full.json` (channel verified:
UCho6BqD_HVmwdg_06EWaQQQ). **All 6 defective originals deleted** (204 each).
Public playlist **"Features — vitalii.no"** created:
https://www.youtube.com/playlist?list=PLBBQx1yDXs1c — seeded with the 9 clean
videos (3 pilots + p41-v2 + j01–j05 v2). The daily `feature-yt-queue.timer`
runner (07:30 UTC, max 4/day) now: uploads the remaining v2s
(j06/j07/j08/p01/p02/p30) deleting each defective original right after its v2
lands, then continues with new features (j09–j12 artifacts ready), and
auto-adds every upload to the playlist.

## Notes

- Pilot IDs (v06/v12/j59) confirmed via `search?forMine=true` on the same channel,
  matched by exact title string against `/root/feature-demos/yt/upload.py`'s
  hardcoded video list — not a guess.
- p41/p30/j01/j02/j03/j04 all uploaded with full structured SEO descriptions
  (150-300 words: hook / problem / how-it-works / result / links / hashtags),
  `categoryId: "28"`, `privacyStatus: "public"`, `selfDeclaredMadeForKids: false`.
  All 6 confirmed `uploadStatus=processed processing=succeeded` before being recorded here.
- j01's first upload attempt (INIT ERROR 400 `invalidDescription`) was caused by a
  literal `>=` in the description body ("fit_score>=50"); fixed to "fit_score of 50
  or higher" and the retry succeeded. No other video needed a retry.
- Day 2 batch (j05/j06/j07/j08/p01/p02, quota reset 2026-08-13): all 6 uploaded on
  the first attempt, no retries needed. p02's initial title ("AI Content Rewriting:
  1 Article, 3 Languages, 0 Translators | vitalii.no", 72 chars) exceeded the 70-char
  cap and was shortened to "AI Content Rewriting: 3 Languages, Zero Translators |
  vitalii.no" (64 chars) before upload. All 6 confirmed `uploadStatus=processed
  processing=succeeded`. Playlist step skipped entirely per standing scope limitation.
- Still queued (silent clips produced, not yet YouTube'd as of 2026-08-13): j09-j58,
  p03-p42 (confirmed present as `/root/feature-demos/feature-*.mp4` on the VPS —
  a large bulk batch landed 2026-08-12, well ahead of the YouTube leg's ~6/day cap
  from the 10k-unit daily quota).
