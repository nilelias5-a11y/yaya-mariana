import { business } from "@/config/business";

/* WhatsApp — helper del canal de contacto. El número (placeholder) vive en la
 * config central `business.contact.whatsapp`; aquí solo se construye el enlace.
 * El widget flotante y los CTAs de FAQ / Contact usan `buildWhatsAppUrl`.
 *
 * Formato wa.me: dígitos en internacional, sin "+", espacios ni signos.
 */
export const WHATSAPP_NUMBER = business.contact.whatsapp;

/* Versión legible para mostrar en superficies (chips de contacto). */
export const WHATSAPP_DISPLAY = business.contact.phoneDisplay;

/** Construye el enlace wa.me con el mensaje pre-escrito ya codificado. */
export function buildWhatsAppUrl(message: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
