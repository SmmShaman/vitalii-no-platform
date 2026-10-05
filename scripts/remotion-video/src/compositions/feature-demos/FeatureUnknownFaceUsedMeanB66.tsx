/**
 * FeatureUnknownFaceUsedMeanB66 — feature b66 — 1280x720, 898 frames @ 30fps, VOICE-SYNCED.
 *
 * ART DIRECTION: archetype 6 "sidebar narrative", mood "sand" (both handed down
 * by the orchestrating session, not redrawn here). The fixed left column
 * (0-320px) is the ONE recurring element for the whole clip: a presence-gate
 * readout that climbs through the exact states the VO describes (an unknown
 * face with open access, the real child barely home, the gate asking who it
 * is), then flips at the fix to the two real numbers the clip ends on — the
 * stranger's four hours against the real child's one minute — with an
 * "ASKED EVERY TIME" stamp. The right stage (356-1220px) swaps content per
 * beat. Beat 4 slides in horizontally instead of crossfading.
 *
 * STEP 0c: beat 1 is the only UI beat — right after the product plate names
 * Boytasks, it plays a recording of the feature's own live page
 * (shots/b66.json, shot "page") as proof this shipped, the only verified
 * public URL for tonight's run (the features hub is not used — one
 * recording is enough). Beats 2-4 are metaphor / invisible-plumbing (a
 * side-by-side presence comparison, a decision flow through the worker, a
 * three-path outcome) and stay drawn per STEP 0c, since there is no
 * verified GitHub URL to record a real diff from tonight — the mechanism is
 * drawn instead, with the real names from commit 2bb664e
 * (workers/youtube-gate/index.js, the "Хто ти?" prompt from TvPage.tsx).
 * Beat 5 is the payoff — it does NOT replay the page or the features hub
 * (gate 2); it shows the product "running" in a LogWindow built from the
 * feature's own problem/result numbers, since this product keeps no public
 * runtime log on the VPS.
 *
 * Voice-synced beat table (narration windows, MEASURED — do not shift):
 *  b1  15-214  "A stranger could sit in front of our TV and watch free —
 *              because the system ignored faces it didn't know." — product
 *              plate, then LiveWindow of the real page.
 *  b2 223-325  "Meanwhile the one child it recognized was barely in the
 *              room." — drawn: two side-by-side cards, the unknown face
 *              looming large, the real child tiny. The clip's one analogy
 *              (two faces, same camera, two different outcomes).
 *  b3 334-517  "So now, in that Cloudflare Worker, any unrecognized face
 *              gets stopped and asked who it is." — drawn: camera -> known
 *              child? -> [NO] -> worker checks -> "Хто ти?" prompt, with the
 *              single tech-credibility chip, "Cloudflare Worker", and the
 *              real file name from the fix.
 *  b4 526-712  "It locks itself out like an unfinished kid, proves it's
 *              done with a PIN, or unlocks as a parent." — three parallel
 *              outcome cards. Slides in from the side (non-crossfade).
 *  b5 721-853  "That stranger sat there four hours; our own kid, just one
 *              minute." — LogWindow ("no public runtime log for this
 *              product" — lines built from the feature's own numbers),
 *              sidebar flips to the two real numbers, "ASKED EVERY TIME"
 *              stamp pops. Holds to 898, no fade-out.
 *
 * Persistent element: the sidebar presence-gate readout, alive frame 15 to
 * 898, never disappears, never static — word and color change across beats,
 * then becomes the clip's two real numbers.
 * Single tech-credibility caption: "Cloudflare Worker" (FilterChip, beat 3
 * only). Single analogy: the two-face comparison, beat 2 only.
 * Real data only: four hours and one minute are the feature's own numbers
 * from the 4 October incident; workers/youtube-gate/index.js and the
 * "Хто ти?" prompt are the feature's real file and real UI text — nothing
 * here invents a metric. Emoji are strictly single-codepoint: 📺 👤 🧒 🔒
 * 🔑 🧑 ✅ 📷 ❓ 🛡.
 */
import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider } from "./bright-theme";
import { LightBg, Panel, StatPill, FilterChip, IconCard, seg, fontFamily } from "./bright-primitives";
import { LiveWindow, LogWindow, Win } from "./live-primitives";
import shots from "./shots/b66.json";

