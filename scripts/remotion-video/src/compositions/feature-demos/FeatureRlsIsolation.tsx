/**
 * FeatureRlsIsolation — feature j31 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 * BRIGHT INFOGRAPHIC template (v2) — rebuilt 2026-08-26 from the dark v1 clip.
 *
 * Story (4 beats):
 *  1. Problem — once more than one person uses JobBot, a single forgotten line in
 *     one query is enough for Anna to be handed Boris's saved logins and
 *     applications. Guarding that in app code means never slipping, ever. Red.
 *  2. Solution — the database itself refuses. Every request is asked "who are
 *     you?" first, and rows that aren't yours are simply not returned — the same
 *     query returns 12 rows for Anna and 0 for Boris.
 *  3. How it works — 10+ tables → a rule on each → a request without your identity
 *     comes back empty. Tech line: PostgreSQL row-level security on auth.uid().
 *  4. Result — before: safe only while every query is written perfectly. Now:
 *     0 rows can cross between accounts, enforced below the app. Green zone.
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
  CheckBadge,
  CaptionBand,
  seg,
  loopFade,
  fontFamily,
} from "./bright-primitives";

/** A small labelled data row used in both the leak and the isolated views. */
const DataLine: React.FC<{ y: number; emoji: string; text: string; owner: string; tone: "danger" | "success" | "card"; opacity?: number }> = ({
  y,
  emoji,
  text,
  owner,
  tone,
  opacity = 1,
}) => {
  if (opacity <= 0.004) return null;
  const c = tone === "danger" ? B.danger : tone === "success" ? B.success : B.muted;
  const bg = tone === "danger" ? B.dangerBg : tone === "success" ? B.successBg : B.chipBg;
  return (
    <div
      style={{
        position: "absolute",
        left: 20,
        top: y,
        width: 620,
        height: 46,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "0 16px",
        borderRadius: 9,
        background: bg,
        border: `1px solid ${c}33`,
        opacity,
        fontFamily,
        boxSizing: "border-box",
      }}
    >
      <span style={{ fontSize: 19 }}>{emoji}</span>
      <span style={{ fontSize: 17.5, fontWeight: 650, color: B.ink, flex: 1 }}>{text}</span>
      <span style={{ fontSize: 15.5, fontWeight: 800, color: c }}>{owner}</span>
    </div>
  );
};

