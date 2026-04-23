import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArticleLikeButton } from "@/components/ArticleLikeButton";

interface ArticleFull {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  category: string | null;
  tags: string[] | null;
  published_at: string | null;
  like_count: number;
}

async function loadArticle(slug: string): Promise<ArticleFull> {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error) throw error;
  if (!data) throw notFound();
  return data as ArticleFull;
}

export const Route = createFileRoute("/articulos/$slug")({
  loader: ({ params }) => loadArticle(params.slug),
  head: ({ loaderData }) => {
    const a = loaderData as ArticleFull | undefined;
    return {
      meta: [
        { title: a ? `${a.title} — blog.lab` : "Artículo — blog.lab" },
        { name: "description", content: a?.excerpt ?? "Artículo del blog" },
        { property: "og:title", content: a?.title ?? "Artículo" },
        { property: "og:description", content: a?.excerpt ?? "" },
        ...(a?.cover_image_url ? [{ property: "og:image", content: a.cover_image_url }] : []),
      ],
    };
  },
  notFoundComponent: () => (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1 items-center justify-center p-10 text-center">
        <div>
          <h1 className="text-3xl font-bold">Artículo no encontrado</h1>
          <Link to="/articulos" className="mt-4 inline-block text-primary hover:underline">← Ver todos los artículos</Link>
        </div>
      </div>
      <Footer />
    </div>
  ),
  errorComponent: ({ error, reset }) => {
    const router = useRouter();
    return (
      <div className="flex min-h-screen items-center justify-center p-10 text-center">
        <div>
          <h1 className="text-2xl font-bold">Error al cargar</h1>
          <p className="mt-2 text-muted-foreground">{error.message}</p>
          <button onClick={() => { router.invalidate(); reset(); }} className="mt-4 rounded-full bg-primary px-5 py-2 text-sm">
            Reintentar
          </button>
        </div>
      </div>
    );
  },
  component: ArticlePage,
});

function ArticlePage() {
  const article = Route.useLoaderData() as ArticleFull;
  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    // basic markdown-ish: paragraphs from line breaks, escape HTML
    const escaped = article.content
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    const paragraphs = escaped
      .split(/\n\n+/)
      .map((p) => `<p>${p.replace(/\n/g, "<br/>")}</p>`)
      .join("");
    setHtml(paragraphs);
  }, [article.content]);

  useEffect(() => {
    // Track view (once per mount)
    supabase.rpc("increment_article_views", { _slug: article.slug });
  }, [article.slug]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-6 py-16">
          <Link to="/articulos" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Todos los artículos
          </Link>

          {article.category && (
            <span className="text-xs font-medium uppercase tracking-widest text-primary">{article.category}</span>
          )}
          <h1 className="mt-3 text-4xl font-black leading-tight md:text-6xl">{article.title}</h1>
          {article.excerpt && <p className="mt-6 text-lg text-muted-foreground">{article.excerpt}</p>}
          {article.published_at && (
            <p className="mt-4 text-xs text-muted-foreground">
              Publicado el {new Date(article.published_at).toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" })}
            </p>
          )}

          {article.cover_image_url && (
            <img src={article.cover_image_url} alt={article.title} className="mt-10 aspect-[16/9] w-full rounded-2xl object-cover" />
          )}

          <div
            className="prose-blog mt-10 space-y-5 text-base leading-relaxed text-foreground/90 [&_p]:text-foreground/85"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          <div className="mt-10 flex items-center justify-center border-t border-border/60 pt-8">
            <ArticleLikeButton articleId={article.id} initialCount={article.like_count ?? 0} />
          </div>

          {article.tags && article.tags.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {article.tags.map((t) => (
                <span key={t} className="rounded-full border border-border/60 bg-card/50 px-3 py-1 text-xs text-muted-foreground">
                  #{t}
                </span>
              ))}
            </div>
          )}

          <div className="mt-12 flex flex-col items-center gap-4 rounded-2xl border border-primary/30 bg-primary/5 p-8 text-center">
            <p className="text-lg font-semibold">¿Te interesó este artículo?</p>
            <p className="text-sm text-muted-foreground">Conoce más sobre nuestros servicios y cómo podemos ayudarte.</p>
            <a href="https://sodulabs.lovable.app" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="rounded-full bg-primary px-7 hover:bg-primary/90 glow-primary">
                Asesórate <ExternalLink className="ml-1 h-4 w-4" />
              </Button>
            </a>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
