'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { 
  FaExclamationCircle, 
  FaArrowLeft, 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaPhone, 
  FaBuilding, 
  FaIdCard
} from 'react-icons/fa';
import { authAPI } from '@/lib/api';
import { signIn, useSession } from 'next-auth/react';
import { motion } from 'framer-motion';

export default function RegisterOrganizerPage() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: false,
    onUnauthenticated() {
      // Normal d'être non authentifié sur la page d'inscription
    },
  });

  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.push('/');
    }
  }, [session, status, router]);
  
  const [organizerType, setOrganizerType] = useState('individual');
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    organizer_type: 'individual',
    company_name: '',
    registration_number: ''
  });
  
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleTabChange = (value) => {
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
        setError('Veuillez remplir tous les champs obligatoires');
        return false;
      }
    } else {
      if (!formData.company_name || !formData.registration_number || !formData.phone_number) {
        setError('Veuillez remplir tous les champs obligatoires');
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
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
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
      await authAPI.registerOrganizer(formData);
      
      await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password
      });
      
      router.push('/dashboard');
    } catch (error) {
      if (error.response?.data) {
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

  const benefits = [
    "Gestion intégrée des billets", 
    "Paiements sécurisés", 
    "Statistiques en temps réel"
  ];
  
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar branding - visible sur desktop */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-800"></div>
        <div className="absolute inset-0 opacity-10 mix-blend-overlay" 
             style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")'}}></div>
        
        <div className="relative h-full flex flex-col justify-between p-12 z-10">
          <Link href="/" className="flex items-center">
            <div className="bg-white/90 p-3 rounded-xl shadow-md">
              <Image
                src="/images/logo.png"
                alt="EventEz Logo"
                width={100}
                height={40}
                className="h-8 w-auto"
              />
            </div>
          </Link>
          
          <div className="my-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-md"
            >
              <h1 className="text-5xl font-bold text-white leading-tight">
                Créez & gérez vos événements en toute simplicité
              </h1>
              <p className="text-violet-100 mt-6 text-lg leading-relaxed">
                Rejoignez les milliers d'organisateurs qui utilisent notre plateforme pour propulser leurs événements au Cameroun.
              </p>
              
              <ul className="mt-12 space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + (index * 0.1), duration: 0.4 }}
                    className="flex items-center space-x-3"
                  >
                    <span className="flex-shrink-0 h-6 w-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-white/90 text-lg">{benefit}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
          
          <div className="mt-auto max-w-md">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
            >
              <p className="text-white/90 italic leading-relaxed mb-4">
                "Cette plateforme a simplifié notre gestion d'événements et augmenté nos conversions de plus de 40%. Interface intuitive et support client rapide."
              </p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="font-medium text-white">CT</span>
                </div>
                <div className="ml-3">
                  <h4 className="font-medium text-white">Cédric Tefoye</h4>
                  <p className="text-white/70 text-sm">Festival Douala Art, 2025</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Form area */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile logo */}
          <div className="mb-10 flex justify-center lg:hidden">
            <Link href="/" className="inline-flex items-center">
              <div className="bg-violet-600 p-2 rounded-lg">
                <Image
                  src="/images/logo-icon.png"
                  alt="EventEz Logo"
                  width={32}
                  height={32}
                  className="h-8 w-8"
                />
              </div>
              <span className="ml-3 text-xl font-semibold text-violet-900">
                EventEz
              </span>
            </Link>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                {currentStep === 1 ? 'Créez votre compte' : 'Finalisez votre inscription'}
              </h2>
              <p className="mt-2 text-gray-600">
                {currentStep === 1 ? 'Commençons avec vos informations' : 'Créez vos identifiants de connexion'}
              </p>
            </div>
            
            {/* Progress bar */}
            <div className="mb-8">
              <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: "50%" }}
                  animate={{ width: currentStep === 1 ? "50%" : "100%" }}
                  transition={{ duration: 0.3 }}
                  className="h-full bg-violet-600"
                />
              </div>
              <div className="flex justify-between mt-2">
                <div className="text-sm text-gray-600">Informations</div>
                <div className="text-sm text-gray-600">Compte</div>
              </div>
            </div>
            
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-lg bg-red-50 border-l-4 border-red-500"
              >
                <div className="flex">
                  <FaExclamationCircle className="h-5 w-5 text-red-500" />
                  <p className="ml-3 text-sm text-red-700">{error}</p>
                </div>
              </motion.div>
            )}
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: currentStep === 1 ? -10 : 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {currentStep === 1 && (
                  <>
                    <Tabs 
                      value={organizerType} 
                      onValueChange={handleTabChange}
                      className="mt-2"
                    >
                      <TabsList className="grid grid-cols-2 mb-6 bg-gray-100 p-1 rounded-lg">
                        <TabsTrigger value="individual" className="rounded-md py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-violet-700">
                          Individuel
                        </TabsTrigger>
                        <TabsTrigger value="organization" className="rounded-md py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-violet-700">
                          Organisation
                        </TabsTrigger>
                      </TabsList>
                      
                      <form onSubmit={(e) => { e.preventDefault(); nextStep(); }} className="space-y-5">
                        <TabsContent value="individual" className="space-y-5 mt-0 animate-in">
                          <div className="grid grid-cols-2 gap-4">
                            <Input
                              label="Prénom"
                              type="text"
                              name="first_name"
                              placeholder="Jean"
                              value={formData.first_name}
                              onChange={handleChange}
                              icon={<FaUser className="text-gray-400" />}
                              required
                              className="bg-gray-50 focus:border-violet-500 focus:ring-violet-500"
                            />
                            
                            <Input
                              label="Nom"
                              type="text"
                              name="last_name"
                              placeholder="Dupont"
                              value={formData.last_name}
                              onChange={handleChange}
                              icon={<FaUser className="text-gray-400" />}
                              required
                              className="bg-gray-50 focus:border-violet-500 focus:ring-violet-500"
                            />
                          </div>
                          
                          <Input
                            label="Téléphone"
                            type="tel"
                            name="phone_number"
                            placeholder="+237 6XX XXX XXX"
                            value={formData.phone_number}
                            onChange={handleChange}
                            icon={<FaPhone className="text-gray-400" />}
                            required
                            className="bg-gray-50 focus:border-violet-500 focus:ring-violet-500"
                          />
                        </TabsContent>
                        
                        <TabsContent value="organization" className="space-y-5 mt-0 animate-in">
                          <Input
                            label="Nom de l'organisation"
                            type="text"
                            name="company_name"
                            placeholder="Acme Inc."
                            value={formData.company_name}
                            onChange={handleChange}
                            icon={<FaBuilding className="text-gray-400" />}
                            required={formData.organizer_type === 'organization'}
                            className="bg-gray-50 focus:border-violet-500 focus:ring-violet-500"
                          />
                          
                          <Input
                            label="Numéro d'enregistrement"
                            type="text"
                            name="registration_number"
                            placeholder="RC/AB/2023/B/123"
                            value={formData.registration_number}
                            onChange={handleChange}
                            icon={<FaIdCard className="text-gray-400" />}
                            required={formData.organizer_type === 'organization'}
                            className="bg-gray-50 focus:border-violet-500 focus:ring-violet-500"
                          />
                          
                          <Input
                            label="Téléphone"
                            type="tel"
                            name="phone_number"
                            placeholder="+237 6XX XXX XXX"
                            value={formData.phone_number}
                            onChange={handleChange}
                            icon={<FaPhone className="text-gray-400" />}
                            required
                            className="bg-gray-50 focus:border-violet-500 focus:ring-violet-500"
                          />
                        </TabsContent>
                        
                        <button 
                          type="submit" 
                          className="w-full py-3 mt-4 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
                        >
                          Continuer
                        </button>
                      </form>
                    </Tabs>
                  </>
                )}
                
                {currentStep === 2 && (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <Input
                      label="Nom d'utilisateur"
                      type="text"
                      name="username"
                      placeholder="jeandupont"
                      value={formData.username}
                      onChange={handleChange}
                      icon={<FaUser className="text-gray-400" />}
                      required
                      className="bg-gray-50 focus:border-violet-500 focus:ring-violet-500"
                    />
                    
                    <Input
                      label="Email"
                      type="email"
                      name="email"
                      placeholder="jean.dupont@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      icon={<FaEnvelope className="text-gray-400" />}
                      required
                      className="bg-gray-50 focus:border-violet-500 focus:ring-violet-500"
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Mot de passe"
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        icon={<FaLock className="text-gray-400" />}
                        required
                        className="bg-gray-50 focus:border-violet-500 focus:ring-violet-500"
                      />
                      
                      <Input
                        label="Confirmer"
                        type="password"
                        name="confirm_password"
                        placeholder="••••••••"
                        value={formData.confirm_password}
                        onChange={handleChange}
                        icon={<FaLock className="text-gray-400" />}
                        required
                        className="bg-gray-50 focus:border-violet-500 focus:ring-violet-500"
                      />
                    </div>
                    
                    <div className="mt-4 p-4 bg-violet-50 rounded-lg border border-violet-100">
                      <p className="text-sm text-gray-700">
                        En vous inscrivant, vous acceptez nos <Link href="#" className="text-violet-700 hover:underline font-medium">conditions d'utilisation</Link> et notre <Link href="#" className="text-violet-700 hover:underline font-medium">politique de confidentialité</Link>.
                      </p>
                    </div>
                    
                    <div className="flex gap-4 mt-6">
                      <button 
                        type="button" 
                        onClick={prevStep}
                        className="flex-1 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 flex items-center justify-center"
                      >
                        <FaArrowLeft className="mr-2 h-4 w-4" />
                        Retour
                      </button>
                      
                      <button 
                        type="submit" 
                        disabled={isLoading}
                        className="flex-1 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:opacity-70"
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Traitement...
                          </div>
                        ) : "S'inscrire"}
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Vous avez déjà un compte ?{' '}
                <Link href="/login" className="font-medium text-violet-700 hover:text-violet-900">
                  Se connecter
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
        
        {/* Mobile testimonial */}
        <div className="lg:hidden mt-12 w-full max-w-md">
          <div className="p-5 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl border border-violet-100">
            <p className="text-gray-700 italic mb-3 text-sm">
              "Cette plateforme a considérablement simplifié notre organisation d'événements et augmenté nos conversions."
            </p>
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-violet-600 flex items-center justify-center">
                <span className="text-white font-medium text-sm">CT</span>
              </div>
              <div className="ml-3">
                <h4 className="font-medium text-gray-900">Cédric Tefoye</h4>
                <p className="text-gray-500 text-xs">Festival Douala Art, 2025</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}