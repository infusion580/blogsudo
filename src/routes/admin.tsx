import { createFileRoute, Outlet, redirect, Link, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import { FileText, Calendar, LogOut, Home } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — blog.lab" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = "/auth";
    }
  }, [loading, user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Cargando…</p>
      </div>
    );
  }

  if (!user) return null;

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1 items-center justify-center p-10 text-center">
          <div>
            <h1 className="text-3xl font-bold">Acceso restringido</h1>
            <p className="mt-2 text-muted-foreground">No tenés permisos de administrador.</p>
            <Link to="/" className="mt-4 inline-block text-primary hover:underline">Volver al inicio</Link>
          </div>
        </div>
      </div>
    );
  }

  const sections = [
    { to: "/admin" as const, label: "Inicio", icon: Home, exact: true },
    { to: "/admin/articulos" as const, label: "Artículos", icon: FileText },
    { to: "/admin/eventos" as const, label: "Eventos", icon: Calendar },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">B</span>
            <span>blog<span className="text-primary">.lab</span> <span className="text-xs font-normal text-muted-foreground">/ admin</span></span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/"><Button variant="ghost" size="sm">Ver sitio</Button></Link>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4" /> Salir
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-6 py-10 md:flex-row">
        <aside className="md:w-56 md:flex-shrink-0">
          <nav className="flex gap-1 overflow-x-auto md:flex-col">
            {sections.map((s) => {
              const active = s.exact
                ? location.pathname === s.to
                : location.pathname.startsWith(s.to);
              return (
                <Link
                  key={s.to}
                  to={s.to}
                  className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <s.icon className="h-4 w-4" /> {s.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
