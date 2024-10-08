import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Suspense } from "react";

/* Carregando fontes locais com nome e variáveis mais descritivos */
const playfairDisplayItalic = localFont({
  src: "./fonts/PlayfairDisplay-Italic-VariableFont_wght.ttf",
  variable: "--font-playfair-display-italic",
  weight: "100 900",
});

const playfairDisplay = localFont({
  src: "./fonts/PlayfairDisplay-VariableFont_wght.ttf",
  variable: "--font-playfair-display",
  weight: "100 900",
});

export const metadata: Metadata = {
  icons: {
    icon: '/flower-bouquet.ico'
  },
  title: "Nicole & Victor",
  description: "Confirme sua presença no nosso casamento!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={`${playfairDisplayItalic.variable} ${playfairDisplay.variable}`}>
      <Suspense fallback={<div>Carregando conteúdo...</div>}>
        {children}
        </Suspense>
      </body>
    </html>
  );
}
