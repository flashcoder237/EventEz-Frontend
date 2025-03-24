'use client';

import { useState,useEffect  } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { FaExclamationCircle, FaArrowLeft, FaUser, FaEnvelope, FaLock, FaPhone, FaBuilding, FaIdCard } from 'react-icons/fa';
import { authAPI } from '@/lib/api';
import { signIn, useSession } from 'next-auth/react';

export default function RegisterOrganizerPage() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: false,
    onUnauthenticated() {
      // C'est normal d'être non authentifié sur la page de connexion
    },
  });

  // Rediriger si déjà connecté
  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.push('/');
    }
  }, [session, status, router]);
  
  const [organizerType, setOrganizerType] = useState<'individual' | 'organization'>('individual');
  const [currentStep, setCurrentStep] = useState(1);
  
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
      ...(value === 'individual' ? { company_name: '', registration_number: '' } : {})
    }));
  };

  const validateStep1 = () => {
    if (organizerType === 'individual') {
      if (!formData.first_name || !formData.last_name || !formData.phone_number) {
        setError('Veuillez remplir tous les champs obligatoires de cette étape');
        return false;
      }
    } else {
      if (!formData.company_name || !formData.registration_number || !formData.phone_number) {
        setError('Veuillez remplir tous les champs obligatoires de cette étape');
        return false;
      }
    }
    return true;
  };
  
  const nextStep = () => {
    if (validateStep1()) {
      setError(null);
      setCurrentStep(2);
    }
  };
  
  const prevStep = () => {
    setError(null);
    setCurrentStep(1);
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
          </Link>
          
          <div className="mt-16">
            <h1 className="text-3xl font-bold mb-4">Devenez organisateur d'événements</h1>
            <p className="text-primary-200 text-lg">
              Créez, gérez et promouvez vos événements sur la première plateforme d'événementiel au Cameroun.
            </p>
            
            <div className="mt-8 space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-primary-500 p-1 rounded-full mt-1">
                  <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-3 text-primary-100">Créez des événements en quelques clics</p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-primary-500 p-1 rounded-full mt-1">
                  <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-3 text-primary-100">Recevez des paiements sécurisés</p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-primary-500 p-1 rounded-full mt-1">
                  <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-3 text-primary-100">Accédez à des outils d'analyse et de reporting</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="rounded-xl bg-white/10 backdrop-blur-sm p-6 mt-12">
          <p className="italic text-primary-100 mb-4">
            "Depuis que j'utilise EventEz, mes événements sont toujours complets. La plateforme me permet de toucher un public beaucoup plus large."
          </p>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-primary-300 mr-3 overflow-hidden">
              <Image
                src="/images/cover-register.jpg"
                alt="EventEz Logo"
                width={60}
                height={60}
                className="h-auto w-20"
              />
            </div>
            <div>
              <p className="font-bold">Cédric TEFOYE</p>
              <p className="text-primary-200 text-sm">Organisateur depuis 2025</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right panel with form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50 p-4 md:p-12 mt-15">
        <div className="w-full max-w-lg">
          {/* Mobile logo */}
          <div className="md:hidden flex justify-center mb-8">
            <Link href="/" className="flex items-center">
              <div className="p-2 rounded-lg mr-2">
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
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {currentStep === 1 ? 'Créez votre compte organisateur' : 'Finalisez votre inscription'}
              </h2>
              <p className="mt-2 text-gray-600">
                Créez et gérez des événements sur notre plateforme
              </p>
              
              {/* Progress indicator */}
              <div className="flex items-center justify-center mt-6">
                <div className={`w-3 h-3 rounded-full ${currentStep >= 1 ? 'bg-gradient-to-r from-[#6d28d9] to-[#6d28d9]' : 'bg-gray-300'}`}></div>
                <div className={`w-12 h-1 ${currentStep >= 2 ? 'bg-gradient-to-r from-[#6d28d9] to-[#ec4899]' : 'bg-gray-300'}`}></div>
                <div className={`w-3 h-3 rounded-full ${currentStep >= 2 ? 'bg-gradient-to-r from-[#ec4899] to-[#ec4899]' : 'bg-gray-300'}`}></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1 px-2">
                <span>Informations</span>
                <span>Compte</span>
              </div>
            </div>
            
            <Tabs value={organizerType} onValueChange={(v) => handleTabChange(v as 'individual' | 'organization')} className="mt-6">
              <TabsList className="grid grid-cols-2 mb-6 bg-gray-100 p-1 rounded-lg">
                <TabsTrigger value="individual" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-primary-sm data-[state=active]:text-primary-700">
                  Individuel
                </TabsTrigger>
                <TabsTrigger value="organization" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-primary-sm data-[state=active]:text-primary-700">
                  Organisation
                </TabsTrigger>
              </TabsList>
              
              <form onSubmit={currentStep === 2 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-3 flex items-center text-sm">
                    <FaExclamationCircle className="mr-2 flex-shrink-0" />
                    {error}
                  </div>
                )}
                
                {currentStep === 1 && (
                  <>
                    <TabsContent value="individual" className="space-y-4 mt-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Prénom *"
                          type="text"
                          name="first_name"
                          placeholder="Jean"
                          value={formData.first_name}
                          onChange={handleChange}
                          icon={<FaUser className="text-gray-400" />}
                          required
                        />
                        
                        <Input
                          label="Nom *"
                          type="text"
                          name="last_name"
                          placeholder="Dupont"
                          value={formData.last_name}
                          onChange={handleChange}
                          icon={<FaUser className="text-gray-400" />}
                          required
                        />
                      </div>
                      
                      <Input
                        label="Téléphone *"
                        type="tel"
                        name="phone_number"
                        placeholder="+237 6XX XXX XXX"
                        value={formData.phone_number}
                        onChange={handleChange}
                        icon={<FaPhone className="text-gray-400" />}
                        required
                      />
                    </TabsContent>
                    
                    <TabsContent value="organization" className="space-y-4 mt-0">
                      <Input
                        label="Nom de l'organisation *"
                        type="text"
                        name="company_name"
                        placeholder="Acme Inc."
                        value={formData.company_name}
                        onChange={handleChange}
                        icon={<FaBuilding className="text-gray-400" />}
                        required={formData.organizer_type === 'organization'}
                      />
                      
                      <Input
                        label="Numéro d'enregistrement *"
                        type="text"
                        name="registration_number"
                        placeholder="RC/AB/2023/B/123"
                        value={formData.registration_number}
                        onChange={handleChange}
                        icon={<FaIdCard className="text-gray-400" />}
                        required={formData.organizer_type === 'organization'}
                      />
                      
                      <Input
                        label="Téléphone *"
                        type="tel"
                        name="phone_number"
                        placeholder="+237 6XX XXX XXX"
                        value={formData.phone_number}
                        onChange={handleChange}
                        icon={<FaPhone className="text-gray-400" />}
                        required
                      />
                    </TabsContent>
                    
                    <div className="mt-6">
                      <Button 
                        type="submit" 
                        className="w-full text-white bg-gradient-to-r from-[#6d28d9] to-[#ec4899]"
                      >
                        Continuer
                      </Button>
                    </div>
                  </>
                )}
                
                {currentStep === 2 && (
                  <>
                    <Input
                      label="Nom d'utilisateur *"
                      type="text"
                      name="username"
                      placeholder="jeandupont"
                      value={formData.username}
                      onChange={handleChange}
                      icon={<FaUser className="text-gray-400" />}
                      required
                    />
                    
                    <Input
                      label="Email *"
                      type="email"
                      name="email"
                      placeholder="jean.dupont@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      icon={<FaEnvelope className="text-gray-400" />}
                      required
                    />
                    
                    <Input
                      label="Mot de passe *"
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      icon={<FaLock className="text-gray-400" />}
                      required
                    />
                    
                    <Input
                      label="Confirmer le mot de passe *"
                      type="password"
                      name="confirm_password"
                      placeholder="••••••••"
                      value={formData.confirm_password}
                      onChange={handleChange}
                      icon={<FaLock className="text-gray-400" />}
                      required
                    />
                    
                    <div className="p-4 bg-primary-50 border border-primary-100 text-primary-800 rounded-md text-sm mt-6">
                      <p className="flex items-start">
                        <svg className="h-5 w-5 text-primary-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        En vous inscrivant en tant qu'organisateur, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
                      </p>
                      <p className="mt-2 ml-7">
                        Votre compte devra être vérifié avant de pouvoir créer des événements publics.
                      </p>
                    </div>
                    
                    <div className="flex space-x-4 mt-6">
                      <Button 
                        type="button" 
                        variant="outline"
                        className="flex-1 flex items-center justify-center"
                        onClick={prevStep}
                      >
                        <FaArrowLeft className="mr-2" /> Retour
                      </Button>
                      
                      <Button 
                        type="submit" 
                        className="flex-1 bg-gradient-to-r from-[#6d28d9] to-[#ec4899] text-white" 
                        disabled={isLoading}
                      >
                        {isLoading ? 'Inscription en cours...' : 'S\'inscrire'}
                      </Button>
                    </div>
                  </>
                )}
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
    </div>
  );
}
