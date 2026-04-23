import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/articulos/")({
  component: AdminArticles,
});

interface Row {
  id: string;
  slug: string;
  title: string;
  status: string;
  category: string | null;
  published_at: string | null;
  updated_at: string;
  view_count: number;
}

function AdminArticles() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    supabase
      .from("articles")
      .select("id,slug,title,status,category,published_at,updated_at,view_count")
      .order("updated_at", { ascending: false })
      .then(({ data }) => {
        setRows(data ?? []);
        setLoading(false);
      });
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id: string, title: string) => {
    if (!confirm(`¿Eliminar "${title}"?`)) return;
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Eliminado");
      load();
    }
  };

  const toggleStatus = async (r: Row) => {
    const next = r.status === "published" ? "draft" : "published";
    const { error } = await supabase
      .from("articles")
      .update({ status: next, published_at: next === "published" ? new Date().toISOString() : null })
      .eq("id", r.id);
    if (error) toast.error(error.message);
    else {
      toast.success(next === "published" ? "Publicado" : "Despublicado");
      load();
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-black">
          Artículos
        </h1>
        <Link to="/admin/articulos/nuevo">
          <Button className="rounded-full bg-primary hover:bg-primary/90 glow-primary">
            <Plus className="h-4 w-4" /> Nuevo
          </Button>
        </Link>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Cargando…</p>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/60 bg-card/30 p-16 text-center">
          <p className="text-muted-foreground">Aún no hay artículos. Creá el primero.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/40 backdrop-blur">
          <table className="w-full">
            <thead className="border-b border-border/60 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Título</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 hidden md:table-cell">Categoría</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-border/40 last:border-0">
                  <td className="px-4 py-3">
                    <div className="font-medium">{r.title}</div>
                    <div className="text-xs text-muted-foreground">/{r.slug}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      r.status === "published" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                    }`}>
                      {r.status === "published" ? "Publicado" : "Borrador"}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-sm text-muted-foreground">{r.category ?? "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => toggleStatus(r)} title={r.status === "published" ? "Despublicar" : "Publicar"}>
                        {r.status === "published" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Link to="/admin/articulos/$id" params={{ id: r.id }}>
                        <Button size="icon" variant="ghost" title="Editar"><Pencil className="h-4 w-4" /></Button>
                      </Link>
                      <Button size="icon" variant="ghost" onClick={() => remove(r.id, r.title)} title="Eliminar" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
