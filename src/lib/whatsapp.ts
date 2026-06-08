/* WhatsApp — punto único de configuración del canal de contacto.
 *
 * El número es un PLACEHOLDER (+34 666 777 888). Cuando llegue el real,
 * basta con cambiar `WHATSAPP_NUMBER` aquí: el widget flotante y los CTAs
 * de FAQ / Contact construyen su enlace a partir de este helper.
 *
 * Formato wa.me: dígitos en internacional, sin "+", espacios ni signos.
 */
export const WHATSAPP_NUMBER = "34666777888";

/* Versión legible para mostrar en superficies (chips de contacto). */
export const WHATSAPP_DISPLAY = "+34 666 777 888";

/** Construye el enlace wa.me con el mensaje pre-escrito ya codificado. */
export function buildWhatsAppUrl(message: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
