'use client';

import { useState, useEffect, useCallback, useMemo, useTransition } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { 
  Calendar, 
  CreditCard, 
  Download, 
  Search,
  Filter,
  AlertTriangle,
  FileText,
  RefreshCw,
  Eye,
  RotateCw,
  CreditCard as CardIcon,
  Smartphone,
  Wallet,
  CircleDollarSign
} from 'lucide-react';
import { paymentsAPI, registrationsAPI, eventsAPI } from '@/lib/api';
import { Payment, Registration, Event } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useRouter } from 'next/navigation';

export default function PaymentsList() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [registrationsMap, setRegistrationsMap] = useState<Record<string, Registration>>({});
  const [eventsMap, setEventsMap] = useState<Record<string, Event>>({});
  const [refreshing, setRefreshing] = useState(false);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({ show: false, message: '', type: 'info' });

  // Fonction pour afficher une notification
  const showNotification = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ show: true, message, type });
    
    // Masquer la notification après 3 secondes
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  }, []);

  // Fonction de récupération des données
  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await paymentsAPI.getPayments();
      const paymentsData = response.data.results || [];
      setPayments(paymentsData);
      
      // Récupérer les détails des inscriptions
      const registrationIds = [...new Set(paymentsData.map(payment => payment.registration))];
      const registrationsData: Record<string, Registration> = {};
      const eventIds = new Set<string>();
      
      await Promise.all(
        registrationIds.map(async (registrationId) => {
          try {
            const registrationResponse = await registrationsAPI.getRegistration(registrationId);
            registrationsData[registrationId] = registrationResponse.data;
            if (registrationResponse.data.event) {
              eventIds.add(registrationResponse.data.event);
            }
          } catch (error) {
            console.error(`Erreur lors de la récupération de l'inscription ${registrationId}:`, error);
          }
        })
      );
      
      setRegistrationsMap(registrationsData);
      
      // Récupérer les détails des événements
      const eventsData: Record<string, Event> = {};
      
      await Promise.all(
        Array.from(eventIds).map(async (eventId) => {
          try {
            const eventResponse = await eventsAPI.getEvent(eventId);
            eventsData[eventId] = eventResponse.data;
          } catch (error) {
            console.error(`Erreur lors de la récupération de l'événement ${eventId}:`, error);
          }
        })
      );
      
      setEventsMap(eventsData);
    } catch (error) {
      console.error('Erreur lors de la récupération des paiements:', error);
      showNotification('Impossible de charger vos paiements', 'error');
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  // Fonction de rafraîchissement des données
  const refreshData = useCallback(() => {
    setRefreshing(true);
    startTransition(() => {
      fetchPayments().finally(() => {
        setRefreshing(false);
        showNotification('Données actualisées', 'success');
        router.refresh();
      });
    });
  }, [fetchPayments, router, showNotification]);

  // Effet pour charger les données au démarrage
  useEffect(() => {
    if (session) {
      fetchPayments();
    }
  }, [session, fetchPayments]);

  // Filtrer les paiements avec useMemo pour optimiser les performances
  const filteredPayments = useMemo(() => {
    let result = [...payments];
    
    // Filtrer par statut
    if (filter !== 'all') {
      result = result.filter(payment => payment.status === filter);
    }
    
    // Filtrer par terme de recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(payment => {
        const registration = registrationsMap[payment.registration];
        const event = registration ? eventsMap[registration.event] : null;
        
        return (
          payment.transaction_id?.toLowerCase().includes(term) || 
          payment.payment_method.toLowerCase().includes(term) ||
          (event && event.title.toLowerCase().includes(term))
        );
      });
    }
    
    return result;
  }, [payments, filter, searchTerm, registrationsMap, eventsMap]);

  // Fonction pour obtenir le badge de statut
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
            En attente
          </span>
        );
      case 'processing':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
            En cours
          </span>
        );
      case 'completed':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Complété
          </span>
        );
      case 'failed':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
            Échoué
          </span>
        );
      case 'refunded':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
            Remboursé
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
            Annulé
          </span>
        );
      default:
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  // Fonction pour obtenir l'icône de la méthode de paiement
  const getPaymentMethodIcon = useCallback((method: string) => {
    const methodLower = method.toLowerCase();
    
    if (methodLower.includes('card') || methodLower.includes('carte')) {
      return <CardIcon className="h-4 w-4 text-gray-400 mr-1.5" />;
    } else if (methodLower.includes('mobile') || methodLower.includes('momo') || methodLower.includes('om')) {
      return <Smartphone className="h-4 w-4 text-gray-400 mr-1.5" />;
    } else if (methodLower.includes('wallet') || methodLower.includes('portefeuille')) {
      return <Wallet className="h-4 w-4 text-gray-400 mr-1.5" />;
    } else {
      return <CircleDollarSign className="h-4 w-4 text-gray-400 mr-1.5" />;
    }
  }, []);

  // Fonction pour télécharger une facture
  const handleDownloadInvoice = useCallback(async (paymentId: string) => {
    try {
      showNotification('Téléchargement en cours...', 'info');
      // Ici, implémentez l'appel API pour télécharger la facture
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulation d'un appel API
      showNotification('Facture téléchargée avec succès', 'success');
    } catch (error) {
      console.error('Erreur lors du téléchargement de la facture:', error);
      showNotification('Impossible de télécharger la facture', 'error');
    }
  }, [showNotification]);

  // Fonction pour réessayer un paiement
  const handleRetryPayment = useCallback(async (paymentId: string) => {
    try {
      showNotification('Préparation du paiement...', 'info');
      // Ici, implémentez l'appel API pour réessayer le paiement
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulation d'un appel API
      
      // Mise à jour locale de l'état pour refléter le changement
      setPayments(prev => 
        prev.map(p => 
          p.id === paymentId ? { ...p, status: 'processing' } : p
        )
      );
      
      showNotification('Paiement relancé avec succès', 'success');
    } catch (error) {
      console.error('Erreur lors de la nouvelle tentative de paiement:', error);
      showNotification('Impossible de réessayer le paiement', 'error');
    }
  }, [showNotification]);

  // Squelette de chargement
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
          <div className="h-10 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-64 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="divide-y divide-gray-200">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 flex items-center space-x-4">
                <div className="flex-1">
                  <div className="space-y-2">
                    <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 w-32 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 w-64 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded-md shadow-md z-50 transition-opacity duration-300 ${
          notification.type === 'success' ? 'bg-green-100 text-green-800 border border-green-300' :
          notification.type === 'error' ? 'bg-red-100 text-red-800 border border-red-300' :
          'bg-blue-100 text-blue-800 border border-blue-300'
        }`}>
          {notification.message}
        </div>
      )}

      {/* En-tête avec bouton d'actualisation */}
      <div className="flex justify-between items-center">
       
        <button 
          onClick={refreshData} 
          disabled={refreshing || isPending}
          className={`inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${
            (refreshing || isPending) ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <RotateCw className={`h-4 w-4 mr-1.5 ${refreshing ? 'animate-spin' : ''}`} />
          Actualiser
        </button>
      </div>

      {/* Filtres et recherche */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0 gap-3">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="processing">En cours</option>
            <option value="completed">Complétés</option>
            <option value="failed">Échoués</option>
            <option value="refunded">Remboursés</option>
            <option value="cancelled">Annulés</option>
          </select>
        </div>
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            placeholder="Rechercher un paiement"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Liste des paiements */}
      {filteredPayments.length > 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredPayments.map((payment) => {
              const registration = registrationsMap[payment.registration];
              const event = registration ? eventsMap[registration.event] : null;
              
              return (
                <li key={payment.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center">
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-purple-600">
                              {event ? (
                                <Link href={`/events/${event.id}`} className="hover:underline">
                                  {event.title}
                                </Link>
                              ) : (
                                'Événement non disponible'
                              )}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">
                              Transaction: {payment.transaction_id || 'Non disponible'}
                            </p>
                            <p className="text-xs text-gray-500">
                              Méthode: {payment.payment_method}
                            </p>
                          </div>
                          <div className="flex items-center">
                            {getStatusBadge(payment.status)}
                          </div>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            <span>
                              {payment.payment_date 
                                ? format(new Date(payment.payment_date), 'PPP', { locale: fr })
                                : format(new Date(payment.created_at), 'PPP', { locale: fr })}
                            </span>
                          </div>
                          <span className="mx-1">•</span>
                          <div className="flex items-center">
                            {getPaymentMethodIcon(payment.payment_method)}
                            <span className="mr-1">{payment.payment_method}</span>
                          </div>
                          <span className="mx-1">•</span>
                          <div className="flex items-center">
                            <CreditCard className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            <span className="font-medium">
                              {payment.amount.toLocaleString()} {payment.currency}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0 flex space-x-2">
                        {registration && (
                          <button
                            className="inline-flex items-center p-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                            title="Voir les détails de l'inscription"
                            onClick={() => router.push(`/dashboard/registrations/${registration.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        )}
                        
                        {payment.invoice && (
                          <button
                            className="inline-flex items-center p-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                            title="Télécharger la facture"
                            onClick={() => handleDownloadInvoice(payment.id)}
                          >
                            <FileText className="h-4 w-4" />
                          </button>
                        )}
                        
                        {(payment.status === 'pending' || payment.status === 'failed') && (
                          <button
                            className="inline-flex items-center p-1.5 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            title="Réessayer le paiement"
                            onClick={() => handleRetryPayment(payment.id)}
                          >
                            <RefreshCw className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md p-6 text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-yellow-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun paiement trouvé</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filter !== 'all'
              ? 'Aucun paiement ne correspond à vos critères de recherche.'
              : 'Vous n\'avez pas encore effectué de paiement.'}
          </p>
          <div className="mt-6">
            <Link
              href="/events"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <Calendar className="mr-2 h-5 w-5" aria-hidden="true" />
              Découvrir des événements
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}