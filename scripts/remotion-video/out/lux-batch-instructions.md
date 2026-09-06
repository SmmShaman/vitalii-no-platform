# Lux batch instructions — bright v2 rework (one agent = two features)

Work dir: C:\Users\stuar\Projects\vitalii_claude-code-in-browser\scripts\remotion-video

> **2026-08-30 — ART DIRECTION IS NO LONGER FIXED.** Until today every clip copied
> the composition, rhythm and palette of one reference file, so 35 different stories
> looked like one video. From now on the STORY LOGIC stays fixed (problem → solution →
> how → number) but the **staging is different every clip**: a drawn archetype, its own
> palette mood, its own beat rhythm. Sameness is now a defect, not compliance.

## STEP 0 — Draw your art direction (do this FIRST, before writing anything)

1. Open `out/lux-archetypes.md` — the log of what the last clips used.
2. For each of your two features compute `idx = (sum of char codes of the feature id) % 8`
   and take that **archetype** from the table below. **If that archetype appears in the
   last 2 logged clips, take the next one down the table** (wrap around). Two features in
   the same batch must never share an archetype.
3. Palette: `const P = moodFor("<feature id>")` from `./bright-theme` — same rule, if the
   drawn mood matches either of the last 2 logged clips, take the next name in `MOOD_NAMES`.
4. If the orchestrating session already handed you an archetype and a mood, use those and skip
   steps 1–3. **Never edit `out/lux-archetypes.md` yourself** — concurrent agents would clobber
   each other; report your draw and the session logs it.

### The eight archetypes

| # | Archetype | How the frame is built |
|---|---|---|
| 0 | **Split duel** | Screen halved by a moving divider: chaos left, order right. Both halves live at once; the divider slides to reveal the win. No centered headline — the label sits inside each half. |
| 1 | **Timeline ribbon** | A horizontal (or diagonal) time band across the frame; events land on it as stamps left→right. Headline bottom-left, small, not centered. |
| 2 | **Zoom-in** | Beat 1 is a wide, small-scale view of a whole interface; each following beat scales/pans INTO one element until it fills the frame. Motion is camera, not fade. |
| 3 | **Card deck** | Cards fly in and stack, then fan out into a grid. The story is told by the pile shrinking or the fan sorting itself. |
| 4 | **Flow map** | Nodes and routes across the whole frame (not a straight 3-icon strip); a token travels the route and branches. |
| 5 | **Ledger** | A receipt/invoice column: line after line of cost (time, clicks, money) adding up in red, then the same ledger rewritten in green with the total struck through. |
| 6 | **Sidebar narrative** | A fixed left column (280–340 px) that holds the running claim; the big stage on the right swaps content per beat. The only recurring element is the column. |
| 7 | **Hero number** | One enormous figure (200–320 px type) owns the frame from beat 1; every following beat builds evidence AROUND it. Almost no chrome. |

Hard rule: the archetype decides **where things sit and how they move**. Do NOT fall back
to "headline centered on top + panel row + 3 icon cards + 2 result cards" — that layout is
retired as a default. It is allowed only as archetype 6's right-hand stage, once.

**The archetype must DOMINATE the frame, not decorate a corner (2026-09-03).** The p20 clip
passed every sync check and still failed review: its drawn archetype was the card deck, and
the deck rendered as a 180px pile in the lower-left while a centered headline and a big red
number owned the screen. That is the retired default layout wearing an archetype as a badge.
Test your own clip with one question: **if the archetype's object were deleted, would the
clip still read?** If yes, the archetype is decoration and the staging is wrong. The drawn
object is the largest, most central, longest-lived thing on screen; the headline goes small
and to one side, the way p18 puts its title bottom-left.

Second lesson from the same clip: **a beat that lists four things needs four things on
screen.** Its narration said "Generate the picture. Rewrite it in three languages. Put it on
the site. Post it." and the frame showed one small card. Count the nouns in your beat's
sentence and make sure the picture pays each one, spaced across that beat's window.

