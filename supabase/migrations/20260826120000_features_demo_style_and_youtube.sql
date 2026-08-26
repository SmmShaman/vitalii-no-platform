-- Feature demo clips: record the visual style and the YouTube video, so the
-- daily publisher can tell a bright clip from a dark one and so the three
-- channels (site / LinkedIn / YouTube) can point at each other.
--
-- Why this exists (2026-08-26): the daily social task picked the oldest feature
-- with no post and attached whatever clip the row had. Nothing in the schema
-- said which clips were the old dark v1 and which were the bright v2 rebuild,
-- so dark clips kept going out to LinkedIn. Owner rule from this date: a dark
-- clip must never reach LinkedIn again.
--
-- demo_style values:
--   'bright' — rebuilt on bright-theme/bright-primitives (v2). Publishable.
--   'dark'   — original v1 schema clip. NOT publishable to social.
--   NULL     — no clip rendered yet.

ALTER TABLE public.features
  ADD COLUMN IF NOT EXISTS demo_style text
    CHECK (demo_style IN ('bright', 'dark')),
  ADD COLUMN IF NOT EXISTS youtube_video_id text,
  ADD COLUMN IF NOT EXISTS youtube_uploaded_at timestamptz;

COMMENT ON COLUMN public.features.demo_style IS
  'bright = v2 infographic clip, safe to publish; dark = legacy v1 clip, never publish to social; NULL = no clip yet';
COMMENT ON COLUMN public.features.youtube_video_id IS
  'YouTube video id for this feature''s narrated cut, written back by the upload runner';

-- Everything that already has a clip is dark until proven otherwise; the bright
-- list below then overrides. Safer than the reverse: a mislabelled dark clip
-- costs one skipped day, a mislabelled bright clip costs a bad LinkedIn post.
UPDATE public.features
   SET demo_style = 'dark'
 WHERE demo_media_url IS NOT NULL
   AND demo_style IS NULL;

-- The 35 features rebuilt in bright v2: the lux wave (30 rows of
-- feature_video_repost_queue), the j26 pilot, and the j28-j31 rebuild of
-- 2026-08-26.
UPDATE public.features
   SET demo_style = 'bright'
 WHERE feature_id IN (
   'p01','p02','p03','p04','p05','p06','p07','p08','p09','p10',
   'p11','p12','p13','p14','p15','p16','p17','p18','p19','p20',
   'p21','p22','p23','p24','p25','p26','p58','p59','p61','j01',
   'j26','j28','j29','j30','j31'
 );

-- YouTube ids known from the upload runner's log as of 2026-08-26. The '-v2'
-- suffix in that log is the artifact name, not the feature id.
UPDATE public.features AS f
   SET youtube_video_id = v.vid,
       youtube_uploaded_at = v.day::timestamptz
  FROM (VALUES
    ('j06','t6xOeJWY-W8','2026-08-21'),
    ('j07','algIdHHf6Hc','2026-08-21'),
    ('j08','NWea4cS8IJw','2026-08-22'),
    ('p01','ZhicUZ0_br8','2026-08-22'),
    ('p02','muX0VqmSMlc','2026-08-22'),
    ('p30','Yk-ordY5eBY','2026-08-22'),
    ('j09','DkN_z0nMQjM','2026-08-23'),
    ('j10','1j6bXnY-zh4','2026-08-23'),
    ('j11','xZU5S6yU1p8','2026-08-23'),
    ('j12','532fR3X9YxU','2026-08-23'),
    ('j26','Sbe5YHhjOWM','2026-08-24')
  ) AS v(fid, vid, day)
 WHERE f.feature_id = v.fid
   AND f.youtube_video_id IS NULL;

CREATE INDEX IF NOT EXISTS idx_features_demo_style ON public.features (demo_style);
