/**
 * Humanizer Anti-AI Writing Rules — shared across all LLM text generation functions.
 *
 * Based on Wikipedia "Signs of AI writing" (WikiProject AI Cleanup, 29 patterns)
 * and blader/humanizer SKILL.md v2.5.1.
 *
 * 4 context-adapted rule sets + 3 voice guidelines.
 * Node.js mirror: scripts/video-processor/humanizer-rules.js (keep in sync)
 */

// ─── RULE SETS ──────────────────────────────────────────────────────────────────

export const HUMANIZER_SOCIAL = `
ANTI-AI WRITING RULES (CRITICAL — apply to ALL platforms):
Your output must read like a real person wrote it, not an AI. Eliminate every one of these patterns:

1. NO inflated significance: never use "testament to", "pivotal moment", "evolving landscape", "vital role", "indelible mark", "setting the stage", "key turning point".
2. NO notability emphasis: do not list media outlets or claim "active presence" — cite specific facts instead.
3. NO -ing tacking: never end clauses with "highlighting...", "underscoring...", "ensuring...", "reflecting...", "contributing to...", "fostering...", "showcasing...".
4. NO promotional fluff: never use "groundbreaking", "vibrant", "stunning", "breathtaking", "nestled", "in the heart of", "renowned".
5. NO vague attributions: never write "Experts believe", "Industry observers note" — name the source or drop the claim.
6. NO challenges/prospects boilerplate: never write "Despite challenges... continues to thrive" or "Future Outlook" sections.
7. NO copula avoidance: use "is/are/has" instead of "serves as", "stands as", "represents", "marks", "boasts", "features".
8. NO negative parallelisms: never write "It's not just X; it's Y" or "Not only X but also Y".
9. NO rule of three: do not force ideas into groups of three for rhetorical effect.
10. NO synonym cycling: do not rotate synonyms for the same concept across sentences.
11. NO false ranges: do not use "from X to Y" where X and Y are not on a real scale.
12. NO passive voice when actor is known: prefer active constructions.
13. NO em dash overuse: maximum one per post. Use commas or periods instead.
14. NO markdown formatting: social platforms render *, **, _, __, #, \` as raw characters. NEVER use them. For emphasis use «guillemets» around quotes, ALL CAPS for 1-2 key terms (sparingly), or line breaks to separate ideas.
15. NO AI vocabulary: avoid "delve", "crucial", "enhance", "foster", "garner", "intricate", "tapestry", "underscore", "pivotal", "landscape" (abstract), "interplay", "additionally", "furthermore".
16. NO title case in headings: use sentence case.
17. NO sycophantic artifacts: never write "Great question!", "I hope this helps", "Let me know if...".
18. NO knowledge cutoff disclaimers: never write "as of", "based on available information", "while details are limited".
19. NO signposting: never write "Let's dive in", "Here's what you need to know", "Let's break this down".
20. NO filler phrases: cut "In order to", "Due to the fact that", "It is important to note that", "At this point in time".
21. NO excessive hedging: do not write "could potentially", "it might be argued that".
22. NO generic conclusions: never end with "the future looks bright", "exciting times lie ahead", "continues to thrive".
23. NO persuasive authority tropes: avoid "The real question is", "What really matters", "fundamentally", "at its core".
24. NO fragmented headers: do not follow a heading with a one-liner that restates it.
25. NO hyphenated-word overuse: vary naturally — do not consistently hyphenate common compounds.
26. NO emoji-as-structure: never use "rocket Launch", "bulb Insight", "check Next Steps" patterns.

FINAL CHECK: Before outputting, re-read and ask "What makes this obviously AI-generated?" Fix remaining tells.`

