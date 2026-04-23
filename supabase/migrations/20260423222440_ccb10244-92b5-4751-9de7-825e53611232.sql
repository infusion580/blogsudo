-- Add view_count column to articles
ALTER TABLE public.articles
ADD COLUMN IF NOT EXISTS view_count integer NOT NULL DEFAULT 0;

-- Function to increment views by slug (only for published articles)
CREATE OR REPLACE FUNCTION public.increment_article_views(_slug text)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.articles
  SET view_count = view_count + 1
  WHERE slug = _slug AND status = 'published';
$$;

-- Allow anyone (anon + authenticated) to call the function
GRANT EXECUTE ON FUNCTION public.increment_article_views(text) TO anon, authenticated;