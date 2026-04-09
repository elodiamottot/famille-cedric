import type { Metadata, Viewport } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "Famille Cédric",
  description: "Répertoire de la famille de Cédric",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">
        <Nav />
        <main className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
