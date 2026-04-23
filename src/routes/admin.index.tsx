import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FileText, Calendar, Plus, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/")({
  component: AdminHome,
});

function AdminHome() {
  const [stats, setStats] = useState({ articles: 0, events: 0, drafts: 0, views: 0 });

  useEffect(() => {
    Promise.all([
      supabase.from("articles").select("id", { count: "exact", head: true }),
      supabase.from("events").select("id", { count: "exact", head: true }),
      supabase.from("articles").select("id", { count: "exact", head: true }).eq("status", "draft"),
      supabase.from("articles").select("view_count"),
    ]).then(([a, e, d, v]) => {
      const totalViews = (v.data ?? []).reduce((sum, row) => sum + (row.view_count ?? 0), 0);
      setStats({
        articles: a.count ?? 0,
        events: e.count ?? 0,
        drafts: d.count ?? 0,
        views: totalViews,
      });
    });
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-black">
        Panel <span className="italic font-light text-gradient">admin</span>
      </h1>
      <p className="mt-2 text-muted-foreground">Gestioná el contenido del blog.</p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={FileText} label="Artículos" value={stats.articles} />
        <StatCard icon={Calendar} label="Eventos" value={stats.events} />
        <StatCard icon={FileText} label="Borradores" value={stats.drafts} />
        <StatCard icon={Eye} label="Vistas totales" value={stats.views} />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link to="/admin/articulos/nuevo">
          <Button className="w-full justify-start rounded-xl bg-primary hover:bg-primary/90" size="lg">
            <Plus className="h-4 w-4" /> Nuevo artículo
          </Button>
        </Link>
        <Link to="/admin/eventos/nuevo">
          <Button className="w-full justify-start rounded-xl" variant="secondary" size="lg">
            <Plus className="h-4 w-4" /> Nuevo evento
          </Button>
        </Link>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: typeof FileText; label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/50 p-6 backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
          <p className="text-3xl font-black">{value}</p>
        </div>
      </div>
    </div>
  );
}