Third lesson, from p20's second pass: **an archetype that owns the frame still has to FILL
it.** Moving the deck to the centre fixed the hierarchy and left the top-right third of
every frame empty, with the beat-4 conveyor tucked into a lower corner. 1280x720 is the
whole canvas. Nothing should sit in a corner with a third of the screen white beside it, and
a card with no label on it is a shape, not information — every card the viewer can see
should say what it is.

## STEP 0b — Your clip is VOICE-SYNCED (owner rule, 2026-08-31)

The orchestrating session hands you, per feature, a **beat table** it measured from the
real voiceover: the start and end frame of every beat plus the sentence spoken in it.
Those numbers are not a suggestion and not a starting point — they are the audio.

- `durationInFrames` is given to you (p15 = 907). It is NOT 450 any more, and the clip is
  **not loop-friendly**: it ends, it does not seam back to frame 0.
- Each beat's content must appear inside its own window and be **fully gone before the next
  window opens** when the two share screen area — the gaps between beats are only ~9 frames.
- The visual event must land on the words that name it. If beat 3 says "measured before it
  ever leaves", the measurement appears in beat 3, not beat 2 as foreshadowing.
- The LAST beat holds through the tail instead of fading out — there is nothing to hand over
  to, and an empty frame under the closing line reads as a truncated video.
- One element should survive every beat (in p15 the hero figure), so the clip reads as one
  argument rather than five slides.

Reference: `src/compositions/feature-demos/FeatureInstagramPublishing.tsx` (p15) — its header
carries the measured table and explains how each window was used.

## STEP 0c — UI beats show the REAL product (owner rule, 2026-09-06)

