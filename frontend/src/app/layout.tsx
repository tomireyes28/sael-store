// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Usamos un template para que las subpáginas digan "Nombre Producto | SAEL SPORT"
  title: {
    template: "%s | SAEL SPORT",
    default: "SAEL SPORT | Indumentaria Deportiva Premium",
  },
  description: "La mejor indumentaria deportiva. Conseguí camisetas, conjuntos, ediciones retro y equipos de todo el mundo. Envíos gratis a todo el país.",
  keywords: ["camisetas", "fútbol", "deportes", "indumentaria", "retro", "sael sport", "ropa deportiva", "argentina"],
  authors: [{ name: "SAEL SPORT" }],
  // Esto ayuda a que cuando compartan el link por WhatsApp o Twitter, se vea bien
  openGraph: {
    title: "SAEL SPORT | Indumentaria Deportiva Premium",
    description: "La mejor indumentaria deportiva. Conseguí camisetas, conjuntos, ediciones retro y equipos de todo el mundo.",
    url: "https://saelsport.com", // Cuando tengas el dominio real, lo cambiás acá
    siteName: "SAEL SPORT",
    locale: "es_AR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-AR" // CLAVE: Cambiamos "en" por español de Argentina para el SEO local
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#121212] text-white">
        {children}
      </body>
    </html>
  );
}