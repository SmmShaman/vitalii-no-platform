-- Fix is_published default on the news table.
--
-- Previous default was `true`, which is a footgun: any insert that
-- forgets to set is_published explicitly results in an article that
-- shows up in the public feed before its content has been rewritten,
-- translated, and approved. This was the root cause of the May 5-8
-- "zombie rows" incident where 372 articles ended up with both
-- is_published=true and pre_moderation_status='rejected', appearing
-- at the top of the homepage as broken/empty entries.
--
-- All current INSERT paths in the codebase set is_published=false
-- explicitly, so this change is functionally a no-op for normal
-- operation but it eliminates the failure mode.

ALTER TABLE public.news
  ALTER COLUMN is_published SET DEFAULT false;
