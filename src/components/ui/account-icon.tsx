"use client";

import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/language-context";
import { useCuentaAuth } from "@/hooks/use-cuenta-auth";

/* T1 — Acceso "Mi cuenta" desde el nav desktop.
 *
 * Icono persona minimalista (solo trazo), tinta #7a3a3a. Sin dropdown: al
 * pulsar entra directo a /cuenta (si no hay sesión, el proxy redirige a
 * /cuenta/login). aria-label dinámico según estado de sesión. Tap target
 * 44x44 con halo cream-rosa al hover (mismo lenguaje que el resto de la UI)
 * y focus-visible accesible. Dot verde sutil cuando hay sesión (restraint:
 * 6px, sin texto ni nombre de usuario). Desktop-only: en mobile se usa el
 * enlace de la hamburguesa. */

export default function AccountIcon() {
  const router = useRouter();
  const { t } = useLanguage();
  const { status } = useCuentaAuth();
  const authed = status === "authed";
  // UX seguro: mientras carga, se asume no logueado.
  const aria = authed ? t.nav.account.ariaLoggedIn : t.nav.account.ariaLoggedOut;

  return (
    <button
      type="button"
      onClick={() => router.push("/cuenta")}
      aria-label={aria}
      title={aria}
      className="hidden md:inline-flex relative items-center justify-center w-11 h-11 rounded-full text-[#7a3a3a] transition-colors duration-200 hover:bg-[#fdf0ef] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c0392b]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fdf6f5]"
    >
      <svg
        viewBox="0 0 24 24"
        width={20}
        height={20}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <circle cx="12" cy="8" r="3.25" />
        <path d="M5.5 19a6.5 6.5 0 0 1 13 0" />
      </svg>
      {authed && (
        <span
          aria-hidden
          className="absolute"
          style={{
            top: 9,
            right: 9,
            width: 6,
            height: 6,
            borderRadius: "9999px",
            backgroundColor: "#3aa76d",
            boxShadow: "0 0 0 2px #ffffff",
          }}
        />
      )}
    </button>
  );
}
