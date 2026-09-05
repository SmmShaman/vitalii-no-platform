/**
 * FeatureMultiRepoScanner — feature p59 — 1280x720, 883 frames @ 30fps, VOICE-SYNCED.
 *
 * ART-DIRECTION REWRITE (2026-09-05). Archetype 6 "sidebar narrative" / mood
 * "slate". A fixed dark sidebar on the left carries the running claim (repo
 * count, minutes lost, the eventual 70-80% payoff) while the stage on the
 * right walks through: 7 unknown repos -> searching them one by one -> the
 * filing-cabinet analogy -> a workflow scanning all 7 in parallel -> one
 * click straight to the exact commit.
 *
 * Voice-synced beat table (narration windows, do not shift):
 *  b1  15–172  "Seven repos. One feature. And I could never remember which repo touched it last."
 *  b2 181–322  "I'd search my way through all seven, chasing a commit that could be anywhere."
 *  b3 331–479  "It was like searching seven filing cabinets for one receipt, one drawer at a time."
 *  b4 488–691  "Now GitHub Actions scans every repo on each push and builds one map straight to the exact commit."
 *  b5 700–838  "One click now finds it. Debugging time dropped seventy to eighty percent." — holds to 883.
 *
 * Single tech name in the whole clip: GitHub Actions (beat 4 headline only).
 */
import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { MOODS, PaletteProvider } from "./bright-theme";
import { LightBg, Group, IconCard, Cursor, CheckBadge, seg, fontFamily } from "./bright-primitives";

const P = MOODS.slate;

const SIDEBAR_W = 320;
const STAGE_L = 372;
const STAGE_W = 848;

const SIDE_ACCENT = "#7DD3E8";
const SIDE_AMBER = "#FFCB6B";
const SIDE_DANGER = "#FF8FA6";
const SIDE_SUCCESS = "#6EE7C8";
const SIDE_MUTED = "rgba(255,255,255,0.56)";

const REPOS = ["vitalii-portfolio", "boytasks", "jobbot-no", "+4 more"];
const DRAWER_LABELS = ["vitalii", "boytasks", "jobbot", "repo 4", "repo 5", "repo 6", "repo 7"];

type CommitRow = { feature: string; repo: string; commit: string; shipped: string };
const ROWS: CommitRow[] = [
  { feature: "LinkedIn Native Image Upload", repo: "vitalii-portfolio", commit: "a3f9c12", shipped: "2 days ago" },
  { feature: "MTKruto Video Bypass", repo: "vitalii-portfolio", commit: "7e21bd4", shipped: "1 week ago" },
  { feature: "Two-Tier Screen Gate", repo: "boytasks", commit: "5c88a01", shipped: "3 weeks ago" },
  { feature: "Skyvern VPS Deploy", repo: "jobbot-no", commit: "d40f3aa", shipped: "1 month ago" },
];

const SideStat: React.FC<{ big: string; color: string; label: string; sub: string; opacity: number; fontSize?: number }> = ({
  big,
  color,
  label,
  sub,
  opacity,
  fontSize = 92,
}) => {
  if (opacity <= 0.004) return null;
  return (
    <div style={{ position: "absolute", left: 32, top: 210, width: SIDEBAR_W - 64, opacity }}>
      <div style={{ fontSize, fontWeight: 800, color, lineHeight: 1, fontFamily, letterSpacing: -1 }}>{big}</div>
      <div
        style={{
          marginTop: 18,
          fontSize: 15.5,
          fontWeight: 700,
          color: "#fff",
          textTransform: "uppercase",
          letterSpacing: 1.6,
          lineHeight: 1.3,
          fontFamily,
        }}
      >
        {label}
      </div>
      <div style={{ marginTop: 8, fontSize: 15.5, color: SIDE_MUTED, lineHeight: 1.4, fontFamily }}>{sub}</div>
    </div>
  );
};

const StageTitle: React.FC<{ text: string; opacity: number; fontSize?: number }> = ({ text, opacity, fontSize = 30 }) => (
  <div
    style={{
      position: "absolute",
      left: STAGE_L - 12,
      top: 50,
      width: STAGE_W + 24,
      textAlign: "center",
      fontSize,
      fontWeight: 800,
      color: P.ink,
      opacity,
      fontFamily,
      lineHeight: 1.25,
    }}
  >
    {text}
  </div>
);

