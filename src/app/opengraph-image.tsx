import { ImageResponse } from "next/og";

/* App Router Open Graph image dinamica (1200x630, runtime edge).
   HARD RULE (project memory): NO aparece el nombre/cara del fundador.
   Tipografia pura sobre fondo cream: wordmark "Yaya Mariana" Playfair
   italic + tres variedades. Tono tributo: sin reclamo comercial. */

export const runtime = "edge";
export const alt = "Yaya Mariana – Fresas de Tarragona";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadPlayfairItalic(): Promise<ArrayBuffer> {
  const css = await fetch(
    "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,400&display=swap",
    { headers: { "User-Agent": "Mozilla/5.0" } },
  ).then((r) => r.text());
  const match = css.match(/src: url\((https:[^)]+\.(?:ttf|otf))\)/);
  if (!match) throw new Error("Playfair Italic font URL not found in Google CSS");
  const fontRes = await fetch(match[1]);
  return await fontRes.arrayBuffer();
}

export default async function Image() {
  const playfair = await loadPlayfairItalic();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 80,
          background:
            "radial-gradient(ellipse 70% 60% at 22% 18%, #fdf0ef 0%, transparent 60%), radial-gradient(ellipse 65% 55% at 78% 78%, #ead7d4 0%, transparent 65%), #fdf6f5",
          fontFamily: "Playfair",
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontFamily: "system-ui",
            fontStyle: "normal",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#962a1f",
            fontWeight: 600,
            marginBottom: 32,
          }}
        >
          Tarragona · Sin pesticidas
        </div>

        <div
          style={{
            fontStyle: "italic",
            fontSize: 144,
            lineHeight: 1.05,
            color: "#7a1f17",
            textAlign: "center",
          }}
        >
          Yaya Mariana
        </div>

        <div
          style={{
            marginTop: 24,
            fontSize: 36,
            color: "#5a2a2a",
            fontStyle: "italic",
            textAlign: "center",
          }}
        >
          Fresas de Tarragona
        </div>

        <div
          style={{
            width: 80,
            height: 3,
            backgroundColor: "#962a1f",
            borderRadius: 2,
            marginTop: 48,
            marginBottom: 48,
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 32,
            fontSize: 36,
            fontStyle: "italic",
            color: "#962a1f",
          }}
        >
          <span>Mágnum</span>
          <span style={{ color: "#d8b8b4" }}>·</span>
          <span>Dream</span>
          <span style={{ color: "#d8b8b4" }}>·</span>
          <span>1525</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Playfair",
          data: playfair,
          style: "italic",
          weight: 400,
        },
      ],
    },
  );
}