const P = MOODS.sand;

const STAGE_X = 356;
const STAGE_W = 864;

const B1_S = 15, B1_E = 214;
const B2_S = 223, B2_E = 325;
const B3_S = 334, B3_E = 517;
const B4_S = 526, B4_E = 712;
const B5_S = 721, B5_E = 853;
const END = 898;
const FADE = 9;
const CROSS = 770; // the frame the sidebar flips from "ASKED" to the two real numbers

const WIN1: Win = { x: STAGE_X, y: 216, w: STAGE_W, h: 348 };
const WIN5: Win = { x: 372, y: 150, w: 820, h: 340 };

/** Stage caption — lives INSIDE the right stage, never under the sidebar. */
const StageCaption: React.FC<{ text: string; opacity: number; tone?: "ink" | "danger" | "accent" | "success" }> = ({
  text,
  opacity,
  tone = "ink",
}) => {
  if (opacity <= 0.004) return null;
  const color = tone === "danger" ? P.danger : tone === "accent" ? P.accent : tone === "success" ? P.success : P.ink;
  return (
    <div
      style={{
        position: "absolute",
        left: STAGE_X,
        top: 606,
        width: STAGE_W,
        textAlign: "center",
        fontSize: 22,
        fontWeight: 650,
        lineHeight: 1.3,
        color,
        opacity,
        fontFamily,
      }}
    >
      {text}
    </div>
  );
};

const StageHeading: React.FC<{ text: string; opacity: number }> = ({ text, opacity }) => {
  if (opacity <= 0.004) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: STAGE_X,
        top: 62,
        width: STAGE_W,
        fontSize: 29,
        fontWeight: 800,
        color: P.ink,
        opacity,
        letterSpacing: -0.2,
        fontFamily,
      }}
    >
      {text}
    </div>
  );
};

