"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/language-context";
import { PageTitle, Field, Input, SolidButton, GhostButton, CUENTA_BORDER } from "@/components/cuenta/primitives";
import type { Address } from "@/lib/cuenta/types";

type Initial = {
  nombre: string;
  email: string;
  telefono: string;
  dni: string;
  addresses: Address[];
  marketingOptIn: boolean;
  hasPassword: boolean;
};

const emptyAddress = (i: number): Address => ({
  id: `addr_new_${i}`,
  label: "",
  recipient: "",
  street: "",
  city: "",
  postalCode: "",
  region: "",
  country: "España",
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl bg-white p-5 sm:p-6" style={{ border: `1px solid ${CUENTA_BORDER}` }}>
      <h2 className="font-serif text-[1.15rem] font-medium text-[#1a0808] mb-4">{title}</h2>
      {children}
    </section>
  );
}

function Banner({ kind, children }: { kind: "ok" | "err"; children: React.ReactNode }) {
  const style = kind === "ok"
    ? { backgroundColor: "#eef5ef", border: "1px solid #cfe3d4", color: "#3a6347" }
    : { backgroundColor: "#fdecea", border: "1px solid #f3c9c4", color: "#8a2b22" };
  return <div role="status" className="rounded-lg px-3.5 py-2.5 text-sm" style={style}>{children}</div>;
}

