/**
 * FeatureMultiRepoScanner — feature p59 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 * BRIGHT INFOGRAPHIC template (v2, 2026-08-22) — written for a NON-TECHNICAL
 * viewer: problem/solution color zones, a real browser mockup with a plausible
 * feature→commit index, repo tabs clicked by a cursor, and a big before→after
 * metric.
 *
 * Story (4 beats):
 *  1. Problem — 7 separate GitHub repos; finding which one shipped a given
 *     feature (and when) means a manual git-log hunt through every one of
 *     them. Red zone.
 *  2. Solution — pick the repo tabs, flip "show commit links" on, and a
 *     table instantly lists Feature / Repo / Commit / Shipped for real
 *     project features, each row a direct link to its commit.
 *  3. How it stays in sync — every push to any of the 7 repos re-triggers
 *     the scan; octokit resolves the exact commit hash per feature file;
 *     everything compiles into one live map. One tech-credibility line
 *     (scanFeatures.ts + octokit/rest → Vercel Blob Storage).
 *  4. Result — before/after cards: hours chasing commits across 7 repos →
 *     one click to the exact commit, ≈70% less context-switching. Green
 *     zone, check badge.
 */
import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { B, toneEdge } from "./bright-theme";
import {
  LightBg,
  Group,
  Headline,
  Panel,
  BrowserWindow,
  SkeletonScroll,
  FilterChip,
  ToggleSwitch,
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

type CommitRow = { feature: string; repo: string; commit: string; shipped: string };

const ROWS: CommitRow[] = [
  { feature: "LinkedIn Native Image Upload", repo: "vitalii-portfolio", commit: "a3f9c12", shipped: "2 days ago" },
  { feature: "MTKruto Video Bypass", repo: "vitalii-portfolio", commit: "7e21bd4", shipped: "1 week ago" },
  { feature: "Two-Tier Screen Gate", repo: "boytasks", commit: "5c88a01", shipped: "3 weeks ago" },
  { feature: "Skyvern VPS Deploy", repo: "jobbot-no", commit: "d40f3aa", shipped: "1 month ago" },
];

/** Small feature→commit index table — Feature / Repo / Commit hash / Shipped. */
const CommitTable: React.FC<{ w: number; rows: CommitRow[]; frame: number; appearStart: number; stagger?: number }> = ({
  w,
  rows,
  frame,
  appearStart,
  stagger = 7,
}) => {
  const cols = [0.36, 0.24, 0.18, 0.22];
  const heads = ["Feature", "Repo", "Commit", "Shipped"];
  const cell = (f: number): React.CSSProperties => ({ width: w * f - 14, overflow: "hidden", whiteSpace: "nowrap" });
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: w, fontFamily }}>
      <div
        style={{
          display: "flex",
          padding: "10px 18px",
          gap: 14,
          background: "#F4F7FC",
          borderBottom: `1.5px solid ${B.border}`,
          fontSize: 14,
          fontWeight: 700,
          color: B.muted,
          letterSpacing: 0.4,
        }}
      >
        {heads.map((hd, i) => (
          <div key={hd} style={cell(cols[i])}>
            {hd}
          </div>
        ))}
      </div>
      {rows.map((r, i) => {
        const t = seg(frame, appearStart + i * stagger, appearStart + i * stagger + 12);
        return (
          <div
            key={r.feature}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "9px 18px",
              gap: 14,
              borderBottom: `1px solid ${B.border}`,
              fontSize: 15.5,
              color: B.ink,
              opacity: t,
              transform: `translateX(${(1 - t) * 26}px)`,
            }}
          >
            <div style={{ ...cell(cols[0]), fontWeight: 600 }}>{r.feature}</div>
            <div style={{ ...cell(cols[1]), color: B.muted, fontWeight: 500 }}>{r.repo}</div>
            <div style={cell(cols[2])}>
              <span
                style={{
                  display: "inline-block",
                  padding: "2px 9px",
                  borderRadius: 8,
                  background: B.accentBg,
                  border: `1px solid ${toneEdge("accent")}`,
                  color: B.accent,
                  fontWeight: 700,
                  fontSize: 13.5,
                  fontFamily: "monospace",
                }}
              >
                {r.commit}
              </span>
            </div>
            <div style={{ ...cell(cols[3]), color: B.muted, fontWeight: 500 }}>{r.shipped}</div>
          </div>
        );
      })}
    </div>
  );
};

