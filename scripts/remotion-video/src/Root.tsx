/**
 * Remotion Root -- registers all available compositions.
 *
 * Templates:
 *  - NewsVideoVertical   (1080x1920, 9:16)  -- static image + voiceover
 *  - NewsVideoHorizontal (1920x1080, 16:9)  -- static image + voiceover
 *  - DirectedVertical    (1080x1920, 9:16)  -- multi-scene, Claude-directed
 *  - DirectedHorizontal  (1920x1080, 16:9)  -- multi-scene, Claude-directed
 */
import React from "react";
import { Composition, Still } from "remotion";
import { loadFont } from "@remotion/google-fonts/Comfortaa";
import { NewsVideo } from "./compositions/NewsVideo";
import { DirectedNewsVideo } from "./compositions/DirectedNewsVideo";
import { DailyNewsShow } from "./compositions/DailyNewsShow";
import { ThumbnailHorizontal } from "./compositions/ThumbnailHorizontal";
import { FeatureLLMFallback } from "./compositions/feature-demos/FeatureLLMFallback";
import { FeatureAgentSubmit } from "./compositions/feature-demos/FeatureAgentSubmit";
import { FeatureRoundRobinScraper } from "./compositions/feature-demos/FeatureRoundRobinScraper";
import { FeatureParticleBackground } from "./compositions/feature-demos/FeatureParticleBackground";
import { FeatureJobAnalyzer } from "./compositions/feature-demos/FeatureJobAnalyzer";
import { FeatureCoverLetter } from "./compositions/feature-demos/FeatureCoverLetter";
import { FeatureCvParser } from "./compositions/feature-demos/FeatureCvParser";
import { FeatureMetaClaw } from "./compositions/feature-demos/FeatureMetaClaw";
import { FeatureJobAura } from "./compositions/feature-demos/FeatureJobAura";
import { FeatureAutoApply } from "./compositions/feature-demos/FeatureAutoApply";
import { FeatureFinn2fa } from "./compositions/feature-demos/FeatureFinn2fa";
import { FeatureAutoRegister } from "./compositions/feature-demos/FeatureAutoRegister";
import { FeaturePreModeration } from "./compositions/feature-demos/FeaturePreModeration";
import { FeatureContentRewrite } from "./compositions/feature-demos/FeatureContentRewrite";
import { FeatureImagePrompt } from "./compositions/feature-demos/FeatureImagePrompt";
import { FeatureSocialTeasers } from "./compositions/feature-demos/FeatureSocialTeasers";
import { FeatureCommentReplies } from "./compositions/feature-demos/FeatureCommentReplies";
import { FeatureDupeDetection } from "./compositions/feature-demos/FeatureDupeDetection";
import { FeatureMultiLlm } from "./compositions/feature-demos/FeatureMultiLlm";
import { FeatureVideoFactory } from "./compositions/feature-demos/FeatureVideoFactory";
import { FeatureVideoFactoryV3 } from "./compositions/feature-demos/FeatureVideoFactoryV3";
import { FeatureSkyvernRecovery } from "./compositions/feature-demos/FeatureSkyvernRecovery";
import { FeatureFormMemory } from "./compositions/feature-demos/FeatureFormMemory";
import { FeatureNavigationGoals } from "./compositions/feature-demos/FeatureNavigationGoals";
import { FeatureSkyvernSliderPatch } from "./compositions/feature-demos/FeatureSkyvernSliderPatch";
import { FeatureFinnkodeRegex } from "./compositions/feature-demos/FeatureFinnkodeRegex";
import { FeatureNavPublicApi } from "./compositions/feature-demos/FeatureNavPublicApi";
import { FeatureLinkedinGuestApi } from "./compositions/feature-demos/FeatureLinkedinGuestApi";
import { FeatureCrossSourceDedupe } from "./compositions/feature-demos/FeatureCrossSourceDedupe";
import { FeatureVisualDirector } from "./compositions/feature-demos/FeatureVisualDirector";
import { FeatureDailyDigest } from "./compositions/feature-demos/FeatureDailyDigest";
import { FeatureAiThumbnails } from "./compositions/feature-demos/FeatureAiThumbnails";
import { FeatureNeuralTts } from "./compositions/feature-demos/FeatureNeuralTts";
import { FeatureCrossPlatformDistribution } from "./compositions/feature-demos/FeatureCrossPlatformDistribution";
import { FeatureLinkedinNativeUpload } from "./compositions/feature-demos/FeatureLinkedinNativeUpload";
import { FeatureInstagramPublishing } from "./compositions/feature-demos/FeatureInstagramPublishing";
import { FeatureSocialAnalyticsDashboard } from "./compositions/feature-demos/FeatureSocialAnalyticsDashboard";
import { FeatureShadowDom } from "./compositions/feature-demos/FeatureShadowDom";
import { FeatureTelegramFirstApply } from "./compositions/feature-demos/FeatureTelegramFirstApply";
import { FeatureJobLinkAnalysis } from "./compositions/feature-demos/FeatureJobLinkAnalysis";
import { FeatureInlineButtons } from "./compositions/feature-demos/FeatureInlineButtons";
import { FeatureSmartConfirmation } from "./compositions/feature-demos/FeatureSmartConfirmation";
import { FeatureHumanInLoopForms } from "./compositions/feature-demos/FeatureHumanInLoopForms";
import { FeaturePocketJobCard } from "./compositions/feature-demos/FeaturePocketJobCard";
import { FeatureDashboard } from "./compositions/feature-demos/FeatureDashboard";
import { FeatureRaceConditionPosting } from "./compositions/feature-demos/FeatureRaceConditionPosting";
import { FeatureTelegramModeration } from "./compositions/feature-demos/FeatureTelegramModeration";
import { FeatureCreativeBuilder } from "./compositions/feature-demos/FeatureCreativeBuilder";
import { FeatureAutonomousPublishing } from "./compositions/feature-demos/FeatureAutonomousPublishing";
import { FeatureMtkrutoVideo } from "./compositions/feature-demos/FeatureMtkrutoVideo";
import { FeatureSourceConsolidation } from "./compositions/feature-demos/FeatureSourceConsolidation";
import { FeatureEdgeFunctionsCost } from "./compositions/feature-demos/FeatureEdgeFunctionsCost";
import { FeatureCascadingImageProviders } from "./compositions/feature-demos/FeatureCascadingImageProviders";
import { FeatureJobMap } from "./compositions/feature-demos/FeatureJobMap";
import { FeatureJobTable } from "./compositions/feature-demos/FeatureJobTable";
import { FeatureJobTableStory } from "./compositions/feature-demos/FeatureJobTableStory";
import { FeatureJobExports } from "./compositions/feature-demos/FeatureJobExports";
import { FeatureCvEditor } from "./compositions/feature-demos/FeatureCvEditor";
import { FeatureTrilingualUx } from "./compositions/feature-demos/FeatureTrilingualUx";
import { FeatureLiveDashboard } from "./compositions/feature-demos/FeatureLiveDashboard";
import { FeatureRlsIsolation } from "./compositions/feature-demos/FeatureRlsIsolation";
import { FeatureParanoidIsolation } from "./compositions/feature-demos/FeatureParanoidIsolation";
import { FeatureCredentialVault } from "./compositions/feature-demos/FeatureCredentialVault";
import { FeatureAuthBypass } from "./compositions/feature-demos/FeatureAuthBypass";
import { FeatureDeployWorkflow } from "./compositions/feature-demos/FeatureDeployWorkflow";
import { FeatureScanScheduler } from "./compositions/feature-demos/FeatureScanScheduler";
import { FeatureTimeoutEscape } from "./compositions/feature-demos/FeatureTimeoutEscape";
import { FeatureSupabaseAllInOne } from "./compositions/feature-demos/FeatureSupabaseAllInOne";
import { FeatureCostTransparency } from "./compositions/feature-demos/FeatureCostTransparency";
import { FeatureDragDropPatch } from "./compositions/feature-demos/FeatureDragDropPatch";
import { FeatureScheduledPublishing } from "./compositions/feature-demos/FeatureScheduledPublishing";
import { FeatureSpamProtection } from "./compositions/feature-demos/FeatureSpamProtection";
import { FeatureBentoGridLayout } from "./compositions/feature-demos/FeatureBentoGridLayout";
import { FeatureLiquidFillAnimation } from "./compositions/feature-demos/FeatureLiquidFillAnimation";
import { FeatureProjectGridExplosion } from "./compositions/feature-demos/FeatureProjectGridExplosion";
import { FeatureMobileAppUx } from "./compositions/feature-demos/FeatureMobileAppUx";
import { FeatureInterceptingRoutes } from "./compositions/feature-demos/FeatureInterceptingRoutes";
import { FeatureAdvancedSearch } from "./compositions/feature-demos/FeatureAdvancedSearch";
import { FeatureGlassmorphismSystem } from "./compositions/feature-demos/FeatureGlassmorphismSystem";
import { FeatureMultilingualSeo } from "./compositions/feature-demos/FeatureMultilingualSeo";
import { FeatureDynamicOgImages } from "./compositions/feature-demos/FeatureDynamicOgImages";
import { FeatureGtmIntegrationHub } from "./compositions/feature-demos/FeatureGtmIntegrationHub";
import { FeatureCookieConsent } from "./compositions/feature-demos/FeatureCookieConsent";
import { FeatureGithubActionsOrchestration } from "./compositions/feature-demos/FeatureGithubActionsOrchestration";
import { FeatureNetlifyDeploySplit } from "./compositions/feature-demos/FeatureNetlifyDeploySplit";
import { FeatureApiRetryLogic } from "./compositions/feature-demos/FeatureApiRetryLogic";
import { FeatureNetlifyAutoDeploy } from "./compositions/feature-demos/FeatureNetlifyAutoDeploy";
import { FeatureGeminiSkillGuides } from "./compositions/feature-demos/FeatureGeminiSkillGuides";
import { FeatureLinkedinGuestScraper } from "./compositions/feature-demos/FeatureLinkedinGuestScraper";
import { FeatureBilingualCoverLetters } from "./compositions/feature-demos/FeatureBilingualCoverLetters";
import { FeatureBotTimeoutRecovery } from "./compositions/feature-demos/FeatureBotTimeoutRecovery";
import { FeatureGeminiFallbackRetry } from "./compositions/feature-demos/FeatureGeminiFallbackRetry";
import { FeatureGeminiCoverLetterFallback } from "./compositions/feature-demos/FeatureGeminiCoverLetterFallback";
import { FeatureManualMarkAsSent } from "./compositions/feature-demos/FeatureManualMarkAsSent";
import { FeatureClaudeCoverLetters } from "./compositions/feature-demos/FeatureClaudeCoverLetters";
import { FeatureGroqJobAnalysis } from "./compositions/feature-demos/FeatureGroqJobAnalysis";
import { FeatureClaudeSonnetSoknad } from "./compositions/feature-demos/FeatureClaudeSonnetSoknad";
import { FeatureLlama4MaverickAnalysis } from "./compositions/feature-demos/FeatureLlama4MaverickAnalysis";
import { FeatureAgentWrittenCoverLetters } from "./compositions/feature-demos/FeatureAgentWrittenCoverLetters";
import { FeatureAgentPlaywrightRouting } from "./compositions/feature-demos/FeatureAgentPlaywrightRouting";
import { FeatureCareerTrackScoring } from "./compositions/feature-demos/FeatureCareerTrackScoring";
import { FeatureNotificationGateUserCheck } from "./compositions/feature-demos/FeatureNotificationGateUserCheck";
import { FeatureOneButtonConfirm } from "./compositions/feature-demos/FeatureOneButtonConfirm";
import { FeatureFormFillCache } from "./compositions/feature-demos/FeatureFormFillCache";
import { FeatureTwoBotRouting } from "./compositions/feature-demos/FeatureTwoBotRouting";
import { FeatureAtsResolverFree } from "./compositions/feature-demos/FeatureAtsResolverFree";
import { FeatureLetterWrittenLast } from "./compositions/feature-demos/FeatureLetterWrittenLast";
import { FeatureReconGatedWake } from "./compositions/feature-demos/FeatureReconGatedWake";
import { FeatureStaleSweep } from "./compositions/feature-demos/FeatureStaleSweep";
import { FeaturePerSourceThreshold } from "./compositions/feature-demos/FeaturePerSourceThreshold";
import { FeatureDailyChain } from "./compositions/feature-demos/FeatureDailyChain";
import { FeatureCompanyBlocklist } from "./compositions/feature-demos/FeatureCompanyBlocklist";
import { FeatureLoginWallCheck } from "./compositions/feature-demos/FeatureLoginWallCheck";
import { FeatureOneButtonRecon } from "./compositions/feature-demos/FeatureOneButtonRecon";
import { FeaturePerPlatformConsent } from "./compositions/feature-demos/FeaturePerPlatformConsent";
import { FeatureTenTabDashboard } from "./compositions/feature-demos/FeatureTenTabDashboard";
import { FeatureRssTierSystem } from "./compositions/feature-demos/FeatureRssTierSystem";
import { FeatureSkillsReorder } from "./compositions/feature-demos/FeatureSkillsReorder";
import { FeatureTrilingualPipeline } from "./compositions/feature-demos/FeatureTrilingualPipeline";
import { FeatureNorwayDetection } from "./compositions/feature-demos/FeatureNorwayDetection";
import { FeatureSocialMetricsHub } from "./compositions/feature-demos/FeatureSocialMetricsHub";
import { FeatureAiFeatureMiner } from "./compositions/feature-demos/FeatureAiFeatureMiner";
import { FeatureDailySocialPush } from "./compositions/feature-demos/FeatureDailySocialPush";
import { FeatureMiniCaseStudies } from "./compositions/feature-demos/FeatureMiniCaseStudies";
import { FeatureGitCommitMiner } from "./compositions/feature-demos/FeatureGitCommitMiner";
import { FeatureSocialAutoPublisher } from "./compositions/feature-demos/FeatureSocialAutoPublisher";
import { FeatureGsapCityGrid } from "./compositions/feature-demos/FeatureGsapCityGrid";
import { FeatureAiCommitMiner } from "./compositions/feature-demos/FeatureAiCommitMiner";
import { FeatureSocialAutopilot } from "./compositions/feature-demos/FeatureSocialAutopilot";
import { FeatureDynamicSkillsMarquee } from "./compositions/feature-demos/FeatureDynamicSkillsMarquee";
import { FeatureTimeZoneTamer } from "./compositions/feature-demos/FeatureTimeZoneTamer";
import { FeatureMultiRepoScanner } from "./compositions/feature-demos/FeatureMultiRepoScanner";
import { FeatureLocalClockScheduling } from "./compositions/feature-demos/FeatureLocalClockScheduling";
import { FeatureTraceabilityScanner } from "./compositions/feature-demos/FeatureTraceabilityScanner";
import { FeatureAiFeaturePosts } from "./compositions/feature-demos/FeatureAiFeaturePosts";
import { FeatureMultiRepoSync } from "./compositions/feature-demos/FeatureMultiRepoSync";
import { FeatureTelegramVideoStealth } from "./compositions/feature-demos/FeatureTelegramVideoStealth";
import { FeatureDualLocaleScheduling } from "./compositions/feature-demos/FeatureDualLocaleScheduling";
import { FeatureRepoAutoDiscovery } from "./compositions/feature-demos/FeatureRepoAutoDiscovery";
import { FeatureDateSpecificPublishing } from "./compositions/feature-demos/FeatureDateSpecificPublishing";
import { FeatureGeminiClaudeCascade } from "./compositions/feature-demos/FeatureGeminiClaudeCascade";
import { FeatureKeyPhraseCallouts } from "./compositions/feature-demos/FeatureKeyPhraseCallouts";
import { FeatureLinkedinTokenMonitor } from "./compositions/feature-demos/FeatureLinkedinTokenMonitor";
import { FeatureExponentialBackoffFetch } from "./compositions/feature-demos/FeatureExponentialBackoffFetch";
import { FeatureDualPlatformTokenMonitor } from "./compositions/feature-demos/FeatureDualPlatformTokenMonitor";
import { FeatureManualVisualDirectives } from "./compositions/feature-demos/FeatureManualVisualDirectives";
import { FeatureVisualEffectLibraryExpansion } from "./compositions/feature-demos/FeatureVisualEffectLibraryExpansion";
import { FeatureRssQualityGate } from "./compositions/feature-demos/FeatureRssQualityGate";
import { FeatureEnforcedPublishCaps } from "./compositions/feature-demos/FeatureEnforcedPublishCaps";
import { FeatureTelegramFetchOrSkip } from "./compositions/feature-demos/FeatureTelegramFetchOrSkip";
import { FeatureGeminiPreScreen } from "./compositions/feature-demos/FeatureGeminiPreScreen";
import { FeatureOpenrouterImageBudget } from "./compositions/feature-demos/FeatureOpenrouterImageBudget";
import { FeatureTelegramCreditStrip } from "./compositions/feature-demos/FeatureTelegramCreditStrip";
import { FeaturePortfolioAutoDeploy } from "./compositions/feature-demos/FeaturePortfolioAutoDeploy";

