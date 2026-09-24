/**
 * FeatureInterviewCoachRunsOwnG03 — feature g03 — 1280x720, 930 frames @ 30fps, VOICE-SYNCED.
 *
 * archetype 2 zoom-in, mood slate.
 *
 * The camera pushes in across the whole clip: the staged window shrinks and
 * re-centers beat by beat (F1 980px wide → F2 820 → F3 700 → F4 580 → F5
 * 480), on the SAME center point, live shots and drawn beats alike — that
 * progressive push is the dominant motif this clip must obey.
 *
 * Beats 1, 3 and 5 play the real product (public/rec/g03-<shot>.mp4, built
 * from shots/g03.json by tools/record-ui.cjs on the runner) inside that
 * shrinking window. Beat 2 (the "two of everything" problem) and beat 4
 * (the automatic fallback, which has no public page to record) stay drawn —
 * beat 4's log lines are built from the feature's own text, not invented.
 *
 * Voice-synced beat table (narration windows, do not shift):
 *  b1  15–235  "Practicing for a job interview, every hint and retry used to run up a bill — on two separate cloud accounts at once."
 *  b2 244–435  "Two providers meant two quotas, two failure modes, and two places pricing could quietly change."
 *  b3 444–571  "Now the coaching runs entirely on my own Claude subscription instead."
 *  b4 580–720  "Hit a limit, and it falls back automatically — the interview never stalls."
 *  b5 729–885  "One provider, one login, one place the pricing lives now — down from two." — holds to 930.
 *
 * Single tech name in the whole clip: Claude (beat 3 badge only).
 */
import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider } from "./bright-theme";
import {
  LightBg,
  Group,
  StatPill,
  IconCard,
  FilterChip,
  CheckBadge,
  CaptionBand,
  Panel,
  FlowArrow,
  seg,
  fontFamily,
} from "./bright-primitives";
import { LiveWindow, LogWindow, Win } from "./live-primitives";
import shots from "./shots/g03.json";

const P = MOODS.slate;

// The camera push: same center (x=640), shrinking width/height beat by beat.
const F1: Win = { x: 150, y: 196, w: 980, h: 450 };
const F2: Win = { x: 230, y: 196, w: 820, h: 450 };
const F3: Win = { x: 290, y: 206, w: 700, h: 410 };
const F4: Win = { x: 350, y: 216, w: 580, h: 390 };
const F5: Win = { x: 400, y: 230, w: 480, h: 330 };

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

