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
RERENDER_AFTER=5400   # 1.5 h in 'rendering' with no YouTube id => one re-dispatch
RENDER_ALERT=10800    # 3 h in 'rendering' after that => alert
GH_REPO=SmmShaman/vitalii-no-platform
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

GHPAT=$(cenv GH_PAT)

render_running() {
  # any daily-video render still queued or running => leave it alone
  local n
  n=$(curl -s -m 20 -H "Authorization: token $GHPAT" \
    "https://api.github.com/repos/$GH_REPO/actions/workflows/daily-news-video.yml/runs?event=repository_dispatch&per_page=5" |
    python3 -c 'import json,sys; print(sum(r["status"] in ("queued","in_progress") for r in json.load(sys.stdin).get("workflow_runs",[])))' 2>/dev/null)
  [ "${n:-1}" != "0" ]
}

redispatch() {
  curl -s -m 20 -o /dev/null -w '%{http_code}' -X POST "https://api.github.com/repos/$GH_REPO/dispatches" \
    -H "Authorization: token $GHPAT" -H 'Accept: application/vnd.github.v3+json' \
    -d "{\"event_type\":\"daily-video-render\",\"client_payload\":{\"draft_id\":\"$1\",\"target_date\":\"$YDATE\",\"format\":\"horizontal\",\"language\":\"no\",\"youtube_privacy\":\"public\",\"skip_youtube\":\"false\"}}"
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
    # A render that died BEFORE the YouTube upload is safe to repeat: the render
    # saves youtube_video_id on the draft right after the upload. 16.09, 27.09 and
    # 01.10 were lost because this branch only sent an alert.
    if [ "$age" -gt "$RERENDER_AFTER" ]; then
      yt=$(psq "SELECT coalesce(youtube_video_id,'') FROM daily_video_drafts WHERE target_date='$YDATE'")
      if [ -z "$yt" ] && [ ! -e "$STAMP_DIR/$YDATE-rerender" ] && ! render_running; then
        touch "$STAMP_DIR/$YDATE-rerender"
        id=$(psq "SELECT id FROM daily_video_drafts WHERE target_date='$YDATE'")
        code=$(redispatch "$id")
        notify rerender "🐶 <b>Digest watchdog:</b> рендер $YDATE впав до завантаження на YouTube — запустив рендер ще раз (GitHub $code)."
      elif [ "$age" -gt "$RENDER_ALERT" ]; then
        notify stuck-render "🐶 <b>Digest watchdog:</b> драфт $YDATE у rendering вже $((age/3600)) год і повторний рендер не допоміг — глянь GitHub Actions."
      fi
    fi
    ;;
  failed)
    notify failed "🐶 <b>Digest watchdog:</b> драфт $YDATE у status=failed: $(psq "SELECT left(coalesce(error_message,''),150) FROM daily_video_drafts WHERE target_date='$YDATE'")"
    ;;
esac
exit 0