// Load Comfortaa globally — must happen at module level before any render
const { fontFamily } = loadFont();
// Re-export so components can reference if needed
export { fontFamily };

const LEGACY_PROPS = {
  videoSrc: "",
  imageSrc: "",
  voiceoverSrc: "",
  subtitles: [] as { text: string; startTime: number; endTime: number }[],
  headline: "Breaking News",
  originalVideoDurationInSeconds: 30,
  muteOriginalAudio: false,
};

const DIRECTED_PROPS = {
  scenes: [] as any[],
  voiceoverSrc: "",
  subtitles: [] as { text: string; startTime: number; endTime: number }[],
  totalDurationSeconds: 30,
};

const DAILY_SHOW_PROPS = {
  date: "",
  showTitle: "Daglig Nyhetsoppdatering",
  language: "no",
  showType: "daily" as "daily" | "custom",
  segments: [] as any[],
  voiceoverSrc: "",
  subtitles: [] as { text: string; startTime: number; endTime: number }[],
  totalDurationSeconds: 120,
  introDurationSeconds: 4,
  outroDurationSeconds: 4,
  dividerDurationSeconds: 3.5,
  accentColor: "#FF7A00",
  roundupHeadlines: [] as { text: string; category: string }[],
  roundupVoiceoverSrc: "",
  roundupDurationSeconds: 0,
  overflowCount: 0,
  overflowVoiceoverSrc: "",
  overflowDurationSeconds: 0,
  bgmSrc: "",
  bgmVolume: 0.3,
  bgmDuckVolume: 0.1,
  transitionSfxSrc: "",
};

