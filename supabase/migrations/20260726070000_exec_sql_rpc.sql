-- Read-only raw-SQL RPC for the self-hosted stack.
--
-- The managed Supabase Management API endpoint
-- POST https://api.supabase.com/v1/projects/<ref>/database/query
-- does not exist on self-host, so automation that used to run raw SELECTs
-- (nightly summary, social cross-post queues) had no way to query the DB.
--
-- SELECT-only by construction: the statement is wrapped in a subquery, so
-- DML/DDL cannot execute. service_role only — anon/authenticated are revoked.
CREATE OR REPLACE FUNCTION public.exec_sql(query text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $fn$
DECLARE
  result jsonb;
BEGIN
  EXECUTE 'SELECT COALESCE(jsonb_agg(t), ''[]''::jsonb) FROM (' || query || ') t'
    INTO result;
  RETURN result;
END;
$fn$;

REVOKE ALL ON FUNCTION public.exec_sql(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.exec_sql(text) FROM anon;
REVOKE ALL ON FUNCTION public.exec_sql(text) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.exec_sql(text) TO service_role;
