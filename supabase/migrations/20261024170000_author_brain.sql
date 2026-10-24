-- Author brain: what the blog writer knows about the owner.
-- personal_memory (who he is) + feature_projects (what he built) already exist;
-- brain_journal adds dated "what happened" entries appended by Claude sessions
-- and by the /brain bot command. Service role only.

CREATE TABLE IF NOT EXISTS brain_journal (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_date date NOT NULL DEFAULT current_date,
  project_id text,
  text text NOT NULL,
  source text NOT NULL DEFAULT 'claude-code',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS brain_journal_entry_date_idx ON brain_journal (entry_date DESC);

ALTER TABLE brain_journal ENABLE ROW LEVEL SECURITY;

-- Rows the blog writer must never see (e.g. contact details used elsewhere)
ALTER TABLE personal_memory ADD COLUMN IF NOT EXISTS blog_visible boolean NOT NULL DEFAULT true;
