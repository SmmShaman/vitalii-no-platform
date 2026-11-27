// FeatureKlientsLoginChecksYourK06 — feature k06 — 1280x720, 899 frames @ 30fps, VOICE-SYNCED.
// archetype 2 zoom-in, mood dawn. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// Klient's login had one shared KLIENT_PASSWORD; this clip explains the swap to
// Google sign-in + an email allow-list. Only two public pages exist for this
// product (no public repo, so no commit shots): the feature's own page and the
// features hub. The hub is skipped entirely; "page" is the one verified
// recording, replayed under every effect with the camera pushing a little
// deeper each beat (push 0.02 → 0.14) so the frame reads as one continuous
// zoom into the article, archetype 2. The last beat is drawn (gate 2 forbids
// ending on the feature page or the hub): a LogWindow with the real allow-list
// and 30-day session facts, built from solution_en/result_en — no invented
// number.
//
// Persistent element through all five beats: a top-left "KLIENT — LOGIN"
// plate that reports the zoom level, then locks to a checkmark in beat 5 —
// it changes state every beat instead of sitting still.
//
// Beat → effect (plan: shots/k06.motion.json):
// b1  15-251   "Anyone who had the one shared password could log into Klient —
//              no way to tell who was really using it, or lock out just one
//              person." → cornerTags, the problem + 3 facts, over the page.
// b2 251-340   "Now login goes through Google instead." → handoffExplain,
//              shared password → Google sign-in.
// b3 340-520   "A sign-in token gets checked against an allow-list of approved
//              emails before access is granted." → pipelineFlow, the 4-step
//              check.
// b4 520-666   "It's one shared key swapped for name badges only the right
//              people hold." → keywordCaption, the analogy.
// b5 666-899   "Remove an email from the list, and that person's 30-day
//              session is gone — everyone else keeps theirs." → drawn
//              LogWindow result, holds to the end.
//
// Single tech name in the whole clip: Google (sign-in chip, beats 2-3 only).
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { LogWindow, WIN_DEFAULT } from "./live-primitives";
import shotsFile from "./shots/k06.json";

const B1 = 15;
const B2 = 251;
const B3 = 340;
const B4 = 520;
const B5 = 666;
const END = 899;

/** Warm amber reads on the dark plate; dawn's own accent is too pale there. */
const ACCENT = "#FFB648";
const STAGE = "#20160A";

const BADGE = { x: 40, y: 40, w: 280, h: 64 };

/** The one element that survives every beat — it changes state each time. */
const ZoomBadge: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < B1) return null;
  const secured = frame >= B5;
  const pct = frame >= B4 ? 145 : frame >= B3 ? 130 : frame >= B2 ? 115 : 100;
  return (
    <Arrive at={B1 + 4} kind="wipe" box={BADGE} dur={0.4}>
      <div
        style={{
          position: "absolute",
          left: BADGE.x,
          top: BADGE.y,
          width: BADGE.w,
          height: BADGE.h,
          background: P.card,
          borderRadius: 4,
          boxShadow: "6px 6px 0 rgba(0,0,0,0.55)",
          padding: "9px 16px",
          boxSizing: "border-box",
          fontFamily,
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2, color: P.accent }}>KLIENT — LOGIN</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: secured ? P.success : P.ink, marginTop: 4 }}>
          {secured ? "✓ secured" : `zoom ${pct}%`}
        </div>
      </div>
    </Arrive>
  );
};

const RESULT_FACTS: { label: string; value: string }[] = [
  { label: "revoke one person", value: "1 email removed" },
  { label: "session length", value: "30 days" },
];

const Result: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < B5) return null;
  const win = WIN_DEFAULT;
  return (
    <>
      <div style={{ position: "absolute", left: 0, top: 118, width: 1280, textAlign: "center" }}>
        <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: 3, color: ACCENT, fontFamily }}>RESULT</div>
      </div>
      <div style={{ position: "absolute", left: win.x, top: 158, width: win.w, display: "flex", gap: 24 }}>
        {RESULT_FACTS.map((f) => (
          <div
            key={f.label}
            style={{
              flex: 1,
              background: P.card,
              borderRadius: 4,
              boxShadow: "6px 6px 0 rgba(0,0,0,0.55)",
              padding: "14px 18px",
              fontFamily,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1.4, color: P.muted, textTransform: "uppercase" }}>
              {f.label}
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: P.ink, marginTop: 4 }}>{f.value}</div>
          </div>
        ))}
      </div>
      <LogWindow
        title="server.mjs"
        from={B5 + 10}
        every={16}
        opacity={1}
        win={{ x: win.x, y: 230, w: win.w, h: 416 }}
        lines={[
          { t: "01", text: "POST /auth/google → id_token received", tone: "ink" },
          { t: "02", text: "token.aud verified, email_verified=true", tone: "success" },
          { t: "03", text: "email in KLIENT_ALLOWED_EMAILS → match", tone: "success" },
          { t: "04", text: "session cookie signed · 30-day expiry", tone: "ink" },
          { t: "05", text: "KLIENT_PASSWORD fallback: kept only if set", tone: "muted" },
          { t: "06", text: "remove 1 email from allow-list → access gone", tone: "danger" },
        ]}
      />
    </>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the problem: one shared password, no accountability */}
      {cut(frame, B1, B2) === 1 && (
        <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} push={0.02} focus={{ x: 0.5, y: 0.5 }} />
      )}
      <MotionInsert
        effect="cornerTags"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        plate={0.7}
        data={{
          statement: "One shared password, zero accountability",
          tags: ["One password for everyone", "No way to see who's in", "Can't remove just one person"],
        }}
      />

      {/* b2 — the swap: shared password → Google sign-in */}
      {cut(frame, B2, B3) === 1 && (
        <LiveBackdrop file={shotsFile} shot="page" from={B2} hold={B3 - B2} push={0.06} focus={{ x: 0.45, y: 0.4 }} />
      )}
      <MotionInsert
        effect="handoffExplain"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{
          from: "Shared password",
          to: "Google sign-in",
          fromLabel: "BEFORE",
          toLabel: "NOW",
          points: ["Browser sends a Google ID token", "Checked against an email allow-list"],
        }}
      />

      {/* b3 — how the check works */}
      {cut(frame, B3, B4) === 1 && (
        <LiveBackdrop file={shotsFile} shot="page" from={B3} hold={B4 - B3} push={0.1} focus={{ x: 0.4, y: 0.35 }} />
      )}
      <MotionInsert
        effect="pipelineFlow"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.7}
        data={{
          steps: ["Google ID token", "Verified against Google", "Checked against allow-list", "Session cookie set"],
          result: "Access granted",
          system: "server.mjs",
        }}
      />

      {/* b4 — the analogy */}
      {cut(frame, B4, B5) === 1 && (
        <LiveBackdrop file={shotsFile} shot="page" from={B4} hold={B5 - B4} push={0.14} focus={{ x: 0.35, y: 0.3 }} />
      )}
      <MotionInsert
        effect="keywordCaption"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.7}
        data={{
          line1: "One shared key",
          line2: "swapped for name badges",
          keywords: ["shared key", "name badges"],
        }}
      />

      {/* b5 — the result, drawn (never the feature page or the hub), holds to the end */}
      <Result />

      <ZoomBadge />
    </AbsoluteFill>
  );
};

export const FeatureKlientsLoginChecksYourK06: React.FC = () => (
  <PaletteProvider value={MOODS.dawn}>
    <Inner />
  </PaletteProvider>
);
