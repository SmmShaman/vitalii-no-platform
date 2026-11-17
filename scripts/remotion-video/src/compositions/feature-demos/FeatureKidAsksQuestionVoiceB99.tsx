// FeatureKidAsksQuestionVoiceB99 — feature b99 — 1280x720, 959 frames @ 30fps, VOICE-SYNCED.
// archetype 4 flow-map, mood slate. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// Beat -> effect (commits f5dafae/14717b6/40da4b2 ARE this feature's own commits — unlike
// b100 — but none has a verified recordable GitHub URL tonight, so they inform drawn content
// only, never a LiveBackdrop of github.com):
// b1 15-182   "when a kid asks why the moon has phases, a text answer never really lands"
//             cornerTags over the feature's own page (backdrop "page"). Opener deliberately
//             NOT titleTakeover (b97, b98) and NOT keywordCaption (b94).
// b2 183-361  "now he just asks out loud... and a bot takes down the question"
//             pipelineFlow, same page scrolled to the bot/question section (backdrop "page2").
// b3 362-592  "the answer comes back as its own little movie — camera flights, 3D models,
//             tiny math scenes, built with Remotion"
//             funnelAbsorption, page scrolled to the render/demo section (backdrop "page3").
//             Informed by commit 14717b6 (effects/pins/prims/CompositionStrip). "Remotion" is
//             the one allowed tech caption, glossed inline as "rendering code".
// b4 593-757  "the very first one, 'chicken or egg', played start to finish, made just for him"
//             drawn panel + icon cards (was timelineNodes — its horizontal-band layout left
//             most of the canvas empty at the beat's midpoint). Informed by commit f5dafae
//             (first full chicken-egg plan + visualiser prompt). No verified URL shows the
//             finished render.
// b5 758-959  "behind it, six separate renders finish together — so no answer makes him wait"
//             drawn only: a LogWindow built from the feature's own numbers (6 render chunks,
//             informed by commit 40da4b2's multi-beat render workflow), plus the flow-map's
//             6 pips lighting up SIMULTANEOUSLY to match "finish together". Ends on this drawn
//             result, never on the feature page or the hub (gate 2).
//
// Persistent element: the flow-map archetype, b1 through b5 — a fixed 4-node route
// (QUESTION -> BOT -> BUILD -> VIDEO) with a token that crawls from node to node as each
// beat starts, lighting the node it reaches; the story is told by the token's position and
// which nodes are lit, ending with 6 pips at VIDEO lighting together.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily, Panel, IconCard } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { LogWindow, LogLine } from "./live-primitives";
import { tween, ease, mix, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/b99.json";

const B1 = 15;
const B2 = 183;
const B3 = 362;
const B4 = 593;
const B5 = 758;
const END = 959;

/** Slate's own accent (#0E7490) lifted brighter so it reads on the dark stage. */
const ACCENT = "#4FD6EC";
const STAGE = "#0B151C";

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

// Flow-map geometry (1280x720, below the effects' safe bottom at y~587).
const LT = { x: 40, y: 606, w: 1200, h: 92 };
const ROUTE_Y = LT.y + 46;
const QUESTION = { x: 360, label: "QUESTION" };
const BOT = { x: 610, label: "BOT" };
const BUILD = { x: 860, label: "BUILD" };
const VIDEO = { x: 1110, label: "VIDEO" };
const NODE_R = 9;

const FlowMap: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const seg1 = tween(sec(frame, B2, fps), 0, 1.0, ease.power3InOut);
  const seg2 = tween(sec(frame, B3, fps), 0, 1.0, ease.power3InOut);
  const seg3 = tween(sec(frame, B4, fps), 0, 1.0, ease.power3InOut);

  const tokenX =
    frame < B2
      ? QUESTION.x
      : frame < B3
      ? mix(seg1, QUESTION.x, BOT.x)
      : frame < B4
      ? mix(seg2, BOT.x, BUILD.x)
      : mix(seg3, BUILD.x, VIDEO.x);

  const questionLit = frame >= B1;
  const botLit = frame >= B2 + fps;
  const buildLit = frame >= B3 + fps;
  const videoLit = frame >= B4 + fps;
  const pipsLit = frame >= B5 + 15;

  const status =
    frame < B2
      ? "KID ASKS BY VOICE"
      : frame < B3
      ? "BOT TAKES DOWN THE QUESTION"
      : frame < B4
      ? "BUILDING THE SCENE (REMOTION)"
      : frame < B5
      ? "FIRST VIDEO: CHICKEN OR EGG"
      : "6 RENDERS FINISH TOGETHER";
  const statusTone = frame >= B5 ? P.success : frame >= B3 ? P.accent : P.muted;

  const nodes = [
    { n: QUESTION, lit: questionLit },
    { n: BOT, lit: botLit },
    { n: BUILD, lit: buildLit },
    { n: VIDEO, lit: videoLit },
  ];

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      <Arrive at={B1 + 4} kind="wipe" box={LT} dur={0.45}>
        <div
          style={{
            position: "absolute",
            left: LT.x,
            top: LT.y,
            width: LT.w,
            height: LT.h,
            background: P.card,
            borderRadius: 4,
            boxShadow: "6px 6px 0 rgba(0,0,0,0.55)",
          }}
        />
        <div style={{ position: "absolute", left: LT.x + 22, top: LT.y + 14, width: 230 }}>
          <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2.4, color: P.accent }}>BOYTASKS</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: P.ink, marginTop: 4, lineHeight: 1.2 }}>
            YouTube unlocks
            <br />
            after tasks are done
          </div>
        </div>
      </Arrive>

      {/* route line */}
      <div
        style={{
          position: "absolute",
          left: QUESTION.x,
          top: ROUTE_Y - 1.5,
          width: VIDEO.x - QUESTION.x,
          height: 3,
          background: P.border,
          borderRadius: 2,
        }}
      />

      {nodes.map(({ n, lit }, i) => (
        <div key={i}>
          <div
            style={{
              position: "absolute",
              left: n.x - NODE_R,
              top: ROUTE_Y - NODE_R,
              width: NODE_R * 2,
              height: NODE_R * 2,
              borderRadius: "50%",
              background: lit ? P.accent : P.card,
              border: `2px solid ${lit ? P.accent : P.border}`,
              boxShadow: lit ? `0 0 10px ${P.accent}` : "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: n.x - 40,
              top: ROUTE_Y + 16,
              width: 80,
              textAlign: "center",
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: 1.2,
              color: lit ? P.accent : P.muted,
            }}
          >
            {n.label}
          </div>
        </div>
      ))}

      {/* 6 render-chunk pips at VIDEO, all light together */}
      {Array.from({ length: 6 }, (_, i) => {
        const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
        const px = VIDEO.x + Math.cos(angle) * 24;
        const py = ROUTE_Y - 24 + Math.sin(angle) * 24;
        const pipScale = pipsLit ? punchScale(sec(frame, B5 + 15, fps), 0) : 0;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: px - 4,
              top: py - 4,
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: P.success,
              opacity: pipsLit ? 1 : 0,
              transform: `scale(${pipScale})`,
            }}
          />
        );
      })}

      {/* travelling token */}
      {frame < B5 && (
        <div
          style={{
            position: "absolute",
            left: tokenX - 6,
            top: ROUTE_Y - 6,
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: P.danger,
            boxShadow: `0 0 8px ${P.danger}`,
          }}
        />
      )}

      <Arrive at={B1 + 20} kind="rise" box={{ x: QUESTION.x, y: LT.y - 2, w: 420, h: 20 }}>
        <div
          style={{
            position: "absolute",
            left: QUESTION.x,
            top: LT.y - 2,
            fontSize: 15,
            fontWeight: 800,
            letterSpacing: 1.2,
            color: statusTone,
            whiteSpace: "nowrap",
          }}
        >
          {status}
        </div>
      </Arrive>
    </div>
  );
};

