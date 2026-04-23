import { useRef, useState } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  value: string;
  onChange: (url: string) => void;
  folder: string;
}

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

export function ImageUpload({ value, onChange, folder }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    if (!ALLOWED.includes(file.type)) {
      toast.error("Formato no soportado. Usá JPG, PNG, WEBP, GIF o AVIF.");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("La imagen supera los 5 MB.");
      return;
    }

    setUploading(true);
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${folder}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("blog-images").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });
    if (error) {
      setUploading(false);
      toast.error(error.message);
      return;
    }
    const { data } = supabase.storage.from("blog-images").getPublicUrl(path);
    onChange(data.publicUrl);
    setUploading(false);
    toast.success("Imagen subida");
  };

  return (
    <div>
      <Label>Imagen de portada</Label>

      {value ? (
        <div className="mt-2 relative group">
          <img src={value} alt="" className="aspect-video w-full rounded-lg object-cover border border-border/60" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Quitar imagen"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="mt-2 flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border/60 bg-card/30 text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground disabled:opacity-50"
        >
          {uploading ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="text-xs">Subiendo…</span>
            </>
          ) : (
            <>
              <Upload className="h-6 w-6" />
              <span className="text-sm">Subir imagen</span>
              <span className="text-xs">JPG, PNG, WEBP · máx. 5 MB</span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED.join(",")}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />

      <div className="mt-3 flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="rounded-full"
        >
          <Upload className="h-3.5 w-3.5" /> {value ? "Reemplazar" : "Elegir archivo"}
        </Button>
        <span className="text-xs text-muted-foreground">o pegá una URL</span>
      </div>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://..."
        className="mt-2"
      />
    </div>
  );
}
