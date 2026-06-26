# Fotos de producto sin usar

Estas fotos de fresas estaban en `public/fresas/` pero **no se referencian** en
ningún sitio del código. Solo se usan 12 (4 por variedad), definidas en
`src/config/business.ts`.

Se han movido aquí para:

- **Quitar peso del deploy**: no se sirven ni se suben a Vercel (ver
  `.vercelignore` en la raíz).
- **No perderlas**: siguen en el repositorio por si sirven de referencia
  cuando J. Elías aporte las fotos reales.

Para volver a usar alguna: muévela de vuelta a
`public/fresas/<variedad>/` y referénciala en `src/config/business.ts`.
