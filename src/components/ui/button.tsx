"use client";

/* ============================================================
   Button — primitiva ÚNICA de botón · Yaya Mariana
   Fase 5 · TANDA 2 · frontend-developer

   Sustituye los ~33 botones <a>/<button> artesanales (8 paddings para el
   rol primario, radio por dos mecanismos, estado `active` ausente, hover
   en 3 patrones) por UN sistema. El estilo vive en `globals.css` §8
   (clases .btn / .btn-ghost / .btn-link / .btn-icon); este componente solo
   compone las clases y elige el elemento (<button> o <a>).

   La anterior primitiva shadcn/base-ui (h-8/h-9 < 44px, rounded-lg, hover
   con opacidad) era código muerto y divergía del design system — se
   eliminó; esta la reemplaza.

   Variantes:
     primary          — acción comercial, rojo sólido sobre claro
     primary-inverse  — acción comercial sobre banda oscura (CTA)
     ghost            — secundario: subrayado scaleX, sin flecha
     link             — terciario: link de acción, 13px
   Tamaños (primary/primary-inverse): sm (44px) · md (48px, default).
   Estados (default/hover/focus/active/disabled) los define globals.css §8.
   ============================================================ */

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "primary-inverse" | "ghost" | "link";
type Size = "sm" | "md";

type CommonProps = {
  variant?: Variant;
  /* Solo aplica a variant primary / primary-inverse. */
  size?: Size;
  /* Botón a ancho completo (ortogonal al tamaño — el padding no cambia). */
  block?: boolean;
  /* Ghost sobre banda oscura: texto claro, mismo subrayado. */
  onDeep?: boolean;
  className?: string;
  children: React.ReactNode;
};

/* Construye las clases de la variante elegida. */
function buttonClasses({
  variant = "primary",
  size = "md",
  block,
  onDeep,
  className,
}: Pick<CommonProps, "variant" | "size" | "block" | "onDeep" | "className">) {
  if (variant === "ghost") {
    return cn("btn-ghost", onDeep && "btn-ghost--on-deep", className);
  }
  if (variant === "link") {
    return cn("btn-link", className);
  }
  return cn(
    "btn",
    size === "sm" ? "btn--sm" : "btn--md",
    variant === "primary-inverse" ? "btn--primary-inverse" : "btn--primary",
    block && "btn--block",
    className,
  );
}

/* --- Como <button> --- */
type ButtonAsButton = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
    as?: "button";
  };

/* --- Como <a> (enlace de navegación / ancla) --- */
type ButtonAsLink = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "className"> & {
    as: "a";
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button(props, ref) {
    if (props.as === "a") {
      const { as, variant, size, block, onDeep, className, children, ...rest } = props;
      void as;
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={buttonClasses({ variant, size, block, onDeep, className })}
          {...rest}
        >
          {children}
        </a>
      );
    }

    const { as, variant, size, block, onDeep, className, children, type, ...rest } = props;
    void as;
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type ?? "button"}
        className={buttonClasses({ variant, size, block, onDeep, className })}
        {...rest}
      >
        {children}
      </button>
    );
  },
);

export default Button;
