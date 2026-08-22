/**
 * FeatureEdgeFunctionsCost — feature p23 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 * BRIGHT INFOGRAPHIC template (v2, 2026-08-22) — written for a NON-TECHNICAL
 * viewer: problem/solution color zones, a real browser+table mockup with
 * plausible function data, filter chips clicked by a cursor, and a big
 * before→after metric.
 *
 * Story (4 beats):
 *  1. Problem — one always-on server, paying full price around the clock
 *     for spiky traffic that leaves it idle 95% of the time. Red zone.
 *  2. Solution — 43 small functions instead: category chips (Scraping / AI
 *     / Social / Video), a "scale to zero" toggle, and a live deploy table
 *     (function / category / cold start / status).
 *  3. How it stays cheap — 43 separate Deno microservices share code, not
 *     compute, through one `_shared/` folder, and each redeploys alone in
 *     ~10 seconds with a cold start under 500ms.
 *  4. Result — before/after cards: an always-on server, idle 95% of the
 *     time → $0/month, 43 functions, scale to zero; a counting "0% → 100%"
 *     cost-cut hero number. Green zone, check badge.
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

type FnRow = {
  name: string;
  category: string;
  coldStart: string;
  status: string;
  statusTone?: "accent" | "success";
};

const ROWS: FnRow[] = [
  { name: "telegram-scraper", category: "Scraping", coldStart: "420ms", status: "Live" },
  { name: "pre-moderate-news", category: "AI", coldStart: "310ms", status: "Live", statusTone: "success" },
  { name: "post-to-linkedin", category: "Social", coldStart: "280ms", status: "Live" },
  { name: "process-image", category: "AI", coldStart: "460ms", status: "Live", statusTone: "success" },
  { name: "reprocess-videos", category: "Video", coldStart: "390ms", status: "Live" },
];

const DeployTable: React.FC<{ w: number; rows: FnRow[]; frame: number; appearStart: number; stagger?: number }> = ({
  w,
  rows,
  frame,
  appearStart,
  stagger = 9,
}) => {
  const cols = [0.34, 0.18, 0.22, 0.2];
  const heads = ["Function", "Category", "Cold start", "Status"];
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
            key={r.name}
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
            <div style={{ ...cell(cols[0]), fontWeight: 600, fontFamily: "monospace" }}>{r.name}</div>
            <div style={{ ...cell(cols[1]), color: B.muted, fontWeight: 500 }}>{r.category}</div>
            <div style={{ ...cell(cols[2]), color: B.muted, fontWeight: 500 }}>{r.coldStart}</div>
            <div style={cell(cols[3])}>
              <span
                style={{
                  padding: "2.5px 10px",
                  borderRadius: 999,
                  fontSize: 13.5,
                  fontWeight: 600,
                  background: r.statusTone === "success" ? B.successBg : B.accentBg,
                  border: `1px solid ${toneEdge(r.statusTone === "success" ? "success" : "accent")}`,
                  color: r.statusTone === "success" ? B.success : B.accent,
                }}
              >
                {r.status}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const FeatureEdgeFunctionsCost: React.FC = () => {
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
  const cx = interpolate(frame, [124, 134, 152, 166, 182, 205], [700, 200, 500, 660, 900, 1080], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const cy = interpolate(frame, [124, 134, 152, 166, 182, 205], [400, 152, 152, 152, 152, 300], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const cursorOp = seg(frame, 124, 132) * (1 - seg(frame, 205, 218));
  const click1 = seg(frame, 134, 146, Easing.out(Easing.quad));
  const click2 = seg(frame, 152, 164, Easing.out(Easing.quad));
  const click3 = seg(frame, 182, 194, Easing.out(Easing.quad));
  const cap2 = seg(frame, 196, 212, Easing.out(Easing.cubic));

  // ── Beat 3: how it stays cheap ─────────────────────────────────────
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
  const costCut = Math.round(
    interpolate(frame, [384, 410], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) })
  );
  const speedOp = seg(frame, 384, 398, Easing.out(Easing.cubic));
  const check = pop(392);
  const footOp = seg(frame, 402, 418);

  return (
    <div style={{ position: "absolute", inset: 0, fontFamily }}>
      <LightBg />

      {/* ════ Beat 1 — PROBLEM ════ */}
      <Group opacity={b1}>
        <Headline text="Pay for a server that sits" accentText="idle 95% of the time?" accentColor={B.danger} opacity={seg(frame, 4, 18)} />
        <BrowserWindow x={80} y={116} w={700} h={452} title="billing — always-on server" opacity={Math.min(1, pop(8))}>
          <SkeletonScroll w={700} h={410} offset={scroll} />
        </BrowserWindow>
        <StickyNote
          x={830}
          y={150}
          w={350}
          opacity={noteOp}
          text="Need: handle scraping, AI images, translations and social posting — 43 different jobs, all spiky traffic"
        />
        <StatPill x={846} y={340} emoji="💸" text="24/7 server bill, spiky traffic" tone="danger" scale={pill1} opacity={Math.min(1, pill1)} />
        <StatPill x={846} y={402} emoji="😴" text="Idle 95% of the time" tone="danger" scale={pill2} opacity={Math.min(1, pill2)} />
        <StatPill x={846} y={464} emoji="🐢" text="One big deploy for every tiny change" tone="danger" scale={pill3} opacity={Math.min(1, pill3)} />
        <CaptionBand text="Always-on infrastructure, billed around the clock, for traffic that mostly isn't there" tone="danger" opacity={seg(frame, 30, 46)} />
      </Group>

      {/* ════ Beat 2 — SOLUTION ════ */}
      <Group opacity={b2}>
        <Headline text="43 functions that" accentText="run only when needed" accentColor={B.success} opacity={seg(frame, 116, 130)} />
        <FilterChip x={160} y={132} text="Scraping" scale={chip1} opacity={Math.min(1, chip1)} />
        <FilterChip x={320} y={132} text="AI" scale={chip2} opacity={Math.min(1, chip2)} />
        <FilterChip x={460} y={132} text="Social" scale={chip3} opacity={Math.min(1, chip3)} />
        <FilterChip x={620} y={132} text="Video" icon="🎬" scale={chip4} opacity={Math.min(1, chip4)} />
        <ToggleSwitch x={860} y={138} label="Scale to zero" on={togOn} opacity={seg(frame, 172, 184)} />
        <BrowserWindow x={110} y={196} w={1060} h={396} title="supabase/functions — 43 deployed" opacity={seg(frame, 168, 182)}>
          <DeployTable w={1060} rows={ROWS} frame={frame} appearStart={184} stagger={7} />
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
            …all 43, each deployed independently in ~10 seconds
          </div>
        </BrowserWindow>
        <Cursor x={cx} y={cy} opacity={cursorOp} click={Math.max(click1 % 1, click2 % 1, click3 % 1)} />
        <CaptionBand text="Each function is its own microservice — sharing code, never sharing a bill" tone="accent" opacity={cap2} />
      </Group>

      {/* ════ Beat 3 — HOW IT STAYS CHEAP ════ */}
      <Group opacity={b3}>
        <Headline text="And costs stay at" accentText="$0/month" accentColor={B.accent} opacity={seg(frame, 240, 254)} />
        <IconCard x={110} y={218} w={300} emoji="🧩" title="43 Deno microservices" sub="one file each, deployed alone" tone="accent" scale={card1} opacity={Math.min(1, card1)} />
        <IconCard x={490} y={218} w={300} emoji="📦" title="_shared/ — 10 helpers" sub="shared code, not shared compute" tone="accent" scale={card2} opacity={Math.min(1, card2)} />
        <IconCard x={870} y={218} w={300} emoji="⚡" title="Cold start under 500ms" sub="snappy, even after idling" tone="success" scale={card3} opacity={Math.min(1, card3)} />
        <FlowArrow x={412} y={262} len={76} progress={arr1} />
        <FlowArrow x={792} y={262} len={76} progress={arr2} color={B.success} />
        <CaptionBand
          text="Supabase Edge Functions on Deno — deploy --no-verify-jwt redeploys just one function"
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
            <div style={{ fontSize: 40, fontWeight: 800, color: B.ink, marginTop: 14 }}>Always-on server</div>
            <div style={{ fontSize: 26, fontWeight: 650, color: B.muted, marginTop: 6 }}>paying 24/7, idle 95%</div>
          </div>
        </Panel>
        <FlowArrow x={560} y={264} len={150} progress={arrRes} color={B.success} />
        <Panel x={740} y={170} w={400} h={210} tone="success" opacity={Math.min(1, afterIn)}>
          <div style={{ padding: "26px 30px", transform: `scale(${0.9 + 0.1 * Math.min(1, afterIn)})`, transformOrigin: "center", fontFamily }}>
            <div style={{ fontSize: 19, fontWeight: 700, color: B.success, letterSpacing: 1 }}>NOW</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: B.ink, marginTop: 14 }}>$0/month</div>
            <div style={{ fontSize: 26, fontWeight: 650, color: B.muted, marginTop: 6 }}>43 functions, scale to zero</div>
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
          <span style={{ fontSize: 52, fontWeight: 800, color: B.success }}>{costCut}% infra cost cut</span>
        </div>
        <div style={{ position: "absolute", left: 0, top: 540, width: 1280, textAlign: "center", opacity: footOp, fontFamily }}>
          <div style={{ fontSize: 22, fontWeight: 650, color: B.muted }}>
            Every function scales to zero and redeploys alone in ~10 seconds.
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, color: B.accent, marginTop: 12 }}>vitalii.no</div>
        </div>
      </Group>
    </div>
  );
};
