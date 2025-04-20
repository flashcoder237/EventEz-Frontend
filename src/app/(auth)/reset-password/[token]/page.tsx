'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { FaLock, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';
import { authAPI } from '@/lib/api';

interface ResetPasswordPageProps {
  params: Promise<{
    token: string;
  }>
}

export default function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  const router = useRouter();
  // Utiliser React.use pour déballer la Promise params
  const { token } = use(params);
  
  const [formData, setFormData] = useState({
    password: '',
    confirm_password: '',
  });
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  
  // Vérifier la validité du token au chargement de la page
  useEffect(() => {
    async function checkToken() {
      try {
        await authAPI.validateResetToken(token);
        setIsTokenValid(true);
      } catch (error) {
        setIsTokenValid(false);
      } finally {
        setIsChecking(false);
      }
    }
    
    checkToken();
  }, [token]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.password || !formData.confirm_password) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    
    if (formData.password !== formData.confirm_password) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    
    if (formData.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Appel à l'API pour réinitialiser le mot de passe
      await authAPI.resetPassword(token, formData.password);
      setSuccess(true);
    } catch (error: any) {
      if (error.response?.data) {
        const errorData = error.response.data;
        const errorMessages = Object.values(errorData).flat().join(', ');
        setError(errorMessages || 'Une erreur est survenue');
      } else {
        setError('Une erreur est survenue lors de la réinitialisation');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderContent = () => {
    if (isChecking) {
      return (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Vérification du lien de réinitialisation...</p>
        </div>
      );
    }
    
    if (isTokenValid === false) {
      return (
        <div className="space-y-6">
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-4 flex items-start text-sm">
            <FaExclamationCircle className="mr-3 flex-shrink-0 mt-0.5 text-red-500" />
            <div>
              <p className="font-medium">Lien de réinitialisation invalide ou expiré</p>
              <p className="mt-1">Ce lien n'est plus valide ou a expiré. Veuillez faire une nouvelle demande de réinitialisation de mot de passe.</p>
            </div>
          </div>
          
          <Button 
            type="button"
            onClick={() => router.push('/forgot-password')}
            className="w-full text-white font-medium py-2.5 bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 transition shadow-lg"
          >
            Nouvelle demande
          </Button>
        </div>
      );
    }
    
    if (success) {
      return (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-md p-4 flex items-start text-sm">
            <FaCheckCircle className="mr-3 flex-shrink-0 mt-0.5 text-green-500" />
            <div>
              <p className="font-medium">Mot de passe réinitialisé avec succès</p>
              <p className="mt-1">Votre mot de passe a été réinitialisé. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.</p>
            </div>
          </div>
          
          <Button 
            type="button"
            onClick={() => router.push('/login')}
            className="w-full text-white font-medium py-2.5 bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 transition shadow-lg"
          >
            Se connecter
          </Button>
        </div>
      );
    }
    
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-4 flex items-center text-sm">
            <FaExclamationCircle className="mr-3 flex-shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}
        
        <div className="space-y-5">
          <Input
            label="Nouveau mot de passe"
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            icon={<FaLock className="text-indigo-400" />}
            className="focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
          
          <Input
            label="Confirmer le nouveau mot de passe"
            type="password"
            name="confirm_password"
            placeholder="••••••••"
            value={formData.confirm_password}
            onChange={handleChange}
            icon={<FaLock className="text-indigo-400" />}
            className="focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
        
        <div className="text-sm text-gray-600 bg-indigo-50 border border-indigo-200 p-4 rounded-md">
          <p className="font-medium text-indigo-700">Conseils pour un mot de passe sécurisé :</p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-indigo-600/80">
            <li>Au moins 8 caractères</li>
            <li>Inclure au moins une lettre majuscule</li>
            <li>Inclure au moins un chiffre</li>
            <li>Inclure au moins un caractère spécial</li>
          </ul>
        </div>
        
        <Button 
          type="submit" 
          className="w-full text-white font-medium py-2.5 bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 transition shadow-lg" 
          disabled={isLoading}
        >
          {isLoading ? 'Réinitialisation en cours...' : 'Réinitialiser le mot de passe'}
        </Button>
      </form>
    );
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
            <h1 className="text-4xl font-bold mb-4 leading-tight">Créez un <span className="text-purple-300">nouveau</span> mot de passe</h1>
            <p className="text-indigo-100 text-lg mt-6 max-w-md leading-relaxed">
              Choisissez un mot de passe sécurisé pour protéger votre compte EventEz.
            </p>
          </div>
        </div>
        
        <div className="mt-auto relative z-10">
          <div className="bg-indigo-800/70 backdrop-blur-sm rounded-xl p-6 border border-indigo-700/50 shadow-xl">
            <h3 className="text-lg font-semibold mb-3 text-white">Pourquoi un mot de passe fort est important</h3>
            <p className="text-indigo-100 text-sm mb-4 leading-relaxed">
              Un mot de passe sécurisé est la première ligne de défense contre les accès non autorisés à votre compte. 
              Il protège vos informations personnelles et vos événements.
            </p>
            <div className="bg-indigo-900/50 p-4 rounded-md border border-indigo-800">
              <p className="text-xs italic text-indigo-100">
                "Un mot de passe fort est comme une bonne serrure sur la porte de votre maison numérique."
              </p>
            </div>
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
                Créez un nouveau mot de passe pour votre compte
              </p>
            </div>
            
            {renderContent()}
            
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Vous vous souvenez de votre mot de passe ?{' '}
                <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-800 transition">
                  Se connecter
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}