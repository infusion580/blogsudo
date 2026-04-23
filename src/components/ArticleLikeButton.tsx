import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const SESSION_KEY = "sudo_like_session_id";

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let sid = localStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

interface ArticleLikeButtonProps {
  articleId: string;
  initialCount: number;
}

export function ArticleLikeButton({ articleId, initialCount }: ArticleLikeButtonProps) {
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const sid = getSessionId();
    if (!sid) return;
    supabase
      .from("article_likes")
      .select("id")
      .eq("article_id", articleId)
      .eq("session_id", sid)
      .maybeSingle()
      .then(({ data }) => setLiked(!!data));
  }, [articleId]);

  async function toggle() {
    if (loading) return;
    const sid = getSessionId();
    if (!sid) return;
    setLoading(true);

    const wasLiked = liked;
    // Optimistic UI
    setLiked(!wasLiked);
    setCount((c) => (wasLiked ? Math.max(c - 1, 0) : c + 1));
    if (!wasLiked) {
      setAnimate(true);
      setTimeout(() => setAnimate(false), 400);
    }

    const { error } = wasLiked
      ? await supabase.rpc("unlike_article", { _article_id: articleId, _session_id: sid })
      : await supabase.rpc("like_article", { _article_id: articleId, _session_id: sid });

    if (error) {
      // Revert on failure
      setLiked(wasLiked);
      setCount((c) => (wasLiked ? c + 1 : Math.max(c - 1, 0)));
    }
    setLoading(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      aria-pressed={liked}
      aria-label={liked ? "Quitar me gusta" : "Me gusta"}
      className={cn(
        "group inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-all",
        liked
          ? "border-primary/50 bg-primary/15 text-primary glow-primary"
          : "border-border bg-card/50 text-muted-foreground hover:border-primary/40 hover:text-foreground",
        loading && "opacity-70",
      )}
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-transform",
          liked && "fill-current",
          animate && "scale-125",
        )}
      />
      <span>{count}</span>
      <span className="hidden sm:inline">{liked ? "Te gusta" : "Me gusta"}</span>
    </button>
  );
}