const StageSub: React.FC<{ text: string; opacity: number; color?: string; top?: number }> = ({ text, opacity, color, top = 96 }) => (
  <div
    style={{
      position: "absolute",
      left: STAGE_L - 12,
      top,
      width: STAGE_W + 24,
      textAlign: "center",
      fontSize: 17,
      fontWeight: 600,
      color: color ?? P.muted,
      opacity,
      fontFamily,
    }}
  >
    {text}
  </div>
);

const StageFooter: React.FC<{ text: string; opacity: number; color?: string }> = ({ text, opacity, color }) => (
  <div
    style={{
      position: "absolute",
      left: STAGE_L - 12,
      top: 610,
      width: STAGE_W + 24,
      textAlign: "center",
      fontSize: 18,
      fontWeight: 700,
      color: color ?? P.muted,
      opacity,
      fontFamily,
    }}
  >
    {text}
  </div>
);

export const FeatureMultiRepoScanner: React.FC = () => {
  const frame = useCurrentFrame();

  const b1 = seg(frame, 15, 31) * (1 - seg(frame, 172, 188));
  const b2 = seg(frame, 181, 197) * (1 - seg(frame, 322, 338));
  const b3 = seg(frame, 331, 347) * (1 - seg(frame, 479, 495));
  const b4 = seg(frame, 488, 504) * (1 - seg(frame, 691, 707));
  const b5 = seg(frame, 700, 716); // holds full to 883 — no fade-out

  // ---- beat 1 / 2 shared card geometry --------------------------------
  const cardW = 180;
  const cardGap = 20;
  const cardCount = 4;
  const cardsTotalW = cardCount * cardW + (cardCount - 1) * cardGap;
  const cardsX0 = STAGE_L + (STAGE_W - cardsTotalW) / 2;
  const cardCenterX = (i: number) => cardsX0 + i * (cardW + cardGap) + cardW / 2;

  // ---- beat 2: sequential search across the 4 visible entries --------
  const searchIdx = Math.min(3, Math.max(0, Math.floor((frame - 181) / 35)));
  const cursorX2 = cardCenterX(searchIdx);
  const cursorBob = Math.sin(frame / 5) * 3;

  // ---- beat 3: filing-cabinet analogy, 7 drawers ----------------------
  const drawerW = 104;
  const drawerGap = 12;
  const drawerCount = 7;
  const drawersTotalW = drawerCount * drawerW + (drawerCount - 1) * drawerGap;
  const drawersX0 = STAGE_L + (STAGE_W - drawersTotalW) / 2;
  const activeDrawer = Math.min(6, Math.max(0, Math.floor((frame - 331) / 21)));
  const drawerLocalT = Math.max(0, Math.min(1, (frame - 331 - activeDrawer * 21) / 21));

  // ---- beat 4: 7 repos scanned in parallel, then the map forms -------
  const barFill = interpolate(frame, [488, 630], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const rowReveal = (i: number) => seg(frame, 636 + i * 12, 652 + i * 12);

  // ---- beat 5: click straight to the exact commit ---------------------
  const clickShow = interpolate(frame, [736, 752], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <PaletteProvider value={P}>
      <div style={{ position: "absolute", inset: 0, fontFamily }}>
        <LightBg />

        {/* fixed dark sidebar — running claim, changes per beat */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: SIDEBAR_W,
            height: 720,
            background: "linear-gradient(165deg, #101828 0%, #060911 100%)",
            boxShadow: "10px 0 34px rgba(6,9,17,0.35)",
          }}
        >
          <div style={{ position: "absolute", left: 32, top: 40, fontSize: 15, fontWeight: 800, letterSpacing: 3.2, color: "rgba(255,255,255,0.5)" }}>
            REPO SCANNER
          </div>
          <div style={{ position: "absolute", left: 32, top: 80, width: SIDEBAR_W - 64, height: 1, background: "rgba(255,255,255,0.16)" }} />

          <SideStat big="7" color={SIDE_DANGER} label="Repos to check" sub="one feature, no idea where" opacity={b1} />
          <SideStat big="1-by-1" color={SIDE_AMBER} label="Manual search" sub="repo after repo, hoping" opacity={b2} fontSize={58} />
          <SideStat big="15-30" color={SIDE_DANGER} label="Minutes lost" sub="per lookup, every time" opacity={b3} fontSize={68} />
          <SideStat big="7/7" color={SIDE_ACCENT} label="Scanned at once" sub="one workflow, seven repos" opacity={b4} />
          <SideStat big="70-80%" color={SIDE_SUCCESS} label="Less context-switching" sub="one click, straight to the commit" opacity={b5} fontSize={54} />

          <div style={{ position: "absolute", left: 32, top: 656, fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: 0.5 }}>
            vitalii.no
          </div>
        </div>

        {/* ---------------- beat 1 : problem ---------------- */}
        <Group opacity={b1}>
          <StageTitle text="One feature. Seven repos. Which one has it?" opacity={1} />
          <StageSub text="🔎 LinkedIn Native Image Upload — shipped somewhere in here" opacity={1} />
          {REPOS.map((name, i) => (
            <IconCard key={name} x={cardCenterX(i) - cardW / 2} y={250} w={cardW} emoji={i === 3 ? "➕" : "📁"} title={name} sub="?" tone="card" opacity={1} />
          ))}
          <StageFooter text="Nobody remembers which repo touched it last" opacity={1} color={P.danger} />
        </Group>

        {/* ---------------- beat 2 : sequential hunt ---------------- */}
        <Group opacity={b2}>
          <StageTitle text="Searching all seven, one at a time" opacity={1} />
          <StageSub text="🔍 chasing a commit that could be anywhere" opacity={1} />
          {REPOS.map((name, i) => {
            const checked = i < searchIdx;
            const checking = i === searchIdx;
            return (
              <IconCard
                key={name}
                x={cardCenterX(i) - cardW / 2}
                y={250}
                w={cardW}
                emoji={i === 3 ? "➕" : "📁"}
                title={name}
                sub={checked ? "✗ not here" : checking ? "checking…" : ""}
                tone={checked ? "danger" : checking ? "accent" : "card"}
                opacity={1}
              />
            );
          })}
          <Cursor x={cursorX2} y={222 + cursorBob} opacity={1} />
          <StageFooter text={`Checking ${REPOS[searchIdx]}…`} opacity={1} color={P.accent} />
        </Group>

        {/* ---------------- beat 3 : filing-cabinet analogy ---------------- */}
        <Group opacity={b3}>
          <StageTitle text="Like checking seven filing cabinets for one receipt" opacity={1} fontSize={27} />
          <StageSub text="📇 one drawer at a time, hoping this is the one" opacity={1} top={130} />
          {DRAWER_LABELS.map((label, i) => {
            const active = i === activeDrawer;
            const lift = active ? -18 - Math.sin(drawerLocalT * Math.PI) * 6 : 0;
            return (
              <div
                key={label}
                style={{
                  position: "absolute",
                  left: drawersX0 + i * (drawerW + drawerGap),
                  top: 210 + lift,
                  width: drawerW,
                  height: 260,
                  background: active ? P.accentBg : P.card,
                  border: `2px solid ${active ? P.accentEdge : P.border}`,
                  borderRadius: 10,
                  boxShadow: active ? "0 18px 30px rgba(14,116,144,0.24)" : "0 4px 10px rgba(16,24,40,0.06)",
                }}
              >
                <div style={{ position: "absolute", left: 0, right: 0, top: 14, textAlign: "center", fontSize: 12.5, fontWeight: 700, color: P.muted }}>
                  {label}
                </div>
                <div style={{ position: "absolute", left: 8, right: 8, top: 44, height: 2, background: active ? P.accent : P.border }} />
                {active && (
                  <div style={{ position: "absolute", left: 0, right: 0, top: 100 - drawerLocalT * 24, textAlign: "center", fontSize: 30, opacity: drawerLocalT }}>
                    📄
                  </div>
                )}
              </div>
            );
          })}
          <StageFooter text={`Drawer ${activeDrawer + 1} of 7 — ${DRAWER_LABELS[activeDrawer]}`} opacity={1} color={P.accent} />
        </Group>

        {/* ---------------- beat 4 : GitHub Actions scans all 7 in parallel ---------------- */}
        <Group opacity={b4}>
          <StageTitle text="GitHub Actions scans all 7 — in parallel, on every push" opacity={1} fontSize={26} />
          <StageSub text="🤖 one workflow, seven repos, together" opacity={1} top={130} />

          {REPOS.map((name, i) => (
            <div key={name} style={{ position: "absolute", left: STAGE_L + 60, top: 180 + i * 46, width: STAGE_W - 120, height: 30 }}>
              <div style={{ position: "absolute", left: 0, top: 0, fontSize: 14, fontWeight: 700, color: P.ink }}>{name}</div>
              <div style={{ position: "absolute", left: 0, top: 18, width: "100%", height: 8, borderRadius: 4, background: P.chipBg, overflow: "hidden" }}>
                <div style={{ width: `${barFill * 100}%`, height: "100%", background: P.success, borderRadius: 4 }} />
              </div>
            </div>
          ))}

          <div
            style={{
              position: "absolute",
              left: STAGE_L + 12,
              top: 360,
              width: STAGE_W - 24,
              height: 230,
              background: P.card,
              border: `1px solid ${P.border}`,
              borderRadius: 12,
              boxShadow: "0 14px 28px rgba(16,24,40,0.08)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: 38,
                background: P.chipBg,
                display: "flex",
                alignItems: "center",
                paddingLeft: 16,
                fontSize: 13,
                fontWeight: 700,
                color: P.muted,
                borderBottom: `1px solid ${P.border}`,
              }}
            >
              commit_map.json
            </div>
            {ROWS.map((r, i) => (
              <div
                key={r.feature}
                style={{
                  position: "absolute",
                  left: 16,
                  right: 16,
                  top: 50 + i * 44,
                  opacity: rowReveal(i),
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 14,
                }}
              >
                <span style={{ fontWeight: 700, color: P.ink }}>{r.feature}</span>
                <span style={{ color: P.accent, fontWeight: 700 }}>
                  {r.repo} · {r.commit}
                </span>
              </div>
            ))}
          </div>
        </Group>

        {/* ---------------- beat 5 : one click, straight to the commit ---------------- */}
        <Group opacity={b5}>
          <StageTitle text="One click. Straight to the exact commit." opacity={1} />
          <StageSub text="commit_map.json — always in sync" opacity={1} />

          <div
            style={{
              position: "absolute",
              left: STAGE_L + 12,
              top: 150,
              width: STAGE_W - 24,
              height: 210,
              background: P.card,
              border: `1px solid ${P.border}`,
              borderRadius: 12,
              boxShadow: "0 14px 28px rgba(16,24,40,0.08)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: 38,
                background: P.chipBg,
                display: "flex",
                alignItems: "center",
                paddingLeft: 16,
                fontSize: 13,
                fontWeight: 700,
                color: P.muted,
                borderBottom: `1px solid ${P.border}`,
              }}
            >
              commit_map.json
            </div>
            {ROWS.map((r, i) => (
              <div
                key={r.feature}
                style={{
                  position: "absolute",
                  left: 16,
                  right: 16,
                  top: 50 + i * 40,
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 14,
                  background: i === 0 ? P.accentBg : "transparent",
                  borderRadius: 6,
                  padding: i === 0 ? "4px 8px" : 0,
                }}
              >
                <span style={{ fontWeight: 700, color: P.ink }}>{r.feature}</span>
                <span style={{ color: P.accent, fontWeight: 700 }}>
                  {r.repo} · {r.commit}
                </span>
              </div>
            ))}
            <Cursor x={STAGE_L + 12 + 40} y={150 + 58} opacity={clickShow} click={clickShow} />
            <CheckBadge x={STAGE_L + 12 + (STAGE_W - 24) - 40} y={150 + 58} size={30} opacity={clickShow} />
          </div>

          <div style={{ position: "absolute", left: STAGE_L - 12, top: 400, width: STAGE_W + 24, textAlign: "center" }}>
            <div style={{ fontSize: 90, fontWeight: 800, color: P.success, lineHeight: 1 }}>70–80%</div>
            <div style={{ marginTop: 12, fontSize: 19, fontWeight: 700, color: P.muted, textTransform: "uppercase", letterSpacing: 1.2 }}>
              less debugging &amp; context-switching time
            </div>
          </div>

          <StageFooter text="One click now finds it — no more seven-tab hunting" opacity={1} color={P.success} />
        </Group>
      </div>
    </PaletteProvider>
  );
};
