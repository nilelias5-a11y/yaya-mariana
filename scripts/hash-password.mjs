// scripts/hash-password.mjs
//
// Genera el hash bcrypt de una contraseña para el panel /admin.
// La contraseña NUNCA se guarda en texto plano: en .env.local sólo vive
// su hash (ADMIN_PASS_HASH).
//
// Uso:
//   node scripts/hash-password.mjs "tu-nueva-contraseña"
//
// Luego copia la línea ADMIN_PASS_HASH=... que imprime dentro de
// .env.local (y en las variables de entorno del entorno de deploy).
//
// Para generar también un SESSION_SECRET nuevo:
//   node scripts/hash-password.mjs "tu-nueva-contraseña" --with-secret

import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";

const password = process.argv[2];
const withSecret = process.argv.includes("--with-secret");

if (!password) {
  console.error('Falta la contraseña.\nUso: node scripts/hash-password.mjs "tu-contraseña"');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 12);

console.log("\n# Pega esto en .env.local (y en el entorno de deploy).");
console.log("# OJO: comillas simples obligatorias — el hash contiene '$' y dotenv lo expandiria.\n");
console.log(`ADMIN_PASS_HASH='${hash}'`);
if (withSecret) {
  console.log(`SESSION_SECRET=${randomBytes(48).toString("hex")}`);
}
console.log("");
