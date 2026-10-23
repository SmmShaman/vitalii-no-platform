// FeatureElvarikaLeftManagedSupabaseE01 — feature e01 — 1280x720, 964 frames @ 30fps, VOICE-SYNCED.
// archetype 6 sidebar, mood dawn.
//
// Elvarika moved off a managed Supabase project it didn't control the server of, onto a
// self-hosted stack on its own VPS — same login, same keys, two new triggers closing a
// signup self-escalation hole. Motion direction (feature-motion skill, 2026-10-07): one
// editorial effect per beat; the left sidebar is the surviving archetype element and
// carries the product plate + the running claim while the right stage swaps per beat.
//
// Beat -> effect (data only from the feature row; no runtime log exists for this product,
// so every on-screen fact comes straight from problem_en / solution_en / result_en):
// b1 15-269   "didn't control the server... one quota freeze from going dark"
//             cornerTags over the feature's own page (backdrop "page").
// b2 269-446  "moved it: a self-hosted Supabase stack... behind a tunnel"
//             copyCorrection over the features hub (backdrop "hub"). The ONE tech
//             caption of this clip ("Supabase, self-hosted") sits in its label.
// b3 446-578  "same login, same keys — nobody even noticed" — keywordCaption, drawn
//             (nothing to record: the point is that nothing visibly changed).
// b4 578-752  "a user could grant themselves admin rights through signup" —
//             pipelineFlow, drawn (invisible plumbing: the exploit path).
// b5 752-964  "closed it... freeing 500 megabytes of RAM" — titleTakeover (verdict),
//             drawn, holds to the end on the real number.
//
// Persistent element: the left sidebar column (archetype 6), b1 through b5.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { tween, ease } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/e01.json";

const B1 = 15;
const B2 = 269;
const B3 = 446;
const B4 = 578;
const B5 = 752;
const END = 964;
const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

/** Tuned for the dark MotionInsert plate (dawn's #2563EB reads muddy there). */
const ACCENT = "#F08A4B";
const STAGE = "#14100A";
const SIDEBAR_W = 320;

const CLAIMS = [
  { kicker: "THE PROBLEM", line: "No control of the server" },
  { kicker: "THE MOVE", line: "Self-hosted, same keys" },
  { kicker: "NO DOWNTIME", line: "Nobody even noticed" },
  { kicker: "THE CATCH", line: "Signup could grant admin" },
  { kicker: "THE FIX", line: "500MB freed, hole closed" },
];
const STARTS = [B1, B2, B3, B4, B5];

/** Archetype 6: the only element that survives every beat — product plate + running claim. */
const Sidebar: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  const idx = frame >= B5 ? 4 : frame >= B4 ? 3 : frame >= B3 ? 2 : frame >= B2 ? 1 : 0;
  const claim = CLAIMS[idx];
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: SIDEBAR_W, height: 720, background: P.ink, fontFamily }}>
      <div style={{ position: "absolute", left: 28, top: 36, width: SIDEBAR_W - 56 }}>
        <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2.2, color: P.accent }}>ELVARIKA</div>
        <div style={{ fontSize: 16, fontWeight: 600, color: "#EAF0FF", marginTop: 6, lineHeight: 1.35 }}>
          Your text becomes a language lesson
        </div>
      </div>
      <div style={{ position: "absolute", left: 28, top: 170, width: SIDEBAR_W - 56, height: 2, background: "rgba(255,255,255,0.14)" }} />
      <Arrive key={idx} at={STARTS[idx]} kind="rise" box={{ x: 28, y: 200, w: SIDEBAR_W - 56, h: 120 }}>
        <div style={{ position: "absolute", left: 28, top: 200, width: SIDEBAR_W - 56 }}>
          <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2.2, color: P.accent }}>{claim.kicker}</div>
          <div style={{ fontSize: 23, fontWeight: 700, color: "#FFFFFF", marginTop: 10, lineHeight: 1.3 }}>{claim.line}</div>
        </div>
      </Arrive>
      <div style={{ position: "absolute", left: 28, bottom: 40, display: "flex", gap: 8 }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} style={{ width: 10, height: 10, borderRadius: 5, background: i <= idx ? P.accent : "rgba(255,255,255,0.22)" }} />
        ))}
      </div>
    </div>
  );
};

