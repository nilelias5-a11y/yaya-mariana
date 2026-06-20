import { NextResponse } from "next/server";
import { getCuentaUser } from "@/lib/cuenta/session";

/* Estado de sesión + perfil mínimo para la zona PÚBLICA (client-side).
 *
 * La cookie `cuenta_session` es httpOnly → el cliente no puede leerla. Este
 * endpoint additive expone, de forma segura, sólo lo necesario para:
 *  - el aria-label dinámico del icono "Mi cuenta" en el nav,
 *  - el autorrelleno del checkout (nombre, email, direcciones).
 * Nunca devuelve passwordHash ni datos sensibles. No está bajo el proxy
 * (vive en /api/cuenta/*, fuera del matcher), así que un anónimo recibe
 * { authenticated: false } sin redirección.
 *
 * Runtime Node (getCuentaUser lee cookies + Neon). */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCuentaUser();
  const headers = { "Cache-Control": "no-store" };
  if (!user) {
    return NextResponse.json({ authenticated: false }, { headers });
  }
  return NextResponse.json(
    {
      authenticated: true,
      user: {
        email: user.email,
        nombre: user.nombre,
        telefono: user.telefono ?? null,
        dni: user.dni ?? null,
        addresses: user.addresses ?? [],
      },
    },
    { headers },
  );
}
