"use client";

import { forwardRef } from "react";

/* FASE B — Primitivas sobrias de la zona cliente.
 *
 * Estética "libro de cuentas": tipografía editorial discreta (Playfair
 * regular sólo en títulos), bordes hairline cálidos, botones sólidos sin
 * halos ni gradientes, mucho aire. Más restraint que el panel admin pero
 * coherente con la paleta canónica. */

export const CUENTA_BORDER = "rgba(122,58,58,0.16)";
export const CUENTA_BG = "#fbf8f7";

export const LABEL_CLASS =
  "block text-[0.78rem] font-medium text-[#6b5350] mb-1.5";

export const INPUT_CLASS =
  "w-full rounded-lg border bg-white px-3.5 py-2.5 text-[0.95rem] text-[#1a0808] placeholder:text-[#b8a9a5] focus:outline-none focus:ring-2 focus:ring-[#c0392b]/15 focus:border-[#c0392b]/50 transition-colors disabled:opacity-60";

export function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className={LABEL_CLASS}>{label}</label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-[#9a8884]">{hint}</p>}
      {error && <p className="mt-1 text-xs text-[#b91c1c]">{error}</p>}
    </div>
  );
}

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }>(
  function Input({ className = "", invalid, style, ...props }, ref) {
    return (
      <input
        ref={ref}
        aria-invalid={invalid || undefined}
        className={`${INPUT_CLASS} ${className}`}
        style={{ borderColor: CUENTA_BORDER, ...style }}
        {...props}
      />
    );
  },
);

export function SolidButton({
  loading,
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button
      {...props}
      disabled={props.disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg bg-[#c0392b] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#a93226] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c0392b]/30 focus-visible:ring-offset-2 disabled:opacity-70 disabled:cursor-default ${className}`}
    >
      {loading && (
        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.3" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      )}
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-lg border bg-white px-5 py-2.5 text-sm font-semibold text-[#7a3a3a] transition-colors hover:bg-[#f3ebe9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c0392b]/20 disabled:opacity-60 ${className}`}
      style={{ borderColor: CUENTA_BORDER }}
    >
      {children}
    </button>
  );
}

/** Título editorial discreto (Playfair regular, sin italic gigante). */
export function PageTitle({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="font-serif text-[1.6rem] md:text-[1.85rem] font-medium text-[#1a0808] tracking-tight">
      {children}
    </h1>
  );
}
