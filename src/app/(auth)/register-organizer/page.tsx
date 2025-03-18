// app/(auth)/register-organizer/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { FaExclamationCircle } from 'react-icons/fa';
import { authAPI } from '@/lib/api';

export default function RegisterOrganizerPage() {
  const router = useRouter();
  
  const [organizerType, setOrganizerType] = useState<'individual' | 'organization'>('individual');
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    organizer_type: 'individual' as 'individual' | 'organization',
    company_name: '',
    registration_number: ''
  });
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleTabChange = (value: 'individual' | 'organization') => {
    setOrganizerType(value);
    setFormData(prev => ({
      ...prev,
      organizer_type: value,
      // Réinitialiser les champs spécifiques à l'organisation si on passe à individuel
      ...(value === 'individual' ? { company_name: '', registration_number: '' } : {})
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
    
    // Validation spécifique pour les organisations
    if (formData.organizer_type === 'organization' && (!formData.company_name || !formData.registration_number)) {
      setError('Veuillez remplir les informations de l\'organisation');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Appel à l'API pour créer un compte organisateur
      await authAPI.registerOrganizer(formData);
      
      // Connexion automatique après inscription
      await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password
      });
      
      // Redirection vers le tableau de bord
      router.push('/dashboard/my-events');
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
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <Link href="/" className="text-3xl font-bold text-primary">EventEz</Link>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Devenir organisateur d'événements</h2>
            <p className="mt-2 text-gray-600">Créez et gérez des événements sur notre plateforme</p>
          </div>
          
          <Tabs value={organizerType} onValueChange={(v) => handleTabChange(v as 'individual' | 'organization')}>
            <TabsList className="grid grid-cols-2 mb-8">
              <TabsTrigger value="individual">Individuel</TabsTrigger>
              <TabsTrigger value="organization">Organisation</TabsTrigger>
            </TabsList>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-3 flex items-center text-sm">
                  <FaExclamationCircle className="mr-2 flex-shrink-0" />
                  {error}
                </div>
              )}
              
              <TabsContent value="individual" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Prénom *"
                    type="text"
                    name="first_name"
                    placeholder="Jean"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                  />
                  
                  <Input
                    label="Nom *"
                    type="text"
                    name="last_name"
                    placeholder="Dupont"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="organization" className="space-y-4">
                <Input
                  label="Nom de l'organisation *"
                  type="text"
                  name="company_name"
                  placeholder="Acme Inc."
                  value={formData.company_name}
                  onChange={handleChange}
                  required={formData.organizer_type === 'organization'}
                />
                
                <Input
                  label="Numéro d'enregistrement *"
                  type="text"
                  name="registration_number"
                  placeholder="RC/AB/2023/B/123"
                  value={formData.registration_number}
                  onChange={handleChange}
                  required={formData.organizer_type === 'organization'}
                />
              </TabsContent>
              
              {/* Champs communs aux deux types d'organisateurs */}
              <Input
                label="Nom d'utilisateur *"
                type="text"
                name="username"
                placeholder="jeandupont"
                value={formData.username}
                onChange={handleChange}
                required
              />
              
              <Input
                label="Email *"
                type="email"
                name="email"
                placeholder="jean.dupont@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
              
              <Input
                label="Téléphone *"
                type="tel"
                name="phone_number"
                placeholder="+237 6XX XXX XXX"
                value={formData.phone_number}
                onChange={handleChange}
                required
              />
              
              <Input
                label="Mot de passe *"
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
              
              <Input
                label="Confirmer le mot de passe *"
                type="password"
                name="confirm_password"
                placeholder="••••••••"
                value={formData.confirm_password}
                onChange={handleChange}
                required
              />
              
              <div className="p-4 bg-blue-50 text-blue-800 rounded-md text-sm">
                En vous inscrivant en tant qu'organisateur, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
                <br />
                Votre compte devra être vérifié avant de pouvoir créer des événements publics.
              </div>
              
              <div className="mt-6">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Inscription en cours...' : 'S\'inscrire en tant qu\'organisateur'}
                </Button>
              </div>
            </form>
          </Tabs>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Vous avez déjà un compte ?{' '}
              <Link href="/login" className="font-medium text-primary hover:text-primary-dark">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}