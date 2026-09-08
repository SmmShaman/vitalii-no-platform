#!/usr/bin/env python3
"""Watchdog for the things that fail by going quiet.

Written 2026-09-05 after the feature publisher stopped posting for two days
without anyone noticing. Its agent session had grown to 47.5 MB; every wake
died on "Prompt is too long", produced no output, and nanoclaw marked the task
completed. Nothing was broken loudly enough to be seen.

Everything here checks for ABSENCE, because that is the failure mode that hides:
a post that did not happen, an agent that said nothing, a clip nobody rendered.
"""
import glob, json, os, re, shlex, subprocess, sys
from datetime import datetime, timezone

PUB_OUTBOUND = ("/home/stuar/nanoclaw-v2/data/v2-sessions/ag-1777451495719-mbqkcm/"
                "sess-1777451495730-s9ey7l/outbound.db")

# Any agent can die the way the publisher did: context too large to resume, so
# every wake returns nothing and every task still gets marked done. Size alone
# is NOT the tell — jobbot sits at 67.9 MB and compacts cleanly — so watch for
# silence instead, and give each agent a threshold that fits its own rhythm.
# jobbot is idle at weekends by design, hence the longer window.
WATCHED_AGENTS = [
    ("jobbot", "/home/stuar/nanoclaw-v2/data/v2-sessions/ag-1784275710688-s87c7v", 60),
    ("vitalii-no (завод)", "/home/stuar/nanoclaw-v2/data/v2-sessions/ag-1784275709437-x6pw1l", 40),
]
# The publisher posts at 08:00 and 20:00 UTC, so 26h covers a missed pair plus slack.
MAX_POST_AGE_H = 26
MAX_SILENCE_H = 26
MIN_RUNWAY = 6
FACTORY_LOG = "/root/feature-demos/factory.log"
RETRY_MARK = "/root/feature-demos/.factory-retry-%s"   # one daytime retry per UTC day


def factory_night_failed():
    """(failed, why) for the LAST factory run in factory.log. A run counts as
    failed when it is over (started > 2.5 h ago, service not running) and left
    no 'R2 updated' / non-empty 'queued for YouTube' line. Owner rule 2026-09-08:
    a failed night gets ONE daytime retry from here instead of a human."""
    try:
        lines = open(FACTORY_LOG, encoding="utf-8", errors="replace").read().splitlines()
    except OSError:
        return False, "no factory.log"
    starts = [i for i, l in enumerate(lines) if " runway = " in l]
    if not starts:
        return False, "no runs logged"
    block = lines[starts[-1]:]
    try:
        started = datetime.fromisoformat(block[0][:25])
    except ValueError:
        return False, "cannot parse start time"
    age_h = (datetime.now(timezone.utc) - started).total_seconds() / 3600
    if age_h < 2.5:
        return False, f"last run started {age_h:.1f} h ago — may still be going"
    if any("R2 updated" in l or "queued for YouTube: ['" in l for l in block):
        return False, "last run produced clips"
    why = next((l for l in block if any(k in l for k in
                ("TIMED OUT", "FATAL", "exhausted", "dropped", "nothing left"))), block[-1])
    return True, why[20:200]


def run(cmd):
    r = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    return r.stdout.strip()


def psql(sql):
    return run("docker exec portfolio-db psql -U postgres -t -A -F'|' -c " + shlex.quote(sql))


def telegram(text):
    # The chat id is NOT in nanoclaw's .env — only the bot token is. Reading it
    # blind threw AttributeError on None and every report was swallowed by the
    # except below, which is how this script reported nothing at all on 05.09.
    OWNER_CHAT = "374008445"
    try:
        env = open("/home/stuar/nanoclaw-v2/.env").read()
        m = re.search(r"TELEGRAM_BOT_TOKEN=(\S+)", env)
        if not m:
            raise RuntimeError("no TELEGRAM_BOT_TOKEN in nanoclaw .env")
        tok = m.group(1)
        c = re.search(r"TELEGRAM_CHAT_ID=(\S+)", env)
        chat = c.group(1) if c else OWNER_CHAT
    except Exception:
        return
    subprocess.run(["curl", "-s", "-X", "POST",
                    f"https://api.telegram.org/bot{tok}/sendMessage",
                    "-d", f"chat_id={chat}", "-d", "parse_mode=HTML",
                    "--data-urlencode", f"text={text}"], capture_output=True)


def hours_since(ts_text):
    if not ts_text:
        return None
    t = ts_text.strip().replace(" ", "T")[:26]
    try:
        dt = datetime.fromisoformat(t)
    except ValueError:
        return None
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return (datetime.now(timezone.utc) - dt).total_seconds() / 3600


