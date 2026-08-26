-- A lux repost is a SECOND legitimate post for the same feature+platform+language:
-- the first one carried the dark v1 clip, the new one carries the bright v2 clip,
-- and LinkedIn/Facebook keep their own copy of the video so the old post can
-- never be upgraded in place.
--
-- idx_feature_social_unique_active blocked exactly that. On 2026-08-26 the first
-- run of the rebuilt daily publisher posted p01 and p02 to both platforms
-- successfully but could not write the history rows, so the record of what went
-- out lived only in a Telegram message.
--
-- The index existed to stop double-posting. That job now belongs to
-- features.bright_posted_at (publisher-side) — the publisher never picks a
-- feature twice, so the DB no longer needs to forbid a second row.

DROP INDEX IF EXISTS public.idx_feature_social_unique_active;

-- Keep a non-unique index so the lookups that used it stay fast.
CREATE INDEX IF NOT EXISTS idx_feature_social_lookup
    ON public.feature_social_posts (feature_id, platform, language);
