#!/bin/bash
# Daily feature->YouTube queue runner (fired by feature-yt-queue.timer at 07:30 UTC,
# right after the YouTube quota reset at 07:00 UTC).
#
# Owner rules encoded here:
#  - max 4 uploads/run: 4 x 1600 units leaves room for the Norwegian daily digest
#    upload (1600) inside the shared 10k-unit daily quota
#  - stop on first upload failure and report, never continue blind
#  - every video already carries a full SEO meta (meta-<id>.json), written in a
#    supervised session — this runner only ships pre-approved artifacts
#
# queue.txt line format:  <meta_id>[|<old_video_id_to_delete_after_success>]
# delete-queue.txt: one video id per line, deleted when the full-scope token exists.
set -uo pipefail
cd /root/feature-demos/yt
Q=queue.txt; DQ=delete-queue.txt; LOG=runner.log

note() { printf '%s %s\n' "$(date -Is)" "$*" >>"$LOG"; }
TG() {
  BT=$(grep ^TELEGRAM_BOT_TOKEN= /home/stuar/supabase-portfolio/functions-secrets.env | cut -d= -f2-)
  CH=$(grep ^TELEGRAM_CHAT_ID= /home/stuar/supabase-portfolio/functions-secrets.env | cut -d= -f2-)
  [ -n "$BT" ] && curl -s -o /dev/null -X POST "https://api.telegram.org/bot$BT/sendMessage" \
    -d chat_id="$CH" --data-urlencode text="$1" || true
}

SUMMARY=""
FULL=$(python3 -c "import sys; sys.path.insert(0,'.'); from yt_auth import has_full_scope; print('yes' if has_full_scope() else 'no')")
note "run start, full_scope=$FULL"

# 1) pending deletions (only possible with the full-scope token)
if [ "$FULL" = yes ] && [ -s "$DQ" ]; then
  while [ -s "$DQ" ]; do
    vid=$(head -1 "$DQ")
    if python3 delete_old.py "$vid" >>"$LOG" 2>&1; then
      sed -i 1d "$DQ"; SUMMARY+="deleted old $vid"$'\n'
    else
      note "delete failed $vid"; SUMMARY+="delete FAILED $vid (kept in queue)"$'\n'; break
    fi
  done
fi

# 2) uploads, max 4 per day. MAX_UPLOADS lets a manual catch-up run ship fewer
# when the timer already spent part of today's quota (4 x 1600 + the digest's
# 1600 is the whole 10k allowance, so a second full run of the day would 403).
MAX=${MAX_UPLOADS:-4}
# 2b) re-uploads (owner 2026-09-08): reupload.txt holds "<id>|<old_video_id>" lines for
# clips whose YouTube copy is a stale render. They only take the slots the day has
# LEFT after the factory's own new clips, so the digest and new material always fit.
RQ=reupload.txt
if [ -s "$RQ" ]; then
  have=$(grep -c . "$Q" 2>/dev/null || true); have=${have:-0}
  room=$((MAX - have))
  while [ $room -gt 0 ] && [ -s "$RQ" ]; do
    head -1 "$RQ" >> "$Q"; sed -i 1d "$RQ"; room=$((room-1))
    note "re-upload promoted into the queue: $(tail -1 "$Q")"
  done
fi
N=0
while [ $N -lt $MAX ] && [ -s "$Q" ]; do
  line=$(head -1 "$Q"); id=${line%%|*}; old=""
  [ "$line" != "$id" ] && old=${line#*|}
  out=$(python3 upload_one.py "$id" 2>&1); rc=$?
  echo "$out" >>"$LOG"
  if [ $rc -ne 0 ]; then
    SUMMARY+="upload FAILED: $id — runner stopped (queue untouched)"$'\n'
    TG "🎬 Feature YT queue: $SUMMARY"
    exit 1
  fi
  vid=$(echo "$out" | grep -oP 'RESULT_VIDEO_ID=\K.*')
  echo "$id $vid $(date -Idate)" >> uploaded.log
  # Write the id back into the DB so the site can link to YouTube and the daily
  # publisher can put the link in the LinkedIn post (owner rebuild 2026-08-26).
  # The '-v2' style suffixes in queue.txt are artifact names, not feature ids.
  fid=${id%%-*}
  if docker exec portfolio-db psql -U postgres -q -v ON_ERROR_STOP=1        -c "UPDATE features SET youtube_video_id='$vid', youtube_uploaded_at=now() WHERE feature_id='$fid';" >>"$LOG" 2>&1; then
    note "db: $fid -> $vid"
  else
    note "db write FAILED for $fid -> $vid"
    SUMMARY+="DB write FAILED for $fid (video is up: $vid)"$'
'
  fi
  sed -i 1d "$Q"; N=$((N+1))
  SUMMARY+="uploaded $id -> https://youtu.be/$vid"$'\n'
  if [ -n "$old" ]; then
    if [ "$FULL" = yes ] && python3 delete_old.py "$old" >>"$LOG" 2>&1; then
      SUMMARY+="deleted old $old"$'\n'
    else
      echo "$old" >> "$DQ"; SUMMARY+="old $old queued for deletion (need full-scope token)"$'\n'
    fi
  fi
  if [ "$FULL" = yes ]; then
    python3 playlist_sync.py "$vid" >>"$LOG" 2>&1 || note "playlist add failed for $vid"
  fi
done

if [ -n "$SUMMARY" ]; then
  TG "🎬 Feature YT queue ($(date -Idate)):
$SUMMARY"
else
  note "nothing to do"
fi
