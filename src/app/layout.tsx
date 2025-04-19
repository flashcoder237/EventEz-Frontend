import type { Metadata } from "next";
import { Providers } from "./providers";
import DebugNextAuth from "@/components/DebugNextAuth";
import "./globals.css";

// Métadonnées de l'application
export const metadata: Metadata = {
  title: {
    template: '%s | EventEz',
    default: "EventEz - Plateforme d'événements au Cameroun",
  },
  description: "Plateforme complète de gestion d'événements au Cameroun - Billetterie, inscriptions, paiements Mobile Money",
  keywords: ["événements", "billetterie", "Cameroun", "inscriptions", "MTN Mobile Money", "Orange Money"],
  authors: [{ name: "EventEz Team" }],
  creator: "EventEz",
  publisher: "EventEz",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">
        <Providers>
          {children}
          {process.env.NODE_ENV === 'development' && <DebugNextAuth />}
        </Providers>
      </body>
    </html>
  );
}