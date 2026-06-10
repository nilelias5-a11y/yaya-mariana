import "server-only";

/* FASE B — Envío de emails (MOCK).
 *
 * Por ahora todo se registra en consola del servidor. Cuando se conecte
 * Resend (RESEND_API_KEY), sustituir el cuerpo de `sendEmail` por la
 * llamada a su API manteniendo esta misma interfaz.
 *
 * Plantillas previstas: welcome, magic-link, order-confirmation,
 * invoice-ready. */

type EmailTemplate = "welcome" | "magic-link" | "order-confirmation" | "invoice-ready";

type SendArgs = {
  to: string;
  template: EmailTemplate;
  data?: Record<string, string>;
};

export async function sendEmail({ to, template, data }: SendArgs): Promise<void> {
  const from = process.env.EMAIL_FROM ?? "Yaya Mariana <no-reply@yaya-mariana.com>";
  // MOCK: log estructurado. No se envía nada real.
  console.log(
    `[email:mock] from=${from} to=${to} template=${template}` +
      (data ? ` data=${JSON.stringify(data)}` : ""),
  );
}

/** Construye la URL absoluta de un magic link a partir del token. */
export function magicLinkUrl(origin: string, token: string): string {
  return `${origin}/api/cuenta/magic/verify?token=${encodeURIComponent(token)}`;
}
