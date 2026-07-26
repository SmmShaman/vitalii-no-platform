/**
 * Small text-cleaning helpers for values extracted from AI (Gemini/Groq) JSON
 * responses before they get written to the DB. Gemini sometimes wraps array
 * items (tags) or short strings (category) in stray literal quote characters
 * even inside an already-parsed JSON string value — e.g. `"'Tech'"` instead
 * of `"Tech"`. Strip those before storage so the frontend never has to.
 */

/**
 * Strip wrapping single/double quotes and surrounding whitespace from a
 * single tag/category value.
 */
export function cleanTagText(value: string): string {
  return value.trim().replace(/^['"]+|['"]+$/g, '').trim()
}

/**
 * Apply cleanTagText to every string in a tags array, dropping anything that
 * becomes empty after cleaning.
 */
export function cleanTagsArray(tags: string[]): string[] {
  return tags
    .map((tag) => cleanTagText(String(tag)))
    .filter((tag) => tag.length > 0)
}
