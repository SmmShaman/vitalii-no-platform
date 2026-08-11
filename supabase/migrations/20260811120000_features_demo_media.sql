-- Per-feature demo animation: short silent mp4/webm loop played like a GIF
ALTER TABLE features ADD COLUMN IF NOT EXISTS demo_media_url TEXT;
ALTER TABLE features ADD COLUMN IF NOT EXISTS demo_media_type TEXT DEFAULT 'video/mp4';
COMMENT ON COLUMN features.demo_media_url IS 'Short silent looping demo clip (mp4/webm on R2) shown in the feature card/article';
