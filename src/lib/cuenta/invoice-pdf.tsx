import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import type { Order } from "./types";
import { computeTotals, lineBaseUnit, formatEUR, formatDateES, IVA_RATE, ISSUER } from "./invoice";

/* FASE B — Factura PDF profesional (normativa española B2C).
 *
 * 1 página A4. Tipografía built-in del PDF: Times-Italic para el wordmark
 * "Yaya Mariana" (aproxima Playfair italic) y Helvetica para los datos
 * (aproxima Inter) — evita depender de ficheros de fuente externos.
 * Paleta canónica en acentos. Logo raster opcional vía `logoPath`. */

const C = {
  ink: "#1a0808",
  muted: "#7a3a3a",
  terracota: "#c0392b",
  line: "#e9d8d6",
  soft: "#fdf6f5",
};

const s = StyleSheet.create({
  page: { paddingTop: 42, paddingBottom: 56, paddingHorizontal: 48, fontFamily: "Helvetica", fontSize: 9.5, color: C.ink, lineHeight: 1.5 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 },
  wordmark: { fontFamily: "Times-Italic", fontSize: 24, color: C.terracota },
  logo: { width: 130 },
  invoiceMeta: { textAlign: "right" },
  invoiceTitle: { fontFamily: "Helvetica-Bold", fontSize: 13, color: C.ink, marginBottom: 2 },
  metaLabel: { color: C.muted, fontSize: 8 },
  rule: { borderBottomWidth: 1, borderBottomColor: C.terracota, opacity: 0.5, marginVertical: 12 },
  partiesRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 18, gap: 24 },
  partyBox: { flex: 1 },
  partyHeading: { fontFamily: "Helvetica-Bold", fontSize: 8, color: C.terracota, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 4 },
  partyName: { fontFamily: "Helvetica-Bold", fontSize: 10 },
  partyLine: { color: C.muted },
  tableHead: { flexDirection: "row", backgroundColor: C.soft, borderTopWidth: 1, borderBottomWidth: 1, borderColor: C.line, paddingVertical: 6, paddingHorizontal: 4 },
  th: { fontFamily: "Helvetica-Bold", fontSize: 8, color: C.muted, textTransform: "uppercase", letterSpacing: 0.4 },
  row: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: C.line, paddingVertical: 7, paddingHorizontal: 4 },
  cConcept: { flex: 3.2 },
  cQty: { flex: 0.8, textAlign: "right" },
  cUnit: { flex: 1.2, textAlign: "right" },
  cTotal: { flex: 1.2, textAlign: "right" },
  totals: { marginTop: 14, marginLeft: "auto", width: 220 },
  totalsRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 3 },
  totalsGrand: { flexDirection: "row", justifyContent: "space-between", paddingTop: 7, marginTop: 4, borderTopWidth: 1, borderTopColor: C.terracota },
  grandLabel: { fontFamily: "Helvetica-Bold", fontSize: 11 },
  grandValue: { fontFamily: "Helvetica-Bold", fontSize: 11, color: C.terracota },
  payRow: { marginTop: 22, flexDirection: "row", justifyContent: "space-between" },
  footer: { position: "absolute", bottom: 28, left: 48, right: 48, textAlign: "center", color: C.muted, fontSize: 7.5, borderTopWidth: 1, borderTopColor: C.line, paddingTop: 8 },
});

