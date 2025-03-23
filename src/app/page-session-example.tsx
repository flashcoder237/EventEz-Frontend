'use client';

import { useSession } from 'next-auth/react';

export default function SessionUsageExample() {
  // Utilisation sécurisée de useSession
  const { data: session, status } = useSession({
    required: false,
    onUnauthenticated() {
      // Ici, on peut simplement afficher un état non connecté
    },
  });
  
  // Montrer un état de chargement
  if (status === 'loading') {
    return <p>Chargement...</p>;
  }

  return (
    <div>
      {status === 'authenticated' ? (
        <p>Connecté en tant que: {session.user?.name}</p>
      ) : (
        <p>Non connecté</p>
      )}
    </div>
  );
}