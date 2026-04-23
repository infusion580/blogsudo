import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, MessageCircle, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { WHATSAPP_URL } from "@/components/WhatsAppFloatingButton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Header() {
  const { user, isAdmin, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Cerrar el menú al cambiar de ruta
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const links = [
    { to: "/" as const, label: "Inicio" },
    { to: "/articulos" as const, label: "Artículos" },
    { to: "/eventos" as const, label: "Eventos" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:h-16 sm:px-6">
        <Link to="/" aria-label="sudo.labs — Inicio" className="text-lg md:text-xl">
          <Logo size={32} />
        </Link>

        {/* Navegación desktop (>= lg) */}
        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
          <a
            href="https://sodulabs.lovable.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Volver al sitio <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </nav>

        {/* Acciones desktop (>= lg) */}
        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-glow px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-105"
          >
            <MessageCircle className="h-4 w-4" />
            Asesoría gratis
          </a>
          {user ? (
            <>
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="secondary" size="sm">Admin</Button>
                </Link>
              )}
              <Button variant="ghost" size="sm" onClick={() => signOut()}>
                Salir
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button variant="ghost" size="sm">
                Ingresar
              </Button>
            </Link>
          )}
        </div>

        {/* Hamburguesa (< lg): tablets y móvil */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground transition-colors hover:bg-secondary lg:hidden"
              aria-label="Abrir menú"
            >
              <Menu className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-full max-w-sm border-l border-border/50 bg-background/95 p-0 backdrop-blur-xl"
          >
            <SheetHeader className="border-b border-border/50 px-5 py-4 text-left">
              <SheetTitle className="flex items-center gap-2">
                <Logo size={28} />
              </SheetTitle>
            </SheetHeader>

            <div className="flex h-[calc(100%-4rem)] flex-col overflow-y-auto px-5 py-4">
              <nav className="flex flex-col gap-1">
                {links.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    activeProps={{ className: "bg-secondary text-foreground" }}
                    activeOptions={{ exact: l.to === "/" }}
                  >
                    {l.label}
                  </Link>
                ))}
                <a
                  href="https://sodulabs.lovable.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-lg px-3 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  Volver al sitio <ExternalLink className="h-4 w-4" />
                </a>
              </nav>

              <div className="mt-6 space-y-2 border-t border-border/50 pt-4">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-glow px-4 py-3 text-sm font-semibold text-primary-foreground shadow-glow"
                >
                  <MessageCircle className="h-4 w-4" />
                  Asesoría gratis
                </a>

                {user ? (
                  <>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setOpen(false)} className="block">
                        <Button variant="secondary" className="w-full">
                          Admin
                        </Button>
                      </Link>
                    )}
                    <Button
                      variant="ghost"
                      className="w-full"
                      onClick={() => {
                        signOut();
                        setOpen(false);
                      }}
                    >
                      Salir
                    </Button>
                  </>
                ) : (
                  <Link to="/auth" onClick={() => setOpen(false)} className="block">
                    <Button variant="ghost" className="w-full">
                      Ingresar
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