export function InvoicePDF({ order, logoPath }: { order: Order; logoPath?: string }) {
  const totals = computeTotals(order);
  const { billing } = order;

  return (
    <Document
      title={`Factura ${order.invoiceNumber}`}
      author={ISSUER.brand}
      subject={`Pedido ${order.number}`}
    >
      <Page size="A4" style={s.page}>
        {/* Cabecera: logo/wordmark + datos de la factura */}
        <View style={s.headerRow}>
          <View>
            {/* El <Image> de @react-pdf NO es un <img> HTML: no existe `alt` (falso positivo). */}
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            {logoPath ? <Image src={logoPath} style={s.logo} /> : <Text style={s.wordmark}>Yaya Mariana</Text>}
          </View>
          <View style={s.invoiceMeta}>
            <Text style={s.invoiceTitle}>FACTURA</Text>
            <Text>{order.invoiceNumber}</Text>
            <Text style={s.metaLabel}>Fecha de emisión</Text>
            <Text>{formatDateES(order.createdAt)}</Text>
          </View>
        </View>

        <View style={s.rule} />

        {/* Emisor / Receptor */}
        <View style={s.partiesRow}>
          <View style={s.partyBox}>
            <Text style={s.partyHeading}>Emisor</Text>
            <Text style={s.partyName}>{ISSUER.legalName}</Text>
            <Text style={s.partyLine}>CIF: {ISSUER.cif}</Text>
            <Text style={s.partyLine}>{ISSUER.address}</Text>
            <Text style={s.partyLine}>Marca comercial: {ISSUER.brand}</Text>
          </View>
          <View style={s.partyBox}>
            <Text style={s.partyHeading}>Receptor</Text>
            <Text style={s.partyName}>{billing.nombre}</Text>
            <Text style={s.partyLine}>DNI/NIF: {billing.dni}</Text>
            <Text style={s.partyLine}>{billing.address.street}</Text>
            <Text style={s.partyLine}>
              {billing.address.postalCode} {billing.address.city} ({billing.address.region})
            </Text>
            <Text style={s.partyLine}>{billing.address.country}</Text>
          </View>
        </View>

        {/* Tabla de conceptos */}
        <View style={s.tableHead}>
          <Text style={[s.th, s.cConcept]}>Concepto</Text>
          <Text style={[s.th, s.cQty]}>Cant.</Text>
          <Text style={[s.th, s.cUnit]}>P. unit. (s/IVA)</Text>
          <Text style={[s.th, s.cTotal]}>Base</Text>
        </View>
        {order.items.map((it, i) => {
          const unitBase = lineBaseUnit(it.unitPrice);
          return (
            <View style={s.row} key={i}>
              <Text style={s.cConcept}>{it.name} · cantidad {it.qty}</Text>
              <Text style={s.cQty}>{it.qty}</Text>
              <Text style={s.cUnit}>{formatEUR(unitBase)}</Text>
              <Text style={s.cTotal}>{formatEUR(unitBase * it.qty)}</Text>
            </View>
          );
        })}

        {/* Totales */}
        <View style={s.totals}>
          <View style={s.totalsRow}>
            <Text style={{ color: C.muted }}>Subtotal (base imponible)</Text>
            <Text>{formatEUR(totals.base)}</Text>
          </View>
          <View style={s.totalsRow}>
            <Text style={{ color: C.muted }}>IVA ({Math.round(IVA_RATE * 100)}%)</Text>
            <Text>{formatEUR(totals.iva)}</Text>
          </View>
          <View style={s.totalsGrand}>
            <Text style={s.grandLabel}>Total</Text>
            <Text style={s.grandValue}>{formatEUR(totals.total)}</Text>
          </View>
        </View>

        {/* Pago */}
        <View style={s.payRow}>
          <View>
            <Text style={s.partyHeading}>Forma de pago</Text>
            <Text style={s.partyLine}>Tarjeta (Stripe)</Text>
          </View>
          <View style={{ textAlign: "right" }}>
            <Text style={s.partyHeading}>Pedido</Text>
            <Text style={s.partyLine}>{order.number}</Text>
          </View>
        </View>

        <Text style={s.footer} fixed>
          Factura emitida electrónicamente por {ISSUER.legalName} (CIF {ISSUER.cif}). IVA reducido 10%
          aplicable a productos alimentarios. Documento válido sin firma manuscrita.
        </Text>
      </Page>
    </Document>
  );
}
