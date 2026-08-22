/**
 * FeatureRaceConditionPosting — feature p17 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 * BRIGHT INFOGRAPHIC template (v2, 2026-08-22) — written for a NON-TECHNICAL
 * viewer: problem/solution color zones, a real LinkedIn-feed mockup showing
 * the duplicate, a database-table mockup with a UNIQUE constraint, an
 * icon strip for how it's blocked, and a big before→after result.
 *
 * Story (4 beats):
 *  1. Problem — Request A posts article #482 to LinkedIn; Request B, the
 *     same article, slips in ~3 seconds later. Followers see it twice.
 *     Red zone, duplicated feed-card mockup.
 *  2. Solution — every post first inserts a 'pending' row into a table
 *     guarded by UNIQUE(content_id, platform, language); the second insert
 *     is rejected before it ever reaches LinkedIn.
 *  3. How it stays impossible — insert pending → constraint checks →
 *     winner flips to posted (one small tech-credibility line: Postgres
 *     UNIQUE constraint).
 *  4. Result — before/after cards: duplicates slipping through → 0
 *     duplicate posts across LinkedIn, Twitter and Facebook. Green zone.
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
  IconCard,
  FlowArrow,
  StickyNote,
  StatPill,
  Cursor,
  CheckBadge,
  CaptionBand,
  seg,
  loopFade,
  fontFamily,
} from "./bright-primitives";

export const FeatureRaceConditionPosting: React.FC = () => {
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
  const post1 = pop(18);
  const post2 = pop(42);
  const stampOp = seg(frame, 54, 70, Easing.out(Easing.cubic));
  const noteOp = seg(frame, 24, 40, Easing.out(Easing.cubic));
  const pill1 = pop(46);
  const pill2 = pop(58);
  const pill3 = pop(70);

  // ── Beat 2: the solution ───────────────────────────────────────────
  const reqA = pop(132);
  const reqB = pop(142);
  const cx = interpolate(frame, [124, 146, 168, 184], [700, 250, 250, 1010], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const cy = interpolate(frame, [124, 146, 168, 184], [400, 152, 300, 152], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const cursorOp = seg(frame, 124, 132) * (1 - seg(frame, 205, 218));
  const clickA = seg(frame, 146, 158, Easing.out(Easing.quad));
  const clickB = seg(frame, 184, 196, Easing.out(Easing.quad));
  const winOp = seg(frame, 160, 174, Easing.out(Easing.cubic));
  const row1In = seg(frame, 162, 176, Easing.out(Easing.cubic));
  const row2In = seg(frame, 192, 204, Easing.out(Easing.cubic));
  const blockedX = pop(198);
  const cap2 = seg(frame, 196, 212, Easing.out(Easing.cubic));

  // ── Beat 3: how it stays impossible ─────────────────────────────────
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
  const check = pop(392);
  const speedOp = seg(frame, 384, 398, Easing.out(Easing.cubic));
  const footOp = seg(frame, 402, 418);

  const FeedCard: React.FC<{ y: number; dup?: boolean }> = ({ y, dup }) => (
    <div
      style={{
        position: "absolute",
        left: 24,
        top: y,
        width: 652,
        borderRadius: 12,
        border: `1.5px solid ${B.border}`,
        background: B.card,
        padding: "16px 20px",
        fontFamily,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: B.accentBg, border: `1.5px solid #C4D7FB` }} />
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: B.ink }}>Vitalii Berbeha</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: B.muted }}>just now</div>
        </div>
      </div>
      <div style={{ fontSize: 15.5, fontWeight: 500, color: B.ink, marginTop: 12, lineHeight: 1.35 }}>
        New feature shipped: article #482 is live — read the full story on vitalii.no
      </div>
      {dup ? (
        <div
          style={{
            position: "absolute",
            right: 24,
            top: 18,
            padding: "4px 12px",
            borderRadius: 999,
            background: B.dangerBg,
            border: `1.5px solid #F3C2C7`,
            color: B.danger,
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: 0.4,
            opacity: stampOp,
          }}
        >
          DUPLICATE
        </div>
      ) : null}
    </div>
  );

  return (
    <div style={{ position: "absolute", inset: 0, fontFamily }}>
      <LightBg />

      {/* ════ Beat 1 — PROBLEM ════ */}
      <Group opacity={b1}>
        <Headline text="One article," accentText="posted twice?" accentColor={B.danger} opacity={seg(frame, 4, 18)} />
        <BrowserWindow x={80} y={116} w={700} h={452} title="LinkedIn — company feed" opacity={Math.min(1, pop(8))}>
          <div style={{ opacity: Math.min(1, post1) }}>
            <FeedCard y={24} />
          </div>
          <div style={{ opacity: Math.min(1, post2) }}>
            <FeedCard y={220} dup />
          </div>
        </BrowserWindow>
        <StickyNote
          x={830}
          y={150}
          w={350}
          opacity={noteOp}
          text="Request B slipped in ~3 seconds after Request A — before the first post was marked as posted"
        />
        <StatPill x={846} y={340} emoji="⏱️" text="~3 second gap" tone="danger" scale={pill1} opacity={Math.min(1, pill1)} />
        <StatPill x={846} y={402} emoji="🔁" text="Same article, same platform" tone="danger" scale={pill2} opacity={Math.min(1, pill2)} />
        <StatPill x={846} y={464} emoji="😳" text="Every follower sees it twice" tone="danger" scale={pill3} opacity={Math.min(1, pill3)} />
        <CaptionBand text="A brief gap between checking and posting let duplicates slip through" tone="danger" opacity={seg(frame, 30, 46)} />
      </Group>

      {/* ════ Beat 2 — SOLUTION ════ */}
      <Group opacity={b2}>
        <Headline text="Now the database" accentText="won't allow it" accentColor={B.success} opacity={seg(frame, 116, 130)} />
        <Panel x={160} y={126} w={230} h={64} tone="accent" opacity={Math.min(1, reqA)}>
          <div style={{ padding: "10px 18px", fontFamily }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: B.accent, letterSpacing: 0.4 }}>REQUEST A</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: B.ink, marginTop: 2 }}>post article #482</div>
          </div>
        </Panel>
        <Panel x={890} y={126} w={230} h={64} tone="danger" opacity={Math.min(1, reqB)}>
          <div style={{ padding: "10px 18px", fontFamily }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: B.danger, letterSpacing: 0.4 }}>REQUEST B</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: B.ink, marginTop: 2 }}>same article, ~3s later</div>
          </div>
        </Panel>
        <Cursor x={cx} y={cy} opacity={cursorOp} click={Math.max(clickA % 1, clickB % 1)} />
        <BrowserWindow x={110} y={210} w={1060} h={382} title="database — social_posts" opacity={winOp}>
          <div style={{ position: "absolute", left: 24, top: 20, width: 1012 }}>
            <div
              style={{
                display: "flex",
                gap: 14,
                fontSize: 14,
                fontWeight: 700,
                color: B.muted,
                letterSpacing: 0.4,
                borderBottom: `1.5px solid ${B.border}`,
                paddingBottom: 10,
              }}
            >
              <div style={{ width: 160 }}>CONTENT ID</div>
              <div style={{ width: 160 }}>PLATFORM</div>
              <div style={{ width: 160 }}>LANGUAGE</div>
              <div style={{ width: 300 }}>STATUS</div>
            </div>
            <div
              style={{
                display: "flex",
                gap: 14,
                fontSize: 16,
                fontWeight: 600,
                color: B.ink,
                padding: "16px 0",
                borderBottom: `1px solid ${B.border}`,
                opacity: row1In,
                transform: `translateX(${(1 - row1In) * 24}px)`,
              }}
            >
              <div style={{ width: 160 }}>#482</div>
              <div style={{ width: 160 }}>LinkedIn</div>
              <div style={{ width: 160 }}>EN</div>
              <div style={{ width: 300 }}>
                <span
                  style={{
                    padding: "3px 12px",
                    borderRadius: 999,
                    fontSize: 14,
                    fontWeight: 700,
                    background: B.successBg,
                    border: `1px solid #BFE7CD`,
                    color: B.success,
                  }}
                >
                  ✓ posted
                </span>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: 14,
                fontSize: 16,
                fontWeight: 600,
                color: B.ink,
                padding: "16px 0",
                opacity: row2In,
                transform: `translateX(${(1 - row2In) * 24}px)`,
              }}
            >
              <div style={{ width: 160 }}>#482</div>
              <div style={{ width: 160 }}>LinkedIn</div>
              <div style={{ width: 160 }}>EN</div>
              <div style={{ width: 300, display: "flex", alignItems: "center", gap: 10 }}>
                <span
                  style={{
                    padding: "3px 12px",
                    borderRadius: 999,
                    fontSize: 14,
                    fontWeight: 700,
                    background: B.dangerBg,
                    border: `1px solid #F3C2C7`,
                    color: B.danger,
                  }}
                >
                  ⛔ blocked — duplicate
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: B.danger, transform: `scale(${blockedX})`, opacity: Math.min(1, blockedX) }}>
                  Postgres 23505
                </span>
              </div>
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 300,
              width: 1060,
              textAlign: "center",
              fontSize: 15.5,
              fontWeight: 700,
              color: B.muted,
              fontFamily: "monospace, " + fontFamily,
              opacity: seg(frame, 214, 228) * 0.9,
            }}
          >
            UNIQUE(content_id, platform, language)
          </div>
        </BrowserWindow>
        <CaptionBand text="Every insert tries 'pending' first — the constraint decides who wins" tone="accent" opacity={cap2} />
      </Group>

      {/* ════ Beat 3 — HOW IT STAYS IMPOSSIBLE ════ */}
      <Group opacity={b3}>
        <Headline text="How it stays" accentText="impossible to duplicate" accentColor={B.accent} opacity={seg(frame, 240, 254)} />
        <IconCard x={110} y={218} w={300} emoji="📝" title="Insert 'pending' first" sub="before calling the API" tone="accent" scale={card1} opacity={Math.min(1, card1)} />
        <IconCard x={490} y={218} w={300} emoji="🔒" title="UNIQUE constraint checks" sub="content + platform + language" tone="accent" scale={card2} opacity={Math.min(1, card2)} />
        <IconCard x={870} y={218} w={300} emoji="✅" title="Winner flips to 'posted'" sub="the loser aborts instantly" tone="success" scale={card3} opacity={Math.min(1, card3)} />
        <FlowArrow x={412} y={262} len={76} progress={arr1} />
        <FlowArrow x={792} y={262} len={76} progress={arr2} color={B.success} />
        <CaptionBand
          text="One Postgres UNIQUE constraint — no distributed locks needed"
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
            <div style={{ fontSize: 40, fontWeight: 800, color: B.ink, marginTop: 14 }}>Duplicates</div>
            <div style={{ fontSize: 26, fontWeight: 650, color: B.muted, marginTop: 6 }}>slipped through a ~3s gap</div>
          </div>
        </Panel>
        <FlowArrow x={560} y={264} len={150} progress={arrRes} color={B.success} />
        <Panel x={740} y={170} w={400} h={210} tone="success" opacity={Math.min(1, afterIn)}>
          <div style={{ padding: "26px 30px", transform: `scale(${0.9 + 0.1 * Math.min(1, afterIn)})`, transformOrigin: "center", fontFamily }}>
            <div style={{ fontSize: 19, fontWeight: 700, color: B.success, letterSpacing: 1 }}>NOW</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: B.ink, marginTop: 14 }}>0 duplicates</div>
            <div style={{ fontSize: 26, fontWeight: 650, color: B.muted, marginTop: 6 }}>LinkedIn · Twitter · Facebook</div>
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
          <span style={{ fontSize: 52, fontWeight: 800, color: B.success }}>Zero duplicate posts</span>
        </div>
        <div style={{ position: "absolute", left: 0, top: 540, width: 1280, textAlign: "center", opacity: footOp, fontFamily }}>
          <div style={{ fontSize: 22, fontWeight: 650, color: B.muted }}>
            One UNIQUE constraint. Zero duplicates, ever again.
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, color: B.accent, marginTop: 12 }}>vitalii.no</div>
        </div>
      </Group>
    </div>
  );
};
