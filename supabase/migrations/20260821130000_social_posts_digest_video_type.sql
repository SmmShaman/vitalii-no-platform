-- Allow 'digest_video' content_type in social_media_posts.
-- Used by the NanoClaw daily task that posts the video digest to LinkedIn
-- (content_id = daily_video_drafts.id).
ALTER TABLE public.social_media_posts
  DROP CONSTRAINT IF EXISTS social_media_posts_content_type_check;

ALTER TABLE public.social_media_posts
  ADD CONSTRAINT social_media_posts_content_type_check
  CHECK (content_type = ANY (ARRAY['news'::text, 'blog'::text, 'top_social'::text, 'feature'::text, 'digest_video'::text]));
