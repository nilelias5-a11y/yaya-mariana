import type { User, Order } from "./types";

/* FASE B — Datos semilla del mock (zona cliente).
 *
 * Usuario de prueba + 3 pedidos en distintos estados, para poder recorrer
 * todo el flujo sin Stripe real. El hash es de una contraseña conocida
 * (ver README-CUENTA.md). Al migrar a una BD real, este seed desaparece. */

const TEST_USER_ID = "usr_test_0001";

const TEST_ADDRESS = {
  id: "addr_0001",
  label: "Casa",
  recipient: "Cliente de Prueba",
  street: "Carrer de la Maduixa, 12, 2º A",
  city: "Tarragona",
  postalCode: "43001",
  region: "Tarragona",
  country: "España",
  phone: "+34 600 111 222",
};

export const SEED_USERS: User[] = [
  {
    id: TEST_USER_ID,
    email: "cliente@test.yaya-mariana.com",
    emailVerified: true,
    // bcrypt de la contraseña de prueba (ver README-CUENTA.md).
    passwordHash: "$2b$12$0vemo30aOu6XpMsspsZBv.4ICQe1o3.Wf03UtMLIj4BbMoyHJtdLi",
    nombre: "Cliente de Prueba",
    telefono: "+34 600 111 222",
    dni: "12345678Z",
    addresses: [TEST_ADDRESS],
    marketingOptIn: false,
    createdAt: "2026-05-20T10:00:00.000Z",
  },
];

const billing = {
  nombre: "Cliente de Prueba",
  dni: "12345678Z",
  address: TEST_ADDRESS,
};

export const SEED_ORDERS: Order[] = [
  {
    id: "ym-2026-0001",
    number: "YM-2026-0001",
    userId: TEST_USER_ID,
    items: [
      { variety: "Mágnum", name: "Caja fresas Yaya Mariana — Mágnum", qty: 2, unitPrice: 7.5, image: "/fresas/magnum/magnum-10.jpeg" },
      { variety: "Dream", name: "Caja fresas Yaya Mariana — Dream", qty: 1, unitPrice: 7.5, image: "/fresas/dream/dream-07.jpeg" },
    ],
    status: "entregado",
    createdAt: "2026-05-22T09:30:00.000Z",
    shippingAddress: TEST_ADDRESS,
    billing,
    invoiceNumber: "FCV-2026-0001",
  },
  {
    id: "ym-2026-0002",
    number: "YM-2026-0002",
    userId: TEST_USER_ID,
    items: [
      { variety: "1525", name: "Caja fresas Yaya Mariana — Variedad 1525", qty: 3, unitPrice: 7.5, image: "/fresas/variedad1525/variedad1525-10.jpeg" },
    ],
    status: "enviado",
    createdAt: "2026-06-04T16:10:00.000Z",
    shippingAddress: TEST_ADDRESS,
    billing,
    invoiceNumber: "FCV-2026-0002",
    trackingUrl: "https://tracking.sendcloud.sc/forward?carrier=demo&code=YM2026000200",
  },
  {
    id: "ym-2026-0003",
    number: "YM-2026-0003",
    userId: TEST_USER_ID,
    items: [
      { variety: "Mágnum", name: "Caja fresas Yaya Mariana — Mágnum", qty: 1, unitPrice: 7.5, image: "/fresas/magnum/magnum-10.jpeg" },
    ],
    status: "preparacion",
    createdAt: "2026-06-09T11:45:00.000Z",
    shippingAddress: TEST_ADDRESS,
    billing,
    invoiceNumber: "FCV-2026-0003",
  },
];
