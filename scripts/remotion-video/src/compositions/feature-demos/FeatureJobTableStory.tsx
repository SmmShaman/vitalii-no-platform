/**
 * FeatureJobTableStory — feature j26 STORY CUT — 1280x720, 54s @ 30fps (1620
 * frames), built VOICE-FIRST: the 7 VO beats were generated with edge-tts
 * (en-US-AndrewNeural) and measured, and every beat window below matches the
 * audio offsets baked into out/vo-j26-story/ (0.5s lead, 0.3s gaps).
 *
 * VO beats (measured):            frames (fps=30)
 *  1 persona / drowning  7.944s   S1=15   E1=253
 *  2 the ask + old cost 10.920s   S2=262  E2=590
 *  3 rebuilt, 3 clicks   8.544s   S3=599  E3=855
 *  4 results, librarian  6.744s   S4=864  E4=1066
 *  5 stays fast at scale 6.312s   S5=1075 E5=1264
 *  6 numbers payoff      6.816s   S6=1273 E6=1477
 *  7 outro               2.856s   S7=1486 E7=1572, tail → 1620
 *
 * Bright infographic system (v2). NOT loop-friendly by design — it is a
 * narrated social/YouTube cut; the 15s FeatureJobTable stays the site loop.
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
  SkeletonScroll,
  JobsTable,
  JobRow,
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
  fontFamily,
} from "./bright-primitives";

const ROWS: JobRow[] = [
  { role: "Frontend Developer", company: "TechCorp", city: "Gjøvik", score: 92, source: "FINN", status: "New" },
  { role: "Backend Developer", company: "DataSolve", city: "Gjøvik", score: 88, source: "LinkedIn", status: "New" },
  { role: "Fullstack Developer", company: "InnoWare", city: "Gjøvik", score: 85, source: "FINN", status: "In review", statusTone: "success" },
  { role: "DevOps Engineer", company: "CloudNet", city: "Gjøvik", score: 80, source: "Indeed", status: "New" },
  { role: "QA Engineer", company: "QualityFirst", city: "Gjøvik", score: 72, source: "LinkedIn", status: "In review", statusTone: "success" },
];

// Beat windows — MUST match the audio build in out/vo-j26-story/.
const S1 = 15, E1 = 253;
const S2 = 262, E2 = 590;
const S3 = 599, E3 = 855;
const S4 = 864, E4 = 1066;
const S5 = 1075, E5 = 1264;
const S6 = 1273, E6 = 1477;
const S7 = 1486;

export const FeatureJobTableStory: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const beat = (s: number, e: number) => seg(frame, s - 8, s + 6) * (1 - seg(frame, e + 2, e + 14));
  const fadeOut = 1 - seg(frame, 1592, 1616);

  const b1 = beat(S1, E1) * fadeOut;
  const b2 = beat(S2, E2) * fadeOut;
  const b3 = beat(S3, E3) * fadeOut;
  const b4 = beat(S4, E4) * fadeOut;
  const b5 = beat(S5, E5) * fadeOut;
  // b6 must be fully gone before the outro text lands in the same screen area
  const b6 = seg(frame, S6 - 8, S6 + 6) * (1 - seg(frame, E6 - 14, E6 - 2)) * fadeOut;
  const b7 = seg(frame, S7 - 8, S7 + 6) * fadeOut;

  // ── Beat 1: persona, 214 postings pile up ─────────────────────────
  const scroll = frame * 2.4;
  const count = Math.round(interpolate(frame, [S1 + 55, S1 + 165], [3, 214], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }));
  const personaIn = pop(S1 + 10);
  const drownOp = seg(frame, S1 + 170, S1 + 195);

  // ── Beat 2: the ask on a sticky note, the old cost ────────────────
  const noteIn = pop(S2 + 12);
  const pillA = pop(S2 + 210);
  const pillB = pop(S2 + 250);

  // ── Beat 3: rebuilt — chips, toggle, cursor ───────────────────────
  const chip1 = pop(S3 + 42);
  const chip2 = pop(S3 + 72);
  const chip3 = pop(S3 + 102);
  const togOn = seg(frame, S3 + 152, S3 + 166, Easing.inOut(Easing.cubic));
  const cx = interpolate(frame, [S3 + 18, S3 + 40, S3 + 70, S3 + 100, S3 + 150, S3 + 200], [660, 262, 405, 590, 940, 1040], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  const cy = interpolate(frame, [S3 + 18, S3 + 40, S3 + 70, S3 + 100, S3 + 150, S3 + 200], [430, 268, 268, 268, 272, 420], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  const cursorOp = seg(frame, S3 + 14, S3 + 24) * (1 - seg(frame, S3 + 205, S3 + 220));
  const click1 = seg(frame, S3 + 40, S3 + 52, Easing.out(Easing.quad));
  const click2 = seg(frame, S3 + 70, S3 + 82, Easing.out(Easing.quad));
  const click3 = seg(frame, S3 + 150, S3 + 162, Easing.out(Easing.quad));
  const foreverOp = seg(frame, S3 + 175, S3 + 195);

  // ── Beat 4: five matches + librarian ──────────────────────────────
  const librIn = pop(S4 + 105);

  // ── Beat 5: stays fast ────────────────────────────────────────────
  const card1 = pop(S5 + 15);
  const card2 = pop(S5 + 55);
  const card3 = pop(S5 + 105);
  const arr1 = seg(frame, S5 + 40, S5 + 58, Easing.inOut(Easing.cubic));
  const arr2 = seg(frame, S5 + 90, S5 + 108, Easing.inOut(Easing.cubic));

  // ── Beat 6: payoff numbers ────────────────────────────────────────
  const beforeIn = seg(frame, S6 + 8, S6 + 24, Easing.out(Easing.cubic));
  const arrRes = seg(frame, S6 + 55, S6 + 72, Easing.inOut(Easing.cubic));
  const afterIn = pop(S6 + 68);
  const speedX = Math.round(interpolate(frame, [S6 + 115, S6 + 165], [1, 150], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }));
  const speedOp = seg(frame, S6 + 115, S6 + 130);
  const check6 = pop(S6 + 130);

  // ── Beat 7: outro ─────────────────────────────────────────────────
  const outroCheck = pop(S7 + 25);
  const brandOp = seg(frame, S7 + 45, S7 + 65);

  return (
    <div style={{ position: "absolute", inset: 0, fontFamily }}>
      <LightBg />

      {/* ════ Beat 1 — It's evening, you're drowning ════ */}
      <Group opacity={b1}>
        <Headline text="It's evening. You're" accentText="job hunting." accentColor={B.accent} opacity={seg(frame, S1 + 4, S1 + 20)} />
        <div style={{ position: "absolute", left: 105, top: 170, width: 340, textAlign: "center", transform: `scale(${Math.min(1, personaIn)})`, opacity: Math.min(1, personaIn), fontFamily }}>
          {/* single-codepoint emoji only — ZWJ sequences split into two glyphs in headless Chrome */}
          <div style={{ fontSize: 120, lineHeight: 1 }}>😩</div>
          <div style={{ marginTop: 34, fontSize: 76, fontWeight: 800, color: B.danger }}>{count}</div>
          <div style={{ fontSize: 24, fontWeight: 650, color: B.muted, marginTop: 4 }}>postings collected</div>
        </div>
        <BrowserWindow x={540} y={130} w={650} h={450} title="jobbot — all postings" opacity={Math.min(1, pop(S1 + 20))}>
          <SkeletonScroll w={650} h={410} offset={scroll} />
        </BrowserWindow>
        <CaptionBand text="Great — except now you're the one drowning in them" tone="danger" opacity={drownOp} />
      </Group>

      {/* ════ Beat 2 — the ask + the old cost ════ */}
      <Group opacity={b2}>
        <Headline text="You want something" accentText="simple" accentColor={B.accent} opacity={seg(frame, S2 + 4, S2 + 20)} />
        <StickyNote
          x={340}
          y={150}
          w={600}
          rotate={-1.5}
          opacity={Math.min(1, noteIn)}
          text="IT jobs in Gjøvik · strong matches only · from the last week · and NO recruiter agencies"
        />
        <StatPill x={360} y={380} emoji="🖱️" text="10+ filter clicks" tone="danger" fontSize={24} scale={pillA} opacity={Math.min(1, pillA)} />
        <StatPill x={660} y={380} emoji="⏱️" text="~5 minutes of scrolling" tone="danger" fontSize={24} scale={pillB} opacity={Math.min(1, pillB)} />
        <CaptionBand text="That's what this one question used to cost — every single time" tone="danger" opacity={seg(frame, S2 + 265, S2 + 290)} y={520} />
      </Group>

      {/* ════ Beat 3 — rebuilt: 3 clicks ════ */}
      <Group opacity={b3}>
        <Headline text="So we rebuilt the table —" accentText="now it's 3 clicks" accentColor={B.success} opacity={seg(frame, S3 + 4, S3 + 20)} />
        <Panel x={140} y={210} w={1000} h={130} tone="card" opacity={seg(frame, S3 + 10, S3 + 26)}>
          <div style={{ padding: "18px 24px", fontSize: 17, fontWeight: 700, color: B.muted, letterSpacing: 0.6, fontFamily }}>SMART SEARCH</div>
        </Panel>
        <FilterChip x={200} y={252} text="IT · Gjøvik" scale={chip1} opacity={Math.min(1, chip1)} />
        <FilterChip x={380} y={252} text="Score 70+" scale={chip2} opacity={Math.min(1, chip2)} />
        <FilterChip x={555} y={252} text="Last week" icon="📅" scale={chip3} opacity={Math.min(1, chip3)} />
        <ToggleSwitch x={790} y={258} label="Hide recruiters" on={togOn} opacity={seg(frame, S3 + 130, S3 + 145)} />
        <Cursor x={cx} y={cy} opacity={cursorOp} click={Math.max(click1 % 1, click2 % 1, click3 % 1)} />
        <StatPill x={790} y={330} emoji="🔒" text="blocked once — hidden forever" tone="success" fontSize={17} scale={Math.min(1, pop(S3 + 175))} opacity={foreverOp} />
        <CaptionBand text="Pick your filters, flip one switch — that's the whole job" tone="accent" opacity={seg(frame, S3 + 60, S3 + 80)} y={520} />
      </Group>

      {/* ════ Beat 4 — five scored matches + librarian ════ */}
      <Group opacity={b4}>
        <Headline text="Five matches," accentText="scored and sorted" accentColor={B.success} opacity={seg(frame, S4 + 4, S4 + 20)} />
        <BrowserWindow x={70} y={140} w={830} h={420} title="jobbot — smart search · ~2 seconds" opacity={seg(frame, S4 + 8, S4 + 22)}>
          <JobsTable w={830} rows={ROWS} frame={frame} appearStart={S4 + 25} stagger={8} />
        </BrowserWindow>
        <IconCard
          x={935}
          y={230}
          w={300}
          emoji="📚"
          title="Like a librarian"
          sub="every book sorted before you walk in"
          tone="accent"
          scale={Math.min(1, librIn)}
          opacity={Math.min(1, librIn)}
        />
      </Group>

      {/* ════ Beat 5 — stays fast at any size ════ */}
      <Group opacity={b5}>
        <Headline text="And it stays instant" accentText="at any size" accentColor={B.accent} opacity={seg(frame, S5 + 4, S5 + 20)} />
        <IconCard x={110} y={218} w={300} emoji="🗄️" title="500+ jobs and growing" sub="the list never stops" tone="accent" scale={card1} opacity={Math.min(1, card1)} />
        <IconCard x={490} y={218} w={300} emoji="⚡" title="Draws only what's on screen" sub="virtual scrolling" tone="accent" scale={card2} opacity={Math.min(1, card2)} />
        <IconCard x={870} y={218} w={300} emoji="🎞️" title="Never freezes" sub="smooth 60 fps" tone="success" scale={card3} opacity={Math.min(1, card3)} />
        <FlowArrow x={412} y={262} len={76} progress={arr1} />
        <FlowArrow x={792} y={262} len={76} progress={arr2} color={B.success} />
        <CaptionBand text="Under the hood: an 88KB React component with react-virtualized" opacity={seg(frame, S5 + 130, S5 + 150)} fontSize={20} y={580} />
      </Group>

      {/* ════ Beat 6 — the numbers ════ */}
      <Group opacity={b6}>
        <Headline text="The payoff" opacity={seg(frame, S6 + 4, S6 + 20)} />
        <Panel x={140} y={170} w={400} h={210} tone="danger" opacity={beforeIn}>
          <div style={{ padding: "26px 30px", fontFamily }}>
            <div style={{ fontSize: 19, fontWeight: 700, color: B.danger, letterSpacing: 1 }}>BEFORE</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: B.ink, marginTop: 14 }}>10+ clicks</div>
            <div style={{ fontSize: 26, fontWeight: 650, color: B.muted, marginTop: 6 }}>~5 minutes per search</div>
          </div>
        </Panel>
        <FlowArrow x={560} y={264} len={150} progress={arrRes} color={B.success} />
        <Panel x={740} y={170} w={400} h={210} tone="success" opacity={Math.min(1, afterIn)}>
          <div style={{ padding: "26px 30px", transform: `scale(${0.9 + 0.1 * Math.min(1, afterIn)})`, transformOrigin: "center", fontFamily }}>
            <div style={{ fontSize: 19, fontWeight: 700, color: B.success, letterSpacing: 1 }}>NOW</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: B.ink, marginTop: 14 }}>3 clicks</div>
            <div style={{ fontSize: 26, fontWeight: 650, color: B.muted, marginTop: 6 }}>~2 seconds</div>
          </div>
        </Panel>
        <div style={{ position: "absolute", left: 0, top: 430, width: 1280, display: "flex", alignItems: "center", justifyContent: "center", gap: 20, opacity: speedOp, fontFamily }}>
          <div style={{ position: "relative", width: 52, height: 52 }}>
            <CheckBadge x={0} y={0} size={52} scale={check6} opacity={Math.min(1, check6)} />
          </div>
          <span style={{ fontSize: 52, fontWeight: 800, color: B.success }}>≈{speedX}× faster</span>
        </div>
      </Group>

      {/* ════ Beat 7 — outro ════ */}
      <Group opacity={b7}>
        <div style={{ position: "absolute", left: 0, top: 250, width: 1280, textAlign: "center", fontFamily }}>
          <div style={{ fontSize: 46, fontWeight: 800, color: B.ink, lineHeight: 1.3 }}>
            Job search should be <span style={{ color: B.success }}>easy</span> —
            <br />
            not exhausting.
          </div>
        </div>
        <div style={{ position: "absolute", left: 0, top: 430, width: 1280, display: "flex", justifyContent: "center", fontFamily }}>
          <CheckBadge x={614} y={0} size={56} scale={outroCheck} opacity={Math.min(1, outroCheck)} />
        </div>
        <div style={{ position: "absolute", left: 0, top: 520, width: 1280, textAlign: "center", opacity: brandOp, fontFamily }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: B.accent }}>JobBot · vitalii.no</div>
        </div>
      </Group>
    </div>
  );
};
