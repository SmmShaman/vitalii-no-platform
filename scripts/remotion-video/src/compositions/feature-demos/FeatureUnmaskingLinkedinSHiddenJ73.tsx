/**
 * FeatureUnmaskingLinkedinSHiddenJ73 — feature j73 — 1280x720, 1086 frames @ 30fps, VOICE-SYNCED.
 *
 * Archetype 4 "flow map", mood "slate". A permanent decision structure fills
 * the lower half of the frame for the whole clip: a start node branches at a
 * vertical spine into an OLD row (dead-ends at a trash node) and a NEW row
 * (a three-step cascade that reaches a converging outcome node). A traveling
 * token walks whichever row is active per beat. The upper half is a single
 * reused screen: real recordings of vitalii.no/features and the
 * jobbot-norway repo for beats 1, 3, 4, 5 (shots/j73.json); beat 2 is a
 * drawn mockup of the vanished apply button (LinkedIn itself isn't in the
 * verified-URL list, so it stays drawn, not recorded).
 *
 * Voice-synced beat table (do not shift):
 *  b1   15–283  "My scraper marked almost every LinkedIn posting Easy Apply and threw it away — 643 of 644 in a month."
 *  b2  292–488  "It hunted for a button LinkedIn stopped showing guests months ago, so real postings landed straight in the trash."
 *  b3  497–688  "So I built a Python resolver that reads LinkedIn's own guest-page marker to spot a real application form."
 *  b4  697–882  "It checks the posting text, then that marker, then the employer's site, before any paid search."
 *  b5  891–1041 "Out of the next thirty postings, real working links went from zero to twenty." — holds to 1086.
 *
 * Single tech name in the whole clip: Python (beat 3 chip only).
 */
import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider } from "./bright-theme";
import { LightBg, Group, Panel, BrowserWindow, StatPill, FilterChip, CheckBadge, CaptionBand, seg, fontFamily } from "./bright-primitives";
import { LiveWindow, Win } from "./live-primitives";
import shots from "./shots/j73.json";

const P = MOODS.slate;

const WIN: Win = { x: 170, y: 56, w: 940, h: 290 };

const SPINE_X = 250;
const OLD_Y = 400;
const NEW_Y = 600;

const path = (frame: number, start: number, end: number, xs: number[]) => {
  const n = xs.length;
  const bps = xs.map((_, i) => start + ((end - start) * i) / (n - 1));
  return interpolate(frame, bps, xs, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
};

const vline = (x: number, y1: number, y2: number, color: string, opacity: number) =>
  opacity > 0.004 ? (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y1,
        width: 2,
        height: y2 - y1,
        opacity,
        background: `repeating-linear-gradient(to bottom, ${color} 0 6px, transparent 6px 12px)`,
      }}
    />
  ) : null;

const hline = (x: number, y: number, len: number, color: string, opacity: number) =>
  opacity > 0.004 ? (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: len,
        height: 2,
        opacity,
        background: `repeating-linear-gradient(to right, ${color} 0 6px, transparent 6px 12px)`,
      }}
    />
  ) : null;

const node = (
  x: number, y: number, w: number, h: number, emoji: string, label: string,
  tone: "card" | "danger" | "success" | "accent" | "note", opacity: number, sub?: string, subColor?: string,
) => (
  <Panel x={x} y={y} w={w} h={h} tone={tone} opacity={opacity} radius={14}>
    <div style={{ position: "absolute", left: 16, top: 10, right: 16, display: "flex", alignItems: "center", gap: 8, fontFamily }}>
      <span style={{ fontSize: 20 }}>{emoji}</span>
      <span style={{ fontSize: 15, fontWeight: 750, color: "#1B2532", lineHeight: 1.15 }}>{label}</span>
    </div>
    {sub ? (
      <div style={{ position: "absolute", left: 16, bottom: 8, fontSize: 13, fontWeight: 700, color: subColor ?? "#C0392B" }}>{sub}</div>
    ) : null}
  </Panel>
);

