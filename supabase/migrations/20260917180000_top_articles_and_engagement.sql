-- Top-read articles strip on /news and /blog, plus reading time from GA4.
--
-- Views come from page_views_daily (Cloudflare Web Analytics, see
-- 20260917120000_page_views_daily.sql). Cloudflare has no notion of time on
-- page, so engagement seconds are pulled from the GA4 Data API into
-- page_engagement_daily by scripts/ga4-engagement-sync (nightly on the VPS).

CREATE TABLE IF NOT EXISTS page_engagement_daily (
  path              text NOT NULL,              -- normalised path, e.g. /news/some-slug
  day               date NOT NULL,              -- GA4 date in the property's timezone
  screen_page_views integer NOT NULL DEFAULT 0, -- GA4 screenPageViews (consent-gated, < Cloudflare)
  sessions          integer NOT NULL DEFAULT 0,
  engagement_seconds integer NOT NULL DEFAULT 0,-- GA4 userEngagementDuration, summed
  synced_at         timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (path, day)
);

CREATE INDEX IF NOT EXISTS page_engagement_daily_day_idx ON page_engagement_daily (day);

ALTER TABLE page_engagement_daily ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read page engagement" ON page_engagement_daily;
CREATE POLICY "Public can read page engagement" ON page_engagement_daily FOR SELECT USING (true);
GRANT SELECT ON page_engagement_daily TO anon, authenticated;

-- One row per article: title/slug in all three languages, views in the window and
-- the average time readers actually spent on it (NULL until GA4 data arrives).
-- p_days = 7 or 30; 0 (or NULL) means all time and then views come from
-- views_count, which is what the site already shows under each article.
-- Return type: published_at is `timestamp`, not timestamptz; CREATE OR REPLACE
-- cannot change a return type, so drop first.
DROP FUNCTION IF EXISTS get_top_articles(text, integer, integer);
CREATE FUNCTION get_top_articles(
  p_kind text DEFAULT 'news',
  p_days integer DEFAULT 30,
  p_limit integer DEFAULT 10
)
RETURNS TABLE (
  id uuid,
  kind text,
  title_en text,
  title_no text,
  title_ua text,
  slug_en text,
  slug_no text,
  slug_ua text,
  image_url text,
  processed_image_url text,
  published_at timestamp,
  views integer,
  avg_seconds integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $fn$
-- Every article paired with each of its three slugs, so the path aggregates can
-- join on plain equality. The earlier correlated form
-- (`slug IN (slug_en, slug_no, slug_ua)`) re-scanned the whole ~20k news table
-- per aggregated path and blew the 3 s statement timeout for anon.
WITH params AS (
  SELECT p_kind = 'blog' AS is_blog,
         coalesce(p_days, 0) <= 0 AS all_time,
         CASE WHEN coalesce(p_days, 0) > 0
              THEN (now() AT TIME ZONE 'UTC')::date - (coalesce(p_days, 0) - 1)
              ELSE date '1970-01-01' END AS day_from,
         CASE WHEN p_kind = 'blog' THEN '/blog/%' ELSE '/news/%' END AS prefix,
         least(greatest(coalesce(p_limit, 10), 1), 50) AS row_limit
),
articles AS (
  SELECT n.id, 'news'::text AS kind, n.title_en, n.title_no, n.title_ua,
         n.slug_en, n.slug_no, n.slug_ua, n.image_url, n.processed_image_url,
         n.published_at, coalesce(n.views_count, 0) AS views_count
  FROM news n, params p
  WHERE NOT p.is_blog AND n.is_published AND n.published_at IS NOT NULL
  UNION ALL
  SELECT b.id, 'blog'::text, b.title_en, b.title_no, b.title_ua,
         b.slug_en, b.slug_no, b.slug_ua, b.image_url, b.processed_image_url,
         b.published_at, coalesce(b.views_count, 0)
  FROM blog_posts b, params p
  WHERE p.is_blog AND b.is_published AND b.published_at IS NOT NULL
),
article_slugs AS (
  SELECT a.id AS article_id, s.slug
  FROM articles a
  CROSS JOIN LATERAL (VALUES (a.slug_en), (a.slug_no), (a.slug_ua)) AS s(slug)
  WHERE s.slug IS NOT NULL
),
window_views AS (
  SELECT split_part(v.path, '/', 3) AS slug, sum(v.views)::integer AS total
  FROM page_views_daily v, params p
  WHERE v.path LIKE p.prefix AND v.day >= p.day_from
  GROUP BY 1
),
winners AS (
  SELECT s.article_id, sum(w.total)::integer AS views
  FROM window_views w
  JOIN article_slugs s ON s.slug = w.slug
  CROSS JOIN params p
  WHERE NOT p.all_time
  GROUP BY s.article_id
  HAVING sum(w.total) > 0
  UNION ALL
  SELECT a.id, a.views_count
  FROM articles a, params p
  WHERE p.all_time AND a.views_count > 0
),
top AS (
  SELECT w.article_id, w.views
  FROM winners w
  ORDER BY w.views DESC
  LIMIT (SELECT row_limit FROM params)
),
engagement AS (
  SELECT s.article_id,
         sum(e.engagement_seconds)::bigint AS secs,
         sum(e.screen_page_views)::bigint  AS gviews
  FROM page_engagement_daily e
  JOIN article_slugs s ON s.slug = split_part(e.path, '/', 3)
  JOIN top t ON t.article_id = s.article_id
  CROSS JOIN params p
  WHERE e.path LIKE p.prefix AND e.day >= p.day_from
  GROUP BY s.article_id
)
SELECT a.id, a.kind, a.title_en, a.title_no, a.title_ua,
       a.slug_en, a.slug_no, a.slug_ua, a.image_url, a.processed_image_url,
       a.published_at, t.views,
       CASE WHEN coalesce(e.gviews, 0) > 0 THEN (e.secs / e.gviews)::integer END AS avg_seconds
FROM top t
JOIN articles a ON a.id = t.article_id
LEFT JOIN engagement e ON e.article_id = t.article_id
ORDER BY t.views DESC, a.published_at DESC;
$fn$;

REVOKE ALL ON FUNCTION get_top_articles(text, integer, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION get_top_articles(text, integer, integer) TO anon, authenticated;
