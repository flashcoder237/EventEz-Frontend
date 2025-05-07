import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Durées de session en secondes
const SESSION_DURATIONS = {
  DEFAULT: 60 * 60, // 1 heure 
  REMEMBER_ME: 30 * 24 * 60 * 60, // 30 jours
};

export const authOptions: NextAuthOptions = {
    providers: [
      CredentialsProvider({
        name: 'Credentials',
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Mot de passe", type: "password" },
          rememberMe: { label: "Se souvenir de moi", type: "boolean" }
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
            
            if (data && data.access) {
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
                // refreshToken is no longer in response body
                rememberMe: credentials.rememberMe === 'true',
              };
            }
            
            console.error('Structure de token inattendue:', data);
            return null;
          } catch (error) {
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
          // Durée d'expiration basée sur "Se souvenir de moi"
          const duration = user.rememberMe 
            ? SESSION_DURATIONS.REMEMBER_ME 
            : SESSION_DURATIONS.DEFAULT;
          
          return {
            ...token,
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          accessToken: user.accessToken,
          // refreshToken removed
          exp: Math.floor(Date.now() / 1000) + 60 * 60, // Expiration du token d'accès (toujours 1h)
          sessionExpiry: Date.now() + (duration * 1000), // Expiration de la session complète
          rememberMe: user.rememberMe,
          };
        }
      
        // Vérification de l'expiration de la session complète
        if (token.sessionExpiry && Date.now() > token.sessionExpiry) {
          console.log('Session expired, user must login again');
          return { ...token, error: 'SessionExpired' };
        }
      
        // Vérification de l'expiration du token JWT d'accès
        if (token.exp && Math.floor(Date.now() / 1000) < token.exp) {
          return token; // Le token JWT est toujours valide
        }        
      
        // Le token JWT a expiré, essayons de le rafraîchir
  console.log('Token expired, attempting to refresh...');
  try {
    const response = await axios.post(`${API_URL}/token/refresh/`, {
      refresh: token.refreshToken
    });

    // Décodage du nouveau token pour obtenir sa nouvelle date d'expiration
    const base64Payload = response.data.access.split('.')[1];
    const decodedPayload = JSON.parse(
      Buffer.from(base64Payload, 'base64').toString('utf-8')
    );
    
    // Mise à jour du token avec le nouveau token d'accès
    return {
      ...token,
      accessToken: response.data.access,
      // Utiliser l'expiration fournie par le token ou définir 1h par défaut
      exp: decodedPayload.exp || (Math.floor(Date.now() / 1000) + 60 * 60),
      // Conserve la date d'expiration de session existante
    };
  } catch (error) {
    console.error('Erreur lors du rafraîchissement du token:', error);
    return { ...token, error: 'RefreshAccessTokenError' };
  }
      },
      async session({ session, token }) {
        // Vérification de l'expiration de la session complète
        if (token.sessionExpiry && Date.now() > token.sessionExpiry) {
          throw new Error('Session expired');
        }
        
        if (session.user) {
          session.user.id = token.id as string;
          session.user.name = token.name as string;
          session.user.email = token.email as string;
          session.user.role = token.role as 'user' | 'organizer' | 'admin';
        }
        
        session.accessToken = token.accessToken as string;
        // refreshToken removed from session
        session.error = token.error as string | undefined;
        session.rememberMe = token.rememberMe as boolean;
        
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
      // maxAge sera défini dynamiquement en fonction de rememberMe
      maxAge: SESSION_DURATIONS.REMEMBER_ME, // Valeur maximale possible
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === 'development',
  };