// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials) {
        try {
          // Appel à l'API Django pour s'authentifier
          const { data } = await axios.post(`${API_URL}/token/`, {
            email: credentials?.email,
            password: credentials?.password,
          });
          
          // L'API retourne les tokens JWT et les informations utilisateur
          if (data.access && data.refresh) {
            // Décodage du token pour obtenir les infos utilisateur
            const userInfo = JSON.parse(atob(data.access.split('.')[1]));
            
            return {
              id: userInfo.user_id,
              email: userInfo.email,
              name: userInfo.username,
              role: userInfo.role,
              accessToken: data.access,
              refreshToken: data.refresh,
            };
          }
          return null;
        } catch (error) {
          console.error("Erreur d'authentification:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Ajouter les tokens JWT et le rôle au token de session
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // Ajouter les tokens JWT et le rôle à la session utilisateur
      if (token) {
        session.user.id = token.sub;
        session.user.role = token.role;
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60, // 1 heure (pour correspondre à l'accès token)
  },
});

export { handler as GET, handler as POST };