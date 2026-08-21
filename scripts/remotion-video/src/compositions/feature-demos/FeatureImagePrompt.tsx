/**
 * FeatureImagePrompt — feature p03 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 * BRIGHT INFOGRAPHIC template (v2, 2026-08-21) — written for a NON-TECHNICAL
 * viewer: problem/solution color zones, a real browser mockup of the two AI
 * stages, category chips clicked by a cursor, and a big before→after metric.
 *
 * Story (4 beats):
 *  1. Problem — one generic prompt for every article → the same stock-photo
 *     look no matter the story; ~30% of images actually match. Red zone.
 *  2. Solution — Stage 1 classifies the article into 1 of 7 categories and
 *     pulls out its key facts; Stage 2 fills a proven template for that
 *     category with those facts.
 *  3. How the two stages work — article → classifier → template icon strip.
 *     One small tech-credibility line (Deno Edge Function, Azure OpenAI).
 *  4. Result — before/after cards: ~30% → ~85% relevant, ≈2.8× more
 *     relevant images. Green zone, check badge.
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
  FilterChip,
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

const SAME_ARTICLES = [
  { title: "Nordic Energy Policy Explainer" },
  { title: "AI Chip Startup Raises $50M" },
  { title: "Local Football Team Wins Cup" },
];

const CATS = ["Tech product", "Marketing", "AI research", "Business news", "Science", "Lifestyle", "General"];
const CAT_X = [50, 210, 380, 570, 760, 930, 1080];
const CAT_HI = 0;

export const FeatureImagePrompt: React.FC = () => {
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

  // ── Beat 1: the problem ────────────────────────────────────────────
  const noteOp = seg(frame, 24, 40, Easing.out(Easing.cubic));
  const pill1 = pop(46);
  const pill2 = pop(58);
  const pill3 = pop(70);
  const cardOp = SAME_ARTICLES.map((_, i) => seg(frame, 16 + i * 9, 28 + i * 9, Easing.out(Easing.cubic)));

  // ── Beat 2: the solution ───────────────────────────────────────────
  const chipOp = CATS.map((_, i) => Math.min(1, pop(132 + i * 8)));
  const chipHiLit = seg(frame, 160, 176, Easing.inOut(Easing.cubic));
  const cx = interpolate(frame, [136, 158, 172, 190], [700, CAT_X[CAT_HI] + 60, CAT_X[CAT_HI] + 60, 260], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const cy = interpolate(frame, [136, 158, 172, 190], [340, 152, 152, 250], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const cursorOp = seg(frame, 136, 144) * (1 - seg(frame, 190, 202));
  const click1 = seg(frame, 158, 172, Easing.out(Easing.quad));
  const panel1Op = seg(frame, 182, 200, Easing.out(Easing.cubic));
  const panel2Op = seg(frame, 198, 216, Easing.out(Easing.cubic));
  const cap2 = seg(frame, 196, 212, Easing.out(Easing.cubic));

  // ── Beat 3: how the two stages work ────────────────────────────────
  const card1 = pop(252);
  const card2 = pop(272);
  const card3 = pop(292);
  const arr1 = seg(frame, 262, 278, Easing.inOut(Easing.cubic));
  const arr2 = seg(frame, 282, 298, Easing.inOut(Easing.cubic));
  const cap3 = seg(frame, 300, 316, Easing.out(Easing.cubic));

  // ── Beat 4: the result ──────────────────────────────────────────────
  const beforeIn = seg(frame, 350, 364, Easing.out(Easing.cubic));
  const arrRes = seg(frame, 362, 378, Easing.inOut(Easing.cubic));
  const afterIn = pop(372);
  const relX = interpolate(frame, [384, 414], [1, 2.8], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }).toFixed(1);
  const speedOp = seg(frame, 384, 398, Easing.out(Easing.cubic));
  const check = pop(392);
  const footOp = seg(frame, 402, 418);

  return (
    <div style={{ position: "absolute", inset: 0, fontFamily }}>
      <LightBg />

      {/* ════ Beat 1 — PROBLEM ════ */}
      <Group opacity={b1}>
        <Headline text="One prompt for every article?" accentText="~30% relevant" accentColor={B.danger} opacity={seg(frame, 4, 18)} />
        <BrowserWindow x={80} y={116} w={700} h={452} title="image-gen — same prompt, every story" opacity={Math.min(1, pop(8))}>
          <div style={{ display: "flex", gap: 18, padding: 26, fontFamily }}>
            {SAME_ARTICLES.map((a, i) => (
              <div
                key={a.title}
                style={{
                  flex: 1,
                  opacity: cardOp[i],
                  transform: `translateY(${(1 - cardOp[i]) * 16}px)`,
                  background: B.card,
                  border: `1.5px solid ${B.border}`,
                  borderRadius: 14,
                  padding: 14,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: 90,
                    borderRadius: 10,
                    background: "linear-gradient(135deg, #C9D3E2 0%, #E3E9F2 100%)",
                    marginBottom: 10,
                  }}
                />
                <div style={{ fontSize: 14.5, fontWeight: 650, color: B.ink, lineHeight: 1.3 }}>{a.title}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: B.danger, marginTop: 8 }}>✕ same generic photo</div>
              </div>
            ))}
          </div>
        </BrowserWindow>
        <StickyNote
          x={830}
          y={150}
          w={350}
          opacity={noteOp}
          text="Need: an image that matches THIS article — not the same stock photo every time"
        />
        <StatPill x={846} y={340} emoji="🖼️" text="Same generic photo, every time" tone="danger" scale={pill1} opacity={Math.min(1, pill1)} />
        <StatPill x={846} y={402} emoji="📉" text="~30% actually relevant" tone="danger" scale={pill2} opacity={Math.min(1, pill2)} />
        <StatPill x={846} y={464} emoji="😩" text="Rewriting the prompt by hand" tone="danger" scale={pill3} opacity={Math.min(1, pill3)} />
        <CaptionBand text="One prompt for every article — generic, forgettable, and often just wrong" tone="danger" opacity={seg(frame, 30, 46)} />
      </Group>

      {/* ════ Beat 2 — SOLUTION ════ */}
      <Group opacity={b2}>
        <Headline text="Classify first," accentText="then fill a matching template" accentColor={B.success} opacity={seg(frame, 116, 130)} />
        {CATS.map((c, i) => (
          <FilterChip
            key={c}
            x={CAT_X[i]}
            y={140}
            text={c}
            icon=""
            scale={chipOp[i]}
            opacity={chipOp[i]}
            color={i === CAT_HI ? (chipHiLit > 0.5 ? B.success : B.accent) : B.muted}
          />
        ))}
        <Panel x={110} y={210} w={520} h={232} tone="accent" opacity={panel1Op}>
          <div style={{ padding: "20px 26px", fontFamily }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: B.accent, letterSpacing: 0.5 }}>STAGE 1 · WHAT IT'S ABOUT</div>
            <div style={{ fontSize: 17, fontWeight: 600, color: B.ink, marginTop: 14, lineHeight: 1.6 }}>
              Company: <span style={{ color: B.muted, fontWeight: 500 }}>Nordwind Robotics</span>
              <br />
              Category: <span style={{ color: B.muted, fontWeight: 500 }}>tech_product</span>
              <br />
              Visual concept: <span style={{ color: B.muted, fontWeight: 500 }}>glowing server room, blue circuits</span>
              <br />
              Colors: <span style={{ color: B.muted, fontWeight: 500 }}>navy + electric blue</span>
            </div>
          </div>
        </Panel>
        <Panel x={650} y={210} w={520} h={232} tone="success" opacity={panel2Op}>
          <div style={{ padding: "20px 26px", fontFamily }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: B.success, letterSpacing: 0.5 }}>STAGE 2 · FINAL PROMPT</div>
            <div style={{ fontSize: 16.5, fontWeight: 600, color: B.ink, marginTop: 14, lineHeight: 1.55 }}>
              "A sleek server room glowing with blue circuit patterns, subtle Nordwind Robotics branding, navy and
              electric-blue palette, cinematic lighting."
            </div>
          </div>
        </Panel>
        <Cursor x={cx} y={cy} opacity={cursorOp} click={click1 % 1} />
        <CaptionBand text="Stage 1 reads the article and figures out exactly what it's about" tone="accent" opacity={cap2} />
      </Group>

      {/* ════ Beat 3 — HOW THE TWO STAGES WORK ════ */}
      <Group opacity={b3}>
        <Headline text="Two AI calls," accentText="one tailored prompt" accentColor={B.accent} opacity={seg(frame, 240, 254)} />
        <IconCard x={110} y={218} w={300} emoji="🏷️" title="Classifies into 1 of 7 categories" sub="tech_product, science, lifestyle…" tone="accent" scale={card1} opacity={Math.min(1, card1)} />
        <IconCard x={490} y={218} w={300} emoji="🧩" title="Picks the matching template" sub="pre-optimized per category" tone="accent" scale={card2} opacity={Math.min(1, card2)} />
        <IconCard x={870} y={218} w={300} emoji="🎨" title="Fills in company, mood, colors" sub="ready for image generation" tone="success" scale={card3} opacity={Math.min(1, card3)} />
        <FlowArrow x={412} y={262} len={76} progress={arr1} />
        <FlowArrow x={792} y={262} len={76} progress={arr2} color={B.success} />
        <CaptionBand
          text="Under the hood: a Deno Edge Function calls Azure OpenAI twice — classify, then generate"
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
            <div style={{ fontSize: 40, fontWeight: 800, color: B.ink, marginTop: 14 }}>~30%</div>
            <div style={{ fontSize: 26, fontWeight: 650, color: B.muted, marginTop: 6 }}>images actually matched</div>
          </div>
        </Panel>
        <FlowArrow x={560} y={264} len={150} progress={arrRes} color={B.success} />
        <Panel x={740} y={170} w={400} h={210} tone="success" opacity={Math.min(1, afterIn)}>
          <div style={{ padding: "26px 30px", transform: `scale(${0.9 + 0.1 * Math.min(1, afterIn)})`, transformOrigin: "center", fontFamily }}>
            <div style={{ fontSize: 19, fontWeight: 700, color: B.success, letterSpacing: 1 }}>NOW</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: B.ink, marginTop: 14 }}>~85%</div>
            <div style={{ fontSize: 26, fontWeight: 650, color: B.muted, marginTop: 6 }}>images actually matched</div>
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
          <span style={{ fontSize: 52, fontWeight: 800, color: B.success }}>≈{relX}× more relevant</span>
        </div>
        <div style={{ position: "absolute", left: 0, top: 540, width: 1280, textAlign: "center", opacity: footOp, fontFamily }}>
          <div style={{ fontSize: 22, fontWeight: 650, color: B.muted }}>
            Update one template — every future tech_product image improves instantly, no redeploy.
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, color: B.accent, marginTop: 12 }}>Image Prompt System · vitalii.no</div>
        </div>
      </Group>
    </div>
  );
};
