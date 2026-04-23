import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Calendar, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const SITE_URL = "https://blogsudo.lovable.app";

export const Route = createFileRoute("/eventos/")({
  head: () => ({
    meta: [
      { title: "Eventos — sudo.labs" },
      { name: "description", content: "Charlas, talleres y meetups de sudo.labs. Encuentra los próximos eventos sobre desarrollo, diseño y tecnología." },
      { name: "keywords", content: "eventos tecnología, meetups desarrollo, talleres programación, charlas tech" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/eventos` },
      { property: "og:title", content: "Eventos — sudo.labs" },
      { property: "og:description", content: "Charlas, talleres y meetups sobre desarrollo, diseño y tecnología." },
      { name: "twitter:title", content: "Eventos — sudo.labs" },
      { name: "twitter:description", content: "Charlas, talleres y meetups sobre desarrollo, diseño y tecnología." },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/eventos` }],
  }),
  component: EventsIndex,
});

interface Event {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  event_date: string;
  event_time: string | null;
  location: string | null;
  category: string | null;
}

function EventsIndex() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("events")
      .select("id,slug,title,description,cover_image_url,event_date,event_time,location,category")
      .eq("status", "published")
      .order("event_date", { ascending: true })
      .then(({ data }) => {
        setEvents(data ?? []);
        setLoading(false);
      });
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = events.filter((e) => e.event_date >= today);
  const past = events.filter((e) => e.event_date < today);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="border-b border-border/50 bg-grid">
          <div className="mx-auto max-w-7xl px-6 py-20 text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Agenda</p>
            <h1 className="mt-3 text-5xl font-black md:text-7xl">
              Todos los <span className="italic font-light text-gradient">eventos</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
              Charlas, talleres y meetups de la comunidad.
            </p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-6 py-16">
          {loading ? (
            <p className="text-center text-muted-foreground">Cargando…</p>
          ) : events.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/60 bg-card/30 p-16 text-center text-muted-foreground">
              No hay eventos publicados todavía.
            </div>
          ) : (
            <div className="space-y-14">
              {upcoming.length > 0 && (
                <div>
                  <h2 className="mb-6 text-2xl font-bold">Próximos</h2>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {upcoming.map((e) => <EventCard key={e.id} event={e} />)}
                  </div>
                </div>
              )}
              {past.length > 0 && (
                <div>
                  <h2 className="mb-6 text-2xl font-bold text-muted-foreground">Pasados</h2>
                  <div className="grid gap-6 opacity-70 md:grid-cols-2 lg:grid-cols-3">
                    {past.map((e) => <EventCard key={e.id} event={e} />)}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}

function EventCard({ event }: { event: Event }) {
  return (
    <Link
      to="/eventos/$slug"
      params={{ slug: event.slug }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/40 backdrop-blur transition-all hover:border-primary/50"
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
      <div className="flex flex-1 flex-col gap-2 p-6">
        {event.category && <span className="text-xs font-medium uppercase tracking-widest text-primary">{event.category}</span>}
        <h3 className="text-xl font-bold leading-tight group-hover:text-gradient">{event.title}</h3>
        {event.description && <p className="line-clamp-2 text-sm text-muted-foreground">{event.description}</p>}
        {event.location && (
          <p className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" /> {event.location}
          </p>
        )}
      </div>
    </Link>
  );
}
