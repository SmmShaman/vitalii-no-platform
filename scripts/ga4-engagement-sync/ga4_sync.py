#!/usr/bin/env python3
"""Pull per-article engagement time from the GA4 Data API into portfolio-db.

Cloudflare Web Analytics counts page loads but has no notion of time on page, so
the "how long people read this" column comes from GA4 (property for vitalii.no,
measurement id G-1G5BSRBZT9). For each day this asks GA4 for screenPageViews,
sessions and userEngagementDuration grouped by pagePath and upserts one row per
(path, day) into page_engagement_daily; get_top_articles() then divides seconds
by views to show an average per article.

Auth: the jobbot service account (jobbot-sheets-user@jobbot-project-465120) signs
a JWT with openssl — no Python dependencies beyond requests. The account must be
granted "Viewer" on the GA4 property (Admin → Property access management);
until then this exits 3 and writes nothing.

Usage:
  ga4_sync.py                 # yesterday + the day before
  ga4_sync.py --days 30
  ga4_sync.py --backfill      # walk back until GA4 stops returning rows
  ga4_sync.py --dry-run -v

Env (ENV_FILE, default /home/stuar/Projects/ENV-FILES/ga4-portfolio.env):
  GOOGLE_CREDENTIALS_JSON   service-account key, inline JSON
  GA4_PROPERTY_ID           numeric property id; discovered via the Admin API if absent
"""
import argparse
import base64
import datetime as dt
import json
import os
import subprocess
import sys
import tempfile
import time

import requests

ENV_FILE = os.environ.get("ENV_FILE", "/home/stuar/Projects/ENV-FILES/ga4-portfolio.env")
TOKEN_URL = "https://oauth2.googleapis.com/token"
SCOPE = "https://www.googleapis.com/auth/analytics.readonly"
ADMIN = "https://analyticsadmin.googleapis.com/v1beta/accountSummaries"
DATA = "https://analyticsdata.googleapis.com/v1beta/properties/{}:runReport"
MEASUREMENT_ID = "G-1G5BSRBZT9"
PSQL = ["docker", "exec", "-i", "portfolio-db", "psql", "-U", "postgres", "-v", "ON_ERROR_STOP=1", "-t", "-A"]
DQ = "$ga4$"
PREFIXES = ("/news/", "/blog/")


def log(msg):
    print(f"{dt.datetime.now(dt.timezone.utc).isoformat(timespec='seconds')} {msg}", flush=True)


def load_env(path):
    if os.path.exists(path):
        for line in open(path, encoding="utf-8"):
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))


def access_token(sa):
    """Sign a JWT with openssl and swap it for an access token."""
    def b64(raw):
        return base64.urlsafe_b64encode(raw).rstrip(b"=")

    now = int(time.time())
    header = b64(json.dumps({"alg": "RS256", "typ": "JWT"}).encode())
    claim = b64(json.dumps({
        "iss": sa["client_email"], "scope": SCOPE, "aud": TOKEN_URL,
        "iat": now, "exp": now + 3600,
    }).encode())
    signing_input = header + b"." + claim
    with tempfile.TemporaryDirectory() as tmp:
        key, payload, sig = (os.path.join(tmp, n) for n in ("key.pem", "in.bin", "sig.bin"))
        with open(key, "w") as fh:
            fh.write(sa["private_key"])
        with open(payload, "wb") as fh:
            fh.write(signing_input)
        subprocess.run(["openssl", "dgst", "-sha256", "-sign", key, "-out", sig, payload], check=True)
        signature = open(sig, "rb").read()
    jwt = (signing_input + b"." + b64(signature)).decode()
    r = requests.post(TOKEN_URL, timeout=30, data={
        "grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer", "assertion": jwt})
    if r.status_code != 200:
        raise RuntimeError(f"token exchange {r.status_code}: {r.text[:200]}")
    return r.json()["access_token"]


def discover_property(token):
    r = requests.get(ADMIN, headers={"Authorization": f"Bearer {token}"}, timeout=30)
    body = r.json()
    if r.status_code != 200:
        raise RuntimeError(f"admin API {r.status_code}: {json.dumps(body)[:200]}")
    for account in body.get("accountSummaries") or []:
        for prop in account.get("propertySummaries") or []:
            if "vitalii" in (prop.get("displayName") or "").lower():
                return prop["property"].split("/")[-1]
    props = [(a.get("displayName"), p.get("displayName"), p.get("property"))
             for a in body.get("accountSummaries") or [] for p in a.get("propertySummaries") or []]
    if props:
        return props[0][2].split("/")[-1]
    return None


