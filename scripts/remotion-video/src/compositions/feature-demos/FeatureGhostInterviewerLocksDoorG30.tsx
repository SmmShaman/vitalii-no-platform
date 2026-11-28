// FeatureGhostInterviewerLocksDoorG30 — feature g30 — 1280x720, 966 frames @ 30fps, VOICE-SYNCED.
// archetype 2 zoom-in, mood slate. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// Ghost Interviewer AI used to run on one shared API key, gated by nothing but a secret
// sign-in URL. This clip tells the fix — Google OAuth checked against an explicit
// allow-list — through a single camera move: a viewfinder frame starts at the full edge
// of the picture in b1 and tightens continuously, beat by beat, toward the evidence
// (the allow-list check, then every place it runs again), never resetting wide.
//
// Beat → effect (plan: shots/g30.motion.json):
// b1 15-278   "one shared API key... knowing the sign-in URL"
//             titleTakeover over the product's landing page. Viewfinder at full frame.
// b2 278-417  "any Google account could open a session and start spending real credits"
//             statusFocus, fully drawn — two "no" claims about the old door.
// b3 417-605  "Google OAuth checks every sign-in against an explicit allow-list"
//             copyCorrection over the allow-list commit, zoomed tighter.
// b4 605-780  "the same check runs again on the token exchange, and again on every request"
//             funnelAbsorption over the same commit's other hunk, viewfinder tighter still.
// b5 780-966  "tried a second personal account to break it — all three checks rejected it"
//             drawn only: LogWindow with the 3 real rejections, result card "3 / 3 REJECTED"
//             holds at full brightness to the end. No feature page, no hub.
//
// Persistent element: the tightening viewfinder + "ZOOMING IN — …" label (archetype 2), b1-b5.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { LiveWindow, LogWindow } from "./live-primitives";
import { tween, ease, mix } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/g30.json";

const B1 = 15;
const B2 = 278;
const B3 = 417;
const B4 = 605;
const B5 = 780;
const END = 966;

/** Slate's native accent #0E7490 reads a touch flat on a dark plate — brightened for the stage. */
const ACCENT = "#3BC4E3";
const STAGE = "#0C1620";

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

const BOUNDARIES = [B1, B2, B3, B4, B5];
const LABELS = ["THE SIGN-IN URL", "ANY GOOGLE ACCOUNT", "THE ALLOW-LIST", "EVERY REQUEST", "REJECTED"];
const FOCUS = { x: 700, y: 70, w: 500, h: 340 };
const MARGIN = 20;

const CornerMark: React.FC<{ x: number; y: number; corner: "tl" | "tr" | "bl" | "br"; color: string }> = ({
  x,
  y,
  corner,
  color,
}) => {
  const size = 40;
  const thickness = 4;
  const style: React.CSSProperties = { position: "absolute", width: size, height: size };
  if (corner === "tl") {
    style.left = x;
    style.top = y;
    style.borderTop = `${thickness}px solid ${color}`;
    style.borderLeft = `${thickness}px solid ${color}`;
  }
  if (corner === "tr") {
    style.left = x - size;
    style.top = y;
    style.borderTop = `${thickness}px solid ${color}`;
    style.borderRight = `${thickness}px solid ${color}`;
  }
  if (corner === "bl") {
    style.left = x;
    style.top = y - size;
    style.borderBottom = `${thickness}px solid ${color}`;
    style.borderLeft = `${thickness}px solid ${color}`;
  }
  if (corner === "br") {
    style.left = x - size;
    style.top = y - size;
    style.borderBottom = `${thickness}px solid ${color}`;
    style.borderRight = `${thickness}px solid ${color}`;
  }
  return <div style={style} />;
};

const ZoomFrame: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const p = tween(sec(frame, B1, fps), 0, (END - B1) / fps, ease.sineInOut);
  const left = mix(p, MARGIN, FOCUS.x);
  const top = mix(p, MARGIN, FOCUS.y);
  const right = mix(p, 1280 - MARGIN, FOCUS.x + FOCUS.w);
  const bottom = mix(p, 720 - MARGIN, FOCUS.y + FOCUS.h);

  let idx = 0;
  for (let i = 0; i < BOUNDARIES.length; i++) if (frame >= BOUNDARIES[i]) idx = i;
  const label = LABELS[idx];

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, pointerEvents: "none", fontFamily }}>
      <div
        style={{
          position: "absolute",
          left,
          top,
          width: right - left,
          height: bottom - top,
          border: `1px solid ${P.accent}`,
          opacity: 0.35,
        }}
      />
      <CornerMark x={left} y={top} corner="tl" color={P.accent} />
      <CornerMark x={right} y={top} corner="tr" color={P.accent} />
      <CornerMark x={left} y={bottom} corner="bl" color={P.accent} />
      <CornerMark x={right} y={bottom} corner="br" color={P.accent} />
      <div
        style={{
          position: "absolute",
          left: 40,
          top: 650,
          fontSize: 14,
          fontWeight: 800,
          letterSpacing: 1.6,
          color: P.accent,
          background: P.card,
          padding: "8px 14px",
          borderRadius: 4,
          boxShadow: "4px 4px 0 rgba(0,0,0,0.35)",
        }}
      >
        ZOOMING IN — {label}
      </div>
    </div>
  );
};

