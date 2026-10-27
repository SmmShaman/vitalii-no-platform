// FeatureOneButtonShutsYoutubeB73 — feature b73 — 1280x720, 900 frames @ 30fps, VOICE-SYNCED.
// archetype 4 flow-map, mood violet. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// Boytasks already had three separate ways back into YouTube/Spotify (a timed QR
// pass, a finished bonus quiz, a free-viewing mode); none of them could be beaten
// at once. One admin flag now outranks all three. Data only from the feature row
// (problem_en/solution_en/result_en) — no commit shown this round, no public repo
// URL was verified for b73, so b3-b5 stage over the dark base, not a recording.
//
// Beat → effect:
// b1 15-166   "A parent wants YouTube and Spotify off, right now, no arguments."
//             keywordCaption over the feature's own page (backdrop). Lower third:
//             the BOYTASKS product plate arrives — the only mover this beat.
// b2 166-385  "...three ways back in: a timed pass, a finished bonus quiz, a
//             free-viewing mode." cornerTags over the page, scrolled further down.
//             Lower third: the three override nodes arrive one at a time, lit.
// b3 385-521  "Like a house with a master key and spare keys hidden all over it."
//             No catalog effect — a drawn house/keys analogy owns the upper frame;
//             the lower third's nodes hold their b2 state (no public UI to show).
// b4 521-717  "One button now sends a single flag through Cloudflare Workers that
//             outranks every spare key at once." copyCorrection on the dark base —
//             the only tech-credibility caption in the clip ("via Cloudflare
//             Workers"). Lower third: a PARENT node arrives and routes to GATE.
// b5 717-900  "The parent's switch finally wins over all of them — with just one
//             tap." funnelAbsorption: the three overrides pulled into the gate,
//             one result released. Lower third: GATE flips to LOCKED, the three
//             override nodes flip to blocked — holds to the final frame.
//
// Persistent element: the flow-map lower third (archetype 4), b1 through b5.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { tween, ease, mix, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/b73.json";

const B1 = 15;
const B2 = 166;
const B3 = 385;
const B4 = 521;
const B5 = 717;
const END = 900;

const ACCENT = "#8A6CE0";
const STAGE = "#17132B";

// Lower third geometry (1280x720, below the effects' safe bottom at y≈587).
const LT = { x: 40, y: 606, w: 1200, h: 92 };
const LINE_Y = LT.y + 50;
const PLATE_W = 228;
const NODE_W = 150;
const GATE_X = 798;
const GATE_W = 190;
const PARENT_X = 1008;
const PARENT_W = 150;
const OVERRIDE_X = [288, 458, 628];
const OVERRIDE_LABEL = ["FREE-VIEWING", "QR PASS", "BONUS QUIZ"];

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

const LowerThird: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const locked = frame >= B5 + 50;

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      {/* product plate */}
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
        <div style={{ position: "absolute", left: LT.x + 22, top: LT.y + 16, width: PLATE_W - 38 }}>
          <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2.4, color: P.accent }}>BOYTASKS</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: P.ink, marginTop: 4, lineHeight: 1.2 }}>
            screen-time guard,
            <br />
            three kids
          </div>
        </div>
        {/* route line */}
        <div style={{ position: "absolute", left: LT.x + PLATE_W, top: LINE_Y - 1, width: PARENT_X + PARENT_W - (LT.x + PLATE_W) - 20, height: 2, background: P.border }} />
      </Arrive>

      {/* three override nodes: lit (b2) -> blocked (b5) */}
      {OVERRIDE_X.map((x, i) => {
        const at = B2 + 20 + i * 30;
        if (frame < at) return null;
        const tone = locked ? P.danger : P.accent;
        const bg = locked ? P.dangerBg : P.accentBg;
        const edge = locked ? P.dangerEdge : P.accentEdge;
        return (
          <Arrive key={i} at={at} kind="rise" box={{ x, y: LT.y + 14, w: NODE_W, h: 64 }}>
            <div
              style={{
                position: "absolute",
                left: x,
                top: LT.y + 14,
                width: NODE_W,
                height: 64,
                background: bg,
                border: `2px solid ${edge}`,
                borderRadius: 4,
                padding: "8px 10px",
                boxSizing: "border-box",
                overflow: "hidden",
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.3, color: tone }}>{OVERRIDE_LABEL[i]}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: P.ink, marginTop: 4 }}>{locked ? "blocked" : "active"}</div>
              {locked && (
                <div
                  style={{
                    position: "absolute",
                    left: 6,
                    top: 30,
                    width: NODE_W - 12,
                    height: 3,
                    background: P.danger,
                    transformOrigin: "left center",
                    transform: `scaleX(${tween(sec(frame, B5 + 50 + i * 10, fps), 0, 0.3, ease.power3Out)}) rotate(-6deg)`,
                  }}
                />
              )}
            </div>
          </Arrive>
        );
      })}

      {/* GATE node: idle (dashed) -> LOCKED (success) at b5 */}
      <Arrive at={B1 + 34} kind="rise" box={{ x: GATE_X, y: LT.y + 14, w: GATE_W, h: 64 }}>
        <div
          style={{
            position: "absolute",
            left: GATE_X,
            top: LT.y + 14,
            width: GATE_W,
            height: 64,
            background: locked ? P.success : P.card,
            border: locked ? `2px solid ${P.success}` : `2px dashed ${P.muted}`,
            borderRadius: 4,
            color: locked ? "#fff" : P.muted,
            padding: "8px 12px",
            boxSizing: "border-box",
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.6 }}>GATE</div>
          <div style={{ fontSize: 15, fontWeight: 700, marginTop: 4 }}>{locked ? "LOCKED — wins" : "open by default"}</div>
        </div>
      </Arrive>

      {/* PARENT node arrives at b4, routes to GATE */}
      {frame >= B4 + 10 && (
        <Arrive at={B4 + 10} kind="rise" box={{ x: PARENT_X, y: LT.y + 14, w: PARENT_W, h: 64 }}>
          <div
            style={{
              position: "absolute",
              left: PARENT_X,
              top: LT.y + 14,
              width: PARENT_W,
              height: 64,
              background: P.card,
              border: `2px solid ${P.accentEdge}`,
              borderRadius: 4,
              padding: "8px 10px",
              boxSizing: "border-box",
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.3, color: P.accent }}>PARENT</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: P.ink, marginTop: 4 }}>one tap</div>
          </div>
          <div
            style={{
              position: "absolute",
              left: GATE_X + GATE_W,
              top: LINE_Y - 2,
              width: tween(sec(frame, B4 + 30, fps), 0, 0.5, ease.power3Out) * (PARENT_X - (GATE_X + GATE_W)),
              height: 4,
              background: P.accent,
            }}
          />
        </Arrive>
      )}
    </div>
  );
};