export const HUMANIZER_VIDEO = `
ANTI-AI SPEECH RULES (CRITICAL — this text will be read aloud):
Your output must sound like a real person speaking, not an AI script. Eliminate these patterns:

1. NO inflated significance: never say "testament to", "pivotal moment", "evolving landscape", "vital role", "key turning point".
2. NO -ing tacking: never end clauses with "highlighting...", "underscoring...", "ensuring...", "reflecting...", "showcasing...".
3. NO promotional fluff: never say "groundbreaking", "vibrant", "stunning", "breathtaking", "renowned".
4. NO vague attributions: never say "Experts believe" or "Industry observers note" — name the source or drop the claim.
5. NO copula avoidance: say "is/are/has" instead of "serves as", "stands as", "represents", "marks".
6. NO negative parallelisms: never say "It's not just X; it's Y".
7. NO rule of three: do not force ideas into groups of three.
8. NO synonym cycling: do not rotate synonyms across sentences.
9. NO false ranges: do not use "from X to Y" where X and Y are not on a real scale.
10. NO AI vocabulary: avoid "delve", "crucial", "enhance", "foster", "intricate", "tapestry", "underscore", "pivotal", "landscape" (abstract), "interplay".
11. NO signposting: never say "Let's dive in", "Here's what you need to know".
12. NO filler phrases: cut "In order to", "Due to the fact that", "It is important to note".
13. NO excessive hedging: do not say "could potentially", "it might be argued that".
14. NO generic conclusions: never end with "the future looks bright", "exciting times lie ahead".
15. NO persuasive authority tropes: avoid "The real question is", "What really matters", "fundamentally".
16. NO sycophantic tone: never say "Great question!", "I hope this helps".
17. NO knowledge disclaimers: never say "as of", "based on available information".
18. Sentences must be speakable in one breath — under 25 words each.
19. NO parenthetical asides — listeners cannot "hear" parentheses.
20. Avoid tongue-twisters and alliteration clusters.

FINAL CHECK: Read your text aloud in your head. Does it sound like a person talking? Fix anything that sounds robotic.`

export const HUMANIZER_ARTICLE = `
ANTI-AI WRITING RULES (apply to all output languages):
Your output must read like professional journalism, not AI-generated text. Eliminate these patterns:

1. NO inflated significance: never use "testament to", "pivotal moment", "evolving landscape", "vital role", "indelible mark", "setting the stage".
2. NO -ing tacking: never end clauses with "highlighting...", "underscoring...", "ensuring...", "reflecting...", "showcasing...".
3. NO promotional language: never use "groundbreaking", "vibrant", "stunning", "breathtaking", "nestled", "in the heart of", "renowned".
4. NO vague attributions: never write "Experts believe", "Industry observers note" — name the source or drop the claim.
5. NO challenges/prospects boilerplate: never write "Despite challenges... continues to thrive".
6. NO copula avoidance: use "is/are/has" instead of "serves as", "stands as", "represents", "marks", "boasts".
7. NO negative parallelisms: never write "It's not just X; it's Y".
8. NO rule of three: do not force ideas into groups of three.
9. NO synonym cycling: do not rotate synonyms for the same concept.
10. NO false ranges: do not use "from X to Y" where X and Y are not on a real scale.
11. NO AI vocabulary: avoid "delve", "crucial", "enhance", "foster", "garner", "intricate", "tapestry", "underscore", "pivotal", "landscape" (abstract), "interplay", "additionally".
12. NO passive voice when actor is known: prefer active constructions.
13. NO em dash overuse: use commas or periods instead. Maximum one per paragraph.
14. NO signposting: never write "Let's explore", "Here's what you need to know".
15. NO filler phrases: cut "In order to", "Due to the fact that", "It is important to note".
16. NO excessive hedging: do not write "could potentially", "it might be argued that".
17. NO generic conclusions: never end with "the future looks bright", "exciting times lie ahead".
18. NO persuasive authority tropes: avoid "The real question is", "What really matters", "fundamentally".
19. NO sycophantic artifacts: never write "Great question!", "I hope this helps".
20. NO knowledge disclaimers: never write "as of", "based on available information".
21. NO fragmented headers: do not follow a heading with a one-liner that restates it.
22. NO hyphenated-word overuse: vary naturally.

FINAL CHECK: Re-read your output. If any sentence could appear in a generic AI article about any topic, rewrite it with specific facts.`

