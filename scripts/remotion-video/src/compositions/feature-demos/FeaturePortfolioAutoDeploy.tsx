/**
 * FeaturePortfolioAutoDeploy — feature v17 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: the self-hosted portfolio stack has no `supabase functions deploy`
 * — Edge Functions are plain files under volumes/functions/, so a push only
 * reached production once someone copied the files over by hand; a
 * tag-sanitizer fix once sat stale on the VPS for four days → a new systemd
 * timer, portfolio-functions-deploy.timer, fires the deploy script every 5
 * minutes, fetching origin/main and fast-forwarding when possible → it
 * refuses to touch a dirty or diverged clone (an agent could be mid-edit),
 * rsyncs without --delete (the generic edge-runtime router exists only on
 * the VPS, never in git), and restarts the runtime only on real checksum
 * drift — pull-based, so no VPS SSH key ever lives in GitHub Secrets → a
 * push now reaches the live stack within 5 minutes instead of days.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const GITHUB = { x: 90, y: 50, w: 300, h: 86 };
const GITHUB_B: Pt = { x: GITHUB.x + GITHUB.w / 2, y: GITHUB.y + GITHUB.h };

const VPS_VOLUME = { x: 890, y: 50, w: 300, h: 86 };
const VPS_VOLUME_B: Pt = { x: VPS_VOLUME.x + VPS_VOLUME.w / 2, y: VPS_VOLUME.y + VPS_VOLUME.h };

const TIMER = { x: 390, y: 210, w: 500, h: 100 };
const TIMER_TL: Pt = { x: TIMER.x + 90, y: TIMER.y };
const TIMER_B: Pt = { x: TIMER.x + TIMER.w / 2, y: TIMER.y + TIMER.h };

const SCRIPT = { x: 390, y: 400, w: 500, h: 90 };
const SCRIPT_T: Pt = { x: SCRIPT.x + SCRIPT.w / 2, y: SCRIPT.y };
const SCRIPT_R: Pt = { x: SCRIPT.x + SCRIPT.w, y: SCRIPT.y + SCRIPT.h / 2 };

const OLD_PATH: Pt[] = [GITHUB_B, { x: 640, y: 300 }, VPS_VOLUME_B];
const GITHUB_TO_TIMER: Pt[] = [GITHUB_B, TIMER_TL];
const TIMER_TO_SCRIPT: Pt[] = [TIMER_B, SCRIPT_T];
const SCRIPT_TO_VOLUME: Pt[] = [SCRIPT_R, VPS_VOLUME_B];

export const FeaturePortfolioAutoDeploy: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–120): a push only shipped once someone copied files by hand ──
  const ghOp = pop(6) * lf;
  const ghLit = interpolate(frame, [6, 30, 96, 118], [0, 0.5, 0.5, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const volOp = pop(14) * lf;
  const volLit = interpolate(frame, [14, 38, 96, 118], [0, 0.5, 0.5, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const oldPathT = seg(frame, 30, 74);
  const oldPathVis = frame >= 30 && frame < 118 ? 1 : 0;
  const crossScale = pop(60) * interpolate(frame, [96, 118], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1In = seg(frame, 44, 66, Easing.out(Easing.cubic));
  const pill1Op = pill1In * interpolate(frame, [100, 122], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 24, 46, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [100, 122], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (120–225): timer fetches origin/main every 5 minutes ──
  const t2 = seg(frame, 138, 164);
  const t2Vis = frame >= 138 && frame < 216 ? 1 : 0;
  const timerOp = appear(148, 18) * lf;
  const timerLit = interpolate(frame, [156, 180, 420, 440], [0, 0.8, 0.8, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2In = seg(frame, 182, 204, Easing.out(Easing.cubic));
  const pill2Op = pill2In * interpolate(frame, [212, 234], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap2In = seg(frame, 160, 182, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [212, 234], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // ── Beat 3 (225–330): safeguards — skip if dirty, rsync without --delete ──
  const t3a = seg(frame, 236, 262);
  const t3aVis = frame >= 236 && frame < 320 ? 1 : 0;
  const scriptOp = appear(244, 16) * lf;
  const scriptLit = interpolate(frame, [252, 274, 420, 440], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t3b = seg(frame, 280, 306);
  const t3bVis = frame >= 280 && frame < 336 ? 1 : 0;
  const pill3In = seg(frame, 290, 312, Easing.out(Easing.cubic));
  const pill3Op = pill3In * interpolate(frame, [326, 348], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap3In = seg(frame, 262, 284, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [326, 348], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // ── Beat 4 (330–450): result ──
  const volCheck = pop(356) * lf;
  const metricOp = seg(frame, 340, 362, Easing.out(Easing.cubic)) * lf;
  const finalCapIn = seg(frame, 380, 402, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(386) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={OLD_PATH} color={T.danger} width={2} progress={oldPathT} opacity={0.65 * oldPathVis * lf} dashed />
      <Connector pts={GITHUB_TO_TIMER} color={T.accent} width={2.5} progress={t2} opacity={0.85 * t2Vis * lf} />
      <Connector pts={TIMER_TO_SCRIPT} color={T.accent} width={2.5} progress={t3a} opacity={0.85 * t3aVis * lf} />
      <Connector pts={SCRIPT_TO_VOLUME} color={T.success} width={2.5} progress={t3b} opacity={0.8 * t3bVis * lf} />

      <SchemaNode {...GITHUB} state="accent" lit={ghLit} opacity={ghOp} label="origin/main" fontSize={19}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>push touches supabase/functions/**</div>
      </SchemaNode>
      <SchemaNode {...VPS_VOLUME} state="danger" lit={volLit} opacity={volOp} label="volumes/functions/ (live)" fontSize={18}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>no supabase functions deploy here</div>
      </SchemaNode>
      <Badge x={VPS_VOLUME.x + VPS_VOLUME.w - 20} y={VPS_VOLUME.y - 16} kind="cross" scale={crossScale} opacity={crossScale} size={26} />
      <Pill x={430} y={158} text="manual copy only — sat stale 4 days once" color={T.danger} opacity={pill1Op} fontSize={15} />

      <SchemaNode {...TIMER} state="success" lit={timerLit} opacity={timerOp} label="portfolio-functions-deploy.timer" fontSize={19}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>fires every 5 minutes</div>
      </SchemaNode>
      <Token pts={GITHUB_TO_TIMER} t={t2} opacity={t2Vis * lf} />
      <Pill x={TIMER.x + 30} y={TIMER.y - 42} text="fetches origin/main, fast-forwards when clean" color={T.success} opacity={pill2Op} fontSize={15} />

      <SchemaNode {...SCRIPT} state="accent" lit={scriptLit} opacity={scriptOp} label="deploy script: clean? fast-forward? → rsync" fontSize={17}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>no --delete · restart only on checksum drift</div>
      </SchemaNode>
      <Token pts={TIMER_TO_SCRIPT} t={t3a} opacity={t3aVis * lf} />
      <Token pts={SCRIPT_TO_VOLUME} t={t3b} color={T.success} opacity={t3bVis * lf} />
      <Badge x={VPS_VOLUME.x + VPS_VOLUME.w - 20} y={VPS_VOLUME.y - 16} kind="check" scale={volCheck} opacity={volCheck} size={26} />
      <Pill x={SCRIPT.x - 10} y={SCRIPT.y + SCRIPT.h + 16} text="dirty or diverged clone → SKIP pull, never forced" color={T.amber} opacity={pill3Op} fontSize={15} />

      <Caption x={90} y={648} w={1100} text="Edge Functions were plain files — a push shipped only once someone copied them by hand" color={T.danger} opacity={cap1} fontSize={20} weight={600} />
      <Caption x={90} y={648} w={1100} text="A systemd timer fetches origin/main every 5 minutes, fast-forwarding when it can" color={T.text} opacity={cap2} fontSize={21} weight={600} />
      <Caption x={90} y={648} w={1100} text="Pull-based by design — no VPS SSH key ever has to live in GitHub Secrets" color={T.amber} opacity={cap3} fontSize={21} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 20, fontWeight: 600, color: T.muted }}>Same box also runs jobbot, both databases, and the nanoclaw agents</div>
      </div>
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
        <div style={{ fontSize: 25, fontWeight: 600, color: T.success }}>live within 5 minutes, not 4 days</div>
      </div>
    </AbsoluteFill>
  );
};
