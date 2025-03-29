// components/dashboard/RegistrationList.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Registration } from '@/types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { registrationsAPI } from '@/lib/api';
import { formatDate, formatCurrency } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { FaUser, FaCalendarAlt, FaCheck, FaTimes, FaSpinner, FaEnvelope } from 'react-icons/fa';

interface RegistrationListProps {
  eventId?: string;
  limit?: number;
}

export default function RegistrationList({ eventId, limit = 10 }: RegistrationListProps) {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      // Handled by middleware
    },
  });
  
  useEffect(() => {
    if (status !== 'authenticated' || !session) {
      return;
    }
    
    const fetchRegistrations = async () => {
      setLoading(true);
      setError(null);
      try {
        // Paramètres pour l'API
        const params: any = { 
          organizer: 'me',
          limit,
          sort: '-created_at' // Tri par date de création (plus récent d'abord)
        };
        
        // Ajouter le filtre par événement si fourni
        if (eventId) {
          params.event = eventId;
        }
        
        const response = await registrationsAPI.getRegistrations(params);
        setRegistrations(response.data.results || []);
      } catch (error: any) {
        console.error('Error fetching registrations:', error);
        setError(error.response?.data?.detail || 'Une erreur est survenue lors du chargement des inscriptions');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRegistrations();
  }, [session, status, eventId, limit]);
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="flex items-center"><FaSpinner className="mr-1 h-3 w-3" /> En attente</Badge>;
      case 'confirmed':
        return <Badge variant="success" className="flex items-center"><FaCheck className="mr-1 h-3 w-3" /> Confirmée</Badge>;
      case 'cancelled':
        return <Badge variant="destructive" className="flex items-center"><FaTimes className="mr-1 h-3 w-3" /> Annulée</Badge>;
      case 'completed':
        return <Badge variant="default" className="flex items-center"><FaCheck className="mr-1 h-3 w-3" /> Terminée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <h3 className="text-lg font-medium text-red-800 mb-4">Erreur de chargement</h3>
        <p className="text-red-600 mb-6">{error}</p>
        <Button onClick={() => window.location.reload()}>
          Réessayer
        </Button>
      </div>
    );
  }
  
  if (registrations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <FaUser className="mx-auto h-12 w-12 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Aucune inscription trouvée</h3>
        <p className="mt-1 text-sm text-gray-500">
          Il n'y a pas encore d'inscriptions à afficher.
        </p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Participant
              </th>
              {!eventId && (
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Événement
                </th>
              )}
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {registrations.map((registration) => (
              <tr key={registration.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <FaUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {registration.form_data?.name || registration.form_data?.first_name || 'Utilisateur'}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {registration.form_data?.email || registration.reference_code}
                      </div>
                    </div>
                  </div>
                </td>
                
                {!eventId && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 truncate max-w-xs">
                      {registration.event_detail?.title || registration.event}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center">
                      <FaCalendarAlt className="mr-1 h-3 w-3" /> 
                      {registration.event_detail?.start_date 
                        ? formatDate(registration.event_detail.start_date) 
                        : ''}
                    </div>
                  </td>
                )}
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatDate(registration.created_at)}
                  </div>
                  {registration.confirmed_at && (
                    <div className="text-xs text-gray-500">
                      Confirmé: {formatDate(registration.confirmed_at)}
                    </div>
                  )}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(registration.status)}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={registration.registration_type === 'billetterie' ? 'info' : 'success'} className="text-xs">
                    {registration.registration_type === 'billetterie' ? 'Billetterie' : 'Inscription'}
                  </Badge>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Link 
                      href={`/dashboard/registration/${registration.id}`}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      Détails
                    </Link>
                    
                    <button 
                      className="text-gray-400 hover:text-gray-500"
                      title="Envoyer un email"
                    >
                      <FaEnvelope className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {registrations.length > 0 && (
        <div className="p-4 border-t border-gray-200 flex justify-center">
          <Button 
            href={eventId ? `/dashboard/event/${eventId}/registrations` : "/dashboard/registrations"} 
            variant="outline"
          >
            Voir toutes les inscriptions
          </Button>
        </div>
      )}
    </div>
  );
}