export const HUMANIZER_PORTFOLIO = `
ANTI-AI WRITING RULES (for technical case studies):
Your output must read like a real developer documenting their work, not AI-generated marketing. Eliminate these patterns:

1. NO inflated significance: never use "testament to", "pivotal moment", "evolving landscape", "vital role", "key turning point".
2. NO -ing tacking: never end clauses with "highlighting...", "underscoring...", "ensuring...", "reflecting...", "showcasing...".
3. NO promotional fluff: never use "groundbreaking", "vibrant", "stunning", "cutting-edge", "state-of-the-art", "revolutionary".
4. NO copula avoidance: use "is/are/has" instead of "serves as", "stands as", "represents", "marks".
5. NO negative parallelisms: never write "It's not just X; it's Y".
6. NO rule of three: do not force ideas into groups of three.
7. NO synonym cycling: do not rotate synonyms across sentences.
8. NO AI vocabulary: avoid "delve", "crucial", "enhance", "foster", "intricate", "tapestry", "underscore", "pivotal", "landscape" (abstract), "interplay", "seamless".
9. NO passive voice when actor is known: use "I built" not "was built".
10. NO signposting: never write "Let's dive in", "Here's what you need to know".
11. NO filler phrases: cut "In order to", "It is important to note".
12. NO excessive hedging: do not write "could potentially", "it might be argued".
13. NO generic conclusions: never end with "the future looks bright", "continues to thrive".
14. NO persuasive authority tropes: avoid "The real question is", "What really matters".
15. NO vague metrics: never write "improved performance" — use real numbers.
16. NO marketing speak: never write "empowering", "unlocking potential", "transformative".
17. Be specific: use real function names, file paths, and measurable numbers.
18. First person encouraged: "I built", "I noticed", "I decided".

FINAL CHECK: Does every claim have a specific fact behind it? Rewrite anything that sounds like a press release.`

// ─── VOICE GUIDELINES ───────────────────────────────────────────────────────────

export const VOICE_SOCIAL = `
VOICE GUIDELINES:
- Write like a real dev talking to peers, not a press release.
- Vary sentence length: short punchy ones mixed with longer ones.
- Have opinions. React to your own work honestly.
- Use "I" naturally. First person is honest, not unprofessional.
- Be specific: real function names, real numbers, real file paths.
- Let some imperfection in. Perfect structure feels algorithmic.
- Acknowledge complexity: "This works but I'm still not happy with the retry logic" is human.`

export const VOICE_JOURNALISM = `
VOICE GUIDELINES:
- Write like a professional journalist: clear, direct, factual.
- Vary sentence length and structure naturally.
- Lead with the most important information (inverted pyramid).
- Use specific facts, names, and numbers — not vague claims.
- Each paragraph should contain one main idea.
- Avoid editorializing unless it is an opinion piece.`

/**
 * News-rewrite discipline: the rules that stop a news rewrite from reading like
 * an LLM wrote it. Diagnosed on real published output (2026-07-26) — the tells
 * cluster in the LAST sentence, where the model "lands the plane" by inventing
 * an assessment, an outlook, or a class of sources the article never had
 * ("Legal experts anticipate…" when the source said "Deadline noted…").
 *
 * Kept separate from HUMANIZER_ARTICLE because it is news-specific: it assumes
 * there IS a source text to be faithful to. Do not add it to blog/voice paths.
 */
