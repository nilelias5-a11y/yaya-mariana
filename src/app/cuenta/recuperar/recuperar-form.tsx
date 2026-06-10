"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import { AuthCard } from "@/components/cuenta/auth-card";
import { Field, Input, SolidButton } from "@/components/cuenta/primitives";
import { DevMagicLink } from "@/components/cuenta/dev-magic-link";

export default function RecuperarForm() {
  const { t } = useLanguage();
  const c = t.cuenta;
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [devLink, setDevLink] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/cuenta/magic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, purpose: "recover" }),
      });
      const data = await res.json().catch(() => ({}));
      setDevLink(data.devMagicLink ?? null);
      setDone(true);
    } catch {
      // Respuesta genérica: mostramos el mismo estado de "enviado".
      setDone(true);
    }
  }

  if (done) {
    return (
      <AuthCard title={c.recuperar.sent} subtitle={c.recuperar.sentBody}>
        <DevMagicLink notice={c.registro.devNotice} link={devLink} />
        <Link href="/cuenta/login" className="inline-block text-sm font-semibold text-[#c0392b] hover:underline">
          {c.recuperar.backToLogin}
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title={c.recuperar.title}
      subtitle={c.recuperar.subtitle}
      footer={
        <Link href="/cuenta/login" className="font-semibold text-[#c0392b] hover:underline">
          {c.recuperar.backToLogin}
        </Link>
      }
    >
      <form onSubmit={submit} className="space-y-4" aria-busy={loading}>
        <Field label={c.common.email}>
          <Input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} placeholder="tu@email.com" />
        </Field>
        <SolidButton type="submit" loading={loading} className="w-full">
          {c.recuperar.submit}
        </SolidButton>
      </form>
    </AuthCard>
  );
}
