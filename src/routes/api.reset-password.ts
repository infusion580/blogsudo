import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { z } from "zod";

const Schema = z.object({
  email: z.string().trim().email().max(255),
});

function generatePassword(length = 14): string {
  const chars = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%&*";
  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  let pass = "";
  for (let i = 0; i < length; i++) pass += chars[arr[i] % chars.length];
  return pass;
}

export const Route = createFileRoute("/api/reset-password")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "Invalid JSON" }, { status: 400 });
        }

        const parsed = Schema.safeParse(body);
        if (!parsed.success) {
          return Response.json({ error: "Email inválido" }, { status: 400 });
        }
        const { email } = parsed.data;

        // Find user by email (admin client). To avoid leaking which emails exist,
        // we always return success.
        try {
          // listUsers paginates; search by email via admin filter is limited, so iterate first page
          const { data: list, error: listErr } = await supabaseAdmin.auth.admin.listUsers({
            page: 1,
            perPage: 1000,
          });
          if (listErr) {
            console.error("listUsers error", listErr);
            return Response.json({ ok: true });
          }
          const user = list.users.find(
            (u) => u.email?.toLowerCase() === email.toLowerCase(),
          );
          if (!user) {
            return Response.json({ ok: true });
          }

          const newPassword = generatePassword(14);
          const { error: updateErr } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
            password: newPassword,
          });
          if (updateErr) {
            console.error("updateUser error", updateErr);
            return Response.json({ error: "No se pudo restablecer la contraseña" }, { status: 500 });
          }

          // Try to send via Lovable Emails queue (if infra is configured)
          let emailSent = false;
          try {
            const enqueueRes = await supabaseAdmin.rpc("enqueue_email" as never, {
              p_template_name: "password-reset",
              p_recipient_email: email,
              p_template_data: { newPassword, email },
              p_idempotency_key: `pwreset-${user.id}-${Date.now()}`,
              p_priority: "auth",
            } as never);
            if (!enqueueRes.error) emailSent = true;
            else console.warn("enqueue_email not available:", enqueueRes.error.message);
          } catch (e) {
            console.warn("enqueue_email failed:", e);
          }

          // Fallback: log to server console so admin can read it from logs.
          if (!emailSent) {
            console.log(`[PASSWORD-RESET] Email infra not configured. New temporary password for ${email}: ${newPassword}`);
          }

          return Response.json({ ok: true, emailSent });
        } catch (err) {
          console.error("reset-password error", err);
          return Response.json({ ok: true });
        }
      },
    },
  },
});
