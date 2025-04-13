// app/(dashboard)/dashboard/settings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Switch } from '@/components/ui/Switch';
import { 
  FaUser, FaBuilding, FaLock, FaMoneyBill, FaBell, 
  FaPalette, FaCheck, FaSave, FaImage, FaUpload,FaPlus
} from 'react-icons/fa';
// import { FaCalendarAlt, FaMapMarkerAlt, FaImage, FaTrash, FaTimes, FaPlus } from 'react-icons/fa';
import Image from 'next/image';
import { User, OrganizerProfile } from '@/types';
import { usersAPI } from '@/lib/api';

export default function SettingsPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
  const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
  router.push(`/login?redirect=${returnUrl}`);
},
  });

  const [currentTab, setCurrentTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  // États pour les paramètres de profil
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    phone_number: '',
    email: '',
    company_name: '',
    registration_number: '',
    description: '',
    website: '',
    billing_address: ''
  });
  
  // États pour les paramètres de notification
  const [notificationSettings, setNotificationSettings] = useState({
    email_event_updates: true,
    email_registration_alerts: true,
    email_payment_confirmations: true,
    email_marketing: false,
    sms_event_reminders: false,
    sms_payment_confirmations: false,
    app_notifications: true,
    notification_frequency: 'immediate'
  });
  
  // État pour l'image de profil/logo
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  
  // État pour le changement de mot de passe
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  // Chargement des données de l'utilisateur
  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.id) {
        setIsLoading(true);
        try {
          const response = await usersAPI.getUserProfile();
          const userData = response.data;
          
          // Mettre à jour les états avec les données utilisateur
          setUser(userData);
          setProfileData({
            first_name: userData.first_name || '',
            last_name: userData.last_name || '',
            username: userData.username || '',
            phone_number: userData.phone_number || '',
            email: userData.email || '',
            company_name: userData.company_name || '',
            registration_number: userData.registration_number || '',
            description: userData.organizer_profile?.description || '',
            website: userData.organizer_profile?.website || '',
            billing_address: userData.billing_address || ''
          });
          
          // Si l'utilisateur a un logo, définir l'aperçu
          if (userData.organizer_profile?.logo) {
            setProfileImagePreview(userData.organizer_profile.logo);
          }
        } catch (error) {
          console.error('Erreur lors du chargement des données utilisateur', error);
          setErrorMessage('Impossible de charger vos informations. Veuillez réessayer plus tard.');
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (status === 'authenticated') {
      fetchUserData();
    }
  }, [session, status]);

  // Gestion des changements dans les champs de profil
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Gestion du changement d'image de profil
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setProfileImage(file);
      
      // Créer une URL pour la prévisualisation
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Gestion du changement des paramètres de notification
  const handleNotificationToggle = (setting: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev]
    }));
  };
  
  // Gestion du changement de fréquence des notifications
  const handleNotificationFrequencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNotificationSettings(prev => ({
      ...prev,
      notification_frequency: e.target.value
    }));
  };
  
  // Gestion des changements de mot de passe
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Soumission du formulaire de profil
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('saving');
    
    try {
      // Créer l'objet avec les données à mettre à jour
      const updateData = {
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        phone_number: profileData.phone_number,
        username: profileData.username,
        billing_address: profileData.billing_address,
        company_name: profileData.company_name,
        registration_number: profileData.registration_number,
        organizer_profile: {
          description: profileData.description,
          website: profileData.website
        }
      };
      
      // Mettre à jour le profil
      await usersAPI.updateUserProfile(updateData);
      
      // Si une nouvelle image a été sélectionnée, la télécharger
      if (profileImage) {
        const formData = new FormData();
        formData.append('logo', profileImage);
        await usersAPI.updateProfileImage(formData);
      }
      
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil', error);
      setSaveStatus('error');
      setErrorMessage('Une erreur est survenue lors de la mise à jour de votre profil.');
    }
  };
  
  // Soumission du formulaire de mot de passe
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation des mots de passe
    if (passwordData.new_password !== passwordData.confirm_password) {
      setErrorMessage('Les mots de passe ne correspondent pas.');
      setSaveStatus('error');
      return;
    }
    
    setSaveStatus('saving');
    
    try {
      await usersAPI.changePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      });
      
      // Réinitialiser les champs
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
      
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe', error);
      setSaveStatus('error');
      setErrorMessage('Une erreur est survenue lors du changement de mot de passe.');
    }
  };
  
  // Soumission des paramètres de notification
  const handleNotificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('saving');
    
    try {
      await usersAPI.updateNotificationSettings(notificationSettings);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Erreur lors de la mise à jour des paramètres de notification', error);
      setSaveStatus('error');
      setErrorMessage('Une erreur est survenue lors de la mise à jour de vos paramètres de notification.');
    }
  };

  // Affichage des messages d'état
  const renderStatusMessage = () => {
    if (saveStatus === 'saving') {
      return <div className="bg-blue-50 p-3 rounded-md text-blue-700">Enregistrement en cours...</div>;
    } else if (saveStatus === 'success') {
      return <div className="bg-green-50 p-3 rounded-md text-green-700 flex items-center"><FaCheck className="mr-2" /> Modifications enregistrées avec succès</div>;
    } else if (saveStatus === 'error') {
      return <div className="bg-red-50 p-3 rounded-md text-red-700">{errorMessage || 'Une erreur est survenue'}</div>;
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6 w-64"></div>
          <div className="h-4 bg-gray-200 rounded w-full max-w-2xl mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full max-w-xl mb-6"></div>
          
          <div className="bg-white rounded-lg p-6 mb-6">
            <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Paramètres du compte</h1>
        <p className="text-gray-600">
          Gérez vos informations personnelles, les paramètres de sécurité et les préférences de notification
        </p>
      </div>
      
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
        <TabsList className="bg-gray-100 p-1 rounded-lg">
          <TabsTrigger value="profile" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <FaUser className="mr-2" /> Profil
          </TabsTrigger>
          <TabsTrigger value="organization" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <FaBuilding className="mr-2" /> Organisation
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <FaLock className="mr-2" /> Sécurité
          </TabsTrigger>
          <TabsTrigger value="billing" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <FaMoneyBill className="mr-2" /> Facturation
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <FaBell className="mr-2" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="appearance" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <FaPalette className="mr-2" /> Apparence
          </TabsTrigger>
        </TabsList>
        
        {renderStatusMessage()}
        
        {/* Onglet Profil */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Photo de profil</h3>
                  <div className="flex items-center space-x-6">
                    <div className="relative w-24 h-24 overflow-hidden rounded-full bg-gray-100">
                      {profileImagePreview ? (
                        <Image 
                          src={profileImagePreview} 
                          alt="Photo de profil" 
                          fill 
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-primary/10">
                          <FaUser className="h-10 w-10 text-primary/40" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col space-y-2">
                      <label className="block">
                        <span className="sr-only">Choisir une photo de profil</span>
                        <input 
                          type="file" 
                          className="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-primary file:text-white
                            hover:file:bg-primary-dark"
                          accept="image/*"
                          onChange={handleProfileImageChange}
                        />
                      </label>
                      <p className="text-xs text-gray-500">
                        PNG, JPG ou GIF. Taille maximale de 2MB.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Prénom"
                    name="first_name"
                    value={profileData.first_name}
                    onChange={handleProfileChange}
                  />
                  
                  <Input
                    label="Nom"
                    name="last_name"
                    value={profileData.last_name}
                    onChange={handleProfileChange}
                  />
                  
                  <Input
                    label="Nom d'utilisateur"
                    name="username"
                    value={profileData.username}
                    onChange={handleProfileChange}
                  />
                  
                  <Input
                    label="Téléphone"
                    name="phone_number"
                    value={profileData.phone_number}
                    onChange={handleProfileChange}
                  />
                  
                  <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={profileData.email}
                    disabled
                    className="bg-gray-50"
                  />
                  
                  <Input
                    label="Adresse de facturation"
                    name="billing_address"
                    value={profileData.billing_address}
                    onChange={handleProfileChange}
                  />
                </div>
                
                <div className="pt-6 flex justify-end">
                  <Button type="submit" disabled={saveStatus === 'saving'}>
                    {saveStatus === 'saving' ? 'Enregistrement...' : 'Enregistrer les modifications'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Onglet Organisation */}
        <TabsContent value="organization">
          <Card>
            <CardHeader>
              <CardTitle>Profil d'organisation</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Nom de l'organisation"
                    name="company_name"
                    value={profileData.company_name}
                    onChange={handleProfileChange}
                  />
                  
                  <Input
                    label="Numéro d'enregistrement"
                    name="registration_number"
                    value={profileData.registration_number}
                    onChange={handleProfileChange}
                  />
                  
                  <div className="md:col-span-2">
                    <Textarea
                      label="Description de l'organisation"
                      name="description"
                      value={profileData.description}
                      onChange={handleProfileChange}
                      className="min-h-32"
                    />
                  </div>
                  
                  <Input
                    label="Site web"
                    name="website"
                    value={profileData.website}
                    onChange={handleProfileChange}
                    placeholder="https://..."
                  />
                  
                  <div className="flex items-center space-x-2">
                    <Badge variant={user?.is_verified ? 'success' : 'outline'}>
                      {user?.is_verified ? 'Vérifié' : 'Non vérifié'}
                    </Badge>
                    {!user?.is_verified && (
                      <Button type="button" variant="outline" size="sm">
                        Demander une vérification
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="pt-6 flex justify-end">
                  <Button type="submit" disabled={saveStatus === 'saving'}>
                    {saveStatus === 'saving' ? 'Enregistrement...' : 'Enregistrer les modifications'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Onglet Sécurité */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Changer votre mot de passe</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <Input
                  type="password"
                  label="Mot de passe actuel"
                  name="current_password"
                  value={passwordData.current_password}
                  onChange={handlePasswordChange}
                  required
                />
                
                <Input
                  type="password"
                  label="Nouveau mot de passe"
                  name="new_password"
                  value={passwordData.new_password}
                  onChange={handlePasswordChange}
                  required
                />
                
                <Input
                  type="password"
                  label="Confirmer le nouveau mot de passe"
                  name="confirm_password"
                  value={passwordData.confirm_password}
                  onChange={handlePasswordChange}
                  required
                />
                
                <div className="pt-6 flex justify-end">
                  <Button type="submit" disabled={saveStatus === 'saving'}>
                    {saveStatus === 'saving' ? 'Enregistrement...' : 'Changer le mot de passe'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Sessions actives</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Session actuelle</p>
                      <p className="text-sm text-gray-500">Chrome sur Windows • Douala, Cameroun</p>
                      <p className="text-sm text-gray-500">Dernière activité: Aujourd'hui</p>
                    </div>
                    <Badge>Actif maintenant</Badge>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Autre appareil</p>
                      <p className="text-sm text-gray-500">Firefox sur Android • Yaoundé, Cameroun</p>
                      <p className="text-sm text-gray-500">Dernière activité: Hier</p>
                    </div>
                    <Button variant="outline" size="sm">Déconnecter</Button>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <Button variant="outline" className="w-full">Se déconnecter de toutes les sessions</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Onglet Facturation */}
        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Méthodes de paiement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-orange-100 p-2 rounded-md mr-4">
                        <FaMoneyBill className="text-orange-500" />
                      </div>
                      <div>
                        <p className="font-medium">MTN Mobile Money</p>
                        <p className="text-sm text-gray-500">+237 612 34 56 78</p>
                      </div>
                    </div>
                    <Badge>Par défaut</Badge>
                  </div>
                </div>
                
                <Button variant="outline">
                  <FaPlus className="mr-2" /> Ajouter une méthode de paiement
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Historique de facturation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Facture #INV-001</p>
                      <p className="text-sm text-gray-500">Mars 2025 • 50 000 XAF</p>
                    </div>
                    <Button variant="ghost" size="sm">Télécharger</Button>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Facture #INV-002</p>
                      <p className="text-sm text-gray-500">Février 2025 • 45 000 XAF</p>
                    </div>
                    <Button variant="ghost" size="sm">Télécharger</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Onglet Notifications */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Préférences de notification</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNotificationSubmit} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notifications par email</h3>
                  
                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <p className="font-medium">Mises à jour d'événements</p>
                      <p className="text-sm text-gray-500">Recevez des emails lorsque vos événements sont mis à jour ou validés</p>
                    </div>
                    <Switch 
                      checked={notificationSettings.email_event_updates} 
                      onCheckedChange={() => handleNotificationToggle('email_event_updates')} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <p className="font-medium">Alertes d'inscription</p>
                      <p className="text-sm text-gray-500">Recevez des emails lorsque quelqu'un s'inscrit à vos événements</p>
                    </div>
                    <Switch 
                      checked={notificationSettings.email_registration_alerts} 
                      onCheckedChange={() => handleNotificationToggle('email_registration_alerts')} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <p className="font-medium">Confirmations de paiement</p>
                      <p className="text-sm text-gray-500">Recevez des emails lorsqu'un paiement est effectué</p>
                    </div>
                    <Switch 
                      checked={notificationSettings.email_payment_confirmations} 
                      onCheckedChange={() => handleNotificationToggle('email_payment_confirmations')} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <p className="font-medium">Emails marketing</p>
                      <p className="text-sm text-gray-500">Recevez des emails sur les nouvelles fonctionnalités et offres</p>
                    </div>
                    <Switch 
                      checked={notificationSettings.email_marketing} 
                      onCheckedChange={() => handleNotificationToggle('email_marketing')} 
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notifications SMS</h3>
                  
                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <p className="font-medium">Rappels d'événements</p>
                      <p className="text-sm text-gray-500">Recevez des SMS de rappel pour vos événements</p>
                    </div>
                    <Switch 
                      checked={notificationSettings.sms_event_reminders} 
                      onCheckedChange={() => handleNotificationToggle('sms_event_reminders')} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <p className="font-medium">Confirmations de paiement</p>
                      <p className="text-sm text-gray-500">Recevez des SMS lorsqu'un paiement est effectué</p>
                    </div>
                    <Switch 
                      checked={notificationSettings.sms_payment_confirmations} 
                      onCheckedChange={() => handleNotificationToggle('sms_payment_confirmations')} 
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notifications de l'application</h3>
                  
                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <p className="font-medium">Notifications in-app</p>
                      <p className="text-sm text-gray-500">Recevez des notifications dans l'application</p>
                    </div>
                    <Switch 
                      checked={notificationSettings.app_notifications} 
                      onCheckedChange={() => handleNotificationToggle('app_notifications')} 
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Fréquence des notifications</h3>
                  
                  <Select
                    options={[
                      { value: 'immediate', label: 'Immédiatement (temps réel)' },
                      { value: 'hourly', label: 'Résumé horaire' },
                      { value: 'daily', label: 'Résumé quotidien' },
                      { value: 'weekly', label: 'Résumé hebdomadaire' }
                    ]}
                    value={notificationSettings.notification_frequency}
                    onChange={handleNotificationFrequencyChange}
                    label="Choisissez la fréquence à laquelle vous souhaitez recevoir les notifications"
                  />
                </div>
                
                <div className="pt-6 flex justify-end">
                  <Button type="submit" disabled={saveStatus === 'saving'}>
                    {saveStatus === 'saving' ? 'Enregistrement...' : 'Enregistrer les préférences'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Onglet Apparence */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Préférences d'affichage</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Thème</h3>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="border rounded-md p-4 cursor-pointer bg-white relative">
                      <div className="aspect-video bg-white border rounded-md mb-2"></div>
                      <p className="text-sm font-medium">Clair</p>
                      <div className="absolute top-2 right-2">
                        <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center text-white">
                          <FaCheck className="h-2 w-2" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-4 cursor-pointer">
                      <div className="aspect-video bg-gray-900 border rounded-md mb-2"></div>
                      <p className="text-sm font-medium">Sombre</p>
                    </div>
                    
                    <div className="border rounded-md p-4 cursor-pointer">
                      <div className="aspect-video bg-gradient-to-r from-white to-gray-900 border rounded-md mb-2"></div>
                      <p className="text-sm font-medium">Système</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Langues</h3>
                  
                  <Select
                    options={[
                      { value: 'fr', label: 'Français' },
                      { value: 'en', label: 'English' },
                      { value: 'es', label: 'Español' }
                    ]}
                    value="fr"
                    label="Langue de l'interface"
                  />
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Disposition du tableau de bord</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-md p-4 cursor-pointer bg-white relative">
                      <div className="aspect-video border rounded-md mb-2 flex">
                        <div className="w-1/4 bg-gray-100 border-r"></div>
                        <div className="w-3/4 p-2">
                          <div className="h-3 w-3/4 bg-gray-100 rounded mb-1"></div>
                          <div className="h-2 w-1/2 bg-gray-100 rounded"></div>
                        </div>
                      </div>
                      <p className="text-sm font-medium">Standard</p>
                      <div className="absolute top-2 right-2">
                        <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center text-white">
                          <FaCheck className="h-2 w-2" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-4 cursor-pointer">
                      <div className="aspect-video border rounded-md mb-2">
                        <div className="p-2">
                          <div className="h-3 w-3/4 bg-gray-100 rounded mb-1"></div>
                          <div className="h-2 w-1/2 bg-gray-100 rounded mb-3"></div>
                          <div className="flex">
                            <div className="w-1/4 h-10 bg-gray-100 mr-2 rounded"></div>
                            <div className="w-1/4 h-10 bg-gray-100 mr-2 rounded"></div>
                            <div className="w-1/4 h-10 bg-gray-100 rounded"></div>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm font-medium">Compact</p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-6 flex justify-end">
                  <Button type="submit">Enregistrer les préférences</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}