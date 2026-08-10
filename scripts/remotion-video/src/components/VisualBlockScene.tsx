/**
 * VisualBlockScene — phrase-level visual composition.
 *
 * Drop-in replacement for ContentScene when visualBlocks[] is provided.
 * Each block (2-4s) gets its own text effect, graphic overlay,
 * and background treatment — creating a "visual event stream"
 * instead of a single static image with Ken Burns.
 *
 * Layer stack (bottom → top):
 *   1. Background: image cycling (driven by triggerImageChange) or video
 *   2. Gradient overlay for text readability
 *   3. Per-block: phrase text + motion graphics (Sequence per block)
 *   4. Persistent: subtitles, category badge, lower third, particles
 */
import React from "react";
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
} from "remotion";
import { AnimatedSubtitles, type SubtitleEntry } from "./AnimatedSubtitles";
import { AnimatedCounter } from "./AnimatedCounter";
import { TypewriterText } from "./TypewriterText";
import { SplitTextReveal } from "./SplitTextReveal";
import { LowerThird } from "./LowerThird";
import { CategoryBadge } from "./CategoryBadge";
import {
  colors,
  gradients,
  typography,
  kenBurns,
  glass,
  fadeTiming,
  clampBoth,
} from "../design-system";
import { getMoodConfig } from "../design-system/moods";
import { Particles, Spawner, Behavior } from "remotion-bits";
import type { VisualBlock } from "../compositions/DailyNewsShow";
import { resolveSceneEffect, SceneEffectRenderer } from "./effects";
import {
  BeforeAfterChart,
  DeltaFigure,
  SeriesBarChart,
  ShareDonut,
} from "./DataViz";
import {
  IdentityBar,
  FactStrip,
  QuoteCard,
  buildFactLines,
  type FactSheet,
} from "./NewsIdentity";

// ── Props ──

export interface VisualBlockSceneProps {
  imageSrc: string;
  videoSrc?: string;
  subtitles?: SubtitleEntry[];
  accentColor?: string;
  headline?: string;
  category?: string;
  segmentNumber?: number;
  totalSegments?: number;
  mood?: string;
  alternateImages?: string[];
  visualBlocks: VisualBlock[];
  /** Researched facts for this story — identity bar, fact strip, quote */
  factSheet?: FactSheet;
}

// ── Pan direction lookup (per-image variety) ──

const PAN_DIRS = [
  { px: -1, py: -1 },
  { px: 1, py: -0.5 },
  { px: -0.5, py: 1 },
  { px: 1, py: 1 },
  { px: 0, py: -1 },
  { px: -1, py: 0 },
];

// ══════════════════════════════════════════════════════════════════
//  Main component
// ══════════════════════════════════════════════════════════════════