export const FeatureRlsIsolation: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  const b1 = seg(frame, 0, 10) * (1 - seg(frame, 104, 118)) * lf;
  const b2 = seg(frame, 112, 126) * (1 - seg(frame, 228, 242)) * lf;
  const b3 = seg(frame, 236, 250) * (1 - seg(frame, 332, 346)) * lf;
  const b4 = seg(frame, 340, 354) * lf;

  // ── Beat 1: the leak ──────────────────────────────────────────────
  const winIn = Math.min(1, pop(8));
  const line = (i: number) => seg(frame, 16 + i * 8, 28 + i * 8, Easing.out(Easing.cubic));
  const alarm = 0.5 + 0.5 * Math.sin((frame - 56) / 4.5);
  const leakIn = seg(frame, 56, 70, Easing.out(Easing.cubic));
  const noteOp = seg(frame, 34, 50, Easing.out(Easing.cubic));
  const pill1 = pop(74);
  const pill2 = pop(86);

  // ── Beat 2: the database says no ──────────────────────────────────
  const askIn = seg(frame, 128, 142, Easing.out(Easing.cubic));
  const annaIn = pop(150);
  const borisIn = pop(178);
  const stampIn = pop(198);
  const cap2 = seg(frame, 206, 220, Easing.out(Easing.cubic));

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
  const tables = Math.round(
    interpolate(frame, [384, 414], [0, 10], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }),
  );
  const tablesOp = seg(frame, 384, 398, Easing.out(Easing.cubic));
  const check = pop(392);
  const footOp = seg(frame, 402, 418);

  return (
    <div style={{ position: "absolute", inset: 0, fontFamily }}>
      <LightBg />

      {/* ════ Beat 1 — PROBLEM ════ */}
      <Group opacity={b1}>
        <Headline text="Two users, one database —" accentText="one forgotten line" accentColor={B.danger} opacity={seg(frame, 4, 18)} />
        <BrowserWindow x={80} y={142} w={660} h={400} title="jobbot — Anna's screen" opacity={winIn}>
          <div style={{ position: "relative", width: 660, height: 358 }}>
            <DataLine y={18} emoji="📄" text="Application · Frontend Developer, TechCorp" owner="Anna" tone="card" opacity={line(0)} />
            <DataLine y={74} emoji="📄" text="Application · QA Engineer, QualityFirst" owner="Anna" tone="card" opacity={line(1)} />
            <DataLine y={130} emoji="🔑" text="Saved login · finn.no" owner="Boris" tone="danger" opacity={leakIn} />
            <DataLine y={186} emoji="📄" text="Application · DevOps Engineer, CloudNet" owner="Boris" tone="danger" opacity={leakIn} />
            <DataLine y={242} emoji="📑" text="CV profile · boris-cv-2026.pdf" owner="Boris" tone="danger" opacity={leakIn} />
            <div
              style={{
                position: "absolute",
                left: 20,
                top: 126,
                width: 620,
                height: 172,
                borderRadius: 12,
                border: `3px solid rgba(220,47,62,${0.3 + 0.55 * alarm})`,
                opacity: leakIn,
                pointerEvents: "none",
              }}
            />
          </div>
        </BrowserWindow>
        <StickyNote
          x={780}
          y={158}
          w={400}
          opacity={noteOp}
          text="Anna is looking at Boris's saved passwords and applications. Nobody hacked anything — one query just forgot to ask whose data it was."
        />
        <StatPill x={796} y={396} emoji="🔓" text="Someone else's logins" tone="danger" scale={pill1} opacity={Math.min(1, pill1)} />
        <StatPill x={796} y={458} emoji="🧠" text="Safe only if every query is perfect" tone="danger" scale={pill2} opacity={Math.min(1, pill2)} fontSize={18} />
        <CaptionBand text="Trusting every future query to never slip is not a safety plan" tone="danger" opacity={seg(frame, 88, 100)} />
      </Group>

      {/* ════ Beat 2 — SOLUTION ════ */}
      <Group opacity={b2}>
        <Headline text="Now the database itself" accentText="asks who you are" accentColor={B.success} opacity={seg(frame, 116, 130)} />
        <Panel x={340} y={158} w={600} h={92} tone="accent" opacity={askIn}>
          <div style={{ padding: "20px 26px", textAlign: "center", fontFamily }}>
            <div style={{ fontSize: 23, fontWeight: 750, color: B.ink }}>
              The exact same request: <span style={{ color: B.accent }}>“show me the saved logins”</span>
            </div>
          </div>
        </Panel>
        <Panel x={150} y={288} w={460} h={252} tone="success" opacity={Math.min(1, annaIn)}>
          <div style={{ padding: "22px 26px", fontFamily }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: B.success, letterSpacing: 0.8 }}>ANNA ASKS</div>
            <div style={{ fontSize: 52, fontWeight: 800, color: B.ink, marginTop: 10 }}>12 rows</div>
            <div style={{ fontSize: 20, fontWeight: 650, color: B.muted, marginTop: 8, lineHeight: 1.35 }}>
              every one of them hers — logins, applications, CV
            </div>
          </div>
        </Panel>
        <Panel x={670} y={288} w={460} h={252} tone="danger" opacity={Math.min(1, borisIn)}>
          <div style={{ padding: "22px 26px", fontFamily }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: B.danger, letterSpacing: 0.8 }}>ANYONE ELSE ASKS</div>
            <div style={{ fontSize: 52, fontWeight: 800, color: B.ink, marginTop: 10 }}>0 rows</div>
            <div style={{ fontSize: 20, fontWeight: 650, color: B.muted, marginTop: 8, lineHeight: 1.35 }}>
              not an error page — simply nothing to return
            </div>
          </div>
        </Panel>
        <div
          style={{
            position: "absolute",
            left: 540,
            top: 566,
            display: "flex",
            alignItems: "center",
            gap: 14,
            transform: `scale(${0.86 + 0.14 * Math.min(1, stampIn)})`,
            transformOrigin: "left center",
            opacity: Math.min(1, stampIn),
            fontFamily,
          }}
        >
          <span style={{ fontSize: 30 }}>🔒</span>
          <span style={{ fontSize: 24, fontWeight: 750, color: B.success }}>Checked before the data leaves the database</span>
        </div>
        <CaptionBand text="Like a vault that only opens the drawer with your own name on it" tone="accent" opacity={cap2} y={650} />
      </Group>

      {/* ════ Beat 3 — HOW IT WORKS ════ */}
      <Group opacity={b3}>
        <Headline text="One rule per table," accentText="no exceptions" accentColor={B.accent} opacity={seg(frame, 240, 254)} />
        <IconCard x={110} y={218} w={300} emoji="🗄️" title="10+ tables covered" sub="jobs, applications, CVs, logins" tone="accent" scale={card1} opacity={Math.min(1, card1)} />
        {/* 👤 not 🪪 — the ID-card glyph renders as an empty rounded square here. */}
        <IconCard x={490} y={218} w={300} emoji="👤" title="Each row knows its owner" sub="checked on every single request" tone="accent" scale={card2} opacity={Math.min(1, card2)} />
        <IconCard x={870} y={218} w={300} emoji="🛡️" title="A slip in the app can't leak" sub="the rule sits underneath it" tone="success" scale={card3} opacity={Math.min(1, card3)} />
        <FlowArrow x={412} y={262} len={76} progress={arr1} />
        <FlowArrow x={792} y={262} len={76} progress={arr2} color={B.success} />
        <CaptionBand
          text="Under the hood: PostgreSQL row-level security policies matching each row against auth.uid() before anything is returned"
          opacity={cap3}
          fontSize={20}
          y={580}
        />
      </Group>

      {/* ════ Beat 4 — RESULT ════ */}
      <Group opacity={b4}>
        <Headline text="The payoff" opacity={seg(frame, 344, 358)} />
        <Panel x={140} y={170} w={400} h={210} tone="danger" opacity={beforeIn}>
          <div style={{ padding: "26px 30px", fontFamily }}>
            <div style={{ fontSize: 19, fontWeight: 700, color: B.danger, letterSpacing: 1 }}>BEFORE</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: B.ink, marginTop: 14 }}>1 bad query</div>
            <div style={{ fontSize: 26, fontWeight: 650, color: B.muted, marginTop: 6 }}>and data crosses over</div>
          </div>
        </Panel>
        <FlowArrow x={560} y={264} len={150} progress={arrRes} color={B.success} />
        <Panel x={740} y={170} w={400} h={210} tone="success" opacity={Math.min(1, afterIn)}>
          <div style={{ padding: "26px 30px", transform: `scale(${0.9 + 0.1 * Math.min(1, afterIn)})`, transformOrigin: "center", fontFamily }}>
            <div style={{ fontSize: 19, fontWeight: 700, color: B.success, letterSpacing: 1 }}>NOW</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: B.ink, marginTop: 14 }}>0 rows</div>
            <div style={{ fontSize: 26, fontWeight: 650, color: B.muted, marginTop: 6 }}>can cross between accounts</div>
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
            opacity: tablesOp,
            fontFamily,
          }}
        >
          <div style={{ position: "relative", width: 52, height: 52 }}>
            <CheckBadge x={0} y={0} size={52} scale={check} opacity={Math.min(1, check)} />
          </div>
          <span style={{ fontSize: 52, fontWeight: 800, color: B.success }}>{tables}+ tables locked down</span>
        </div>
        <div style={{ position: "absolute", left: 0, top: 540, width: 1280, textAlign: "center", opacity: footOp, fontFamily }}>
          <div style={{ fontSize: 22, fontWeight: 650, color: B.muted }}>
            Your saved logins stay yours — even if the code above makes a mistake.
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, color: B.accent, marginTop: 12 }}>JobBot · vitalii.no</div>
        </div>
      </Group>
    </div>
  );
};
