-- Migration: repair functions broken by the security-linter search_path=""
-- Date: 2026-08-19
-- Context: the Supabase linter hardening pinned `SET search_path = ""` on most
-- public functions. With an EMPTY search path, unqualified references inside
-- plpgsql bodies (normalize_title, similarity, tables news/news_sources) fail
-- with "does not exist". Symptoms in production logs:
--   "Trigram duplicate check failed: function normalize_title(text) does not exist"
--   "Duplicate check failed, falling back to direct query" (check_rss_article_exists)
-- Fix: pin search_path = public instead (still fixed => linter-safe), and
-- recreate find_similar_news with schema-qualified calls + a created_at cast
-- (self-hosted news.created_at is `timestamp`, the declared return column is
-- `timestamptz` — the mismatch surfaced only once the function could run at all).

DO $do$
DECLARE
  stmt TEXT;
BEGIN
  FOR stmt IN
    SELECT format('ALTER FUNCTION %I.%I(%s) SET search_path = public;',
                  n.nspname, p.proname, pg_get_function_identity_arguments(p.oid))
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proconfig::text LIKE '%search_path=%""%'
  LOOP
    EXECUTE stmt;
  END LOOP;
END
$do$;

CREATE OR REPLACE FUNCTION public.find_similar_news(
  search_title TEXT,
  days_back INT DEFAULT 7,
  sim_threshold FLOAT DEFAULT 0.4,
  max_results INT DEFAULT 3
)
RETURNS TABLE (
  news_id UUID,
  news_title TEXT,
  similarity_score FLOAT,
  created_at TIMESTAMPTZ,
  source_name TEXT
) AS $$
DECLARE
  normalized TEXT;
BEGIN
  normalized := public.normalize_title(search_title);

  IF normalized IS NULL OR length(normalized) < 10 THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT
    n.id AS news_id,
    n.original_title AS news_title,
    public.similarity(n.title_fingerprint, normalized)::FLOAT AS similarity_score,
    n.created_at::timestamptz,
    COALESCE(ns.name, 'Unknown') AS source_name
  FROM public.news n
  LEFT JOIN public.news_sources ns ON n.source_id = ns.id
  WHERE n.title_fingerprint IS NOT NULL
    AND n.created_at > NOW() - (days_back || ' days')::INTERVAL
    AND n.pre_moderation_status != 'rejected'
    AND public.similarity(n.title_fingerprint, normalized) > sim_threshold
  ORDER BY public.similarity(n.title_fingerprint, normalized) DESC
  LIMIT max_results;
END;
$$ LANGUAGE plpgsql STABLE SET search_path = public;
