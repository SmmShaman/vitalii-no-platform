-- 2026-07-25: pre-moderation actually enforces quality now.
-- The AI has always returned quality_score (1-10) but there was nowhere to store it
-- and nothing checked it, so low-value link dumps published like anything else.
ALTER TABLE public.news
  ADD COLUMN IF NOT EXISTS pre_moderation_score integer;

COMMENT ON COLUMN public.news.pre_moderation_score IS
  'AI pre-moderation quality score 1-10. Posts below MIN_QUALITY_SCORE (api_settings) are rejected.';

INSERT INTO public.api_settings (key_name, key_value)
VALUES ('MIN_QUALITY_SCORE', '6')
ON CONFLICT (key_name) DO NOTHING;