export const FeatureMultiRepoScanner: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  // ── Beat windows ──────────────────────────────────────────────────
  const b1 = seg(frame, 0, 10) * (1 - seg(frame, 104, 118)) * lf;
  const b2 = seg(frame, 112, 126) * (1 - seg(frame, 228, 242)) * lf;
  const b3 = seg(frame, 236, 250) * (1 - seg(frame, 332, 346)) * lf;
  const b4 = seg(frame, 340, 354) * lf;

  // ── Beat 1: the problem ───────────────────────────────────────────
  const scroll = frame * 2.2;
  const noteOp = seg(frame, 24, 40, Easing.out(Easing.cubic));
  const pill1 = pop(46);
  const pill2 = pop(58);
  const pill3 = pop(70);

  // ── Beat 2: the solution ──────────────────────────────────────────
  const chip1 = pop(132);
  const chip2 = pop(142);
  const chip3 = pop(152);
  const chip4 = pop(164);
  const togOn = seg(frame, 180, 192, Easing.inOut(Easing.cubic));
  const cx = interpolate(frame, [124, 134, 152, 166, 182, 205], [700, 235, 480, 660, 1020, 1080], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const cy = interpolate(frame, [124, 134, 152, 166, 182, 205], [400, 152, 152, 152, 155, 300], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const cursorOp = seg(frame, 124, 132) * (1 - seg(frame, 205, 218));
  const click1 = seg(frame, 134, 146, Easing.out(Easing.quad));
  const click2 = seg(frame, 152, 164, Easing.out(Easing.quad));
  const click3 = seg(frame, 182, 194, Easing.out(Easing.quad));
  const cap2 = seg(frame, 196, 212, Easing.out(Easing.cubic));

  // ── Beat 3: how it stays in sync ──────────────────────────────────
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
  const pct = Math.round(interpolate(frame, [384, 414], [0, 70], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }));
  const pctOp = seg(frame, 384, 398, Easing.out(Easing.cubic));
  const check = pop(392);
  const footOp = seg(frame, 402, 418);

  return (
    <div style={{ position: "absolute", inset: 0, fontFamily }}>
      <LightBg />

      {/* ════ Beat 1 — PROBLEM ════ */}
      <Group opacity={b1}>
        <Headline text="Which repo shipped" accentText="that feature?" accentColor={B.danger} opacity={seg(frame, 4, 18)} />
        <BrowserWindow x={80} y={116} w={700} h={452} title="7 repos — git log search" opacity={Math.min(1, pop(8))}>
          <SkeletonScroll w={700} h={410} offset={scroll} />
        </BrowserWindow>
        <StickyNote
          x={830}
          y={150}
          w={350}
          opacity={noteOp}
          text="Need: which repo and commit shipped the LinkedIn video upload — and when?"
        />
        <StatPill x={846} y={340} emoji="🗂️" text="7 repos to search" tone="danger" scale={pill1} opacity={Math.min(1, pill1)} />
        <StatPill x={846} y={402} emoji="⏱️" text="Hours lost every week" tone="danger" scale={pill2} opacity={Math.min(1, pill2)} />
        <StatPill x={846} y={464} emoji="😩" text="Constant context-switching" tone="danger" scale={pill3} opacity={Math.min(1, pill3)} />
        <CaptionBand text="Seven repos, one feature — the shipping commit could be anywhere" tone="danger" opacity={seg(frame, 30, 46)} />
      </Group>

      {/* ════ Beat 2 — SOLUTION ════ */}
      <Group opacity={b2}>
        <Headline text="Click the feature," accentText="land on the exact commit" accentColor={B.success} opacity={seg(frame, 116, 130)} />
        <FilterChip x={160} y={132} text="vitalii-portfolio" icon="📁" scale={chip1} opacity={Math.min(1, chip1)} />
        <FilterChip x={400} y={132} text="boytasks" icon="📁" scale={chip2} opacity={Math.min(1, chip2)} />
        <FilterChip x={560} y={132} text="jobbot-no" icon="📁" scale={chip3} opacity={Math.min(1, chip3)} />
        <FilterChip x={720} y={132} text="+4 more" icon="📁" scale={chip4} opacity={Math.min(1, chip4)} />
        <ToggleSwitch x={940} y={138} label="Show commit links" on={togOn} opacity={seg(frame, 172, 184)} />
        <BrowserWindow x={110} y={196} w={1060} h={396} title="vitalii.no — feature index" opacity={seg(frame, 168, 182)}>
          <CommitTable w={1060} rows={ROWS} frame={frame} appearStart={184} stagger={7} />
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 288,
              width: 1060,
              textAlign: "center",
              fontSize: 15.5,
              fontWeight: 600,
              color: B.muted,
              opacity: seg(frame, 214, 228) * 0.9,
            }}
          >
            …and every other feature — click through to any commit
          </div>
        </BrowserWindow>
        <Cursor x={cx} y={cy} opacity={cursorOp} click={Math.max(click1 % 1, click2 % 1, click3 % 1)} />
        <CaptionBand text="Every push scans all 7 repos and resolves the commit that shipped it" tone="accent" opacity={cap2} />
      </Group>

      {/* ════ Beat 3 — HOW IT STAYS IN SYNC ════ */}
      <Group opacity={b3}>
        <Headline text="Scanned automatically," accentText="on every push" accentColor={B.accent} opacity={seg(frame, 240, 254)} />
        <IconCard x={110} y={218} w={300} emoji="🔁" title="Triggers on every push" sub="across all 7 repos" tone="accent" scale={card1} opacity={Math.min(1, card1)} />
        <IconCard x={490} y={218} w={300} emoji="🔎" title="octokit fetches the commit" sub="for each feature file" tone="accent" scale={card2} opacity={Math.min(1, card2)} />
        <IconCard x={870} y={218} w={300} emoji="🗺️" title="Compiles one live map" sub="always in sync" tone="success" scale={card3} opacity={Math.min(1, card3)} />
        <FlowArrow x={412} y={262} len={76} progress={arr1} />
        <FlowArrow x={792} y={262} len={76} progress={arr2} color={B.success} />
        <CaptionBand
          text="Under the hood: scanFeatures.ts + octokit/rest, uploaded to Vercel Blob Storage"
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
            <div style={{ fontSize: 40, fontWeight: 800, color: B.ink, marginTop: 14 }}>Hours</div>
            <div style={{ fontSize: 26, fontWeight: 650, color: B.muted, marginTop: 6 }}>chasing commits across 7 repos</div>
          </div>
        </Panel>
        <FlowArrow x={560} y={264} len={150} progress={arrRes} color={B.success} />
        <Panel x={740} y={170} w={400} h={210} tone="success" opacity={Math.min(1, afterIn)}>
          <div style={{ padding: "26px 30px", transform: `scale(${0.9 + 0.1 * Math.min(1, afterIn)})`, transformOrigin: "center", fontFamily }}>
            <div style={{ fontSize: 19, fontWeight: 700, color: B.success, letterSpacing: 1 }}>NOW</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: B.ink, marginTop: 14 }}>One click</div>
            <div style={{ fontSize: 26, fontWeight: 650, color: B.muted, marginTop: 6 }}>straight to the exact commit</div>
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
            opacity: pctOp,
            fontFamily,
          }}
        >
          <div style={{ position: "relative", width: 52, height: 52 }}>
            <CheckBadge x={0} y={0} size={52} scale={check} opacity={Math.min(1, check)} />
          </div>
          <span style={{ fontSize: 52, fontWeight: 800, color: B.success }}>≈{pct}% less context-switching</span>
        </div>
        <div style={{ position: "absolute", left: 0, top: 540, width: 1280, textAlign: "center", opacity: footOp, fontFamily }}>
          <div style={{ fontSize: 22, fontWeight: 650, color: B.muted }}>
            Every feature's origin — one click away, every time.
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, color: B.accent, marginTop: 12 }}>vitalii.no</div>
        </div>
      </Group>
    </div>
  );
};
