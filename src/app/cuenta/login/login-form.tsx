"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import { AuthCard } from "@/components/cuenta/auth-card";
import { Field, Input, SolidButton, CUENTA_BORDER } from "@/components/cuenta/primitives";

export default function LoginForm({ magicError }: { magicError: boolean }) {
  const { t } = useLanguage();
  const c = t.cuenta;
  const router = useRouter();
  const [mode, setMode] = useState<"password" | "guest">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(magicError ? c.login.magicError : null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    setError(null);
    setLoading(true);
    try {
      const payload = mode === "password" ? { email, password } : { email, orderNumber };
      const res = await fetch("/api/cuenta/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        setError(c.login.invalid);
        setLoading(false);
        return;
      }
      router.replace("/cuenta");
      router.refresh();
    } catch {
      setError(c.common.error);
      setLoading(false);
    }
  }

  const tabBtn = (key: "password" | "guest", label: string) => (
    <button
      type="button"
      onClick={() => { setMode(key); setError(null); }}
      aria-pressed={mode === key}
      className="flex-1 py-2 text-sm font-medium rounded-md transition-colors"
      style={mode === key ? { backgroundColor: "#fff", color: "#c0392b", boxShadow: "0 1px 2px rgba(26,8,8,0.06)" } : { color: "#7a635f" }}
    >
      {label}
    </button>
  );

  return (
    <AuthCard
      title={c.login.title}
      subtitle={c.login.subtitle}
      footer={
        <>
          {c.login.noAccount}{" "}
          <Link href="/cuenta/registro" className="font-semibold text-[#c0392b] hover:underline">
            {c.login.register}
          </Link>
        </>
      }
    >
      <div className="flex gap-1 p-1 rounded-lg mb-5" style={{ backgroundColor: "#f3ebe9" }}>
        {tabBtn("password", c.login.tabPassword)}
        {tabBtn("guest", c.login.tabGuest)}
      </div>

      {error && (
        <div role="alert" className="rounded-lg px-3.5 py-2.5 mb-4 text-sm" style={{ backgroundColor: "#fdecea", border: "1px solid #f3c9c4", color: "#8a2b22" }}>
          {error}
        </div>
      )}

      <form onSubmit={submit} className="space-y-4" aria-busy={loading}>
        <Field label={c.common.email}>
          <Input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} placeholder="tu@email.com" />
        </Field>

        {mode === "password" ? (
          <Field label={c.common.password}>
            <Input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} />
          </Field>
        ) : (
          <>
            <p className="text-xs text-[#9a8884] -mt-1">{c.login.guestSubtitle}</p>
            <Field label={c.login.orderNumberLabel}>
              <Input type="text" required value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} disabled={loading} placeholder={c.login.orderNumberPlaceholder} />
            </Field>
          </>
        )}

        <SolidButton type="submit" loading={loading} className="w-full">
          {mode === "password" ? c.login.submit : c.login.guestSubmit}
        </SolidButton>
      </form>

      {mode === "password" && (
        <div className="mt-4 pt-4 text-center" style={{ borderTop: `1px solid ${CUENTA_BORDER}` }}>
          <Link href="/cuenta/recuperar" className="text-sm text-[#7a635f] hover:text-[#c0392b] transition-colors">
            {c.login.forgot}
          </Link>
        </div>
      )}
    </AuthCard>
  );
}
