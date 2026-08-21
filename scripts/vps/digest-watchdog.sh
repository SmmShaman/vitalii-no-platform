#!/usr/bin/env bash
# Digest watchdog — re-triggers the daily-video pipeline when yesterday's draft
# is stuck. Runs on the VPS from digest-watchdog.timer (every 30 min).
#
# Why: the LLM cascade can exhaust all free quotas at once (NVIDIA 503 +
# Gemini 429 + Groq TPM/TPD). auto_chain then fails once and nothing retries,
# although the same models work again an hour later (incidents 2026-08-18 and
# 2026-08-21). This script is that missing retry.
#
# Actions are idempotent: autoDigest skips when the draft is past
# pending_digest, and every trigger bumps updated_at so the next check backs
# off for another STUCK_AFTER window.
set -u

STUCK_AFTER=2700      # 45 min without progress => re-trigger
RENDER_ALERT=10800    # 3 h in 'rendering' => alert only (never re-render: duplicate YouTube uploads)
BASE="http://localhost:8200/functions/v1/daily-video-bot"
STAMP_DIR=/run/digest-watchdog
mkdir -p "$STAMP_DIR"

psq() { docker exec portfolio-db psql -U postgres -d postgres -tA -c "$1"; }
cenv() { docker exec portfolio-edge-functions sh -c "echo \$$1"; }

KEY=$(cenv SUPABASE_SERVICE_ROLE_KEY)
BOT=$(cenv TELEGRAM_BOT_TOKEN)
CHAT=$(cenv TELEGRAM_CHAT_ID)
YDATE=$(date -u -d yesterday +%F)

notify() {
  # once per date+reason (stamp), so a stuck state doesn't spam every 30 min
  local reason="$1" text="$2"
  local stamp="$STAMP_DIR/$YDATE-$reason"
  [ -e "$stamp" ] && return 0
  touch "$stamp"
  curl -s -m 10 "https://api.telegram.org/bot$BOT/sendMessage" \
    -d chat_id="$CHAT" -d parse_mode=HTML --data-urlencode text="$text" >/dev/null || true
}

trigger() {
  curl -s -m 30 -X POST "$BASE?action=$1&target_date=$YDATE" \
    -H "Authorization: Bearer $KEY" -H 'Content-Type: application/json' -d '{}' >/dev/null || true
}

row=$(psq "SELECT status || '|' || extract(epoch from now()-updated_at)::int FROM daily_video_drafts WHERE target_date='$YDATE'")

if [ -z "$row" ]; then
  # No draft at all late in the morning: both the agent task and the GH cron
  # failed to even start the day — kick auto_digest ourselves.
  if [ "$(date -u +%H | sed 's/^0//')" -ge 8 ]; then
    trigger auto_digest
    notify no-draft "🐶 <b>Digest watchdog:</b> драфту за $YDATE не було о $(date -u +%H:%M) UTC — запустив auto_digest."
  fi
  exit 0
fi

status=${row%%|*}
age=${row##*|}

case "$status" in
  pending_digest)
    if [ "$age" -gt "$STUCK_AFTER" ]; then
      trigger auto_digest
      notify retry-digest "🐶 <b>Digest watchdog:</b> драфт $YDATE висів у pending_digest $((age/60)) хв — перезапустив auto_digest."
    fi
    ;;
  pending_script|pending_scenario)
    if [ "$age" -gt "$STUCK_AFTER" ]; then
      trigger auto_chain
      notify retry-chain "🐶 <b>Digest watchdog:</b> драфт $YDATE висів у $status $((age/60)) хв — перезапустив auto_chain."
    fi
    ;;
  pending_images)
    if [ "$age" -gt "$STUCK_AFTER" ]; then
      trigger auto_chain_2
      notify retry-images "🐶 <b>Digest watchdog:</b> драфт $YDATE висів у pending_images $((age/60)) хв — перезапустив auto_chain_2."
    fi
    ;;
  rendering)
    if [ "$age" -gt "$RENDER_ALERT" ]; then
      notify stuck-render "🐶 <b>Digest watchdog:</b> драфт $YDATE у rendering вже $((age/3600)) год — глянь GitHub Actions руками (авто-перезапуск рендеру вимкнено, щоб не було дублів на YouTube)."
    fi
    ;;
  failed)
    notify failed "🐶 <b>Digest watchdog:</b> драфт $YDATE у status=failed: $(psq "SELECT left(coalesce(error_message,''),150) FROM daily_video_drafts WHERE target_date='$YDATE'")"
    ;;
esac
exit 0
