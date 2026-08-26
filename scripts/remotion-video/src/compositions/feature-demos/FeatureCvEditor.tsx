/**
 * FeatureCvEditor — feature j28 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 * BRIGHT INFOGRAPHIC template (v2) — rebuilt 2026-08-26 from the dark v1 clip.
 *
 * Story (4 beats):
 *  1. Problem — the AI read the CV but got one date wrong; fixing it meant a
 *     separate PDF editor, a re-upload and a full re-parse. ~20 minutes. Red.
 *  2. Solution — the same fix inside the app: open the section, click the field,
 *     type. 2 clicks, 3 seconds. Cursor does it on a real form mockup.
 *  3. How it works — 9 sections → edit in place → saved the moment you stop
 *     typing. One tech-credibility line (ProfileEditor.tsx, JSONB in Supabase).
 *  4. Result — 20 minutes → 3 seconds, ≈400× faster. Green zone.
 */
import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { B } from "./bright-theme";
import {
  LightBg,
  Group,
  Headline,
  Panel,
  BrowserWindow,
  StatPill,
  IconCard,
  FlowArrow,
  StickyNote,
  Cursor,
  CheckBadge,
  CaptionBand,
  seg,
  loopFade,
  fontFamily,
} from "./bright-primitives";

/** One collapsible CV section row in the editor mockup. */
const SectionRow: React.FC<{
  y: number;
  emoji: string;
  label: string;
  value: string;
  opacity?: number;
  highlight?: number;
  fixed?: number;
}> = ({ y, emoji, label, value, opacity = 1, highlight = 0, fixed = 0 }) => {
  if (opacity <= 0.004) return null;
  const bg = highlight > 0.02 ? `rgba(37,99,235,${0.06 + 0.06 * highlight})` : "transparent";
  return (
    <div
      style={{
        position: "absolute",
        left: 18,
        top: y,
        width: 664,
        height: 44,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "0 14px",
        borderRadius: 8,
        background: bg,
        border: `1px solid ${highlight > 0.02 ? B.accent : B.border}`,
        opacity,
        fontFamily,
        boxSizing: "border-box",
      }}
    >
      <span style={{ fontSize: 19 }}>{emoji}</span>
      <span style={{ fontSize: 17, fontWeight: 700, color: B.ink, width: 190 }}>{label}</span>
      <span
        style={{
          fontSize: 17,
          fontWeight: 600,
          color: fixed > 0.5 ? B.success : B.muted,
          flex: 1,
        }}
      >
        {fixed > 0.5 ? value.replace("2021", "2019") : value}
      </span>
      <span style={{ fontSize: 15, color: B.muted, opacity: 0.7 }}>▾</span>
    </div>
  );
};

