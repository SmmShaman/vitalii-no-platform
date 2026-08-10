/**
 * Relevance gate for stock and web imagery.
 *
 * Stock search answers a query, not a story: "Starlink satellite constellation"
 * returned a graffiti wall for the 09.08 digest because the wall photo carried a
 * bright streak. The image APIs hand us a description (Pexels `alt`, search
 * result titles) — this module checks that description against what the story is
 * actually about before the picture is allowed on screen.
 *
 * The article's OWN photos never pass through here: they are the story by
 * definition, whatever their caption says.
 */

// Short words carry no topic. Norwegian + English function words are dropped
// even when long enough to survive the length filter.
const STOPWORDS = new Set([
  'this', 'that', 'with', 'from', 'have', 'been', 'will', 'they', 'them', 'their',
  'about', 'after', 'before', 'other', 'more', 'most', 'than', 'then', 'when',
  'what', 'which', 'while', 'into', 'over', 'under', 'also', 'said', 'says',
  'dette', 'denne', 'disse', 'etter', 'eller', 'ikke', 'men', 'som', 'skal',
  'kan', 'har', 'ble', 'blir', 'være', 'vært', 'sier', 'ifølge', 'mens', 'både',
  'deretter', 'selskapet', 'selskapene', 'norge', 'norsk', 'norske',
  'ganger', 'flere', 'mange', 'store', 'stor', 'nytt', 'nye',
]);

function tokenize(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
    .split(/[\s-]+/)
    .filter(w => w.length >= 4 && !STOPWORDS.has(w));
}

/**
 * What this story is about: headline words plus the researched entities.
 * Entity names are the strongest signal, so they are kept whole AND split.
 */
export function buildKeywordSet(headline, factSheet, extraQueries = []) {
  const words = new Set(tokenize(headline));

  for (const q of extraQueries) {
    for (const w of tokenize(q)) words.add(w);
  }

  if (factSheet) {
    for (const person of factSheet.who || []) {
      for (const w of tokenize(person.name)) words.add(w);
      for (const w of tokenize(person.role)) words.add(w);
    }
    for (const w of tokenize(factSheet.where?.place)) words.add(w);
    for (const w of tokenize(factSheet.where?.country)) words.add(w);
    for (const n of factSheet.numbers || []) {
      for (const w of tokenize(n.label)) words.add(w);
    }
    for (const w of tokenize(factSheet.what)) words.add(w);
  }

  return words;
}

/**
 * Does this image's own description talk about the same thing?
 * A single shared topic word is enough — descriptions are short, and demanding
 * more would reject usable illustrations.
 */
export function describesSameTopic(description, keywords) {
  if (!description || keywords.size === 0) return false;
  for (const w of tokenize(description)) {
    if (keywords.has(w)) return true;
  }
  return false;
}

/**
 * Apply the gate to candidates that carry a description.
 *
 * Never starves a segment: if the gate leaves fewer than `minKeep`, the
 * best-ranked rejects come back, because a loosely-related photo still beats a
 * segment stuck on one image. Returns { kept, rejected } for logging.
 */
export function filterByRelevance(candidates, keywords, minKeep = 2) {
  const kept = [];
  const rejected = [];

  for (const c of candidates) {
    if (describesSameTopic(c.description, keywords)) kept.push(c);
    else rejected.push(c);
  }

  while (kept.length < minKeep && rejected.length > 0) {
    kept.push(rejected.shift());
  }

  return { kept, rejected };
}
