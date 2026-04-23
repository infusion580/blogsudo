import { createFileRoute } from "@tanstack/react-router";
import { EventEditor } from "@/components/admin/EventEditor";

export const Route = createFileRoute("/admin/eventos/$id")({
  component: EditEvent,
});

function EditEvent() {
  const { id } = Route.useParams();
  return <EventEditor id={id} />;
}
