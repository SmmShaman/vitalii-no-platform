/**
 * FeatureTimeoutEscape — feature j37 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: scheduled-scanner keeps hitting Supabase's hard 30s Edge Function
 * timeout — 10+ jobs at ~3s of Azure OpenAI analysis each blows past the
 * limit, jobs go unanalyzed → decouple scraping from analysis: the Edge
 * Function scrapes/saves in 10-15s, then dispatches analyze-jobs.yml via
 * repository_dispatch, which runs analyze_worker.py with no time limit →
 * 50+ jobs analyzed in 3 minutes, zero timeouts.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const SCANNER = { x: 440, y: 50, w: 400, h: 90 };
const SCANNER_B: Pt = { x: SCANNER.x + SCANNER.w / 2, y: SCANNER.y + SCANNER.h };

const JOBS10 = { x: 150, y: 210, w: 260, h: 78, label: "10+ new jobs" };
const TIMEOUT = { x: 870, y: 210, w: 260, h: 78, label: "30s Edge Function limit" };

const DISPATCH = { x: 440, y: 350, w: 400, h: 90 };
const DISPATCH_T: Pt = { x: DISPATCH.x + DISPATCH.w / 2, y: DISPATCH.y };
const DISPATCH_B: Pt = { x: DISPATCH.x + DISPATCH.w / 2, y: DISPATCH.y + DISPATCH.h };

const WORKER = { x: 440, y: 500, w: 400, h: 80 };
const WORKER_T: Pt = { x: WORKER.x + WORKER.w / 2, y: WORKER.y };

export const FeatureTimeoutEscape: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–116): 10+ jobs × ~3s each blows past the 30s Edge Function limit ──
  const scannerOp = Math.min(1, pop(6)) * lf;
  const scannerLit = interpolate(frame, [6, 28, 96, 116], [0, 0.5, 0.5, 0.14], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t1a = seg(frame, 24, 46);
  const t1aVis = frame >= 24 && frame < 70 ? 1 : 0;
  const t1b = seg(frame, 30, 52);
  const t1bVis = frame >= 30 && frame < 76 ? 1 : 0;
  const jobsOp = appear(30, 18) * lf;
  const timeoutOp2 = appear(36, 18) * lf;
  const timeoutLit = interpolate(frame, [36, 58, 96, 116], [0, 0.5, 0.5, 0.14], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const xScale = pop(64) * interpolate(frame, [92, 112], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 24, 46, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (128–232): decouple — scrape/save fast, then repository_dispatch ──
  const t2a = seg(frame, 148, 172);
  const t2aVis = frame >= 148 && frame < 194 ? 1 : 0;
  const t2b = seg(frame, 154, 178);
  const t2bVis = frame >= 154 && frame < 200 ? 1 : 0;
  const dispatchOp = appear(168, 18) * lf;
  const dispatchLit = interpolate(frame, [176, 198, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const fastPillIn = seg(frame, 182, 204, Easing.out(Easing.cubic));
  const fastPillOp = fastPillIn * interpolate(frame, [222, 242], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap2In = seg(frame, 158, 180, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [222, 242], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // ── Beat 3 (246–340): analyze_worker.py runs unconstrained, hot jobs notify ──
  const tDw = seg(frame, 250, 274);
  const tDwVis = frame >= 250 && frame < 300 ? 1 : 0;
  const workerOp = appear(266, 18) * lf;
  const workerLit = interpolate(frame, [274, 296, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const hotPillIn = seg(frame, 280, 302, Easing.out(Easing.cubic));
  const hotPillOp = hotPillIn * interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap3In = seg(frame, 264, 286, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // ── Beat 4 (346–450): result ──
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;
  const metricOp = seg(frame, 358, 380, Easing.out(Easing.cubic)) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={[SCANNER_B, { x: JOBS10.x + JOBS10.w / 2, y: JOBS10.y }]} color={T.danger} width={2.5} progress={t1a} opacity={0.8 * t1aVis * lf} />
      <Connector pts={[SCANNER_B, { x: TIMEOUT.x + TIMEOUT.w / 2, y: TIMEOUT.y }]} color={T.danger} width={2.5} progress={t1b} opacity={0.8 * t1bVis * lf} />
      <Connector pts={[SCANNER_B, DISPATCH_T]} color={T.accent} width={2.5} progress={t2a} opacity={0.8 * t2aVis * lf} />
      <Connector pts={[DISPATCH_B, WORKER_T]} color={T.success} width={2.5} progress={tDw} opacity={0.8 * tDwVis * lf} />

      <SchemaNode {...SCANNER} state="idle" lit={scannerLit} opacity={scannerOp} label="scheduled-scanner" fontSize={24}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>Supabase Edge Function</div>
      </SchemaNode>
      <SchemaNode {...JOBS10} state="danger" lit={0.4 * jobsOp * lf} opacity={jobsOp} label={JOBS10.label} fontSize={19}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>~3s Azure OpenAI each</div>
      </SchemaNode>
      <SchemaNode {...TIMEOUT} state="danger" lit={timeoutLit} opacity={timeoutOp2} label={TIMEOUT.label} fontSize={17} />
      <Token pts={[SCANNER_B, { x: JOBS10.x + JOBS10.w / 2, y: JOBS10.y }]} t={t1a} color={T.danger} opacity={t1aVis * lf} />
      <Token pts={[SCANNER_B, { x: TIMEOUT.x + TIMEOUT.w / 2, y: TIMEOUT.y }]} t={t1b} color={T.danger} opacity={t1bVis * lf} />
      <Badge x={TIMEOUT.x + TIMEOUT.w / 2 - 15} y={TIMEOUT.y - 32} kind="cross" scale={xScale} opacity={xScale} size={28} />

      <SchemaNode {...DISPATCH} state="accent" lit={dispatchLit} opacity={dispatchOp} label="repository_dispatch" fontSize={22}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>analyze-jobs.yml, GitHub PAT</div>
      </SchemaNode>
      <Token pts={[SCANNER_B, DISPATCH_T]} t={t2a} opacity={t2aVis * lf} />
      <Pill x={DISPATCH.x + 30} y={DISPATCH.y - 46} text="scrape + save now finishes in 10–15s" color={T.accent} opacity={fastPillOp} fontSize={16} />

      <SchemaNode {...WORKER} state="success" lit={workerLit} opacity={workerOp} label="analyze_worker.py" fontSize={20}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>Python, Azure OpenAI, no limit</div>
      </SchemaNode>
      <Token pts={[DISPATCH_B, WORKER_T]} t={tDw} color={T.success} opacity={tDwVis * lf} />
      <Pill x={WORKER.x - 20} y={WORKER.y + WORKER.h + 14} text="score ≥ 50 → Telegram notification" color={T.success} opacity={hotPillOp} fontSize={16} />

      <Caption x={90} y={648} w={1100} text="10+ jobs at 3 seconds each blow past the 30-second Edge Function limit" color={T.danger} opacity={cap1} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Scraping and saving finish fast, then a workflow dispatch hands off analysis" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="GitHub Actions runs the AI analysis with no time constraint at all" color={T.success} opacity={cap3} fontSize={22} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>Scanner: 10-15s · Analysis: 50+ jobs in 3 minutes</div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 640,
          width: 1280,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
          opacity: finalCap,
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: T.success,
            color: "#12321c",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 21,
            fontWeight: 700,
            transform: `scale(${finalCheck})`,
            boxShadow: `0 0 16px ${hexA(T.success, 0.5)}`,
          }}
        >
          ✓
        </div>
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>Zero timeouts, scales unconstrained by job volume</div>
      </div>
    </AbsoluteFill>
  );
};
