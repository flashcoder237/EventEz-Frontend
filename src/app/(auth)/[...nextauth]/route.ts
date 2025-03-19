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
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const { data } = await axios.post(`${API_URL}/token/`, {
            email: credentials.email,
            password: credentials.password,
          }, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
          
          if (data && data.access && data.refresh) {
            // Log the successful response for debugging
            console.log('Successful authentication response:', data);

            // Décodage sécurisé du token
            const base64Payload = data.access.split('.')[1];
            const decodedPayload = JSON.parse(
              Buffer.from(base64Payload, 'base64').toString('utf-8')
            );
            
            return {
              id: decodedPayload.user_id?.toString() || 'unknown',
              email: decodedPayload.email || credentials.email,
              name: decodedPayload.username || 'Utilisateur',
              role: decodedPayload.role || 'user',
              accessToken: data.access,
              refreshToken: data.refresh,
            };
          }
          console.error('Unexpected response structure:', data);
          console.error('Full error response:', error.response);

          return null;
        } catch (error) {
          // Gestion détaillée des erreurs
          if (axios.isAxiosError(error)) {
            console.error('Erreur d\'authentification:', {
              status: error.response?.status,
              data: error.response?.data,
              message: error.message
            });
            console.error('Full error response:', error.response);
          } else {
            console.error('Erreur inattendue:', error);
          }
          
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Mise à jour du token lors de la connexion
      if (user) {
        return {
          ...token,
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          exp: Date.now() + 60 * 60 * 1000 // 1 heure
        };
      }

      // Gestion du rafraîchissement de session
      if (trigger === 'update') {
        return { ...token, ...session };
      }

      // Vérification et rafraîchissement du token
      const isTokenExpired = Date.now() > (token.exp as number);
      if (!isTokenExpired) return token;

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
      } catch (refreshError) {
        console.error('Erreur de refresh token:', refreshError);
        return { ...token, error: 'RefreshAccessTokenError' };
      }
    },
    async session({ session, token }) {
      // Gérer les erreurs de refresh token
      if (token.error === 'RefreshAccessTokenError') {
        // Déconnexion forcée si le refresh token échoue
        session.user = null;
      } else {
        session.user.id = token.id || token.sub;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.role = token.role;
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
      }
      
      return session;
    },
  },
  pages: {
    signIn: '/login',  // Corrigé
    signOut: '/',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60, // 1 heure
  },
  // Configuration des logs
  debug: process.env.NODE_ENV === 'development',
});

export { handler as GET, handler as POST };