export const VisualBlockScene: React.FC<VisualBlockSceneProps> = ({
  imageSrc,
  videoSrc,
  subtitles = [],
  accentColor = colors.brand,
  headline,
  category,
  segmentNumber,
  totalSegments,
  mood,
  alternateImages,
  visualBlocks,
  factSheet,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();
  const isVertical = height > width;
  const moodCfg = getMoodConfig(mood);

  const resolve = (src: string | undefined) =>
    src ? (src.startsWith("http") ? src : staticFile(src)) : "";

  const resolvedVideo = resolve(videoSrc);
  const hasVideo = !!resolvedVideo;

  // ── Image list ──
  const allImages = !hasVideo
    ? [imageSrc, ...(alternateImages || [])].map(resolve).filter(Boolean)
    : [];
  const hasImages = allImages.length > 0;

  // ── Per-phrase images: each block can have its own contextual photo ──
  // Priority: block.phraseImageSrc > cycling from allImages
  const phraseImages: (string | null)[] = visualBlocks.map(b =>
    b.phraseImageSrc ? resolve(b.phraseImageSrc) : null,
  );

  // ── One background schedule, minimum three seconds per picture ──
  //
  // Two separate mechanisms used to fight over the background: a clock rotating
  // `allImages`, and per-phrase photos swapped on every block. A block can be
  // 1.5s long, so a phrase photo could flash and vanish — the half-second
  // flicker the owner kept seeing. Both now feed ONE schedule whose entries are
  // never shorter than MIN_DWELL_SECONDS.
  const MIN_DWELL_SECONDS = 3;
  const segmentSeconds = durationInFrames / fps;

  const backgroundSchedule: { start: number; src: string }[] = [];
  if (allImages.length > 0 || phraseImages.some(Boolean)) {
    let clock = 0;
    const nextClockImage = () =>
      allImages.length > 0 ? allImages[clock++ % allImages.length] : "";

    for (let t = 0; t < segmentSeconds; t += MIN_DWELL_SECONDS) {
      // Which phrase is speaking when this window opens?
      let blockAt = 0;
      for (let i = 0; i < visualBlocks.length; i++) {
        if (t >= visualBlocks[i].startTime) blockAt = i;
      }
      const src = phraseImages[blockAt] || nextClockImage();
      if (!src) continue;
      const last = backgroundSchedule[backgroundSchedule.length - 1];
      if (last && last.src === src) continue; // extend, don't re-cut
      backgroundSchedule.push({ start: t, src });
    }
  }

  const scheduleIndexAt = (t: number) => {
    let idx = 0;
    for (let i = 0; i < backgroundSchedule.length; i++) {
      if (t >= backgroundSchedule[i].start) idx = i;
    }
    return idx;
  };

  // Find active block for current frame
  const currentTime = frame / fps;
  let activeIdx = 0;
  for (let i = 0; i < visualBlocks.length; i++) {
    if (currentTime >= visualBlocks[i].startTime) activeIdx = i;
  }

  // Active background comes from the schedule, never straight from the block
  const schedIdx = scheduleIndexAt(currentTime);
  const currentBg = backgroundSchedule[schedIdx]?.src || "";
  const nextBg = backgroundSchedule[schedIdx + 1]?.src || currentBg;

  // When a scene effect is active, dim the background image so effects are visible
  const activeBlockHasEffect = resolveSceneEffect(visualBlocks[activeIdx] || {} as VisualBlock) !== null;
  const bgDimFactor = activeBlockHasEffect ? 0.3 : 1.0; // 30% opacity when effect active

  // Crossfade into the next scheduled picture
  const XFADE = 12;
  const dwellEnd =
    backgroundSchedule[schedIdx + 1]?.start ?? segmentSeconds + 999;
  const framesLeft = (dwellEnd - currentTime) * fps;
  const isXfading = framesLeft > 0 && framesLeft < XFADE && nextBg !== currentBg;
  // interpolate requires monotonically increasing inputRange: [0, XFADE]
  // framesElapsedInCrossfade goes from 0 (start) to XFADE (end)
  const framesElapsedInXfade = XFADE - framesLeft;
  const xfadeProgress = isXfading
    ? interpolate(framesElapsedInXfade, [0, XFADE], [0, 1], clampBoth)
    : 0;

  // ── Background effect (from active block) ──
  const bgEffect = visualBlocks[activeIdx]?.backgroundEffect ?? "kenBurns";
  const progress = interpolate(frame, [0, durationInFrames], [0, 1], clampBoth);

  const bgTransform = (effect: string, idx: number): string => {
    const dir = PAN_DIRS[idx % PAN_DIRS.length];
    const moodCfg = mood ? getMoodConfig(mood) : null;

    switch (effect) {
      case "zoomPulse": {
        const phase = Math.sin(progress * Math.PI);
        return `scale(${1 + phase * 0.2})`;
      }
      case "slowPan": {
        const px = dir.px * progress * 4;
        return `scale(1.05) translate(${px}%, 0%)`;
      }
      case "colorShift":
        return `scale(${1 + progress * 0.1})`;
      case "pushIn": {
        // Steady continuous dolly-in, no pulse — deliberate camera push for gravity/tension
        const s = interpolate(progress, [0, 1], [1, 1.18], clampBoth);
        return `scale(${s})`;
      }
      case "parallaxDrift": {
        // Diagonal ease-in-out drift, distinct curve from kenBurns' linear pan
        const t = interpolate(progress, [0, 0.5, 1], [0, 1, 0], clampBoth);
        const px = dir.px * t * 3;
        const py = dir.py * t * 2;
        return `scale(1.08) translate(${px}%, ${py}%)`;
      }
      case "pulseGlow": {
        // Near-static frame with a very subtle breathing scale — lets filter pulse read clearly
        const phase = Math.sin(progress * Math.PI * 2);
        return `scale(${1.03 + phase * 0.015})`;
      }
      case "kenBurns":
      default: {
        const scaleEnd = moodCfg?.kenBurnsScale ?? kenBurns.scaleRange.end;
        const s = interpolate(progress, [0, 1], [1, scaleEnd], clampBoth);
        const px = dir.px * interpolate(progress, [0, 1], [0, 1.2], clampBoth);
        const py = dir.py * interpolate(progress, [0, 1], [0, 0.7], clampBoth);
        return `scale(${s}) translate(${px}%, ${py}%)`;
      }
    }
  };

  const bgFilter = (effect: string): string | undefined => {
    if (effect === "colorShift") {
      const hue = interpolate(progress, [0, 1], [0, 30], clampBoth);
      return `hue-rotate(${hue}deg) saturate(1.2)`;
    }
    if (effect === "pulseGlow") {
      const phase = Math.sin(progress * Math.PI * 2);
      const brightness = 1 + phase * 0.12;
      return `brightness(${brightness}) saturate(1.1)`;
    }
    return undefined;
  };

  // ── Block windows, clamped so they never overlap ──
  // TTS phrase timings can run past the next phrase's start. Two overlapping
  // Sequences meant two narration lines drawn on top of each other — the
  // doubled, unreadable text on the Lørenskog and Flamingo frames.
  const blockWindow = (i: number) => {
    const startF = Math.round(visualBlocks[i].startTime * fps);
    const nextStartF =
      i + 1 < visualBlocks.length
        ? Math.round(visualBlocks[i + 1].startTime * fps)
        : durationInFrames;
    const natural = Math.round(visualBlocks[i].duration * fps);
    return { startF, durF: Math.max(1, Math.min(natural, nextStartF - startF)) };
  };

  // ── Researched context timing ──
  // The strip needs reading time (~1.6s per line); the quote takes the middle
  // of the segment, where the narration is deep into the story.
  // Figures this segment already shows on a data card — the strip must not
  // repeat them.
  const cardValues: string[] = [];
  for (const b of visualBlocks) {
    const d = b.graphicData as Record<string, any> | null | undefined;
    if (!d) continue;
    if (d.value != null) cardValues.push(String(d.value));
    if (d.left?.value != null) cardValues.push(String(d.left.value));
    if (d.right?.value != null) cardValues.push(String(d.right.value));
    if (Array.isArray(d.items)) {
      for (const it of d.items) if (it?.value != null) cardValues.push(String(it.value));
    }
  }
  const factLines = buildFactLines(factSheet, cardValues);
  const factStripSeconds = Math.min(
    Math.max(4, factLines.length * 1.6 + 1.5),
    Math.max(4, segmentSeconds * 0.45),
  );
  const quoteSeconds = Math.min(5.5, segmentSeconds * 0.35);
  const quoteStartFrame = Math.round(
    (Math.max(4 + factStripSeconds + 0.5, segmentSeconds * 0.5)) * fps,
  );
  const quoteFrames =
    quoteStartFrame + Math.round(quoteSeconds * fps) <= durationInFrames
      ? Math.round(quoteSeconds * fps)
      : 0;

  // ── Fade transitions ──
  const fadeIn = interpolate(
    frame,
    [0, fadeTiming.fadeInFrames],
    [0, 1],
    clampBoth,
  );
  const fadeOut = interpolate(
    frame,
    [durationInFrames - fadeTiming.fadeOutFrames.standard, durationInFrames],
    [1, 0],
    clampBoth,
  );

  return (
    <AbsoluteFill style={{ opacity: fadeIn * fadeOut }}>
      {/* ─── Layer 1: Background ─── */}
      {hasVideo ? (
        <OffthreadVideo
          src={resolvedVideo}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          volume={0}
        />
      ) : currentBg ? (
        <>
          <Img
            key={`vb-bg-${currentBg}`}
            src={currentBg}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: bgTransform(bgEffect, schedIdx),
              filter: [bgFilter(bgEffect), activeBlockHasEffect ? `brightness(${bgDimFactor})` : ''].filter(Boolean).join(' ') || undefined,
              opacity: isXfading ? 1 - xfadeProgress : 1,
            }}
          />
          {isXfading && (
            <Img
              key={`vb-bg-next-${nextBg}`}
              src={nextBg}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: bgTransform(bgEffect, schedIdx + 1),
                filter: bgFilter(bgEffect),
                opacity: xfadeProgress,
              }}
            />
          )}
        </>
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: `linear-gradient(135deg, ${accentColor}88 0%, ${colors.background} 60%, ${accentColor}44 100%)`,
          }}
        />
      )}

      {/* ─── Layer 1.2: Per-block b-roll video backgrounds (live footage) ─── */}
      {!hasVideo &&
        visualBlocks.map((block, bi) => {
          if (!block.bRollVideoSrc) return null;
          const { startF, durF } = blockWindow(bi);
          return (
            <Sequence key={`broll-${bi}`} from={startF} durationInFrames={durF}>
              <BRollBackground src={resolve(block.bRollVideoSrc)} durationInFrames={durF} />
            </Sequence>
          );
        })}

      {/* ─── Layer 1.5: Gradient overlay (mood-driven darkness) ─── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(to bottom, rgba(0,0,0,${moodCfg.overlayDarkness * 0.4}) 0%, rgba(0,0,0,${moodCfg.overlayDarkness * 0.1}) 30%, rgba(0,0,0,${moodCfg.overlayDarkness * 0.2}) 70%, rgba(0,0,0,${moodCfg.overlayDarkness * 0.9}) 100%)`,
        }}
      />

      {/* ─── Layer 2: Per-block text + graphics + key phrase callouts ─── */}
      {visualBlocks.map((block, bi) => {
        const { startF, durF } = blockWindow(bi);
        return (
          <Sequence key={bi} from={startF} durationInFrames={durF}>
            <BlockContent
              block={block}
              accentColor={accentColor}
              isVertical={isVertical}
              moodTempo={moodCfg.tempo}
              images={allImages}
              blockIndex={bi}
              allBlocks={visualBlocks}
              // The quote card owns the centre of the screen while it is up
              muteText={
                quoteFrames > 0 &&
                startF < quoteStartFrame + quoteFrames &&
                startF + durF > quoteStartFrame
              }
            />
          </Sequence>
        );
      })}

      {/* Subtitles removed — key data shown via KeyPhraseCallout in BlockContent.
          Full subtitles remain in ContentScene fallback path. */}

      {/* ─── Layer 4: CategoryBadge — only first 2 seconds ─── */}
      {category && (
        <div style={{
          opacity: interpolate(frame, [0, 5, Math.round(fps * 2), Math.round(fps * 2.5)], [0, 1, 1, 0], clampBoth),
        }}>
          <CategoryBadge category={category} accentColor={accentColor} />
        </div>
      )}

      {/* ─── Layer 4: LowerThird — only first 3 seconds, then hide ─── */}
      {headline && segmentNumber != null && totalSegments != null && (
        <div style={{
          opacity: interpolate(frame, [0, 8, Math.round(fps * 3), Math.round(fps * 3.5)], [0, 1, 1, 0], clampBoth),
        }}>
          <LowerThird
            headline={headline}
            category={category}
            segmentNumber={segmentNumber}
            totalSegments={totalSegments}
            accentColor={accentColor}
          />
        </div>
      )}

      {/* ─── Layer 5: Researched context — who, where, figures, quote ─── */}
      {headline && (
        <Sequence from={Math.round(fps * 3.5)}>
          <IdentityBar
            headline={headline}
            source={factSheet?.source}
            place={factSheet?.where?.place || factSheet?.where?.country}
            accentColor={accentColor}
            isVertical={isVertical}
          />
        </Sequence>
      )}

      {factLines.length > 0 && (
        <Sequence
          from={Math.round(fps * 4)}
          durationInFrames={Math.round(fps * factStripSeconds)}
        >
          <FactStrip
            lines={factLines}
            accentColor={accentColor}
            isVertical={isVertical}
          />
        </Sequence>
      )}

      {factSheet?.quote && quoteFrames > 0 && (
        <Sequence from={quoteStartFrame} durationInFrames={quoteFrames}>
          <QuoteCard
            text={factSheet.quote.text}
            speaker={factSheet.quote.speaker}
            accentColor={accentColor}
            isVertical={isVertical}
          />
        </Sequence>
      )}

      {/* Ambient particles (mood-driven density: urgent → more, analytical → fewer) */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          opacity: moodCfg.tempo >= 1.2 ? 0.22 : moodCfg.tempo <= 0.9 ? 0.08 : 0.15,
          zIndex: 2,
        }}
      >
        <Particles startFrame={0}>
          <Spawner
            rate={moodCfg.tempo >= 1.2 ? 0.8 : moodCfg.tempo <= 0.9 ? 0.3 : 0.5}
            max={moodCfg.tempo >= 1.2 ? 25 : moodCfg.tempo <= 0.9 ? 8 : 15}
          >
            <div
              style={{
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: "white",
              }}
            />
          </Spawner>
          <Behavior
            gravity={{ y: -0.02 }}
            opacity={[0, 0.8, 0.4, 0]}
            scale={{ start: 0.5, end: 1.5 }}
          />
        </Particles>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════