The owner compared a drawn clip with one that plays a recording of the live product inside
the browser window and chose the recording. From now on **every beat that is about the
interface plays a recording, not a mockup**. Beats that are metaphors ("a stranger's
diary") or invisible plumbing (a cron, an LLM chain) stay drawn. Reference:
`src/compositions/feature-demos/FeatureTraceabilityScannerLive.tsx` (p61) + `shots/p61.json`.

How it works — two files, one spec:

1. **`src/compositions/feature-demos/shots/<id>.json`** — the shot spec. One entry per
   recording: a public `url`, `frames` (= the beat window length you have to fill),
   `scroll` keyframes `[[frame, y], …]` and `mouse` keyframes `[[frame, x, y], …]` in CSS px
   of the 1120×466 viewport, optional `clicks: [frame, …]` (a real click at the mouse
   position — the page may navigate) and `hide: [selector, …]`. Motion is eased between
   keyframes. `tools/record-ui.cjs <id>` turns it into `public/rec/<id>-<shot>.mp4` **on the
   GitHub runner before every render** — you never record, never commit a video.
2. **The composition** imports that same JSON (`import shots from "./shots/<id>.json"`) and
   stages each recording with `<LiveWindow file={shots} shot="hub" title="vitalii.no/features"
   from={15} hold={166} zoom={(t) => 1 + 0.16 * t} focus={{ x: 0.5, y: 0.45 }} opacity={b1} />`
   from `live-primitives.tsx`. `from` is the beat's first frame, `hold` how many frames the
   window stays (the last recorded frame is frozen after `frames`; it is NEVER looped).
   The drawn cursor lands exactly where the recorder's mouse was, so put the mouse on the
   element the beat talks about. Overlays (pills, a linked-rows card, the result strip) sit
   ON TOP of the window, in the same bright style; the hero number moves to the top-left.

Which pages you may record — only what is public, and only URLs the brief lists as
verified (the host checks each with curl before the render):
- the feature's own page `https://vitalii.no/features/<slug_en>` and the hub
  `https://vitalii.no/features` — every feature has these;
- for public repos: the commit page of the feature's own `source_commits`
  (`<repo_url>/commit/<hash>` — the real diff is the strongest "this is the product" shot for
  a backend feature), the repo's `/commits/main`, `/actions`, `/actions/workflows/<file>`;
- any other public page of the product named in the brief (vitalii.no news/blog, ghost.vitalii.no).
Never an admin panel, never a URL you have not seen answer 200. The recorder fails the
render on a 4xx/5xx — on purpose.

Camera: `zoom` runs 1.0–1.2 at most, one direction per shot; `focus` picks what stays on
screen. Text inside the recording is small — a zoom that crops the left edge of a sidebar
mid-word is a defect just like a cropped caption.

## STEP 1 — Learn the style (read each ONCE, never re-read)
- `src/compositions/feature-demos/FeatureVideoFactoryV3.tsx` — the reference for the NEW
  art direction (archetype 7 "hero number", mood `violet`, 5 beats). Read it for HOW a clip wires a
  palette and paces beats — **not to copy its layout**.
- `src/compositions/feature-demos/FeatureJobTable.tsx` — the older reference; still the best
  example of real-data mockups and cursor work. Its 4-fixed-beat rhythm is NOT to be copied.
- `src/compositions/feature-demos/bright-primitives.tsx` — components: LightBg, Group,
  Headline, Panel, BrowserWindow, SkeletonScroll, JobsTable/JobRow, FilterChip, ToggleSwitch,
  StatPill, IconCard, FlowArrow, StickyNote, Cursor, CheckBadge, CaptionBand, seg, loopFade,
  fontFamily. All of them take free x/y/w/h — compose new layouts, don't repeat the reference's.
- `bright-theme.ts` exports `MOODS`, `MOOD_NAMES`, `moodFor(seed)`, `PaletteProvider`,
  `usePalette`, and `B` (the legacy "dawn" palette, still the default).
- Feature facts: the data JSON file named in your task prompt (title_en, short_description_en,
  problem_en, solution_en, result_en, tech_stack, slug_en per feature).
- Read the OLD version of each of your two Feature files first — its header comment holds the
  proven story beats. Keep the STORY, rebuild the STAGING.

## STEP 2 — Rewrite each of your two files COMPLETELY in bright v2 style
- Keep the SAME export/component name. 1280x720, 30fps. **`durationInFrames` comes from your
  beat table (STEP 0b)** — the session updates Root.tsx with it; do not assume 450 and do not
  build a loop seam.
- **Wrap the whole tree** in `<PaletteProvider value={P}>` so every primitive picks up your mood.
- **Rhythm is yours:** 3 to 5 beats, each ≥90 frames (3 s), filling 450 frames. Do not reuse the
  `b1=seg(0,10)…b4=seg(340,354)` windows — pick your own split (e.g. 4 beats of 150/120/90/90,
  or 3 long beats, or 5 short ones). Vary the transition too: crossfade, slide, wipe or a scale
  push — at least one beat change in the clip must NOT be a plain crossfade.
- Plain language for a NON-technical viewer. Real plausible data in mockups (never lorem).
  Exactly ONE small tech-credibility caption per clip. Every clip ends with a quantified
  before→after.
- HARD RULES: single-codepoint emoji only (NO ZWJ sequences like 🧑‍💻 — they split into two
  glyphs in headless Chrome); numbers are the heroes; ≥3 s per beat; captions in English; never
  fabricate metrics absent from the data; two beats sharing screen area must not crossfade —
  kill the earlier one fully first.
- Compose new inline layouts from Panel/StatPill/IconCard etc. freely, but do NOT edit
  bright-primitives.tsx, bright-theme.ts, primitives.tsx, theme.ts, Root.tsx, or any file
  outside your two Feature files.

## STEP 3 — Typecheck
From scripts/remotion-video run: `node node_modules/typescript/bin/tsc --noEmit`. Other agents edit
OTHER Feature files concurrently — IGNORE errors in files that are not yours; fix only your two
files, re-run until yours are clean.

**No post texts.** Since 2026-08-26 the publisher writes the LinkedIn/Facebook text on the day it
posts, so a batch produces clips only — do not write `-post.txt` files and do not touch
`feature_video_repost_queue`.

DO NOT render video. DO NOT commit. Report: files rewritten, archetype + mood used for each,
1-line beat summary each, typecheck status for your files.
