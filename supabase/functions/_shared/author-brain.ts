/**
 * Author brain — everything the blog writer is allowed to know about the owner:
 * personal_memory (who he is), feature_projects (what he built) and
 * brain_journal (dated entries of what happened, newest first).
 * Loaded once per blog post; nothing else reads it.
 */

// Patterns that look like credentials. A journal entry matching any of these is refused,
// and the loader masks them as a second line of defence.
const SECRET_PATTERNS: Array<[string, RegExp]> = [
  ['Anthropic key', /sk-ant-[A-Za-z0-9_-]{10,}/],
  ['OpenAI-style key', /\bsk-[A-Za-z0-9_-]{20,}/],
  ['GitHub token', /\b(ghp|gho|ghs|ghu|github_pat)_[A-Za-z0-9_]{20,}/],
  ['Google API key', /\bAIza[0-9A-Za-z_-]{30,}/],
  ['Cloudflare token', /\bcfut_[A-Za-z0-9_-]{20,}/],
  ['Telegram bot token', /\b\d{8,10}:[A-Za-z0-9_-]{35}\b/],
  ['JWT', /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/],
  ['Resend key', /\bre_[A-Za-z0-9]{20,}/],
  ['Slack token', /\bxox[abpr]-[A-Za-z0-9-]{10,}/],
  ['Private key', /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
  ['Password assignment', /(password|passwd|pwd|passord|пароль)\s*[:=]\s*\S{4,}/i],
  ['Long opaque token', /\b[A-Za-z0-9_+=]{40,}\b/],
]

/** Names of the secret kinds found in text (empty = clean). */
export function findSecrets(text: string): string[] {
  return SECRET_PATTERNS.filter(([, re]) => re.test(text)).map(([name]) => name)
}

function maskSecrets(text: string): string {
  let out = text
  for (const [, re] of SECRET_PATTERNS) out = out.replace(new RegExp(re.source, re.flags + 'g'), '[removed]')
  return out
}

// deno-lint-ignore no-explicit-any
export async function loadAuthorBrain(supabase: any, journalLimit = 150): Promise<string> {
  const [memRes, projRes, journalRes] = await Promise.all([
    supabase.from('personal_memory').select('title, content')
      .eq('is_active', true).eq('blog_visible', true).order('sort_order'),
    supabase.from('feature_projects').select('id, name_en, description_en').order('id'),
    supabase.from('brain_journal').select('entry_date, project_id, text')
      .order('entry_date', { ascending: false }).order('created_at', { ascending: false }).limit(journalLimit),
  ])

  const parts: string[] = []
  if (memRes.data?.length) {
    parts.push('## ABOUT THE AUTHOR\n' + memRes.data.map((m: { title: string; content: string }) => `### ${m.title}\n${m.content}`).join('\n\n'))
  }
  if (projRes.data?.length) {
    parts.push('## THE AUTHOR\'S PROJECTS (id — name: what it is)\n' + projRes.data
      .map((p: { id: string; name_en: string; description_en: string }) => `- ${p.id} — ${p.name_en}: ${p.description_en}`).join('\n'))
  }
  if (journalRes.data?.length) {
    parts.push('## JOURNAL — what actually happened, newest first\n' + journalRes.data
      .map((j: { entry_date: string; project_id: string | null; text: string }) => `- ${j.entry_date}${j.project_id ? ` [${j.project_id}]` : ''}: ${j.text}`).join('\n'))
  }
  if (memRes.error || projRes.error || journalRes.error) {
    console.warn('⚠️ author brain partial load:', memRes.error?.message, projRes.error?.message, journalRes.error?.message)
  }
  return maskSecrets(parts.join('\n\n'))
}
