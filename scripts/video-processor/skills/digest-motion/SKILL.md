---
name: digest-motion
description: Motion direction for the vitalii.no daily news digest video. Use when writing the digest's visual_scenario (motionBeats) or phrase-level visual directives — picks one on-screen effect per beat by what should CHANGE on screen, and supplies the effect's data from the article's own facts. Catalog: scripts/video-processor/skills/digest-motion/effects.json.
---

# digest-motion — one effect per beat, chosen by what changes on screen

The digest is a Norwegian news show without a presenter in frame: a voice reads each
segment, the picture is the article's photos plus motion graphics. This skill decides
which graphic goes on which sentence. The catalog with every effect, its data shape and
an example is `effects.json` next to this file — it is the single source: the render's
Visual Director reads the same file, so an effect that is not there does not exist.

Ideas behind the 12 `motion` effects come from public descriptions of an editorial
motion library (charts, diagrams, kinetic type, evidence cards); the components are our
own Remotion code in `scripts/remotion-video/src/components/effects/motion/`.

## How to direct a segment

1. **Read the segment as beats.** A beat is one spoken sentence (3–5 s). Most beats stay
   on the photo with no effect — the photo is the evidence. Give an effect to at most
   **3 beats per segment**, never two neighbouring beats.
2. **Ask what should change on screen while the sentence is spoken**, then pick by that:

| The sentence says… | Effect |
|---|---|
| the story in a few words (segment opening, the verdict) | `titleTakeover` |
| a claim without numbers, 2–3 words carry it | `keywordCaption` |
| "was X, now Y", a myth/rumour corrected, a reversed decision | `copyCorrection` |
| a named person's quote is the news | `quoteMarker` |
| one big number | `counterMosaic` |
| two numbers and their ratio ("3× faster") | `ratioBars` |
| 2–6 values of one metric (years, companies) | `sequentialBars` |
| 3–8 points over time, the direction matters | `lineTrend` |
| shares of a whole (market share %) | `compositionStrip` |
| result vs. goal/forecast/limit | `targetOverrun` |
| amounts adding up to a total | `cardCounter` |
| how it works, stage by stage | `pipelineFlow` |
| several parties into one centre (investors → startup) | `hubRouting` |
| dated milestones | `progressTimeline` |
| countries / global rollout | `globe3D` |
| a detail of the photo, several photos | `photoZoomReveal`, `photoSplitScreen`, `photoCollage` |

3. **Data comes only from the article.** Every number, name and quote in `motionData`
   must be in the article text. No data → no effect (`"none"`); the render drops an effect
   whose data is missing rather than drawing an empty frame.
4. **Language.** All on-screen text in Norwegian Bokmål, short (labels ≤ 28 characters,
   `titleTakeover` 3–6 words, uppercase is applied by the component). Numbers as plain
   numbers in `value` fields; units go in `unit` ("mrd. $", "%", "mill. brukere").
5. **Variety across the show.** Use each effect at most 3 times per video;
   `titleTakeover` at most 4 times and once per segment. Atmosphere effects (`circuitBoard`,
   `matrixRain`, `alertPulse`, `noiseWave`, `mosaicGrid`, `pixelDissolve`) only when the
   story literally is about that (chips, hacking, breaking news) — never as decoration.

## Output format — motionBeats (agent, in visual_scenario)

Each `visual_scenario[i]` may carry a `motionBeats` array — the editor's plan for that
segment. The render applies each beat to the phrase that contains `cue`:

```json
"motionBeats": [
  {"cue": "kjøper aksjer i Intel for fem milliarder", "effect": "titleTakeover",
   "motionData": {"title": "NVIDIA KJØPER SEG INN I INTEL", "kicker": "5 mrd. dollar"}},
  {"cue": "tre ganger raskere enn", "effect": "ratioBars",
   "motionData": {"a": {"label": "H100", "value": 1}, "b": {"label": "B200", "value": 3}, "unit": "relativ ytelse"}}
]
```

- `cue`: 3–8 words copied **verbatim** from that segment's `scriptNo` (it is matched
  against the spoken phrase, case- and punctuation-insensitive).
- `effect`: a name from `effects.json` with `"motion": true`, or `counterMosaic` /
  `progressTimeline` (then put their data in `motionData` as `{value,label}` /
  `{milestones:[...]}`).
- 1–3 beats per segment; not every segment needs one.

## Output format — phrase level (render-time Visual Director)

Each phrase object may set `"sceneEffect": "<name>"` and, for motion effects,
`"motionData": {…}` with the shape from `effects.json`. Older effects keep their fields
(`graphicData`, `icons`, `milestones`).
