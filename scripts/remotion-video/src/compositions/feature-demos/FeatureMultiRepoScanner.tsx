/**
 * FeatureMultiRepoScanner — feature p59 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: managing 7 GitHub repos meant pinpointing a feature's origin was a
 * daily git-log battle, jumping between repos chasing elusive commits.
 * feature-scanner.yml triggers on push across all 7 repos, running
 * scanFeatures.ts, which clones each repo, parses package.json and config
 * files, and uses octokit/rest to fetch the latest commit hash per feature
 * file. The result compiles into feature_map.json, uploaded to Vercel Blob
 * Storage, which the Next.js site consumes for click-through traceability.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const REPO_COUNT = 5; // visually represents "7 repos"
const REPOS = Array.from({ length: REPO_COUNT }, (_, i) => ({
  x: 110 + i * 220,
  y: 56,
  w: 170,
  h: 76,
}));
const REPO_B: Pt[] = REPOS.map((r) => ({ x: r.x + r.w / 2, y: r.y + r.h }));

const SCANNER = { x: 460, y: 210, w: 360, h: 108 };
const SCANNER_T: Pt = { x: SCANNER.x + SCANNER.w / 2, y: SCANNER.y };
const SCANNER_B: Pt = { x: SCANNER.x + SCANNER.w / 2, y: SCANNER.y + SCANNER.h };

const MAP = { x: 480, y: 390, w: 320, h: 90 };
const MAP_T: Pt = { x: MAP.x + MAP.w / 2, y: MAP.y };
const MAP_B: Pt = { x: MAP.x + MAP.w / 2, y: MAP.y + MAP.h };

export const FeatureMultiRepoScanner: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Beat 1: 7 repos, daily git-log battle
  const repoOp = REPOS.map((_, i) => appear(6 + i * 6) * lf);
  const repoLit = REPOS.map((_, i) =>
    interpolate(frame, [6 + i * 6, 30 + i * 6, 96, 116], [0, 0.45, 0.45, 0.13], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf,
  );
  const pill1In = seg(frame, 48, 70, Easing.out(Easing.cubic));
  const pill1Op = pill1In * interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1Dx = (1 - pill1In) * 40;
  const cap1In = seg(frame, 24, 46, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // Beat 2: feature-scanner.yml -> scanFeatures.ts -> octokit/rest
  const tRepo = REPO_B.map((_, i) => seg(frame, 132 + i * 4, 156 + i * 4));
  const tRepoVis = REPO_B.map((_, i) => (frame >= 132 + i * 4 && frame < 200 ? 1 : 0));
  const scannerOp = appear(150, 18) * lf;
  const scannerLit = interpolate(frame, [158, 182, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2In = seg(frame, 178, 200, Easing.out(Easing.cubic));
  const pill2Op = pill2In * interpolate(frame, [226, 246], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2Dx = (1 - pill2In) * 40;
  const cap2In = seg(frame, 168, 190, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [226, 246], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // Beat 3: feature_map.json -> Vercel Blob Storage
  const tC = seg(frame, 236, 260);
  const tCVis = frame >= 236 && frame < 306 ? 1 : 0;
  const mapOp = appear(242, 18) * lf;
  const mapLit = interpolate(frame, [250, 272, 330, 350], [0, 0.6, 0.6, 0.16], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill3In = seg(frame, 272, 294, Easing.out(Easing.cubic));
  const pill3Op = pill3In * interpolate(frame, [318, 340], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill3Dx = (1 - pill3In) * 40;
  const cap3In = seg(frame, 266, 288, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [318, 340], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // Beat 4: result
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      {REPO_B.map((p, i) => (
        <Connector key={i} pts={[p, SCANNER_T]} color={T.accent} width={2} progress={tRepo[i]} opacity={0.7 * tRepoVis[i] * lf} />
      ))}
      <Connector pts={[SCANNER_B, MAP_T]} color={T.success} width={2.5} progress={tC} opacity={0.8 * tCVis * lf} />

      {REPOS.map((r, i) => (
        <SchemaNode key={i} {...r} state="danger" lit={repoLit[i]} opacity={repoOp[i]} label={`repo ${i + 1}`} fontSize={16} />
      ))}
      <Pill x={370} y={REPOS[0].y - 44} dx={pill1Dx} text="7 repos, hours lost chasing commits" color={T.danger} opacity={pill1Op} fontSize={16} />

      <SchemaNode {...SCANNER} state="accent" lit={scannerLit} opacity={scannerOp} label="feature-scanner.yml → scanFeatures.ts" fontSize={16}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2, textAlign: "center" }}>octokit/rest fetches commit hashes</div>
      </SchemaNode>
      {REPO_B.map((p, i) => (
        <Token key={i} pts={[p, SCANNER_T]} t={tRepo[i]} opacity={tRepoVis[i] * lf} size={10} />
      ))}
      <Pill x={SCANNER.x - 10} y={SCANNER.y + SCANNER.h + 14} dx={pill2Dx} text="triggers on push, across every repo" color={T.accent} opacity={pill2Op} fontSize={16} />

      <SchemaNode {...MAP} state="success" lit={mapLit} opacity={mapOp} label="feature_map.json → Vercel Blob" fontSize={16} />
      <Token pts={[SCANNER_B, MAP_T]} t={tC} color={T.success} opacity={tCVis * lf} />
      <Pill x={MAP.x - 10} y={MAP.y + MAP.h + 14} dx={pill3Dx} text="portfolio reads it for live traceability" color={T.success} opacity={pill3Op} fontSize={15} />

      <Caption x={90} y={648} w={1100} text="Pinpointing a feature's origin meant chasing commits across 7 repos" color={T.danger} opacity={cap1} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Every push, all 7 repos get scanned for feature-defining changes" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="One compiled map, uploaded and served straight to the site" color={T.success} opacity={cap3} fontSize={22} weight={600} />

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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>70-80% less context-switching, instant traceability</div>
      </div>
    </AbsoluteFill>
  );
};
