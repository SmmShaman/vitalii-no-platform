#!/usr/bin/env bash
# Pull the newest successful "Build site for VPS" artifact from GitHub Actions
# and switch vitalii-site.service to it. Runs from vitalii-site-deploy.timer.
# A release that fails the health check is marked .bad and never retried.
set -euo pipefail

REPO=SmmShaman/vitalii-no-platform
WORKFLOW=deploy-vps.yml
BASE=/opt/vitalii-site
PORT=3100
PAT=$(grep -oE 'ghp_[A-Za-z0-9]+|github_pat_[A-Za-z0-9_]+' /home/stuar/.git-credentials | head -1)

api() {
  curl -fsSL -H "Authorization: Bearer $PAT" -H "Accept: application/vnd.github+json" \
    "https://api.github.com/repos/$REPO/$1"
}

runs=$(api "actions/workflows/$WORKFLOW/runs?branch=main&status=success&per_page=1")
sha=$(jq -r '.workflow_runs[0].head_sha // empty' <<<"$runs")
run_id=$(jq -r '.workflow_runs[0].id // empty' <<<"$runs")
[ -n "$sha" ] || exit 0

current=$(basename "$(readlink -f "$BASE/current" 2>/dev/null || echo none)")
[ "$current" = "$sha" ] && exit 0
[ -e "$BASE/releases/$sha.bad" ] && exit 0

url=$(api "actions/runs/$run_id/artifacts" \
  | jq -r '.artifacts[] | select(.name == "site-standalone" and .expired == false) | .archive_download_url' | head -1)
[ -n "$url" ] || { echo "no artifact for $sha"; exit 0; }

tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
curl -fsSL -H "Authorization: Bearer $PAT" -o "$tmp/artifact.zip" "$url"
unzip -q "$tmp/artifact.zip" -d "$tmp"

rm -rf "$BASE/releases/$sha"
mkdir -p "$BASE/releases/$sha"
tar -xzf "$tmp/site.tar.gz" -C "$BASE/releases/$sha"
chown -R stuar:stuar "$BASE/releases/$sha"

previous=$(readlink -f "$BASE/current" 2>/dev/null || true)
switch_to() { ln -sfn "$1" "$BASE/current.new" && mv -T "$BASE/current.new" "$BASE/current"; }

switch_to "$BASE/releases/$sha"
systemctl restart vitalii-site

ok=
for _ in $(seq 1 40); do
  if curl -fs -o /dev/null "http://127.0.0.1:$PORT/"; then ok=1; break; fi
  sleep 1
done

if [ -z "$ok" ]; then
  echo "health check failed for $sha, rolling back to ${previous:-nothing}"
  touch "$BASE/releases/$sha.bad"
  if [ -n "$previous" ]; then
    switch_to "$previous"
    systemctl restart vitalii-site
  fi
  exit 1
fi

echo "deployed $sha (run $run_id)"

# Keep the three newest releases (current is always the newest)
ls -1dt "$BASE"/releases/*/ | tail -n +4 | xargs -r rm -rf