const RENDER_LINES: LogLine[] = [
  { t: "job", text: "6 chunks queued", tone: "accent" },
  { text: "chunk 1-6 rendering in parallel", tone: "muted" },
  { text: "chunk 1 → done", tone: "success" },
  { text: "chunk 2 → done", tone: "success" },
  { text: "chunks 3-6 → done", tone: "success" },
  { text: "6/6 finished together", tone: "success" },
  { text: "video ready — no extra wait", tone: "accent" },
];

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the problem, over the feature's own page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="cornerTags"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{
          statement: "A text answer never really lands",
          tags: ["Asked at a 6-year-old level", "One specific question", "Ukrainian or Norwegian"],
        }}
      />

      {/* b2 — the bot takes down the spoken question */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="page2" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="pipelineFlow"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{
          steps: ["Asked out loud", "Bot takes down question", "Turned into a scene plan"],
          result: "Ready to render",
          system: "Explain bot",
        }}
      />

      {/* b3 — the explainer is built: camera flights, 3D models, math scenes, Remotion */}
      {cut(frame, B3, B4) === 1 && <LiveBackdrop file={shotsFile} shot="page3" from={B3} hold={B4 - B3} />}
      <MotionInsert
        effect="funnelAbsorption"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.7}
        data={{
          inputs: ["Camera flights", "3D models", "Math scenes", "Emoji actors"],
          result: "One explainer video (Remotion = rendering code)",
        }}
      />

      {/* b4 — drawn: the first explainer, "chicken or egg", played start to finish */}
      {frame >= B4 && frame < B5 && (
        <Panel x={140} y={90} w={1000} h={420} tone="note" radius={28} opacity={1}>
          <div style={{ padding: "30px 40px 0" }}>
            <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: 2.4, color: ACCENT }}>FIRST EXPLAINER</div>
            <div style={{ fontSize: 30, fontWeight: 800, color: "#101418", marginTop: 4 }}>&ldquo;Chicken or egg?&rdquo;</div>
          </div>
          <div style={{ display: "flex", height: 230, alignItems: "center", justifyContent: "space-around", padding: "0 40px" }}>
            <IconCard x={0} y={0} w={260} emoji="🥚" title="The very first one" sub="Made from his own question" tone="accent" />
            <IconCard x={0} y={0} w={260} emoji="▶️" title="Played start to finish" sub="No skipping, no cuts" tone="success" />
            <IconCard x={0} y={0} w={260} emoji="🧒" title="Made just for him" sub="Not a generic answer" tone="danger" />
          </div>
        </Panel>
      )}

      {/* b5 — drawn: six renders finishing together, ending on the real result */}
      {frame >= B5 && (
        <LogWindow lines={RENDER_LINES} title="render log" from={B5 + 10} every={16} opacity={1} fontSize={22} />
      )}

      <FlowMap />
    </AbsoluteFill>
  );
};

export const FeatureKidAsksQuestionVoiceB99: React.FC = () => (
  <PaletteProvider value={MOODS.slate}>
    <Inner />
  </PaletteProvider>
);
