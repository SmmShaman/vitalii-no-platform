-- 2026-07-25: the RSS relevance floor was hardcoded as `>= 5` in analyze-rss-article
-- and monitor-rss-sources. Both now read it from here, next to MIN_QUALITY_SCORE,
-- so the two gates (is this our topic? / does the text say anything?) are tunable
-- from the admin UI instead of a redeploy.
INSERT INTO public.api_settings (key_name, key_value)
VALUES ('RSS_MIN_RELEVANCE_SCORE', '5')
ON CONFLICT (key_name) DO NOTHING;
