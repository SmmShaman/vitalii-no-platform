/**
 * FeatureAuthBypass — feature j34 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: supabase.auth.getSession()/signOut()/onAuthStateChange hang
 * indefinitely after an auth-js bug — infinite spinner, no login, no logout
 * → AuthContext.tsx bypasses the SDK: reads STORAGE_KEY from localStorage
 * directly, wraps every request in fetchWithTimeout(5000) via
 * AbortController, hits /auth/v1/token and /rest/v1/user_settings directly
 * → 500ms load instead of an infinite hang, running flawlessly 6+ months.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const SDK = { x: 440, y: 55, w: 400, h: 90 };
const SDK_B: Pt = { x: SDK.x + SDK.w / 2, y: SDK.y + SDK.h };

const METHODS = [
  { x: 90, y: 200, w: 260, h: 68, label: "getSession()" },
  { x: 380, y: 200, w: 260, h: 68, label: "signOut()" },
  { x: 670, y: 200, w: 260, h: 68, label: "onAuthStateChange" },
];
const METHODS_T: Pt[] = METHODS.map((m) => ({ x: m.x + m.w / 2, y: m.y }));

const STORAGE = { x: 100, y: 350, w: 260, h: 88 };
const TIMEOUT = { x: 420, y: 350, w: 280, h: 88 };
const REST = { x: 760, y: 350, w: 280, h: 88 };
const STORAGE_R: Pt = { x: STORAGE.x + STORAGE.w, y: STORAGE.y + STORAGE.h / 2 };
const TIMEOUT_L: Pt = { x: TIMEOUT.x, y: TIMEOUT.y + TIMEOUT.h / 2 };
const TIMEOUT_R: Pt = { x: TIMEOUT.x + TIMEOUT.w, y: TIMEOUT.y + TIMEOUT.h / 2 };
const REST_L: Pt = { x: REST.x, y: REST.y + REST.h / 2 };

const RESULT = { x: 440, y: 500, w: 400, h: 78 };
const RESULT_T: Pt = { x: RESULT.x + RESULT.w / 2, y: RESULT.y };

export const FeatureAuthBypass: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–116): 3 auth-js methods hang indefinitely — infinite spinner ──
  const sdkOp = Math.min(1, pop(6)) * lf;
  const sdkLit = interpolate(frame, [6, 28, 96, 116], [0, 0.5, 0.5, 0.14], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const tM = METHODS_T.map((_, i) => seg(frame, 22 + i * 8, 44 + i * 8));
  const tMVis = METHODS_T.map((_, i) => (frame >= 22 + i * 8 && frame < 96 ? 1 : 0));
  const methodOp = METHODS.map((_, i) => appear(30 + i * 8, 14) * lf);
  const methodLit = METHODS.map((_, i) =>
    interpolate(frame, [30 + i * 8, 52 + i * 8, 96, 116], [0, 0.5, 0.5, 0.14], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) * lf,
  );
  const spinPillIn = seg(frame, 58, 80, Easing.out(Easing.cubic));
  const spinPillOp = spinPillIn * interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 24, 46, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (128–232): localStorage read + fetchWithTimeout(5000) AbortController ──
  const storageOp = appear(134, 18) * lf;
  const storageLit = interpolate(frame, [134, 156, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const tSt = seg(frame, 152, 176);
  const tStVis = frame >= 152 && frame < 198 ? 1 : 0;
  const timeoutOp = appear(166, 18) * lf;
  const timeoutLit = interpolate(frame, [174, 196, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const abortPillIn = seg(frame, 180, 202, Easing.out(Easing.cubic));
  const abortPillOp = abortPillIn * interpolate(frame, [222, 242], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap2In = seg(frame, 158, 180, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [222, 242], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // ── Beat 3 (246–340): direct REST calls to /auth/v1/token & /rest/v1/user_settings ──
  const tTr = seg(frame, 250, 274);
  const tTrVis = frame >= 250 && frame < 300 ? 1 : 0;
  const restOp = appear(266, 18) * lf;
  const restLit = interpolate(frame, [274, 296, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const endpointPillIn = seg(frame, 280, 302, Easing.out(Easing.cubic));
  const endpointPillOp = endpointPillIn * interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap3In = seg(frame, 264, 286, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // ── Beat 4 (346–450): result ──
  const tRr = seg(frame, 348, 370);
  const tRrVis = frame >= 348 && frame < 392 ? 1 : 0;
  const resultOp = appear(360, 18) * lf;
  const resultLit = interpolate(frame, [366, 388, 430, 450], [0, 0.65, 0.65, 0.18], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;
  const metricOp = seg(frame, 358, 380, Easing.out(Easing.cubic)) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      {METHODS_T.map((p, i) => (
        <Connector key={i} pts={[SDK_B, p]} color={T.danger} width={2} progress={tM[i]} opacity={0.7 * tMVis[i] * lf} />
      ))}
      <Connector pts={[STORAGE_R, TIMEOUT_L]} color={T.accent} width={2.5} progress={tSt} opacity={0.8 * tStVis * lf} />
      <Connector pts={[TIMEOUT_R, REST_L]} color={T.accent} width={2.5} progress={tTr} opacity={0.8 * tTrVis * lf} />
      <Connector pts={[{ x: REST.x + REST.w / 2, y: REST.y + REST.h }, RESULT_T]} color={T.success} width={2.5} progress={tRr} opacity={0.8 * tRrVis * lf} />

      <SchemaNode {...SDK} state="danger" lit={sdkLit} opacity={sdkOp} label="Supabase JS SDK" fontSize={24}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>auth-js update introduced a bug</div>
      </SchemaNode>
      {METHODS.map((m, i) => (
        <SchemaNode key={m.label} {...m} state="danger" lit={methodLit[i]} opacity={methodOp[i]} label={m.label} fontSize={17} />
      ))}
      {METHODS_T.map((_, i) => (
        <Token key={i} pts={[SDK_B, METHODS_T[i]]} t={tM[i]} color={T.danger} opacity={tMVis[i] * lf} />
      ))}
      <Pill x={METHODS[1].x - 20} y={METHODS[1].y + METHODS[1].h + 14} text="infinite spinner — no login, no logout" color={T.danger} opacity={spinPillOp} fontSize={17} />

      <SchemaNode {...STORAGE} state="accent" lit={storageLit} opacity={storageOp} label="localStorage" fontSize={19}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>reads STORAGE_KEY directly</div>
      </SchemaNode>
      <SchemaNode {...TIMEOUT} state="accent" lit={timeoutLit} opacity={timeoutOp} label="fetchWithTimeout(5000)" fontSize={16}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>AbortController</div>
      </SchemaNode>
      <Token pts={[STORAGE_R, TIMEOUT_L]} t={tSt} opacity={tStVis * lf} />
      <Pill x={TIMEOUT.x - 20} y={TIMEOUT.y - 46} text="strict 5-second timeout, every call" color={T.accent} opacity={abortPillOp} fontSize={15} />

      <SchemaNode {...REST} state="success" lit={restLit} opacity={restOp} label="/auth/v1/token" fontSize={18}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>direct REST, sidesteps SDK</div>
      </SchemaNode>
      <Token pts={[TIMEOUT_R, REST_L]} t={tTr} color={T.accent} opacity={tTrVis * lf} />
      <Pill x={REST.x - 10} y={REST.y + REST.h + 14} text="/rest/v1/user_settings for roles" color={T.success} opacity={endpointPillOp} fontSize={15} />

      <SchemaNode {...RESULT} state="success" lit={resultLit} opacity={resultOp} label="Stable auth, sign-out instant" fontSize={20} />
      <Token pts={[{ x: REST.x + REST.w / 2, y: REST.y + REST.h }, RESULT_T]} t={tRr} color={T.success} opacity={tRrVis * lf} />

      <Caption x={90} y={648} w={1100} text="Core SDK auth methods hang forever — no login, no logout, dead app" color={T.danger} opacity={cap1} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Read the session from localStorage directly, wrap every call in a timeout" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Sign-in and role lookups go straight to the REST API, bypassing the SDK" color={T.success} opacity={cap3} fontSize={22} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>Infinite hang → 500ms typical load time</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>Running flawlessly in production for 6+ months</div>
      </div>
    </AbsoluteFill>
  );
};
