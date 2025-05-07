'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Save, 
  X, 
  Camera,
  AlertCircle,
  CheckCircle,
  Lock,
  Globe,
  Building,
  FileText,
  ChevronDown
} from 'lucide-react';
import { usersAPI } from '@/lib/api';

export default function ProfileFormModern() {
  const { data: session, update: updateSession } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeSection, setActiveSection] = useState<string>('personal');

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    address: '',
    city: '',
    country: '',
    date_of_birth: '',
    bio: '',
    profile_image: null as File | null,
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user) return;
      setLoading(true);
      try {
        const response = await usersAPI.getUserProfile();
        const userData = response.data;
        setFormData({
          ...formData,
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          email: userData.email || session.user.email || '',
          phone_number: userData.phone_number || '',
          address: userData.address || '',
          city: userData.city || '',
          country: userData.country || 'Cameroun',
          date_of_birth: userData.date_of_birth || '',
          bio: userData.bio || '',
        });
        if (userData.profile_image) {
          setImagePreview(userData.profile_image);
        } else if (session.user.image) {
          setImagePreview(session.user.image);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données utilisateur:', error);
        setError('Impossible de charger vos informations. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };
    if (session) {
      fetchUserData();
    }
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner une image valide.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('L\'image est trop volumineuse. Taille maximale: 5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    setFormData(prev => ({ ...prev, profile_image: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const formDataObj = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '' && key !== 'current_password' && key !== 'new_password' && key !== 'confirm_password') {
          if (key === 'profile_image' && value instanceof File) {
            formDataObj.append(key, value);
          } else {
            formDataObj.append(key, String(value));
          }
        }
      });
      // Use updateProfile (PUT) instead of updateUserProfile (PATCH) to avoid 405 error
      await usersAPI.updateProfile(formDataObj);
      if (formData.current_password && formData.new_password) {
        if (formData.new_password !== formData.confirm_password) {
          setError('Les mots de passe ne correspondent pas.');
          setSaving(false);
          return;
        }
        await usersAPI.changePassword({
          current_password: formData.current_password,
          new_password: formData.new_password
        });
      }
      await updateSession({
        ...session,
        user: {
          ...session?.user,
          name: `${formData.first_name} ${formData.last_name}`,
          image: imagePreview
        }
      });
      setSuccess('Profil mis à jour avec succès!');
      setFormData(prev => ({
        ...prev,
        current_password: '',
        new_password: '',
        confirm_password: ''
      }));
      
      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      setError(error.response?.data?.detail || 'Une erreur est survenue. Veuillez réessayer.');
      
      // Scroll to top to show error message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSaving(false);
    }
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4 } }
  };

  const slideUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  const notification = {
    hidden: { opacity: 0, y: -20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 15 
      } 
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      transition: { duration: 0.2 } 
    }
  };

  const rotateChevron = {
    closed: { rotate: 0 },
    open: { rotate: 180, transition: { duration: 0.3 } }
  };

  const accordionContent = {
    closed: { 
      height: 0, 
      opacity: 0,
      transition: { 
        height: { duration: 0.3 },
        opacity: { duration: 0.2 }
      } 
    },
    open: { 
      height: "auto", 
      opacity: 1,
      transition: { 
        height: { duration: 0.4 },
        opacity: { duration: 0.6, delay: 0.1 }
      } 
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="relative w-16 h-16"
        >
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-indigo-100"></div>
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-t-4 border-indigo-600"></div>
        </motion.div>
      </div>
    );
  }

  const Section = ({ 
    id, 
    title, 
    icon, 
    active, 
    children 
  }: { 
    id: string; 
    title: string; 
    icon: React.ReactNode; 
    active: boolean; 
    children: React.ReactNode 
  }) => {
    const isOpen = activeSection === id;
    
    return (
      <motion.div 
        className="mb-8 bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 ease-in-out"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div 
          className={`cursor-pointer px-6 py-4 flex justify-between items-center border-b border-indigo-200 ${active ? 'bg-indigo-50' : ''}`}
          onClick={() => setActiveSection(activeSection === id ? '' : id)}
        >
          <div className="flex items-center space-x-3">
            <motion.div 
              className="text-indigo-600"
              whileHover={{ scale: 1.1 }}
            >
              {icon}
            </motion.div>
            <h3 className="text-lg font-medium">{title}</h3>
          </div>
          <motion.div
            variants={rotateChevron}
            initial="closed"
            animate={isOpen ? "open" : "closed"}
          >
            <ChevronDown className="h-5 w-5 text-gray-500" />
          </motion.div>
        </div>
        
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key={`section-${id}`}
              initial="closed"
              animate="open"
              exit="closed"
              variants={accordionContent}
              className="px-6 overflow-hidden"
            >
              <motion.div 
                className="py-5"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {children}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  const InputField = ({ 
    id, 
    label, 
    type = 'text', 
    icon, 
    disabled = false, 
    helpText,
    placeholder,
    ...props 
  }: {
    id: string;
    label: string;
    type?: string;
    icon: React.ReactNode;
    disabled?: boolean;
    helpText?: string;
    placeholder?: string;
    [key: string]: any;
  }) => {
    return (
      <motion.div
        variants={staggerItem}
      >
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
        <div className="relative rounded-lg shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <motion.div 
              className="text-indigo-500"
              whileHover={{ scale: 1.1 }}
            >
              {icon}
            </motion.div>
          </div>
          {type === 'textarea' ? (
            <motion.textarea
              id={id}
              name={id}
              rows={4}
              className={`focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-200 rounded-lg transition-colors duration-200 ${disabled ? 'bg-gray-50' : 'bg-white hover:border-indigo-300'}`}
              placeholder={placeholder}
              disabled={disabled}
              whileFocus={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              {...props}
            />
          ) : (
            <motion.input
              type={type}
              id={id}
              name={id}
              className={`py-4 focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-200 rounded-lg transition-colors duration-200 ${disabled ? 'bg-gray-50' : 'bg-white hover:border-indigo-300'}`}
              placeholder={placeholder}
              disabled={disabled}
              whileFocus={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              {...props}
            />
          )}
        </div>
        {helpText && <p className="mt-1.5 text-xs text-gray-500">{helpText}</p>}
      </motion.div>
    );
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="max-w-4xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      {/* Notifications */}
      <div className="space-y-4 mb-6">
        <AnimatePresence>
          {error && (
            <motion.div
              key="error"
              variants={notification}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-red-50 border border-red-100 rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 p-1">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, delay: 0.2 }}
                  >
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  </motion.div>
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-medium text-red-800">Erreur</h3>
                  <p className="mt-1 text-sm text-red-700">{error}</p>
                </div>
                <motion.button 
                  type="button" 
                  className="ml-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg p-1.5 hover:bg-red-100 inline-flex h-8 w-8 items-center justify-center"
                  onClick={() => setError('')}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="sr-only">Fermer</span>
                  <X className="h-4 w-4" />
                </motion.button>
              </div>
            </motion.div>
          )}
          
          {success && (
            <motion.div
              key="success"
              variants={notification}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-green-50 border border-green-100 rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 p-1">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, delay: 0.2 }}
                  >
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </motion.div>
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-medium text-green-800">Succès</h3>
                  <p className="mt-1 text-sm text-green-700">{success}</p>
                </div>
                <motion.button 
                  type="button" 
                  className="ml-auto -mx-1.5 -my-1.5 bg-green-50 text-green-500 rounded-lg p-1.5 hover:bg-green-100 inline-flex h-8 w-8 items-center justify-center"
                  onClick={() => setSuccess('')}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="sr-only">Fermer</span>
                  <X className="h-4 w-4" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Profile Header */}
      <motion.div 
        className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl overflow-hidden shadow-lg mb-8"
        variants={slideUp}
      >
        <div className="px-6 py-8 relative overflow-hidden">
          <motion.div 
            className="absolute inset-0 opacity-10"
            initial={{ backgroundPosition: "0% 0%" }}
            animate={{ backgroundPosition: "100% 100%" }}
            transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.3),transparent)]"></div>
          </motion.div>
          
          <div className="relative flex flex-col md:flex-row gap-8 items-center">
            <motion.div 
              className="relative group"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <motion.div 
                className="h-32 w-32 rounded-full overflow-hidden ring-4 ring-white/30 bg-white/10 shadow-xl"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
              >
                {imagePreview ? (
                  <motion.div
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Image
                      src={imagePreview}
                      alt="Photo de profil"
                      width={128}
                      height={128}
                      className="h-32 w-32 object-cover"
                    />
                  </motion.div>
                ) : (
                  <div className="h-32 w-32 rounded-full flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <User className="h-16 w-16 text-white" />
                    </motion.div>
                  </div>
                )}
              </motion.div>
              <motion.button
                type="button"
                className="absolute bottom-0 right-0 bg-white text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 rounded-full p-2.5 shadow-md transform"
                onClick={() => fileInputRef.current?.click()}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <Camera className="h-5 w-5" />
              </motion.button>
              <input
                id="profile_image"
                name="profile_image"
                type="file"
                className="sr-only"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
              />
            </motion.div>
            
            <motion.div 
              className="text-center md:text-left flex-1"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.h2 
                className="text-2xl font-bold text-white"
                variants={staggerItem}
              >
                {formData.first_name || formData.last_name 
                  ? `${formData.first_name} ${formData.last_name}` 
                  : 'Votre profil'}
              </motion.h2>
              <motion.p 
                className="text-indigo-100 mt-1 text-lg"
                variants={staggerItem}
              >
                {formData.email || 'Complétez vos informations personnelles'}
              </motion.p>
              <motion.button
                type="button"
                className="mt-4 inline-flex items-center px-5 py-2.5 border border-white/20 text-sm font-medium rounded-lg text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-1 focus:ring-offset-indigo-600"
                onClick={() => fileInputRef.current?.click()}
                variants={staggerItem}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Camera className="mr-2 h-4 w-4" />
                Changer la photo
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Form Sections */}
      <Section 
        id="personal" 
        title="Informations personnelles" 
        icon={<User className="h-5 w-5" />} 
        active={activeSection === 'personal'}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField 
            id="first_name" 
            label="Prénom" 
            icon={<User className="h-5 w-5" />} 
            value={formData.first_name} 
            onChange={handleChange} 
            placeholder="Votre prénom"
          />
          
          <InputField 
            id="last_name" 
            label="Nom" 
            icon={<User className="h-5 w-5" />} 
            value={formData.last_name} 
            onChange={handleChange} 
            placeholder="Votre nom"
          />
          
          <InputField 
            id="email" 
            label="Adresse email" 
            type="email" 
            icon={<Mail className="h-5 w-5" />} 
            value={formData.email} 
            disabled={true}
            helpText="Contactez le support pour modifier votre email"
          />
          
          <InputField 
            id="phone_number" 
            label="Téléphone" 
            type="tel" 
            icon={<Phone className="h-5 w-5" />} 
            value={formData.phone_number} 
            onChange={handleChange} 
            placeholder="+237 6XX XX XX XX"
          />
          
          <InputField 
            id="date_of_birth" 
            label="Date de naissance" 
            type="date" 
            icon={<Calendar className="h-5 w-5" />} 
            value={formData.date_of_birth} 
            onChange={handleChange}
          />
        </div>
      </Section>
      
      <Section 
        id="address" 
        title="Adresse" 
        icon={<MapPin className="h-5 w-5" />} 
        active={activeSection === 'address'}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <InputField 
              id="address" 
              label="Adresse" 
              icon={<MapPin className="h-5 w-5" />} 
              value={formData.address} 
              onChange={handleChange} 
              placeholder="Votre adresse complète"
            />
          </div>
          
          <InputField 
            id="city" 
            label="Ville" 
            icon={<Building className="h-5 w-5" />} 
            value={formData.city} 
            onChange={handleChange} 
            placeholder="Votre ville"
          />
          
          <InputField 
            id="country" 
            label="Pays" 
            icon={<Globe className="h-5 w-5" />} 
            value={formData.country} 
            onChange={handleChange} 
            placeholder="Votre pays"
          />
          
          <div className="md:col-span-2">
            <InputField 
              id="bio" 
              label="Biographie" 
              type="textarea" 
              icon={<FileText className="h-5 w-5" />} 
              value={formData.bio} 
              onChange={handleChange} 
              placeholder="Parlez-nous un peu de vous..."
            />
          </div>
        </div>
      </Section>
      
      <Section 
        id="security" 
        title="Sécurité" 
        icon={<Lock className="h-5 w-5" />} 
        active={activeSection === 'security'}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div 
            className="md:col-span-2 bg-indigo-50 p-4 rounded-lg mb-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-sm text-indigo-800">
              Remplissez ces champs uniquement si vous souhaitez changer votre mot de passe
            </p>
          </motion.div>
          
          <InputField 
            id="current_password" 
            label="Mot de passe actuel" 
            type="password" 
            icon={<Lock className="h-5 w-5" />} 
            value={formData.current_password} 
            onChange={handleChange} 
            placeholder="••••••••"
          />
          
          <div className="md:hidden"></div>
          
          <InputField 
            id="new_password" 
            label="Nouveau mot de passe" 
            type="password" 
            icon={<Lock className="h-5 w-5" />} 
            value={formData.new_password} 
            onChange={handleChange} 
            placeholder="••••••••"
            helpText="Minimum 8 caractères avec lettres, chiffres et symboles"
          />
          
          <InputField 
            id="confirm_password" 
            label="Confirmer le mot de passe" 
            type="password" 
            icon={<Lock className="h-5 w-5" />} 
            value={formData.confirm_password} 
            onChange={handleChange} 
            placeholder="••••••••"
          />
        </div>
      </Section>
      
      {/* Action Buttons */}
      <motion.div 
        className="flex flex-col sm:flex-row justify-end gap-3 mt-8 mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <motion.button
          type="button"
          className="inline-flex items-center justify-center px-5 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
        >
          <X className="mr-2 h-4 w-4" />
          Annuler
        </motion.button>
        <motion.button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={!saving ? { scale: 1.03 } : {}}
          whileTap={!saving ? { scale: 0.97 } : {}}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
        >
          {saving ? (
            <>
              <motion.svg 
                className="-ml-1 mr-2 h-4 w-4 text-white" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </motion.svg>
              <span>Enregistrement...</span>
            </>
          ) : (
            <>
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, delay: 0.1 }}
              >
                <Save className="mr-2 h-4 w-4" />
              </motion.div>
              <span>Enregistrer les modifications</span>
            </>
          )}
        </motion.button>
      </motion.div>
    </motion.form>
  );
}