# cf-views-sync — real article views from Cloudflare Web Analytics

The number under every article (`news.views_count`, `blog_posts.views_count`) froze in
May 2026: the site bumped it with the anon key, the `Authenticated users can manage news`
policy silently matched zero rows, and no error was raised. The Cloudflare Web Analytics
beacon (`data-cf-beacon` in `app/layout.tsx`) has been collecting real page loads all along.

This script pulls those page loads per path and day and stores them in
`page_views_daily`; `recompute_views_from_cf()` then sets
`views_count = views_count_legacy (frozen May number) + Σ Cloudflare views` for every
article, matching `/news/<slug>` and `/blog/<slug>` against all three slug columns.
`page_views_daily.referrers` keeps the top-10 referrer hosts per path/day, so "where the
readers came from" can be shown later without another API call.

## Live copy

| What | Where |
|---|---|
| script | `/root/cf-views-sync/cf_views_sync.py` (VPS) — this directory is the source |
| units | `/etc/systemd/system/cf-views-sync.{service,timer}` — nightly 03:20 CEST |
| log | `/root/cf-views-sync/sync.log` |
| env | `/home/stuar/Projects/ENV-FILES/cloudflare-zone-vitalii.env` (`CF_ANALYTICS_TOKEN`, `CF_WEB_ANALYTICS_SITE_TAG`) |
| counted hosts | `vitalii.no`, `www.vitalii.no` only — the beacon also fires on Netlify deploy previews |
| schema | `supabase/migrations/20260917120000_page_views_daily.sql` (applied on portfolio-db by hand) |

## One-time setup (owner)

1. Cloudflare dashboard → My Profile → API Tokens → Create Token → *Custom token*:
   permission **Account · Account Analytics · Read** (add **Account · Web Analytics · Read**
   if it is offered), Account Resources = the account that owns vitalii.no.
2. Append to the env file on the VPS: `CF_ANALYTICS_TOKEN=<token>` (`CF_ACCOUNT_ID` is already there)
   and `CF_WEB_ANALYTICS_SITE_TAG=<tag>` — the tag is discovered automatically via GraphQL when absent
   (`rum/site_info/list` is not readable with an analytics-only token). Never commit the values.
   Done 2026-09-17: token "analitics", site tag `8726e1b4…`; history back-filled the same day.
3. First run with history:
   ```bash
   python3 /root/cf-views-sync/cf_views_sync.py --dry-run -v --days 3   # check the token + site tag
   python3 /root/cf-views-sync/cf_views_sync.py --backfill              # every day CF still has
   ```
4. From then on the timer does yesterday + the day before every night.

## Checks

```bash
systemctl list-timers cf-views-sync.timer
tail -5 /root/cf-views-sync/sync.log
docker exec portfolio-db psql -U postgres -c "SELECT day, sum(views) FROM page_views_daily GROUP BY 1 ORDER BY 1 DESC LIMIT 7;"
docker exec portfolio-db psql -U postgres -c "SELECT slug_en, views_count_legacy, views_count FROM news ORDER BY views_count DESC LIMIT 5;"
```

Exit codes: 0 ok · 1 API/DB failure (see log) · 2 token missing (nothing written).
