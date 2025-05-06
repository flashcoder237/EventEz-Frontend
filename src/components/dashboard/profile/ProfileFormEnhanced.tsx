'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
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
  FileText
} from 'lucide-react';
import { usersAPI } from 'lib/api';

export default function ProfileFormEnhanced() {
  const { data: session, update: updateSession } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      await usersAPI.updateUserProfile(formDataObj);
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
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      setError(error.response?.data?.detail || 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-sm animate-fadeIn">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Erreur</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
            <button 
              type="button" 
              className="ml-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg p-1.5 hover:bg-red-100 inline-flex h-8 w-8 items-center justify-center"
              onClick={() => setError('')}
            >
              <span className="sr-only">Fermer</span>
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-sm animate-fadeIn">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Succès</h3>
              <p className="mt-1 text-sm text-green-700">{success}</p>
            </div>
            <button 
              type="button" 
              className="ml-auto -mx-1.5 -my-1.5 bg-green-50 text-green-500 rounded-lg p-1.5 hover:bg-green-100 inline-flex h-8 w-8 items-center justify-center"
              onClick={() => setSuccess('')}
            >
              <span className="sr-only">Fermer</span>
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
      <div className="bg-white shadow-md rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 px-6 py-6 flex flex-col md:flex-row gap-6 items-center">
          <div className="relative group">
            {imagePreview ? (
              <div className="h-28 w-28 rounded-full overflow-hidden ring-4 ring-white/50 bg-white">
                <Image
                  src={imagePreview}
                  alt="Photo de profil"
                  width={112}
                  height={112}
                  className="h-28 w-28 object-cover"
                />
              </div>
            ) : (
              <div className="h-28 w-28 rounded-full overflow-hidden bg-white/10 flex items-center justify-center ring-4 ring-white/50">
                <User className="h-14 w-14 text-white" />
              </div>
            )}
            <button
              type="button"
              className="absolute bottom-0 right-0 bg-indigo-700 hover:bg-indigo-800 transition-colors rounded-full p-2 text-white shadow-md"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera className="h-5 w-5" />
            </button>
            <input
              id="profile_image"
              name="profile_image"
              type="file"
              className="sr-only"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
            />
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-xl font-bold text-white">
              {formData.first_name || formData.last_name 
                ? `${formData.first_name} ${formData.last_name}` 
                : 'Votre profil'}
            </h2>
            <p className="text-indigo-100 mt-1">{formData.email || 'Complétez vos informations personnelles'}</p>
            <button
              type="button"
              className="mt-3 inline-flex items-center px-4 py-2 border border-indigo-300 text-sm font-medium rounded-md text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              Changer la photo
            </button>
          </div>
        </div>

        <div className="px-6 py-5">
          <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-3 mb-4">Informations personnelles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                Prénom
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-indigo-400" />
                </div>
                <input
                  type="text"
                  name="first_name"
                  id="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg"
                  placeholder="Votre prénom"
                />
              </div>
            </div>

            <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                Nom
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-indigo-400" />
                </div>
                <input
                  type="text"
                  name="last_name"
                  id="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg"
                  placeholder="Votre nom"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Adresse email
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-indigo-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg bg-gray-50"
                  disabled
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Contactez le support pour modifier votre email
              </p>
            </div>

            <div>
              <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-indigo-400" />
                </div>
                <input
                  type="tel"
                  name="phone_number"
                  id="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg"
                  placeholder="+237 6XX XX XX XX"
                />
              </div>
            </div>

            <div>
              <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700 mb-1">
                Date de naissance
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-indigo-400" />
                </div>
                <input
                  type="date"
                  name="date_of_birth"
                  id="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-3 mb-4 mt-8">Adresse</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Adresse
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-indigo-400" />
                </div>
                <input
                  type="text"
                  name="address"
                  id="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg"
                  placeholder="Votre adresse"
                />
              </div>
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                Ville
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="h-5 w-5 text-indigo-400" />
                </div>
                <input
                  type="text"
                  name="city"
                  id="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg"
                  placeholder="Votre ville"
                />
              </div>
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                Pays
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Globe className="h-5 w-5 text-indigo-400" />
                </div>
                <input
                  type="text"
                  name="country"
                  id="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg"
                  placeholder="Votre pays"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                Biographie
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                  <FileText className="h-5 w-5 text-indigo-400" />
                </div>
                <textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  value={formData.bio}
                  onChange={handleChange}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg"
                  placeholder="Parlez-nous un peu de vous..."
                />
              </div>
            </div>
          </div>

          <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-3 mb-4 mt-8">Sécurité</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe actuel
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-indigo-400" />
                </div>
                <input
                  type="password"
                  name="current_password"
                  id="current_password"
                  value={formData.current_password}
                  onChange={handleChange}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="hidden md:block"></div>

            <div>
              <label htmlFor="new_password" className="block text-sm font-medium text-gray-700 mb-1">
                Nouveau mot de passe
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-indigo-400" />
                </div>
                <input
                  type="password"
                  name="new_password"
                  id="new_password"
                  value={formData.new_password}
                  onChange={handleChange}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg"
                  placeholder="••••••••"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Minimum 8 caractères avec lettres, chiffres et symboles
              </p>
            </div>

            <div>
              <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmer le mot de passe
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-indigo-400" />
                </div>
                <input
                  type="password"
                  name="confirm_password"
                  id="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <X className="mr-2 h-4 w-4" />
            Annuler
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Enregistrer
              </>
            )}
          </button>
        </div>
      </form>
  );
}
