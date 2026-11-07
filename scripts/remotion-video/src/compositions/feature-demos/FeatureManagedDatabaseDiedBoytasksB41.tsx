// FeatureManagedDatabaseDiedBoytasksB41 — feature b41 — 1280x720, 961 frames @ 30fps, VOICE-SYNCED.
// archetype 7 hero-number, mood violet. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// One editorial effect per sentence, chosen by what changes on screen, over the
// real Boytasks feature page as evidence where available, one owner of the
// frame, a reading hold at the end of every beat, cuts not fades (cut()).
//
// Beat -> effect (data only from the feature row — no commits exist for b41):
// b1 15-207   "a free cloud database the app depended on simply stopped
//             working — with no backup saved anywhere"
//             cornerTags: the claim + three facts, over the feature's own
//             page (backdrop "page1"). Hero number shrinks into the band,
//             danger: 0 / NO BACKUP.
// b2 207-370  "one pause-and-restart bought enough time to copy everything
//             out before it died for good"
//             keywordCaption, drawn (metaphor/plumbing, no backdrop). Hero
//             stays shrunk, still danger.
// b3 370-556  "so the database moved off rented hosting onto our own server
//             — like leaving a landlord's apartment"
//             drawn MigrationCard + the hero number flips here: 120 / OWN
//             SERVER, success, fontSize 260, owns the frame (gate 1).
// b4 556-738  "Postgres now runs there directly, using the same keys, so
//             nothing in the app changed"
//             copyCorrection: the wrong assumption (new URL) corrected to the
//             real fact (same JWT keys), over the page's own description
//             (backdrop "page2"). Hero shrinks back into the band, still 120.
// b5 738-961  "it adds about 120 megabytes to the server, and the only thing
//             that changed was the address"
//             Hero number stays big. Drawn LogWindow, 6 real lines from the
//             feature's own numbers, holds to the end.
//
// Persistent element: the hero number (archetype 7) — shrunk into a lower-
// third band (y>=606) whenever a catalog effect owns the upper frame (b1, b2,
// b4), big at fontSize 260 and owning the whole frame when nothing else
// competes for it (b3, b5). Value/tone flips exactly once, at b3's first
// frame, from danger (0 / NO BACKUP) to success (120 / OWN SERVER).

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, cut } from "./motion-primitives";
import { LogWindow } from "./live-primitives";
import { tween, ease } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/b41.json";

const B1 = 15;
const B2 = 207;
const B3 = 370;
const B4 = 556;
const B5 = 738;
const END = 961;

const ACCENT = "#8C6FF5";
const STAGE = "#140F26";
const BAND = { x: 40, y: 606, w: 420, h: 92 };

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

const HeroFigure: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const flipped = frame >= B3;
  const value = flipped ? "120" : "0";
  const unit = "MB";
  const status = flipped ? "OWN SERVER" : "NO BACKUP";
  const color = flipped ? P.success : P.danger;
  const big = (frame >= B3 && frame < B4) || frame >= B5;

  if (big) {
    const inAt = frame >= B5 ? B5 : B3;
    const t = tween(sec(frame, inAt, fps), 0, 0.5, ease.power3Out);
    return (
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1280,
          height: 720,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily,
          opacity: t,
        }}
      >
        <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: 3, color: P.muted }}>
          ADDED TO THE SERVER
        </span>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <span style={{ fontSize: 260, fontWeight: 900, color, lineHeight: 1 }}>{value}</span>
          <span style={{ fontSize: 48, fontWeight: 800, color: P.muted }}>{unit}</span>
        </div>
        <div
          style={{
            marginTop: 14,
            padding: "8px 20px",
            borderRadius: 999,
            border: `2px solid ${color}`,
            fontSize: 20,
            fontWeight: 800,
            letterSpacing: 1.5,
            color,
          }}
        >
          {status}
        </div>
      </div>
    );
  }

  const entryAt = frame >= B4 ? B4 : B1;
  const t = tween(sec(frame, entryAt, fps), 0, 0.35, ease.power3Out);
  return (
    <div
      style={{
        position: "absolute",
        left: BAND.x,
        top: BAND.y,
        width: BAND.w,
        height: BAND.h,
        borderRadius: 6,
        border: `2px solid ${color}`,
        background: "rgba(0,0,0,0.5)",
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "0 20px",
        fontFamily,
        opacity: t,
      }}
    >
      <span style={{ fontSize: 48, fontWeight: 900, color, lineHeight: 1 }}>{value}</span>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1.2, color: P.muted }}>{unit}</span>
        <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: 1, color }}>{status}</span>
      </div>
    </div>
  );
};

