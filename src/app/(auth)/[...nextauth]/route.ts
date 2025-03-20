import NextAuth from 'next-auth';
import { authOptions } from './options';

// Créer le gestionnaire NextAuth avec nos options
const handler = NextAuth(authOptions);

// Exporter toutes les méthodes HTTP nécessaires
export { handler as GET, handler as POST };