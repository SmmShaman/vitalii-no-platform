/**
 * digest-motion effects — the renderer side of the skill in
 * scripts/video-processor/skills/digest-motion (effects.json is the catalog).
 * Each effect reads block.motionData and renders nothing without its data.
 */
import type React from "react";
import { TitleTakeover, hasTitleTakeoverData } from "./TitleTakeover";
import { KeywordCaption, hasKeywordCaptionData } from "./KeywordCaption";
import { CopyCorrection, hasCopyCorrectionData } from "./CopyCorrection";
import { QuoteMarker, hasQuoteMarkerData } from "./QuoteMarker";
import { SequentialBars, hasSequentialBarsData } from "./SequentialBars";
import { RatioBars, hasRatioBarsData } from "./RatioBars";
import { LineTrend, hasLineTrendData } from "./LineTrend";
import { CompositionStrip, hasCompositionStripData } from "./CompositionStrip";
import { TargetOverrun, hasTargetOverrunData } from "./TargetOverrun";
import { PipelineFlow, hasPipelineFlowData } from "./PipelineFlow";
import { HubRouting, hasHubRoutingData } from "./HubRouting";
import { CardCounter, hasCardCounterData } from "./CardCounter";
import { HandoffExplain, hasHandoffExplainData } from "./HandoffExplain";
import { TimelineNodes, hasTimelineNodesData } from "./TimelineNodes";
import { FunnelAbsorption, hasFunnelAbsorptionData } from "./FunnelAbsorption";
import { QuadrantPositioning, hasQuadrantPositioningData } from "./QuadrantPositioning";
import { GroupedBars, hasGroupedBarsData } from "./GroupedBars";
import { CostLedger, hasCostLedgerData } from "./CostLedger";
import { FeatureMatrix, hasFeatureMatrixData } from "./FeatureMatrix";
import { PercentRing, hasPercentRingData } from "./PercentRing";
import { CornerTags, hasCornerTagsData } from "./CornerTags";
import { StatusFocus, hasStatusFocusData } from "./StatusFocus";
import { RegionCallout, hasRegionCalloutData } from "./RegionCallout";

type MotionProps = { data: Record<string, unknown>; accentColor: string; images?: string[] };
type MotionEntry = { Component: React.FC<MotionProps>; hasData: (d: Record<string, unknown>) => boolean };

export const MOTION_EFFECTS = {
  titleTakeover: { Component: TitleTakeover, hasData: hasTitleTakeoverData },
  keywordCaption: { Component: KeywordCaption, hasData: hasKeywordCaptionData },
  copyCorrection: { Component: CopyCorrection, hasData: hasCopyCorrectionData },
  quoteMarker: { Component: QuoteMarker, hasData: hasQuoteMarkerData },
  sequentialBars: { Component: SequentialBars, hasData: hasSequentialBarsData },
  ratioBars: { Component: RatioBars, hasData: hasRatioBarsData },
  lineTrend: { Component: LineTrend, hasData: hasLineTrendData },
  compositionStrip: { Component: CompositionStrip, hasData: hasCompositionStripData },
  targetOverrun: { Component: TargetOverrun, hasData: hasTargetOverrunData },
  pipelineFlow: { Component: PipelineFlow, hasData: hasPipelineFlowData },
  hubRouting: { Component: HubRouting, hasData: hasHubRoutingData },
  cardCounter: { Component: CardCounter, hasData: hasCardCounterData },
  handoffExplain: { Component: HandoffExplain, hasData: hasHandoffExplainData },
  timelineNodes: { Component: TimelineNodes, hasData: hasTimelineNodesData },
  funnelAbsorption: { Component: FunnelAbsorption, hasData: hasFunnelAbsorptionData },
  quadrantPositioning: { Component: QuadrantPositioning, hasData: hasQuadrantPositioningData },
  groupedBars: { Component: GroupedBars, hasData: hasGroupedBarsData },
  costLedger: { Component: CostLedger, hasData: hasCostLedgerData },
  featureMatrix: { Component: FeatureMatrix, hasData: hasFeatureMatrixData },
  percentRing: { Component: PercentRing, hasData: hasPercentRingData },
  cornerTags: { Component: CornerTags, hasData: hasCornerTagsData },
  statusFocus: { Component: StatusFocus, hasData: hasStatusFocusData },
  regionCallout: { Component: RegionCallout, hasData: hasRegionCalloutData },
} satisfies Record<string, MotionEntry>;

export type MotionEffectType = keyof typeof MOTION_EFFECTS;

export const isMotionEffect = (t: string | null | undefined): t is MotionEffectType =>
  !!t && Object.prototype.hasOwnProperty.call(MOTION_EFFECTS, t);
