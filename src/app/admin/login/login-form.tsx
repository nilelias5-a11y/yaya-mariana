"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

/* FASE A.5 · T2 — Formulario de login del panel /admin.
 *
 * Coherente con la marca (paleta canónica, título Playfair italic, borde
 * de tarjeta patrón Contact). Postea por fetch a /api/admin/login (JSON):
 * estado de carga al pulsar "Entrar", mensaje de error claro y genérico
 * (sin filtrar qué credencial falló) y opción "recordar usuario"
 * (localStorage, sólo el usuario — nunca la contraseña). */

const REMEMBER_KEY = "ym_admin_user";

export default function LoginForm() {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // Rehidrata el usuario recordado (sólo cliente).
  useEffect(() => {
    const saved = window.localStorage.getItem(REMEMBER_KEY);
    if (saved) {
      // Hydration-safe: preferencia recordada en localStorage, leída solo en
      // cliente al montar (intencional).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(saved);
      setRemember(true);
    }
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    setError(false);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, pass }),
      });

      if (!res.ok) {
        setError(true);
        setLoading(false);
        return;
      }

      if (remember) window.localStorage.setItem(REMEMBER_KEY, user);
      else window.localStorage.removeItem(REMEMBER_KEY);

      // Sesión emitida: navega al panel.
      router.replace("/admin");
      router.refresh();
    } catch {
      setError(true);
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12"
      style={{ backgroundColor: "#fdf6f5" }}
    >
      {/* Volver a la home */}
      <Link
        href="/"
        className="self-start mb-6 sm:mb-0 sm:absolute sm:top-6 sm:left-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#7a3a3a]/70 hover:text-[#c0392b] transition-colors min-h-[44px]"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden>
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Volver a la home
      </Link>

      <div
        className="w-full max-w-sm"
        style={{
          backgroundColor: "#ffffff",
          borderRadius: 20,
          border: "1px solid rgba(245,198,194,0.7)",
          boxShadow:
            "0 1px 0 rgba(255,255,255,0.9) inset, 0 18px 48px rgba(122,26,26,0.12)",
          padding: "2.5rem",
        }}
      >
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/logo-nuevo.jpg"
            alt="Yaya Mariana"
            width={40}
            height={40}
            priority
            className="w-auto mb-4"
            style={{ height: 40 }}
          />
          <h1
            className="font-serif text-2xl text-[#1a0808] italic"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Panel interno
          </h1>
          <p className="text-sm text-[#7a3a3a]/60 mt-1">Acceso restringido</p>
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-xl px-4 py-3 mb-5 text-sm"
            style={{
              backgroundColor: "#fdecea",
              border: "1px solid #f5c6c2",
              color: "#7a1a1a",
            }}
          >
            Usuario o contraseña incorrectos.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" aria-busy={loading}>
          <div>
            <label
              htmlFor="user"
              className="block text-xs font-semibold text-[#7a3a3a]/80 uppercase tracking-wide mb-1.5"
            >
              Usuario
            </label>
            <input
              id="user"
              name="user"
              type="text"
              required
              autoComplete="username"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              disabled={loading}
              aria-invalid={error || undefined}
              className="w-full rounded-xl border-2 border-[#f5c6c2] bg-[#fdf6f5] px-4 py-3 text-base text-[#1a0808] focus:outline-none focus:border-[#c0392b] transition-colors disabled:opacity-60"
            />
          </div>
          <div>
            <label
              htmlFor="pass"
              className="block text-xs font-semibold text-[#7a3a3a]/80 uppercase tracking-wide mb-1.5"
            >
              Contraseña
            </label>
            <input
              id="pass"
              name="pass"
              type="password"
              required
              autoComplete="current-password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              disabled={loading}
              aria-invalid={error || undefined}
              className="w-full rounded-xl border-2 border-[#f5c6c2] bg-[#fdf6f5] px-4 py-3 text-base text-[#1a0808] focus:outline-none focus:border-[#c0392b] transition-colors disabled:opacity-60"
            />
          </div>

          <label className="flex items-center gap-2.5 text-sm text-[#7a3a3a]/80 select-none cursor-pointer">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              disabled={loading}
              className="w-4 h-4 rounded border-[#f5c6c2] accent-[#c0392b]"
            />
            Recordar usuario
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full text-white font-bold text-sm shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center gap-2 disabled:opacity-80 disabled:cursor-wait"
            style={{ background: "linear-gradient(125deg, #c0392b 0%, #e74c3c 100%)" }}
          >
            {loading && (
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.3" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            )}
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