/** b3: no public UI recorded for this beat — a drawn house/keys analogy owns the frame. */
const HOUSE_X = 300;
const HOUSE_Y = 330;
const KEY_X = 980;
const KEY_Y = [150, 330, 500];

const HouseKeysAnalogy: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = sec(frame, B3, fps);
  const kickerP = tween(t, 0, 0.3, ease.power3Out);
  const houseP = tween(t, 0.1, 0.4, ease.power3Out);
  const keyFade = [0.55, 0.85, 1.15].map((at) => tween(t, at, 0.35, ease.power3Out));

  return (
    <AbsoluteFill style={{ background: STAGE }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 46,
          textAlign: "center",
          fontFamily,
          fontSize: 28,
          fontWeight: 800,
          letterSpacing: 3,
          color: ACCENT,
          opacity: kickerP,
        }}
      >
        ONE HOUSE. THREE SPARE KEYS.
      </div>

      <svg width={1280} height={720} style={{ position: "absolute", left: 0, top: 0 }}>
        {KEY_Y.map((ky, i) => (
          <line
            key={i}
            x1={HOUSE_X + 95}
            y1={HOUSE_Y}
            x2={KEY_X - 75}
            y2={ky}
            stroke="rgba(255,255,255,0.4)"
            strokeWidth={2}
            strokeDasharray="6 8"
            opacity={keyFade[i]}
          />
        ))}
      </svg>

      <div
        style={{
          position: "absolute",
          left: HOUSE_X - 110,
          top: HOUSE_Y - 120,
          width: 220,
          textAlign: "center",
          transform: `scale(${mix(houseP, 0.8, 1)})`,
          opacity: houseP,
        }}
      >
        <div style={{ fontSize: 190, lineHeight: 1 }}>🏠</div>
        <div style={{ fontFamily, fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: 1.6 }}>MASTER KEY</div>
      </div>

      {KEY_Y.map((ky, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: KEY_X - 80,
            top: ky - 60,
            width: 160,
            textAlign: "center",
            opacity: keyFade[i],
            transform: `translateX(${mix(keyFade[i], 30, 0)}px) rotate(${(i - 1) * 8}deg)`,
          }}
        >
          <div style={{ fontSize: 76, lineHeight: 1 }}>🔑</div>
          <div style={{ fontFamily, fontSize: 15, fontWeight: 800, letterSpacing: 1.2, color: ACCENT, marginTop: 4 }}>
            {OVERRIDE_LABEL[i]}
          </div>
        </div>
      ))}

      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          bottom: 210,
          textAlign: "center",
          fontFamily,
          fontSize: 40,
          fontWeight: 800,
          color: "#fff",
          opacity: tween(t, 0.3, 0.4, ease.power3Out),
        }}
      >
        One master key. Spare keys hidden everywhere.
      </div>
    </AbsoluteFill>
  );
};

