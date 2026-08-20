/**
 * FeatureExponentialBackoffFetch — feature v05 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: transient network issues, 429 rate limits, or upstream 5xx errors
 * would fail Edge Functions silently or surface errors to the user, needing
 * manual re-runs → a shared Deno utility, _shared/fetch-with-retry.ts,
 * wraps standard fetch calls in fetchWithRetry(), retrying up to 3 times
 * with exponential backoff (1s, 2s, 4s) specifically for 429/500/502/503/504
 * → any Edge Function can import it, making external API calls inherently
 * resilient without duplicating retry logic → an estimated 90%+ drop in
 * failed calls.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA, lerpColor } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const PROBLEM = { x: 250, y: 46, w: 780, h: 106 };
const PROBLEM_B: Pt = { x: PROBLEM.x + PROBLEM.w / 2, y: PROBLEM.y + PROBLEM.h };

const WRAPPER = { x: 300, y: 220, w: 680, h: 92 };
const WRAPPER_T: Pt = { x: WRAPPER.x + WRAPPER.w / 2, y: WRAPPER.y };
const WRAPPER_B: Pt = { x: WRAPPER.x + WRAPPER.w / 2, y: WRAPPER.y + WRAPPER.h };

const BACKOFF = { x: 200, y: 380, w: 880, h: 140 };
const BACKOFF_T: Pt = { x: BACKOFF.x + BACKOFF.w / 2, y: BACKOFF.y };

const PROBLEM_TO_WRAPPER: Pt[] = [PROBLEM_B, WRAPPER_T];
const WRAPPER_TO_BACKOFF: Pt[] = [WRAPPER_B, BACKOFF_T];

export const FeatureExponentialBackoffFetch: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Beat 1: transient errors fail silently, need manual re-runs
  const problemOp = pop(6) * lf;
  const problemLit = interpolate(frame, [6, 28, 96, 116], [0, 0.5, 0.5, 0.14], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1In = seg(frame, 40, 62, Easing.out(Easing.cubic));
  const pill1Op = pill1In * interpolate(frame, [104, 126], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 24, 46, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // Beat 2: fetchWithRetry() wraps every external call
  const t2 = seg(frame, 152, 178);
  const t2Vis = frame >= 152 && frame < 200 ? 1 : 0;
  const wrapperOp = appear(148, 18) * lf;
  const wrapperLit = interpolate(frame, [148, 172, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2In = seg(frame, 168, 190, Easing.out(Easing.cubic));
  const pill2Op = pill2In * interpolate(frame, [222, 242], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap2In = seg(frame, 158, 180, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [222, 242], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // Beat 3: exponential backoff ladder — 1s, 2s, 4s
  const t3 = seg(frame, 254, 282);
  const t3Vis = frame >= 254 && frame < 322 ? 1 : 0;
  const backoffOp = appear(268, 18) * lf;
  const backoffLit = interpolate(frame, [276, 298, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const step1Pop = pop(280);
  const step2Pop = pop(296);
  const step3Pop = pop(312);
  const pill3In = seg(frame, 300, 322, Easing.out(Easing.cubic));
  const pill3Op = pill3In * interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap3In = seg(frame, 266, 288, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // Beat 4: result
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;
  const metricOp = seg(frame, 358, 380, Easing.out(Easing.cubic)) * lf;

  const steps = [
    { label: "1s", h: 30, delay: step1Pop },
    { label: "2s", h: 44, delay: step2Pop },
    { label: "4s", h: 60, delay: step3Pop },
  ];

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={PROBLEM_TO_WRAPPER} color={T.accent} width={2.5} progress={t2} opacity={0.8 * t2Vis * lf} />
      <Connector pts={WRAPPER_TO_BACKOFF} color={T.success} width={2.5} progress={t3} opacity={0.8 * t3Vis * lf} />

      <SchemaNode {...PROBLEM} state="danger" lit={problemLit} opacity={problemOp} label="429s and 5xx errors, unhandled" fontSize={20}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>silent failures, manual re-runs</div>
      </SchemaNode>
      <Pill x={PROBLEM.x + 220} y={PROBLEM.y + PROBLEM.h + 18} text="every function reimplemented its own fix" color={T.danger} opacity={pill1Op} fontSize={16} />

      <SchemaNode {...WRAPPER} state="accent" lit={wrapperLit} opacity={wrapperOp} label="fetchWithRetry()" fontSize={22}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>_shared/fetch-with-retry.ts</div>
      </SchemaNode>
      <Token pts={PROBLEM_TO_WRAPPER} t={t2} opacity={t2Vis * lf} />
      <Pill x={WRAPPER.x + WRAPPER.w - 340} y={WRAPPER.y - 46} text="targets 429, 500, 502, 503, 504" color={T.accent} opacity={pill2Op} fontSize={16} />

      <SchemaNode {...BACKOFF} state="success" lit={backoffLit} opacity={backoffOp} label="Exponential backoff, up to 3 retries" fontSize={19}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 22, marginTop: 12, height: 64 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, transform: `scale(${s.delay})`, transformOrigin: "bottom" }}>
              <div
                style={{
                  width: 46,
                  height: s.h,
                  borderRadius: 8,
                  border: `1px solid ${hexA(T.success, 0.7)}`,
                  background: T.nodeFillDeep,
                  boxShadow: `0 0 10px ${hexA(T.success, 0.18)}`,
                }}
              />
              <div style={{ fontSize: 13, fontWeight: 700, color: lerpColor(T.text, T.success, 0.4) }}>{s.label}</div>
            </div>
          ))}
        </div>
      </SchemaNode>
      <Token pts={WRAPPER_TO_BACKOFF} t={t3} color={T.success} opacity={t3Vis * lf} />
      <Pill x={BACKOFF.x + 260} y={BACKOFF.y + BACKOFF.h + 14} text="4xx errors reported immediately, no wasted retries" color={T.success} opacity={pill3Op} fontSize={16} />

      <Caption x={90} y={648} w={1100} text="Rate limits and upstream 5xx errors just failed the call outright" color={T.danger} opacity={cap1} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="One shared wrapper: any function's external API calls become resilient" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Three retries, doubling the wait each time, only for transient codes" color={T.success} opacity={cap3} fontSize={22} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>~90%+ fewer failed external API calls</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>no duplicated retry logic, ever again</div>
      </div>
    </AbsoluteFill>
  );
};
