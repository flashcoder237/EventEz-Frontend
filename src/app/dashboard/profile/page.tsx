import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ProfileForm from '@/components/dashboard/profile/ProfileForm';
import { Button } from '@/components/ui/Button';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { FaUserCircle, FaLock, FaBell, FaCreditCard, FaBriefcase, FaSignOutAlt } from 'react-icons/fa';

export const metadata = {
  title: 'Mon profil | EventEz',
  description: 'Gérez votre profil, paramètres de sécurité et préférences sur EventEz',
};

export default async function ProfilePage() {
  // Vérifier l'authentification côté serveur
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login?redirect=/dashboard/profile');
  }
  
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mon profil</h1>
            <p className="mt-1 text-sm text-gray-500">
              Gérez vos informations personnelles et vos préférences
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 space-x-2">
            <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
              <FaSignOutAlt className="mr-2 h-4 w-4" />
              Se déconnecter
            </Button>
          </div>
        </div>
        
        {/* Main content */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Sidebar navigation - FIXED */}
          <div className="md:col-span-3 lg:col-span-2">
            <div className="md:sticky md:top-6" style={{ height: 'fit-content' }}>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <nav className="space-y-1 p-2">
                  <a 
                    href="#profile" 
                    className="flex items-center px-4 py-3 text-sm font-medium rounded-md bg-indigo-50 text-indigo-700"
                  >
                    <FaUserCircle className="mr-3 h-5 w-5" />
                    Profil
                  </a>
                  <a 
                    href="#security" 
                    className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
                  >
                    <FaLock className="mr-3 h-5 w-5 text-gray-400" />
                    Sécurité
                  </a>
                  <a 
                    href="#notifications" 
                    className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
                  >
                    <FaBell className="mr-3 h-5 w-5 text-gray-400" />
                    Notifications
                  </a>
                  <a 
                    href="#billing" 
                    className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
                  >
                    <FaCreditCard className="mr-3 h-5 w-5 text-gray-400" />
                    Paiements
                  </a>
                  {session.user?.role === 'organizer' && (
                    <a 
                      href="#organizer" 
                      className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
                    >
                      <FaBriefcase className="mr-3 h-5 w-5 text-gray-400" />
                      Profil organisateur
                    </a>
                  )}
                </nav>
              </div>
              
              <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100">
                  <div className="text-sm text-indigo-700">
                    <p className="font-medium">Besoin d'aide ?</p>
                    <p className="mt-1 text-indigo-600 text-xs">Notre équipe de support est disponible pour vous aider.</p>
                    <button className="mt-2 text-indigo-700 font-medium text-sm">
                      Contacter le support
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main content area */}
          <div className="md:col-span-9 lg:col-span-10">
            <div id="profile" className="bg-white shadow overflow-hidden rounded-lg">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Informations personnelles</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Mettez à jour vos informations personnelles et vos coordonnées
                </p>
              </div>
              
              <div className="px-6 py-5">
                <ProfileForm />
              </div>
            </div>
            
            <div id="security" className="mt-8 bg-white shadow overflow-hidden rounded-lg">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Sécurité du compte</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Gérez votre mot de passe et les paramètres de sécurité de votre compte
                </p>
              </div>
              
              <div className="px-6 py-5">
                <p className="text-sm text-gray-500">
                  Les options de sécurité seront disponibles prochainement.
                </p>
              </div>
            </div>
            
            <div id="notifications" className="mt-8 bg-white shadow overflow-hidden rounded-lg">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Préférences de notification</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Gérez comment et quand vous souhaitez être notifié
                </p>
              </div>
              
              <div className="px-6 py-5">
                <p className="text-sm text-gray-500">
                  Les préférences de notification seront disponibles prochainement.
                </p>
              </div>
            </div>
            
            <div id="billing" className="mt-8 bg-white shadow overflow-hidden rounded-lg">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Informations de paiement</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Gérez vos méthodes de paiement et consultez votre historique de transactions
                </p>
              </div>
              
              <div className="px-6 py-5">
                <p className="text-sm text-gray-500">
                  Les informations de paiement seront disponibles prochainement.
                </p>
              </div>
            </div>
            
            {session.user?.role === 'organizer' && (
              <div id="organizer" className="mt-8 bg-white shadow overflow-hidden rounded-lg">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Profil organisateur</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Personnalisez votre profil public d'organisateur d'événements
                  </p>
                </div>
                
                <div className="px-6 py-5">
                  <p className="text-sm text-gray-500">
                    Les options de profil organisateur seront disponibles prochainement.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}