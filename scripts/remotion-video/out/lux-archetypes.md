# Art-direction log — one row per clip written in bright v2

Purpose: stop three clips in a row from being staged the same way. Before writing a clip,
read the last rows here; after writing, append yours. Rules live in `lux-batch-instructions.md`
(STEP 0). Archetypes: 0 split-duel · 1 timeline · 2 zoom-in · 3 card-deck · 4 flow-map ·
5 ledger · 6 sidebar · 7 hero-number. Moods: dawn · sand · slate · mint · violet.

| date | feature id | file | archetype | mood |
|---|---|---|---|---|
| 2026-08-30 | deb59d2d (p08) | FeatureVideoFactoryV3.tsx | 7 hero-number | violet |
| 2026-08-30 | p09 | FeatureVisualDirector.tsx | 1 timeline | slate |
| 2026-08-30 | p10 | FeatureDailyDigest.tsx | 2 zoom-in | dawn |
| 2026-08-30 | p11 | FeatureAiThumbnails.tsx | 3 card-deck | sand |
| 2026-08-30 | p12 | FeatureNeuralTts.tsx | 4 flow-map | slate |
| 2026-08-30 | p13 | FeatureCrossPlatformDistribution.tsx | 5 ledger | mint |
| 2026-08-30 | p14 | FeatureLinkedinNativeUpload.tsx | 6 sidebar | violet |
| 2026-08-31 | p15 | FeatureInstagramPublishing.tsx | 7 hero-number | dawn |
| 2026-09-03 | p18 | FeatureTelegramModeration.tsx | 1 timeline | mint |
| 2026-09-03 | p19 | FeatureCreativeBuilder.tsx | 2 zoom-in | sand |
| 2026-09-03 | p20 | FeatureAutonomousPublishing.tsx | 3 card-deck | dawn |

**From p15 on, clips are VOICE-SYNCED (owner rule, 2026-08-31).** The 15 s silent loop is
retired for new clips: the voiceover is written and measured first, and `durationInFrames`
plus every beat window comes from those measurements (p15 = 907 frames, 5 beats). A clip
that ends before the narration does, and is looped to cover the gap, shows the viewer one
thing while telling them another — that is now a defect. See STEP 0b in
`lux-batch-instructions.md` and `vo-scripts/p15-beats.py`.

**Legacy note:** the 35 bright clips written between 2026-08-21 and 2026-08-29 all used the
same staging (centered headline + zone panels + 3 icon cards + 2 result cards) and the dawn
palette. They are NOT logged row by row — treat "centered/dawn" as used by the previous two
clips whenever the log is otherwise empty.
