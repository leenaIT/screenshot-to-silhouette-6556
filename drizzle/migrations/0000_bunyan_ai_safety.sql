CREATE TABLE public.ai_service_state (service text PRIMARY KEY, reason text NOT NULL, status integer NOT NULL, updated_at timestamptz NOT NULL DEFAULT now());
GRANT ALL ON public.ai_service_state TO service_role;
ALTER TABLE public.ai_service_state ENABLE ROW LEVEL SECURITY;
CREATE TABLE public.ai_request_windows (visitor_hash text PRIMARY KEY, started_at timestamptz NOT NULL DEFAULT now(), requests integer NOT NULL DEFAULT 1);
GRANT ALL ON public.ai_request_windows TO service_role;
ALTER TABLE public.ai_request_windows ENABLE ROW LEVEL SECURITY;
CREATE FUNCTION public.claim_ai_request(visitor text) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$ DECLARE n integer; BEGIN INSERT INTO public.ai_request_windows(visitor_hash) VALUES (visitor) ON CONFLICT(visitor_hash) DO UPDATE SET requests = CASE WHEN ai_request_windows.started_at < now() - interval '1 minute' THEN 1 ELSE ai_request_windows.requests + 1 END, started_at = CASE WHEN ai_request_windows.started_at < now() - interval '1 minute' THEN now() ELSE ai_request_windows.started_at END RETURNING requests INTO n; RETURN n <= 8; END $$;
REVOKE ALL ON FUNCTION public.claim_ai_request(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_ai_request(text) TO service_role;