// app/(auth)/login/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { FaEnvelope, FaLock, FaExclamationCircle, FaGoogle, FaFacebookF } from 'react-icons/fa';
import { setCookie, getCookie } from 'cookies-next';

export default function LoginPage() {
  const { data: session, status } = useSession({
    required: false,
    onUnauthenticated() {
      // C'est normal d'être non authentifié sur la page de connexion
    },
  });  
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('redirect') || '/';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  // Chargez les informations enregistrées au chargement de la page
  useEffect(() => {
    const savedEmail = localStorage.getItem('eventez_email');
    const savedRememberMe = localStorage.getItem('eventez_remember_me') === 'true';
    
    if (savedEmail) {
      setEmail(savedEmail);
    }
    
    setRememberMe(savedRememberMe);
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    // Enregistrez l'email et l'option "se souvenir de moi" si activée
    if (rememberMe) {
      localStorage.setItem('eventez_email', email);
      localStorage.setItem('eventez_remember_me', 'true');
      
      // Créer un cookie pour la session persistante
      setCookie('eventez_session', 'true', { 
        maxAge: 30 * 24 * 60 * 60, // 30 jours en secondes
        path: '/' 
      });
    } else {
      // Supprimez les données enregistrées si l'option n'est pas cochée
      localStorage.removeItem('eventez_email');
      localStorage.removeItem('eventez_remember_me');
      setCookie('eventez_session', '', { maxAge: 0, path: '/' });
    }
    
    try {
      // Ajout du paramètre rememberMe pour NextAuth
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
        callbackUrl,
        rememberMe: rememberMe.toString(),
      });
      
      if (result?.error) {
        setError('Identifiants invalides');
      } else {
        router.push(callbackUrl);
      }
    } catch (error) {
      setError('Une erreur est survenue lors de la connexion');
    } finally {
      setIsLoading(false);
    }
  };

  // Rediriger si déjà connecté
  useEffect(() => {
    // Vérifiez si l'utilisateur a choisi "se souvenir de moi" précédemment
    const hasSavedSession = getCookie('eventez_session') === 'true';
    
    if (status === 'authenticated' && session) {
      // Utiliser le callbackUrl au lieu de rediriger systématiquement vers la page d'accueil
      router.push(callbackUrl);
    } else if (hasSavedSession && status === 'unauthenticated') {
      // Si l'utilisateur a choisi "se souvenir de moi" mais n'est pas connecté,
      // vous pourriez simplement indiquer visuellement que les identifiants sont pré-remplis
      const savedEmail = localStorage.getItem('eventez_email');
      if (savedEmail) {
        // Email déjà chargé dans le state
      }
    }
  }, [session, status, router, callbackUrl]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left panel with background and illustration */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-900 to-indigo-700 p-12 text-white flex-col justify-between relative overflow-hidden">
        {/* Decorative shapes */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white"></div>
          <div className="absolute bottom-20 right-10 w-60 h-60 rounded-full bg-indigo-500"></div>
          <div className="absolute top-1/2 left-1/3 w-20 h-20 rounded-full bg-indigo-300"></div>
        </div>
        
        <div className="relative z-10">
          <Link href="/" className="flex items-center">
            <div className=" p-2 rounded-lg mr-3">
              <Image
                src="/images/logo-bg.png"
                alt="EventEz Logo"
                width={400}
                height={60}
                className="h-16 w-auto"
              />
            </div>
          </Link>
          
          <div className="mt-12">
            <h1 className="text-4xl font-bold mb-4 leading-tight">Bienvenue sur <span className="text-purple-300">EventEz</span></h1>
            <p className="text-indigo-100 text-lg mt-6 max-w-md leading-relaxed">
              Découvrez, réservez et participez à des événements exceptionnels en quelques clics.
            </p>
          </div>
        </div>
        
        <div className="mt-auto relative z-10">
          <div className="bg-indigo-800/70 backdrop-blur-sm rounded-xl p-6 border border-indigo-700/50 shadow-xl">
            <h3 className="text-lg font-semibold mb-3 text-white">Découvrez nos fonctionnalités</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="flex-shrink-0 bg-indigo-600 p-1.5 rounded-full mt-0.5 shadow-inner shadow-indigo-500/50">
                  <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="ml-3 text-indigo-100">Découvrir des événements à proximité</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 bg-indigo-600 p-1.5 rounded-full mt-0.5 shadow-inner shadow-indigo-500/50">
                  <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="ml-3 text-indigo-100">S'inscrire et payer en toute sécurité</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 bg-indigo-600 p-1.5 rounded-full mt-0.5 shadow-inner shadow-indigo-500/50">
                  <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="ml-3 text-indigo-100">Gérer vos billets et inscriptions</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Right panel with form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50 p-4 md:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="md:hidden flex justify-center mb-1">
            <Link href="/" className="flex items-center">
              <div className="py-8">
                <Image
                  src="/images/logo.png"
                  alt="EventEz Logo"
                  width={400}
                  height={400}
                  className="h-10 w-auto"
                />
              </div>
            </Link>
          </div>
          
          <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Connexion</h2>
              <p className="mt-2 text-gray-600">
                Entrez vos identifiants pour accéder à votre compte
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6" autoComplete="on">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-4 flex items-center text-sm">
                  <FaExclamationCircle className="mr-3 flex-shrink-0 text-red-500" />
                  <span>{error}</span>
                </div>
              )}
              
              <div className="space-y-5">
                <Input
                  label="Email"
                  type="email"
                  name="email" 
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={<FaEnvelope className="text-indigo-400" />}
                  required
                  autoComplete="username email"
                  className="focus:border-indigo-500 focus:ring-indigo-500"
                />
                
                <Input
                  label="Mot de passe"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<FaLock className="text-indigo-400" />}
                  required
                  autoComplete="current-password"
                  className="focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              
              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Se souvenir de moi
                  </label>
                </div>
                
                <Link href="/forgot-password" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition">
                  Mot de passe oublié ?
                </Link>
              </div>
              
              <Button 
                type="submit" 
                className="w-full text-white font-medium py-2.5 bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 transition shadow-lg" 
                disabled={isLoading}
              >
                {isLoading ? 'Connexion en cours...' : 'Se connecter'}
              </Button>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-gray-500">Ou continuer avec</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className="flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
                >
                  <FaGoogle className="h-5 w-5 mr-2 text-red-500" />
                  Google
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
                >
                  <FaFacebookF className="h-5 w-5 mr-2 text-indigo-600" />
                  Facebook
                </button>
              </div>
            </form>
            
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Vous n'avez pas de compte ?{' '}
                <Link href="/register-organizer" className="font-medium text-indigo-600 hover:text-indigo-800 transition">
                  S'inscrire
                </Link>
              </p>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Vous êtes un organisateur ?{' '}
                <Link href="/register-organizer" className="font-medium text-indigo-600 hover:text-indigo-800 transition">
                  S'inscrire en tant qu'organisateur
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}