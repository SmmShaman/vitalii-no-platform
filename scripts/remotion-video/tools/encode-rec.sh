#!/usr/bin/env bash
# encode-rec.sh — turn a record-ui.cjs frame dump into the H.264 clip the
# composition reads through <OffthreadVideo src={staticFile("rec/<id>-<shot>.mp4")}>.
#
#   bash tools/encode-rec.sh p61            # every public/rec/p61-*/ directory
#   bash tools/encode-rec.sh p61 hub page   # only those shots
#
# Runs with whatever ffmpeg is on PATH. On WSL without one it falls back to the
# Windows ffmpeg through cmd.exe (frames live on /mnt/c, so Windows sees them).
set -euo pipefail
cd "$(dirname "$0")/.."
id="${1:?feature id}"; shift
shots=("$@")

wsl_path() { # /mnt/c/x/y -> C:\x\y
  local p="$1"; p="${p#/mnt/}"; printf '%s:\\%s' "${p:0:1}" "$(printf '%s' "${p:2}" | tr '/' '\\')"
}

for dir in public/rec/"$id"-*/; do
  shot="${dir#public/rec/"$id"-}"; shot="${shot%/}"
  if [ ${#shots[@]} -gt 0 ] && [[ ! " ${shots[*]} " =~ " $shot " ]]; then continue; fi
  out="public/rec/$id-$shot.mp4"
  n=$(ls "$dir" | grep -c '\.jpg$')
  # yuv420p needs even dimensions; 466 css px @1.25 dsf is 583 device px, so crop one line.
  args=(-y -v error -framerate 30 -i "FRAMES/f%04d.jpg"
        -vf "crop=trunc(iw/2)*2:trunc(ih/2)*2"
        -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p -movflags +faststart "OUT")
  if command -v ffmpeg >/dev/null 2>&1; then
    a=("${args[@]/FRAMES/$dir}"); a=("${a[@]/OUT/$out}")
    ffmpeg "${a[@]}"
  else
    win_in=$(wsl_path "$(pwd)/$dir"); win_out=$(wsl_path "$(pwd)/$out")
    a=("${args[@]/FRAMES/$win_in}"); a=("${a[@]/OUT/$win_out}")
    cmd.exe /c ffmpeg "${a[@]}"
  fi
  echo "$out: $n frames -> $(du -k "$out" | cut -f1) KB"
done
