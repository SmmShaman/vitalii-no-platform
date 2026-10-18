// FeatureFamilyLinkKilledChromeB62 — feature b62 — 1280x720, 805 frames @ 30fps, VOICE-SYNCED.
// archetype 2 zoom-in, mood slate. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// Product: Boytasks — a screen-time and task system for three kids: YouTube is gated
// until school and chore tasks are done in the app, run on Cloudflare Workers.
//
// Persistent element (archetype 2): the camera starts wide on a phone home screen (b1)
// and ends tight on one icon filling the frame (b5) — "scales/pans INTO one element
// until it fills the frame" from the archetype table. A small status band at the
// bottom tracks the app's own state (web page -> suspended -> native) across every
// beat in between, since the middle beats are owned by catalog effects.
//
// Beat -> effect (data only from the feature row):
// b1 15-155   "one phone setting changes... a kid's homework app disappears"
//             drawn only: wide phone home screen — Family Link control icon, the
//             Boytasks icon (with its one tech caption, "(WebView)"), filler icons.
//             Product name plate names Boytasks.
// b2 155-347  "it had been living inside Chrome, as a wrapped web page"
//             copyCorrection: "The app just broke" -> "It was a web page wrapped in
//             Chrome".
// b3 347-515  "when Chrome got suspended, the whole app vanished... for all three kids"
//             funnelAbsorption: each kid's Boytasks funnels into one result — gone.
// b4 515-633  "now it's a real native app, with no Chrome underneath it"
//             handoffExplain: web page inside Chrome -> real native Android app.
// b5 633-805  "the same suspension happens today, and all three kids keep going"
//             drawn only: camera lands tight on the native Boytasks icon, all three
//             kid-status dots green, holding to the final frame.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { tween, ease, mix, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/b62.json";

const B1 = 15;
const B2 = 155;
const B3 = 347;
const B4 = 515;
const B5 = 633;
const END = 805;

const STAGE = "#0C1016";
const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

const SUSPEND_AT = B3 + 50;
const RESTORE_AT = B4 + 15;

const KIDS = ["Kid 1", "Kid 2", "Kid 3"];

type ChipState = { label: string; ok: boolean };
const chipStateAt = (frame: number): ChipState => {
  if (frame < SUSPEND_AT) return { label: "CHROME WEB PAGE", ok: true };
  if (frame < RESTORE_AT) return { label: "SUSPENDED", ok: false };
  return { label: "NATIVE APP", ok: true };
};

/** b1: wide phone home screen, naming the product. */
const PhoneWide: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1 || frame >= B2) return null;

  const Phone = { x: 430, y: 70, w: 420, h: 580 };
  const icons = [
    { label: "Family Link", emoji: "👨", lock: true },
    { label: "Boytasks", emoji: "📋", lock: false, caption: "(WebView)" },
    { label: "Clock", emoji: "⏰", lock: false },
    { label: "Camera", emoji: "📷", lock: false },
    { label: "Weather", emoji: "☀️", lock: false },
    { label: "Settings", emoji: "⚙️", lock: false },
  ];

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      <div style={{ position: "absolute", left: 50, top: 36, fontSize: 13, fontWeight: 800, letterSpacing: 2.4, color: P.accent }}>
        PHONE · HOME SCREEN
      </div>

      <Arrive at={B1} kind="wipe" box={Phone} dur={0.4}>
        <div
          style={{
            position: "absolute",
            left: Phone.x,
            top: Phone.y,
            width: Phone.w,
            height: Phone.h,
            background: P.card,
            border: `4px solid ${P.border}`,
            borderRadius: 32,
            boxShadow: "10px 10px 0 rgba(0,0,0,0.4)",
            padding: 36,
            boxSizing: "border-box",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridAutoRows: "150px",
            columnGap: 20,
            rowGap: 14,
          }}
        >
          {icons.map((icon, i) => (
            <div
              key={icon.label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                transform: `scale(${i === 1 ? punchScale(sec(frame, B1 + 16, fps), 0.1) : 1})`,
              }}
            >
              <div style={{ fontSize: 46 }}>{icon.emoji}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: P.ink, marginTop: 6, textAlign: "center" }}>{icon.label}</div>
              {icon.caption && (
                <div style={{ fontSize: 11, fontWeight: 600, color: P.muted, marginTop: 2 }}>{icon.caption}</div>
              )}
              {icon.lock && (
                <div style={{ position: "absolute", top: -4, right: 10, fontSize: 16 }}>🔒</div>
              )}
            </div>
          ))}
        </div>
      </Arrive>

      {frame >= B1 + 46 && (
        <div
          style={{
            position: "absolute",
            left: 80,
            top: 280,
            width: 320,
            padding: "16px 20px",
            background: P.accentBg,
            border: `2px solid ${P.accentEdge}`,
            borderRadius: 10,
            boxShadow: "6px 6px 0 rgba(0,0,0,0.35)",
            transform: `scale(${punchScale(sec(frame, B1 + 46, fps), 0)})`,
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 800, color: P.ink }}>BOYTASKS</div>
          <div style={{ fontSize: 13, color: P.muted, marginTop: 4 }}>Tasks & screen time for 3 kids</div>
        </div>
      )}
    </div>
  );
};

