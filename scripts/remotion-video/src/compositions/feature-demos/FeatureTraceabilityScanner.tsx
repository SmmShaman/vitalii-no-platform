/**
 * FeatureTraceabilityScanner — feature p61 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: across 5+ repos and 100+ features, verifying "where did this come
 * from" cost 15-30 minutes per feature of manual commit-history digging.
 * The rebuilt feature-scanner GitHub Action iterates repo_list.txt, hits
 * the GitHub API for commit messages and file changes, and a custom
 * parseFeatureData function extracts feature details plus the precise
 * commit URL into public/features.json. The React frontend renders direct
 * commit links; FeatureAdminPanel.tsx allows manual overrides for edge cases.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const SOURCE = { x: 460, y: 50, w: 360, h: 92 };
const SOURCE_B: Pt = { x: SOURCE.x + SOURCE.w / 2, y: SOURCE.y + SOURCE.h };

const SCANNER = { x: 460, y: 210, w: 360, h: 108 };
const SCANNER_T: Pt = { x: SCANNER.x + SCANNER.w / 2, y: SCANNER.y };
const SCANNER_B: Pt = { x: SCANNER.x + SCANNER.w / 2, y: SCANNER.y + SCANNER.h };

const JSON_NODE = { x: 460, y: 380, w: 360, h: 90 };
const JSON_T: Pt = { x: JSON_NODE.x + JSON_NODE.w / 2, y: JSON_NODE.y };
const JSON_L: Pt = { x: JSON_NODE.x, y: JSON_NODE.y + JSON_NODE.h / 2 };
const JSON_R: Pt = { x: JSON_NODE.x + JSON_NODE.w, y: JSON_NODE.y + JSON_NODE.h / 2 };

const FRONTEND = { x: 110, y: 530, w: 280, h: 96 };
const FRONTEND_T: Pt = { x: FRONTEND.x + FRONTEND.w / 2, y: FRONTEND.y };

const ADMIN = { x: 890, y: 530, w: 280, h: 96 };
const ADMIN_T: Pt = { x: ADMIN.x + ADMIN.w / 2, y: ADMIN.y };

export const FeatureTraceabilityScanner: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Beat 1: 5+ repos, 100+ features, 15-30 min/feature manual digging
  const sourceOp = appear(6) * lf;
  const sourceLit = interpolate(frame, [6, 30, 96, 116], [0, 0.5, 0.5, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1In = seg(frame, 40, 62, Easing.out(Easing.cubic));
  const pill1Op = pill1In * interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1Dx = (1 - pill1In) * 40;
  const cap1In = seg(frame, 20, 42, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // Beat 2: feature-scanner Action -> GitHub API -> parseFeatureData
  const tA = seg(frame, 130, 154);
  const tAVis = frame >= 130 && frame < 190 ? 1 : 0;
  const scannerOp = appear(140, 18) * lf;
  const scannerLit = interpolate(frame, [148, 172, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2In = seg(frame, 160, 182, Easing.out(Easing.cubic));
  const pill2Op = pill2In * interpolate(frame, [216, 236], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2Dx = (1 - pill2In) * 40;
  const cap2In = seg(frame, 158, 180, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [216, 236], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // Beat 3: public/features.json -> React frontend + FeatureAdminPanel.tsx
  const tB = seg(frame, 226, 250);
  const tBVis = frame >= 226 && frame < 296 ? 1 : 0;
  const tC = seg(frame, 250, 274);
  const tCVis = frame >= 250 && frame < 320 ? 1 : 0;
  const tD = seg(frame, 250, 274);
  const tDVis = frame >= 250 && frame < 320 ? 1 : 0;
  const jsonOp = appear(232, 18) * lf;
  const jsonLit = interpolate(frame, [240, 262, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const frontendOp = appear(256, 18) * lf;
  const adminOp = appear(256, 18) * lf;
  const frontendLit = interpolate(frame, [264, 286, 330, 350], [0, 0.6, 0.6, 0.16], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const adminLit = interpolate(frame, [264, 286, 330, 350], [0, 0.6, 0.6, 0.16], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill3In = seg(frame, 282, 304, Easing.out(Easing.cubic));
  const pill3Op = pill3In * interpolate(frame, [318, 340], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill3Dx = (1 - pill3In) * 40;
  const cap3In = seg(frame, 276, 298, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [318, 340], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // Beat 4: result
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={[SOURCE_B, SCANNER_T]} color={T.accent} width={2.5} progress={tA} opacity={0.8 * tAVis * lf} />
      <Connector pts={[SCANNER_B, JSON_T]} color={T.accent} width={2.5} progress={tB} opacity={0.8 * tBVis * lf} />
      <Connector pts={[JSON_L, FRONTEND_T]} color={T.success} width={2.5} progress={tC} opacity={0.8 * tCVis * lf} />
      <Connector pts={[JSON_R, ADMIN_T]} color={T.success} width={2.5} progress={tD} opacity={0.8 * tDVis * lf} />

      <SchemaNode {...SOURCE} state="danger" lit={sourceLit} opacity={sourceOp} label="5+ repos, 100+ features" fontSize={21}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>"where did this come from?"</div>
      </SchemaNode>
      <Pill x={SOURCE.x + 30} y={SOURCE.y - 46} dx={pill1Dx} text="15-30 min per feature, manually" color={T.danger} opacity={pill1Op} fontSize={16} />

      <SchemaNode {...SCANNER} state="accent" lit={scannerLit} opacity={scannerOp} label="feature-scanner Action" fontSize={19}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2, textAlign: "center" }}>repo_list.txt → GitHub API → parseFeatureData</div>
      </SchemaNode>
      <Token pts={[SOURCE_B, SCANNER_T]} t={tA} opacity={tAVis * lf} />
      <Pill x={SCANNER.x - 10} y={SCANNER.y + SCANNER.h + 14} dx={pill2Dx} text="extracts details + precise commit URL" color={T.accent} opacity={pill2Op} fontSize={15} />

      <SchemaNode {...JSON_NODE} state="success" lit={jsonLit} opacity={jsonOp} label="public/features.json" fontSize={19} />
      <Token pts={[SCANNER_B, JSON_T]} t={tB} opacity={tBVis * lf} />

      <SchemaNode {...FRONTEND} state="success" lit={frontendLit} opacity={frontendOp} label="React frontend" fontSize={17}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2 }}>renders commit links</div>
      </SchemaNode>
      <SchemaNode {...ADMIN} state="amber" lit={adminLit} opacity={adminOp} label="FeatureAdminPanel.tsx" fontSize={16}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2 }}>manual override, edge cases</div>
      </SchemaNode>
      <Token pts={[JSON_L, FRONTEND_T]} t={tC} color={T.success} opacity={tCVis * lf} />
      <Token pts={[JSON_R, ADMIN_T]} t={tD} color={T.amber} opacity={tDVis * lf} />
      <Pill x={430} y={JSON_NODE.y + JSON_NODE.h + 12} dx={pill3Dx} text="100% data accuracy, edge cases covered" color={T.amber} opacity={pill3Op} fontSize={15} />

      <Caption x={90} y={648} w={1100} text="Verifying a feature's origin: 15-30 minutes of manual digging" color={T.danger} opacity={cap1} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Every repo scanned, every commit resolved to a direct URL" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="The frontend links straight to commits; an admin panel handles the rest" color={T.success} opacity={cap3} fontSize={22} weight={600} />

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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>Seconds, not 15-30 min — 95% less investigation time</div>
      </div>
    </AbsoluteFill>
  );
};
