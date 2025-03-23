import NextAuth from 'next-auth';
import { authOptions } from './options';

// Créer et exporter le handler NextAuth
const handler = NextAuth(authOptions);

// Exporter les méthodes nécessaires pour l'API Route
export { handler as GET, handler as POST };