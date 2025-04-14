'use client';

import { useState } from 'react';
import { usersAPI } from '../../lib/api';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ArrowRight, Star, CheckCircle } from 'lucide-react';

export default function BecomeOrganizerCard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { data: session, update } = useSession();

  const handleBecomeOrganizer = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await usersAPI.becomeOrganizer();
      
      // Update the session with the new role
      if (session) {
        await update({
          ...session,
          user: {
            ...session.user,
            role: 'organizer'
          }
        });
      }
      
      setSuccess(true);
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.refresh();
      }, 1500);
      
    } catch (error) {
      console.error('Erreur lors de la mise à niveau vers organisateur:', error);
      setError(error.response?.data?.detail || 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-12 w-12 text-green-500" />
        </div>
        <h3 className="text-lg font-medium text-green-800">Félicitations!</h3>
        <p className="mt-2 text-green-700">
          Votre compte a été mis à niveau vers le statut d'organisateur. Vous avez maintenant accès à toutes les fonctionnalités.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg overflow-hidden shadow-sm border border-purple-100">
      <div className="p-6">
        <h3 className="text-xl font-bold text-purple-900 mb-3">
          Devenez organisateur d'événements
        </h3>
        <p className="text-gray-700 mb-4">
          Accédez à des fonctionnalités avancées et créez vos propres événements sur EventEz.
        </p>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-start">
            <Star className="h-5 w-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-gray-600">Créez et gérez vos propres événements</p>
          </div>
          <div className="flex items-start">
            <Star className="h-5 w-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-gray-600">Accédez aux statistiques détaillées</p>
          </div>
          <div className="flex items-start">
            <Star className="h-5 w-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-gray-600">Gérez les paiements et les inscriptions</p>
          </div>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
            {error}
          </div>
        )}
        
        <button
          onClick={handleBecomeOrganizer}
          disabled={loading}
          className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Traitement...
            </>
          ) : (
            <>
              Devenir organisateur
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
