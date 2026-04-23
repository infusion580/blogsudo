import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/articulos/")({
  head: () => ({
    meta: [
      { title: "Artículos — blog.lab" },
      { name: "description", content: "Todos los artículos publicados sobre desarrollo, diseño y producto." },
      { property: "og:title", content: "Artículos — blog.lab" },
      { property: "og:description", content: "Todos los artículos publicados sobre desarrollo, diseño y producto." },
    ],
  }),
  component: ArticlesIndex,
});

interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  category: string | null;
  published_at: string | null;
}

function ArticlesIndex() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("articles")
      .select("id,slug,title,excerpt,cover_image_url,category,published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .then(({ data }) => {
        setArticles(data ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="border-b border-border/50 bg-grid">
          <div className="mx-auto max-w-7xl px-6 py-20 text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Lectura</p>
            <h1 className="mt-3 text-5xl font-black md:text-7xl">
              Todos los <span className="italic font-light text-gradient">artículos</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
              Ensayos, tutoriales e ideas sobre desarrollo, diseño y producto.
            </p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-6 py-16">
          {loading ? (
            <p className="text-center text-muted-foreground">Cargando…</p>
          ) : articles.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/60 bg-card/30 p-16 text-center text-muted-foreground">
              Todavía no hay artículos publicados.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((a) => (
                <Link
                  key={a.id}
                  to="/articulos/$slug"
                  params={{ slug: a.slug }}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/40 backdrop-blur transition-all hover:border-primary/50"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
                    {a.cover_image_url ? (
                      <img src={a.cover_image_url} alt={a.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary-glow/10 text-4xl font-black text-primary/40">
                        {a.title[0]}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-6">
                    {a.category && <span className="text-xs font-medium uppercase tracking-widest text-primary">{a.category}</span>}
                    <h2 className="text-xl font-bold leading-tight group-hover:text-gradient">{a.title}</h2>
                    {a.excerpt && <p className="line-clamp-3 text-sm text-muted-foreground">{a.excerpt}</p>}
                    {a.published_at && (
                      <p className="mt-auto text-xs text-muted-foreground">
                        {new Date(a.published_at).toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" })}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
