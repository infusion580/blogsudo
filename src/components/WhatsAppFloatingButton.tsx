import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "525658751914";
const MESSAGE = "Hola! Me interesa una asesoría gratis.";

export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(MESSAGE)}`;

/** Botón flotante fijo abajo a la izquierda — siempre visible. */
export function WhatsAppFloatingButton() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Asesoría gratis por WhatsApp"
      className="fixed bottom-5 left-5 z-50 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-glow px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow ring-1 ring-primary/40 backdrop-blur transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <MessageCircle className="h-4 w-4" />
      <span className="hidden sm:inline">Asesoría gratis</span>
    </a>
  );
}
