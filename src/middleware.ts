// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  // Routes publiques qui ne nécessitent pas d'authentification
  const publicRoutes = [
    '/',
    '/events',
    '/events/categories',
    '/about',
    '/contact'
  ];
  
  // Vérifier si la route actuelle est une route publique ou commence par /events/ (détail d'un événement)
  const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname) || 
                        request.nextUrl.pathname.startsWith('/events/') ||
                        request.nextUrl.pathname.startsWith('/api/events') ||
                        request.nextUrl.pathname.startsWith('/_next') ||
                        request.nextUrl.pathname.startsWith('/images');
  
  if (isPublicRoute) {
    return NextResponse.next();
  }
  
  // Pour les autres routes (qui nécessitent une authentification)
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET
  });
  
  const loginUrl = new URL('/login', request.url);
  
  // Ajouter le paramètre de redirection si nécessaire
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
  }
  
  // Protection des routes de tableau de bord
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    // Vérifier si l'utilisateur est authentifié
    if (!token) {
      return NextResponse.redirect(loginUrl);
    }
    
    // Vérifier les rôles autorisés
    if (token.role !== 'organizer' && token.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  // Routes pour l'authentification
  if ((request.nextUrl.pathname.startsWith('/login') || 
       request.nextUrl.pathname.startsWith('/register')) && token) {
    const redirectParam = request.nextUrl.searchParams.get('redirect');
    return NextResponse.redirect(new URL(redirectParam || '/', request.url));
  }
  
  return NextResponse.next();
}

// Configuration des chemins à protéger
export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};