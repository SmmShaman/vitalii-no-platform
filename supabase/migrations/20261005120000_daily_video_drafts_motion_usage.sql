-- Which scene effects a rendered digest actually showed, so the next days can
-- avoid repeating the same graphics (digest-motion skill, cross-day memory).
-- Shape: {"effects": {"titleTakeover": 2, ...}, "openers": ["titleTakeover", null, ...]}
ALTER TABLE public.daily_video_drafts ADD COLUMN IF NOT EXISTS motion_usage jsonb;
