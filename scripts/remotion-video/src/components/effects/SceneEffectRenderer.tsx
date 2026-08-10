/**
 * SceneEffectRenderer — routes resolved effect type to the right component.
 * Extracts props from VisualBlock's sceneDescription/graphicData.
 */
import React from "react";
import type { SceneEffectType } from "./resolveSceneEffect";
import type { VisualBlock } from "../../compositions/DailyNewsShow";
import { AlertPulse } from "./AlertPulse";
import { MosaicGrid } from "./MosaicGrid";
import { IconStagger } from "./IconStagger";
import { CounterMosaic } from "./CounterMosaic";
import { SplitScreenPanel } from "./SplitScreenPanel";
import { PixelDissolve } from "./PixelDissolve";
import { CircuitBoard } from "./CircuitBoard";
import { ProgressTimeline, parseMilestones } from "./ProgressTimeline";
import { Globe3D } from "./Globe3D";
import { NoiseWave } from "./NoiseWave";
import { DataDashboard, extractValues } from "./DataDashboard";
import { PhotoSplitScreen } from "./PhotoSplitScreen";
import { PhotoZoomReveal } from "./PhotoZoomReveal";
import { PhotoCollage } from "./PhotoCollage";
import { PhotoCompareSlider } from "./PhotoCompareSlider";
import { PhotoVerticalScroll } from "./PhotoVerticalScroll";
import { PhotoFilterTransition } from "./PhotoFilterTransition";
import { MatrixRainScene } from "./MatrixRainScene";
import { PhotoScrollColumns } from "./PhotoScrollColumns";

interface SceneEffectRendererProps {
  type: SceneEffectType;
  block: VisualBlock;
  accentColor: string;
  /** Available images for photo-native effects */
  images?: string[];
}