def run_report(token, property_id, day):
    body = {
        "dateRanges": [{"startDate": day.isoformat(), "endDate": day.isoformat()}],
        "dimensions": [{"name": "pagePath"}],
        "metrics": [{"name": "screenPageViews"}, {"name": "sessions"}, {"name": "userEngagementDuration"}],
        "limit": 10000,
        "keepEmptyRows": False,
    }
    r = requests.post(DATA.format(property_id), timeout=60,
                      headers={"Authorization": f"Bearer {token}"}, json=body)
    payload = r.json()
    if r.status_code != 200:
        raise RuntimeError(f"data API {r.status_code}: {json.dumps(payload)[:250]}")
    rows = []
    for row in payload.get("rows") or []:
        path = (row["dimensionValues"][0]["value"] or "").split("?")[0].split("#")[0]
        if len(path) > 1:
            path = path.rstrip("/") or "/"
        if not path.startswith(PREFIXES):
            continue
        views, sessions, seconds = (row["metricValues"][i]["value"] for i in range(3))
        rows.append({
            "path": path[:512], "day": day.isoformat(),
            "screen_page_views": int(float(views or 0)),
            "sessions": int(float(sessions or 0)),
            "engagement_seconds": int(round(float(seconds or 0))),
        })
    return rows


def psql(sql):
    res = subprocess.run(PSQL, input=sql, text=True, capture_output=True)
    if res.returncode != 0:
        raise RuntimeError(f"psql failed: {res.stderr.strip()[:400]}")
    return res.stdout.strip()


def upsert(rows):
    if not rows:
        return 0
    payload = json.dumps(rows, ensure_ascii=False)
    if DQ in payload:
        raise RuntimeError("payload contains the dollar-quote tag")
    psql(f"""
    INSERT INTO page_engagement_daily (path, day, screen_page_views, sessions, engagement_seconds, synced_at)
    SELECT path, day, screen_page_views, sessions, engagement_seconds, now()
    FROM jsonb_to_recordset({DQ}{payload}{DQ}::jsonb)
      AS t(path text, day date, screen_page_views int, sessions int, engagement_seconds int)
    ON CONFLICT (path, day) DO UPDATE
      SET screen_page_views = EXCLUDED.screen_page_views,
          sessions = EXCLUDED.sessions,
          engagement_seconds = EXCLUDED.engagement_seconds,
          synced_at = now();
    """)
    return len(rows)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--days", type=int, default=2, help="complete days to sync, ending yesterday")
    ap.add_argument("--backfill", action="store_true", help="walk back until GA4 returns nothing")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("-v", "--verbose", action="store_true")
    args = ap.parse_args()

    load_env(ENV_FILE)
    raw = os.environ.get("GOOGLE_CREDENTIALS_JSON")
    if not raw:
        log(f"GOOGLE_CREDENTIALS_JSON missing in {ENV_FILE}; nothing synced")
        return 2
    sa = json.loads(raw)
    token = access_token(sa)

    property_id = os.environ.get("GA4_PROPERTY_ID")
    if not property_id:
        property_id = discover_property(token)
    if not property_id:
        log(f"the service account {sa['client_email']} has no access to any GA4 property. "
            f"Grant it 'Viewer' on the {MEASUREMENT_ID} property (GA4 → Admin → Property access "
            f"management), or set GA4_PROPERTY_ID; nothing synced")
        return 3
    log(f"property {property_id}")

    today = dt.datetime.now(dt.timezone.utc).date()
    days = 400 if args.backfill else args.days
    written = 0
    empty_streak = 0
    for i in range(1, days + 1):
        day = today - dt.timedelta(days=i)
        rows = run_report(token, property_id, day)
        total = sum(r["engagement_seconds"] for r in rows)
        if args.dry_run:
            log(f"{day}: {len(rows)} article paths, {total}s engagement" +
                (f" top={sorted(rows, key=lambda r: -r['engagement_seconds'])[:3]}" if args.verbose else ""))
        else:
            written += upsert(rows)
            log(f"{day}: {len(rows)} article paths, {total}s engagement upserted")
        if args.backfill:
            empty_streak = empty_streak + 1 if not rows else 0
            if empty_streak >= 30:
                log(f"stop backfill at {day}: 30 empty days in a row")
                break
        time.sleep(0.2)

    log("dry run — no DB writes" if args.dry_run else f"rows upserted {written}")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as exc:  # noqa: BLE001
        log(f"FAILED: {exc}")
        sys.exit(1)
