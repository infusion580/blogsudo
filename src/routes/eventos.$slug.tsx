import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Calendar, MapPin, Clock, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";

interface EventFull {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  content: string | null;
  cover_image_url: string | null;
  event_date: string;
  event_time: string | null;
  location: string | null;
  registration_url: string | null;
  category: string | null;
}

async function loadEvent(slug: string): Promise<EventFull> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error) throw error;
  if (!data) throw notFound();
  return data as EventFull;
}

export const Route = createFileRoute("/eventos/$slug")({
  loader: ({ params }) => loadEvent(params.slug),
  head: ({ loaderData }) => {
    const e = loaderData as EventFull | undefined;
    return {
      meta: [
        { title: e ? `${e.title} — blog.lab` : "Evento" },
        { name: "description", content: e?.description ?? "Evento del blog" },
        { property: "og:title", content: e?.title ?? "Evento" },
        { property: "og:description", content: e?.description ?? "" },
        ...(e?.cover_image_url ? [{ property: "og:image", content: e.cover_image_url }] : []),
      ],
    };
  },
  notFoundComponent: () => (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1 items-center justify-center p-10 text-center">
        <div>
          <h1 className="text-3xl font-bold">Evento no encontrado</h1>
          <Link to="/eventos" className="mt-4 inline-block text-primary hover:underline">← Ver todos los eventos</Link>
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
          <h1 className="text-2xl font-bold">Error</h1>
          <p className="mt-2 text-muted-foreground">{error.message}</p>
          <button onClick={() => { router.invalidate(); reset(); }} className="mt-4 rounded-full bg-primary px-5 py-2 text-sm">
            Reintentar
          </button>
        </div>
      </div>
    );
  },
  component: EventPage,
});

function EventPage() {
  const event = Route.useLoaderData() as EventFull;
  const dateLong = new Date(event.event_date).toLocaleDateString("es-ES", {
    weekday: "long", day: "2-digit", month: "long", year: "numeric",
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-6 py-16">
          <Link to="/eventos" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Todos los eventos
          </Link>

          {event.category && <span className="text-xs font-medium uppercase tracking-widest text-primary">{event.category}</span>}
          <h1 className="mt-3 text-4xl font-black leading-tight md:text-6xl">{event.title}</h1>
          {event.description && <p className="mt-6 text-lg text-muted-foreground">{event.description}</p>}

          {event.cover_image_url && (
            <img src={event.cover_image_url} alt={event.title} className="mt-10 aspect-[16/9] w-full rounded-2xl object-cover" />
          )}

          <div className="mt-10 grid gap-3 rounded-2xl border border-border/60 bg-card/40 p-6 sm:grid-cols-3">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs uppercase text-muted-foreground">Fecha</p>
                <p className="text-sm font-medium capitalize">{dateLong}</p>
              </div>
            </div>
            {event.event_time && (
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs uppercase text-muted-foreground">Hora</p>
                  <p className="text-sm font-medium">{event.event_time.slice(0, 5)}</p>
                </div>
              </div>
            )}
            {event.location && (
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs uppercase text-muted-foreground">Lugar</p>
                  <p className="text-sm font-medium">{event.location}</p>
                </div>
              </div>
            )}
          </div>

          {event.content && (
            <div className="mt-10 space-y-5 whitespace-pre-line text-base leading-relaxed text-foreground/90">
              {event.content}
            </div>
          )}

          {event.registration_url && (
            <div className="mt-10">
              <a href={event.registration_url} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="rounded-full bg-primary px-7 hover:bg-primary/90 glow-primary">
                  Inscribirme <ExternalLink className="ml-1 h-4 w-4" />
                </Button>
              </a>
            </div>
          )}

          <div className="mt-12 flex flex-col items-center gap-4 rounded-2xl border border-primary/30 bg-primary/5 p-8 text-center">
            <p className="text-lg font-semibold">¿Quieres saber más?</p>
            <p className="text-sm text-muted-foreground">Conoce nuestros servicios y recibe asesoría personalizada.</p>
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
