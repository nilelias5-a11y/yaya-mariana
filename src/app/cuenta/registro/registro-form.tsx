"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import { AuthCard } from "@/components/cuenta/auth-card";
import { Field, Input, SolidButton } from "@/components/cuenta/primitives";
import { DevMagicLink } from "@/components/cuenta/dev-magic-link";

export default function RegistroForm() {
  const { t } = useLanguage();
  const c = t.cuenta;
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [devLink, setDevLink] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/cuenta/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(c.common.error);
        setLoading(false);
        return;
      }
      setDevLink(data.devMagicLink ?? null);
      setDone(true);
    } catch {
      setError(c.common.error);
      setLoading(false);
    }
  }

  if (done) {
    return (
      <AuthCard title={c.registro.success} subtitle={c.registro.successBody}>
        <DevMagicLink notice={c.registro.devNotice} link={devLink} />
        <Link href="/cuenta/login" className="inline-block mt-2 text-sm font-semibold text-[#c0392b] hover:underline">
          {c.registro.login}
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title={c.registro.title}
      subtitle={c.registro.subtitle}
      footer={
        <>
          {c.registro.hasAccount}{" "}
          <Link href="/cuenta/login" className="font-semibold text-[#c0392b] hover:underline">
            {c.registro.login}
          </Link>
        </>
      }
    >
      {error && (
        <div role="alert" className="rounded-lg px-3.5 py-2.5 mb-4 text-sm" style={{ backgroundColor: "#fdecea", border: "1px solid #f3c9c4", color: "#8a2b22" }}>
          {error}
        </div>
      )}
      <form onSubmit={submit} className="space-y-4" aria-busy={loading}>
        <Field label={c.registro.nombreLabel}>
          <Input type="text" required minLength={2} autoComplete="name" value={nombre} onChange={(e) => setNombre(e.target.value)} disabled={loading} />
        </Field>
        <Field label={c.common.email}>
          <Input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} placeholder="tu@email.com" />
        </Field>
        <Field label={c.registro.passwordLabel} hint={c.registro.passwordHint}>
          <Input type="password" autoComplete="new-password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} />
        </Field>
        <SolidButton type="submit" loading={loading} className="w-full">
          {c.registro.submit}
        </SolidButton>
      </form>
    </AuthCard>
  );
}
