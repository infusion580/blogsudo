import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/Header";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Acceso admin — blog.lab" },
      { name: "description", content: "Iniciá sesión o creá una cuenta de administrador." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AuthPage,
});

const emailSchema = z.string().trim().email({ message: "Email inválido" }).max(255);
const passwordSchema = z.string().min(8, "Mínimo 8 caracteres").max(128);
const nameSchema = z.string().trim().min(1, "Requerido").max(80);

function AuthPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!authLoading && user) {
    throw redirect({ to: "/admin" });
  }

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    const emailP = emailSchema.safeParse(email);
    const passP = passwordSchema.safeParse(password);
    if (!emailP.success) return toast.error(emailP.error.issues[0].message);
    if (!passP.success) return toast.error(passP.error.issues[0].message);

    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: emailP.data,
      password: passP.data,
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message === "Invalid login credentials" ? "Email o contraseña incorrectos" : error.message);
      return;
    }
    toast.success("¡Bienvenido!");
    navigate({ to: "/admin" });
  };

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    const emailP = emailSchema.safeParse(email);
    const passP = passwordSchema.safeParse(password);
    const nameP = nameSchema.safeParse(name);
    if (!nameP.success) return toast.error(nameP.error.issues[0].message);
    if (!emailP.success) return toast.error(emailP.error.issues[0].message);
    if (!passP.success) return toast.error(passP.error.issues[0].message);

    setSubmitting(true);
    const { error } = await supabase.auth.signUp({
      email: emailP.data,
      password: passP.data,
      options: {
        emailRedirectTo: `${window.location.origin}/admin`,
        data: { display_name: nameP.data },
      },
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Cuenta creada. ¡Bienvenido!");
    navigate({ to: "/admin" });
  };

  const handleForgot = async (e: FormEvent) => {
    e.preventDefault();
    const emailP = emailSchema.safeParse(email);
    if (!emailP.success) return toast.error(emailP.error.issues[0].message);

    setSubmitting(true);
    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailP.data }),
      });
      const data = await res.json();
      setSubmitting(false);
      if (!res.ok) {
        toast.error(data.error ?? "Error al enviar el correo");
        return;
      }
      toast.success("Si el email existe, te enviamos una nueva contraseña.");
      setMode("login");
    } catch (err) {
      setSubmitting(false);
      toast.error("Error de red");
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-16">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />

        <div className="relative w-full max-w-md rounded-3xl border border-border/60 bg-card/60 p-8 backdrop-blur-xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-black">
              {mode === "login" && <>Iniciar <span className="italic font-light text-gradient">sesión</span></>}
              {mode === "signup" && <>Crear <span className="italic font-light text-gradient">cuenta</span></>}
              {mode === "forgot" && <>Recuperar <span className="italic font-light text-gradient">acceso</span></>}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {mode === "login" && "Accedé al panel de administración"}
              {mode === "signup" && "Registrate como administrador"}
              {mode === "forgot" && "Te enviamos una nueva contraseña por email"}
            </p>
          </div>

          {mode === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@ejemplo.com" required />
              </div>
              <div>
                <Label htmlFor="password">Contraseña</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <Button type="submit" disabled={submitting} className="w-full rounded-full bg-primary hover:bg-primary/90 glow-primary">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ingresar"}
              </Button>
              <div className="flex justify-between pt-2 text-xs">
                <button type="button" onClick={() => setMode("forgot")} className="text-muted-foreground hover:text-foreground">
                  ¿Olvidaste tu contraseña?
                </button>
                <button type="button" onClick={() => setMode("signup")} className="text-primary hover:underline">
                  Crear cuenta
                </button>
              </div>
            </form>
          )}

          {mode === "signup" && (
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="password">Contraseña</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 8 caracteres" required />
              </div>
              <Button type="submit" disabled={submitting} className="w-full rounded-full bg-primary hover:bg-primary/90 glow-primary">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Crear cuenta"}
              </Button>
              <div className="pt-2 text-center text-xs">
                <button type="button" onClick={() => setMode("login")} className="text-primary hover:underline">
                  Ya tengo cuenta
                </button>
              </div>
            </form>
          )}

          {mode === "forgot" && (
            <form onSubmit={handleForgot} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <Button type="submit" disabled={submitting} className="w-full rounded-full bg-primary hover:bg-primary/90 glow-primary">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enviarme nueva contraseña"}
              </Button>
              <div className="pt-2 text-center text-xs">
                <button type="button" onClick={() => setMode("login")} className="text-primary hover:underline">
                  Volver al inicio de sesión
                </button>
              </div>
            </form>
          )}

          <p className="mt-6 text-center text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground">← Volver al sitio</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
