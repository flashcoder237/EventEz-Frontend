
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react";
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
  title: "EventEz",
  description: "Plateforme de gestion d'événements au Cameroun",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider
        refetchInterval={5 * 60} // Rafraîchir toutes les 5 minutes
        refetchOnWindowFocus={true} // Rafraîchir au focus de la fenêtre
        >
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}