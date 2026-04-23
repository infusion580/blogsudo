import { createFileRoute } from "@tanstack/react-router";
import { ArticleEditor } from "@/components/admin/ArticleEditor";

export const Route = createFileRoute("/admin/articulos/$id")({
  component: EditArticle,
});

function EditArticle() {
  const { id } = Route.useParams();
  return <ArticleEditor id={id} />;
}
