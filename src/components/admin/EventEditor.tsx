import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { slugify } from "@/lib/slugify";
import { ImageUpload } from "@/components/admin/ImageUpload";

interface EventForm {
  slug: string;
  title: string;
  description: string;
  content: string;
  cover_image_url: string;
  event_date: string;
  event_time: string;
  location: string;
  registration_url: string;
  category: string;
  status: "draft" | "published";
}

export function EventEditor({ id }: { id?: string }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!!id);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<EventForm>({
    slug: "", title: "", description: "", content: "", cover_image_url: "",
    event_date: "", event_time: "", location: "", registration_url: "",
    category: "", status: "draft",
  });

  useEffect(() => {
    if (!id) return;
    supabase.from("events").select("*").eq("id", id).maybeSingle().then(({ data }) => {
      if (data) {
        setForm({
          slug: data.slug,
          title: data.title,
          description: data.description ?? "",
          content: data.content ?? "",
          cover_image_url: data.cover_image_url ?? "",
          event_date: data.event_date,
          event_time: data.event_time?.slice(0, 5) ?? "",
          location: data.location ?? "",
          registration_url: data.registration_url ?? "",
          category: data.category ?? "",
          status: data.status as "draft" | "published",
        });
      }
      setLoading(false);
    });
  }, [id]);

  const update = <K extends keyof EventForm>(k: K, v: EventForm[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const onTitleBlur = () => {
    if (!form.slug && form.title) update("slug", slugify(form.title));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error("El título es obligatorio");
    if (!form.event_date) return toast.error("La fecha es obligatoria");

    setSubmitting(true);
    const slug = form.slug.trim() || slugify(form.title);
    const payload = {
      slug,
      title: form.title.trim(),
      description: form.description.trim() || null,
      content: form.content.trim() || null,
      cover_image_url: form.cover_image_url.trim() || null,
      event_date: form.event_date,
      event_time: form.event_time || null,
      location: form.location.trim() || null,
      registration_url: form.registration_url.trim() || null,
      category: form.category.trim() || null,
      status: form.status,
    };

    const { error } = id
      ? await supabase.from("events").update(payload).eq("id", id)
      : await supabase.from("events").insert(payload);
    setSubmitting(false);

    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(id ? "Actualizado" : "Creado");
    navigate({ to: "/admin/eventos" });
  };

  if (loading) return <p className="text-muted-foreground">Cargando…</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Link to="/admin/eventos" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Volver
      </Link>
      <h1 className="text-3xl font-black">
        {id ? "Editar" : "Nuevo"} <span className="italic font-light text-gradient">evento</span>
      </h1>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div>
            <Label>Título *</Label>
            <Input value={form.title} onChange={(e) => update("title", e.target.value)} onBlur={onTitleBlur} required />
          </div>
          <div>
            <Label>Slug</Label>
            <Input value={form.slug} onChange={(e) => update("slug", slugify(e.target.value))} placeholder="se-genera-automatico" />
          </div>
          <div>
            <Label>Descripción corta</Label>
            <Textarea value={form.description} onChange={(e) => update("description", e.target.value)} rows={2} />
          </div>
          <div>
            <Label>Contenido / Detalles</Label>
            <Textarea value={form.content} onChange={(e) => update("content", e.target.value)} rows={10} />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <Label>Estado</Label>
            <select
              value={form.status}
              onChange={(e) => update("status", e.target.value as "draft" | "published")}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="draft">Borrador</option>
              <option value="published">Publicado</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Fecha *</Label>
              <Input type="date" value={form.event_date} onChange={(e) => update("event_date", e.target.value)} required />
            </div>
            <div>
              <Label>Hora</Label>
              <Input type="time" value={form.event_time} onChange={(e) => update("event_time", e.target.value)} />
            </div>
          </div>
          <div>
            <Label>Ubicación</Label>
            <Input value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="Online o ciudad" />
          </div>
          <ImageUpload
            value={form.cover_image_url}
            onChange={(url) => update("cover_image_url", url)}
            folder="events"
          />
          <div>
            <Label>Categoría</Label>
            <Input value={form.category} onChange={(e) => update("category", e.target.value)} />
          </div>
          <div>
            <Label>Link de inscripción</Label>
            <Input value={form.registration_url} onChange={(e) => update("registration_url", e.target.value)} placeholder="https://..." />
          </div>

          <Button type="submit" disabled={submitting} className="w-full rounded-full bg-primary hover:bg-primary/90 glow-primary">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : id ? "Guardar cambios" : "Crear evento"}
          </Button>
        </div>
      </div>
    </form>
  );
}
