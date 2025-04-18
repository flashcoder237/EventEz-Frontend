'use client';

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { TicketSelectionProvider } from '@/context/TicketSelectionContext';

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider 
      refetchInterval={0} 
      refetchOnWindowFocus={false}
      refetchWhenOffline={false}
      onError={(error) => {
        console.error("Session error:", error);
        // Ne pas faire échouer l'application en cas d'erreur de session
      }}
    >
      <TicketSelectionProvider>
        {children}
      </TicketSelectionProvider>
    </SessionProvider>
  );
}