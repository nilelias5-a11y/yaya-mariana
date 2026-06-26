import "server-only";
import { Resend } from "resend";
import { business } from "@/config/business";

/* FASE B — Envío de emails.
 *
 * GATEADO tras `RESEND_API_KEY`:
 * - Si la env var existe  → envía de verdad con Resend.
 * - Si NO existe          → fallback MOCK (console.log), el comportamiento de
 *                           siempre. Así el código queda listo pero inactivo
 *                           hasta meter la key (y verificar el dominio).
 *
 * La interfaz pública (`sendEmail`, `magicLinkUrl`) NO cambia: el resto del
 * código sigue llamando igual. Los fallos de envío se registran pero NO se
 * propagan — un email es best-effort y no debe tumbar el registro/checkout.
 *
 * Plantillas: welcome, magic-link, order-confirmation, invoice-ready, contact.
 *
 * `sendEmail` devuelve `{ delivered }`: true SOLO si se entregó de verdad por
 * Resend (key presente y sin error); false en mock o si el envío falló. Los
 * llamantes que no lo necesiten pueden ignorar el valor (sigue siendo
 * best-effort, no lanza). */

const SITE_NAME = business.brand.name;
const SITE_TAGLINE = business.brand.tagline;
const SITE_URL = business.brand.siteUrl;

/* Remitente por defecto si no se define EMAIL_FROM. Debe ser una dirección de
 * un dominio VERIFICADO en Resend para que el envío real funcione. */
const DEFAULT_FROM = business.email.fromFallback;

type EmailTemplate = "welcome" | "magic-link" | "order-confirmation" | "invoice-ready" | "contact";

type SendArgs = {
  to: string;
  template: EmailTemplate;
  data?: Record<string, string>;
  replyTo?: string; // dirección de respuesta (p. ej. el email del cliente en el formulario de contacto)
};

/** Resultado del envío. `delivered` = se entregó realmente por Resend. */
export type SendResult = { delivered: boolean };

