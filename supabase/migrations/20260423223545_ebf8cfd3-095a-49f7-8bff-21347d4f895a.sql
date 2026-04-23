-- Add like_count to articles
ALTER TABLE public.articles
ADD COLUMN IF NOT EXISTS like_count integer NOT NULL DEFAULT 0;

-- Table for anonymous likes (one per session per article)
CREATE TABLE IF NOT EXISTS public.article_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  session_id text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (article_id, session_id)
);

CREATE INDEX IF NOT EXISTS idx_article_likes_article ON public.article_likes(article_id);
CREATE INDEX IF NOT EXISTS idx_article_likes_session ON public.article_likes(session_id);

ALTER TABLE public.article_likes ENABLE ROW LEVEL SECURITY;

-- Anyone can read likes (to know if they liked or to view counts)
CREATE POLICY "Likes viewable by all"
  ON public.article_likes
  FOR SELECT
  USING (true);

-- Anyone can insert a like (anon + authenticated)
CREATE POLICY "Anyone can like"
  ON public.article_likes
  FOR INSERT
  WITH CHECK (true);

-- Anyone can delete their own like (matched by session_id)
CREATE POLICY "Anyone can unlike"
  ON public.article_likes
  FOR DELETE
  USING (true);

-- Function: like an article (insert + increment counter)
CREATE OR REPLACE FUNCTION public.like_article(_article_id uuid, _session_id text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.article_likes (article_id, session_id)
  VALUES (_article_id, _session_id)
  ON CONFLICT (article_id, session_id) DO NOTHING;

  IF FOUND THEN
    UPDATE public.articles
    SET like_count = like_count + 1
    WHERE id = _article_id;
  END IF;
END;
$$;

-- Function: unlike an article (delete + decrement counter)
CREATE OR REPLACE FUNCTION public.unlike_article(_article_id uuid, _session_id text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.article_likes
  WHERE article_id = _article_id AND session_id = _session_id;

  IF FOUND THEN
    UPDATE public.articles
    SET like_count = GREATEST(like_count - 1, 0)
    WHERE id = _article_id;
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.like_article(uuid, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.unlike_article(uuid, text) TO anon, authenticated;