def main():
    alarms = []

    last_post = psql("SELECT max(bright_posted_at) FROM features;")
    age = hours_since(last_post)
    if age is None:
        alarms.append("Не вдалося прочитати час останнього посту фічі.")
    elif age > MAX_POST_AGE_H:
        alarms.append(f"Публікатор фіч мовчить <b>{age:.0f} год</b> "
                      f"(останній пост {last_post[:16]}). Постить двічі на добу.")

    # An agent whose session has blown its context marks tasks completed and
    # writes nothing at all — so the absence of any outbound is the tell.
    import sqlite3
    try:
        c = sqlite3.connect(PUB_OUTBOUND)
        row = list(c.execute("select timestamp from messages_out order by rowid desc limit 1"))
        sil = hours_since(row[0][0]) if row else None
        if sil is not None and sil > MAX_SILENCE_H:
            alarms.append(f"Агент-публікатор не сказав нічого <b>{sil:.0f} год</b>. "
                          f"Ознака переповненого контексту — перевір "
                          f"<code>docker logs</code> на <code>Prompt is too long</code>.")
    except Exception as e:
        alarms.append(f"Не вдалося перевірити мовчання агента: {e}")

    # ── the measurement that would have caught Nano a week early ──
    # An agent's conversation is compacted automatically when it fills, and the
    # transcript records each compaction as a compact_boundary. What kills an
    # agent is not the FILE size — Nano died at 47.5 MB while jobbot ran fine at
    # 67.9 MB — but how much has piled up SINCE the last compaction, because
    # that is what a resume must load before it can compact anything. Nano died
    # with 0.73 MB there; jobbot was at 0.69 MB and one working day from the
    # same death. Warn well before that.
    TAIL_WARN_MB = 0.55
    for name, base, _ in [("Nano (публікатор)",
                           "/home/stuar/nanoclaw-v2/data/v2-sessions/ag-1777451495719-mbqkcm", 0)] + WATCHED_AGENTS:
        biggest = None
        for f in glob.glob(f"{base}/.claude-shared/projects/-workspace-agent/*.jsonl"):
            if biggest is None or os.path.getsize(f) > os.path.getsize(biggest):
                biggest = f
        if not biggest:
            continue
        try:
            last, sizes = -1, []
            with open(biggest, "rb") as fh:
                for i, line in enumerate(fh):
                    sizes.append(len(line))
                    if b"compact_boundary" in line:
                        last = i
            tail_mb = sum(sizes[last + 1:]) / 1048576
        except Exception:
            continue
        if tail_mb > TAIL_WARN_MB:
            alarms.append(f"Розмова агента <b>{name}</b> накопичила "
                          f"<b>{tail_mb:.2f} МБ</b> після останнього стиснення "
                          f"(поріг {TAIL_WARN_MB}, смертельно ~0.73). "
                          f"Час відкласти зошит, поки він ще відкривається.")

    # Same silence check, for the other agents that matter.
    for name, base, limit_h in WATCHED_AGENTS:
        newest = None
        for db in glob.glob(f"{base}/*/outbound.db"):
            try:
                cc = sqlite3.connect(db)
                row = list(cc.execute("select timestamp from messages_out order by rowid desc limit 1"))
                if row and (newest is None or row[0][0] > newest):
                    newest = row[0][0]
            except Exception:
                continue
        if newest is None:
            continue
        q = hours_since(newest)
        if q is not None and q > limit_h:
            alarms.append(f"Агент <b>{name}</b> мовчить {q:.0f} год (межа {limit_h}). "
                          f"Перевір <code>docker logs</code> на <code>Prompt is too long</code>.")

    # ── a failed night gets one daytime retry (owner, 2026-09-08) ──
    failed, why = factory_night_failed()
    if failed:
        mark = RETRY_MARK % datetime.now(timezone.utc).strftime("%Y-%m-%d")
        state = subprocess.run(["systemctl", "is-active", "feature-factory.service"],
                               capture_output=True, text=True).stdout.strip()
        if state in ("active", "activating"):
            pass  # a run is going right now; judge it next time
        elif os.path.exists(mark):
            alarms.append(f"Нічний прогін заводу впав ({why}); денний повтор уже "
                          f"був сьогодні і теж не дав кліпів. Потрібна людина.")
        else:
            open(mark, "w").write(why)
            subprocess.run(["systemctl", "start", "--no-block", "feature-factory.service"])
            alarms.append(f"Нічний прогін заводу впав ({why}). Запускаю денний повтор зараз.")

    runway = psql("SELECT count(*) FROM features WHERE demo_style='bright' "
                  "AND bright_posted_at IS NULL AND status='published';")
    try:
        n = int(runway)
        if n < MIN_RUNWAY:
            alarms.append(f"Запас кліпів <b>{n}</b> — менше ніж {MIN_RUNWAY}. "
                          f"Завод не встигає.")
    except ValueError:
        alarms.append("Не вдалося порахувати запас кліпів.")

    if alarms:
        telegram("🚨 <b>Сторож публікації</b>\n\n" + "\n\n".join(f"• {a}" for a in alarms))
        print("ALARMS:", *alarms, sep="\n  ")
        return 1
    print(f"ok — останній пост {age:.1f} год тому, запас {runway}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