const THUMBNAIL_PROPS = {
  date: "",
  headlines: [] as { text: string; category: string }[],
  articleCount: 0,
  accentColor: "#FF7A00",
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ── Legacy: single-scene templates ── */}
      <Composition
        id="NewsVideoVertical"
        component={NewsVideo as React.FC}
        durationInFrames={30 * 30}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={LEGACY_PROPS}
        calculateMetadata={({ props }) => {
          const seconds = Math.max(
            (props as typeof LEGACY_PROPS).originalVideoDurationInSeconds,
            10,
          );
          return { durationInFrames: Math.ceil(seconds * 30) };
        }}
      />
      <Composition
        id="NewsVideoHorizontal"
        component={NewsVideo as React.FC}
        durationInFrames={30 * 30}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={LEGACY_PROPS}
        calculateMetadata={({ props }) => {
          const seconds = Math.max(
            (props as typeof LEGACY_PROPS).originalVideoDurationInSeconds,
            10,
          );
          return { durationInFrames: Math.ceil(seconds * 30) };
        }}
      />

      {/* ── Multi-scene: Claude-directed templates ── */}
      <Composition
        id="DirectedVertical"
        component={DirectedNewsVideo as React.FC}
        durationInFrames={30 * 30}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={DIRECTED_PROPS}
        calculateMetadata={({ props }) => {
          const seconds = Math.max(
            (props as typeof DIRECTED_PROPS).totalDurationSeconds,
            10,
          );
          return { durationInFrames: Math.ceil(seconds * 30) };
        }}
      />
      <Composition
        id="DirectedHorizontal"
        component={DirectedNewsVideo as React.FC}
        durationInFrames={30 * 30}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={DIRECTED_PROPS}
        calculateMetadata={({ props }) => {
          const seconds = Math.max(
            (props as typeof DIRECTED_PROPS).totalDurationSeconds,
            10,
          );
          return { durationInFrames: Math.ceil(seconds * 30) };
        }}
      />
      {/* ── Daily News Show ── */}
      <Composition
        id="DailyNewsShowVertical"
        component={DailyNewsShow as React.FC}
        durationInFrames={120 * 30}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={DAILY_SHOW_PROPS}
        calculateMetadata={({ props }) => {
          const seconds = Math.max(
            (props as typeof DAILY_SHOW_PROPS).totalDurationSeconds,
            10,
          );
          return { durationInFrames: Math.ceil(seconds * 30) };
        }}
      />
      <Composition
        id="DailyNewsShowHorizontal"
        component={DailyNewsShow as React.FC}
        durationInFrames={120 * 30}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={DAILY_SHOW_PROPS}
        calculateMetadata={({ props }) => {
          const seconds = Math.max(
            (props as typeof DAILY_SHOW_PROPS).totalDurationSeconds,
            10,
          );
          return { durationInFrames: Math.ceil(seconds * 30) };
        }}
      />
      {/* ── Feature schema demos (silent looping diagrams for /features) ── */}
      <Composition
        id="FeatureLLMFallback"
        component={FeatureLLMFallback}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureAgentSubmit"
        component={FeatureAgentSubmit}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureRoundRobinScraper"
        component={FeatureRoundRobinScraper}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureParticleBackground"
        component={FeatureParticleBackground}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureJobAnalyzer"
        component={FeatureJobAnalyzer}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureCoverLetter"
        component={FeatureCoverLetter}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureCvParser"
        component={FeatureCvParser}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureMetaClaw"
        component={FeatureMetaClaw}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureJobAura"
        component={FeatureJobAura}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureAutoApply"
        component={FeatureAutoApply}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureFinn2fa"
        component={FeatureFinn2fa}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureAutoRegister"
        component={FeatureAutoRegister}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeaturePreModeration"
        component={FeaturePreModeration}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureContentRewrite"
        component={FeatureContentRewrite}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureImagePrompt"
        component={FeatureImagePrompt}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureSocialTeasers"
        component={FeatureSocialTeasers}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureCommentReplies"
        component={FeatureCommentReplies}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureDupeDetection"
        component={FeatureDupeDetection}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureMultiLlm"
        component={FeatureMultiLlm}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureVideoFactory"
        component={FeatureVideoFactory}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureVideoFactoryV3"
        component={FeatureVideoFactoryV3}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureSkyvernRecovery"
        component={FeatureSkyvernRecovery}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureFormMemory"
        component={FeatureFormMemory}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureNavigationGoals"
        component={FeatureNavigationGoals}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureSkyvernSliderPatch"
        component={FeatureSkyvernSliderPatch}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureFinnkodeRegex"
        component={FeatureFinnkodeRegex}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureNavPublicApi"
        component={FeatureNavPublicApi}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureLinkedinGuestApi"
        component={FeatureLinkedinGuestApi}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureCrossSourceDedupe"
        component={FeatureCrossSourceDedupe}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureVisualDirector"
        component={FeatureVisualDirector}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureDailyDigest"
        component={FeatureDailyDigest}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureAiThumbnails"
        component={FeatureAiThumbnails}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureNeuralTts"
        component={FeatureNeuralTts}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureCrossPlatformDistribution"
        component={FeatureCrossPlatformDistribution}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureLinkedinNativeUpload"
        component={FeatureLinkedinNativeUpload}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureInstagramPublishing"
        component={FeatureInstagramPublishing}
        // Voice-synced clip: length comes from the measured voiceover, not the
        // 15 s loop default. Changing the VO means recomputing this.
        durationInFrames={907}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureSocialAnalyticsDashboard"
        component={FeatureSocialAnalyticsDashboard}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureShadowDom"
        component={FeatureShadowDom}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureTelegramFirstApply"
        component={FeatureTelegramFirstApply}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureJobLinkAnalysis"
        component={FeatureJobLinkAnalysis}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureInlineButtons"
        component={FeatureInlineButtons}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureSmartConfirmation"
        component={FeatureSmartConfirmation}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureHumanInLoopForms"
        component={FeatureHumanInLoopForms}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeaturePocketJobCard"
        component={FeaturePocketJobCard}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureDashboard"
        component={FeatureDashboard}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureRaceConditionPosting"
        component={FeatureRaceConditionPosting}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureTelegramModeration"
        component={FeatureTelegramModeration}
        durationInFrames={1002}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureCreativeBuilder"
        component={FeatureCreativeBuilder}
        durationInFrames={982}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureAutonomousPublishing"
        component={FeatureAutonomousPublishing}
        durationInFrames={939}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureMtkrutoVideo"
        component={FeatureMtkrutoVideo}
        durationInFrames={874}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureSourceConsolidation"
        component={FeatureSourceConsolidation}
        durationInFrames={889}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureEdgeFunctionsCost"
        component={FeatureEdgeFunctionsCost}
        durationInFrames={815}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureCascadingImageProviders"
        component={FeatureCascadingImageProviders}
        durationInFrames={954}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureJobMap"
        component={FeatureJobMap}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureJobTable"
        component={FeatureJobTable}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureJobTableStory"
        component={FeatureJobTableStory}
        durationInFrames={1620}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureJobExports"
        component={FeatureJobExports}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureCvEditor"
        component={FeatureCvEditor}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureTrilingualUx"
        component={FeatureTrilingualUx}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureLiveDashboard"
        component={FeatureLiveDashboard}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureRlsIsolation"
        component={FeatureRlsIsolation}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureParanoidIsolation"
        component={FeatureParanoidIsolation}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureCredentialVault"
        component={FeatureCredentialVault}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureAuthBypass"
        component={FeatureAuthBypass}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureDeployWorkflow"
        component={FeatureDeployWorkflow}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureScanScheduler"
        component={FeatureScanScheduler}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureTimeoutEscape"
        component={FeatureTimeoutEscape}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureSupabaseAllInOne"
        component={FeatureSupabaseAllInOne}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureCostTransparency"
        component={FeatureCostTransparency}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureDragDropPatch"
        component={FeatureDragDropPatch}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureScheduledPublishing"
        component={FeatureScheduledPublishing}
        durationInFrames={917}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureSpamProtection"
        component={FeatureSpamProtection}
        durationInFrames={955}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureBentoGridLayout"
        component={FeatureBentoGridLayout}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureLiquidFillAnimation"
        component={FeatureLiquidFillAnimation}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureProjectGridExplosion"
        component={FeatureProjectGridExplosion}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureMobileAppUx"
        component={FeatureMobileAppUx}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureInterceptingRoutes"
        component={FeatureInterceptingRoutes}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureAdvancedSearch"
        component={FeatureAdvancedSearch}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureGlassmorphismSystem"
        component={FeatureGlassmorphismSystem}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureMultilingualSeo"
        component={FeatureMultilingualSeo}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureDynamicOgImages"
        component={FeatureDynamicOgImages}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureGtmIntegrationHub"
        component={FeatureGtmIntegrationHub}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureCookieConsent"
        component={FeatureCookieConsent}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureGithubActionsOrchestration"
        component={FeatureGithubActionsOrchestration}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureNetlifyDeploySplit"
        component={FeatureNetlifyDeploySplit}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FeatureApiRetryLogic"
        component={FeatureApiRetryLogic}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureNetlifyAutoDeploy"
        component={FeatureNetlifyAutoDeploy}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureGeminiSkillGuides"
        component={FeatureGeminiSkillGuides}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureLinkedinGuestScraper"
        component={FeatureLinkedinGuestScraper}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureBilingualCoverLetters"
        component={FeatureBilingualCoverLetters}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureBotTimeoutRecovery"
        component={FeatureBotTimeoutRecovery}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureGeminiFallbackRetry"
        component={FeatureGeminiFallbackRetry}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureGeminiCoverLetterFallback"
        component={FeatureGeminiCoverLetterFallback}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureManualMarkAsSent"
        component={FeatureManualMarkAsSent}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureClaudeCoverLetters"
        component={FeatureClaudeCoverLetters}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureGroqJobAnalysis"
        component={FeatureGroqJobAnalysis}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureClaudeSonnetSoknad"
        component={FeatureClaudeSonnetSoknad}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureLlama4MaverickAnalysis"
        component={FeatureLlama4MaverickAnalysis}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureAgentWrittenCoverLetters"
        component={FeatureAgentWrittenCoverLetters}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureAgentPlaywrightRouting"
        component={FeatureAgentPlaywrightRouting}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureCareerTrackScoring"
        component={FeatureCareerTrackScoring}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureNotificationGateUserCheck"
        component={FeatureNotificationGateUserCheck}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureOneButtonConfirm"
        component={FeatureOneButtonConfirm}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureFormFillCache"
        component={FeatureFormFillCache}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureTwoBotRouting"
        component={FeatureTwoBotRouting}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureAtsResolverFree"
        component={FeatureAtsResolverFree}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureLetterWrittenLast"
        component={FeatureLetterWrittenLast}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureReconGatedWake"
        component={FeatureReconGatedWake}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureStaleSweep"
        component={FeatureStaleSweep}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeaturePerSourceThreshold"
        component={FeaturePerSourceThreshold}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureDailyChain"
        component={FeatureDailyChain}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureCompanyBlocklist"
        component={FeatureCompanyBlocklist}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureLoginWallCheck"
        component={FeatureLoginWallCheck}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureOneButtonRecon"
        component={FeatureOneButtonRecon}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeaturePerPlatformConsent"
        component={FeaturePerPlatformConsent}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureTenTabDashboard"
        component={FeatureTenTabDashboard}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureRssTierSystem"
        component={FeatureRssTierSystem}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureSkillsReorder"
        component={FeatureSkillsReorder}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureTrilingualPipeline"
        component={FeatureTrilingualPipeline}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureNorwayDetection"
        component={FeatureNorwayDetection}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureSocialMetricsHub"
        component={FeatureSocialMetricsHub}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureAiFeatureMiner"
        component={FeatureAiFeatureMiner}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureDailySocialPush"
        component={FeatureDailySocialPush}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureMiniCaseStudies"
        component={FeatureMiniCaseStudies}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureGitCommitMiner"
        component={FeatureGitCommitMiner}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureSocialAutoPublisher"
        component={FeatureSocialAutoPublisher}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureGsapCityGrid"
        component={FeatureGsapCityGrid}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureAiCommitMiner"
        component={FeatureAiCommitMiner}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureSocialAutopilot"
        component={FeatureSocialAutopilot}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureDynamicSkillsMarquee"
        component={FeatureDynamicSkillsMarquee}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureTimeZoneTamer"
        component={FeatureTimeZoneTamer}
        durationInFrames={1002}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureMultiRepoScanner"
        component={FeatureMultiRepoScanner}
        durationInFrames={883}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureLocalClockScheduling"
        component={FeatureLocalClockScheduling}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureTraceabilityScanner"
        component={FeatureTraceabilityScanner}
        durationInFrames={891}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureAiFeaturePosts"
        component={FeatureAiFeaturePosts}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureMultiRepoSync"
        component={FeatureMultiRepoSync}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureTelegramVideoStealth"
        component={FeatureTelegramVideoStealth}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureDualLocaleScheduling"
        component={FeatureDualLocaleScheduling}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureRepoAutoDiscovery"
        component={FeatureRepoAutoDiscovery}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureDateSpecificPublishing"
        component={FeatureDateSpecificPublishing}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureGeminiClaudeCascade"
        component={FeatureGeminiClaudeCascade}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureKeyPhraseCallouts"
        component={FeatureKeyPhraseCallouts}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureLinkedinTokenMonitor"
        component={FeatureLinkedinTokenMonitor}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureExponentialBackoffFetch"
        component={FeatureExponentialBackoffFetch}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureDualPlatformTokenMonitor"
        component={FeatureDualPlatformTokenMonitor}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureManualVisualDirectives"
        component={FeatureManualVisualDirectives}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureVisualEffectLibraryExpansion"
        component={FeatureVisualEffectLibraryExpansion}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureRssQualityGate"
        component={FeatureRssQualityGate}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureEnforcedPublishCaps"
        component={FeatureEnforcedPublishCaps}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureTelegramFetchOrSkip"
        component={FeatureTelegramFetchOrSkip}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureGeminiPreScreen"
        component={FeatureGeminiPreScreen}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureOpenrouterImageBudget"
        component={FeatureOpenrouterImageBudget}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeatureTelegramCreditStrip"
        component={FeatureTelegramCreditStrip}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="FeaturePortfolioAutoDeploy"
        component={FeaturePortfolioAutoDeploy}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      {/* ── Thumbnail (Still) ── */}
      <Still
        id="ThumbnailHorizontal"
        component={ThumbnailHorizontal as React.FC}
        width={1280}
        height={720}
        defaultProps={THUMBNAIL_PROPS}
      />
    </>
  );
};
