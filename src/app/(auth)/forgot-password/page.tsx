'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { FaEnvelope, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';
import { authAPI } from '@/lib/api';

export default function ForgotPasswordPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Veuillez entrer votre adresse email');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Appel à l'API pour demander la réinitialisation du mot de passe
      await authAPI.requestPasswordReset(email);
      setSuccess(true);
    } catch (error: any) {
      if (error.response?.data) {
        const errorData = error.response.data;
        const errorMessages = Object.values(errorData).flat().join(', ');
        setError(errorMessages || 'Une erreur est survenue');
      } else {
        console.log(error);
        setError('Une erreur est survenue lors de la demande de réinitialisation');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
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
            <div className="p-2 rounded-lg mr-3">
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
            <h1 className="text-4xl font-bold mb-4 leading-tight">Mot de passe <span className="text-purple-300">oublié ?</span></h1>
            <p className="text-indigo-100 text-lg mt-6 max-w-md leading-relaxed">
              Pas d'inquiétude, nous vous aiderons à récupérer votre accès en quelques étapes simples.
            </p>
          </div>
        </div>
        
        <div className="mt-auto relative z-10">
          <div className="bg-indigo-800/70 backdrop-blur-sm rounded-xl p-6 border border-indigo-700/50 shadow-xl">
            <h3 className="text-lg font-semibold mb-3 text-white">Comment ça fonctionne</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="flex-shrink-0 bg-indigo-600 p-1.5 rounded-full mt-0.5 shadow-inner shadow-indigo-500/50">
                  <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="ml-3 text-indigo-100">Entrez votre email ci-contre</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 bg-indigo-600 p-1.5 rounded-full mt-0.5 shadow-inner shadow-indigo-500/50">
                  <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="ml-3 text-indigo-100">Recevez un lien de réinitialisation par email</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 bg-indigo-600 p-1.5 rounded-full mt-0.5 shadow-inner shadow-indigo-500/50">
                  <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="ml-3 text-indigo-100">Créez un nouveau mot de passe sécurisé</span>
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
              <h2 className="text-2xl font-bold text-gray-900">Réinitialisation du mot de passe</h2>
              <p className="mt-2 text-gray-600">
                Entrez votre email pour recevoir un lien de réinitialisation
              </p>
            </div>
            
            {!success ? (
              <form onSubmit={handleSubmit} className="space-y-6">
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
                    className="focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full text-white font-medium py-2.5 bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 transition shadow-lg" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
                </Button>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 text-green-700 rounded-md p-4 flex items-start text-sm">
                  <FaCheckCircle className="mr-3 flex-shrink-0 mt-0.5 text-green-500" />
                  <div>
                    <p className="font-medium">Demande envoyée avec succès</p>
                    <p className="mt-1">Si un compte est associé à l'adresse {email}, vous recevrez un email contenant un lien de réinitialisation du mot de passe.</p>
                  </div>
                </div>
                
                <Button 
                  type="button"
                  onClick={() => router.push('/login')}
                  className="w-full text-white font-medium py-2.5 bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 transition shadow-lg"
                >
                  Retour à la connexion
                </Button>
              </div>
            )}
            
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Vous vous souvenez de votre mot de passe ?{' '}
                <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-800 transition">
                  Se connecter
                </Link>
              </p>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Vous n'avez pas encore de compte ?{' '}
                <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-400 transition">
                  S'inscrire
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}