import Image from "next/image";

export const metadata = {
  title: "Acceso · Panel Yaya Mariana",
  robots: { index: false, follow: false },
};

/* Login del panel interno (T6). Formulario nativo que postea a
   /api/admin/login (sin JS). El middleware ya impide el acceso al panel
   sin sesión válida. searchParams (Next 16) llega como Promise. */
export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ backgroundColor: "#fdf6f5" }}
    >
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
            width={180}
            height={40}
            priority
            className="w-auto mb-4"
            style={{ height: 40 }}
          />
          <h1 className="font-serif text-2xl text-[#1a0808]">Panel interno</h1>
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

        <form method="post" action="/api/admin/login" className="space-y-4">
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
              className="w-full rounded-xl border-2 border-[#f5c6c2] bg-[#fdf6f5] px-4 py-3 text-base text-[#1a0808] focus:outline-none focus:border-[#c0392b] transition-colors"
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
              className="w-full rounded-xl border-2 border-[#f5c6c2] bg-[#fdf6f5] px-4 py-3 text-base text-[#1a0808] focus:outline-none focus:border-[#c0392b] transition-colors"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-full text-white font-bold text-sm shadow-lg hover:shadow-xl transition-shadow"
            style={{ background: "linear-gradient(125deg, #c0392b 0%, #e74c3c 100%)" }}
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