/** b5: camera lands tight on the native icon; holds to the final frame. */
const PhoneTight: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B5) return null;

  const Icon = { x: 400, y: 50, w: 480, h: 480 };
  const haloScale = punchScale(sec(frame, B5, fps), 0.08);

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      <div style={{ position: "absolute", left: 50, top: 24, fontSize: 13, fontWeight: 800, letterSpacing: 2.4, color: P.accent }}>
        BOYTASKS · LIVE STATUS
      </div>

      <div
        style={{
          position: "absolute",
          left: 640 - 380,
          top: 290 - 380,
          width: 760,
          height: 760,
          borderRadius: 380,
          background: P.successBg,
          opacity: 0.35,
          transform: `scale(${haloScale})`,
        }}
      />

      <Arrive at={B5} kind="punch" box={Icon} dur={0.5}>
        <div
          style={{
            position: "absolute",
            left: Icon.x,
            top: Icon.y,
            width: Icon.w,
            height: Icon.h,
            background: P.card,
            border: `5px solid ${P.successEdge}`,
            borderRadius: 48,
            boxShadow: "14px 14px 0 rgba(0,0,0,0.4)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ fontSize: 160 }}>📋</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: P.ink, marginTop: 12 }}>BOYTASKS</div>
          <div
            style={{
              marginTop: 12,
              padding: "7px 16px",
              background: P.successBg,
              border: `2px solid ${P.successEdge}`,
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 800,
              color: P.success,
              letterSpacing: 1.2,
            }}
          >
            NATIVE · NO CHROME
          </div>
        </div>
      </Arrive>

      {KIDS.map((kid, i) => {
        const at = B5 + 20 + i * 12;
        const Card = { x: 80 + i * 380, y: 570, w: 340, h: 120 };
        if (frame < at) return null;
        return (
          <Arrive key={kid} at={at} kind="rise" box={Card} dur={0.4}>
            <div
              style={{
                position: "absolute",
                left: Card.x,
                top: Card.y,
                width: Card.w,
                height: Card.h,
                background: P.successBg,
                border: `2px solid ${P.successEdge}`,
                borderRadius: 10,
                boxShadow: "6px 6px 0 rgba(0,0,0,0.3)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ fontSize: 17, fontWeight: 800, color: P.ink }}>{kid}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                <div style={{ width: 13, height: 13, borderRadius: 7, background: P.success }} />
                <div style={{ fontSize: 14, fontWeight: 700, color: P.success }}>ONLINE</div>
              </div>
            </div>
          </Arrive>
        );
      })}
    </div>
  );
};

/** persistent bottom band: the app's own state, tracked across every beat. */
const StatusChip: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < B1 || frame >= B5) return null;
  const state = chipStateAt(frame);

  return (
    <div
      style={{
        position: "absolute",
        left: 40,
        top: 606,
        width: 420,
        height: 84,
        background: P.card,
        border: `2px solid ${state.ok ? P.successEdge : P.dangerEdge}`,
        borderRadius: 10,
        boxShadow: "6px 6px 0 rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
        boxSizing: "border-box",
        fontFamily,
        gap: 14,
      }}
    >
      {KIDS.map((kid) => (
        <div key={kid} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 7,
              background: state.ok ? P.success : P.danger,
            }}
          />
          <div style={{ fontSize: 10, fontWeight: 700, color: P.muted, marginTop: 3 }}>{kid}</div>
        </div>
      ))}
      <div style={{ marginLeft: "auto", textAlign: "right" }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, color: state.ok ? P.success : P.danger }}>
          {state.label}
        </div>
      </div>
    </div>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();

  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — wide establishing shot, over the feature's own page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      {cut(frame, B1, B2) === 1 && <AbsoluteFill style={{ background: "rgba(8,8,8,0.72)" }} />}
      <PhoneWide />

      {/* b2 — the mechanism, over the hub */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="copyCorrection"
        from={B2}
        dur={B3 - B2}
        accent={P.accent}
        plate={0.72}
        data={{
          wrong: "The app just broke",
          right: "It was a web page wrapped in Chrome",
          label: "ACTUALLY",
        }}
      />

      {/* b3 — the failure, across all three kids, over the feature's own page */}
      {cut(frame, B3, B4) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B3} hold={B4 - B3} focus={{ x: 0.5, y: 0.2 }} />}
      <MotionInsert
        effect="funnelAbsorption"
        from={B3}
        dur={B4 - B3}
        accent={P.accent}
        plate={0.72}
        data={{
          inputs: ["Kid 1's Boytasks", "Kid 2's Boytasks", "Kid 3's Boytasks"],
          result: "Chrome suspended -> every kid's app gone",
        }}
      />

      {/* b4 — the fix, over the hub */}
      {cut(frame, B4, B5) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B4} hold={B5 - B4} focus={{ x: 0.5, y: 0.25 }} />}
      <MotionInsert
        effect="handoffExplain"
        from={B4}
        dur={B5 - B4}
        accent={P.accent}
        plate={0.72}
        data={{
          from: "Web page inside Chrome",
          to: "Real native Android app",
          fromLabel: "BEFORE",
          toLabel: "NOW",
          points: ["No Chrome dependency", "Works through any suspension"],
        }}
      />

      {/* b5 — the result, no feature page / hub per gate 2; holds to the final frame */}
      <PhoneTight />

      <StatusChip />
    </AbsoluteFill>
  );
};

export const FeatureFamilyLinkKilledChromeB62: React.FC = () => (
  <PaletteProvider value={MOODS.slate}>
    <Inner />
  </PaletteProvider>
);