export const SceneEffectRenderer: React.FC<SceneEffectRendererProps> = ({
  type,
  block,
  accentColor,
  images = [],
}) => {
  if (!type) return null;

  const desc = block.sceneDescription || "";
  const data = (block.graphicData || {}) as Record<string, unknown>;
  const primaryImage = images[0] || "";

  switch (type) {
    case "alertPulse":
      return <AlertPulse accentColor={accentColor} intensity={0.5} />;

    case "mosaicGrid":
      return (
        <MosaicGrid
          fillColor={accentColor}
          cellShape={desc.includes("circle") || desc.includes("bubble") ? "circle" : "square"}
          staggerPattern={desc.includes("diagonal") ? "diagonal" : "center-out"}
        />
      );

    case "iconStagger": {
      // Icons must name what the story is about. Substring-matching the English
      // storyboard put a palette on every "startup" and a brain on every
      // "email"; without a real list there is nothing worth showing.
      const icons = block.icons || [];
      return icons.length >= 2 ? (
        <IconStagger icons={icons} accentColor={accentColor} />
      ) : null;
    }

    case "counterMosaic": {
      const raw = String(data.value || "");
      const num = parseFloat(raw.replace(/[^0-9.,]/g, "").replace(",", ".")) || 0;
      if (!num) return null; // a giant animated zero says nothing
      const suffix = raw.includes("%") ? "%" : raw.includes("M") ? "M" : "";
      const label = String(data.label || "");
      return (
        <CounterMosaic
          value={num}
          suffix={suffix}
          label={label}
          accentColor={accentColor}
        />
      );
    }

    case "splitScreen": {
      // Empty Før/Nå panels over a dimmed photo were the worst frames in the
      // 09.08 render — no values, no effect.
      const left = data.left as { label?: string; value?: string } | undefined;
      const right = data.right as { label?: string; value?: string } | undefined;
      if (!left?.value || !right?.value) return null;
      return (
        <SplitScreenPanel
          leftLabel={left.label || "Før"}
          leftContent={left.value}
          rightLabel={right.label || "Nå"}
          rightContent={right.value}
          accentColor={accentColor}
        />
      );
    }

    case "pixelDissolve":
      return (
        <PixelDissolve
          direction={desc.includes("reassembl") || desc.includes("assembl") ? "assemble" : "dissolve"}
          color={accentColor}
          gridSize={14}
        />
      );

    case "circuitBoard":
      return (
        <CircuitBoard
          accentColor={accentColor}
          complexity={desc.includes("dense") ? "dense" : desc.includes("simple") ? "simple" : "medium"}
        />
      );

    case "progressTimeline": {
      // Real steps from the article, or nothing — the old parser fell back to
      // a generic "Start → Progress → Goal" that fit any story and told none.
      const milestones =
        block.milestones && block.milestones.length >= 2
          ? block.milestones
          : parseMilestones(desc);
      const isPlaceholder =
        milestones.length === 3 &&
        milestones[0] === "Start" &&
        milestones[2] === "Goal";
      return milestones.length >= 2 && !isPlaceholder ? (
        <ProgressTimeline milestones={milestones} accentColor={accentColor} />
      ) : null;
    }

    case "globe3D":
      return <Globe3D accentColor={accentColor} />;

    case "noiseWave":
      return <NoiseWave accentColor={accentColor} />;

    case "dataDashboard": {
      const values = extractValues(data);
      return values.length > 0 ? (
        <DataDashboard accentColor={accentColor} values={values} />
      ) : null;
    }

    case "matrixRain":
      return <MatrixRainScene accentColor={accentColor} />;

    case "photoScrollColumns":
      return images.length >= 3 ? <PhotoScrollColumns images={images} /> : null;

    // ── Photo-native effects ──

    case "photoSplitScreen":
      return images.length >= 2 ? (
        <PhotoSplitScreen
          images={images}
          accentColor={accentColor}
          layout={desc.includes("vertical") ? "vertical" : desc.includes("grid") ? "grid" : "horizontal"}
        />
      ) : null;

    case "photoZoomReveal": {
      // Parse focus point from description if possible
      let fx = 0.5, fy = 0.4;
      const focusMatch = desc.match(/focus\s*(?:on\s*)?(?:the\s*)?(\w+)/i);
      if (focusMatch) {
        const area = focusMatch[1].toLowerCase();
        if (area.includes("left")) fx = 0.25;
        if (area.includes("right")) fx = 0.75;
        if (area.includes("top")) fy = 0.25;
        if (area.includes("bottom")) fy = 0.75;
      }
      return primaryImage ? (
        <PhotoZoomReveal
          imageSrc={primaryImage}
          focusX={fx}
          focusY={fy}
          direction={desc.includes("zoom in") || desc.includes("close-up") ? "in" : "out"}
          accentColor={accentColor}
        />
      ) : null;
    }

    case "photoCollage":
      return images.length >= 2 ? (
        <PhotoCollage images={images} accentColor={accentColor} />
      ) : null;

    case "photoCompareSlider": {
      // A FØR/NÅ slider asserts that two photos show the same thing at two
      // points in time. Two unrelated news photos do not — render it only when
      // the block carries actual before/after data to label.
      const cmp =
        block.graphicType === "comparison"
          ? (block.graphicData as {
              left?: { label?: string };
              right?: { label?: string };
            } | null)
          : null;
      return images.length >= 2 && cmp ? (
        <PhotoCompareSlider
          imageBefore={images[0]}
          imageAfter={images[1]}
          labelBefore={cmp.left?.label}
          labelAfter={cmp.right?.label}
          accentColor={accentColor}
        />
      ) : null;
    }

    case "photoVerticalScroll":
      return primaryImage ? (
        <PhotoVerticalScroll
          imageSrc={primaryImage}
          direction={desc.includes("down") ? "down" : "up"}
          accentColor={accentColor}
        />
      ) : null;

    case "photoFilterTransition": {
      let mode: "grayscaleToColor" | "blurToSharp" | "darkToLight" | "sepiaToVivid" = "grayscaleToColor";
      if (desc.includes("blur")) mode = "blurToSharp";
      else if (desc.includes("dark")) mode = "darkToLight";
      else if (desc.includes("sepia")) mode = "sepiaToVivid";
      return primaryImage ? (
        <PhotoFilterTransition
          imageSrc={primaryImage}
          mode={mode}
          accentColor={accentColor}
        />
      ) : null;
    }

    default:
      return null;
  }
};
