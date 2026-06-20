"use client";

import { useEffect, useState } from "react";
import type { Address } from "@/lib/cuenta/types";

/* Detección de sesión de cliente en componentes públicos (nav, checkout).
 *
 * La cookie `cuenta_session` es httpOnly → no se puede leer desde JS; en su
 * lugar consultamos /api/cuenta/me (no bloqueante). Mientras resuelve, el
 * estado es "loading"; ante cualquier fallo asumimos "anon" (UX seguro: nunca
 * mostramos como logueado a quien no lo está). */

export type CuentaAuthUser = {
  email: string;
  nombre: string;
  telefono: string | null;
  dni: string | null;
  addresses: Address[];
};

export type CuentaAuthState =
  | { status: "loading"; user: null }
  | { status: "authed"; user: CuentaAuthUser }
  | { status: "anon"; user: null };

export function useCuentaAuth(): CuentaAuthState {
  const [state, setState] = useState<CuentaAuthState>({ status: "loading", user: null });

  useEffect(() => {
    let active = true;
    fetch("/api/cuenta/me", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("bad status"))))
      .then((data: { authenticated?: boolean; user?: CuentaAuthUser }) => {
        if (!active) return;
        if (data?.authenticated && data.user) setState({ status: "authed", user: data.user });
        else setState({ status: "anon", user: null });
      })
      .catch(() => {
        if (active) setState({ status: "anon", user: null });
      });
    return () => {
      active = false;
    };
  }, []);

  return state;
}