const Token: React.FC<{ x: number; y: number; opacity: number; color: string }> = ({ x, y, opacity, color }) =>
  opacity > 0.004 ? (
    <div
      style={{
        position: "absolute",
        left: x - 9,
        top: y - 9,
        width: 18,
        height: 18,
        borderRadius: "50%",
        background: color,
        boxShadow: `0 0 0 5px ${color}33`,
        opacity,
      }}
    />
  ) : null;

export const FeatureUnmaskingLinkedinSHiddenJ73: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  const b1 = seg(frame, 15, 23) * (1 - seg(frame, 275, 283));
  const b2 = seg(frame, 292, 300) * (1 - seg(frame, 480, 488));
  const b3 = seg(frame, 497, 505) * (1 - seg(frame, 680, 688));
  const b4 = seg(frame, 697, 705) * (1 - seg(frame, 874, 882));
  const b5 = seg(frame, 891, 899); // holds through 1086

  const oldRow = Math.max(b1, b2);
  const newRow = Math.max(b3, b4, b5);

  const dyNew = interpolate(frame, [497, 530], [24, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const dyOutcome = interpolate(frame, [891, 923], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  const chipPop = pop(524);
  const badgePop = pop(910);

  const t1x = path(frame, 15, 283, [250, 430, 750]);
  const t2x = path(frame, 497, 688, [250, 385, 635]);
  const t3x = path(frame, 697, 882, [250, 385, 635, 885]);

  const headline = (text: string) => (
    <div style={{ position: "absolute", left: 40, top: 6, width: 300, fontSize: 18, fontWeight: 800, lineHeight: 1.25, color: "#1B2532", fontFamily }}>
      {text}
    </div>
  );

  return (
    <PaletteProvider value={P}>
      <div style={{ position: "absolute", inset: 0, fontFamily }}>
        <LightBg />

        {/* persistent branch spine + start node */}
        {hline(210, 499, 40, "#5B6B80", 1)}
        {vline(SPINE_X, OLD_Y, NEW_Y, "#5B6B80", 1)}
        {node(40, 460, 170, 76, "📨", "LinkedIn posting", "card", 1)}

        {/* old path */}
        {hline(SPINE_X, OLD_Y, 40, "#C0392B", oldRow)}
        {node(290, 368, 280, 64, "🔘", "Old apply-button check", "card", oldRow)}
        {hline(570, OLD_Y, 40, "#C0392B", oldRow)}
        {node(610, 368, 280, 64, "🗑", "Discarded", "danger", oldRow, "643 / 644 postings", "#C0392B")}
        <Token x={t1x} y={OLD_Y} opacity={b1} color="#C0392B" />

        {/* new path */}
        {hline(SPINE_X, NEW_Y, 40, "#0B6E4F", newRow)}
        {node(290, 568, 190, 64, "📝", "Posting text", "card", newRow)}
        {hline(480, NEW_Y, 30, "#0B6E4F", newRow)}
        {node(510, 568, 250, 64, "🔎", "Guest-page marker", "card", newRow)}
        {hline(760, NEW_Y, 30, "#0B6E4F", newRow)}
        {node(790, 568, 190, 64, "🏢", "Employer site", "card", newRow)}
        {hline(980, NEW_Y, 30, "#0B6E4F", newRow * 0.5)}
        {node(1010, 568, 220, 64, "🔍", "Paid search", "note", newRow * 0.5, "last resort", "#8A6D00")}
        <Token x={t2x} y={NEW_Y} opacity={b3} color="#0B6E4F" />
        <Token x={t3x} y={NEW_Y} opacity={b4} color="#0B6E4F" />

        {/* converging outcome */}
        {vline(885, 536, 568, "#0B6E4F", b5)}
        <Group opacity={b5} dy={dyOutcome}>
          <Panel x={790} y={460} w={190} h={76} tone="success" radius={14}>
            <div style={{ position: "absolute", left: 14, top: 8, fontSize: 11.5, fontWeight: 800, letterSpacing: 1.2, color: "#0B6E4F" }}>REAL LINKS</div>
            <div style={{ position: "absolute", left: 14, top: 26, fontSize: 26, fontWeight: 800, color: "#123A2B" }}>0 → 20</div>
            <div style={{ position: "absolute", left: 14, bottom: 7, fontSize: 11.5, fontWeight: 650, color: "#3C5A4C" }}>of 30 checked</div>
          </Panel>
          <CheckBadge x={958} y={444} size={34} opacity={badgePop} scale={badgePop} />
        </Group>

        {/* beat 1 */}
        <Group opacity={b1}>{headline("One generic check for every posting")}</Group>
        <LiveWindow file={shots} shot="hub" title="vitalii.no/features — 250 shipped" from={15} hold={288}
          zoom={(t) => 1 + 0.12 * t} focus={{ x: 0.5, y: 0.4 }} opacity={b1} win={WIN} />
        <CaptionBand y={646} fontSize={20} text="643 of 644 LinkedIn postings got marked Easy Apply and thrown away" tone="danger" opacity={b1} />

        {/* beat 2 — drawn metaphor: LinkedIn stopped showing guests the apply button */}
        <Group opacity={b2}>
          {headline("A button that quietly disappeared")}
          <BrowserWindow x={WIN.x} y={WIN.y} w={WIN.w} h={WIN.h} title="linkedin.com/jobs/view/... (guest)" opacity={1}>
            <div style={{ position: "absolute", left: 32, top: 24, fontSize: 21, fontWeight: 800, color: "#1B2532" }}>Backend Engineer — Oslo</div>
            <div style={{ position: "absolute", left: 32, top: 58, fontSize: 14.5, fontWeight: 600, color: "#5B6B80" }}>Posted 3 days ago · 214 applicants</div>
            <div style={{ position: "absolute", left: 32, top: 110, width: 220, height: 48, borderRadius: 10, background: "#E7EAF0", border: "2px dashed #A8B2C0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: "#8A93A3" }}>
              (apply button — gone)
            </div>
            <StatPill x={32} y={176} emoji="⚠" text="scraper still looking for it" tone="danger" fontSize={15} />
          </BrowserWindow>
        </Group>
        <CaptionBand y={646} fontSize={20} text="The scraper hunted for a button LinkedIn stopped showing guests months ago" tone="danger" opacity={b2} />

        {/* beat 3 */}
        <Group opacity={b3} dy={dyNew}>{headline("So a resolver reads LinkedIn's own marker")}</Group>
        <LiveWindow file={shots} shot="commits" title="github.com/SmmShaman/jobbot-norway — commits · main" from={497} hold={211}
          zoom={(t) => 1.06 + 0.05 * t} focus={{ x: 0.5, y: 0.5 }} opacity={b3} win={WIN} />
        <Group opacity={b3}>
          <FilterChip x={WIN.x + 20} y={WIN.y + WIN.h - 40} text="Python · guest-page parser" icon="⚙" color="#0B6E4F" scale={chipPop} opacity={Math.min(1, chipPop)} />
          <CaptionBand y={646} fontSize={20} text="A Python resolver reads LinkedIn's own guest-page marker to spot a real form" tone="accent" opacity={b3} />
        </Group>

        {/* beat 4 */}
        <Group opacity={b4}>{headline("Text, then marker, then the employer's site")}</Group>
        <LiveWindow file={shots} shot="actions" title="github.com/SmmShaman/jobbot-norway — Actions" from={697} hold={205}
          zoom={(t) => 1 + 0.05 * t} focus={{ x: 0.3, y: 0.35 }} opacity={b4} win={WIN} />
        <CaptionBand y={646} fontSize={20} text="Posting text, then that marker, then the employer's site — before any paid search" tone="accent" opacity={b4} />

        {/* beat 5 */}
        <Group opacity={b5}>{headline("Zero working links became twenty")}</Group>
        <LiveWindow file={shots} shot="page" title="vitalii.no/features/…-unmasking-linkedins-j73" from={891} hold={195}
          zoom={(t) => 1 + 0.07 * t} focus={{ x: 0.5, y: 0.35 }} opacity={b5} win={WIN} />
        <CaptionBand y={646} fontSize={20} text="Real working links went from zero to twenty out of the next thirty postings" tone="success" opacity={b5} />
      </div>
    </PaletteProvider>
  );
};
