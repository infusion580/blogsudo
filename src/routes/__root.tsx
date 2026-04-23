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

const SITE_URL = "https://blogsudo.lovable.app";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "sudo.labs — Artículos y eventos sobre tecnología" },
      { name: "description", content: "Blog de sudo.labs: artículos y eventos sobre desarrollo, diseño, producto y tecnología en español." },
      { name: "author", content: "sudo.labs" },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1" },
      { name: "theme-color", content: "#9d4edd" },
      { property: "og:site_name", content: "sudo.labs" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: SITE_URL },
      { property: "og:title", content: "sudo.labs — Artículos y eventos sobre tecnología" },
      { property: "og:description", content: "Blog de sudo.labs: artículos y eventos sobre desarrollo, diseño, producto y tecnología en español." },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "sudo.labs — Artículos y eventos sobre tecnología" },
      { name: "twitter:description", content: "Blog de sudo.labs: artículos y eventos sobre desarrollo, diseño, producto y tecnología en español." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "canonical", href: SITE_URL },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
      { rel: "shortcut icon", href: "/favicon.ico" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/site.webmanifest" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "sudo.labs",
          url: SITE_URL,
          logo: `${SITE_URL}/favicon-512.png`,
          sameAs: ["https://sodulabs.lovable.app"],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "sudo.labs",
          url: SITE_URL,
          inLanguage: "es",
        }),
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
