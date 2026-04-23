import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Calendar, Sparkles, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "blog.lab — Artículos y eventos sobre tecnología" },
      { name: "description", content: "Inspiración, ideas y eventos sobre desarrollo, diseño y producto." },
      { property: "og:title", content: "blog.lab" },
      { property: "og:description", content: "Inspiración, ideas y eventos sobre desarrollo, diseño y producto." },
    ],
  }),
  component: Index,
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
interface Event {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  event_date: string;
  location: string | null;
}

function Index() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    supabase
      .from("articles")
      .select("id,slug,title,excerpt,cover_image_url,category,published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(3)
      .then(({ data }) => setArticles(data ?? []));

    supabase
      .from("events")
      .select("id,slug,title,description,cover_image_url,event_date,location")
      .eq("status", "published")
      .gte("event_date", new Date().toISOString().slice(0, 10))
      .order("event_date", { ascending: true })
      .limit(3)
      .then(({ data }) => setEvents(data ?? []));
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="relative mx-auto max-w-7xl px-6 pt-24 pb-32 text-center md:pt-32 md:pb-40">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Blog · {new Date().getFullYear()}
          </div>
          <h1 className="mx-auto mt-8 max-w-5xl text-5xl font-black leading-[1.05] tracking-tight md:text-7xl lg:text-8xl">
            Ideas que <span className="text-gradient">construyen</span>
            <br />
            <span className="italic font-light">el futuro digital.</span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-base text-muted-foreground md:text-lg">
            Artículos, ensayos y eventos sobre desarrollo, diseño y producto.
            Contenido con identidad propia y código que escala.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link to="/articulos">
              <Button size="lg" className="rounded-full bg-primary px-7 hover:bg-primary/90 glow-primary">
                Explorar artículos <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/eventos">
              <Button size="lg" variant="outline" className="rounded-full border-border/70 bg-card/40 px-7 backdrop-blur">
                Ver eventos
              </Button>
            </Link>
            <a href="https://sodulabs.lovable.app" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="ghost" className="rounded-full px-7 text-muted-foreground hover:text-foreground">
                Regresar al sitio <ExternalLink className="ml-1 h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ARTÍCULOS */}
      <section className="mx-auto w-full max-w-7xl px-6 py-20">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Lectura</p>
            <h2 className="mt-2 text-4xl font-bold md:text-5xl">
              Últimos <span className="italic font-light">artículos</span>
            </h2>
          </div>
          <Link to="/articulos" className="hidden text-sm text-muted-foreground hover:text-foreground md:inline-flex">
            Ver todos →
          </Link>
        </div>

        {articles.length === 0 ? (
          <EmptyState message="Aún no hay artículos publicados." />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        )}
      </section>

      {/* EVENTOS */}
      <section className="mx-auto w-full max-w-7xl px-6 pb-24">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Agenda</p>
            <h2 className="mt-2 text-4xl font-bold md:text-5xl">
              Próximos <span className="italic font-light">eventos</span>
            </h2>
          </div>
          <Link to="/eventos" className="hidden text-sm text-muted-foreground hover:text-foreground md:inline-flex">
            Ver todos →
          </Link>
        </div>

        {events.length === 0 ? (
          <EmptyState message="No hay eventos próximos por el momento." />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border/60 bg-card/30 p-12 text-center text-muted-foreground">
      {message}
    </div>
  );
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      to="/articulos/$slug"
      params={{ slug: article.slug }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/40 backdrop-blur transition-all hover:border-primary/50 hover:bg-card/70"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
        {article.cover_image_url ? (
          <img
            src={article.cover_image_url}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary-glow/10 text-4xl font-black text-primary/40">
            {article.title[0]}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        {article.category && (
          <span className="text-xs font-medium uppercase tracking-widest text-primary">
            {article.category}
          </span>
        )}
        <h3 className="text-xl font-bold leading-tight group-hover:text-gradient">{article.title}</h3>
        {article.excerpt && (
          <p className="line-clamp-2 text-sm text-muted-foreground">{article.excerpt}</p>
        )}
      </div>
    </Link>
  );
}

function EventCard({ event }: { event: Event }) {
  return (
    <Link
      to="/eventos/$slug"
      params={{ slug: event.slug }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/40 backdrop-blur transition-all hover:border-primary/50 hover:bg-card/70"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
        {event.cover_image_url ? (
          <img src={event.cover_image_url} alt={event.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary-glow/10">
            <Calendar className="h-12 w-12 text-primary/50" />
          </div>
        )}
        <div className="absolute left-4 top-4 rounded-lg bg-background/80 px-3 py-1.5 text-xs font-medium backdrop-blur">
          {new Date(event.event_date).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <h3 className="text-xl font-bold leading-tight group-hover:text-gradient">{event.title}</h3>
        {event.description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">{event.description}</p>
        )}
        {event.location && (
          <p className="text-xs text-muted-foreground">📍 {event.location}</p>
        )}
      </div>
    </Link>
  );
}
