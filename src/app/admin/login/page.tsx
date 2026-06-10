import LoginForm from "./login-form";

export const metadata = {
  title: "Acceso · Panel Yaya Mariana",
  robots: { index: false, follow: false },
};

/* Login del panel interno (T6 → endurecido en FASE A.5/T2).
   La página es server component (sólo para exportar metadata noindex);
   el formulario interactivo vive en login-form.tsx (client component:
   estado de carga, recordar usuario, error accesible). El proxy ya impide
   el acceso al panel sin sesión válida. */
export default function AdminLoginPage() {
  return <LoginForm />;
}
