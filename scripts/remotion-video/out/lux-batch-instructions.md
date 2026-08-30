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
- Keep the SAME export/component name (Root.tsx must not change). 1280x720, 450 frames @30fps,
  silent, loop-friendly (loopFade at tail).
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
