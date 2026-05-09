import type { Metadata } from "next";
import { Inter, Playfair_Display, Yellowtail } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const yellowtail = Yellowtail({
  variable: "--font-yellowtail",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Yaya Mariana – Lechugas hidropónicas frescas",
  description:
    "Lechugas hidropónicas frescas, cultivadas con cariño. Sin pesticidas, sin químicos. Directas a tu mesa.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${playfair.variable} ${yellowtail.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#fdf6f5]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