const ProductPlate: React.FC<{ from: number; dur: number }> = ({ from, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  const t = (frame - from) / fps;
  const inAmt = Math.min(1, Math.max(0, t / 0.3));
  if (frame < from || frame >= from + dur) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 40,
        top: 36,
        width: 920,
        padding: "8px 14px",
        borderRadius: 6,
        background: "rgba(0,0,0,0.55)",
        border: `1px solid ${P.border}`,
        opacity: inAmt,
        fontFamily,
      }}
    >
      <span style={{ fontSize: 13, fontWeight: 700, color: "#fff", lineHeight: 1.35 }}>
        Boytasks — a screen-time and task system for three kids: YouTube is gated by finishing
        school and chore tasks first, run on Cloudflare Workers
      </span>
    </div>
  );
};

const MigrationCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (!(cut(frame, B3, B4) === 1)) return null;
  const t = tween(sec(frame, B3 + 4, fps), 0, 0.4, ease.power3Out);
  return (
    <div
      style={{
        position: "absolute",
        left: 710,
        top: 230,
        width: 530,
        padding: "22px 26px",
        borderRadius: 10,
        border: `2px solid ${P.success}`,
        background: "rgba(0,0,0,0.6)",
        boxSizing: "border-box",
        fontFamily,
        opacity: t,
      }}
    >
      <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: 1.4, color: P.muted }}>
        🏠 LEFT THE LANDLORD'S APARTMENT
      </span>
      <div style={{ marginTop: 10, fontSize: 24, fontWeight: 800, color: "#fff", lineHeight: 1.3 }}>
        Database moved off rented hosting
      </div>
      <div style={{ marginTop: 6, fontSize: 18, fontWeight: 700, color: P.success }}>
        onto our own VPS — Postgres, self-managed
      </div>
    </div>
  );
};

const GlossCaption: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (!(cut(frame, B4, B5) === 1)) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 710,
        top: 480,
        width: 530,
        padding: "8px 14px",
        borderRadius: 6,
        background: "rgba(0,0,0,0.55)",
        border: `1px solid ${P.border}`,
        fontFamily,
      }}
    >
      <span style={{ fontSize: 13, fontWeight: 700, color: P.muted }}>
        JWT — the login keys the app already trusted, reused as-is
      </span>
    </div>
  );
};

const RESULT_LOG = [
  { t: "02:11", text: "free-tier postgres: connection refused — service deleted", tone: "danger" as const },
  { t: "02:11", text: "backup check: no automated backup found anywhere", tone: "danger" as const },
  { t: "02:14", text: "provider: paused instance resumed — one last window open", tone: "accent" as const },
  { t: "02:19", text: "pg_dump: full export copied out before deletion", tone: "accent" as const },
  { t: "02:40", text: "self-host: postgres 16 restored on our own VPS", tone: "success" as const },
  { t: "02:41", text: "same JWT signing keys reused — zero app code changes", tone: "success" as const },
];

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the free database died with no backup anywhere */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page1" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="cornerTags"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        plate={0.72}
        data={{
          statement: "A free database died — zero backups existed",
          tags: ["Free-tier DB", "No backup", "App down"],
        }}
      />
      <ProductPlate from={B1} dur={B2 - B1} />

      {/* b2 — pause-and-restart bought enough time to copy everything out */}
      <MotionInsert
        effect="keywordCaption"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.72}
        data={{
          line1: "One pause-and-restart bought just enough time",
          line2: "to copy everything out before it died for good",
          keywords: ["pause", "restart", "copy", "died"],
        }}
      />

      {/* b3 — the database moved off rented hosting onto our own server */}
      <MigrationCard />

      {/* b4 — Postgres runs there directly, same keys, nothing in the app changed */}
      {cut(frame, B4, B5) === 1 && <LiveBackdrop file={shotsFile} shot="page2" from={B4} hold={B5 - B4} />}
      <MotionInsert
        effect="copyCorrection"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.72}
        data={{
          label: "Connection keys",
          wrong: "New database URL to update",
          right: "Same JWT keys — nothing in the app changed",
        }}
      />
      <GlossCaption />

      {/* b5 — result: +120MB, address changed, nothing else. Holds to the end */}
      {frame >= B5 && (
        <LogWindow
          title="db_migrate.sh"
          from={B5}
          every={24}
          opacity={1}
          win={{ x: 150, y: 110, w: 980, h: 480 }}
          fontSize={22}
          lines={RESULT_LOG}
        />
      )}

      <HeroFigure />
    </AbsoluteFill>
  );
};

export const FeatureManagedDatabaseDiedBoytasksB41: React.FC = () => (
  <PaletteProvider value={MOODS.violet}>
    <Inner />
  </PaletteProvider>
);
