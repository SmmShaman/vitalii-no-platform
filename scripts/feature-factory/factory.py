#!/usr/bin/env python3
"""Nightly feature-clip factory.

Makes THREE voice-synced clips a night while the owner sleeps, publishes them
itself, and reports afterwards. Owner decision 2026-09-03: three a night even
though only two a day are posted, so the ~240-clip backlog burns down instead
of merely keeping pace.

Division of labour, and why:
  - The HOST (this script) does everything that needs a credential or a codec:
    the database, git, the GitHub dispatch, edge-tts, Telegram. It has all of
    them; the agent container has git and curl and nothing else.
  - The AGENT (nanoclaw, group vitalii-no, which mounts exactly this repo)
    does the two things only a model can do: write the narration, and write
    the composition. It touches files and nothing else.
  - GITHUB renders. Nobody's PC is involved.

Two waves, because a clip cannot be drawn until its narration has been timed:
  wave A  agent writes beats-<id>.json for the three features   (cheap)
  host    measures each with edge-tts, commits the timing
  wave B  agent writes the compositions against those windows   (expensive)
  host    commits, dispatches three renders with upload=true, reports

Run by feature-factory.timer. Safe to run by hand: it takes a lock and it
refuses to start when the shelf is already deep. `--plan` prints tonight's
picks and the verified URLs and exits without waking anyone.

LIVE UI (owner rule 2026-09-06): a UI beat plays a recording of the real
product, not a drawn mockup. The agent writes shots/<id>.json next to the
composition; the GitHub runner records those pages before rendering. A feature
is "done in the new style" exactly when its shots file exists. Each night:
N_NEW features that have never been voiced (new material for the publisher)
plus N_REDO already-voiced ones re-shot in the new style — the narration is
kept, only the picture is rewritten.
"""
import collections, glob, json, os, random, re, shlex, sqlite3, subprocess, sys, time
from datetime import datetime, timezone

REPO = "/home/stuar/Projects/vitalii_claude-code-in-browser"
RVID = f"{REPO}/scripts/remotion-video"
VO_DIR = f"{RVID}/vo-scripts/feature-vo"
INBOUND = ("/home/stuar/nanoclaw-v2/data/v2-sessions/ag-1784275709437-x6pw1l/"
           "sess-1784275709448-5fynqb/inbound.db")
MARKER_DIR = f"{RVID}/out/factory"
# The agent sees the same repo through its own mount. Every path handed to it
# must be in ITS namespace: a host path silently does nothing, which is exactly
# how the first wake test "succeeded" while writing no file.
CONTAINER_REPO = "/workspace/extra/vitalii-no"
CONTAINER_RVID = f"{CONTAINER_REPO}/scripts/remotion-video"


def to_container(host_path):
    return host_path.replace(REPO, CONTAINER_REPO, 1)
LOCK = "/run/feature-factory.lock"
LOG = "/root/feature-demos/factory.log"

N_CLIPS = 3
# Of the three: how many brand-new features (narration + picture) and how many
# re-shoots of already-voiced clips (picture only, narration kept). Two new a
# night keeps the runway level against two posts a day; the third slot burns
# down the old-style backlog. When nothing new is left, all three are re-shoots.
N_NEW = 2
N_REDO = 1
REDO_MIN_RUNWAY = 8   # below this every slot goes to new material
SHOTS_DIR = f"{RVID}/src/compositions/feature-demos/shots"
SITE = "https://vitalii.no"
# Circuit breaker, not a throttle. Three a night against two a day is a
# deliberate surplus; this only stops a runaway if publishing ever halts.
RUNWAY_CEILING = 60
WAVE_A_TIMEOUT = 30 * 60
WAVE_B_TIMEOUT = 75 * 60            # wave C (all features in one task)
WAVE_B_FEATURE_TIMEOUT = 45 * 60    # wave B, one feature per task

ARCHETYPES = ["0 split-duel", "1 timeline", "2 zoom-in", "3 card-deck",
              "4 flow-map", "5 ledger", "6 sidebar", "7 hero-number"]
MOODS = ["dawn", "sand", "slate", "mint", "violet"]


def log(msg):
    line = f"{datetime.now(timezone.utc).isoformat(timespec='seconds')} {msg}"
    # systemd already appends stdout to LOG (StandardOutput=append:), so writing
    # the file here as well printed every line twice.
    print(line, flush=True)


def redact(text):
    """Strip GitHub tokens out of anything that can reach the log or Telegram.
    2026-09-09 23:48 UTC: a failed curl to the Actions API raised with its full
    command line, PAT included, and that line went into factory.log AND the
    owner's Telegram."""
    text = str(text)
    try:
        tok = gh_token()
        if tok:
            text = text.replace(tok, "ghp_***")
    except Exception:
        pass
    return re.sub(r"\b(ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{20,}|\bgithub_pat_[A-Za-z0-9_]{20,}",
                  r"\1_***", text)


def run(cmd, cwd=None, check=True, user=None):
    if user:
        cmd = f"sudo -u {user} bash -lc {shlex.quote(cmd)}"
    r = subprocess.run(cmd, shell=True, cwd=cwd, capture_output=True, text=True)
    if check and r.returncode != 0:
        raise RuntimeError(redact(f"{cmd}\n{r.stdout}\n{r.stderr}"))
    return r.stdout.strip()


def psql(sql):
    return run("docker exec portfolio-db psql -U postgres -t -A -F'|' -c "
               + shlex.quote(sql))


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
    except Exception as e:
        log(f"telegram unavailable: {e}")
        return
    subprocess.run(["curl", "-s", "-X", "POST",
                    f"https://api.telegram.org/bot{tok}/sendMessage",
                    "-d", f"chat_id={chat}", "-d", "parse_mode=HTML",
                    "-d", "disable_web_page_preview=true",
                    "--data-urlencode", f"text={text}"],
                   capture_output=True)


def gh_token():
    line = open("/home/stuar/.git-credentials").read().strip().splitlines()[0]
    return re.sub(r"https://[^:]+:([^@]+)@github\.com", r"\1", line)


R2_PUBLIC = "https://pub-612755c33acf4a878ca21c80dcd5cbe8.r2.dev"


def r2_etag(fid):
    """ETag of the published clip on R2, '' when there is none yet."""
    out = run(f'curl -sI --max-time 25 {R2_PUBLIC}/features/feature-{fid}.mp4', check=False)
    m = re.search(r"(?im)^etag:\s*(\S+)", out)
    return m.group(1) if m else ""


def wait_for_r2(fid, etag_before, timeout=30 * 60, every=60):
    """True once the R2 key holds a different object than before dispatch."""
    t0 = time.time()
    while time.time() - t0 < timeout:
        tag = r2_etag(fid)
        if tag and tag != etag_before:
            return True
        time.sleep(every)
    return False


def dispatch(feature_id, composition, mode="render", upload="true"):
    body = {"ref": "main", "inputs": {"feature_id": feature_id, "mode": mode}}
    if mode == "render":
        body["inputs"]["composition"] = composition
        body["inputs"]["upload"] = upload
    r = subprocess.run(
        ["curl", "-s", "-o", "/dev/null", "-w", "%{http_code}", "-X", "POST",
         "https://api.github.com/repos/SmmShaman/vitalii-no-platform/actions/"
         "workflows/feature-clip.yml/dispatches",
         "-H", f"Authorization: Bearer {gh_token()}",
         "-H", "Accept: application/vnd.github+json",
         "-d", json.dumps(body)],
        capture_output=True, text=True)
    return r.stdout.strip()


# ── choosing what to make ────────────────────────────────────────────────
# Every published feature, with what the host needs to build recordable URLs.
# Tiering happens in Python against two file sets: beats-<id>.json (voiced by
# this factory) and shots/<id>.json (re-shot in the live style).
FEATURES_SQL = """
SELECT f.feature_id, coalesce(f.demo_style,''), coalesce(f.title_en,''),
       coalesce(f.slug_en,''), coalesce(p.repo_url,''),
       coalesce(array_to_string(f.source_commits, ','), ''),
       CASE WHEN f.bright_posted_at IS NULL THEN 0 ELSE 1 END,
       coalesce(f.youtube_video_id,''), f.created_at::text, f.project_id,
       coalesce(p.name_en,''), coalesce(replace(p.description_en, E'\\n', ' '),'')
  FROM features f LEFT JOIN feature_projects p ON p.id = f.project_id
 WHERE f.status='published'
 ORDER BY f.created_at ASC, f.feature_id ASC
"""

# ── materials the host hands the agent (owner decision 2026-09-21) ───────
# Two blind viewers rated j77 3/10 and 5/10: the commits on screen were not
# the ones the narration described, the diff was unreadable, and nobody said
# what the product was. The host can supply all three facts; the agent
# should never have to guess them.
LOG_SOURCES = {
    # project_id -> shell command printing that project's log for a day
    # ({day} = YYYY-MM-DD). Only projects whose runtime lives on this VPS.
    "jobbot": "journalctl -u jobbot-worker --since '{day}' --until '{day} 23:59:59' --no-pager -o short-iso",
    "portfolio": "grep -h '^{day}' /root/feature-demos/factory.log /root/feature-demos/watchdog.log "
                 "/root/feature-demos/yt/runner.log 2>/dev/null",
    "vitalii_no_platform": "grep -h '^{day}' /root/feature-demos/factory.log /root/feature-demos/watchdog.log "
                           "/root/feature-demos/yt/runner.log 2>/dev/null",
    # boytasks: the app runs on Cloudflare; the only VPS log (face recognizer)
    # is unrelated to almost every feature — a viewer saw PRESENT=['hordii']
    # under a grammar-exercise story on 2026-09-22. No source on purpose.
}
LOG_MAX_LINES = 12
SECRET_RE = re.compile(r"(?i)(token|secret|bearer|apikey|api_key|password|passwd|authorization)[=: ]\S+"
                       r"|\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,}\b"
                       r"|\b(ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{20,}|\bsk-[A-Za-z0-9]{20,}|\beyJ[A-Za-z0-9_-]{30,}")


def commit_info(repo, sha):
    """(subject, [files…]) of one commit from the GitHub API; '' on failure."""
    m = re.match(r"https://github\.com/([^/]+)/([^/]+)", repo.rstrip("/"))
    if not m:
        return "", []
    out = run(f'curl -s --max-time 25 -H "Authorization: Bearer {gh_token()}" '
              f'-H "Accept: application/vnd.github+json" '
              f'"https://api.github.com/repos/{m.group(1)}/{m.group(2)}/commits/{sha}"', check=False)
    try:
        d = json.loads(out)
        subject = (d.get("commit", {}).get("message") or "").split("\n", 1)[0]
        files = [f.get("filename", "") for f in d.get("files", [])][:5]
        return subject, files
    except (ValueError, AttributeError):
        return "", []


def log_lines(project, created_at, title):
    """Up to LOG_MAX_LINES real log lines of the project around the day the
    feature was made, preferring lines that share a word with the title.
    Secrets and e-mails are scrubbed. [] when the project keeps no log here."""
    cmd = LOG_SOURCES.get(project)
    if not cmd:
        return []
    day = (created_at or "")[:10]
    if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", day):
        return []
    # the feature row is dated when it was written up, the code usually ran a
    # day or two around it: look at day-1 … day+2 and keep the first day with
    # anything in it (journalctl prints "-- No entries --" for an empty day)
    from datetime import date, timedelta
    y, mo, d = (int(x) for x in day.split("-"))
    lines = []
    for off in (0, 1, -1, 2):
        dd = (date(y, mo, d) + timedelta(days=off)).isoformat()
        text = run(cmd.format(day=dd), check=False)
        lines = [l.strip() for l in text.splitlines()
                 if l.strip() and not l.startswith("-- No entries")]
        if lines:
            break
    if not lines:
        return []
    # drop the journalctl prefix ("2026-09-10T20:21:59+02:00 host python[123]: ")
    lines = [re.sub(r"^\S+ \S+ \S+\[\d+\]: ", "", l) for l in lines]
    # a worker repeats its heartbeat all day; keep one line per SHAPE (digits
    # stripped) so the agent sees the story, not the same line twelve times
    seen, uniq = set(), []
    for l in lines:
        key = re.sub(r"\d+", "#", l)[:60]
        if key not in seen:
            seen.add(key)
            uniq.append(l)
    words = {w.lower() for w in re.findall(r"[A-Za-z]{5,}", title)}
    hits = [l for l in uniq if any(w in l.lower() for w in words)]
    chosen = (hits + [l for l in uniq if l not in hits])[:LOG_MAX_LINES]
    out = []
    for l in chosen:
        l = SECRET_RE.sub("[redacted]", redact(l))
        out.append(l[:120])
    return out


