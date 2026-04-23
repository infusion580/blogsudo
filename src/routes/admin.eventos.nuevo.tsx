import { createFileRoute } from "@tanstack/react-router";
import { EventEditor } from "@/components/admin/EventEditor";

export const Route = createFileRoute("/admin/eventos/nuevo")({
  component: () => <EventEditor />,
});
