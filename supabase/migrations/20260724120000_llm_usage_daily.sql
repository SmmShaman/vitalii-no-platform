-- Daily LLM usage counter — hard budget gate against Gemini over-limit charges.
-- The shim calls bump_llm_usage('gemini') before each Gemini attempt and skips
-- Gemini entirely once the day's count exceeds GEMINI_DAILY_LIMIT (env).

CREATE TABLE IF NOT EXISTS public.llm_usage_daily (
  day date NOT NULL,
  provider text NOT NULL,
  calls integer NOT NULL DEFAULT 0,
  PRIMARY KEY (day, provider)
);

ALTER TABLE public.llm_usage_daily ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.bump_llm_usage(p_provider text)
RETURNS integer
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  INSERT INTO public.llm_usage_daily (day, provider, calls)
  VALUES (current_date, p_provider, 1)
  ON CONFLICT (day, provider)
  DO UPDATE SET calls = llm_usage_daily.calls + 1
  RETURNING calls;
$$;
