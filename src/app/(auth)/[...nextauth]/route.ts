import NextAuth from 'next-auth';
import { authOptions } from './options';

// Exporter le gestionnaire NextAuth avec les options
const handler = NextAuth(authOptions);

// Exporter les méthodes HTTP nécessaires
export { handler as GET, handler as POST };