def materials(p):
    """The block of facts the wave B brief carries for one feature."""
    parts = [f"Product: **{p.get('name') or p.get('project')}** — {(p.get('desc') or '')[:160]}"]
    commits = [c for c in (p.get("commits") or "").split(",") if c]
    if commits and p.get("repo"):
        rows = []
        for sha in commits[:3]:
            subj, files = commit_info(p["repo"], sha)
            if subj:
                rows.append(f"- `{sha[:7]}` — {subj}" + (f" (files: {', '.join(files)})" if files else ""))
        if rows:
            parts.append("This feature's commits (a beat may only show the commit whose message "
                         "says what the beat says):\n" + "\n".join(rows))
    logs = log_lines(p.get("project"), p.get("created"), p.get("title", ""))
    if logs:
        parts.append("Real log lines of this product from the day the feature was made "
                     "(use them VERBATIM in a `LogWindow`, pick the 5–8 that tell THIS "
                     "feature's story; if none relate to it, use none and build the lines "
                     "from the feature's own numbers — unrelated log noise cost a clip its "
                     "publication on 2026-09-22):\n"
                     + "\n".join(f"    {l}" for l in logs))
    else:
        parts.append("No runtime log for this product on the VPS: build the `LogWindow` lines "
                     "from the numbers in the feature row (problem/solution/result), never invent one.")
    return "\n\n".join(parts)


# ── wave D: the blind viewer (owner decision 2026-09-21) ────────────────
VIEWER_MIN_CLARITY = 7
VIEWER_MIN_THESIS = 7
VIEWER_ROUNDS = 2          # verdict → fix → verdict; then quarantine
WAVE_D_TIMEOUT = 20 * 60


