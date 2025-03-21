// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  // Récupérer le token JWT
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET
  });
  
  // Création de l'URL de redirection de base
  const loginUrl = new URL('/login', request.url);
  const homeUrl = new URL('/', request.url);
  
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
      return NextResponse.redirect(homeUrl);
    }
  }
  
  // Protection des routes d'administration
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Vérifier si l'utilisateur est authentifié et a le rôle d'admin
    if (!token || token.role !== 'admin') {
      return NextResponse.redirect(homeUrl);
    }
  }
  
  // Rediriger les utilisateurs déjà connectés depuis les pages d'auth
  if ((request.nextUrl.pathname.startsWith('/login') || 
       request.nextUrl.pathname.startsWith('/register')) && token) {
    // Trouver le paramètre de redirection ou rediriger vers l'accueil
    const redirectParam = request.nextUrl.searchParams.get('redirect');
    const redirectUrl = redirectParam ? new URL(redirectParam, request.url) : homeUrl;
    return NextResponse.redirect(redirectUrl);
  }
  
  return NextResponse.next();
}

// Configuration des chemins à protéger
export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/admin/:path*',
    '/login',
    '/register',
    '/register-organizer'
  ],
};