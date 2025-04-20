// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  // Récupérer le token d'authentification
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET
  });

  // Routes publiques qui ne nécessitent pas d'authentification
  const publicRoutes = [
    '/',
    '/events',
    '/events/categories',
    '/about',
    '/contact',
    '/login',
    '/register-organizer'
  ];
  
  // Déterminer si c'est une route publique
  const isPublicRoute = 
    publicRoutes.includes(request.nextUrl.pathname) || 
    request.nextUrl.pathname.match(/^\/events\/[^\/]+$/) || // Page de détail d'un événement
    request.nextUrl.pathname.startsWith('/api/public') ||
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/images');

  // Les routes de type /events/{id}/register nécessitent une authentification
  const isProtectedEventRoute = request.nextUrl.pathname.match(/^\/events\/[^\/]+\/register/);
  
  // Gestion des routes d'authentification (login/register)
  if ((request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register') && token) {
    // L'utilisateur est déjà connecté, vérifiez s'il y a un paramètre de redirection
    const redirectUrl = request.nextUrl.searchParams.get('redirect');
    if (redirectUrl) {
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
    // Sinon, redirigez vers la page d'accueil
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // Si c'est une route publique et non protégée, on laisse passer
  if (isPublicRoute && !isProtectedEventRoute) {
    return NextResponse.next();
  }
  
  // Si c'est une route protégée d'événement ou du tableau de bord et que l'utilisateur n'est pas connecté
  if ((isProtectedEventRoute || request.nextUrl.pathname.startsWith('/dashboard')) && !token) {
    // Créer l'URL de redirection vers la page de connexion avec le paramètre de redirection
    const loginUrl = new URL('/login', request.url);
    // Ajouter le chemin complet actuel comme paramètre de redirection
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }
  
  // Liste des chemins qui nécessitent un rôle d'organisateur
  const ORGANIZER_PATHS = [
    '/dashboard/events/create',
    '/dashboard/payments',
    '/dashboard/analytics',
    '/dashboard/messages',
  ];
  
  // Vérifier si le chemin nécessite un rôle d'organisateur
  const requiresOrganizer = ORGANIZER_PATHS.some(orgPath => request.nextUrl.pathname.startsWith(orgPath));
  
  // Pour les routes du tableau de bord qui nécessitent un rôle d'organisateur
  if (requiresOrganizer && token) {
    if (token.role !== 'organizer' && token.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard/become-organizer', request.url));
    }
  }
  
  // Autoriser l'accès pour toutes les autres situations
  return NextResponse.next();
}

// Configuration des chemins à protéger
export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};