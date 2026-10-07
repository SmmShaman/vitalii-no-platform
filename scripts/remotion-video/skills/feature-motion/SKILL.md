---
name: feature-motion
description: Motion direction for the vitalii.no feature clips (1280×720, voice-synced, made nightly by the feature factory). Use when planning or writing a feature clip — picks one editorial effect per voice beat by what should CHANGE on screen, from the same 23-effect catalog the daily digest uses, and stages it over the real product. Writes the plan to shots/<id>.motion.json before the composition.
---

# feature-motion — the digest's direction, mirrored onto the feature clips

On 2026-10-05 the daily digest stopped decorating and started explaining: an editor
plans one effect per spoken sentence (`motionBeats`), every effect follows one motion
grammar, the frame has one owner, every block ends on a reading hold, and a cross-day
memory keeps the show varied. Effects that "prettify" (matrix rain, icon staggers on
every story) went from ~70 % of the effects to ~10 % (02–04.10 vs 05–06.10); the owner called the result
"набагато краще". On 2026-10-07 the owner asked for the same in the feature clips.

The catalog is the digest's: `scripts/video-processor/skills/digest-motion/effects.json`
(`motion: true` entries). Same code, same grammar — a clip uses them through
`src/compositions/feature-demos/motion-primitives.tsx`. Reference clip:
`FeatureFirst20SecondsUsedP75Motion.tsx` (p75).

## 1. Plan before you draw — `shots/<id>.motion.json`

Read the beat table (STEP 0b). For every beat answer: **what should change on screen
while this sentence is spoken?** Then write the plan, one entry per beat:

```json
{"id": "p75", "beats": [
  {"beat": "b1", "effect": "titleTakeover", "backdrop": "page",
   "data": {"title": "20 seconds of nothing", "kicker": "Every episode, before the first real headline"}},
  {"beat": "b2", "effect": "cornerTags", "backdrop": null, "data": {"statement": "...", "tags": ["...", "..."]}},
  {"beat": "b3", "effect": "drawn", "note": "archetype element only: the token reroutes"}
]}
```

- `effect`: a catalog name, or `"drawn"` for a beat the archetype element carries alone.
  **At least 3 beats of a 4–6 beat clip use a catalog effect**; never the same effect twice
  in one clip; `titleTakeover` at most once and only in b1 or the last beat.
- `backdrop`: a shot name from `shots/<id>.json` (the real product under the effect) or null.
  The last beat's backdrop is never the feature's own page or the hub (gate 2).
- `data`: only facts from the feature row (problem / solution / result), its commits and the
  brief's log lines. No fact → no effect. The factory checks every `effect` name against the
  catalog and against the composition.

## 2. Which effect — by what changes on screen

| The sentence says… | Effect |
|---|---|
| the pain in a few words (hook, b1) or the verdict (last beat) | `titleTakeover` |
| a claim without numbers, 2–3 words carry it | `keywordCaption` |
| the old behaviour corrected ("it used to X, now Y") | `copyCorrection` |
| the problem + 2–4 concrete facts (what / how often / how long) | `cornerTags` |
| something replaces something, and what changes | `handoffExplain` |
| how it works, stage by stage | `pipelineFlow` |
| several sources/parties into one centre | `hubRouting` |
| many inputs end in one outcome | `funnelAbsorption` |
| the cost of the problem listed and summed (minutes, clicks, kroner) | `costLedger` (or `cardCounter`) |
| before vs after on one metric ("20 s → 2 s", "3× faster") | `ratioBars` |
| before vs after on 2–3 metrics | `groupedBars` |
| one percentage is the result | `percentRing` |
| 2–6 values of one metric / 3–8 points over time | `sequentialBars` / `lineTrend` |
| result vs. goal or limit | `targetOverrun` |
| dated steps of how it got built | `timelineNodes` |
| checks with verdicts (gates, tests, "passes / fails") | `statusFocus` |
| options × capabilities | `featureMatrix` |
| one detail of a screenshot/recording is the evidence | `regionCallout` |
| a named person's quote | `quoteMarker` |

The archetype (STEP 0) still decides the **frame**: it is the element that survives every
beat (the p75 flow-map runs as a lower third under all five effects). The effect decides the
**event** of each beat.

## 3. Grammar — how anything moves (`effects/motion/grammar.ts`)

- Events sit on absolute seconds from the beat start; the first element lands at ~0.16 s.
- The hero element **punches** past its size and settles (`punchScale`, `<Arrive kind="punch">`);
  text **wipes** left→right (`<Arrive kind="wipe">`); secondary pieces **rise** 18 px.
  No `spring()`, no 9-frame opacity fades for arrivals.
- Data grows with power2.out and counters ride their shape; strokes draw linearly.
- Object first, label second, verdict last. **One mover at a time** — focus by dimming
  (`DIM` = 0.38), never by hiding.
- Every beat ends on a **still reading hold ≥ 1.2 s** (the effects guarantee it via `pace`;
  your own drawn pieces must stop moving too).
- **No exit fade.** A beat is visible from its first frame to the next beat's first frame
  (`cut(frame, start, next)`); the cut is the exit. The last beat holds to the end.

## 4. One owner of the frame (digest owner rules, 2026-10-05)

- While an effect plays, nothing else puts text in the upper 580 px. The archetype element
  lives in the bottom band (y ≥ 600 at 720 p — the effects keep it clear).
- White text never sits bare on a picture: `MotionInsert` puts a dark plate (0.62) over the
  backdrop; raise it to 0.7 over busy pages (GitHub diffs).
- Labels ≥ 24 px on the 1920 stage (≥ 16 px at 720 p for your own pieces); corners ≤ 4 px;
  print look — hard shadow `6px 6px 0 rgba(0,0,0,0.55)`, no glass cards.
- English on screen; pass every label explicitly — the effects' fallbacks are Norwegian
  ("Totalt", "Prosessen", "Før / Nå").

## 5. How to stage it

```tsx
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
{cut(frame, B3, B4) === 1 && <LiveBackdrop file={shots} shot="commit" from={B3} hold={B4 - B3} />}
<MotionInsert effect="handoffExplain" from={B3} dur={B4 - B3} accent={ACCENT} plate={0.7}
  data={{ from: "Generic stock photo", to: "Top 3 story photos", points: ["…", "…"] }} />
```

`dur` = next beat start − this beat start (the effect holds through the 9-frame gap). Without a
backdrop pass `base` (a dark mood colour). The accent must read on the dark plate (p75: `#F08A4B`).

## 6. Variety across clips

The factory hands you `Recent effects` — what the last 3 clips used. Prefer effects they did
not; never open b1 with the effect that opened the previous clip. After the render the factory
writes this clip's effects to `features.motion_usage`.

## 7. Review

The factory's viewer gets, per beat, one frame at its key change and one at the end of its
reading hold. Before you finish, check in your head for each beat: on the hold frame, is the
sentence's fact readable, and is nothing half-arrived or overlapping?
