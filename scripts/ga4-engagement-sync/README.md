# ga4-engagement-sync — how long readers actually spent on an article

Cloudflare Web Analytics counts page loads but has **no** time-on-page metric (its RUM schema
only exposes load-performance timings). The reading-time column in the "Most read" strip therefore
comes from GA4 — the property behind `G-1G5BSRBZT9`, which the site loads through
`components/ConditionalAnalytics.tsx` once the visitor accepts analytics cookies.

The script pulls `screenPageViews`, `sessions` and `userEngagementDuration` per `pagePath` per day
into `page_engagement_daily`; `get_top_articles()` divides seconds by views for the average.
Only `/news/*` and `/blog/*` paths are kept.

## Live copy

| What | Where |
|---|---|
| script | `/root/ga4-engagement-sync/ga4_sync.py` (VPS) — this directory is the source |
| units | `/etc/systemd/system/ga4-engagement-sync.{service,timer}` — nightly 03:40 CEST |
| log | `/root/ga4-engagement-sync/sync.log` |
| env | `/home/stuar/Projects/ENV-FILES/ga4-portfolio.env` |
| schema | `supabase/migrations/20260917180000_top_articles_and_engagement.sql` |

## The one manual step (owner only)

The jobbot service account signs the requests:

```
jobbot-sheets-user@jobbot-project-465120.iam.gserviceaccount.com
```

Google Analytics → **Admin** → **Property access management** (property `G-1G5BSRBZT9`) →
**+** → add that email with the **Viewer** role. Nothing else is needed: the Analytics Admin and
Data APIs were enabled on project `jobbot-project-465120` on 2026-09-17, and the key is already
in the env file. Until access is granted the script exits **3** and writes nothing, and the strip
simply shows views without a time.

Then:

```bash
python3 /root/ga4-engagement-sync/ga4_sync.py --dry-run -v --days 3   # confirm access
python3 /root/ga4-engagement-sync/ga4_sync.py --backfill              # as far back as GA4 holds
```

## Caveats

- GA4 is **consent-gated** on this site, so its page views are a subset of Cloudflare's. That is
  fine for an *average* time but the two view counts will never match; the strip shows Cloudflare
  views and GA4 time side by side on purpose.
- `userEngagementDuration` counts only time the tab was in the foreground, which is what "time
  spent reading" should mean.
- Exit codes: 0 ok · 1 API/DB failure · 2 credentials missing · 3 no GA4 property access.
