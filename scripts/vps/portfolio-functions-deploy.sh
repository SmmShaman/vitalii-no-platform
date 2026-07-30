#!/usr/bin/env bash
# Pull-based deployer for the self-hosted portfolio Edge Functions (Contabo VPS).
#
# Closes the DEPLOY GAP from ~/RUNBOOK.md section 7: the self-hosted stack has no
# equivalent of `supabase functions deploy`, so a push touching supabase/functions/**
# never reaches the runtime until someone copies the files by hand.
#
# Pull-based on purpose: no VPS credentials have to live in GitHub Secrets.
# Driven by portfolio-functions-deploy.timer, runs as the `stuar` user (docker group).
# Idempotent — it deploys on content drift, not on commit ids, so a manually
# pulled clone or a half-finished hand copy still converges.
set -uo pipefail

CLONE=/home/stuar/Projects/vitalii_claude-code-in-browser
STACK=/home/stuar/supabase-portfolio
VOLUME="$STACK/volumes/functions"
LOG=/home/stuar/portfolio-functions-deploy.log

log() { printf '%s %s\n' "$(date -Is)" "$*" >>"$LOG"; }

cd "$CLONE" || { log "FATAL clone missing: $CLONE"; exit 1; }

git fetch --quiet origin main || log "WARN git fetch failed, continuing with local state"

local_head=$(git rev-parse HEAD)
remote_head=$(git rev-parse origin/main)

if [ "$local_head" != "$remote_head" ]; then
  # Fast-forward only, and never on top of local work: an agent may be mid-edit
  # in this clone. Refusing to pull is always safer than resolving a merge here.
  if git diff --quiet && git diff --cached --quiet \
     && git merge-base --is-ancestor "$local_head" "$remote_head"; then
    if git merge --ff-only --quiet origin/main; then
      log "pulled ${local_head:0:7} -> ${remote_head:0:7}"
    else
      log "ERROR ff-only merge failed"
    fi
  else
    log "SKIP pull: clone dirty or diverged (HEAD=${local_head:0:7} origin=${remote_head:0:7})"
  fi
fi

# No --delete: volumes/functions/main is the generic edge-runtime router, it lives
# only on the VPS and is not in the repo. Deleting it boot-errors the whole stack.
# -c compares by checksum, so this transfers on real content change only.
changed=$(rsync -rc --out-format='%n' --exclude='main/' \
  "$CLONE/supabase/functions/" "$VOLUME/")

if [ -z "$changed" ]; then
  exit 0
fi

log "synced: $(echo "$changed" | tr '\n' ' ')"

cd "$STACK" || { log "FATAL stack missing: $STACK"; exit 1; }
if docker compose -p portfolio restart functions >>"$LOG" 2>&1; then
  log "restarted functions"
else
  log "ERROR restart failed"
  exit 1
fi

sleep 8
log "container: $(docker ps --filter name=portfolio-edge-functions --format '{{.Status}}')"
