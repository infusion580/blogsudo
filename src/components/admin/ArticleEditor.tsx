import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { slugify } from "@/lib/slugify";
import { ImageUpload } from "@/components/admin/ImageUpload";

interface ArticleForm {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image_url: string;
  category: string;
  tags: string;
  status: "draft" | "published";
}

interface Props { id?: string }

export function ArticleEditor({ id }: Props) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!!id);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<ArticleForm>({
    slug: "", title: "", excerpt: "", content: "", cover_image_url: "",
    category: "", tags: "", status: "draft",
  });

  useEffect(() => {
    if (!id) return;
    supabase.from("articles").select("*").eq("id", id).maybeSingle().then(({ data }) => {
      if (data) {
        setForm({
          id: data.id,
          slug: data.slug,
          title: data.title,
          excerpt: data.excerpt ?? "",
          content: data.content,
          cover_image_url: data.cover_image_url ?? "",
          category: data.category ?? "",
          tags: (data.tags ?? []).join(", "),
          status: data.status as "draft" | "published",
        });
      }
      setLoading(false);
    });
  }, [id]);

  const update = <K extends keyof ArticleForm>(k: K, v: ArticleForm[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const onTitleBlur = () => {
    if (!form.slug && form.title) update("slug", slugify(form.title));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error("El título es obligatorio");
    if (!form.content.trim()) return toast.error("El contenido es obligatorio");
    const slug = form.slug.trim() || slugify(form.title);

    setSubmitting(true);
    const payload = {
      slug,
      title: form.title.trim(),
      excerpt: form.excerpt.trim() || null,
      content: form.content,
      cover_image_url: form.cover_image_url.trim() || null,
      category: form.category.trim() || null,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      status: form.status,
      published_at: form.status === "published" ? new Date().toISOString() : null,
      author_id: user?.id ?? null,
    };

    const { error } = id
      ? await supabase.from("articles").update(payload).eq("id", id)
      : await supabase.from("articles").insert(payload);
    setSubmitting(false);

    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(id ? "Actualizado" : "Creado");
    navigate({ to: "/admin/articulos" });
  };

  if (loading) return <p className="text-muted-foreground">Cargando…</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Link to="/admin/articulos" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Volver
      </Link>
      <h1 className="text-3xl font-black">
        {id ? "Editar" : "Nuevo"} <span className="italic font-light text-gradient">artículo</span>
      </h1>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div>
            <Label>Título *</Label>
            <Input value={form.title} onChange={(e) => update("title", e.target.value)} onBlur={onTitleBlur} required />
          </div>
          <div>
            <Label>Slug (URL)</Label>
            <Input value={form.slug} onChange={(e) => update("slug", slugify(e.target.value))} placeholder="se-genera-automatico" />
          </div>
          <div>
            <Label>Extracto</Label>
            <Textarea value={form.excerpt} onChange={(e) => update("excerpt", e.target.value)} rows={2} />
          </div>
          <div>
            <Label>Contenido *</Label>
            <Textarea value={form.content} onChange={(e) => update("content", e.target.value)} rows={16} required />
            <p className="mt-1 text-xs text-muted-foreground">Separá párrafos con líneas en blanco.</p>
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
          <ImageUpload
            value={form.cover_image_url}
            onChange={(url) => update("cover_image_url", url)}
            folder="articles"
          />
          <div>
            <Label>Categoría</Label>
            <Input value={form.category} onChange={(e) => update("category", e.target.value)} placeholder="Desarrollo, Diseño..." />
          </div>
          <div>
            <Label>Tags (separados por coma)</Label>
            <Input value={form.tags} onChange={(e) => update("tags", e.target.value)} placeholder="react, tutorial" />
          </div>

          <Button type="submit" disabled={submitting} className="w-full rounded-full bg-primary hover:bg-primary/90 glow-primary">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : id ? "Guardar cambios" : "Crear artículo"}
          </Button>
        </div>
      </div>
    </form>
  );
}
