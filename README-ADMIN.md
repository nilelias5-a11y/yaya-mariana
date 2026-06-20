# Panel `/admin` — Yaya Mariana

Acceso interno protegido por sesión JWT firmada. Desde la 2ª tanda de BD
(TAREA 1/2) el panel muestra **datos reales de Neon**: los pedidos provienen
de `cuenta_orders` y el stock de `product_stock` (ya no hay mock).

## Fuente de credenciales (Neon + fallback env)

Las credenciales del admin viven en la tabla **`admin_users`** (usuario +
hash bcrypt), sembrada por `npm run db:migrate` a partir de `ADMIN_USER` /
`ADMIN_PASS_HASH`. El login (`/api/admin/login`) busca primero en la tabla y,
si no hay registro o la BD falla, hace **fallback a las env vars** — así
`/admin` no se rompe nunca. Para cambiar la contraseña puedes:

- Editar el hash en `admin_users` directamente (SQL editor de Neon), **o**
- Actualizar `ADMIN_PASS_HASH` en el entorno (ver más abajo) — sólo aplica si
  no hay fila en `admin_users` para ese usuario.

## Datos del dashboard

- **Pedidos**: `cuenta_orders` (mismos que ve el cliente en `/cuenta`).
  Estados de dominio: `pagado`, `preparacion`, `enviado`, `entregado`,
  `cancelado`. La métrica «Ventas del mes» suma los pedidos no cancelados del
  mes en curso; «Pedidos pendientes» = `pagado` + `preparacion`.
- **Stock**: `product_stock` (variedad, unidades y umbrales `low`/`out` por
  fila). Editable desde el SQL editor de Neon; el stock real lo aporta
  J. Elías.

## Cómo entrar

1. Arranca el proyecto: `npm run dev`
2. Visita `http://localhost:3000/admin` → te redirige al login.
3. Introduce el **usuario** y la **contraseña** provisionales (ver más abajo).

El usuario es `admin`. La contraseña provisional se entregó por separado
(no se guarda en el repositorio; sólo vive su hash bcrypt en `.env.local`).

## Variables de entorno (`.env.local`, gitignored)

| Variable           | Descripción                                                        |
| ------------------ | ------------------------------------------------------------------ |
| `ADMIN_USER`       | Nombre de usuario del admin.                                       |
| `ADMIN_PASS_HASH`  | Hash **bcrypt** de la contraseña (nunca texto plano).             |
| `SESSION_SECRET`   | Clave para firmar el JWT de sesión (HS256). Mín. 32 caracteres.   |

> En el entorno de **deploy** hay que definir estas tres variables (con un
> `SESSION_SECRET` distinto del de desarrollo).

## Cambiar la contraseña

```bash
node scripts/hash-password.mjs "tu-nueva-contraseña"
```

Copia el hash que imprime y pégalo en `.env.local`
(y en las env vars del entorno de deploy). Reinicia el servidor.

> ⚠️ **Escapa los `$` con `\$`** en `.env.local`: el hash bcrypt contiene
> `$` (`$2b$12$...`) y el loader de Next (`dotenv-expand`) los expandiría
> como variables, corrompiéndolo. Es decir, la línea debe quedar:
> `ADMIN_PASS_HASH=\$2b\$12\$...`. (Las comillas NO bastan: dotenv-expand
> corre después de parsear las comillas.) En paneles de deploy
> (Vercel, etc.) que guardan el valor literal no hace falta escapar.

Para generar además un `SESSION_SECRET` nuevo:

```bash
node scripts/hash-password.mjs "tu-nueva-contraseña" --with-secret
```

> Cambiar `SESSION_SECRET` invalida **todas** las sesiones existentes
> (todos los JWT emitidos dejan de verificar).

## Cómo funciona la seguridad

- **Login** (`/api/admin/login`, runtime Node): compara la contraseña con
  `bcrypt.compare` contra `ADMIN_PASS_HASH`. Compara siempre un hash
  (real o dummy) → tiempo constante, sin enumeración de usuarios. El error
  es genérico («Usuario o contraseña incorrectos»), no filtra cuál falló.
- **Sesión**: JWT HS256 firmado con `SESSION_SECRET`, guardado en cookie
  `admin_session` **httpOnly**, `sameSite=lax`, `secure` en producción.
  Expira a las **8h**.
- **Renovación deslizante**: cada visita autenticada al panel re-emite el
  token (8h nuevas) → la sesión sólo caduca tras 8h de **inactividad**.
- **Proxy** (`src/proxy.ts`, runtime Edge, sólo `jose`): verifica firma y
  expiración en cada request a `/admin/*`. Sin sesión válida → login.
- **Logout** (`/api/admin/logout`): borra la cookie httpOnly. Al ser un JWT
  sin estado, eliminar la cookie cierra la sesión en el navegador.

## Limitación conocida

El JWT es **sin estado** (no hay store de sesiones en servidor). Logout
borra la cookie del navegador, pero un token ya emitido seguiría siendo
válido hasta su expiración si alguien lo hubiera copiado antes. Para
revocación inmediata global, rota `SESSION_SECRET`. Suficiente para un
panel mono-admin; al integrar Stripe/datos reales conviene migrar a un
store de sesiones (p. ej. base de datos o Redis).