// Wave C fill-fix: pipelineFlow leaves the top/bottom margins empty until late in its own
// internal reveal. These bands restate data the beat already carries (never new facts).
const FillCaption: React.FC<{
  from: number;
  dur: number;
  y: number;
  label?: string;
  chips: string[];
  tone?: "accent" | "success" | "danger";
}> = ({ from, dur, y, label, chips, tone = "accent" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < from || frame >= from + dur) return null;
  const opacity = tween(sec(frame, from, fps), 0, 0.3, ease.power2Out);
  const bg = tone === "success" ? P.successBg : tone === "danger" ? P.dangerBg : P.accentBg;
  const edge = tone === "success" ? P.successEdge : tone === "danger" ? P.dangerEdge : P.accentEdge;
  const fg = tone === "success" ? P.success : tone === "danger" ? P.danger : P.accent;
  return (
    <div style={{ position: "absolute", left: SIDEBAR_W + 40, top: y, width: 1280 - SIDEBAR_W - 80, opacity }}>
      {label && (
        <div style={{ fontFamily, fontSize: 24, fontWeight: 800, color: P.ink, marginBottom: 14 }}>{label}</div>
      )}
      <div style={{ display: "flex", justifyContent: chips.length > 1 ? "space-between" : "flex-start", gap: 12 }}>
        {chips.map((c) => (
          <div
            key={c}
            style={{
              padding: "12px 18px",
              borderRadius: 8,
              background: bg,
              border: `1px solid ${edge}`,
              color: fg,
              fontFamily,
              fontSize: 17,
              fontWeight: 700,
              lineHeight: 1.2,
              textAlign: "center",
            }}
          >
            {c}
          </div>
        ))}
      </div>
    </div>
  );
};

/** Wave C sidebar-occlusion fix: shrinks + shifts a MotionInsert into the area right of the
 * sidebar so the effect's centered content never renders underneath it (b2, b5 — the hero
 * text in each sat partly behind the opaque sidebar at full width). */
const RIGHT_STAGE_SCALE = (1280 - SIDEBAR_W) / 1280;
const RightStage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      position: "absolute",
      left: SIDEBAR_W,
      top: (720 - 720 * RIGHT_STAGE_SCALE) / 2,
      width: 1280 - SIDEBAR_W,
      height: 720 * RIGHT_STAGE_SCALE,
      overflow: "hidden",
    }}
  >
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, transform: `scale(${RIGHT_STAGE_SCALE})`, transformOrigin: "0 0" }}>
      {children}
    </div>
  </div>
);

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
        plate={0.7}
        data={{
          statement: "No control of the server",
          tags: ["Managed host, not mine", "One quota freeze away", "Already hit vitalii.no", "Stuck with their tools"],
        }}
      />

      {/* b2 — the move, over the features hub. The clip's one tech caption lives here. */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B2} hold={B3 - B2} />}
      <RightStage>
        <MotionInsert
          effect="copyCorrection"
          from={B2}
          dur={B3 - B2}
          accent={ACCENT}
          plate={0.7}
          data={{
            wrong: "A database I don't control",
            right: "My own server, same keys",
            label: "Supabase, self-hosted",
          }}
        />
      </RightStage>

      {/* b3 — same login, same keys: drawn, nothing visibly changed for the user */}
      <MotionInsert
        effect="keywordCaption"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        base={STAGE}
        data={{
          line1: "Same login. Same keys.",
          line2: "Nobody even noticed the switch.",
          keywords: ["Same login", "noticed"],
        }}
      />

      {/* b4 — the security hole: drawn, invisible plumbing (the exploit path) */}
      <MotionInsert
        effect="pipelineFlow"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        base={STAGE}
        data={{
          steps: ["New user signs up", "Client sends a role field", "Server trusted it blindly"],
          result: "Self-granted admin access",
          system: "Signup endpoint",
        }}
      />
      <FillCaption from={B4} dur={B5 - B4} y={40} label="Signup endpoint, unchecked" chips={["New user signs up", "Client sends a role field", "Server trusted it blindly"]} tone="accent" />
      <FillCaption from={B4} dur={B5 - B4} y={500} chips={["Self-granted admin access"]} tone="danger" />

      {/* b5 — the verdict: closed, and the real number. Holds to the end, no fade. */}
      <RightStage>
        <MotionInsert
          effect="titleTakeover"
          from={B5}
          dur={END - B5}
          accent={ACCENT}
          base={STAGE}
          data={{
            title: "500MB of RAM freed",
            kicker: "Two new triggers closed the hole for good",
          }}
        />
      </RightStage>

      <Sidebar />
    </AbsoluteFill>
  );
};

export const FeatureElvarikaLeftManagedSupabaseE01: React.FC = () => (
  <PaletteProvider value={MOODS.dawn}>
    <Inner />
  </PaletteProvider>
);
