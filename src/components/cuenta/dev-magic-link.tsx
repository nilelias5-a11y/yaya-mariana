"use client";

/* FASE B — Aviso de desarrollo: muestra el magic link directamente cuando
 * no hay email real conectado. En producción el API no devuelve el enlace,
 * así que este bloque no se renderiza. */
export function DevMagicLink({ notice, link }: { notice: string; link: string | null }) {
  if (!link) return null;
  return (
    <div className="rounded-lg px-3.5 py-3 mb-5 text-sm" style={{ backgroundColor: "#fbf4e6", border: "1px solid #ecdcb4", color: "#7a5d1f" }}>
      <p className="font-medium mb-1.5">{notice}</p>
      <a href={link} className="block break-all font-mono text-[0.72rem] text-[#8a6d1f] hover:underline">
        {link}
      </a>
    </div>
  );
}
