'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Globe, 
  Moon, 
  Sun, 
  Save, 
  Trash2,
  AlertCircle,
  CheckCircle,
  Shield,
  LogOut
} from 'lucide-react';
import { usersAPI } from '@/lib/api';
import { signOut } from 'next-auth/react';

export default function SettingsFormEnhanced() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [deletePassword, setDeletePassword] = useState('');

  const [settings, setSettings] = useState({
    email_notifications: true,
    sms_notifications: false,
    push_notifications: true,
    event_reminders: true,
    marketing_emails: false,
    language: 'fr',
    theme: 'light',
    timezone: 'Africa/Douala',
    two_factor_auth: false,
    login_notifications: true,
    public_profile: true
  });

  useEffect(() => {
    const fetchUserSettings = async () => {
      if (!session?.user) return;
      setLoading(true);
      try {
        const response = await usersAPI.getUserSettings();
        const userSettings = response.data;
        setSettings({
          ...settings,
          ...userSettings
        });
      } catch (error) {
        console.error('Erreur lors du chargement des paramètres utilisateur:', error);
        setError('Impossible de charger vos paramètres. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };
    if (session) {
      fetchUserSettings();
    }
  }, [session]);

  const handleToggle = (name: string) => {
    setSettings(prev => ({
      ...prev,
      [name]: !prev[name as keyof typeof prev]
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await usersAPI.updateUserSettings(settings);
      setSuccess('Paramètres mis à jour avec succès!');
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour des paramètres:', error);
      setError(error.response?.data?.detail || 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setError('Veuillez entrer votre mot de passe pour confirmer la suppression.');
      return;
    }
    try {
      await usersAPI.deleteAccount({
        password: deletePassword,
        reason: deleteReason
      });
      signOut({ callbackUrl: '/' });
    } catch (error: any) {
      console.error('Erreur lors de la suppression du compte:', error);
      setError(error.response?.data?.detail || 'Une erreur est survenue. Veuillez réessayer.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      {success && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Notifications</h3>
              <p className="mt-1 text-sm text-gray-500">Décidez comment vous souhaitez être notifié des mises à jour.</p>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="email_notifications"
                      name="email_notifications"
                      type="checkbox"
                      checked={settings.email_notifications}
                      onChange={() => handleToggle('email_notifications')}
                      className="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="email_notifications" className="font-medium text-gray-700">Notifications par email</label>
                    <p className="text-gray-500">Recevez des emails concernant vos événements et inscriptions.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="sms_notifications"
                      name="sms_notifications"
                      type="checkbox"
                      checked={settings.sms_notifications}
                      onChange={() => handleToggle('sms_notifications')}
                      className="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="sms_notifications" className="font-medium text-gray-700">Notifications par SMS</label>
                    <p className="text-gray-500">Recevez des SMS pour les mises à jour importantes (des frais peuvent s'appliquer).</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="push_notifications"
                      name="push_notifications"
                      type="checkbox"
                      checked={settings.push_notifications}
                      onChange={() => handleToggle('push_notifications')}
                      className="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="push_notifications" className="font-medium text-gray-700">Notifications push</label>
                    <p className="text-gray-500">Recevez des notifications push sur votre navigateur ou appareil mobile.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="event_reminders"
                      name="event_reminders"
                      type="checkbox"
                      checked={settings.event_reminders}
                      onChange={() => handleToggle('event_reminders')}
                      className="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="event_reminders" className="font-medium text-gray-700">Rappels d'événements</label>
                    <p className="text-gray-500">Recevez des rappels avant vos événements.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="marketing_emails"
                      name="marketing_emails"
                      type="checkbox"
                      checked={settings.marketing_emails}
                      onChange={() => handleToggle('marketing_emails')}
                      className="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="marketing_emails" className="font-medium text-gray-700">Emails marketing</label>
                    <p className="text-gray-500">Recevez des emails sur les nouveaux événements et offres spéciales.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6 mt-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Préférences</h3>
              <p className="mt-1 text-sm text-gray-500">Personnalisez votre expérience sur EventEz.</p>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="language" className="block text-sm font-medium text-gray-700">Langue</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Globe className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      id="language"
                      name="language"
                      value={settings.language}
                      onChange={handleChange}
                      className="focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="theme" className="block text-sm font-medium text-gray-700">Thème</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      {settings.theme === 'dark' ? (
                        <Moon className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Sun className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    <select
                      id="theme"
                      name="theme"
                      value={settings.theme}
                      onChange={handleChange}
                      className="focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="light">Clair</option>
                      <option value="dark">Sombre</option>
                      <option value="system">Système</option>
                    </select>
                  </div>
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">Fuseau horaire</label>
                  <select
                    id="timezone"
                    name="timezone"
                    value={settings.timezone}
                    onChange={handleChange}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  >
                    <option value="Africa/Douala">Afrique/Douala (GMT+1)</option>
                    <option value="Europe/Paris">Europe/Paris (GMT+1)</option>
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Amérique/New York (GMT-5)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6 mt-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Sécurité</h3>
              <p className="mt-1 text-sm text-gray-500">Configurez les options de sécurité de votre compte.</p>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="two_factor_auth"
                      name="two_factor_auth"
                      type="checkbox"
                      checked={settings.two_factor_auth}
                      onChange={() => handleToggle('two_factor_auth')}
                      className="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="two_factor_auth" className="font-medium text-gray-700">Authentification à deux facteurs</label>
                    <p className="text-gray-500">Ajoutez une couche de sécurité supplémentaire à votre compte.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="login_notifications"
                      name="login_notifications"
                      type="checkbox"
                      checked={settings.login_notifications}
                      onChange={() => handleToggle('login_notifications')}
                      className="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="login_notifications" className="font-medium text-gray-700">Notifications de connexion</label>
                    <p className="text-gray-500">Recevez une notification lorsque quelqu'un se connecte à votre compte.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="public_profile"
                      name="public_profile"
                      type="checkbox"
                      checked={settings.public_profile}
                      onChange={() => handleToggle('public_profile')}
                      className="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="public_profile" className="font-medium text-gray-700">Profil public</label>
                    <p className="text-gray-500">Permettre aux autres utilisateurs de voir votre profil et vos événements.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="button"
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={saving}
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
                <Save className="mr-2 h-5 w-5" />
                Enregistrer
              </>
            )}
          </button>
        </div>
      </form>
  );
}
