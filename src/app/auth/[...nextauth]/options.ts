import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const authOptions: NextAuthOptions = {
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
            
            console.error('Structure de token inattendue:', data);
            return null;
          } catch (error) {
            // Gestion détaillée des erreurs
            if (axios.isAxiosError(error)) {
              console.error('Erreur d\'authentification:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
              });
            } else {
              console.error('Erreur inattendue durant l\'authentification:', error);
            }
            
            return null;
          }
        },
      }),
    ],
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          // Connexion initiale
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
  
        // Vérification de l'expiration du token
        if (token.exp && Date.now() < token.exp) {
          return token;
        }
  
        // Le token a expiré, essayons de le rafraîchir
        try {
          const response = await axios.post(`${API_URL}/token/refresh/`, {
            refresh: token.refreshToken
          });
  
          return {
            ...token,
            accessToken: response.data.access,
            exp: Date.now() + 60 * 60 * 1000
          };
        } catch (error) {
          console.error('Erreur lors du rafraîchissement du token:', error);
          return { ...token, error: 'RefreshAccessTokenError' };
        }
      },
      async session({ session, token }) {
        // Transférer les valeurs du token à la session client
        if (session.user) {
          session.user.id = token.id as string;
          session.user.name = token.name as string;
          session.user.email = token.email as string;
          session.user.role = token.role as 'user' | 'organizer' | 'admin';
        }
        
        session.accessToken = token.accessToken as string;
        session.refreshToken = token.refreshToken as string;
        session.error = token.error as string | undefined;
        
        return session;
      }
    },
    pages: {
      signIn: '/login',
      signOut: '/',
      error: '/login',
    },
    session: {
      strategy: 'jwt',
      maxAge: 60 * 60, // 1 heure
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === 'development',
  };    