#!/usr/bin/env bash
# Append one entry to the author brain journal (portfolio DB, table brain_journal).
# The blog writer reads it when a /blog post is made. Installed as /usr/local/bin/brain-add.
#
#   echo "what happened, 1-3 plain sentences" | brain-add <project_id|-> [YYYY-MM-DD]
#   from the PC:  echo "..." | ssh -i ~/.ssh/contabo_vps root@173.249.31.179 brain-add portfolio
#
# Refuses anything that looks like a credential. project_id = feature_projects.id or "-".
set -euo pipefail

project="${1:--}"
day="${2:-$(date +%F)}"
text="$(cat)"

[[ -n "${text// }" ]] || { echo "brain-add: empty text on stdin" >&2; exit 1; }
[[ "$day" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]] || { echo "brain-add: bad date $day" >&2; exit 1; }

# Same patterns as supabase/functions/_shared/author-brain.ts
if grep -qiP 'sk-ant-[A-Za-z0-9_-]{10,}|\bsk-[A-Za-z0-9_-]{20,}|\b(ghp|gho|ghs|ghu|github_pat)_[A-Za-z0-9_]{20,}|\bAIza[0-9A-Za-z_-]{30,}|\bcfut_[A-Za-z0-9_-]{20,}|\b\d{8,10}:[A-Za-z0-9_-]{35}\b|\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.|\bre_[A-Za-z0-9]{20,}|\bxox[abpr]-|-----BEGIN [A-Z ]*PRIVATE KEY|(password|passwd|pwd|passord|пароль)\s*[:=]\s*\S{4,}|\b[A-Za-z0-9_+=]{40,}\b' <<<"$text"; then
  echo "brain-add: refused — the text looks like it contains a secret" >&2
  exit 2
fi

proj_sql="NULL"
[[ "$project" != "-" ]] && proj_sql=":'p'"

# psql interpolates :'var' only in SQL read from stdin, not in -c
docker exec -i portfolio-db psql -U postgres -v ON_ERROR_STOP=1 -q \
  -v t="$text" -v p="$project" -v d="$day" \
  <<<"INSERT INTO brain_journal (entry_date, project_id, text, source) VALUES (:'d'::date, ${proj_sql}, :'t', 'claude-code');" \
  && echo "brain-add: saved ($day, $project)"
