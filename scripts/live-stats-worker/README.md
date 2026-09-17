# vitalii-live-stats — Worker behind the live badge on the home page

`GET https://vitalii-live-stats.boytasks.workers.dev/` → `{ now, today, week, month, visits{…}, updated_at }`
(page loads on vitalii.no: last 5 min / since midnight Oslo / 7 days / 30 days). Cached 60 s per colo,
CORS `*` — the numbers are public, the Cloudflare analytics token stays in the Worker secret.

Consumed by `components/ui/LiveStatsBadge.tsx` (footer on desktop, under the header on mobile).

## Deploy

```bash
cd scripts/live-stats-worker
export CLOUDFLARE_API_TOKEN=<token with Workers Scripts:Edit>   # ENV-FILES/boytasks.env CLOUDFLARE_API_TOKEN_2
npx wrangler@4 deploy
npx wrangler@4 secret put CF_ANALYTICS_TOKEN                     # ENV-FILES/cloudflare-zone-vitalii.env
curl -s https://vitalii-live-stats.boytasks.workers.dev/
```

Cost: ≤ 1 GraphQL query per minute per colo (account limit 300 / 5 min); Workers Free 100k requests/day,
the badge polls once a minute per open tab.
