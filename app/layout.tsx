// ============================================
// LAYOUT PRINCIPAL
// ============================================

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { PokemonWidget } from "@/components/PokemonWidget";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Poke Torneos - Gestor de Torneos Pokémon TCG",
  description: "Gestor de torneos Pokémon TCG con soporte offline y persistencia local",
  icons: {
    icon: "/electrode.png",
    shortcut: "/electrode.png",
    apple: "/electrode.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-slate-50 text-slate-900 min-h-screen`}>
        <Navigation />
        <main className="container mx-auto px-4 py-6">
          {children}
        </main>
        <PokemonWidget />
      </body>
    </html>
  );
}
