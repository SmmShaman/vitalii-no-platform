#!/usr/bin/env python3
"""Pull per-page views from Cloudflare Web Analytics into portfolio-db.

Runs nightly on the VPS (cf-views-sync.timer). For each UTC day it asks the
Cloudflare GraphQL API for page loads grouped by path and referrer host, upserts
one row per (path, day) into page_views_daily and then lets the database add
the totals to news.views_count / blog_posts.views_count on top of the frozen
legacy number (recompute_views_from_cf()).

Usage:
  cf_views_sync.py                 # yesterday + the day before (late data)
  cf_views_sync.py --days 7        # last 7 complete days
  cf_views_sync.py --backfill      # walk back day by day until Cloudflare refuses
  cf_views_sync.py --dry-run -v    # show what would be written

Env (from ENV_FILE, default /home/stuar/Projects/ENV-FILES/cloudflare-zone-vitalii.env):
  CF_ANALYTICS_TOKEN            API token with  Account > Account Analytics > Read
  CF_ACCOUNT_ID                 Cloudflare account id
  CF_WEB_ANALYTICS_SITE_TAG     optional; resolved from the beacon token if absent
  CF_WEB_ANALYTICS_SITE_TOKEN   optional; beacon token in app/layout.tsx (default below)
"""
import argparse
import datetime as dt
import json
import os
import subprocess
import sys
import time
from collections import defaultdict
from urllib.parse import unquote, urlsplit

import requests

ENV_FILE = os.environ.get("ENV_FILE", "/home/stuar/Projects/ENV-FILES/cloudflare-zone-vitalii.env")
GRAPHQL = "https://api.cloudflare.com/client/v4/graphql"
DEFAULT_SITE_TOKEN = "9aad069e09264dd5aedbad7f61d004c5"  # data-cf-beacon in app/layout.tsx
PSQL = ["docker", "exec", "-i", "portfolio-db", "psql", "-U", "postgres", "-v", "ON_ERROR_STOP=1", "-t", "-A"]
DQ = "$cfviews$"  # dollar-quote tag for the JSON payload
# The beacon also fires on Netlify deploy previews (…--remarkable-monstera.netlify.app); count only the real site.
HOSTS = ["vitalii.no", "www.vitalii.no"]


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


def normalise_path(raw):
    """/news/slug/?utm=x → /news/slug ; decode %xx ; keep '/' for the home page."""
    if not raw:
        return "/"
    path = urlsplit(raw).path if "://" in raw else raw.split("?", 1)[0].split("#", 1)[0]
    path = unquote(path)
    if not path.startswith("/"):
        path = "/" + path
    if len(path) > 1:
        path = path.rstrip("/") or "/"
    return path[:512]


class Cloudflare:
    def __init__(self, token, account_id, verbose=False):
        self.token = token
        self.account_id = account_id
        self.verbose = verbose
        self.headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
        self.with_sample = True

    def site_tag(self, site_token):
        """Web Analytics 'siteTag' differs from the beacon token; look it up once.

        rum/site_info/list needs a scope the analytics token does not have, so fall
        back to asking GraphQL which siteTag has served HOSTS in the last week.
        """
        url = f"https://api.cloudflare.com/client/v4/accounts/{self.account_id}/rum/site_info/list"
        try:
            body = requests.get(url, headers=self.headers, params={"per_page": 50}, timeout=30).json()
        except (requests.RequestException, ValueError):
            body = {}
        for site in (body.get("result") or []) if body.get("success") else []:
            if site.get("site_token") == site_token:
                return site["site_tag"]
        since = (dt.datetime.now(dt.timezone.utc).date() - dt.timedelta(days=7)).isoformat()
        query = """
        query($acct: String!, $since: Date!) {
          viewer { accounts(filter: { accountTag: $acct }) {
            rum: rumPageloadEventsAdaptiveGroups(filter: { date_geq: $since }, limit: 50, orderBy: [count_DESC]) {
              count dimensions { siteTag requestHost } } } } }"""
        r = requests.post(GRAPHQL, headers=self.headers,
                          json={"query": query, "variables": {"acct": self.account_id, "since": since}}, timeout=60)
        body = r.json()
        if body.get("errors"):
            raise RuntimeError(f"siteTag discovery: {body['errors'][0].get('message')}")
        accounts = (body.get("data") or {}).get("viewer", {}).get("accounts") or []
        for g in (accounts[0].get("rum") if accounts else []) or []:
            if g["dimensions"].get("requestHost") in HOSTS:
                return g["dimensions"]["siteTag"]
        raise RuntimeError("no Web Analytics siteTag served vitalii.no in the last 7 days; set CF_WEB_ANALYTICS_SITE_TAG")

    def _query(self, site_tag, day, with_sample):
        sample = "avg { sampleInterval }" if with_sample else ""
        query = f"""
        query($acct: String!, $site: String!, $day: Date!, $hosts: [String!]) {{
          viewer {{
            accounts(filter: {{ accountTag: $acct }}) {{
              rum: rumPageloadEventsAdaptiveGroups(
                filter: {{ siteTag: $site, date: $day, requestHost_in: $hosts }}
                limit: 10000
                orderBy: [count_DESC]
              ) {{
                count
                sum {{ visits }}
                {sample}
                dimensions {{ requestPath refererHost }}
              }}
            }}
          }}
        }}"""
        variables = {"acct": self.account_id, "site": site_tag, "day": day.isoformat(), "hosts": HOSTS}
        r = requests.post(GRAPHQL, headers=self.headers, json={"query": query, "variables": variables}, timeout=60)
        try:
            body = r.json()
        except ValueError:
            raise RuntimeError(f"GraphQL HTTP {r.status_code}: {r.text[:300]}")
        return body

    def day_groups(self, site_tag, day):
        """Return list of (path, referer_host, views, visits) for one UTC day, or None if refused."""
        body = self._query(site_tag, day, self.with_sample)
        errors = body.get("errors") or []
        if errors and self.with_sample and any("sampleInterval" in json.dumps(e) for e in errors):
            self.with_sample = False
            body = self._query(site_tag, day, False)
            errors = body.get("errors") or []
        if errors:
            msg = "; ".join(e.get("message", str(e)) for e in errors)
            raise RuntimeError(f"GraphQL {day}: {msg}")
        accounts = (body.get("data") or {}).get("viewer", {}).get("accounts") or []
        if not accounts:
            raise RuntimeError(f"GraphQL {day}: no account in response (token scope?)")
        rows = []
        for g in accounts[0].get("rum") or []:
            dims = g.get("dimensions") or {}
            interval = ((g.get("avg") or {}).get("sampleInterval") or 1) if self.with_sample else 1
            views = int(round((g.get("count") or 0) * interval))
            visits = int(round(((g.get("sum") or {}).get("visits") or 0) * interval))
            rows.append((normalise_path(dims.get("requestPath")), dims.get("refererHost") or "", views, visits))
        if self.verbose:
            log(f"{day}: {len(rows)} groups")
        return rows


