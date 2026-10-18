// FeatureCallsRingThroughVoiceB59 — feature b59 — 1280x720, 858 frames @ 30fps, VOICE-SYNCED.
// archetype 2 zoom-in, mood mint. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// Product: bir — a closed family network for parents and kids: live location, calls and a
// daily activity screen in one app. This feature: parents and kids could already chat inside
// bir, but an actual call meant leaving for a separate phone app entirely, and the call history
// never made it back into bir. Fix: a WebRTC layer rings and connects right inside bir itself —
// a client state machine drives ringing/answering/hangup, a server route handles signaling, a
// coturn relay saves calls that can't connect peer-to-peer directly, and every call is written
// to a calls table so the history stays (commit c2719bf).
//
// Persistent element (archetype 2): the camera starts wide on bir's own chat screen (b1), where
// the call button hands off to a separate phone app, and ends tight on one element filling the
// frame (b5) — the call screen's own connection badge surviving a network dead spot. A small
// status band at the bottom tracks where a call lives (separate app -> inside bir) across the
// beats in between, since the middle beats are owned by catalog effects.
//
// Beat → effect (data only from the feature's own sentences and that one commit):
// b1 15-244    "chat inside the app... an actual call meant leaving... losing the history" —
//              titleTakeover over the feature's own page (backdrop "page"), kicker names bir
//              and the problem in one line.
// b2 244-395   "now calls ring and connect right inside the same app, voice or video" —
//              handoffExplain, BEFORE (leave bir) -> NOW (ring inside bir), over the hub
//              (backdrop "hub") for texture.
// b3 395-568   "a WebRTC layer handles the ringing, signaling and handoff behind the scenes" —
//              pipelineFlow, naming the real system (WebRTC + coturn relay) — no commit diff URL
//              was verified tonight, so the mechanism is drawn by name instead, over the
//              feature's own page (backdrop "page").
// b4 568-722   "every call gets logged too, so the history that used to vanish now stays" —
//              funnelAbsorption, three call kinds funnel into one kept history, over the hub
//              (backdrop "hub").
// b5 722-858   "it survives a 30-second dead spot in the network without ever dropping" — drawn,
//              no page/hub backdrop (gate 2): camera lands tight on the call screen's connection
//              badge, hero number 30, holds to the final frame.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { tween, ease, mix, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/b59.json";

const B1 = 15;
const B2 = 244;
const B3 = 395;
const B4 = 568;
const B5 = 722;
const END = 858;

/** Brighter than mint's raw accent (#0B7A5A) so it stays legible on the dark MotionInsert plate. */
const ACCENT = "#35D6A3";
const STAGE = "#07140F";

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

const SWITCH_AT = B2 + 30;

type BandState = { label: string; ok: boolean };
const bandStateAt = (frame: number): BandState => {
  if (frame < SWITCH_AT) return { label: "CALL LEAVES BIR", ok: false };
  return { label: "RINGS INSIDE BIR", ok: true };
};

/** b5: camera lands tight on the call screen's own connection badge; holds to the final frame. */
const CallTight: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B5) return null;

  const Badge = { x: 400, y: 70, w: 480, h: 440 };
  const haloScale = punchScale(sec(frame, B5, fps), 0.08);
  const at = B5 + 90;
  const sc = frame >= at ? punchScale(sec(frame, at, fps), 0) : 0;

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      <div style={{ position: "absolute", left: 50, top: 24, fontSize: 13, fontWeight: 800, letterSpacing: 2.4, color: P.accent }}>
        BIR · CALL SCREEN
      </div>

      <div
        style={{
          position: "absolute",
          left: 640 - 360,
          top: 290 - 360,
          width: 720,
          height: 720,
          borderRadius: 360,
          background: P.successBg,
          opacity: 0.35,
          transform: `scale(${haloScale})`,
        }}
      />

      <Arrive at={B5} kind="punch" box={Badge} dur={0.5}>
        <div
          style={{
            position: "absolute",
            left: Badge.x,
            top: Badge.y,
            width: Badge.w,
            height: Badge.h,
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
          <div style={{ fontSize: 120, transform: `scale(${sc || 1})`, color: P.success, fontWeight: 800, lineHeight: 1 }}>30</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: P.muted, marginTop: 4 }}>seconds of dead network</div>
          <div
            style={{
              marginTop: 16,
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
            CALL NEVER DROPPED
          </div>
        </div>
      </Arrive>
    </div>
  );
};

/** persistent bottom band: where a call lives, tracked across every beat. */
const CallBand: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < B1 || frame >= B5) return null;
  const state = bandStateAt(frame);

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
      <div
        style={{
          width: 14,
          height: 14,
          borderRadius: 7,
          background: state.ok ? P.success : P.danger,
        }}
      />
      <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1, color: state.ok ? P.success : P.danger }}>
        {state.label}
      </div>
    </div>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — wide establishing shot, over the feature's own page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="titleTakeover"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{
          title: "Calls leave the app",
          kicker: "bir — chat stayed inside, but a real call meant a different app, and the history vanished",
        }}
      />

      {/* b2 — the fix, over the hub */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="handoffExplain"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.72}
        data={{
          from: "Leave bir to make the call",
          to: "Call rings right inside bir",
          fromLabel: "BEFORE",
          toLabel: "NOW",
          points: ["Voice or video", "No separate app", "History stays attached"],
        }}
      />

      {/* b3 — the mechanism, named by its real system, over the feature's own page */}
      {cut(frame, B3, B4) === 1 && (
        <LiveBackdrop file={shotsFile} shot="page" from={B3} hold={B4 - B3} focus={{ x: 0.5, y: 0.2 }} />
      )}
      <MotionInsert
        effect="pipelineFlow"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.72}
        data={{
          steps: ["Ringing", "Signaling server", "WebRTC handoff"],
          result: "Call connects without the user doing anything extra",
          system: "WebRTC + coturn relay",
        }}
      />

      {/* b4 — every call kind funnels into one kept history, over the hub */}
      {cut(frame, B4, B5) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B4} hold={B5 - B4} focus={{ x: 0.5, y: 0.25 }} />}
      <MotionInsert
        effect="funnelAbsorption"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.72}
        data={{
          inputs: ["Voice call", "Video call", "Missed call"],
          result: "Every call logged — history stays",
        }}
      />

      {/* b5 — the result, no feature page / hub per gate 2; holds to the final frame */}
      <CallTight />

      <CallBand />
    </AbsoluteFill>
  );
};

export const FeatureCallsRingThroughVoiceB59: React.FC = () => (
  <PaletteProvider value={MOODS.mint}>
    <Inner />
  </PaletteProvider>
);
