-- Feature clips remember which digest-motion effects they used (feature factory,
-- 2026-10-07): {"effects": [...], "opener": "<b1 effect>", "at": "<iso time>"}.
-- The factory hands the last 3 clips' usage to the agent for variety.
ALTER TABLE features ADD COLUMN IF NOT EXISTS motion_usage jsonb;