/** b4 supplement: the copyCorrection card sits centered, leaving the top band empty —
 * a small flow diagram there (three overrides -> one flag) restates the beat in the open space. */
const OverrideFlagDiagram: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = sec(frame, B4, fps);
  const kickerP = tween(t, 0, 0.3, ease.power3Out);
  const rowP = [0.2, 0.32, 0.44].map((at) => tween(t, at, 0.3, ease.power3Out));
  const flagP = tween(t, 0.6, 0.35, ease.power3Out);
  const NODE_X = [150, 350, 550];

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 34,
          textAlign: "center",
          fontSize: 26,
          fontWeight: 800,
          letterSpacing: 3,
          color: ACCENT,
          opacity: kickerP,
        }}
      >
        THREE OVERRIDES — ONE FLAG
      </div>

      {NODE_X.map((x, i) => (
        <div key={i} style={{ position: "absolute", left: x - 70, top: 110, width: 140, textAlign: "center", opacity: rowP[i] }}>
          <div style={{ fontSize: 48, lineHeight: 1 }}>🔑</div>
          <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1, color: "#fff" }}>{OVERRIDE_LABEL[i]}</div>
        </div>
      ))}

      <svg width={1280} height={720} style={{ position: "absolute", left: 0, top: 0 }}>
        {NODE_X.map((x, i) => (
          <line key={i} x1={x + 40} y1={135} x2={880} y2={135} stroke="rgba(255,255,255,0.4)" strokeWidth={2} strokeDasharray="6 8" opacity={rowP[i]} />
        ))}
      </svg>

      <div style={{ position: "absolute", left: 900, top: 95, width: 160, textAlign: "center", opacity: flagP, transform: `scale(${mix(flagP, 0.8, 1)})` }}>
        <div style={{ fontSize: 56, lineHeight: 1 }}>🚩</div>
        <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1, color: ACCENT }}>CLOUDFLARE WORKERS</div>
      </div>
    </div>
  );
};

/** b5 supplement: the funnel occupies the center column, leaving both side wedges empty —
 * two labelled callouts there name the switch and what it beats, without touching the effect file. */
const FunnelSideCallouts: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = sec(frame, B5, fps);
  const leftP = tween(t, 0.2, 0.3, ease.power3Out);
  const rightP = tween(t, 0.35, 0.3, ease.power3Out);

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      <div
        style={{
          position: "absolute",
          left: 40,
          top: 230,
          width: 230,
          padding: "14px 16px",
          background: "rgba(255,255,255,0.08)",
          border: `2px solid ${ACCENT}`,
          borderRadius: 6,
          opacity: leftP,
          transform: `translateY(${mix(leftP, 16, 0)}px)`,
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1.3, color: ACCENT }}>PARENT SWITCH</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginTop: 4 }}>flips once</div>
      </div>
      <div
        style={{
          position: "absolute",
          right: 40,
          top: 230,
          width: 230,
          padding: "14px 16px",
          background: "rgba(255,255,255,0.08)",
          border: `2px solid ${ACCENT}`,
          borderRadius: 6,
          opacity: rightP,
          transform: `translateY(${mix(rightP, 16, 0)}px)`,
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1.3, color: ACCENT }}>3 OVERRIDES</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginTop: 4 }}>lose at once</div>
      </div>
    </div>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();

  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the demand, over the feature's own page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="keywordCaption"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{ line1: "Off. Right now.", line2: "No matter which override is live.", keywords: ["Off.", "Right now."] }}
      />

      {/* b2 — the three existing overrides, over the page scrolled further */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="page2" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="cornerTags"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{ statement: "Three ways back in, all working fine", tags: ["Free-viewing mode", "Timed QR pass", "Finished bonus quiz"] }}
      />

      {/* b3 — the analogy, drawn (no recording exists for this beat) */}
      {cut(frame, B3, B4) === 1 && <HouseKeysAnalogy />}

      {/* b4 — the mechanism, dark base, the clip's one tech caption */}
      <MotionInsert
        effect="copyCorrection"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.5}
        base={STAGE}
        data={{ wrong: "Remember and undo each override by hand", right: "One flag now outranks every override", label: "via Cloudflare Workers" }}
      />
      {frame >= B4 && frame < B5 && <OverrideFlagDiagram />}

      {/* b5 — the result, holds to the final frame */}
      <MotionInsert
        effect="funnelAbsorption"
        from={B5}
        dur={END - B5}
        accent={ACCENT}
        plate={0.5}
        base={STAGE}
        data={{ inputs: ["Free-viewing mode", "QR pass", "Finished bonus quiz"], result: "One tap wins — every time" }}
      />
      {frame >= B5 && <FunnelSideCallouts />}

      <LowerThird />
    </AbsoluteFill>
  );
};

export const FeatureOneButtonShutsYoutubeB73: React.FC = () => (
  <PaletteProvider value={MOODS.violet}>
    <Inner />
  </PaletteProvider>
);