export const NEWS_SOURCE_DISCIPLINE = `
HOW THE ARTICLE MUST END — MOST IMPORTANT RULE:
- End on the last concrete fact taken from the source. Then stop.
- FORBIDDEN as a final sentence: any assessment, outlook, significance, "what this means", a restatement of the opening, or any sentence that carries no new fact from the source. Never write things like "the company remains a high-profile player", "the case could reshape the industry", "the deal has not closed, but...".
- If the source ends abruptly, the article ends abruptly. An abrupt ending is correct. A tidy landing is a failure.
- Before you output, delete your last sentence and check whether a fact was lost. If nothing was lost, leave it deleted.

ATTRIBUTION:
- Attribute every claim exactly as the source attributes it, naming the same party. If the source does not name who said it, do not invent a who.
- NEVER write "experts", "analysts", "observers", "critics", "industry watchers", "legal experts", "many believe", "it is expected", "is seen as", "is likely to" — or the same move rephrased in Norwegian or Ukrainian.
- Check every name, number and pronoun against the source before using it. Never move a fact from one company or person to another.

SOURCE FIDELITY — THIS OVERRIDES EVERY OTHER INSTRUCTION:
- Write ONLY what the source text supports. NEVER add a fact, number, date, name, quote, funding round, investor, company history, regulatory detail or official reaction that is not in the source. Inventing a plausible-sounding detail about a real company is the worst failure possible — worse than a short article.
- If the source does not say why something matters, do not invent a reason. Leave it out.
- Ignore navigation text, newsletter pitches, ads, "Related" and "Latest in" blocks that arrived with the source — they are not part of the story.
- BANNED filler — never write these or their equivalents in any language: "this could revolutionise", "it remains to be seen", "in the coming years", "experts believe", "this has significant implications", "as the project progresses", "we can expect to see", "the potential to transform", "a key player".

HOW IT MUST SOUND:
- Vary sentence length. Mix short blunt sentences with longer ones. Never let three sentences in a row share the same shape or length.
- Vary paragraph length too — some two sentences, some five. Uniform paragraphs read as machine output.
- Direct verbs, not nominalisations: "Warner Bros. sued Amazon", not "initiated legal action against".
- Use contractions in English where they read naturally. In Norwegian and Ukrainian use ordinary journalistic word order, not bureaucratic register.
- State definite facts definitely. No "could", "may", "appears to", "seemingly" unless the source itself hedges.
- No connector openers: Meanwhile, Moreover, Furthermore, Additionally, Notably, Overall (NO: Videre, Dessuten, Samtidig, I tillegg; UA: Крім того, Водночас, Загалом, Варто зазначити).
- Do not explain the obvious. The reader knows what a lawsuit, an IPO or a funding round is.
- At most one em dash per paragraph. Never force ideas into groups of three.`

export const VOICE_SPOKEN = `
VOICE GUIDELINES:
- Write for the ear, not the eye. Short, clear sentences.
- Vary rhythm: mix short statements with slightly longer ones.
- Use natural conversational flow — not a teleprompter cadence.
- Prefer common words over technical jargon.
- Each sentence should express one clear idea.
- Sound like a person telling a story, not reading a report.`

// ─── HELPER ─────────────────────────────────────────────────────────────────────

const RULE_MAP: Record<string, string> = {
  social: HUMANIZER_SOCIAL + '\n' + VOICE_SOCIAL,
  video: HUMANIZER_VIDEO + '\n' + VOICE_SPOKEN,
  article: HUMANIZER_ARTICLE + '\n' + VOICE_JOURNALISM,
  portfolio: HUMANIZER_PORTFOLIO + '\n' + VOICE_SOCIAL,
}

/**
 * Inject humanizer rules into an existing prompt.
 * Rules are inserted before the last "Return ONLY" or "Return JSON" instruction if present,
 * otherwise appended at the end.
 */
export function withHumanizer(
  prompt: string,
  context: 'social' | 'video' | 'article' | 'portfolio',
): string {
  const rules = RULE_MAP[context]
  const returnIdx = prompt.lastIndexOf('Return ONLY')
  if (returnIdx > 0) {
    return prompt.slice(0, returnIdx) + '\n' + rules + '\n\n' + prompt.slice(returnIdx)
  }
  return prompt + '\n' + rules
}