//  BRollBackground — full-bleed muted stock footage for one block
// ══════════════════════════════════════════════════════════════════

const BRollBackground: React.FC<{
  src: string;
  durationInFrames: number;
}> = ({ src, durationInFrames }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [0, 8, Math.max(9, durationInFrames - 8), durationInFrames],
    [0, 1, 1, 0],
    clampBoth,
  );
  // Slow push-in so the footage never feels static even on calm clips
  const scale = interpolate(frame, [0, durationInFrames], [1.02, 1.1], clampBoth);
  return (
    <AbsoluteFill style={{ opacity }}>
      <OffthreadVideo
        src={src}
        volume={0}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale})`,
        }}
      />
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════
//  BlockContent — text effect + graphic overlay for a single block
// ══════════════════════════════════════════════════════════════════

// ── Key phrase detection: only show numbers, names, quotes — not every word ──

type CalloutType = "number" | "name" | "quote" | null;
interface CalloutInfo { type: CalloutType; text: string; label?: string }

function detectKeyPhrase(
  block: VisualBlock,
  blockIndex: number,
  allBlocks: VisualBlock[],
): CalloutInfo | null {
  const text = block.phraseText || "";

  // Skip if block already has graphic data (GraphicCard handles it)
  if (block.graphicType !== "none" && block.graphicData != null) return null;

  // 1. Numbers/percentages/money → large callout
  const numMatch = text.match(
    /(\d[\d\s.,]*\d?)\s*(%|prosent|percent|million|milliard|billion|tusen|kroner|dollar|euro|mrd|mill|kr)/i,
  );
  if (numMatch) {
    return { type: "number", text: numMatch[0].trim() };
  }

  // Name callouts are gone. The regex took any capitalised word it met, so the
  // 09.08 render captioned frames with "Deretter", "Selskapene", "Dette" and
  // "Texas Det" — sentence openers and fragments, not names. Real people and
  // organisations now come from the researched fact sheet (FactStrip), which
  // knows a name from a first word.

  // 3. Quoted text → quote callout
  const quoteMatch = text.match(/["«""]([^"»""]{10,})["»""]/);
  if (quoteMatch) {
    return { type: "quote", text: quoteMatch[1].trim() };
  }

  return null;
}

// ── KeyPhraseCallout: renders number/name/quote overlays ──

const KeyPhraseCallout: React.FC<{
  callout: CalloutInfo;
  accentColor: string;
  isVertical: boolean;
}> = ({ callout, accentColor, isVertical }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 14, stiffness: 80, mass: 0.7 } });

  if (callout.type === "number") {
    return (
      <div
        style={{
          position: "absolute",
          top: isVertical ? "30%" : "25%",
          left: "10%",
          right: "10%",
          textAlign: "center",
          zIndex: 6,
          transform: `scale(${scale})`,
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(12px)",
            borderRadius: 16,
            padding: isVertical ? "20px 32px" : "16px 40px",
            borderLeft: `4px solid ${accentColor}`,
          }}
        >
          <span
            style={{
              fontSize: isVertical ? 72 : 64,
              fontWeight: 800,
              color: "#fff",
              fontFamily: "Comfortaa, sans-serif",
            }}
          >
            {callout.text}
          </span>
        </div>
      </div>
    );
  }

  if (callout.type === "name") {
    const slideIn = interpolate(frame, [0, 10], [60, 0], clampBoth);
    return (
      <div
        style={{
          position: "absolute",
          bottom: isVertical ? "30%" : "22%",
          left: isVertical ? 24 : 40,
          zIndex: 6,
          transform: `translateX(-${slideIn}px)`,
          opacity: scale,
        }}
      >
        <div
          style={{
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(12px)",
            borderRadius: 8,
            padding: "12px 24px",
            borderLeft: `3px solid ${accentColor}`,
          }}
        >
          <span
            style={{
              fontSize: isVertical ? 36 : 30,
              fontWeight: 700,
              color: "#fff",
              fontFamily: "Comfortaa, sans-serif",
            }}
          >
            {callout.text}
          </span>
        </div>
      </div>
    );
  }

  if (callout.type === "quote") {
    return (
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "8%",
          right: "8%",
          textAlign: "center",
          zIndex: 6,
          opacity: scale,
          transform: `scale(${scale})`,
        }}
      >
        <div
          style={{
            width: 40,
            height: 3,
            backgroundColor: accentColor,
            margin: "0 auto 16px",
            borderRadius: 2,
          }}
        />
        <span
          style={{
            fontSize: isVertical ? 32 : 28,
            fontWeight: 700,
            color: "#fff",
            fontFamily: "Comfortaa, sans-serif",
            lineHeight: 1.3,
            fontStyle: "italic",
            textShadow: "0 2px 12px rgba(0,0,0,0.8)",
          }}
        >
          &ldquo;{callout.text}&rdquo;
        </span>
      </div>
    );
  }

  return null;
};

// ── BlockContent — renders graphic, scene effect, or key phrase callout ──

const BlockContent: React.FC<{
  block: VisualBlock;
  accentColor: string;
  isVertical: boolean;
  moodTempo?: number;
  images?: string[];
  blockIndex: number;
  allBlocks: VisualBlock[];
  /** True while the quote card occupies the middle of the frame */
  muteText?: boolean;
}> = ({ block, accentColor, isVertical, moodTempo = 1.0, images = [], blockIndex, allBlocks, muteText = false }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const blockFade = Math.max(4, Math.round(8 / moodTempo));
  const fadeIn = interpolate(frame, [0, blockFade], [0, 1], clampBoth);
  const fadeOut = interpolate(
    frame,
    [durationInFrames - blockFade, durationInFrames],
    [1, 0],
    clampBoth,
  );
  const opacity = fadeIn * fadeOut;

  const hasGraphic =
    block.graphicType !== "none" && block.graphicData != null;

  // A data card and a scene effect on the same block fight each other — the
  // 09.08 render showed "1 200" in the card and "1200" in a counterMosaic at
  // once. The card carries the real value, so it wins.
  const resolvedEffect = resolveSceneEffect(block);
  const sceneEffect = hasGraphic ? null : resolvedEffect;
  const hasSceneEffect = sceneEffect !== null;

  // For narrative blocks (no graphic, no scene effect), detect key phrases
  const callout =
    !hasGraphic && !hasSceneEffect
      ? detectKeyPhrase(block, blockIndex, allBlocks)
      : null;

  // The narration sentence is shown only on blocks that carry nothing else.
  // Printing it beside a data card produced the "33 millioner" overlap — the
  // same figure twice, in two overlapping boxes.
  //
  // A fragment is never worth printing: the owner kept seeing lone connectives
  // ("Deretter", "Selskapene", "Dette") on screen. Anything under four words
  // stays off — narration already carries it.
  const phraseWordCount = (block.phraseText || "").trim().split(/\s+/).filter(Boolean).length;
  const phraseIsSubstantial = phraseWordCount >= 4;
  const showText =
    !hasGraphic && !hasSceneEffect && callout === null && phraseIsSubstantial && !muteText;

  return (
    <AbsoluteFill style={{ opacity, zIndex: 5 }}>
      {/* Scene effect layer */}
      {hasSceneEffect && (
        <div style={{ position: "absolute", inset: 0, zIndex: 4 }}>
          <SceneEffectRenderer
            type={sceneEffect}
            block={block}
            accentColor={accentColor}
            images={images}
          />
        </div>
      )}

      {/* Phrase text (only with graphic cards) */}
      {showText && (
        <PhraseText
          block={block}
          isVertical={isVertical}
          hasGraphic={hasGraphic || hasSceneEffect}
        />
      )}

      {/* Motion graphic */}
      {hasGraphic && (
        <div
          style={{
            position: "absolute",
            top: isVertical ? "34%" : "20%",
            right: isVertical ? 20 : 56,
            width: isVertical ? "84%" : "42%",
            zIndex: 8,
          }}
        >
          <GraphicCard block={block} accentColor={accentColor} />
        </div>
      )}

      {/* Key phrase callout (numbers, names, quotes — NOT every word) */}
      {callout && (
        <KeyPhraseCallout
          callout={callout}
          accentColor={accentColor}
          isVertical={isVertical}
        />
      )}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════
//  PhraseText — routes to the right text animation component
// ══════════════════════════════════════════════════════════════════

const PhraseText: React.FC<{
  block: VisualBlock;
  isVertical: boolean;
  hasGraphic: boolean;
}> = ({ block, isVertical, hasGraphic }) => {
  const frame = useCurrentFrame();
  const text = block.phraseText;
  if (!text) return null;

  const fontSize = isVertical ? typography.scale.h5 : typography.scale.h4;

  const container: React.CSSProperties = {
    position: "absolute",
    top: hasGraphic ? "8%" : "20%",
    left: "5%",
    right: hasGraphic && !isVertical ? "40%" : "5%",
    display: "flex",
    justifyContent: "center",
    zIndex: 6,
  };

  switch (block.textEffect) {
    case "typewriter":
      return (
        <div style={container}>
          <TypewriterText text={text} fontSize={fontSize} charSpeed={2} />
        </div>
      );
    case "fadeUp":
      return (
        <div style={container}>
          <SplitTextReveal
            text={text}
            fontSize={fontSize}
            effect="fadeUp"
            staggerFrames={3}
          />
        </div>
      );
    case "blurReveal": {
      const blur = interpolate(frame, [0, 15], [12, 0], clampBoth);
      const op = interpolate(frame, [0, 12], [0, 1], clampBoth);
      return (
        <div style={container}>
          <div
            style={{
              opacity: op,
              filter: `blur(${blur}px)`,
              fontSize,
              fontWeight: 700,
              color: colors.text,
              fontFamily: typography.fontFamily.primary,
              textAlign: "center",
              lineHeight: 1.3,
              textShadow: "0 2px 12px rgba(0,0,0,0.8)",
            }}
          >
            {text}
          </div>
        </div>
      );
    }
    case "springPop":
      return (
        <div style={container}>
          <SplitTextReveal
            text={text}
            fontSize={fontSize}
            effect="scaleIn"
            staggerFrames={3}
          />
        </div>
      );
    case "splitScale":
      return (
        <div style={container}>
          <SplitTextReveal
            text={text}
            fontSize={fontSize}
            effect="scaleIn"
            staggerFrames={5}
          />
        </div>
      );
    case "wordFade":
      return (
        <div style={container}>
          <SplitTextReveal
            text={text}
            fontSize={fontSize}
            effect="fadeIn"
            staggerFrames={2}
          />
        </div>
      );
    case "slideIn":
      return (
        <div style={container}>
          <SplitTextReveal
            text={text}
            fontSize={fontSize}
            effect="slideIn"
            staggerFrames={4}
          />
        </div>
      );
    case "glitchIn": {
      const settle = interpolate(frame, [0, 10], [1, 0], clampBoth);
      const jitterX = settle * (Math.sin(frame * 3.1) * 6);
      const skew = settle * (Math.sin(frame * 2.3) * 4);
      const op = interpolate(frame, [0, 6], [0, 1], clampBoth);
      return (
        <div style={container}>
          <div
            style={{
              opacity: op,
              transform: `translateX(${jitterX}px) skewX(${skew}deg)`,
              fontSize,
              fontWeight: 700,
              color: colors.text,
              fontFamily: typography.fontFamily.primary,
              textAlign: "center",
              lineHeight: 1.3,
              textShadow: settle > 0.3
                ? `${jitterX > 0 ? 2 : -2}px 0 rgba(255,0,80,0.6), ${jitterX > 0 ? -2 : 2}px 0 rgba(0,200,255,0.6)`
                : "0 2px 12px rgba(0,0,0,0.8)",
            }}
          >
            {text}
          </div>
        </div>
      );
    }
    default:
      return null;
  }
};

// ══════════════════════════════════════════════════════════════════
//  GraphicCard — glass-morphism panel with animated data viz
// ══════════════════════════════════════════════════════════════════

const GraphicCard: React.FC<{
  block: VisualBlock;
  accentColor: string;
}> = ({ block, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideIn = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 80, mass: 0.7 },
  });
  const tx = (1 - slideIn) * 60;

  const data = block.graphicData as Record<string, unknown> | null;
  if (!data) return null;

  // Render the panel only if something actually goes inside it. An empty card
  // is a dark rectangle sitting on the photo for no reason — the "empty spaces"
  // the owner reported.
  if (!dataGraphicHasContent(block.graphicType, data)) return null;

  const panelStyle: React.CSSProperties = {
    position: "relative",
    background: "rgba(0, 0, 0, 0.75)",
    backdropFilter: `blur(${glass.blurStrong}px)`,
    border: `1px solid ${glass.borderStrong}`,
    borderRadius: glass.borderRadiusLarge,
    padding: "28px 24px",
    transform: `translateX(${tx}px)`,
    overflow: "hidden",
  };

  const accentLineStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: "10%",
    right: "10%",
    height: 3,
    borderRadius: 2,
    background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
  };

  return (
    <div style={panelStyle}>
      <div style={accentLineStyle} />

      <DataGraphic type={block.graphicType} data={data} accentColor={accentColor} />
    </div>
  );
};

/** Is there a real value behind this card, or would it draw an empty box? */
function dataGraphicHasContent(
  type: string,
  data: Record<string, unknown>,
): boolean {
  const hasDigits = (v: unknown) => /\d/.test(String(v ?? ""));

  if (type === "comparison") {
    const l = data.left as { value?: unknown } | undefined;
    const r = data.right as { value?: unknown } | undefined;
    return hasDigits(l?.value) && hasDigits(r?.value);
  }
  if (type === "barChart") {
    const items = Array.isArray(data.items) ? data.items : [];
    return items.filter((it: any) => hasDigits(it?.value)).length >= 2;
  }
  return hasDigits(data.value);
}

// ── DataGraphic — routes graphicData to a real chart form ──

const DataGraphic: React.FC<{
  type: string;
  data: Record<string, unknown>;
  accentColor: string;
}> = ({ type, data, accentColor }) => {
  const label = typeof data.label === "string" ? data.label : undefined;
  const rawValue =
    typeof data.value === "string" || typeof data.value === "number"
      ? String(data.value)
      : "";

  // Before / after → two bars on one scale + change badge
  if (type === "comparison" && data.left && data.right) {
    const left = data.left as { label?: string; value?: string };
    const right = data.right as { label?: string; value?: string };
    return (
      <BeforeAfterChart
        left={{ label: left.label || "Før", value: String(left.value ?? "") }}
        right={{ label: right.label || "Nå", value: String(right.value ?? "") }}
      />
    );
  }

  // Series → real bar chart with direct labels
  if (type === "barChart" && Array.isArray(data.items)) {
    const items = (data.items as { label?: string; value?: string | number }[])
      .filter((it) => it && it.value != null)
      .map((it) => ({ label: it.label || "", value: it.value as string | number }));
    if (items.length >= 2) {
      return <SeriesBarChart items={items} accentColor={accentColor} />;
    }
  }

  // Share of a whole → donut (only for real 0–100 shares)
  const pctMatch = rawValue.match(/^(\d+[.,]?\d*)\s*%$/);
  if (pctMatch) {
    const pct = parseFloat(pctMatch[1].replace(",", "."));
    if (pct > 0 && pct <= 100) {
      return <ShareDonut percent={pct} label={label} accentColor={accentColor} />;
    }
  }

  // Everything else → hero figure, with direction when the block carries one
  const changePct =
    typeof data.changePct === "number" ? (data.changePct as number) : null;
  return (
    <DeltaFigure
      value={rawValue}
      label={label}
      changePct={changePct}
      accentColor={accentColor}
    />
  );
};