export const FeatureInterviewCoachRunsOwnG03: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  const b1 = seg(frame, 15, 31) * (1 - seg(frame, 219, 235));
  const b2 = seg(frame, 244, 260) * (1 - seg(frame, 419, 435));
  const b3 = seg(frame, 444, 460) * (1 - seg(frame, 555, 571));
  const b4 = seg(frame, 580, 596) * (1 - seg(frame, 704, 720));
  const b5 = seg(frame, 729, 745); // holds through 930, no fade-out

  const pop1 = pop(15);
  const pop2 = pop(244);
  const pop3 = pop(444);
  const pop5 = pop(729);

  // beat 2: three problem cards land in sequence, one per noun in the sentence
  const cardIn = (i: number) => seg(frame, 300 + i * 16, 316 + i * 16);

  // beat 4: log lines land one by one inside the fallback window
  const b4In = seg(frame, 580, 596);

  // beat 5: before/after strip
  const stripIn = seg(frame, 800, 820);
  const arrowProgress = interpolate(frame, [806, 838], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <PaletteProvider value={P}>
      <div style={{ position: "absolute", inset: 0, fontFamily }}>
        <LightBg />

        {/* ---------------- beat 1 : practicing, billed on two accounts at once ---------------- */}
        <Group opacity={b1}>
          <div
            style={{
              position: "absolute",
              left: 90,
              top: 40,
              transform: `scale(${0.85 + 0.15 * Math.min(1, pop1)})`,
              transformOrigin: "left top",
            }}
          >
            <div style={{ fontSize: 30, fontWeight: 800, color: P.ink }}>👻 Ghost Interviewer AI</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: P.muted, marginTop: 4 }}>
              practice interviews, live AI coaching
            </div>
          </div>
          <StatPill x={740} y={38} emoji="💳" text="Cloud Provider 1 — billing live" tone="danger" opacity={b1} scale={pop1} />
          <StatPill x={740} y={94} emoji="💳" text="Cloud Provider 2 — billing live" tone="danger" opacity={b1} scale={pop1} />
        </Group>
        <LiveWindow
          file={shots}
          shot="coach1"
          title="ghost.vitalii.no — mock interview"
          from={15}
          hold={220}
          zoom={(t) => 1 + 0.14 * easeInOut(t)}
          focus={{ x: 0.5, y: 0.4 }}
          opacity={b1}
          win={F1}
        />
        <Group opacity={b1}>
          <CaptionBand y={664} fontSize={22} text="Practicing an interview quietly billed two separate cloud accounts" tone="danger" opacity={b1} />
        </Group>

        {/* ---------------- beat 2 : two of everything (drawn) ---------------- */}
        <Group
          opacity={b2}
          dy={interpolate(frame, [244, 276], [26, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) })}
        >
          <Panel x={F2.x} y={F2.y} w={F2.w} h={F2.h} tone="card" opacity={b2} />
          <StatPill x={F2.x + 40} y={F2.y + 34} emoji="💳" text="Cloud Provider 1" tone="danger" opacity={b2} />
          <StatPill x={F2.x + F2.w - 280} y={F2.y + 34} emoji="💳" text="Cloud Provider 2" tone="danger" opacity={b2} />
          <IconCard x={F2.x + 20} y={F2.y + 150} w={230} emoji="📊" title="Two quotas" tone="danger" opacity={cardIn(0)} scale={cardIn(0)} />
          <IconCard x={F2.x + F2.w / 2 - 115} y={F2.y + 150} w={230} emoji="⚠️" title="Two failure modes" tone="danger" opacity={cardIn(1)} scale={cardIn(1)} />
          <IconCard x={F2.x + F2.w - 250} y={F2.y + 150} w={230} emoji="💰" title="Two pricing pages" tone="danger" opacity={cardIn(2)} scale={cardIn(2)} />
          <CaptionBand y={664} fontSize={22} text="Two providers meant two quotas, two failure modes, two pricing pages" tone="danger" opacity={b2} />
        </Group>

        {/* ---------------- beat 3 : one subscription now (live, single tech name) ---------------- */}
        <Group opacity={b3}>
          <LiveWindow
            file={shots}
            shot="coach2"
            title="ghost.vitalii.no — coaching session"
            from={444}
            hold={127}
            zoom={(t) => 1.08 + 0.1 * easeInOut(t)}
            focus={{ x: 0.5, y: 0.5 }}
            opacity={b3}
            win={F3}
          />
          <FilterChip x={F3.x + F3.w - 190} y={F3.y - 26} text="Claude" icon="🤖" color={P.accent} scale={pop3} opacity={Math.min(1, pop3)} />
          <StatPill x={F3.x} y={F3.y - 26} emoji="✅" text="one subscription" tone="success" opacity={b3} scale={pop3} />
          <CaptionBand y={664} fontSize={22} text="One subscription now covers every hint" tone="accent" opacity={b3} />
        </Group>

        {/* ---------------- beat 4 : hits a limit, falls back automatically (drawn log) ---------------- */}
        <Group
          opacity={b4}
          dy={interpolate(frame, [580, 612], [26, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) })}
        >
          <LogWindow
            title="ghost-interviewer · coaching worker"
            from={580}
            every={22}
            opacity={b4}
            win={F4}
            fontSize={18}
            lines={[
              { t: "11:04", text: "hint requested", tone: "ink" },
              { t: "11:04", text: "provider limit reached", tone: "danger" },
              { t: "11:04", text: "falling back to backup tier", tone: "accent" },
              { t: "11:04", text: "hint delivered", tone: "success" },
              { t: "11:05", text: "interview continues", tone: "success" },
            ]}
          />
          <div
            style={{
              position: "absolute",
              left: F4.x,
              top: F4.y - 40,
              width: F4.w,
              textAlign: "center",
              fontSize: 17,
              fontWeight: 700,
              color: P.accent,
              opacity: b4In,
            }}
          >
            switches providers automatically
          </div>
          <CaptionBand y={664} fontSize={22} text="Hit a limit, and it falls back automatically — the interview never stalls" tone="accent" opacity={b4} />
        </Group>

        {/* ---------------- beat 5 : one provider, one login, one place the pricing lives ---------------- */}
        <Group opacity={b5}>
          <LiveWindow
            file={shots}
            shot="coach3"
            title="ghost.vitalii.no — coaching session"
            from={729}
            hold={201}
            zoom={(t) => 1.15 + 0.08 * easeInOut(t)}
            focus={{ x: 0.5, y: 0.5 }}
            opacity={b5}
            win={F5}
          />
          <CheckBadge x={F5.x + F5.w - 6} y={F5.y - 24} size={44} opacity={b5} scale={pop5} />
          <div
            style={{
              position: "absolute",
              left: 340,
              top: 470,
              width: 600,
              padding: "14px 18px",
              borderRadius: 16,
              background: "rgba(255,255,255,0.96)",
              border: `1.5px solid ${P.successEdge}`,
              boxShadow: "0 14px 34px rgba(22,35,63,0.16)",
              opacity: stripIn,
              transform: `translateY(${(1 - stripIn) * 16}px)`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 30, fontWeight: 800, color: P.danger, whiteSpace: "nowrap" }}>2 PROVIDERS</div>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: P.muted, letterSpacing: 1, whiteSpace: "nowrap" }}>BEFORE</div>
              </div>
              <div style={{ position: "relative", width: 90, height: 24, flexShrink: 0 }}>
                <FlowArrow x={0} y={10} len={90} progress={arrowProgress} color={P.success} opacity={stripIn} />
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 30, fontWeight: 800, color: P.success, whiteSpace: "nowrap" }}>1 PROVIDER</div>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: P.muted, letterSpacing: 1, whiteSpace: "nowrap" }}>NOW</div>
              </div>
            </div>
          </div>
          <CaptionBand y={664} fontSize={22} text="One provider, one login, one place the pricing lives" tone="success" opacity={b5} />
        </Group>
      </div>
    </PaletteProvider>
  );
};