export const FeatureCvEditor: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  // ── Beat windows (same rhythm as the j26 reference) ────────────────
  const b1 = seg(frame, 0, 10) * (1 - seg(frame, 104, 118)) * lf;
  const b2 = seg(frame, 112, 126) * (1 - seg(frame, 228, 242)) * lf;
  const b3 = seg(frame, 236, 250) * (1 - seg(frame, 332, 346)) * lf;
  const b4 = seg(frame, 340, 354) * lf;

  // ── Beat 1: the problem ───────────────────────────────────────────
  const noteOp = seg(frame, 26, 42, Easing.out(Easing.cubic));
  const pill1 = pop(48);
  const pill2 = pop(60);
  const pill3 = pop(72);
  // the wrong date pulses red inside the PDF mockup
  const wrongPulse = 0.5 + 0.5 * Math.sin((frame - 14) / 5);

  // ── Beat 2: the solution ──────────────────────────────────────────
  const editorIn = seg(frame, 126, 140, Easing.out(Easing.cubic));
  const rowIn = (i: number) => seg(frame, 134 + i * 5, 146 + i * 5, Easing.out(Easing.cubic));
  const openRow = seg(frame, 158, 170, Easing.inOut(Easing.cubic));
  const fixed = seg(frame, 190, 198);
  const cx = interpolate(frame, [128, 152, 168, 186, 210], [660, 300, 470, 470, 900], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const cy = interpolate(frame, [128, 152, 168, 186, 210], [420, 268, 268, 268, 420], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const cursorOp = seg(frame, 128, 136) * (1 - seg(frame, 210, 222));
  const click1 = seg(frame, 152, 164, Easing.out(Easing.quad));
  const click2 = seg(frame, 186, 198, Easing.out(Easing.quad));
  const savedIn = pop(200);
  const cap2 = seg(frame, 204, 218, Easing.out(Easing.cubic));

  // ── Beat 3: how it works ──────────────────────────────────────────
  const card1 = pop(252);
  const card2 = pop(272);
  const card3 = pop(292);
  const arr1 = seg(frame, 262, 278, Easing.inOut(Easing.cubic));
  const arr2 = seg(frame, 282, 298, Easing.inOut(Easing.cubic));
  const cap3 = seg(frame, 300, 316, Easing.out(Easing.cubic));

  // ── Beat 4: the result ────────────────────────────────────────────
  const beforeIn = seg(frame, 350, 364, Easing.out(Easing.cubic));
  const arrRes = seg(frame, 362, 378, Easing.inOut(Easing.cubic));
  const afterIn = pop(372);
  const speedX = Math.round(
    interpolate(frame, [384, 414], [1, 400], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }),
  );
  const speedOp = seg(frame, 384, 398, Easing.out(Easing.cubic));
  const check = pop(392);
  const footOp = seg(frame, 402, 418);

  return (
    <div style={{ position: "absolute", inset: 0, fontFamily }}>
      <LightBg />

      {/* ════ Beat 1 — PROBLEM ════ */}
      <Group opacity={b1}>
        <Headline text="The AI read your CV — and got" accentText="one date wrong" accentColor={B.danger} opacity={seg(frame, 4, 18)} />
        <BrowserWindow x={80} y={116} w={700} h={452} title="cv-vitalii-berbeha.pdf — read-only" opacity={Math.min(1, pop(8))}>
          <div style={{ padding: "26px 30px", fontFamily }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: B.ink }}>Vitalii Berbeha</div>
            <div style={{ fontSize: 17, fontWeight: 600, color: B.muted, marginTop: 6 }}>Full-stack developer · Gjøvik, Norway</div>
            <div style={{ height: 1, background: B.border, margin: "20px 0" }} />
            <div style={{ fontSize: 18, fontWeight: 800, color: B.ink, letterSpacing: 0.5 }}>WORK EXPERIENCE</div>
            <div style={{ marginTop: 16, fontSize: 18, fontWeight: 700, color: B.ink }}>Frontend Developer · TechCorp</div>
            <div
              style={{
                display: "inline-block",
                marginTop: 8,
                padding: "5px 12px",
                borderRadius: 7,
                fontSize: 18,
                fontWeight: 800,
                color: B.danger,
                background: B.dangerBg,
                border: `2px solid rgba(220,47,62,${0.35 + 0.5 * wrongPulse})`,
              }}
            >
              2021 – 2023 ← wrong, it was 2019
            </div>
            <div style={{ marginTop: 22, fontSize: 18, fontWeight: 700, color: B.ink }}>Support Engineer · DataSolve</div>
            <div style={{ marginTop: 8, fontSize: 18, fontWeight: 650, color: B.muted }}>2017 – 2019</div>
            <div style={{ marginTop: 26, height: 10, width: "82%", borderRadius: 5, background: B.chipBg }} />
            <div style={{ marginTop: 10, height: 10, width: "64%", borderRadius: 5, background: B.chipBg }} />
          </div>
        </BrowserWindow>
        <StickyNote
          x={830}
          y={150}
          w={350}
          opacity={noteOp}
          text="To fix one date: open a PDF editor, find it, retype it, re-upload, wait for the whole CV to be read again"
        />
        <StatPill x={846} y={356} emoji="🧾" text="A separate PDF editor" tone="danger" scale={pill1} opacity={Math.min(1, pill1)} />
        <StatPill x={846} y={418} emoji="🔁" text="Re-upload + full re-parse" tone="danger" scale={pill2} opacity={Math.min(1, pill2)} />
        <StatPill x={846} y={480} emoji="⏱️" text="~20 minutes gone" tone="danger" scale={pill3} opacity={Math.min(1, pill3)} />
        <CaptionBand text="A near-perfect CV you cannot touch is still a broken CV" tone="danger" opacity={seg(frame, 32, 48)} />
      </Group>

      {/* ════ Beat 2 — SOLUTION ════ */}
      <Group opacity={b2}>
        <Headline text="Now you just" accentText="click the field and type" accentColor={B.success} opacity={seg(frame, 116, 130)} />
        <BrowserWindow x={110} y={150} w={700} h={402} title="jobbot — my profile · 9 sections" opacity={editorIn}>
          <SectionRow y={16} emoji="👤" label="Personal info" value="Vitalii Berbeha · Gjøvik" opacity={rowIn(0)} />
          <SectionRow
            y={68}
            emoji="💼"
            label="Work experience"
            value="TechCorp · 2021 – 2023"
            opacity={rowIn(1)}
            highlight={openRow}
            fixed={fixed}
          />
          <SectionRow y={120} emoji="🎓" label="Education" value="NTNU · Bachelor" opacity={rowIn(2)} />
          <SectionRow y={172} emoji="🗣️" label="Languages" value="NO · EN · UA" opacity={rowIn(3)} />
          <SectionRow y={224} emoji="🧩" label="Skills" value="React · TypeScript · SQL" opacity={rowIn(4)} />
          <SectionRow y={276} emoji="🏅" label="Certificates" value="3 entries" opacity={rowIn(5)} />
          <div
            style={{
              position: "absolute",
              left: 18,
              top: 330,
              width: 664,
              textAlign: "center",
              fontSize: 16,
              fontWeight: 600,
              color: B.muted,
              opacity: rowIn(6) * 0.9,
              fontFamily,
            }}
          >
            …plus Projects, Courses and References — 9 sections in total
          </div>
        </BrowserWindow>
        <StatPill x={866} y={214} emoji="🖱️" text="2 clicks" tone="success" scale={savedIn} opacity={Math.min(1, savedIn)} />
        <StatPill x={866} y={276} emoji="⏱️" text="3 seconds" tone="success" scale={savedIn} opacity={Math.min(1, savedIn)} />
        <StatPill x={866} y={338} emoji="💾" text="Saved automatically" tone="success" scale={savedIn} opacity={Math.min(1, savedIn)} />
        <Cursor x={cx} y={cy} opacity={cursorOp} click={Math.max(click1 % 1, click2 % 1)} />
        <CaptionBand text="No PDF editor, no re-upload, no waiting for the CV to be read again" tone="accent" opacity={cap2} />
      </Group>

      {/* ════ Beat 3 — HOW IT WORKS ════ */}
      <Group opacity={b3}>
        <Headline text="Every part of the CV" accentText="under your control" accentColor={B.accent} opacity={seg(frame, 240, 254)} />
        <IconCard x={110} y={218} w={300} emoji="🗂️" title="9 expandable sections" sub="from contacts to references" tone="accent" scale={card1} opacity={Math.min(1, card1)} />
        <IconCard x={490} y={218} w={300} emoji="✏️" title="Edit right where you read" sub="add, reorder or delete a line" tone="accent" scale={card2} opacity={Math.min(1, card2)} />
        <IconCard x={870} y={218} w={300} emoji="💾" title="Saved the moment you stop" sub="and reused in every application" tone="success" scale={card3} opacity={Math.min(1, card3)} />
        <FlowArrow x={412} y={262} len={76} progress={arr1} />
        <FlowArrow x={792} y={262} len={76} progress={arr2} color={B.success} />
        <CaptionBand
          text="Under the hood: ProfileEditor.tsx, a React 19 component keeping the whole CV as JSONB in Supabase"
          opacity={cap3}
          fontSize={21}
          y={580}
        />
      </Group>

      {/* ════ Beat 4 — RESULT ════ */}
      <Group opacity={b4}>
        <Headline text="The payoff" opacity={seg(frame, 344, 358)} />
        <Panel x={140} y={170} w={400} h={210} tone="danger" opacity={beforeIn}>
          <div style={{ padding: "26px 30px", fontFamily }}>
            <div style={{ fontSize: 19, fontWeight: 700, color: B.danger, letterSpacing: 1 }}>BEFORE</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: B.ink, marginTop: 14 }}>~20 minutes</div>
            <div style={{ fontSize: 26, fontWeight: 650, color: B.muted, marginTop: 6 }}>to fix one date</div>
          </div>
        </Panel>
        <FlowArrow x={560} y={264} len={150} progress={arrRes} color={B.success} />
        <Panel x={740} y={170} w={400} h={210} tone="success" opacity={Math.min(1, afterIn)}>
          <div style={{ padding: "26px 30px", transform: `scale(${0.9 + 0.1 * Math.min(1, afterIn)})`, transformOrigin: "center", fontFamily }}>
            <div style={{ fontSize: 19, fontWeight: 700, color: B.success, letterSpacing: 1 }}>NOW</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: B.ink, marginTop: 14 }}>3 seconds</div>
            <div style={{ fontSize: 26, fontWeight: 650, color: B.muted, marginTop: 6 }}>2 clicks, in the app</div>
          </div>
        </Panel>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 424,
            width: 1280,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
            opacity: speedOp,
            fontFamily,
          }}
        >
          <div style={{ position: "relative", width: 52, height: 52 }}>
            <CheckBadge x={0} y={0} size={52} scale={check} opacity={Math.min(1, check)} />
          </div>
          <span style={{ fontSize: 52, fontWeight: 800, color: B.success }}>≈{speedX}× faster</span>
        </div>
        <div style={{ position: "absolute", left: 0, top: 540, width: 1280, textAlign: "center", opacity: footOp, fontFamily }}>
          <div style={{ fontSize: 22, fontWeight: 650, color: B.muted }}>
            Add a language in 5 seconds. Every fix carries into the next application.
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, color: B.accent, marginTop: 12 }}>JobBot · vitalii.no</div>
        </div>
      </Group>
    </div>
  );
};