def viewer_sheets(fid, mp4=None):
    """Frames a viewer sees, six per sheet, 640 px wide. Since 2026-10-07 two per
    narration line — the moment its picture changes (45 % into the line) and the
    reading hold just before the next line — the review the digest effects get;
    a clip without a measurement falls back to one frame every 2 s."""
    mp4 = mp4 or f"/tmp/{fid}-review.mp4"
    if not os.path.exists(mp4):
        return []
    try:
        tl = json.load(open(f"{VO_DIR}/vo-{fid}.json"))["timeline"]
    except (OSError, ValueError, KeyError):
        tl = []
    if tl:
        times = []
        for i, b in enumerate(tl):
            key = b["start_s"] + 0.45 * (b["end_s"] - b["start_s"])
            nxt = tl[i + 1]["start_s"] if i + 1 < len(tl) else b["end_s"] + 1.2
            times += [key, max(key + 0.3, nxt - 0.15)]
        for f in glob.glob(f"{MARKER_DIR}/vf-{fid}-*.jpg"):
            os.remove(f)
        for k, t in enumerate(times):
            run(f"ffmpeg -v error -y -ss {t:.3f} -i {shlex.quote(mp4)} -frames:v 1 "
                f"-vf scale=640:-1 {MARKER_DIR}/vf-{fid}-{k:02d}.jpg", check=False)
        sheets = []
        for k in range(0, len(times), 6):
            out = f"{MARKER_DIR}/viewer-{fid}-{k // 6}.jpg"
            pad = 5 - (min(6, len(times) - k) - 1)
            run(f"ffmpeg -v error -y -start_number {k} -i {MARKER_DIR}/vf-{fid}-%02d.jpg "
                f"-vf 'tpad=stop_mode=clone:stop={pad},tile=3x2' "
                f"-frames:v 1 {out}", check=False)
            if os.path.exists(out):
                run(f"chown stuar:stuar {out}", check=False)
                sheets.append(out)
        if sheets:
            return sheets
    dur = float(run(f"ffprobe -v error -show_entries format=duration -of csv=p=0 {shlex.quote(mp4)}",
                    check=False) or 0)
    sheets = []
    for k in range(max(1, int(dur // 12) + (1 if dur % 12 > 1 else 0))):
        out = f"{MARKER_DIR}/viewer-{fid}-{k}.jpg"
        # tpad clones the last frame so a short final sheet shows the clip's
        # real ending, not the black cells ffmpeg pads a tile with — every
        # viewer on 2026-09-22 reported "the video ends on a black frame"
        run(f"ffmpeg -v error -y -ss {k * 12} -i {shlex.quote(mp4)} -t 12 "
            f"-vf 'tpad=stop_mode=clone:stop_duration=14,fps=1/2,scale=640:-1,tile=3x2' "
            f"-frames:v 1 {out}", check=False)
        if os.path.exists(out):
            run(f"chown stuar:stuar {out}", check=False)
            sheets.append(out)
    return sheets


def viewer_queries(fid):
    """The search phrases the clip is supposed to answer, from its own SEO."""
    try:
        m = json.load(open(f"{VO_DIR}/meta-{fid}.json"))
    except (OSError, ValueError):
        return []
    title = re.sub(r"\s*\|\s*(vitalii\.no|JobBot).*$", "", m.get("title", "")).strip()
    tags = [t for t in m.get("tags", []) if "vitalii" not in t.lower()]
    qs = [q for q in [title] + tags[:2] if q]
    return qs


def narration(fid):
    try:
        b = json.load(open(f"{VO_DIR}/beats-{fid}.json"))
        return "\n".join(f'{i + 1}. "{t}"' for i, (_, t) in enumerate(b["beats"]))
    except (OSError, ValueError, KeyError):
        return "(no transcript)"


def parse_verdict(path, fid):
    """The viewer's JSON out of the marker file, tolerant of prose around it."""
    try:
        text = open(path, encoding="utf-8").read()
    except OSError:
        return None
    for m in re.finditer(r"\{.*\}", text, flags=re.S):
        try:
            d = json.loads(m.group(0))
        except ValueError:
            continue
        v = d.get(fid, d)
        if isinstance(v, dict) and "clarity" in v:
            return v
    return None


def viewer_pass(v):
    try:
        return float(v.get("clarity", 0)) >= VIEWER_MIN_CLARITY and \
               float(v.get("thesis", 0)) >= VIEWER_MIN_THESIS
    except (TypeError, ValueError):
        return False


def viewer_text(v):
    if not v:
        return "no verdict"
    qs = v.get("queries") or {}
    return (f"clarity {v.get('clarity')}/10, thesis {v.get('thesis')}/10"
            + (", queries " + ", ".join(f"{k[:28]}={val}" for k, val in qs.items()) if qs else ""))


def wave_d(p, stamp, round_no, mp4=None):
    """One blind viewing of one clip. Returns the verdict dict or None."""
    sheets = viewer_sheets(p["id"], mp4)
    if not sheets:
        log(f"{p['id']}: no frames for the viewer")
        return None
    qs = viewer_queries(p["id"])
    controls = ["github commit history tutorial", "car dealership marketing video"]
    mark = f"{MARKER_DIR}/waveD{round_no}-{stamp}-{p['id']}.done"
    fresh_session(f"wave D{round_no} {p['id']}")
    wake(WAVE_D_PROMPT.format(fid=p["id"], sheets="\n".join(to_container(s) for s in sheets),
                              transcript=narration(p["id"]),
                              queries="\n".join(f"   - \"{q}\"" for q in qs + controls),
                              thesis=qs[0] if qs else "(the video's own title)",
                              marker=to_container(mark)), f"wd{round_no}")
    if not wait_for(mark, WAVE_D_TIMEOUT, f"wave D{round_no} {p['id']}"):
        return None
    v = parse_verdict(mark, p["id"])
    log(f"{p['id']}: viewer round {round_no}: {viewer_text(v)}")
    return v

# Repos whose pages a runner can open without a login (checked 2026-09-06 with
# `gh repo view`). A private repo's commit page answers 404 to the recorder.
PUBLIC_REPOS = {
    "https://github.com/SmmShaman/vitalii-no-platform",
    "https://github.com/SmmShaman/jobbot-norway",
    "https://github.com/SmmShaman/calendar-bot",
    "https://github.com/SmmShaman/Ghost-Interviewer-AI",
    "https://github.com/SmmShaman/portfolio-website",
}
# Public product surfaces beyond vitalii.no, per project id.
PUBLIC_SITES = {
    "ghost_interviewer": ["https://ghost.vitalii.no"],
}


_PROBED = {}


def url_ok(url, tries=3, pauses=(5, 20)):
    """One curl is not a verdict. 2026-09-07: github.com/.../commits/main failed
    a single probe at 23:32 UTC and two clips were dropped, while the same page
    answered 200 all day. Three things fixed here:
    - the answer is cached per URL for the whole night — the old code hit the
      same page once per feature in recordable_urls() and again in shots_ok(),
      and github.com throttles that exact page per IP;
    - a miss is retried with a growing pause;
    - HTTP 429 means "the page exists, this IP is being throttled" — the clip is
      recorded on a GitHub runner from another IP, so 429 counts as alive."""
    if url in _PROBED:
        return _PROBED[url]
    code = ""
    for i in range(tries):
        code = run(f'curl -s -o /dev/null -w "%{{http_code}}" -L --max-time 25 '
                   f'-A "Mozilla/5.0 (X11; Linux x86_64) Chrome/128.0" {shlex.quote(url)}',
                   check=False).strip()
        if code.isdigit() and int(code) < 400:
            _PROBED[url] = True
            return True
        if i < tries - 1:
            pause = pauses[min(i, len(pauses) - 1)]
            log(f"probe {i + 1}/{tries} of {url} -> {code or 'no answer'}; retrying in {pause}s")
            time.sleep(pause)
    if code == "429":
        log(f"{url}: 429 after {tries} probes — throttled, not dead; treated as alive "
            f"(the runner records from another IP)")
        _PROBED[url] = True
        return True
    _PROBED[url] = False
    return False


def recordable_urls(row):
    """Public pages the agent may record for this feature, each checked live."""
    fid, style, title, slug, repo, commits, posted, yt, created = row[:9]
    cands = []
    if slug:
        cands.append(("the feature's own page", f"{SITE}/features/{slug}"))
    cands.append(("the features hub", f"{SITE}/features"))
    repo = repo.rstrip("/")
    if repo in PUBLIC_REPOS:
        for h in [c for c in commits.split(",") if c][:2]:
            cands.append(("the feature's real commit (its diff)", f"{repo}/commit/{h}"))
        cands.append(("the repo's commit history", f"{repo}/commits"))  # GitHub redirects to the default branch
        cands.append(("the repo's Actions runs", f"{repo}/actions"))
    for site in PUBLIC_SITES.get(row[9], []):
        cands.append(("the product itself", site))
    out = []
    for what, url in cands:
        if url_ok(url):
            out.append((what, url))
        else:
            log(f"{fid}: {url} not recordable (no 2xx/3xx) — dropped")
    return out


def choose(rows, voiced, live, runway=None, stranded=()):
    """N_NEW never-voiced features, NEWEST FIRST (owner decision 2026-09-07:
    a feature discovered today gets its clip tonight; the old tier order
    bright > dark > no-clip, oldest first, parked fresh features behind ~220
    older ones) + N_REDO voiced-but-not-live ones (unposted first, so the new
    style is what airs). Fills from the other pool when one runs dry."""
    new = sorted([r for r in rows if r[0] not in voiced and r[0] not in live],
                 key=lambda r: (r[8], r[0]), reverse=True)
    redo = sorted([r for r in rows if r[0] in voiced and r[0] not in live],
                  key=lambda r: (int(r[6]), r[8], r[0]))
    # The re-shoot slot is a luxury: when the runway is short (owner, 2026-09-08)
    # all three slots make NEW material, so the publisher never runs dry.
    n_redo = N_REDO if runway is None or runway >= REDO_MIN_RUNWAY else 0
    n_new = N_CLIPS - n_redo
    picks = new[:n_new] + redo[:n_redo]
    if len(picks) < N_CLIPS:
        extra = [r for r in new[n_new:] + redo[n_redo:] if r not in picks]
        picks += extra[:N_CLIPS - len(picks)]
    picks = picks[:N_CLIPS]
    # Stranded features — voiced, drawn, shots written, but never published
    # because the night died between wave B and the R2 write (j77/v36/v37 on
    # 2026-09-10, k01/g04/v30 on 2026-09-12). Both file markers exist, so the
    # pools above never see them again, and the paid work sits in git unused.
    # They cost no agent time (waves A and B are skipped), only render minutes,
    # so they ride ON TOP of tonight's regular picks, newest first, N_CLIPS at
    # a time.
    fin = sorted([r for r in rows if r[0] in stranded and r not in picks],
                 key=lambda r: (r[8], r[0]), reverse=True)[:N_CLIPS]
    return fin + picks


def clamp_shots(spec):
    """The one slip that killed the night of 2026-09-11: every shot had its last
    scroll/mouse keyframe on frame == frames (232 of 232), one past the last
    frame the recorder writes (0..frames-1). Three fresh conversations made the
    same off-by-one. Pull such a keyframe (and a click) back by one instead of
    throwing the whole clip away. Returns True when anything changed."""
    changed = False
    for sh in spec.get("shots") or []:
        frames = sh.get("frames")
        if not isinstance(frames, int):
            continue
        for key in ("scroll", "mouse"):
            k = sh.get(key) or []
            if k and isinstance(k[-1], list) and k[-1] and k[-1][0] == frames \
                    and (len(k) < 2 or k[-2][0] < frames - 1):
                k[-1][0] = frames - 1
                changed = True
        clicks = sh.get("clicks")
        if isinstance(clicks, list) and frames in clicks:
            sh["clicks"] = [frames - 1 if c == frames else c for c in clicks]
            changed = True
    return changed


def shots_ok(fid):
    """Validate the agent's shots file the way the recorder will, and check
    every URL live. Returns a list of problems (empty = fine)."""
    p = f"{SHOTS_DIR}/{fid}.json"
    if not os.path.exists(p):
        return ["no shots file"]
    try:
        spec = json.load(open(p))
    except Exception as e:
        return [f"shots file is not JSON: {e}"]
    if clamp_shots(spec):
        json.dump(spec, open(p, "w"), indent=2)
        log(f"{fid}: shots file clamped — last keyframe moved from frames to frames-1")
    probs = []
    for sh in spec.get("shots") or [{}]:
        name, url, frames = sh.get("name", "?"), sh.get("url", ""), sh.get("frames", 0)
        if not re.fullmatch(r"[a-z0-9-]+", str(name)):
            probs.append(f"bad shot name {name!r}")
        if not (isinstance(frames, int) and frames >= 30):
            probs.append(f"{name}: frames {frames!r} < 30")
        for key in ("scroll", "mouse"):
            k = sh.get(key) or []
            if not k:
                probs.append(f"{name}: no {key} keyframes")
            elif k[-1][0] > frames - 1:
                probs.append(f"{name}: {key} keyframe past frame {frames-1}")
        if not url.startswith("http"):
            probs.append(f"{name}: url {url!r}")
        elif not url_ok(url):
            probs.append(f"{name}: {url} does not answer")
    return probs


# ── directing gates (owner review of v27 + j77, 2026-09-21) ─────────────
# Both clips posted on 2026-09-20 passed every sync check and still failed a
# human look: j77 was drawn "0 split-duel" and written as a timeline ribbon
# (a thin band on top of three near-empty frames); v27 was drawn "7
# hero-number" and its hero was a 112px figure in a corner under a browser
# window; both ended on a scroll of the feature's own article page; v27 used
# a ZWJ emoji the brief forbids. Four gates, all mechanical:
#   1. the composition header names the drawn archetype, and a hero-number
#      clip really has a ≥200px figure          → checked after wave B
#   2. the last beat is not the feature's own page → checked after wave B
#   3. the frame is not empty: cells of an 8x6 grid touched at each beat's
#      midpoint, measured on the review render   → facts into wave C, then
#      re-measured; a clip still empty is quarantined, not published
#   4. ZWJ emoji sequences                        → reduced to one codepoint
# A composition that fails 1 or 2 gets ONE fix round (wave B2) and is then
# discarded for the night — its feature stays in the pool.
ZWJ = "‍"
QUARANTINE = "/root/feature-demos/quarantine.json"
COMPARE_DIR = "/root/feature-demos/compare"
HERO_MIN_PX = 200
FILL_MIN_CELLS = 31   # of 48; calibrated 2026-09-21: empty beats 23-30, good 32-48
FILL_MAX_BAD = 1      # one thin beat is reported, two fail the clip
COMP_DIR = f"{RVID}/src/compositions/feature-demos"


def comp_path(comp):
    return f"{COMP_DIR}/{comp}.tsx"


def strip_zwj(path):
    """Reduce every ZWJ emoji sequence to its first codepoint (😵‍💫 → 😵).
    Headless Chrome splits the sequence into two glyphs; the brief forbids
    them and the agents keep writing them (v27, 2026-09-18). Returns count."""
    try:
        text = open(path, encoding="utf-8").read()
    except OSError:
        return 0
    if ZWJ not in text:
        return 0
    new, n = re.subn(r"(\S)(?:‍\S️?)+", r"\1", text)
    open(path, "w", encoding="utf-8").write(new)
    return n


def live_windows(src):
    """(shot name, from frame) of every <LiveWindow …/> in a composition."""
    out = []
    for blk in re.findall(r"<LiveWindow\b(.*?)/>", src, flags=re.S):
        s = re.search(r'shot=\{?"([a-z0-9-]+)"\}?', blk)
        f = re.search(r"from=\{(\d+)\}", blk)
        if s and f:
            out.append((s.group(1), int(f.group(1))))
    return out


def composition_ok(fid, comp, archetype, slug):
    """Gates 1, 2 and 4 on the composition file. Returns a list of problems."""
    path = comp_path(comp)
    if not os.path.exists(path):
        return ["composition file missing"]
    n = strip_zwj(path)
    if n:
        log(f"{fid}: {n} ZWJ emoji sequence(s) reduced to a single codepoint")
    src = open(path, encoding="utf-8").read()
    probs = []
    want = archetype.split()[0]
    m = re.search(r"[Aa]rchetype\s*#?\s*(\d)", src[:3000])
    if not m:
        probs.append(f"the header comment does not name the archetype — it must say "
                     f"'archetype {archetype}'")
    elif m.group(1) != want:
        probs.append(f"the header says archetype {m.group(1)} but '{archetype}' was drawn "
                     f"for this clip; rebuild the staging as {archetype}")
    if want == "7":
        sizes = [int(x) for x in re.findall(r"fontSize:\s*(\d+)", src)]
        big = max(sizes) if sizes else 0
        if big < HERO_MIN_PX:
            probs.append(f"hero-number clip whose largest fontSize is {big}px — the hero "
                         f"figure must be ≥ {HERO_MIN_PX}px and own the frame")
    wins = live_windows(src)
    if wins and slug:
        last_shot = max(wins, key=lambda w: w[1])[0]
        try:
            spec = json.load(open(f"{SHOTS_DIR}/{fid}.json"))
            url = next((s.get("url", "") for s in spec.get("shots", [])
                        if s.get("name") == last_shot), "")
        except (OSError, ValueError):
            url = ""
        if url.rstrip("/") in (f"{SITE}/features/{slug}", f"{SITE}/features"):
            what = "the features hub" if url.rstrip("/").endswith("/features") else "the feature's own article page"
            probs.append(f"the last beat plays {what} (shot '{last_shot}') — small text, or a "
                         "scroll past unrelated features, is not a result (every blind viewer "
                         "on 2026-09-22 said so). End on THIS feature's result: a LogWindow "
                         "with its real lines, the product's own screen, or a drawn result "
                         "with several labelled objects")
    probs += motion_ok(fid, src)
    return probs


def frame_fill(mp4, vo_json):
    """Per beat: how many cells of an 8x6 grid hold anything that differs from
    the background (> 10/255 in any channel, > 5 % of the cell) at the beat's
    midpoint. Calibrated 2026-09-21 on seven clips: the empty ones (j77
    b1-b3, v27, g04) score 23-30, the reference clips (p61, b50) 32-48. Pure
    Python over a 320x180 raw frame — the VPS has no PIL."""
    W, H = 320, 180
    out = []
    for b in json.load(open(vo_json))["timeline"]:
        t = (b["start_s"] + b["end_s"]) / 2
        raw = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{t:.3f}", "-i", mp4,
                              "-frames:v", "1", "-vf", f"scale={W}:{H}", "-f", "rawvideo",
                              "-pix_fmt", "rgb24", "-"], capture_output=True).stdout
        if len(raw) != W * H * 3:
            out.append((b["beat"], None))
            continue
        px = [(raw[i], raw[i + 1], raw[i + 2]) for i in range(0, len(raw), 3)]
        key = collections.Counter((r >> 3, g >> 3, bl >> 3) for r, g, bl in px).most_common(1)[0][0]
        bg = [p for p in px if (p[0] >> 3, p[1] >> 3, p[2] >> 3) == key]
        mean = [sum(p[k] for p in bg) / len(bg) for k in range(3)]
        ink = [max(abs(r - mean[0]), abs(g - mean[1]), abs(bl - mean[2])) > 10 for r, g, bl in px]
        cw, ch, cells = W // 8, H // 6, 0
        for cy in range(6):
            for cx in range(8):
                n = sum(1 for y in range(cy * ch, (cy + 1) * ch)
                        for x in range(cx * cw, (cx + 1) * cw) if ink[y * W + x])
                if n > 0.05 * cw * ch:
                    cells += 1
        out.append((b["beat"], cells))
    return out


# 2026-10-12: since the feature-motion direction (07.10) the analogy beat and
# the opener are kinetic type — a headline over a dark plate, sparse BY DESIGN
# (keywordCaption "Like trusting a scale…" measured 19-20/48 on d09/p21 and
# quarantined two otherwise good clips). A beat whose motion plan stages a
# kinetic-type effect is still measured and shown, but not counted as empty.
TYPE_TAG = " (type)"


def typographic_beats(fid):
    try:
        d = json.load(open(MOTION_CATALOG))
        kinetic = {e["name"] for e in d.get("effects", []) if e.get("family") == "kinetic-type"}
    except (OSError, ValueError, KeyError):
        return set()
    return {b.get("beat") for b in (motion_plan(fid) or {}).get("beats") or []
            if b.get("effect") in kinetic}


def fill_report(fid):
    """Measure the review render fetch_contact_sheet() left in /tmp.
    Returns (cells per beat, names of the beats under the line)."""
    mp4, vo = f"/tmp/{fid}-review.mp4", f"{VO_DIR}/vo-{fid}.json"
    if not (os.path.exists(mp4) and os.path.exists(vo)):
        return [], []
    typo = typographic_beats(fid)
    cells = [(b + TYPE_TAG if b in typo else b, c) for b, c in frame_fill(mp4, vo)]
    return cells, [b for b, c in cells
                   if c is not None and c < FILL_MIN_CELLS and not b.endswith(TYPE_TAG)]


def fill_text(cells):
    return ", ".join(f"{b} {'?' if c is None else c}/48"
                     + ("" if c is None or c >= FILL_MIN_CELLS or b.endswith(TYPE_TAG) else " ✗")
                     for b, c in cells)


# ── gate 5: the motion plan (owner, 2026-10-07) ─────────────────────
# The digest got editorial direction on 2026-10-05 (skill digest-motion: one
# effect per spoken sentence, one motion grammar, cross-day memory) and the
# owner asked for the same in the feature clips. The agent plans one effect per
# beat in shots/<id>.motion.json (skill scripts/remotion-video/skills/
# feature-motion) and stages it with <MotionInsert>; the host checks the plan
# against the catalog and the composition, and remembers what each clip used.
MOTION_CATALOG = f"{REPO}/scripts/video-processor/skills/digest-motion/effects.json"
MOTION_MIN_EFFECTS = 3
MOTION_RECENT = 3


def motion_catalog():
    try:
        d = json.load(open(MOTION_CATALOG))
        return {e["name"] for e in d.get("effects", []) if e.get("motion")}
    except (OSError, ValueError, KeyError):
        return set()


def motion_plan(fid):
    try:
        return json.load(open(f"{SHOTS_DIR}/{fid}.motion.json"))
    except (OSError, ValueError):
        return None


def plan_effects(plan):
    return [b.get("effect") for b in (plan or {}).get("beats") or []
            if b.get("effect") and b.get("effect") != "drawn"]


def motion_ok(fid, src):
    """Gate 5 on the composition: plan present, catalog names, staged."""
    plan = motion_plan(fid)
    if not plan:
        return [f"shots/{fid}.motion.json is missing — plan one effect per beat first "
                "(scripts/remotion-video/skills/feature-motion/SKILL.md §1)"]
    try:
        nbeats = len(json.load(open(f"{VO_DIR}/vo-{fid}.json"))["timeline"])
    except (OSError, ValueError, KeyError):
        nbeats = 5
    effects = plan_effects(plan)
    cat = motion_catalog()
    probs = []
    bad = [e for e in effects if cat and e not in cat]
    if bad:
        probs.append("the motion plan names effects that are not in the catalog: " + ", ".join(bad))
    need = min(MOTION_MIN_EFFECTS, max(1, nbeats - 1))
    if len(set(effects)) < need:
        probs.append(f"the motion plan gives {len(set(effects))} beat(s) a catalog effect; "
                     f"at least {need} beats need one (feature-motion §1)")
    dup = sorted({e for e in effects if effects.count(e) > 1})
    if dup:
        probs.append("an effect is used twice in one clip: " + ", ".join(dup))
    missing = sorted(e for e in set(effects)
                     if not re.search(r'effect=\{?["\']%s["\']' % re.escape(e), src))
    if missing:
        probs.append("planned effects are not staged with <MotionInsert effect=…>: " + ", ".join(missing))
    spring_lines = [str(i) for i, line in enumerate(src.splitlines(), 1)
                    if re.search(r"\bspring\(", line)]
    if spring_lines:
        # 2026-10-09 p21: the fix round "found no spring()" because the call sat
        # in an old shared pop() helper — name the lines so the fix is exact.
        probs.append("spring() is retired — arrivals follow the motion grammar "
                     "(<Arrive kind=\"punch|wipe|rise\">, punchScale), feature-motion §3; "
                     f"remove every spring( call, also inside helpers (lines {', '.join(spring_lines[:8])})")
    return probs


def recent_motion(n=MOTION_RECENT):
    """What the last n published clips used — handed to the agent for variety."""
    out = psql("SELECT feature_id, motion_usage::text FROM features WHERE motion_usage IS NOT NULL "
               f"ORDER BY motion_usage->>'at' DESC LIMIT {n};")
    rows = []
    for line in (out or "").splitlines():
        fid, _, js = line.partition("|")
        try:
            u = json.loads(js)
        except ValueError:
            continue
        rows.append(f"{fid}: {', '.join(u.get('effects') or [])} (opened with {u.get('opener')})")
    return rows


def record_motion(fid):
    plan = motion_plan(fid)
    effects = plan_effects(plan)
    if not effects:
        return
    first = ((plan or {}).get("beats") or [{}])[0].get("effect")
    usage = json.dumps({"effects": effects, "opener": first,
                        "at": datetime.now(timezone.utc).isoformat(timespec="seconds")})
    psql(f"UPDATE features SET motion_usage = '{usage}'::jsonb WHERE feature_id = '{fid}'")


def load_quarantine():
    try:
        return json.load(open(QUARANTINE))
    except (OSError, ValueError):
        return {}


def quarantine(fid, reason):
    q = load_quarantine()
    q[fid] = {"reason": reason, "at": datetime.now(timezone.utc).isoformat(timespec="seconds")}
    json.dump(q, open(QUARANTINE, "w"), indent=1, ensure_ascii=False)


def release(fid):
    q = load_quarantine()
    if fid in q:
        del q[fid]
        json.dump(q, open(QUARANTINE, "w"), indent=1, ensure_ascii=False)


def unregister(comp):
    """Drop a composition's import and <Composition> entry from Root.tsx."""
    root = open(ROOT_TSX).read()
    root = re.sub(rf'^import \{{ {comp} \}} from "[^"]+";\n', "", root, flags=re.M)
    root = re.sub(rf'\n?      <Composition\n        id="{comp}"\n.*?/>\n', "\n", root, flags=re.S)
    open(ROOT_TSX, "w").write(root)


def discard(p):
    """Undo ONE feature's uncommitted work. The old `git checkout -- src`
    reverted every feature's files at once, so one rejected clip wiped the
    night's other two out of the commit."""
    files = [comp_path(p["composition"]), f"{SHOTS_DIR}/{p['id']}.json"]
    tracked = run("git ls-files -- " + " ".join(shlex.quote(f) for f in files),
                  cwd=REPO, check=False, user="stuar").split()
    for f in files:
        if os.path.relpath(f, REPO) in tracked:
            run(f"git checkout -q -- {shlex.quote(f)}", cwd=REPO, check=False, user="stuar")
        elif os.path.exists(f):
            os.remove(f)
    if p.get("newfile"):
        unregister(p["composition"])


def last_draws(n=2):
    """(archetype, mood) of the last n clips the factory made, from its own
    log — draw() only knew about the clips of the SAME night before, so two
    nights in a row could open with the same staging."""
    try:
        lines = [l for l in open(LOG, encoding="utf-8", errors="replace") if " picks: " in l]
        picks = json.loads(lines[-1].split(" picks: ", 1)[1])
        return [(p["archetype"], p["mood"]) for p in picks][-n:]
    except (OSError, ValueError, KeyError, IndexError):
        return []


def composition_for(fid):
    """Find the composition whose header claims this feature id."""
    out = run(f"grep -rl -E 'feature {fid}\\b' {RVID}/src/compositions/feature-demos/ "
              f"|| true", check=False)
    for line in out.splitlines():
        if line.endswith(".tsx"):
            return os.path.basename(line)[:-4]
    return None


ROOT_TSX = f"{RVID}/src/Root.tsx"


def ensure_registered(comp):
    """A stranded feature (k01 and g04 on 2026-09-16, v30 too) had its
    composition file and shots in git but no <Composition> entry in Root.tsx:
    the run that drew it died before the agent registered it, and the render it
    was sent "straight to" failed three times with "Could not find composition".
    Register it from the file header instead of trusting the marker."""
    root = open(ROOT_TSX).read()
    if f'id="{comp}"' in root:
        return True
    path = f"{RVID}/src/compositions/feature-demos/{comp}.tsx"
    if not os.path.exists(path):
        return False
    m = re.search(r"(\d+) frames @ 30fps", open(path).read(2000))
    if not m:
        return False
    frames = int(m.group(1))
    lines = root.split("\n")
    last_import = max(i for i, l in enumerate(lines) if l.startswith("import "))
    lines.insert(last_import + 1,
                 f'import {{ {comp} }} from "./compositions/feature-demos/{comp}";')
    root = "\n".join(lines)
    entry = (f'      <Composition\n        id="{comp}"\n        component={{{comp}}}\n'
             f'        durationInFrames={{{frames}}}\n        fps={{30}}\n'
             f'        width={{1280}}\n        height={{720}}\n      />\n\n')
    idx = root.rfind("    </>")
    root = root[:idx] + entry + root[idx:]
    open(ROOT_TSX, "w").write(root)
    log(f"{comp}: registered in Root.tsx ({frames} frames)")
    return True


def new_composition_name(fid, title):
    """A feature the factory picks for the first time (newest-first order,
    2026-09-07) has no composition yet. Name it from the title so the agent can
    create the file and register it in Root.tsx under exactly this id."""
    words = [w for w in re.sub(r"[^A-Za-z0-9 ]", " ", title.replace("'", "")).split()
             if len(w) > 1 and w.lower() not in {"a", "an", "the", "of", "to", "in", "on", "for",
                                  "and", "or", "my", "now", "not", "it", "its",
                                  "with", "from", "by", "that", "this", "is", "are",
                                  "feature", "features"}]
    core = "".join(w[:1].upper() + w[1:].lower() for w in words[:4]) or "Clip"
    return f"Feature{core}{fid.upper()}"


def draw(fid, recent):
    """STEP 0 of the batch brief: archetype and mood from the id, never
    repeating either of the last two clips."""
    idx = sum(ord(c) for c in fid) % 8
    while ARCHETYPES[idx] in [r[0] for r in recent[-2:]]:
        idx = (idx + 1) % 8
    h = 0
    for ch in fid:
        h = (h * 31 + ord(ch)) & 0xFFFFFFFF
    m = h % 5
    while MOODS[m] in [r[1] for r in recent[-2:]]:
        m = (m + 1) % 5
    return ARCHETYPES[idx], MOODS[m]


def wake(prompt, tag):
    """Queue a one-off task for the vitalii-no agent, due now."""
    now = datetime.now(timezone.utc)
    tid = f"task-{int(now.timestamp()*1000)}-{tag}{random.randint(1000,9999)}"
    content = json.dumps({
        "prompt": prompt,
        "script": "node --input-type=module -e "
                  "'console.log(JSON.stringify({wakeAgent:true,data:{}}))'",
    })
    c = sqlite3.connect(INBOUND)
    cur = c.cursor()
    seq = (cur.execute("select coalesce(max(seq),0)+1 from messages_in")
              .fetchone()[0])
    cur.execute(
        "insert into messages_in (id,seq,kind,timestamp,status,process_after,"
        "recurrence,series_id,tries,trigger,platform_id,channel_type,thread_id,"
        "content) values (?,?,'task',?,'pending',?,NULL,?,0,1,NULL,NULL,NULL,?)",
        (tid, seq, now.strftime("%Y-%m-%d %H:%M:%S"),
         now.isoformat(timespec="milliseconds").replace("+00:00", "Z"),
         tid, content))
    c.commit(); c.close()
    global _WAKE_ROWID
    try:
        oc = sqlite3.connect(OUTBOUND)
        _WAKE_ROWID = oc.execute("select coalesce(max(rowid),0) from messages_out").fetchone()[0]
        oc.close()
    except sqlite3.Error:
        pass
    log(f"queued {tid}")
    return tid


AGENT_DIR = INBOUND.split("/sess-")[0]
OUTBOUND = INBOUND.replace("inbound.db", "outbound.db")
# 0 = rotate before EVERY wave. Measured 2026-09-08 across all agents: the
# average gap between two compactions is 0.35-0.97 MB, so any threshold below
# that is "always" anyway — say so instead of pretending to measure. A fresh
# conversation costs one ping (~1 min); a dead wave costs the night.
TAIL_MAX_MB = 0


def conversation_tail_mb():
    """Bytes piled up in the agent's transcript since its last compaction —
    the number that decides whether the next wake can even open the
    conversation (see publish-watchdog.py). Returns (path, mb)."""
    files = glob.glob(f"{AGENT_DIR}/.claude-shared/projects/-workspace-agent/*.jsonl")
    if not files:
        return None, 0.0
    f = max(files, key=os.path.getsize)
    sizes, last = [], -1
    with open(f, "rb") as fh:
        for i, line in enumerate(fh):
            sizes.append(len(line))
            if b"compact_boundary" in line:
                last = i
    return f, sum(sizes[last + 1:]) / 1048576


def fresh_session(what):
    """Rotate the agent's conversation before a wave when the tail is big.
    2026-09-07 23:16 UTC: wave B died with 'Prompt is too long' at a 0.41 MB
    tail (the watchdog only warns at 0.55) after reading just 78 KB; the same
    brief had gone through fine the afternoon before on a freshly rotated
    conversation. Procedure = the one from the 2026-09-06 handoff: move the
    transcript aside, drop the session pointers, ping — the first wake clears
    the stale pointer, and the agent answers from a clean conversation."""
    f, mb = conversation_tail_mb()
    log(f"agent tail before {what}: {mb:.2f} MB")
    if f is None or (TAIL_MAX_MB > 0 and mb <= TAIL_MAX_MB):
        return True
    stamp = datetime.now(timezone.utc).strftime("%Y%m%d-%H%M")
    dest = f"{AGENT_DIR}/.claude-shared/projects/{os.path.basename(f)[:-6]}-ROTATED-{stamp}.jsonl.bak"
    os.rename(f, dest)
    for sj in glob.glob(f"{AGENT_DIR}/.claude-shared/sessions/*.json"):
        os.remove(sj)
    c = sqlite3.connect(OUTBOUND)
    before = c.execute("select coalesce(max(rowid),0) from messages_out").fetchone()[0]
    c.close()
    log(f"rotated conversation ({mb:.2f} MB tail) -> {os.path.basename(dest)}; pinging")
    wake("Reply with the single word OK. Do nothing else.", "ping")
    deadline = time.time() + 10 * 60
    while time.time() < deadline:
        c = sqlite3.connect(OUTBOUND)
        row = c.execute("select content from messages_out where rowid > ? "
                        "order by rowid desc limit 1", (before,)).fetchone()
        c.close()
        if row and "No conversation found" in row[0]:
            # The first wake after a rotation always fails this way — that is
            # the runner clearing the stale pointer; the next wake starts clean.
            log("stale session pointer cleared; the next wake starts a fresh conversation")
            return True
        if row and "OK" in row[0]:
            log("agent answered from a fresh conversation")
            return True
        time.sleep(15)
    log("agent did not answer the ping in 10 min — continuing anyway")
    return False


API = "https://api.github.com/repos/SmmShaman/vitalii-no-platform/actions"


def latest_run_id(tok):
    runs = json.loads(run(f'curl -s -H "Authorization: Bearer {tok}" '
                          f'"{API}/workflows/feature-clip.yml/runs?per_page=1"'))
    w = runs.get("workflow_runs") or [{}]
    return w[0].get("id")


def run_and_wait(fid, comp, upload, timeout=25 * 60):
    """Fire a render and block until GitHub finishes it. Returns (run id, conclusion).

    The run id is claimed by watching for one that did not exist before the
    dispatch, rather than by grabbing the newest — the newest can still be
    somebody else's run for a few seconds after POSTing."""
    tok = gh_token()
    before = latest_run_id(tok)
    dispatch(fid, comp, mode="render", upload=upload)
    rid = None
    for _ in range(20):
        time.sleep(6)
        cur = latest_run_id(tok)
        if cur and cur != before:
            rid = cur
            break
    if rid is None:
        log(f"{fid}: no new run appeared after dispatch")
        return None, "not_started"
    deadline = time.time() + timeout
    while time.time() < deadline:
        r = json.loads(run(f'curl -s -H "Authorization: Bearer {tok}" "{API}/runs/{rid}"'))
        if r["status"] == "completed":
            log(f"{fid}: run {rid} -> {r['conclusion']}")
            return rid, r["conclusion"]
        time.sleep(30)
    log(f"{fid}: run {rid} did not finish in time")
    return rid, "timed_out"


def fetch_contact_sheet(rid, fid):
    """Put the rendered contact sheet where the agent can open it."""
    tok = gh_token()
    arts = json.loads(run(f'curl -s -H "Authorization: Bearer {tok}" '
                          f'"{API}/runs/{rid}/artifacts"'))
    for a in arts.get("artifacts", []):
        if a["name"] == f"feature-{fid}":
            zp = f"/tmp/{fid}-art.zip"
            run(f'curl -sL -H "Authorization: Bearer {tok}" '
                f'-o {zp} "{a["archive_download_url"]}"')
            run(f"cd {MARKER_DIR} && unzip -o -q {zp} 'contact-*.jpg' && "
                f"chown stuar:stuar {MARKER_DIR}/contact-{fid}.jpg")
            # the clip itself, for the frame-fill gate
            run(f"cd /tmp && unzip -o -q {zp} 'feature-{fid}.mp4' && "
                f"mv -f /tmp/feature-{fid}.mp4 /tmp/{fid}-review.mp4", check=False)
            return f"{MARKER_DIR}/contact-{fid}.jpg"
    return None


QUOTA_SIGNS = ("out of extra usage", "usage limit", "hit your limit", "rate limit")
_WAKE_ROWID = 0


def agent_quota_hit():
    """The subscription behind every agent on this VPS is shared; when it runs
    dry the agent's task is marked completed and the only trace is one line in
    messages_out ("You're out of extra usage · resets 6:30pm (UTC)", 2026-09-07
    15:54). Returns that text, or None."""
    try:
        c = sqlite3.connect(OUTBOUND)
        rows = c.execute("select content from messages_out where rowid > ?",
                         (_WAKE_ROWID,)).fetchall()
        c.close()
    except sqlite3.Error:
        return None
    for (content,) in rows:
        low = content.lower()
        if any(sign in low for sign in QUOTA_SIGNS):
            try:
                return json.loads(content).get("text", content)[:160]
            except ValueError:
                return content[:160]
    return None


# 2026-10-12: every wave-B "TIMED OUT after 2700s" of 08-12.10 was the agent
# dying 9-25 min in with "Prompt is too long" (Claude Code's blocking limit:
# AUTO_COMPACT_WINDOW 165k - 20k output reserve - 3k = 142k; a burst of
# parallel file reads plus a 7k-token thinking turn jumped from under the
# compaction line straight past it). The task is then marked done and nothing
# more happens, so waiting out the timeout only burns the night.
# The limit itself was moved the same day for this agent group only:
# .claude-shared/settings.json env CLAUDE_CODE_AUTO_COMPACT_WINDOW=190000 +
# CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=78 -> compaction still at ~132k, blocking at ~167k.
_AGENT_FAIL = {"context": False}


def agent_context_hit():
    try:
        c = sqlite3.connect(OUTBOUND)
        rows = c.execute("select content from messages_out where rowid > ?",
                         (_WAKE_ROWID,)).fetchall()
        c.close()
    except sqlite3.Error:
        return False
    return any("prompt is too long" in content.lower() for (content,) in rows)


def wait_for(path, timeout, what):
    deadline = time.time() + timeout
    _AGENT_FAIL["context"] = False
    while time.time() < deadline:
        if os.path.exists(path):
            log(f"{what}: marker appeared after "
                f"{int(timeout - (deadline - time.time()))}s")
            return True
        hit = agent_quota_hit()
        if hit:
            log(f"{what}: agent reports the subscription is exhausted — {hit}")
            telegram(f"🏭 Завод став на {what}: підписка Claude вичерпана "
                     f"(«{hit}»). Нічого не рендерю; наступний прогін за таймером.")
            return False
        if agent_context_hit() and not os.path.exists(path):
            _AGENT_FAIL["context"] = True
            log(f"{what}: agent ran out of context (\"Prompt is too long\") after "
                f"{int(timeout - (deadline - time.time()))}s — not waiting out the timeout")
            return False
        time.sleep(30)
    log(f"{what}: TIMED OUT after {timeout}s")
    return False


def git(cmd):
    return run(f"git {cmd}", cwd=REPO, user="stuar")


def push():
    """origin may have moved while the agent worked (2026-09-07: a fix pushed
    from the PC mid-run made the narration push fail with "fetch first" and
    killed the night). Rebase our commits on top of origin first.

    2026-09-16: `git pull --rebase origin main` died with "Cannot rebase onto
    multiple branches" — FETCH_HEAD is shared with the agent container that
    mounts this clone and a concurrent fetch there left two merge heads in it.
    Rebase onto the remote-tracking ref instead (never reads FETCH_HEAD) and
    retry once before giving up."""
    for attempt in (1, 2):
        try:
            git("fetch -q origin main")
            git("rebase -q origin/main")
            git("push -q origin main")
            return
        except RuntimeError as exc:
            run("git rebase --abort", cwd=REPO, check=False, user="stuar")
            if attempt == 2:
                raise
            log(f"push: attempt {attempt} failed ({redact(str(exc))[:160]!r}); retrying in 20s")
            time.sleep(20)


QUOTA_FILE = "/home/stuar/nanoclaw-v2/data/quota.json"


def quota_until_ms():
    """nanoclaw records the subscription reset time it last saw from any agent
    (data/quota.json, written by its quota guard). While that is in the future
    every wake would only produce another 'out of extra usage' line."""
    try:
        d = json.load(open(QUOTA_FILE))
        until = float(d.get("untilMs", 0))
    except (OSError, ValueError, TypeError):
        return None
    return until if until > time.time() * 1000 else None


def main():
    q = quota_until_ms()
    if q:
        log("subscription quota exhausted until "
            f"{time.strftime('%Y-%m-%d %H:%M UTC', time.gmtime(q / 1000))} — skipping this run quietly")
        return 0
    if os.path.exists(LOCK):
        # A run killed by systemd (TimeoutStartSec -> SIGTERM) never reaches the
        # finally below, so the lock can outlive its owner. Trust it only while
        # the pid inside is still alive.
        try:
            os.kill(int(open(LOCK).read().strip()), 0)
            log("another run holds the lock — exiting")
            return 0
        except (ValueError, ProcessLookupError, PermissionError, OSError):
            log("stale lock from a dead run — removing it")
            os.remove(LOCK)
    open(LOCK, "w").write(str(os.getpid()))
    try:
        # --viewer=<id> --mp4=<path>: run only the blind viewer on a finished
        # clip (a test of the gate, or a second opinion on a published clip).
        viewer_id = next((a.split("=", 1)[1] for a in sys.argv if a.startswith("--viewer=")), None)
        if viewer_id:
            mp4 = next((a.split("=", 1)[1] for a in sys.argv if a.startswith("--mp4=")), None)
            os.makedirs(MARKER_DIR, exist_ok=True)
            run(f"chown -R stuar:stuar {MARKER_DIR}")
            stamp = datetime.now(timezone.utc).strftime("%Y%m%d-%H%M")
            v = wave_d({"id": viewer_id}, stamp, 1, mp4)
            print(json.dumps(v, ensure_ascii=False, indent=1))
            print("PASS" if v and viewer_pass(v) else "FAIL")
            return 0 if v and viewer_pass(v) else 1

        runway = int(psql("SELECT count(*) FROM features WHERE demo_style='bright' "
                          "AND bright_posted_at IS NULL AND status='published';"))
        log(f"runway = {runway}")
        if runway > RUNWAY_CEILING:
            log(f"runway above ceiling {RUNWAY_CEILING} — publishing may have "
                f"stopped; making nothing tonight")
            telegram(f"🏭 Завод пропустив ніч: запас {runway} кліпів вище стелі "
                     f"{RUNWAY_CEILING}. Схоже, публікація зупинилась — перевір публікатор.")
            return 0

        git("fetch origin --quiet && git reset --hard origin/main --quiet")
        # The agent runs as uid 1000 inside its container, which is stuar out
        # here. A marker dir created by root is invisible to it in the only way
        # that matters: it can read the path and cannot write the file.
        os.makedirs(MARKER_DIR, exist_ok=True)
        run(f"chown -R stuar:stuar {MARKER_DIR}")

        # Two honest markers, both files in git: beats-<id>.json exists exactly
        # when this factory has voiced a feature; shots/<id>.json exists exactly
        # when it has been re-shot in the live style. youtube_video_id is neither
        # (the upload runs hours later), which is how p21-p23 were re-rendered
        # two nights running before 2026-09-05.
        voiced = {f[len("beats-"):-len(".json")]
                  for f in os.listdir(VO_DIR) if f.startswith("beats-")}
        # Beats alone do not make a feature "voiced": a run killed between
        # wave A and wave B (2026-09-07) left beats-v32.json behind, and the
        # next run filed v32 under re-shoots — behind 14 older features —
        # instead of new. Only beats + a composition count.
        voiced = {f for f in voiced if composition_for(f)}
        os.makedirs(SHOTS_DIR, exist_ok=True)
        live = {f[:-len(".json")] for f in os.listdir(SHOTS_DIR) if f.endswith(".json")}
        # A quarantined clip (failed the frame-fill gate after its self-review)
        # has its files in git but is not live in any sense that matters: it
        # goes back through wave B as a re-shoot instead of straight to render.
        quar = load_quarantine()
        if quar:
            log(f"quarantined: {sorted(quar)}")
        live -= set(quar)
        rows = [r.split("|") for r in psql(FEATURES_SQL).splitlines() if r]
        bright = {r[0] for r in rows if r[1] == "bright"}
        stranded = (voiced & live) - bright
        # --only=<id>: re-shoot exactly this feature (a comparison render for
        # the owner, or a hand-picked redo); with --no-publish the clip is
        # rendered and kept under COMPARE_DIR, R2 and the DB untouched.
        only = next((a.split("=", 1)[1] for a in sys.argv if a.startswith("--only=")), None)
        no_publish = "--no-publish" in sys.argv
        if only:
            chosen = [r for r in rows if r[0] == only]
            stranded = set()
            if not chosen:
                log(f"--only={only}: no published feature with that id")
                return 1
        else:
            chosen = choose(rows, voiced, live, runway, stranded)
        log(f"voiced: {len(voiced)}, live: {len(live)}, published: {len(rows)}, "
            f"stranded: {sorted(stranded)}; picking {len(chosen)}")
        picks = []
        recent = last_draws()
        recent_fx = recent_motion()
        for row in chosen:
            fid, style, title = row[0], row[1], row[2]
            finish = fid in stranded
            # A stranded feature is NEW material for the publisher: not a redo,
            # so it gets its queue row and its YouTube upload like any new clip.
            redo = fid in voiced and not finish
            comp = composition_for(fid)
            newfile = comp is None
            if newfile:
                comp = new_composition_name(fid, title)
                log(f"{fid}: no composition yet -> agent will create {comp}.tsx")
            arche, mood = draw(fid, recent)
            recent.append((arche, mood))
            urls = recordable_urls(row)
            picks.append({"id": fid, "style": style, "title": title, "redo": redo,
                          "composition": comp, "newfile": newfile, "archetype": arche,
                          "mood": mood, "urls": urls, "youtube": bool(row[7]), "yt_id": row[7],
                          "finish": finish, "slug": row[3], "repo": row[4],
                          "commits": row[5], "created": row[8], "project": row[9],
                          "name": row[10] if len(row) > 10 else "",
                          "desc": row[11] if len(row) > 11 else ""})
            if finish:
                log(f"{fid}: stranded (voiced + drawn, never published) -> straight to render")
        if not picks:
            log("nothing left to make")
            telegram("🏭 Завод: усі фічі вже зняті в новому стилі. Черга вичерпана.")
            return 0
        log("picks: " + json.dumps(picks, ensure_ascii=False))
        if "--plan" in sys.argv:
            print(json.dumps(picks, ensure_ascii=False, indent=1))
            return 0

        stamp = datetime.now(timezone.utc).strftime("%Y%m%d-%H%M")
        mark_a = f"{MARKER_DIR}/waveA-{stamp}.done"

        # ── wave A: the narration (new features only; a re-shoot keeps its voice)
        # A feature whose beats already sit in git (a run killed after wave A)
        # keeps them — narration is not rewritten, only the picture is missing.
        fresh = [p for p in picks if not p["redo"]
                 and not os.path.exists(f"{VO_DIR}/beats-{p['id']}.json")]
        if fresh:
            fresh_session("wave A")
            lines = "\n".join(
                f"- **{p['id']}** — {p['title']}" for p in fresh)
            wake(WAVE_A_PROMPT.format(features=lines, marker=to_container(mark_a),
                                      rvid=CONTAINER_RVID,
                                      ids=", ".join(p["id"] for p in fresh)), "wa")
            if not wait_for(mark_a, WAVE_A_TIMEOUT, "wave A"):
                telegram("🏭 Завод став на хвилі A: агент не написав озвучку вчасно. "
                         "Нічого не опубліковано.")
                return 1

        # ── host: measure ────────────────────────────────────────────────
        tables = []
        for p in picks:
            beats = f"{VO_DIR}/beats-{p['id']}.json"
            if not os.path.exists(beats):
                log(f"{p['id']}: no beats file — dropping from tonight's batch")
                continue
            vo_path = f"{VO_DIR}/vo-{p['id']}.json"
            if os.path.exists(vo_path):
                # The picture is rewritten against the SAME windows the runner
                # will verify the rebuilt voice against — never re-measure here.
                # (Also true for a new feature whose beats survived a killed run.)
                m = json.load(open(vo_path))
                log(f"{p['id']}: keeping the committed measurement")
            else:
                out = run(f"cd {RVID} && VO_OUT_ROOT=/root/feature-demos python3 "
                          f"vo-scripts/vo-beats.py {beats}")
                m = json.loads(out)
                open(vo_path, "w").write(json.dumps(m, indent=1))
            p["frames"] = m["durationInFrames"]
            rowsmd = "\n".join(
                f"| {b['beat']} | {b['start_f']}–{b['end_f']} | {b['text']} |"
                for b in m["timeline"])
            urlmd = "\n".join(f"- {what}: `{u}`" for what, u in p["urls"]) or "- (none verified)"
            p["table"] = (
                f"### {p['id']} — `{p['composition']}` — durationInFrames = "
                f"**{m['durationInFrames']}**"
                + (" — RE-SHOOT: keep the narration, rewrite the picture" if p["redo"] else "")
                + (" — NEW FILE: this composition does not exist yet; create "
                   f"`src/compositions/feature-demos/{p['composition']}.tsx` with the header "
                   f"line `{p['composition']} — feature {p['id']} — …` (the factory finds the file "
                   "by that `feature <id>` header) and register it in `src/Root.tsx` under exactly "
                   f"this id" if p.get("newfile") else "")
                + f"\narchetype **{p['archetype']}**, mood **{p['mood']}**\n\n"
                f"| beat | frames | words |\n|---|---|---|\n{rowsmd}\n\n"
                f"Verified public pages you may record (answered 2xx/3xx tonight):\n{urlmd}\n\n"
                "Motion (feature-motion skill): plan `shots/" + p["id"] + ".motion.json` first. "
                "Recent effects — prefer others, never open b1 with the previous opener:\n"
                + ("\n".join(f"- {r}" for r in recent_fx) or "- (none recorded yet)") + "\n\n"
                + materials(p))
            tables.append(p["table"])
            log(f"{p['id']}: measured {m['durationInFrames']} frames")
        picks = [p for p in picks if "frames" in p]
        if not picks:
            telegram("🏭 Завод: жодного виміру не вийшло. Нічого не опубліковано.")
            return 1

        git("add -A scripts/remotion-video/vo-scripts/feature-vo")
        git('-c user.name="feature-factory" -c user.email="factory@vitalii.no" '
            'commit -q -m "feat(feature-vo): narration measured for tonight\'s batch" '
            '|| true')
        push()

        # ── wave B: the pictures — ONE feature per task ──────────────────
        # A brief for three features (two of them new files) overflowed the
        # agent's context twice (2026-09-07 15:54 and 23:16 UTC). One feature
        # per conversation keeps every request small; a feature that still
        # fails is dropped alone instead of taking the night with it.
        drawn = []
        for p in picks:
            if p.get("finish"):
                # composition + shots already in git — but make sure Root.tsx
                # knows the composition, or the render dies (2026-09-16 k01/g04)
                if ensure_registered(p["composition"]):
                    drawn.append(p)
                else:
                    log(f"{p['id']}: composition file missing or unreadable — dropped")
                continue
            mark = f"{MARKER_DIR}/waveB-{stamp}-{p['id']}.done"
            fresh_session(f"wave B {p['id']}")
            brief = (WAVE_B_PROMPT.format(tables=p["table"], marker=to_container(mark),
                                          rvid=CONTAINER_RVID, ids=p["id"])
                     + WAVE_B_BUDGET + compact_catalog())
            wake(brief, "wb")
            ok = wait_for(mark, WAVE_B_FEATURE_TIMEOUT, f"wave B {p['id']}")
            if not ok and _AGENT_FAIL["context"]:
                log(f"{p['id']}: wave B retry on a fresh conversation (lean reading)")
                fresh_session(f"wave B {p['id']} retry")
                wake(brief + WAVE_B_RETRY, "wbr")
                ok = wait_for(mark, WAVE_B_FEATURE_TIMEOUT, f"wave B {p['id']} retry")
            if ok:
                drawn.append(p)
            else:
                log(f"{p['id']}: dropped — composition not delivered")
        picks = drawn
        if not picks:
            telegram("🏭 Завод став на хвилі B: агент не дописав жодної композиції. "
                     "Озвучка збережена, кліпи НЕ відрендерені.")
            return 1

        # A clip without a valid shots file is a drawn clip — not the rule any
        # more. Check the spec and every URL here, where it is cheap, instead of
        # discovering a 404 inside a 25-minute render.
        kept = []
        for p in picks:
            probs = shots_ok(p["id"])
            if probs:
                log(f"{p['id']}: shots file rejected — " + "; ".join(probs))
                telegram(f"🏭 {p['id']}: агент не дав чинного shots/{p['id']}.json "
                         f"({'; '.join(probs)[:200]}). Кліп цієї ночі пропущено.")
                discard(p)
                continue
            kept.append(p)
        picks = kept
        if not picks:
            telegram("🏭 Завод: жоден кліп не пройшов перевірку shots-файлів. Нічого не опубліковано.")
            return 1

        # ── directing gates on the composition (2026-09-21) ─────────────
        # Archetype named and matching the draw, hero-number really a hero,
        # last beat not the feature's own page, ZWJ emoji reduced. One fix
        # round per clip, then the clip is discarded for the night.
        kept = []
        for p in picks:
            probs = composition_ok(p["id"], p["composition"], p["archetype"], p["slug"])
            if probs:
                log(f"{p['id']}: directing gate — " + "; ".join(probs))
                mark = f"{MARKER_DIR}/waveB2-{stamp}-{p['id']}.done"
                fresh_session(f"wave B2 {p['id']}")
                wake(WAVE_B2_PROMPT.format(fid=p["id"], comp=p["composition"],
                                           archetype=p["archetype"], mood=p["mood"],
                                           problems="\n".join(f"- {x}" for x in probs),
                                           marker=to_container(mark), rvid=CONTAINER_RVID), "wb2")
                if wait_for(mark, WAVE_B_FEATURE_TIMEOUT, f"wave B2 {p['id']}"):
                    probs = composition_ok(p["id"], p["composition"], p["archetype"], p["slug"]) \
                        + shots_ok(p["id"])
            if probs:
                log(f"{p['id']}: directing gate failed twice — dropped: " + "; ".join(probs))
                telegram(f"🏭 {p['id']}: кліп не пройшов режисерську перевірку двічі "
                         f"({'; '.join(probs)[:300]}). Цієї ночі пропущено; фіча лишається в пулі.")
                discard(p)
                continue
            kept.append(p)
        picks = kept
        if not picks:
            telegram("🏭 Завод: жоден кліп не пройшов режисерську перевірку. Нічого не опубліковано.")
            return 1

        git("add -A scripts/remotion-video/src")
        git('-c user.name="feature-factory" -c user.email="factory@vitalii.no" '
            'commit -q -m "feat(feature-demos): tonight\'s clips" || true')
        push()

        # ── wave C: the agent looks at its own work ──────────────────────
        # The gap that cost three rework rounds on 2026-09-03 is that an agent
        # writes a clip blind and never sees a frame of it. Every standard that
        # is not spelled out in the brief therefore surfaces only on a human's
        # screen, after the fact. So: render once without publishing, hand each
        # agent its own contact sheet, let it fix what it can see, then publish.
        sheets = []
        for p in picks:
            rid, concl = run_and_wait(p["id"], p["composition"], upload="false")
            p["review_run"] = rid
            if concl != "success" or rid is None:
                log(f"{p['id']}: review render {concl} — skipping self-check")
                continue
            sheet = fetch_contact_sheet(rid, p["id"])
            if sheet:
                sheets.append((p, sheet))
                log(f"{p['id']}: contact sheet at {sheet}")
                # gate 3, measured: the agent gets numbers, not an opinion
                p["fill"], p["fill_bad"] = fill_report(p["id"])
                if p["fill"]:
                    log(f"{p['id']}: frame fill {fill_text(p['fill'])}")

        if sheets:
            listing = "\n".join(
                f"- **{p['id']}** (`{p['composition']}`, archetype {p['archetype']}, "
                f"mood {p['mood']}) — your frames: `{to_container(sheet)}`"
                + (f"\n  measured frame fill at each beat's midpoint (cells of 48 touched; "
                   f"{FILL_MIN_CELLS} is the line): {fill_text(p['fill'])}"
                   + (" — the ✗ beats are EMPTY; fill the canvas there" if p.get("fill_bad") else "")
                   if p.get("fill") else "")
                for p, sheet in sheets)
            mark_c = f"{MARKER_DIR}/waveC-{stamp}.done"
            fresh_session("wave C")
            wake(WAVE_C_PROMPT.format(listing=listing, marker=to_container(mark_c),
                                      rvid=CONTAINER_RVID), "wc")
            if wait_for(mark_c, WAVE_B_TIMEOUT, "wave C"):
                git("add -A scripts/remotion-video/src")
                git('-c user.name="feature-factory" -c user.email="factory@vitalii.no" '
                    'commit -q -m "fix(feature-demos): self-review pass" || true')
                push()
            else:
                log("wave C timed out — publishing the clips as they stand")

        # ── gate 3 after the self-review: re-render what was empty ───────
        # A clip whose frames were empty before wave C is rendered once more
        # and measured again. Still empty (two or more beats under the line)
        # → quarantined: not published tonight, re-shot through wave B on a
        # later night. With --no-publish every clip is re-rendered and kept
        # under COMPARE_DIR for the owner to look at.
        # Since wave D exists (2026-09-21) every clip is rendered once more
        # after the self-review, because the viewer must see the picture that
        # will actually ship, not the one wave C was fixing.
        def rerender(p):
            rid, concl = run_and_wait(p["id"], p["composition"], upload="false")
            if concl != "success" or rid is None:
                log(f"{p['id']}: re-check render {concl}")
                return False
            fetch_contact_sheet(rid, p["id"])
            cells, bad = fill_report(p["id"])
            log(f"{p['id']}: frame fill {fill_text(cells)}")
            if len(bad) > FILL_MAX_BAD:
                p["gate_fail"] = f"empty frames after self-review: {fill_text(cells)}"
                return False
            return True

        for p in picks:
            if not rerender(p):
                if not p.get("gate_fail"):
                    p["gate_fail"] = "re-check render failed"
                continue
            # ── wave D: a blind viewer judges the clip; one fix round ────
            for rnd in range(1, VIEWER_ROUNDS + 1):
                v = wave_d(p, stamp, rnd)
                p["verdict"] = v
                if v is None:
                    log(f"{p['id']}: viewer gave no verdict — publishing on the other gates")
                    break
                if viewer_pass(v):
                    break
                if rnd == VIEWER_ROUNDS:
                    p["gate_fail"] = f"blind viewer round {rnd}: {viewer_text(v)}"
                    break
                mark = f"{MARKER_DIR}/waveD{rnd}fix-{stamp}-{p['id']}.done"
                fresh_session(f"wave D{rnd} fix {p['id']}")
                wake(WAVE_D2_PROMPT.format(
                    fid=p["id"], comp=p["composition"], rvid=CONTAINER_RVID,
                    verdict=json.dumps(v, ensure_ascii=False, indent=1)[:3000],
                    materials=materials(p), marker=to_container(mark)), f"wd{rnd}f")
                if not wait_for(mark, WAVE_B_FEATURE_TIMEOUT, f"wave D{rnd} fix {p['id']}"):
                    p["gate_fail"] = f"viewer round {rnd} failed and the fix did not arrive"
                    break
                probs = composition_ok(p["id"], p["composition"], p["archetype"], p["slug"]) \
                    + shots_ok(p["id"])
                if probs:
                    p["gate_fail"] = "after the viewer fix: " + "; ".join(probs)
                    break
                git("add -A scripts/remotion-video/src")
                git('-c user.name="feature-factory" -c user.email="factory@vitalii.no" '
                    'commit -q -m "fix(feature-demos): viewer-driven pass" || true')
                push()
                if not rerender(p):
                    if not p.get("gate_fail"):
                        p["gate_fail"] = "render after the viewer fix failed"
                    break
            if no_publish and not p.get("gate_fail"):
                os.makedirs(COMPARE_DIR, exist_ok=True)
                p["compare"] = f"{COMPARE_DIR}/feature-{p['id']}-{stamp}.mp4"
                run(f"cp /tmp/{p['id']}-review.mp4 {p['compare']}", check=False)
        for p in [p for p in picks if p.get("gate_fail")]:
            quarantine(p["id"], p["gate_fail"])
            log(f"{p['id']}: QUARANTINED — {p['gate_fail']}")
            telegram(f"🏭 {p['id']}: після self-review кадри досі порожні "
                     f"({p['gate_fail'][:200]}). Не опубліковано, у карантині — "
                     f"буде перезнято іншої ночі.")
        picks = [p for p in picks if not p.get("gate_fail")]
        if no_publish:
            where = ", ".join(f"{p['id']} → {p.get('compare', '(no render)')}" for p in picks)
            log(f"--no-publish: R2 and DB untouched; clips at {where or '—'}")
            telegram(f"🏭 Порівняльний рендер готовий (R2 і БД не чіпав): {where or '—'}")
            return 0
        if not picks:
            telegram("🏭 Завод: жоден кліп не пройшов перевірку заповнення кадру. Нічого не опубліковано.")
            return 1

        # ── publish ──────────────────────────────────────────────────────
        sent = []
        for p in picks:
            p["etag_before"] = r2_etag(p["id"])
            code = dispatch(p["id"], p["composition"], mode="render", upload="true")
            sent.append(f"{p['id']} ({p['composition']}) → HTTP {code}")
            log(f"dispatched {p['id']}: {code}")
            time.sleep(5)

        # The dispatch above only STARTS a render; the R2 object lands ~10 min
        # later. Before 2026-09-07 the code below downloaded the key right away,
        # i.e. whatever was on R2 from before (the old clip, or nothing for a
        # feature rendered for the first time). Wait for the new object, then
        # tell the database about it — nothing else does: feature-clip.yml
        # writes R2 only, and a feature that never had a clip stays invisible to
        # the site and to the publisher (demo_style/demo_media_url NULL).
        for p in picks:
            if not wait_for_r2(p["id"], p["etag_before"]):
                log(f"{p['id']}: R2 object did not change in time — DB not updated, not queued")
                p["published"] = False
                continue
            p["published"] = True
            psql("UPDATE features SET demo_media_url = "
                 f"'{R2_PUBLIC}/features/feature-{p['id']}.mp4', "
                 "demo_media_type = 'video/mp4', demo_style = 'bright', "
                 f"updated_at = now() WHERE feature_id = '{p['id']}' "
                 "AND (demo_style IS DISTINCT FROM 'bright' OR demo_media_url IS NULL)")
            log(f"{p['id']}: R2 updated, features row marked bright")
            record_motion(p["id"])
            release(p["id"])
            if not p["redo"]:
                # Newest-first applies to the posts too (owner, 2026-09-07):
                # the publisher orders by feature_video_repost_queue.scheduled_for
                # first, so a fresh clip gets a row dated today and airs next,
                # ahead of the August backlog. v33/v32 were queued by hand.
                psql("INSERT INTO feature_video_repost_queue (feature_id, video_url, "
                     "scheduled_for, status) SELECT "
                     f"'{p['id']}', '{R2_PUBLIC}/features/feature-{p['id']}.mp4', "
                     "current_date, 'pending' WHERE NOT EXISTS (SELECT 1 FROM "
                     f"feature_video_repost_queue WHERE feature_id = '{p['id']}' "
                     "AND status = 'pending')")
                log(f"{p['id']}: queued at the head of the publisher's order")
                # Owner rule 2026-09-23: a clip the blind viewer PASSED airs before
                # every clip that was never checked. The publisher orders by the
                # pending queue row's scheduled_for, so a passed clip takes a date
                # one day before the earliest pending row; unchecked clips keep
                # today's date and therefore fall to the back.
                if p.get("verdict") and viewer_pass(p["verdict"]):
                    psql("UPDATE feature_video_repost_queue SET scheduled_for = "
                         "(SELECT least(coalesce(min(scheduled_for), current_date), current_date) - 1 "
                         " FROM feature_video_repost_queue WHERE status = 'pending') "
                         f"WHERE feature_id = '{p['id']}' AND status = 'pending'")
                    log(f"{p['id']}: viewer-passed — moved to the FRONT of the publisher's order")

        # Hand the clips to the YouTube runner (feature-yt-queue.timer, 09:30).
        # It is what writes youtube_video_id back, which is what puts the sound
        # button on the site and the video link in the post.
        queued = []
        for p in picks:
            if not p.get("published"):
                continue
            meta = f"{VO_DIR}/meta-{p['id']}.json"
            if not os.path.exists(meta):
                log(f"{p['id']}: no meta-{p['id']}.json — not queued for YouTube")
                continue
            if p["redo"] and p["youtube"]:
                # Owner rule 2026-09-23: the stale YouTube copy of a re-shot clip
                # is replaced. reupload.txt ("<id>|<old video id>") is what the
                # queue runner promotes into its free daily slots; with the
                # full-scope token it deletes the old video after the new one
                # is up and writes the new id to the DB (upload_queue.sh 2b).
                try:
                    run(f"cp {meta} /root/feature-demos/yt/meta-{p['id']}.json")
                    run(f"curl -sfL {R2_PUBLIC}/features/feature-{p['id']}.mp4 "
                        f"-o /root/feature-demos/yt/yt-feature-{p['id']}.mp4")
                    run(f"grep -q '^{p['id']}|' /root/feature-demos/yt/reupload.txt 2>/dev/null "
                        f"|| echo '{p['id']}|{p['yt_id']}' >> /root/feature-demos/yt/reupload.txt")
                    log(f"{p['id']}: re-shoot — YouTube copy {p['yt_id']} queued for replacement")
                except Exception as e:
                    log(f"{p['id']}: could not queue the YouTube replacement: {e!r}")
                continue
            try:
                run(f"cp {meta} /root/feature-demos/yt/meta-{p['id']}.json")
                run(f"curl -sfL {R2_PUBLIC}/features/feature-{p['id']}.mp4 "
                    f"-o /root/feature-demos/yt/yt-feature-{p['id']}.mp4")
                run(f"grep -qx {p['id']} /root/feature-demos/yt/queue.txt 2>/dev/null "
                    f"|| echo {p['id']} >> /root/feature-demos/yt/queue.txt")
                queued.append(p["id"])
            except Exception as e:
                log(f"{p['id']}: could not queue for YouTube: {e!r}")
        log(f"queued for YouTube: {queued}")

        telegram("🏭 <b>Нічний завод відпрацював</b> (live UI: "
                 + ", ".join(f"{p['id']}{' ↻' if p['redo'] else ''}" for p in picks) + ")\n"
                 + "\n".join(f"• {s}" for s in sent)
                 + f"\n\nЗапас був {runway}. У черзі YouTube: "
                   f"{', '.join(queued) if queued else '—'} (аплоад о 09:30). "
                   f"Кожен кліп прийде окремою смужкою кадрів, коли відрендериться.")
        return 0
    finally:
        try:
            os.remove(LOCK)
        except OSError:
            pass


WAVE_A_PROMPT = """FEATURE CLIP FACTORY — WAVE A: write the narration only.

You are the nightly clip factory for vitalii.no. Tonight's three features:

{features}

Work in `{rvid}` — that is where this repo is mounted for you. Use that exact
path; paths from the host filesystem do not exist in your container.

Read `docs/feature-demos-pipeline.md` section on voicing and
`out/lux-batch-instructions.md` STEP 0b before writing.

For EACH of the three features, write `vo-scripts/feature-vo/beats-<id>.json`:

```json
{{"id": "<id>", "voice": "en-US-AndrewNeural", "beats": [
  ["b1", "..."], ["b2", "..."], ["b3", "..."], ["b4", "..."], ["b5", "..."]
]}}
```

Rules for the words, from the owner:
- 4 to 6 beats, about 70–80 words TOTAL. It is heard, not read: short sentences.
- Beat 1 is the HUMAN problem, never the technology.
- Exactly ONE tech name in the whole script. One plain analogy, at most.
- The last beat ends on the number from the feature's own result. Never invent one.
- Do NOT name specific AI model versions — several are years out of date in the
  stored text and the owner has flagged this before. Say "image generation",
  not a vendor's model name.

Get each feature's real problem/solution/result from the database:
`curl -s https://db-portfolio.vitalii.no/rest/v1/rpc/exec_sql -X POST -H 'Content-Type: application/json' -H 'Authorization: Bearer x' -H 'apikey: x' -d '{{"query":"SELECT feature_id,title_en,problem_en,solution_en,result_en,tech_stack FROM features WHERE feature_id IN (...)"}}'`
String literals in that SQL need DOUBLE-dollar quoting: `$$p20$$`, never `$p20$`.

ALSO write `vo-scripts/feature-vo/meta-<id>.json` for each — the YouTube SEO, without
which the clip never gets a video id and this factory would pick the same feature again
tomorrow. Copy the shape of `meta-p20.json` exactly: `id`, `file` (`yt-feature-<id>.mp4`),
`title` (≤70 chars, ends `| vitalii.no`), `description` (three or four paragraphs: the
human problem, what was built, the numbers, then the links block from meta-p20.json with
this feature's slug), `tags` (10-12 lowercase phrases).
NEVER put < or > in the title or description: YouTube reads them as markup and
rejects the whole upload with 400 invalidDescription, which stops the queue for
every clip behind it (p23, 2026-09-06). Write a path placeholder with square
brackets: supabase/functions/[name]/index.ts

Write ONLY those JSON files. Do not touch compositions, Root.tsx or git —
the host commits for you and measures the timing. When all three exist, write
the marker file `{marker}` containing the three ids, and stop.

Features tonight: {ids}
"""

WAVE_B_PROMPT = """FEATURE CLIP FACTORY — WAVE B: draw the clips.

The narration for tonight's clips has been generated and MEASURED. These frame
windows ARE the audio — they are not a suggestion and not a starting point.

{tables}

Work in `{rvid}` — that is where this repo is mounted for you. Use that exact
path; paths from the host filesystem do not exist in your container.
Read `out/lux-batch-instructions.md` in full first — it is the canonical brief for how a clip is built.

For EACH feature above, rewrite its composition file completely
(`src/compositions/feature-demos/<Composition>.tsx`, keeping the export name),
and set its `durationInFrames` in `src/Root.tsx` to the number given.
A feature marked NEW FILE has no composition yet: create the file under the
name given (export a component of that exact name, first header line
`<Composition> — feature <id> — 1280x720, <frames> frames @ 30fps, VOICE-SYNCED.`)
and add a `<Composition id="<Composition>" …>` entry to `src/Root.tsx` with the
same fps/width/height as the other feature clips. The render is dispatched by
that id, so the name must match to the letter.

Use the archetype and mood given for each — they were drawn already; do not
re-draw them and do not edit `out/lux-archetypes.md`. Wrap each tree in
`<PaletteProvider value={{MOODS.<mood>}}>`.

**THE RULE SINCE 2026-09-06 — UI beats play the REAL product.** Read STEP 0c of
`out/lux-batch-instructions.md` and the reference pair
`src/compositions/feature-demos/FeatureTraceabilityScannerLive.tsx` +
`src/compositions/feature-demos/shots/p61.json`. For EACH feature you must also write
`src/compositions/feature-demos/shots/<id>.json` and stage every interface beat with
`<LiveWindow>` from `live-primitives.tsx` playing one of its shots. Use ONLY the
verified URLs listed under the feature above — no other page, no admin panel; a
URL that does not answer fails the whole render. The feature's own page and the
hub are always there; a real commit diff is the strongest shot for a backend
feature. Metaphor beats stay drawn. A feature marked RE-SHOOT keeps its beats
and windows exactly; you rewrite only the picture. Do NOT record anything
yourself and do NOT create files under `public/rec` — the GitHub runner records.
Frames in a shot are numbered `0 … frames-1`: the LAST keyframe of every `scroll`
and `mouse` list and every `clicks` entry must be at most `frames - 1` (a shot with
`frames: 232` ends its keyframes at 231, never 232). The recorder rejects anything
past that, and the whole feature is dropped for the night.

The four defects that failed review on earlier clips, all of which you must avoid:
1. **Content left over from the previous beat.** Every element must be gone when
   the next window opens. Since 2026-10-07 the rule is a CUT, not a fade:
   `cut(frame, start, nextStart)` from `motion-primitives.tsx` (visible from the
   beat's first frame to the next beat's first frame, no exit fade).
2. **Never use `loopFade`.** It darkens the tail so a 15 s loop can seam. These
   clips do not loop; a dimming tail is a defect. The last beat holds at full
   opacity through the final frame.
3. **No text may be cropped by the frame edge**, at any moment, including during
   camera moves. Panels may run off; a word may not.
4. Sameness. The staging must follow the drawn archetype, not the centered
   headline plus icon-row layout that every August clip used.

Also: single-codepoint emoji only (ZWJ sequences split into two glyphs in
headless Chrome), real plausible mockup data, exactly ONE small tech caption per
clip, English captions, numbers are the heroes, and at least one beat change per
clip that is not a crossfade.

**MOTION DIRECTION SINCE 2026-10-07 — the digest's editorial effects.** Read
`scripts/remotion-video/skills/feature-motion/SKILL.md` before you write anything,
and the reference clip `src/compositions/feature-demos/FeatureFirst20SecondsUsedP75Motion.tsx`
with its plan `shots/p75.motion.json`. For each feature:
1. Write `src/compositions/feature-demos/shots/<id>.motion.json` FIRST — one entry per
   beat: the effect chosen by what should CHANGE on screen while that sentence is
   spoken (catalog: `scripts/video-processor/skills/digest-motion/effects.json`,
   `motion: true`), its backdrop shot, its data from the feature text only.
   At least 3 beats get a catalog effect; no effect twice in a clip.
2. Stage each planned effect with `<MotionInsert effect="…" from={{B}} dur={{next-B}} …/>`
   over `<LiveBackdrop>` (the real product as evidence) or a dark `base`. The drawn
   archetype becomes the element that survives every beat (p75: the flow-map lower
   third under the effects, y ≥ 600).
3. Your own pieces move by the grammar: `<Arrive kind="punch|wipe|rise">`, one mover at
   a time, a still reading hold ≥ 1.2 s at the end of each beat, no `spring()`.
The host checks gate 5: plan present, names in the catalog, each planned effect staged.

**FOUR GATES THE HOST CHECKS MECHANICALLY before anything is rendered (added
2026-09-21 after the owner reviewed j77 and v27 — both had passed every sync
check and still failed on sight). A clip that fails gets one fix round and is
then dropped for the night:**
1. The header comment of the composition must literally say `archetype <N> …`
   with the number drawn above, and the staging must BE that archetype — j77 was
   drawn split-duel and written as a timeline ribbon. For archetype 7
   (hero-number) the figure must use `fontSize` ≥ 200 and own the frame; a 112px
   number in a corner beside a browser window is the retired layout with a badge.
2. The LAST beat must not play the feature's own article page
   (`vitalii.no/features/<slug>`) NOR the features hub (`vitalii.no/features`):
   small text, or a scroll past other features with their own numbers, is not
   a result — every blind viewer on 2026-09-22 flagged the hub ending. End on
   THIS feature's result: a `LogWindow` with its real lines, the product's own
   screen, or a drawn result with several labelled objects (the before/after
   numbers, the list that is now complete). The feature page or the hub may be
   used in an earlier beat.
3. The frame must be FILLED at every beat: the host measures the review render
   (cells of an 8x6 grid touched at each beat's midpoint; under 31 of 48 is
   empty) and a clip that is still empty after the self-review is not published.
   Three small panels floating in cream space (j77 beats 1-3) is what fails.
4. ZWJ emoji are reduced to their first codepoint by the host — pick a single-
   codepoint emoji yourself so the picture is what you intended.

**THE VIEWER TEST (wave D, 2026-09-21).** After the self-review a separate agent
that knows NOTHING about this project watches the frames with the transcript and
scores clarity (1–10) and how well the clip answers its own search title. Under 7
on either the clip is not published. Two blind viewers rated the previous j77 3/10
and 5/10 for these exact reasons — build against them:
- **The first beat names the product in one plain line** (a small plate, e.g.
  "JobBot — applies to jobs in Norway on its own"). The product line is given
  under "Product:" above. Viewers had to infer the maker from 9 px browser chrome.
- **Evidence must say what the words say.** The commit list above carries each
  commit's message: show a commit only in the beat whose sentence it proves. A
  diff is allowed only ZOOMED so that one hunk of ≤ 6 lines is readable
  (`zoom` 2.0–2.4 with `focus` on the hunk); an unreadable full-page diff is a
  defect. If no commit proves the sentence, draw the mechanism (a schematic with
  the REAL names from the feature text) instead.
- **Show the product running with `LogWindow`** from `live-primitives.tsx`
  (`<LogWindow lines={{[{{t:"02:14", text:"wake #4 → 0 sent", tone:"danger"}}, …]}}
  title="jobbot-worker" from={{599}} every={{14}} opacity={{b4}} win={{…}} />`): 5–8
  real lines, revealed one by one, fontSize ≥ 20. Use the log lines given above
  verbatim; when none are given, build them from the feature's own numbers.
  This is what the viewers asked for: "show it working, not a screenshot".
- **No element may sit unchanged for more than one beat** (the old j77 kept a
  "not built yet" placeholder on screen for 20 s). If it stays, it changes state.
- **One plain gloss for each tech term** on screen (e.g. "ATS = the software
  behind a company's career page"). Status codes (404, 429), "classifier",
  "catch-all", a framework badge — each is jargon to the viewer; gloss it in
  five words or leave it out. Fewer tech artifacts beat more.
- **The clip must END on something**: the last beat holds its result at full
  brightness to the final frame (no fade to empty, no cut).
- On github.com keep the recorder's mouse below y = 90 (the header opens menus).

Typecheck with `node node_modules/typescript/bin/tsc --noEmit` until your files
are clean.

Do NOT render, do NOT commit, do NOT push — the host does that and GitHub renders.
When all the compositions and Root.tsx are done and typechecking, write the marker
file `{marker}` listing what you built, and stop.

Features tonight: {ids}
"""

WAVE_D_PROMPT = """You are an ordinary YouTube viewer. Forget everything you know about this
project, its owner and its code — for this task you have never seen any of it.
Do NOT open any file other than the images listed here, do not read the repo,
do not use git or the web. Your ONLY inputs are these frames (two per narration
line, in order: the moment that line's picture changes, then the frame held at the
end of the line — read left-to-right, top-to-bottom, sheet by sheet; frames 1–2 go
with line 1, frames 3–4 with line 2, and so on) and the narration.

Frames (open each with the Read tool):
{sheets}

Narration spoken over the video, in order:
{transcript}

Judge it honestly, as a stranger who found it on YouTube:

A. clarity (1–10): could a random viewer understand what was built and why it
   matters, from the pictures AND the words? 10 = obvious; 5 = gets the problem
   but not the solution; 3 = confused.
B. thesis (0–10): how well does the video answer a viewer who searched for
   "{thesis}"?
C. For each query below, 0–10 how well the video answers it:
{queries}
D. For each narration line: does the picture at that moment SUPPORT, stay
   NEUTRAL to, or CONTRADICT the sentence? Name what is on screen.
E. 3–5 concrete problems a viewer hits (unreadable text, wrong evidence, a
   placeholder that never changes, no idea what the product is, jargon…).

Write your verdict to the file `{marker}` as JSON and nothing else in it:
{{"{fid}": {{"clarity": <n>, "thesis": <n>, "queries": {{"<query>": <n>, …}},
  "lines": ["b1: SUPPORT — …", "b2: …", …], "problems": ["…", "…"],
  "summary": "<2 sentences: what the video is about, in your own words>"}}}}
Do not soften the numbers. Then stop.
"""

WAVE_D2_PROMPT = """FEATURE CLIP FACTORY — WAVE D fix: a blind viewer did not understand your clip.

Feature **{fid}**, composition `src/compositions/feature-demos/{comp}.tsx`.
An agent that knows nothing about the project watched the rendered frames with
the narration and returned this verdict (clarity and thesis must both reach 7):

```json
{verdict}
```

Work in `{rvid}`. Fix the problems the viewer names, in `{comp}.tsx` and, if a
beat must play a different page or hunk, in `shots/{fid}.json`. Keep the beat
windows, `durationInFrames`, the palette, the archetype and the narration
exactly as they are. The facts you may use:

{materials}

Tools that answer the usual complaints: a one-line product plate in beat 1;
`LogWindow` from `live-primitives.tsx` with the real log lines above (fontSize
≥ 20, 5–8 lines, revealed one by one) where the viewer asked to "see it work";
a `LiveWindow` zoomed 2.0–2.4 onto ONE readable hunk of the commit whose
message proves the sentence; a drawn schematic with the real names when no
commit does; a gloss line for each tech term; nothing left unchanged on screen
for more than one beat.

Typecheck with `node node_modules/typescript/bin/tsc --noEmit` until clean. Do
not render, do not commit, do not push. When done, write the marker file
`{marker}` saying what you changed, and stop.
"""

WAVE_B_BUDGET = """

**CONTEXT BUDGET (2026-10-12).** Your context holds ~140k tokens and this brief
plus your tools already use ~65k. Every night of 08–12.10 lost clips because the
agent read too much and died with "Prompt is too long" before writing a line.
- Read ONLY the files this brief names, each once. Do not open other feature
  compositions "for variety" — the recent effects are listed above.
- Do NOT open `effects.json`; the catalog you need is printed below.
- Read at most two files per turn; for anything over ~300 lines use `sed -n`
  on the part you need.
- Write `shots/<id>.motion.json` and the composition EARLY, then refine.
"""

WAVE_B_RETRY = """

**RETRY.** Your previous attempt at this clip died on the context limit. Files
it already wrote are on disk — check them first with `ls`/`sed -n` and continue
from them. Read only `skills/feature-motion/SKILL.md`, the reference
`FeatureFirst20SecondsUsedP75Motion.tsx` and the parts of `live-primitives.tsx` /
`motion-primitives.tsx` you actually call; skip `out/lux-batch-instructions.md`
beyond its STEP 0c/0f.
"""


def compact_catalog():
    """The motion catalog as one line per effect, so the agent never reads the
    27 KB effects.json in wave B."""
    try:
        d = json.load(open(MOTION_CATALOG))
    except (OSError, ValueError):
        return ""
    lines = [f"- `{e['name']}` ({e.get('family', '')}): {e.get('useWhen', '')} — data "
             + json.dumps(e.get("data", {}), ensure_ascii=False)
             for e in d.get("effects", []) if e.get("motion")]
    return "\nMotion catalog (`motion: true` effects only):\n" + "\n".join(lines) + "\n"


WAVE_B2_PROMPT = """FEATURE CLIP FACTORY — WAVE B2: one clip failed the directing gate.

Feature **{fid}**, composition `src/compositions/feature-demos/{comp}.tsx`, drawn
archetype **{archetype}**, mood **{mood}**. The host checked the file you just
wrote and found:

{problems}

Work in `{rvid}`. Fix exactly these in `{comp}.tsx` (and `shots/{fid}.json` if
the fix changes which page a beat plays). Keep the beat windows,
`durationInFrames`, the palette and the narration exactly as they are. The
staging must follow `out/lux-batch-instructions.md` STEP 0 for that archetype:
the archetype's object is the biggest, most central, longest-lived thing on
screen, and the whole 1280x720 canvas is used at every beat.

Typecheck with `node node_modules/typescript/bin/tsc --noEmit` until clean. Do
not render, do not commit, do not push. When done, write the marker file
`{marker}` saying what you changed, and stop.
"""


WAVE_C_PROMPT = """FEATURE CLIP FACTORY — WAVE C: look at what you actually drew.

Your clips have been rendered. For the first time you can SEE them, instead of
reasoning about coordinates. Open each contact sheet with the Read tool — it is
one frame per beat, left to right, top to bottom, with the last cell taken from
the tail.

{listing}

Work in `{rvid}`.

Judge each sheet honestly against these, in this order:

1. **Does the drawn archetype own the frame?** Delete the archetype's object in
   your head — if the clip still reads, the archetype is decoration and the
   staging is wrong. It must be the biggest, most central, longest-lived thing
   on screen. A pile in a corner under a centered headline is the retired
   default layout wearing a badge.
2. **Is the frame filled?** 1280x720 is the whole canvas. A third of the screen
   left white beside content in a corner is a defect.
3. **Does each frame show what its beat SAYS?** Read the beat's sentence, count
   what it names, and check the picture pays each one.
4. **Is every visible card, chip and panel labelled?** An unlabelled rectangle
   is a shape, not information.
5. **Is any text cut by the frame edge?** Panels may run off; words may not.
6. **Does the last cell hold at full brightness?** A dimming tail means a
   `loopFade` survived and must go.
7. **Is anything from the previous beat still on screen?** That is a `seg()`
   fade-in with no matching fade-out; it clamps at 1 forever.
8. **Does the recording in the window show the thing the beat names?** A live
   page scrolled past the relevant part, a cookie banner, a sidebar cut mid-word
   by the zoom, or a window that is empty white (the shot's `from` is later than
   the beat) are all defects. Fix them in `shots/<id>.json` (frames, scroll,
   mouse) or in the `zoom`/`focus` of the `LiveWindow`, never by drawing a mockup
   instead.
9. **The measured frame fill under each clip above is a fact, not a hint.** A
   beat marked ✗ has most of its 8x6 grid untouched — small panels floating in
   empty space. Enlarge the archetype's object, spread the beat's elements over
   the whole canvas, or put the recording in a bigger window. The host measures
   again after you finish; a clip with two or more ✗ beats is NOT published.
10. **Does the last beat show a result, not the feature's own article page?**
   Small text scrolling by is not a result. If the final window plays
   `vitalii.no/features/<slug>`, switch that shot to the hub, the commits
   list, the Actions runs or the product, or draw the result with several
   labelled objects.

Fix what fails, in the composition files only. Change nothing that passes: do
not touch the beat windows, `durationInFrames`, the palette or the archetype.
If a sheet is clean, say so and leave that file alone — a needless rewrite is
worse than no change.

Typecheck with `node node_modules/typescript/bin/tsc --noEmit` until clean. Do
not render, do not commit, do not push.

When done, write the marker file `{marker}` saying for each clip either what you
fixed or that it passed, and stop.
"""


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as exc:  # never die silently at 2am
        log(f"FATAL {redact(repr(exc))}")
        telegram(f"🏭 Завод впав: <code>{redact(exc)[:300]}</code>")
        sys.exit(1)