def aggregate(rows):
    per_path = defaultdict(lambda: {"views": 0, "visits": 0, "ref": defaultdict(int)})
    for path, ref, views, visits in rows:
        p = per_path[path]
        p["views"] += views
        p["visits"] += visits
        p["ref"][ref] += views
    out = []
    for path, p in per_path.items():
        top = dict(sorted(p["ref"].items(), key=lambda kv: -kv[1])[:10])
        out.append({"path": path, "views": p["views"], "visits": p["visits"], "referrers": top})
    return out


def psql(sql):
    res = subprocess.run(PSQL, input=sql, text=True, capture_output=True)
    if res.returncode != 0:
        raise RuntimeError(f"psql failed: {res.stderr.strip()[:500]}")
    return res.stdout.strip()


def upsert(day, agg):
    if not agg:
        return 0
    for row in agg:
        row["day"] = day.isoformat()
    payload = json.dumps(agg, ensure_ascii=False)
    if DQ in payload:
        raise RuntimeError("payload contains the dollar-quote tag")
    sql = f"""
    INSERT INTO page_views_daily (path, day, views, visits, referrers, synced_at)
    SELECT path, day, views, visits, referrers, now()
    FROM jsonb_to_recordset({DQ}{payload}{DQ}::jsonb)
      AS t(path text, day date, views int, visits int, referrers jsonb)
    ON CONFLICT (path, day) DO UPDATE
      SET views = EXCLUDED.views, visits = EXCLUDED.visits,
          referrers = EXCLUDED.referrers, synced_at = now();
    """
    psql(sql)
    return len(agg)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--days", type=int, default=2, help="complete UTC days to sync, ending yesterday")
    ap.add_argument("--backfill", action="store_true", help="walk back until Cloudflare refuses or 400 days")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("-v", "--verbose", action="store_true")
    args = ap.parse_args()

    load_env(ENV_FILE)
    token = os.environ.get("CF_ANALYTICS_TOKEN")
    account = os.environ.get("CF_ACCOUNT_ID")
    if not token or not account:
        log("CF_ANALYTICS_TOKEN / CF_ACCOUNT_ID missing — create a token with Account Analytics: Read "
            f"and put it in {ENV_FILE}; nothing synced")
        return 2

    cf = Cloudflare(token, account, args.verbose)
    site_tag = os.environ.get("CF_WEB_ANALYTICS_SITE_TAG") or cf.site_tag(
        os.environ.get("CF_WEB_ANALYTICS_SITE_TOKEN", DEFAULT_SITE_TOKEN))
    log(f"site_tag {site_tag}")

    today = dt.datetime.now(dt.timezone.utc).date()
    days = 400 if args.backfill else args.days
    written = 0
    empty_streak = 0
    for i in range(1, days + 1):
        day = today - dt.timedelta(days=i)
        try:
            rows = cf.day_groups(site_tag, day)
        except RuntimeError as e:
            if args.backfill:
                log(f"stop backfill at {day}: {e}")
                break
            raise
        agg = aggregate(rows)
        total = sum(a["views"] for a in agg)
        if args.dry_run:
            log(f"{day}: {len(agg)} paths, {total} views" +
                (f" top={sorted(agg, key=lambda a: -a['views'])[:3]}" if args.verbose else ""))
        else:
            written += upsert(day, agg)
            log(f"{day}: {len(agg)} paths, {total} views upserted")
        if args.backfill:
            empty_streak = empty_streak + 1 if not agg else 0
            if empty_streak >= 45:
                log(f"stop backfill at {day}: 45 empty days in a row")
                break
        time.sleep(0.3)

    if args.dry_run:
        log("dry run — no DB writes")
        return 0
    result = psql("SELECT news_updated || '|' || blog_updated FROM recompute_views_from_cf();")
    log(f"rows upserted {written}; recompute news|blog changed: {result}")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as exc:  # noqa: BLE001
        log(f"FAILED: {exc}")
        sys.exit(1)