export default function DatosForm({ initial }: { initial: Initial }) {
  const { t } = useLanguage();
  const c = t.cuenta;
  const router = useRouter();

  const [nombre, setNombre] = useState(initial.nombre);
  const [telefono, setTelefono] = useState(initial.telefono);
  const [dni, setDni] = useState(initial.dni);
  const [addresses, setAddresses] = useState<Address[]>(initial.addresses);
  const [marketing, setMarketing] = useState(initial.marketingOptIn);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [savingPass, setSavingPass] = useState(false);
  const [passMsg, setPassMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  function updateAddress(idx: number, patch: Partial<Address>) {
    setAddresses((prev) => prev.map((a, i) => (i === idx ? { ...a, ...patch } : a)));
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg(null);
    try {
      const res = await fetch("/api/cuenta/datos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, telefono, dni, addresses, marketingOptIn: marketing }),
      });
      if (!res.ok) throw new Error();
      setProfileMsg({ kind: "ok", text: c.common.saved });
      router.refresh();
    } catch {
      setProfileMsg({ kind: "err", text: c.common.error });
    } finally {
      setSavingProfile(false);
    }
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    setSavingPass(true);
    setPassMsg(null);
    try {
      const res = await fetch("/api/cuenta/datos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const text = data.error === "weak_password" ? c.datos.weakPassword : data.error === "wrong_password" ? c.datos.wrongPassword : c.common.error;
        setPassMsg({ kind: "err", text });
        return;
      }
      setPassMsg({ kind: "ok", text: c.common.saved });
      setCurrentPassword("");
      setNewPassword("");
      router.refresh();
    } catch {
      setPassMsg({ kind: "err", text: c.common.error });
    } finally {
      setSavingPass(false);
    }
  }

  async function deleteAccount() {
    if (!window.confirm(c.datos.deleteConfirm)) return;
    setDeleting(true);
    try {
      const res = await fetch("/api/cuenta/borrar", { method: "POST" });
      if (res.ok) {
        window.location.href = "/";
        return;
      }
      setDeleting(false);
    } catch {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageTitle>{c.datos.title}</PageTitle>

      {/* Datos personales */}
      <form onSubmit={saveProfile}>
        <Section title={c.datos.personalTitle}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label={c.datos.nombre}>
              <Input value={nombre} onChange={(e) => setNombre(e.target.value)} required minLength={2} autoComplete="name" />
            </Field>
            <Field label={c.common.email} hint={c.datos.emailLocked}>
              <Input value={initial.email} disabled readOnly />
            </Field>
            <Field label={c.datos.telefono}>
              <Input value={telefono} onChange={(e) => setTelefono(e.target.value)} type="tel" autoComplete="tel" />
            </Field>
            <Field label={c.datos.dni} hint={c.datos.dniHint}>
              <Input value={dni} onChange={(e) => setDni(e.target.value)} />
            </Field>
          </div>

          {/* Direcciones */}
          <h3 className="text-xs font-semibold uppercase tracking-wide text-[#9a8884] mt-7 mb-3">{c.datos.addressesTitle}</h3>
          <div className="space-y-5">
            {addresses.map((a, idx) => (
              <div key={a.id} className="rounded-lg p-4" style={{ border: `1px solid ${CUENTA_BORDER}`, backgroundColor: "#fbf8f7" }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label={c.datos.addressLabel}><Input value={a.label} onChange={(e) => updateAddress(idx, { label: e.target.value })} /></Field>
                  <Field label={c.datos.recipient}><Input value={a.recipient} onChange={(e) => updateAddress(idx, { recipient: e.target.value })} /></Field>
                  <div className="sm:col-span-2">
                    <Field label={c.datos.street}><Input value={a.street} onChange={(e) => updateAddress(idx, { street: e.target.value })} /></Field>
                  </div>
                  <Field label={c.datos.city}><Input value={a.city} onChange={(e) => updateAddress(idx, { city: e.target.value })} /></Field>
                  <Field label={c.datos.postalCode}><Input value={a.postalCode} onChange={(e) => updateAddress(idx, { postalCode: e.target.value })} inputMode="numeric" /></Field>
                  <Field label={c.datos.region}><Input value={a.region} onChange={(e) => updateAddress(idx, { region: e.target.value })} /></Field>
                  <Field label={c.datos.country}><Input value={a.country} onChange={(e) => updateAddress(idx, { country: e.target.value })} /></Field>
                </div>
                <button
                  type="button"
                  onClick={() => setAddresses((prev) => prev.filter((_, i) => i !== idx))}
                  className="mt-3 text-xs font-medium text-[#9a3a2f] hover:underline"
                >
                  {c.datos.removeAddress}
                </button>
              </div>
            ))}
            <GhostButton type="button" onClick={() => setAddresses((prev) => [...prev, emptyAddress(prev.length)])}>
              + {c.datos.addAddress}
            </GhostButton>
          </div>

          {/* Marketing */}
          <label className="flex items-start gap-2.5 mt-7 text-sm text-[#6b5350] cursor-pointer">
            <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} className="mt-0.5 w-4 h-4 rounded accent-[#c0392b]" />
            <span>{c.datos.marketingLabel}</span>
          </label>

          <div className="flex items-center gap-3 mt-6">
            <SolidButton type="submit" loading={savingProfile}>{c.common.save}</SolidButton>
            {profileMsg && <Banner kind={profileMsg.kind}>{profileMsg.text}</Banner>}
          </div>
        </Section>
      </form>

      {/* Contraseña */}
      <form onSubmit={savePassword}>
        <Section title={c.datos.passwordTitle}>
          {!initial.hasPassword && <p className="text-sm text-[#7a635f] mb-4">{c.datos.noPasswordYet}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {initial.hasPassword && (
              <Field label={c.datos.currentPassword}>
                <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} autoComplete="current-password" />
              </Field>
            )}
            <Field label={c.datos.newPassword}>
              <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} minLength={8} autoComplete="new-password" />
            </Field>
          </div>
          <div className="flex items-center gap-3 mt-5">
            <SolidButton type="submit" loading={savingPass} disabled={newPassword.length < 8}>
              {initial.hasPassword ? c.datos.changePassword : c.datos.setPassword}
            </SolidButton>
            {passMsg && <Banner kind={passMsg.kind}>{passMsg.text}</Banner>}
          </div>
        </Section>
      </form>

      {/* RGPD */}
      <Section title={c.datos.dangerTitle}>
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="font-medium text-[#1a0808] text-sm">{c.datos.exportData}</p>
              <p className="text-xs text-[#9a8884] mt-0.5">{c.datos.exportDesc}</p>
            </div>
            <a href="/api/cuenta/export" download>
              <GhostButton type="button">{c.datos.exportData}</GhostButton>
            </a>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-5" style={{ borderTop: `1px solid ${CUENTA_BORDER}` }}>
            <div>
              <p className="font-medium text-[#9a3a2f] text-sm">{c.datos.deleteAccount}</p>
              <p className="text-xs text-[#9a8884] mt-0.5">{c.datos.deleteDesc}</p>
            </div>
            <button
              type="button"
              onClick={deleteAccount}
              disabled={deleting}
              className="inline-flex items-center justify-center rounded-lg border px-4 py-2.5 text-sm font-semibold text-[#9a3a2f] transition-colors hover:bg-[#fdecea] disabled:opacity-60 shrink-0"
              style={{ borderColor: "#e3b8b2" }}
            >
              {deleting ? c.datos.deleting : c.datos.deleteAccount}
            </button>
          </div>
        </div>
      </Section>
    </div>
  );
}
