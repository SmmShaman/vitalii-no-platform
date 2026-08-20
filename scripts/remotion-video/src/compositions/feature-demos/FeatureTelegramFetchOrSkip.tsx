/**
 * FeatureTelegramFetchOrSkip — feature v13 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: RSS already required a real fetched article before rewriting, but
 * Telegram-sourced posts only ever got a footer "Resources" link list —
 * nothing downloaded or read it, and process-news had no minimum-length
 * guard, so a two-sentence Telegram caption could get rewritten and
 * published as a full article → the RSS extraction logic moved into a
 * shared _shared/article-fetch.ts module → in auto-publish-news, Telegram
 * rows under 400 characters (MIN_REWRITE_CHARS) now walk the post's
 * external links via isFetchableSourceUrl and fetch the first one that
 * yields a real article body → if none do, the row is marked 'skipped', a
 * deliberate stop, and schedule-publisher only ever picks up 'scheduled'
 * rows.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const TELEGRAM_POST = { x: 90, y: 56, w: 380, h: 90 };
const TELEGRAM_POST_R: Pt = { x: TELEGRAM_POST.x + TELEGRAM_POST.w, y: TELEGRAM_POST.y + TELEGRAM_POST.h / 2 };

const THIN_REWRITE = { x: 650, y: 56, w: 380, h: 90 };
const THIN_REWRITE_L: Pt = { x: THIN_REWRITE.x, y: THIN_REWRITE.y + THIN_REWRITE.h / 2 };

const SHARED = { x: 150, y: 240, w: 380, h: 96 };
const SHARED_R: Pt = { x: SHARED.x + SHARED.w, y: SHARED.y + SHARED.h / 2 };
const SHARED_B: Pt = { x: SHARED.x + SHARED.w / 2, y: SHARED.y + SHARED.h };

const WALK = { x: 650, y: 240, w: 380, h: 96 };
const WALK_L: Pt = { x: WALK.x, y: WALK.y + WALK.h / 2 };
const WALK_B: Pt = { x: WALK.x + WALK.w / 2, y: WALK.y + WALK.h };

const OUTCOME = { x: 380, y: 410, w: 440, h: 92 };
const OUTCOME_T: Pt = { x: OUTCOME.x + OUTCOME.w / 2, y: OUTCOME.y };

const TELEGRAM_TO_THIN: Pt[] = [TELEGRAM_POST_R, THIN_REWRITE_L];
const SHARED_TO_WALK: Pt[] = [SHARED_R, WALK_L];
const WALK_TO_OUTCOME: Pt[] = [WALK_B, { x: WALK_B.x, y: 370 }, OUTCOME_T];

export const FeatureTelegramFetchOrSkip: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Beat 1: footer links never downloaded, thin rewrites publish
  const teleOp = pop(6) * lf;
  const teleLit = interpolate(frame, [6, 28, 96, 116], [0, 0.5, 0.5, 0.14], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t1 = seg(frame, 24, 48);
  const t1Vis = frame >= 24 && frame < 70 ? 1 : 0;
  const thinOp = appear(30, 18) * lf;
  const thinLit = interpolate(frame, [36, 58, 96, 116], [0, 0.5, 0.5, 0.14], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const xScale = pop(64) * interpolate(frame, [92, 112], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 24, 46, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // Beat 2: shared module walks footer links, filters junk
  const t2 = seg(frame, 152, 178);
  const t2Vis = frame >= 152 && frame < 200 ? 1 : 0;
  const sharedOp = appear(148, 18) * lf;
  const sharedLit = interpolate(frame, [148, 172, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const walkOp = appear(184, 18) * lf;
  const walkLit = interpolate(frame, [188, 210, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2In = seg(frame, 200, 222, Easing.out(Easing.cubic));
  const pill2Op = pill2In * interpolate(frame, [222, 242], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap2In = seg(frame, 158, 180, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [222, 242], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // Beat 3: real article rewrites, otherwise a deliberate skip
  const t3 = seg(frame, 254, 282);
  const t3Vis = frame >= 254 && frame < 322 ? 1 : 0;
  const outcomeOp = appear(268, 18) * lf;
  const outcomeLit = interpolate(frame, [276, 298, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill3In = seg(frame, 284, 306, Easing.out(Easing.cubic));
  const pill3Op = pill3In * interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap3In = seg(frame, 266, 288, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // Beat 4: result
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;
  const metricOp = seg(frame, 358, 380, Easing.out(Easing.cubic)) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={TELEGRAM_TO_THIN} color={T.danger} width={2.5} progress={t1} opacity={0.8 * t1Vis * lf} />
      <Connector pts={SHARED_TO_WALK} color={T.accent} width={2.5} progress={t2} opacity={0.8 * t2Vis * lf} />
      <Connector pts={WALK_TO_OUTCOME} color={T.success} width={2.5} progress={t3} opacity={0.8 * t3Vis * lf} />

      <SchemaNode {...TELEGRAM_POST} state="danger" lit={teleLit} opacity={teleOp} label="Telegram post + footer links" fontSize={17}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>links never downloaded</div>
      </SchemaNode>
      <SchemaNode {...THIN_REWRITE} state="danger" lit={thinLit} opacity={thinOp} label="Rewritten from 2 sentences" fontSize={17}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>no minimum-length guard</div>
      </SchemaNode>
      <Token pts={TELEGRAM_TO_THIN} t={t1} color={T.danger} opacity={t1Vis * lf} />
      <Badge x={THIN_REWRITE.x + THIN_REWRITE.w - 20} y={THIN_REWRITE.y - 18} kind="cross" scale={xScale} opacity={xScale} size={26} />

      <SchemaNode {...SHARED} state="accent" lit={sharedLit} opacity={sharedOp} label="_shared/article-fetch.ts" fontSize={18}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>same extraction RSS already used</div>
      </SchemaNode>
      <SchemaNode {...WALK} state="accent" lit={walkLit} opacity={walkOp} label="&lt;400 chars? walk footer links" fontSize={17}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>isFetchableSourceUrl filters junk</div>
      </SchemaNode>
      <Token pts={SHARED_TO_WALK} t={t2} opacity={t2Vis * lf} />
      <Pill x={SHARED.x + 10} y={SHARED.y - 46} text="MIN_REWRITE_CHARS threshold, shared" color={T.accent} opacity={pill2Op} fontSize={16} />

      <SchemaNode {...OUTCOME} state="success" lit={outcomeLit} opacity={outcomeOp} label="Real article → rewrite, else 'skipped'" fontSize={17}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>a deliberate stop, not a failure</div>
      </SchemaNode>
      <Token pts={WALK_TO_OUTCOME} t={t3} color={T.success} opacity={t3Vis * lf} />
      <Pill x={OUTCOME.x + 10} y={OUTCOME.y + OUTCOME.h + 14} text="schedule-publisher only picks 'scheduled' rows" color={T.success} opacity={pill3Op} fontSize={15} />

      <Caption x={90} y={648} w={1100} text="Footer links sat there unread — thin captions got rewritten as full articles" color={T.danger} opacity={cap1} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Short Telegram posts now walk their own links for real article content" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="No usable link means a permanent 'skipped', not an endless retry" color={T.success} opacity={cap3} fontSize={22} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>Same fetch-or-skip gate RSS already passes</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>no more rewrites built from a caption</div>
      </div>
    </AbsoluteFill>
  );
};
