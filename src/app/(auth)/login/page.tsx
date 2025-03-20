// app/(auth)/login/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { FaEnvelope, FaLock, FaExclamationCircle } from 'react-icons/fa';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('redirect') || '/';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
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
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left panel with background and illustration */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#6d28d9] to-[#ec4899] p-12 text-white flex-col justify-between">
        <div>
          <Link href="/" className="flex items-center">
            <div className="bg-white p-2 rounded-lg mr-3">
            <Image
                src="/images/logo.png"
                alt="EventEz Logo"
                width={400}
                height={60}
                className="h-8 w-auto"
              />
            </div>
            {/* <span className="text-2xl font-bold text-white">EventEz</span> */}
          </Link>
          
          <div className="mt-10">
            <h1 className="text-3xl font-bold mb-4">Bienvenue sur EventEz</h1>
            <p className="text-primary-200 text-lg">
              Connectez-vous pour découvrir et participer à des événements exceptionnels.
            </p>
          </div>
        </div>
        
        <div className="mt-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-3">Découvrez nos fonctionnalités</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="flex-shrink-0 bg-white/20 p-1 rounded-full mt-1">
                  <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="ml-2 text-sm">Découvrir des événements à proximité</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 bg-white/20 p-1 rounded-full mt-1">
                  <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="ml-2 text-sm">S'inscrire et payer en toute sécurité</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 bg-white/20 p-1 rounded-full mt-1">
                  <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="ml-2 text-sm">Gérer vos billets et inscriptions</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Right panel with form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50 p-4 md:p-12 mt-15">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="md:hidden flex justify-center mb-8">
            <Link href="/" className="flex items-center">
              <div className="bg-gradient-to-r from-[#6d28d9] to-[#ec4899] p-2 rounded-lg mr-2 ">
              <Image
                  src="/images/logo-icon.png"
                  alt="EventEz Logo"
                  width={50}
                  height={50}
                  className="h-auto w-auto"
                />
              </div>
              <span className="text-4xl font-bold bg-gradient-to-r from-[#6d28d9] to-[#ec4899] text-transparent bg-clip-text">
                EventEz
              </span>
            </Link>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Connexion</h2>
              <p className="mt-2 text-gray-600">
                Entrez vos identifiants pour accéder à votre compte
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-3 flex items-center text-sm">
                  <FaExclamationCircle className="mr-2 flex-shrink-0" />
                  {error}
                </div>
              )}
              
              <div className="space-y-4">
                <Input
                  label="Email"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={<FaEnvelope className="text-gray-400" />}
                  required
                />
                
                <Input
                  label="Mot de passe"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<FaLock className="text-gray-400" />}
                  required
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Se souvenir de moi
                  </label>
                </div>
                
                <Link href="/forgot-password" className="text-sm font-medium text-primary hover:text-primary-dark">
                  Mot de passe oublié ?
                </Link>
              </div>
              
              <Button 
                type="submit" 
                className="text-white w-full bg-gradient-to-r from-[#6d28d9] to-[#ec4899]" 
                disabled={isLoading}
              >
                {isLoading ? 'Connexion en cours...' : 'Se connecter'}
              </Button>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Ou continuer avec</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                  <div className="flex items-center justify-center">
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="#EA4335"
                        d="M12 5c1.6 0 3 .5 4.1 1.4l3.1-3C17.1 1.6 14.7 0 12 0 7.4 0 3.6 2.6 1.4 6.3l3.6 2.8C6.2 6.6 8.9 5 12 5z"
                      />
                      <path
                        fill="#4285F4"
                        d="M23.5 12.3c0-.8-.1-1.7-.2-2.5H12v4.8h6.5c-.3 1.4-1.1 2.7-2.3 3.5l3.5 2.7c2.1-1.9 3.3-4.7 3.3-8.5z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5 13.2c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2l-3.6-2.8C.6 8 0 9.9 0 12s.6 4 1.4 5.6l3.6-2.8z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.2 0 5.9-1 7.8-2.8l-3.5-2.7c-1 .7-2.3 1-3.8 1-3.1 0-5.8-1.6-6.9-4.2L1.4 18c2.2 3.7 6 6 10.6 6z"
                      />
                    </svg>
                    Google
                  </div>
                </button>
                <button
                  type="button"
                  className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                  <div className="flex items-center justify-center">
                    <svg className="h-5 w-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                      <path
                        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                      />
                    </svg>
                    Facebook
                  </div>
                </button>
              </div>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Vous n'avez pas de compte ?{' '}
                <Link href="/register" className="font-medium text-primary hover:text-primary-dark">
                  S'inscrire
                </Link>
              </p>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Vous êtes un organisateur ?{' '}
                <Link href="/register-organizer" className="font-medium text-primary hover:text-primary-dark">
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