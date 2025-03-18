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
          const { data } = await axios.post(`${API_URL}/token/`, {
            email: credentials?.email,
            password: credentials?.password,
          });
          
          if (data.access && data.refresh) {
            // Decode the JWT token safely
            const userInfo = JSON.parse(
              Buffer.from(data.access.split('.')[1], 'base64').toString('utf-8')
            );
            
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
          // Plus de détails sur l'erreur
          if (axios.isAxiosError(error)) {
          console.error("Authentication Error:", error.response?.data || error.message);

          } else {
            console.error("Erreur inattendue:", error);
          }
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Ajouter les tokens JWT et le rôle au token de session
      if (user) {
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          role: user.role,
          exp: Date.now() + 60 * 60 * 1000 // 1 heure en millisecondes
        };
      }
  
      // Vérifier si le token a expiré
      const isTokenExpired = Date.now() > (token.exp as number);
      if (!isTokenExpired) return token;
  
      // Renouveler le token
      try {
        const response = await axios.post(`${API_URL}/token/refresh/`, {
          refresh: token.refreshToken
        });
  
        const newAccessToken = response.data.access;
        
        return {
          ...token,
          accessToken: newAccessToken,
          exp: Date.now() + 60 * 60 * 1000
        };
      } catch (error) {
        console.error("Refresh Token Error:", error.response?.data || error.message);

        return { ...token, error: "RefreshAccessTokenError" };
      }
    },
    async session({ session, token }) {
      // Gérer les erreurs de refresh token
      if (token.error === "RefreshAccessTokenError") {
        // Déconnexion forcée si le refresh token échoue
        session.user = null;
      } else {
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