const ProductNamePlate: React.FC = () => {
  const P = usePalette();
  return (
    <Arrive at={B1 + 4} kind="wipe" box={{ x: 40, y: 40, w: 340, h: 56 }} dur={0.4}>
      <div
        style={{
          position: "absolute",
          left: 40,
          top: 40,
          width: 340,
          height: 56,
          background: P.card,
          borderRadius: 4,
          boxShadow: "6px 6px 0 rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          fontFamily,
        }}
      >
        <div style={{ fontSize: 16, fontWeight: 800, color: P.ink }}>Ghost Interviewer AI</div>
      </div>
    </Arrive>
  );
};

/** b2 has no backdrop (deliberately — the old door is an absence, not a page), which
 * leaves the right two-thirds of the frame empty next to the statusFocus claims card.
 * Fills that space with the concrete cost: anyone, any account, live credits. */
const OpenDoorPanel: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < B2 || frame >= B3) return null;
  return (
    <Arrive at={B2 + 10} kind="rise" box={{ x: 760, y: 220, w: 460, h: 300 }}>
      <div
        style={{
          position: "absolute",
          left: 760,
          top: 220,
          width: 460,
          height: 300,
          background: P.dangerBg,
          border: `2px solid ${P.dangerEdge}`,
          borderRadius: 10,
          boxShadow: "6px 6px 0 rgba(0,0,0,0.35)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily,
          padding: "0 24px",
        }}
      >
        <div style={{ fontSize: 64 }}>🔓</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: P.danger, marginTop: 14, textAlign: "center" }}>
          ANY GOOGLE ACCOUNT
        </div>
        <div style={{ fontSize: 15, fontWeight: 700, color: P.ink, marginTop: 8, textAlign: "center" }}>
          could open a session and start spending real credits
        </div>
      </div>
    </Arrive>
  );
};

const Finale: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < B5) return null;
  return (
    <>
      <LogWindow
        title="worker auth"
        from={B5 + 20}
        every={16}
        opacity={1}
        fontSize={21}
        win={{ x: 100, y: 110, w: 620, h: 400 }}
        lines={[
          { t: "01", text: "sign-in  acct:second.try@gmail.com", tone: "danger" },
          { t: "  ", text: "→ 403 not allow-listed", tone: "danger" },
          { t: "02", text: "token exchange  acct:second.try@gmail.com", tone: "danger" },
          { t: "  ", text: "→ 403 rejected", tone: "danger" },
          { t: "03", text: "request /chat  acct:second.try@gmail.com", tone: "danger" },
          { t: "  ", text: "→ 403 rejected", tone: "danger" },
          { t: "04", text: "allow-list unchanged", tone: "accent" },
        ]}
      />
      <Arrive at={B5 + 30} kind="punch" box={{ x: 780, y: 170, w: 400, h: 260 }} dur={0.5}>
        <div
          style={{
            position: "absolute",
            left: 780,
            top: 170,
            width: 400,
            height: 260,
            background: P.card,
            borderRadius: 10,
            boxShadow: "8px 8px 0 rgba(0,0,0,0.45)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontFamily,
          }}
        >
          <div style={{ fontSize: 72, fontWeight: 800, color: P.success }}>3 / 3</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: P.ink, marginTop: 10, textAlign: "center", padding: "0 20px" }}>
            CHECKS REJECTED THE SECOND ACCOUNT
          </div>
        </div>
      </Arrive>
    </>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the old door: one shared key, gated only by the secret URL */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="product" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="titleTakeover"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        base={STAGE}
        plate={0.7}
        data={{ title: "One Shared API Key", kicker: "Only the sign-in URL stood in the way" }}
      />
      {frame >= B1 && frame < B2 && <ProductNamePlate />}

      {/* b2 — the cost of that door: any account, real credits */}
      <MotionInsert
        effect="statusFocus"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        base={STAGE}
        data={{
          title: "Before the fix",
          claims: [
            { text: "Sign-in restricted", verdict: "no" },
            { text: "Credits protected", verdict: "no" },
          ],
        }}
      />
      <OpenDoorPanel />

      {/* b3 — the fix: Google OAuth checked against an explicit allow-list */}
      {cut(frame, B3, B4) === 1 && (
        <LiveWindow
          file={shotsFile}
          shot="commit"
          title="github.com/.../commit/ee52a37"
          from={B3}
          hold={B4 - B3}
          zoom={() => 2.2}
          focus={{ x: 0.5, y: 0.4 }}
          opacity={1}
          win={{ x: 40, y: 40, w: 1200, h: 520 }}
        />
      )}
      <MotionInsert
        effect="copyCorrection"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        base={STAGE}
        plate={0.7}
        data={{
          wrong: "Any Google account could sign in",
          right: "Only allow-listed emails get through",
          label: "Checked on every sign-in",
        }}
      />

      {/* b4 — the same check runs again on token exchange, and on every request */}
      {cut(frame, B4, B5) === 1 && (
        <LiveWindow
          file={shotsFile}
          shot="commit2"
          title="github.com/.../commit/ee52a37"
          from={B4}
          hold={B5 - B4}
          zoom={() => 2.3}
          focus={{ x: 0.5, y: 0.45 }}
          opacity={1}
          win={{ x: 40, y: 40, w: 1200, h: 520 }}
        />
      )}
      <MotionInsert
        effect="funnelAbsorption"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        base={STAGE}
        plate={0.3}
        data={{
          inputs: ["Sign-in check", "Token exchange check", "Every request check"],
          result: "Same allow-list, enforced three times",
        }}
      />

      {/* b5 — the result: a second account tried, all three checks rejected it */}
      <Finale />
      <ZoomFrame />
    </AbsoluteFill>
  );
};

export const FeatureGhostInterviewerLocksDoorG30: React.FC = () => (
  <PaletteProvider value={MOODS.slate}>
    <Inner />
  </PaletteProvider>
);
