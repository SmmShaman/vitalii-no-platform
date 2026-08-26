-- The daily publisher no longer reads only feature_video_repost_queue: it may
-- take ANY feature whose clip is bright and that has not yet had a bright post
-- (owner decision 2026-08-26, so the pipeline cannot run dry when the 30-row lux
-- queue is exhausted on 2026-09-23).
--
-- feature_social_posts cannot answer "has this had a BRIGHT post?" — 94 features
-- have a post there made with the old dark clip, and LinkedIn/Facebook keep
-- their own copy of the video, so those posts show dark video forever. This
-- column records the thing we actually care about.

ALTER TABLE public.features
  ADD COLUMN IF NOT EXISTS bright_posted_at timestamptz;

COMMENT ON COLUMN public.features.bright_posted_at IS
  'When this feature was published to social WITH its bright v2 clip. NULL = still owed a bright post. Set by the daily publisher task.';

-- j26 and j28-j31 are bright but were already posted with their dark clip, and
-- the owner ruled on 2026-08-26 that they are rebuild-only, NOT to be reposted.
-- Stamping them keeps the publisher from picking them up. To let any of them
-- through later, just set the column back to NULL for that feature_id.
UPDATE public.features
   SET bright_posted_at = now()
 WHERE feature_id IN ('j26', 'j28', 'j29', 'j30', 'j31')
   AND bright_posted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_features_bright_pending
    ON public.features (created_at)
 WHERE demo_style = 'bright' AND bright_posted_at IS NULL;
