'use client';

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

type ProvidersProps = {
  children: ReactNode;
};

/**
 * Fournisseurs de contexte pour l'application
 * - SessionProvider pour l'authentification avec NextAuth
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider 
      // Désactiver les requêtes de rafraîchissement automatique
      // car nous gérons le rafraîchissement manuellement dans l'API
      refetchInterval={0} 
      refetchOnWindowFocus={false}
    >
      {children}
    </SessionProvider>
  );
}