'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import BecomeOrganizerCard from '../../../components/dashboard/BecomeOrganizerCard';

export default function BecomeOrganizerPage() {
  const { data: session, status } = useSession();
  
  // Redirect if not logged in
  if (status === 'unauthenticated') {
    redirect('/auth/signin?callbackUrl=/dashboard/become-organizer');
  }
  
  // Redirect if already an organizer
  if (session?.user?.role === 'organizer' || session?.user?.role === 'admin') {
    redirect('/dashboard');
  }
  
  return (
    <DashboardLayout title="Devenir organisateur">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Devenir organisateur</h2>
          <p className="mt-1 text-gray-500">
            Passez à un compte organisateur pour créer et gérer vos propres événements
          </p>
        </div>
        
        <div className="space-y-8">
          <BecomeOrganizerCard />
          
          <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Avantages d'un compte organisateur</h3>
            
            <ul className="space-y-4">
              <li className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-purple-100 text-purple-600">
                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="ml-3">
                  <h4 className="text-base font-medium text-gray-900">Créez vos propres événements</h4>
                  <p className="mt-1 text-sm text-gray-500">
                    Concevez et publiez des événements personnalisés avec billetterie intégrée.
                  </p>
                </div>
              </li>
              
              <li className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-purple-100 text-purple-600">
                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="ml-3">
                  <h4 className="text-base font-medium text-gray-900">Gérez les paiements</h4>
                  <p className="mt-1 text-sm text-gray-500">
                    Accédez aux outils de gestion des paiements et suivez vos revenus.
                  </p>
                </div>
              </li>
              
              <li className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-purple-100 text-purple-600">
                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="ml-3">
                  <h4 className="text-base font-medium text-gray-900">Analysez les performances</h4>
                  <p className="mt-1 text-sm text-gray-500">
                    Consultez des statistiques détaillées sur vos événements et vos participants.
                  </p>
                </div>
              </li>
              
              <li className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-purple-100 text-purple-600">
                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="ml-3">
                  <h4 className="text-base font-medium text-gray-900">Personnalisez votre profil d'organisateur</h4>
                  <p className="mt-1 text-sm text-gray-500">
                    Créez un profil professionnel pour présenter votre marque ou organisation.
                  </p>
                </div>
              </li>
            </ul>
          </div>
          
          <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-100">
            <h3 className="text-lg font-medium text-indigo-900 mb-2">Besoin d'aide ?</h3>
            <p className="text-indigo-700">
              Si vous avez des questions sur le processus de mise à niveau ou les fonctionnalités d'organisateur, n'hésitez pas à contacter notre équipe de support.
            </p>
            <a 
              href="mailto:support@eventez.com" 
              className="mt-4 inline-flex items-center text-sm font-medium text-indigo-700 hover:text-indigo-600"
            >
              Contacter le support
              <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
