import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background/50">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-10 md:flex-row">
        <div className="flex items-center gap-2 font-bold">
          <Logo className="h-7 w-7" />
          <span>
            sudo<span className="text-primary">.labs</span>
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} sudo.labs — Construido con código que importa.
        </p>
        <div className="flex items-center gap-5 text-xs text-muted-foreground">
          <Link to="/articulos" className="hover:text-foreground">Artículos</Link>
          <Link to="/eventos" className="hover:text-foreground">Eventos</Link>
        </div>
      </div>
    </footer>
  );
}