// ---- paleta de marca (inline; los clientes de correo ignoran <style>) ------
const C = {
  bg: "#fdf6f5",
  card: "#ffffff",
  border: "rgba(245,198,194,0.7)",
  dark: "#1a0808",
  muted: "#7a3a3a",
  accent: "#c0392b",
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Envuelve el contenido en la maqueta sobria de la marca. */
function shell(innerHtml: string): string {
  return `<!doctype html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${C.bg};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg};padding:32px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:${C.card};border:1px solid ${C.border};border-radius:18px;overflow:hidden;font-family:Georgia,'Times New Roman',serif;">
        <tr><td style="padding:28px 32px 8px;text-align:center;border-bottom:1px solid ${C.border};">
          <div style="font-size:22px;font-weight:bold;color:${C.dark};letter-spacing:0.3px;">${SITE_NAME}</div>
          <div style="font-size:12px;color:${C.muted};text-transform:uppercase;letter-spacing:1.5px;margin-top:4px;">${SITE_TAGLINE}</div>
        </td></tr>
        <tr><td style="padding:28px 32px;font-family:Arial,Helvetica,sans-serif;color:${C.dark};font-size:15px;line-height:1.6;">
          ${innerHtml}
        </td></tr>
        <tr><td style="padding:18px 32px 26px;border-top:1px solid ${C.border};text-align:center;font-family:Arial,Helvetica,sans-serif;color:${C.muted};font-size:12px;line-height:1.5;">
          ${SITE_NAME} · ${SITE_TAGLINE}<br>
          <a href="${SITE_URL}" style="color:${C.accent};text-decoration:none;">yayamariana.es</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function button(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:22px auto;"><tr><td style="border-radius:12px;background:${C.accent};">
    <a href="${escapeHtml(href)}" style="display:inline-block;padding:13px 26px;color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;text-decoration:none;border-radius:12px;">${escapeHtml(label)}</a>
  </td></tr></table>`;
}

type Rendered = { subject: string; html: string; text: string };

/** Construye asunto + cuerpo (HTML y texto plano) de cada plantilla. */
function render(template: EmailTemplate, data: Record<string, string>): Rendered {
  switch (template) {
    case "welcome": {
      const nombre = escapeHtml(data.nombre ?? "");
      const saludo = nombre ? `Hola ${nombre},` : "Hola,";
      return {
        subject: `Bienvenida a ${SITE_NAME}`,
        html: shell(
          `<p style="margin:0 0 14px;">${saludo}</p>
           <p style="margin:0 0 14px;">Gracias por unirte a <strong>${SITE_NAME}</strong>. Cultivamos fresas premium en Tarragona y nos alegra tenerte cerca.</p>
           <p style="margin:0 0 14px;">Desde tu cuenta podrás seguir tus pedidos y gestionar tus datos cuando quieras.</p>
           ${button(`${SITE_URL}/cuenta`, "Ir a mi cuenta")}
           <p style="margin:14px 0 0;color:${C.muted};">Un saludo,<br>El equipo de ${SITE_NAME}</p>`,
        ),
        text: `${saludo.replace(/&amp;/g, "&")}\n\nGracias por unirte a ${SITE_NAME}. Cultivamos fresas premium en Tarragona.\n\nTu cuenta: ${SITE_URL}/cuenta\n\nEl equipo de ${SITE_NAME}`,
      };
    }
    case "magic-link": {
      const link = data.link ?? `${SITE_URL}/cuenta/login`;
      return {
        subject: `Tu acceso a ${SITE_NAME}`,
        html: shell(
          `<p style="margin:0 0 14px;">Hola,</p>
           <p style="margin:0 0 14px;">Has solicitado acceder a tu cuenta de <strong>${SITE_NAME}</strong>. Pulsa el botón para entrar:</p>
           ${button(link, "Acceder a mi cuenta")}
           <p style="margin:14px 0 6px;color:${C.muted};">Si no has sido tú, puedes ignorar este correo: nadie podrá entrar sin este enlace.</p>
           <p style="margin:0;color:${C.muted};font-size:13px;word-break:break-all;">O copia esta dirección en tu navegador:<br>${escapeHtml(link)}</p>`,
        ),
        text: `Acceso a tu cuenta de ${SITE_NAME}:\n${link}\n\nSi no has sido tú, ignora este correo.`,
      };
    }
    case "order-confirmation": {
      const number = escapeHtml(data.number ?? "");
      return {
        subject: `Pedido ${number} confirmado · ${SITE_NAME}`,
        html: shell(
          `<p style="margin:0 0 14px;">¡Gracias por tu pedido!</p>
           <p style="margin:0 0 14px;">Hemos recibido y confirmado tu compra en <strong>${SITE_NAME}</strong>. Tu número de pedido es:</p>
           <p style="margin:0 0 18px;text-align:center;font-family:Georgia,serif;font-size:22px;font-weight:bold;color:${C.accent};">${number}</p>
           <p style="margin:0 0 14px;">Te avisaremos por correo cuando salga hacia tu dirección. Puedes seguir su estado desde tu cuenta.</p>
           ${button(`${SITE_URL}/cuenta/pedidos`, "Ver mis pedidos")}
           <p style="margin:14px 0 0;color:${C.muted};">Un saludo,<br>El equipo de ${SITE_NAME}</p>`,
        ),
        text: `¡Gracias por tu pedido!\n\nPedido ${number} confirmado en ${SITE_NAME}.\nSeguimiento: ${SITE_URL}/cuenta/pedidos\n\nEl equipo de ${SITE_NAME}`,
      };
    }
    case "invoice-ready": {
      const number = escapeHtml(data.number ?? "");
      const invoice = escapeHtml(data.invoiceNumber ?? "");
      const ref = invoice || number;
      return {
        subject: `Tu factura de ${SITE_NAME}`,
        html: shell(
          `<p style="margin:0 0 14px;">Hola,</p>
           <p style="margin:0 0 14px;">Ya tienes disponible la factura${ref ? ` <strong>${ref}</strong>` : ""}${number ? ` de tu pedido ${number}` : ""} en <strong>${SITE_NAME}</strong>.</p>
           <p style="margin:0 0 14px;">Puedes descargarla en PDF desde el detalle del pedido en tu cuenta.</p>
           ${button(`${SITE_URL}/cuenta/pedidos`, "Ver mis pedidos")}
           <p style="margin:14px 0 0;color:${C.muted};">Un saludo,<br>El equipo de ${SITE_NAME}</p>`,
        ),
        text: `Tu factura${ref ? ` ${ref}` : ""} ya está disponible en ${SITE_NAME}.\nDescárgala desde: ${SITE_URL}/cuenta/pedidos\n\nEl equipo de ${SITE_NAME}`,
      };
    }
    case "contact": {
      // Email que recibe el NEGOCIO con el mensaje del formulario de contacto.
      const name = escapeHtml(data.name ?? "");
      const fromEmail = escapeHtml(data.email ?? "");
      const subj = escapeHtml(data.subject ?? "");
      const message = escapeHtml(data.message ?? "").replace(/\n/g, "<br>");
      const row = (label: string, value: string) =>
        `<tr><td style="padding:4px 12px 4px 0;color:${C.muted};font-weight:bold;white-space:nowrap;vertical-align:top;">${label}</td><td style="padding:4px 0;color:${C.dark};">${value}</td></tr>`;
      return {
        subject: `Nuevo mensaje de contacto${subj ? ` — ${subj}` : ""}`,
        html: shell(
          `<p style="margin:0 0 16px;">Nuevo mensaje desde el formulario de contacto de <strong>${SITE_NAME}</strong>:</p>
           <table role="presentation" cellpadding="0" cellspacing="0" style="font-family:Arial,Helvetica,sans-serif;font-size:14px;margin:0 0 16px;">
             ${row("De:", name || "—")}
             ${row("Email:", fromEmail ? `<a href="mailto:${fromEmail}" style="color:${C.accent};text-decoration:none;">${fromEmail}</a>` : "—")}
             ${row("Asunto:", subj || "—")}
           </table>
           <p style="margin:0 0 6px;color:${C.muted};font-weight:bold;">Mensaje:</p>
           <p style="margin:0 0 16px;padding:12px 14px;background:${C.bg};border:1px solid ${C.border};border-radius:10px;">${message || "—"}</p>
           <p style="margin:0;color:${C.muted};font-size:13px;">Responde directamente a este correo para contestar${name ? ` a ${name}` : ""}.</p>`,
        ),
        text: `Nuevo mensaje de contacto (${SITE_NAME})\n\nDe: ${data.name ?? "—"}\nEmail: ${data.email ?? "—"}\nAsunto: ${data.subject ?? "—"}\n\nMensaje:\n${data.message ?? "—"}`,
      };
    }
  }
}

// Cliente Resend memoizado (sólo se crea si hay key).
let _resend: Resend | null = null;
function getResend(apiKey: string): Resend {
  if (!_resend) _resend = new Resend(apiKey);
  return _resend;
}

export async function sendEmail({ to, template, data, replyTo }: SendArgs): Promise<SendResult> {
  const from = process.env.EMAIL_FROM ?? DEFAULT_FROM;
  const apiKey = process.env.RESEND_API_KEY;
  const { subject, html, text } = render(template, data ?? {});

  // Sin key → MOCK (comportamiento actual): no se envía nada real.
  if (!apiKey) {
    console.log(
      `[email:mock] from=${from} to=${to} template=${template} subject="${subject}"` +
        (data ? ` data=${JSON.stringify(data)}` : ""),
    );
    return { delivered: false };
  }

  // Con key → envío real. Best-effort: nunca lanzamos al llamante.
  try {
    const { error } = await getResend(apiKey).emails.send({
      from,
      to,
      subject,
      html,
      text,
      ...(replyTo ? { replyTo } : {}),
    });
    if (error) {
      console.error(`[email:resend] error template=${template} to=${to}:`, error);
      return { delivered: false };
    }
    console.log(`[email:resend] enviado template=${template} to=${to}`);
    return { delivered: true };
  } catch (e) {
    console.error(`[email:resend] excepción template=${template} to=${to}:`, (e as Error).message);
    return { delivered: false };
  }
}

/** Construye la URL absoluta de un magic link a partir del token. */
export function magicLinkUrl(origin: string, token: string): string {
  return `${origin}/api/cuenta/magic/verify?token=${encodeURIComponent(token)}`;
}
