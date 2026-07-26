/**
 * Strips leaking markdown syntax from copy that is displayed as plain text
 * (e.g. the About card typing effect). Only touches characters that are
 * actual markdown syntax (`**`, `→`, `---`) — plain unicode bullets like
 * `•` are left untouched since they already read fine as plain text.
 */
export const stripMarkdown = (text: string): string => {
  return text
    .replace(/\*\*/g, '')
    .replace(/^---$/gm, '')
    .replace(/^→ ?/gm, '• ')
    .replace(/\n{3,}/g, '\n\n');
};
