import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "@/components/ui/sonner";
import { WhatsAppFloatingButton } from "@/components/WhatsAppFloatingButton";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-gradient">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Página no encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          La página que buscás no existe o fue movida.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "blog.lab — Artículos y eventos sobre tecnología" },
      { name: "description", content: "Blog de artículos y eventos sobre desarrollo, diseño y tecnología." },
      { name: "author", content: "blog.lab" },
      { property: "og:title", content: "blog.lab — Artículos y eventos sobre tecnología" },
      { property: "og:description", content: "Blog de artículos y eventos sobre desarrollo, diseño y tecnología." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "blog.lab — Artículos y eventos sobre tecnología" },
      { name: "twitter:description", content: "Blog de artículos y eventos sobre desarrollo, diseño y tecnología." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/1e47fd4e-d31f-4368-ba48-f2b78b951e73/id-preview-809c4d22--2eaa45e2-098c-4606-b698-6803df493d9f.lovable.app-1776979545567.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/1e47fd4e-d31f-4368-ba48-f2b78b951e73/id-preview-809c4d22--2eaa45e2-098c-4606-b698-6803df493d9f.lovable.app-1776979545567.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <AuthProvider>
      <Outlet />
      <WhatsAppFloatingButton />
      <Toaster />
    </AuthProvider>
  );
}
