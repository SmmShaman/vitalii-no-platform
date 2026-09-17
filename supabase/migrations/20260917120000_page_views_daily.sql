-- Real page views from Cloudflare Web Analytics (beacon on vitalii.no since the
-- site moved to Netlify). The old client-side views_count++ never worked: the
-- anon key cannot pass the "Authenticated users can manage news" UPDATE policy,
-- so the number under every article froze in May 2026.
--
-- scripts/cf-views-sync/cf_views_sync.py (nightly systemd timer on the VPS)
-- upserts one row per (path, day) here and then calls recompute_views_from_cf().

CREATE TABLE IF NOT EXISTS page_views_daily (
  path       text NOT NULL,              -- normalised request path, e.g. /news/some-slug
  day        date NOT NULL,              -- UTC day as Cloudflare reports it
  views      integer NOT NULL DEFAULT 0, -- page loads (sampled estimate from CF)
  visits     integer NOT NULL DEFAULT 0, -- visits = page loads with an external/empty referrer
  referrers  jsonb NOT NULL DEFAULT '{}'::jsonb, -- {"www.linkedin.com": 12, "": 30, ...} top hosts
  synced_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (path, day)
);

CREATE INDEX IF NOT EXISTS page_views_daily_day_idx ON page_views_daily (day);

ALTER TABLE page_views_daily ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read page views" ON page_views_daily;
CREATE POLICY "Public can read page views" ON page_views_daily FOR SELECT USING (true);
GRANT SELECT ON page_views_daily TO anon, authenticated;

-- Freeze what the dead counter had collected so the recompute can add CF data on top.
ALTER TABLE news       ADD COLUMN IF NOT EXISTS views_count_legacy integer;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS views_count_legacy integer;
UPDATE news       SET views_count_legacy = COALESCE(views_count, 0) WHERE views_count_legacy IS NULL;
UPDATE blog_posts SET views_count_legacy = COALESCE(views_count, 0) WHERE views_count_legacy IS NULL;

-- views_count = frozen legacy number + every CF day we have for any of the
-- article's three slugs. Idempotent; safe to run after each sync.
CREATE OR REPLACE FUNCTION recompute_views_from_cf()
RETURNS TABLE (news_updated integer, blog_updated integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  n_upd integer;
  b_upd integer;
BEGIN
  WITH agg AS (
    SELECT split_part(path, '/', 3) AS slug, SUM(views)::integer AS total
    FROM page_views_daily
    WHERE path LIKE '/news/%'
    GROUP BY 1
  ),
  per_article AS (
    SELECT n.id, SUM(a.total)::integer AS total
    FROM news n
    JOIN agg a ON a.slug IN (n.slug_en, n.slug_no, n.slug_ua)
    GROUP BY n.id
  )
  UPDATE news n
  SET views_count = COALESCE(n.views_count_legacy, 0) + p.total
  FROM per_article p
  WHERE p.id = n.id
    AND n.views_count IS DISTINCT FROM COALESCE(n.views_count_legacy, 0) + p.total;
  GET DIAGNOSTICS n_upd = ROW_COUNT;

  WITH agg AS (
    SELECT split_part(path, '/', 3) AS slug, SUM(views)::integer AS total
    FROM page_views_daily
    WHERE path LIKE '/blog/%'
    GROUP BY 1
  ),
  per_post AS (
    SELECT b.id, SUM(a.total)::integer AS total
    FROM blog_posts b
    JOIN agg a ON a.slug IN (b.slug_en, b.slug_no, b.slug_ua)
    GROUP BY b.id
  )
  UPDATE blog_posts b
  SET views_count = COALESCE(b.views_count_legacy, 0) + p.total
  FROM per_post p
  WHERE p.id = b.id
    AND b.views_count IS DISTINCT FROM COALESCE(b.views_count_legacy, 0) + p.total;
  GET DIAGNOSTICS b_upd = ROW_COUNT;

  RETURN QUERY SELECT n_upd, b_upd;
END;
$$;

REVOKE ALL ON FUNCTION recompute_views_from_cf() FROM PUBLIC;