export const FeatureUnknownFaceUsedMeanB66: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  const b1 = seg(frame, B1_S, B1_S + FADE) * (1 - seg(frame, B1_E, B1_E + FADE));
  const b2 = seg(frame, B2_S, B2_S + FADE) * (1 - seg(frame, B2_E, B2_E + FADE));
  const b3 = seg(frame, B3_S, B3_S + FADE) * (1 - seg(frame, B3_E, B3_E + FADE));
  const b4 = seg(frame, B4_S, B4_S + FADE) * (1 - seg(frame, B4_E, B4_E + FADE));
  const b5 = seg(frame, B5_S, B5_S + FADE); // holds through the tail — no fade-out

  // ---- the sidebar readout: the one element that survives every beat ----
  const phase = frame < B2_S ? 1 : frame < B3_S ? 2 : frame < CROSS ? 3 : 4;
  const flipped = phase === 4;
  const phaseColor = phase === 1 ? P.danger : P.accent;
  const barFill = interpolate(frame, [CROSS, CROSS + 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const stampPop = frame < CROSS + 10 ? 0 : spring({ frame: frame - (CROSS + 10), fps, config: { damping: 10, mass: 0.7 } });
  const phaseStart = phase === 1 ? 15 : phase === 2 ? B2_S : phase === 3 ? B3_S : CROSS;
  const swapScale = Math.min(1, 0.85 + 0.15 * pop(phaseStart));

  // ---- beat 1 : product plate, then the real page ----
  const plateIn = seg(frame, B1_S + 4, B1_S + 20);
  const liveZoom = (t: number) => 1 + 0.08 * t;

  // ---- beat 2 : two faces, same camera, two outcomes (the one analogy) ----
  const cardIn = (i: number) => seg(frame, B2_S + 10 + i * 24, B2_S + 24 + i * 24);

  // ---- beat 3 : camera -> known child? -> worker -> prompt ----
  const nodeIn = (i: number) => seg(frame, B3_S + 14 + i * 36, B3_S + 28 + i * 36);
  const arrow1 = interpolate(frame, [B3_S + 18, B3_S + 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const arrow2 = interpolate(frame, [B3_S + 58, B3_S + 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const arrow3 = interpolate(frame, [B3_S + 98, B3_S + 130], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const chipPop = pop(B3_S + 40);

  // ---- beat 4 : slide-in (the non-crossfade transition) + three outcomes ----
  const b4dx = interpolate(frame, [B4_S, B4_S + 30], [80, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const pathIn = (i: number) => seg(frame, B4_S + 16 + i * 30, B4_S + 32 + i * 30);

  return (
    <PaletteProvider value={P}>
      <div style={{ position: "absolute", inset: 0, fontFamily }}>
        <LightBg />

        {/* ================= persistent sidebar (archetype 6) ================= */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 320,
            height: 720,
            background: P.card,
            borderRight: `2px solid ${P.border}`,
            opacity: seg(frame, 0, 15),
          }}
        >
          <div style={{ position: "absolute", left: 32, top: 44, fontSize: 14, fontWeight: 800, letterSpacing: 2, color: P.muted }}>
            TV ACCESS GATE
          </div>
          <div
            style={{
              position: "absolute",
              left: 32,
              top: 74,
              padding: "6px 14px",
              borderRadius: 999,
              background: P.chipBg,
              border: `1.5px solid ${P.border}`,
              fontSize: 15,
              fontWeight: 700,
              color: P.muted,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span>📷</span> on-screen face check
          </div>

          {!flipped ? (
            <>
              <div
                style={{
                  position: "absolute",
                  left: 32,
                  top: 210,
                  fontSize: 52,
                  fontWeight: 800,
                  letterSpacing: -0.5,
                  color: phaseColor,
                  lineHeight: 1.05,
                  whiteSpace: "pre-line",
                  transform: `scale(${swapScale})`,
                  transformOrigin: "left center",
                }}
              >
                {phase === 1 ? "UNKNOWN" : phase === 2 ? "CHILD" : "ASKED"}
              </div>
              <div style={{ position: "absolute", left: 34, top: 300, width: 250, fontSize: 15.5, fontWeight: 700, letterSpacing: 1, color: P.muted, lineHeight: 1.35 }}>
                {phase === 1 ? "FACE NOT RECOGNIZED" : phase === 2 ? "RECOGNIZED, BARELY HOME" : "“ХТО ТИ?”"}
              </div>
            </>
          ) : (
            <div style={{ position: "absolute", left: 32, top: 196, width: 258 }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: P.muted }}>UNKNOWN FACE</span>
                <span style={{ fontSize: 46, fontWeight: 800, color: P.danger, fontVariantNumeric: "tabular-nums" }}>4H</span>
              </div>
              <div style={{ height: 14 }} />
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: P.muted }}>REAL CHILD</span>
                <span style={{ fontSize: 46, fontWeight: 800, color: P.success, fontVariantNumeric: "tabular-nums" }}>1M</span>
              </div>
            </div>
          )}

          <div style={{ position: "absolute", left: 32, top: 410, width: 256, height: 10, borderRadius: 6, background: P.chipBg, overflow: "hidden" }}>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: `${barFill * 100}%`,
                borderRadius: 6,
                background: P.success,
              }}
            />
          </div>
          <div style={{ position: "absolute", left: 32, top: 430, fontSize: 13, fontWeight: 700, letterSpacing: 1, color: P.muted }}>
            GATE ASKS EVERY FACE
          </div>

          {stampPop > 0.02 ? (
            <div
              style={{
                position: "absolute",
                left: 32,
                top: 490,
                padding: "10px 18px",
                borderRadius: 12,
                background: P.successBg,
                border: `2px solid ${P.successEdge}`,
                color: P.success,
                fontWeight: 800,
                fontSize: 18,
                transform: `scale(${Math.min(1, stampPop)}) rotate(-3deg)`,
                transformOrigin: "left center",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              ✅ ASKED EVERY TIME
            </div>
          ) : null}
        </div>

        {/* ================= beat 1 : the product, then the real page ================= */}
        <StageHeading text="A stranger could sit and watch — free." opacity={b1} />
        <div
          style={{
            position: "absolute",
            left: STAGE_X,
            top: 106,
            width: 440,
            padding: "12px 18px",
            borderRadius: 14,
            background: P.card,
            border: `1.5px solid ${P.border}`,
            boxShadow: "0 8px 22px rgba(42,32,24,0.10)",
            opacity: b1 * plateIn,
            transform: `translateY(${(1 - plateIn) * 10}px)`,
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 800, color: P.ink }}>Boytasks — a family screen-time gate</div>
          <div style={{ marginTop: 4, fontSize: 11.5, lineHeight: 1.35, color: P.muted, fontWeight: 550 }}>
            A screen-time and task system for three kids: YouTube unlocks only after today's
            school and chore tasks are done.
          </div>
        </div>
        <StatPill x={STAGE_X + 470} y={122} emoji="👤" text="unknown face, no questions asked" tone="danger" opacity={b1} />
        <LiveWindow
          file={shots as any}
          shot="page"
          title="vitalii.no/features/…-b66"
          win={WIN1}
          from={B1_S}
          hold={B1_E - B1_S}
          zoom={liveZoom}
          focus={{ x: 0.5, y: 0.3 }}
          opacity={b1}
        />
        <StageCaption text="Proof it's real — but any face could sit there free" opacity={b1} tone="danger" />

        {/* ================= beat 2 : two faces, one camera, two outcomes ================= */}
        <StageHeading text="Meanwhile the real child barely showed up." opacity={b2} />
        <Panel x={STAGE_X} y={150} w={410} h={240} tone="danger" opacity={b2 * cardIn(0)}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              transform: `translateY(${(1 - cardIn(0)) * 14}px)`,
            }}
          >
            <div style={{ fontSize: 48 }}>👤</div>
            <div style={{ fontSize: 19, fontWeight: 800, color: P.ink }}>UNKNOWN FACE</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: P.danger }}>on screen, uncounted</div>
          </div>
        </Panel>
        <Panel x={STAGE_X + 454} y={150} w={410} h={240} tone="card" opacity={b2 * cardIn(1)}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              transform: `translateY(${(1 - cardIn(1)) * 14}px)`,
            }}
          >
            <div style={{ fontSize: 30 }}>🧒</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: P.ink }}>REAL CHILD</div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: P.muted }}>barely in the room</div>
          </div>
        </Panel>
        <StatPill x={STAGE_X + STAGE_W / 2 - 150} y={420} emoji="📺" text="same TV, same camera, two faces" tone="accent" opacity={b2} />
        <StageCaption text="The gate only ever reacted to faces it already knew" opacity={b2} tone="danger" />

        {/* ================= beat 3 : camera -> known child? -> worker -> prompt ================= */}
        <StageHeading text="So the Worker stops every face it doesn't know." opacity={b3} />
        <Panel x={STAGE_X} y={210} w={160} h={190} tone="card" opacity={b3 * Math.min(1, nodeIn(0))}>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <div style={{ fontSize: 34 }}>📷</div>
            <div style={{ fontSize: 13.5, fontWeight: 800, color: P.ink, textAlign: "center" }}>camera sees a face</div>
            <div style={{ fontSize: 10.5, fontWeight: 600, color: P.muted }}>live snapshot</div>
          </div>
        </Panel>
        <div style={{ position: "absolute", left: STAGE_X + 170, top: 295, width: 76, height: 7, borderRadius: 4, background: P.accent, opacity: b3 * arrow1 }} />
        <Panel x={STAGE_X + 262} y={210} w={210} h={190} tone="card" opacity={b3 * Math.min(1, nodeIn(1))}>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <div style={{ fontSize: 34 }}>❓</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: P.ink, textAlign: "center" }}>known child?</div>
            <div style={{ fontSize: 10.5, fontWeight: 600, color: P.muted, textAlign: "center" }}>checked against saved faces</div>
          </div>
        </Panel>
        <div style={{ position: "absolute", left: STAGE_X + 472, top: 272, width: 76, textAlign: "center", fontSize: 11, fontWeight: 800, color: P.danger, opacity: b3 * arrow2 }}>
          NO
        </div>
        <div style={{ position: "absolute", left: STAGE_X + 472, top: 295, width: 76, height: 7, borderRadius: 4, background: P.danger, opacity: b3 * arrow2 }} />
        <FilterChip x={STAGE_X + 562} y={178} text="Cloudflare Worker" icon="🛡" color={P.accent} scale={Math.min(1, chipPop)} opacity={b3 * Math.min(1, chipPop)} />
        <Panel x={STAGE_X + 548} y={210} w={160} h={190} tone="accent" opacity={b3 * Math.min(1, nodeIn(2))}>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <div style={{ fontSize: 34 }}>🛡</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: P.ink, textAlign: "center" }}>Worker checks</div>
            <div style={{ fontSize: 10.5, fontWeight: 600, color: P.muted, fontFamily: "monospace" }}>index.js</div>
          </div>
        </Panel>
        <div style={{ position: "absolute", left: STAGE_X + 718, top: 295, width: 76, height: 7, borderRadius: 4, background: P.accent, opacity: b3 * arrow3 }} />
        <Panel x={STAGE_X + 710} y={210} w={154} h={190} tone="danger" opacity={b3 * Math.min(1, nodeIn(3))}>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, transform: `scale(${Math.min(1, nodeIn(3))})` }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: P.ink, textAlign: "center" }}>&quot;Хто ти?&quot;</div>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: P.danger, textAlign: "center" }}>asks who it is</div>
          </div>
        </Panel>
        <StageCaption text="A Cloudflare Worker checks every face before it unlocks anything" opacity={b3} tone="accent" />

        {/* ================= beat 4 : three outcomes (slide-in, no crossfade) ================= */}
        <div style={{ position: "absolute", inset: 0, opacity: b4, transform: `translateX(${b4dx}px)` }}>
          <StageHeading text="Then it chooses one of three ways out." opacity={1} />
          <IconCard x={STAGE_X + 40} y={200} w={200} emoji="🔒" title="Unfinished kid" sub="stays locked, like normal" tone="danger" opacity={Math.min(1, pathIn(0))} scale={Math.min(1, pathIn(0))} />
          <IconCard x={STAGE_X + 332} y={200} w={200} emoji="🔑" title="Finished kid" sub="confirms with a PIN" tone="accent" opacity={Math.min(1, pathIn(1))} scale={Math.min(1, pathIn(1))} />
          <IconCard x={STAGE_X + 624} y={200} w={200} emoji="🧑" title="Parent" sub="unlocks with the parent code" tone="success" opacity={Math.min(1, pathIn(2))} scale={Math.min(1, pathIn(2))} />
          <StatPill x={STAGE_X + STAGE_W / 2 - 130} y={440} emoji="✅" text="three paths, one gate" tone="accent" opacity={Math.min(1, pathIn(2))} />
          <StageCaption text="No face gets a free pass anymore" opacity={1} tone="accent" />
        </div>

        {/* ================= beat 5 : the product "running" + the real numbers ================= */}
        <LogWindow
          win={WIN5}
          title="youtube-gate · presence check"
          from={B5_S + 12}
          every={20}
          fontSize={20}
          opacity={b5}
          lines={[
            { t: "camera", text: "unknown face detected in frame", tone: "muted" },
            { t: "gate", text: "checking against known children…", tone: "muted" },
            { t: "gate", text: "no match — treated as unknown", tone: "accent" },
            { t: "today", text: "unknown face on screen: 4h 00m", tone: "danger" },
            { t: "today", text: "recognized child on screen: 1m", tone: "muted" },
            { t: "gate", text: 'prompting: "Хто ти?"', tone: "accent" },
            { t: "result", text: "✅ every face now has to answer", tone: "success" },
          ]}
        />
        <div
          style={{
            position: "absolute",
            left: WIN5.x + 24,
            top: WIN5.y + WIN5.h - 66,
            padding: "12px 20px",
            borderRadius: 14,
            background: "rgba(255,255,255,0.96)",
            border: `1.5px solid ${P.successEdge}`,
            boxShadow: "0 14px 34px rgba(42,32,24,0.16)",
            opacity: b5 * barFill,
            transform: `translateY(${(1 - barFill) * 14}px)`,
            fontSize: 18,
            fontWeight: 800,
            color: P.success,
          }}
        >
          Four hours of free TV — now it has to answer first
        </div>
        <StageCaption text="Only a known face, a PIN, or a parent gets through" opacity={b5} tone="success" />
      </div>
    </PaletteProvider>
  );
};
