'use client';


import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaExclamationCircle, FaArrowLeft } from 'react-icons/fa';
import { authAPI } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: '',
    first_name: '',
    last_name: '',
    phone_number: ''
  });
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation de base
    if (!formData.username || !formData.email || !formData.password || !formData.confirm_password) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    if (formData.password !== formData.confirm_password) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Appel à l'API pour créer un compte
      await authAPI.register(formData);
      
      // Connexion automatique après inscription
      await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password
      });
      
      // Redirection vers la page d'accueil
      router.push('/');
    } catch (error: any) {
      if (error.response?.data) {
        // Afficher les erreurs de validation renvoyées par l'API
        const errorData = error.response.data;
        const errorMessages = Object.values(errorData).flat().join(', ');
        setError(errorMessages || 'Une erreur est survenue lors de l\'inscription');
      } else {
        setError('Une erreur est survenue lors de l\'inscription');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <Link href="/" className="text-3xl font-bold text-primary">EventEz</Link>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Créer un compte</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-3 flex items-center text-sm">
                <FaExclamationCircle className="mr-2 flex-shrink-0" />
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Prénom"
                type="text"
                name="first_name"
                placeholder="Jean"
                value={formData.first_name}
                onChange={handleChange}
              />
              
              <Input
                label="Nom"
                type="text"
                name="last_name"
                placeholder="Dupont"
                value={formData.last_name}
                onChange={handleChange}
              />
            </div>
            
            <Input
              label="Nom d'utilisateur"
              type="text"
              name="username"
              placeholder="jeandupont"
              value={formData.username}
              onChange={handleChange}
              required
            />
            
            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="jean.dupont@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
            
            <Input
              label="Téléphone"
              type="tel"
              name="phone_number"
              placeholder="+237 6XX XXX XXX"
              value={formData.phone_number}
              onChange={handleChange}
            />
            
            <Input
              label="Mot de passe"
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
            
            <Input
              label="Confirmer le mot de passe"
              type="password"
              name="confirm_password"
              placeholder="••••••••"
              value={formData.confirm_password}
              onChange={handleChange}
              required
            />
            
            <div className="mt-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Inscription en cours...' : 'S\'inscrire'}
              </Button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Vous avez déjà un compte ?{' '}
              <Link href="/login" className="font-medium text-primary hover:text-primary-dark">
                Se connecter
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
  );
}
