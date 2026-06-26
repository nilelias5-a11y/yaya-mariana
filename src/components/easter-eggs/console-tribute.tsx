"use client";

import { useEffect } from "react";

/* ENHANCE-7 · Easter egg #1 — Console tribute.
   Un solo console.log al cargar la pagina con una linea de homenaje
   en voz tributo + un pequeno ornamento en Playfair (estilo CSS via
   `%c` console formatting). Sin emojis, sin hiring nudge, sin URL.
   Sin exclamacion (regla tono).

   Solo se ejecuta una vez por carga; el flag `ym_console_v1` evita
   repetir el mensaje si la pagina se rehidrata client-side. */
export default function ConsoleTribute() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (window.sessionStorage.getItem("ym_console_v1") === "1") return;
      window.sessionStorage.setItem("ym_console_v1", "1");
    } catch {
      /* sessionStorage puede estar bloqueado en algunos navegadores
         (modo restrictivo / iframe sandbox). Si falla, se loga sin
         deduplicacion — el coste es trivial. */
    }
    console.log(
      "%c  ❦\n\n  Para Mariana.\n  Las fresas siguen sabiendo a ti.\n  ❦  ",
      [
        "color: #7a1a1a",
        "background: #fdf6f5",
        "padding: 12px 24px",
        "font-family: 'Playfair Display', Georgia, serif",
        "font-style: italic",
        "font-size: 13px",
        "line-height: 1.6",
        "border-left: 2px solid #c0392b",
      ].join(";"),
    );
  }, []);
  return null;
}
