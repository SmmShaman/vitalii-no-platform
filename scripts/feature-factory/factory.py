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
import glob, json, os, random, re, shlex, sqlite3, subprocess, sys, time
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
       coalesce(f.youtube_video_id,''), f.created_at::text, f.project_id
  FROM features f LEFT JOIN feature_projects p ON p.id = f.project_id
 WHERE f.status='published'
 ORDER BY f.created_at ASC, f.feature_id ASC
"""

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


def composition_for(fid):
    """Find the composition whose header claims this feature id."""
    out = run(f"grep -rl -E 'feature {fid}\\b' {RVID}/src/compositions/feature-demos/ "
              f"|| true", check=False)
    for line in out.splitlines():
        if line.endswith(".tsx"):
            return os.path.basename(line)[:-4]
    return None


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


def wait_for(path, timeout, what):
    deadline = time.time() + timeout
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
        time.sleep(30)
    log(f"{what}: TIMED OUT after {timeout}s")
    return False


def git(cmd):
    return run(f"git {cmd}", cwd=REPO, user="stuar")


def push():
    """origin may have moved while the agent worked (2026-09-07: a fix pushed
    from the PC mid-run made the narration push fail with "fetch first" and
    killed the night). Rebase our commits on top of origin first."""
    git("pull -q --rebase origin main")
    git("push -q origin main")


def main():
    if os.path.exists(LOCK):
        log("another run holds the lock — exiting")
        return 0
    open(LOCK, "w").write(str(os.getpid()))
    try:
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
        rows = [r.split("|") for r in psql(FEATURES_SQL).splitlines() if r]
        bright = {r[0] for r in rows if r[1] == "bright"}
        stranded = (voiced & live) - bright
        chosen = choose(rows, voiced, live, runway, stranded)
        log(f"voiced: {len(voiced)}, live: {len(live)}, published: {len(rows)}, "
            f"stranded: {sorted(stranded)}; picking {len(chosen)}")
        picks = []
        recent = []
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
                          "mood": mood, "urls": urls, "youtube": bool(row[7]),
                          "finish": finish})
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
                f"Verified public pages you may record (answered 2xx/3xx tonight):\n{urlmd}")
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
                drawn.append(p)   # composition + shots already in git
                continue
            mark = f"{MARKER_DIR}/waveB-{stamp}-{p['id']}.done"
            fresh_session(f"wave B {p['id']}")
            wake(WAVE_B_PROMPT.format(tables=p["table"], marker=to_container(mark),
                                      rvid=CONTAINER_RVID, ids=p["id"]), "wb")
            if wait_for(mark, WAVE_B_FEATURE_TIMEOUT, f"wave B {p['id']}"):
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
                run(f"cd {REPO} && git checkout -q -- scripts/remotion-video/src || true",
                    user="stuar")
                continue
            kept.append(p)
        picks = kept
        if not picks:
            telegram("🏭 Завод: жоден кліп не пройшов перевірку shots-файлів. Нічого не опубліковано.")
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

        if sheets:
            listing = "\n".join(
                f"- **{p['id']}** (`{p['composition']}`, archetype {p['archetype']}, "
                f"mood {p['mood']}) — your frames: `{to_container(sheet)}`"
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
                # The upload scope cannot delete the old video; a second upload
                # would leave two copies on the channel. The site, LinkedIn and
                # Facebook already point at the R2 key, which is what changed.
                log(f"{p['id']}: re-shoot already on YouTube — not re-uploaded")
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
1. **A `seg()` fade-in with no fade-out clamps at 1 forever**, leaving one beat's
   content sitting under the next. Every element needs `* (1 - seg(end, end+16))`
   so it is gone before the next window opens. The gaps are only ~9 frames.
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

Typecheck with `node node_modules/typescript/bin/tsc --noEmit` until your files
are clean.

Do NOT render, do NOT commit, do NOT push — the host does that and GitHub renders.
When all the compositions and Root.tsx are done and typechecking, write the marker
file `{marker}` listing what you built, and stop.

Features tonight: {ids}
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
