'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Calendar, 
  Clock, 
  CreditCard, 
  Download, 
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Trash2,
  Eye,
  MapPin,
  ChevronDown,
  Plus,
  Ticket
} from 'lucide-react';
import { registrationsAPI, eventsAPI } from 'lib/api';
import { Registration, Event } from 'types';
import { format, formatDistance } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'react-hot-toast';

export default function RegistrationsListEnhanced() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [eventsMap, setEventsMap] = useState<Record<string, Event>>({});
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegistrations, setSelectedRegistrations] = useState<string[]>([]);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [registrationToCancel, setRegistrationToCancel] = useState<string | null>(null);

  useEffect(() => {
    const fetchRegistrations = async () => {
      if (!session) return;
      setLoading(true);
      try {
        const response = await registrationsAPI.getMyRegistrations();
        const registrationsData = response.data || [];
        setRegistrations(registrationsData);
        const eventIds = [...new Set(registrationsData.map(reg => reg.event))];
        const eventsData: Record<string, Event> = {};
        await Promise.all(
          eventIds.map(async (eventId) => {
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
        console.error('Erreur lors de la récupération des inscriptions:', error);
        toast.error('Impossible de charger vos inscriptions');
      } finally {
        setLoading(false);
      }
    };
    fetchRegistrations();
  }, [session]);

  const filteredRegistrations = useMemo(() => {
    return registrations.filter(registration => {
      const statusMatch = filter === 'all' || registration.status === filter;
      if (!searchTerm) return statusMatch;
      const term = searchTerm.toLowerCase();
      const event = eventsMap[registration.event];
      return statusMatch && (
        registration.reference_code.toLowerCase().includes(term) || 
        (event?.title && event.title.toLowerCase().includes(term)) ||
        (event?.location_city && event.location_city.toLowerCase().includes(term))
      );
    });
  }, [registrations, filter, searchTerm, eventsMap]);

  const isAllSelected = useMemo(() => {
    return filteredRegistrations.length > 0 && selectedRegistrations.length === filteredRegistrations.length;
  }, [selectedRegistrations, filteredRegistrations]);

  const toggleSelectRegistration = (id: string) => {
    setSelectedRegistrations(prev => 
      prev.includes(id) ? prev.filter(regId => regId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedRegistrations([]);
    } else {
      setSelectedRegistrations(filteredRegistrations.map(reg => reg.id));
    }
  };

  const confirmCancelRegistration = (registrationId: string) => {
    setRegistrationToCancel(registrationId);
    setIsConfirmDialogOpen(true);
  };

  const handleCancelRegistration = async () => {
    if (!registrationToCancel) return;
    try {
      await registrationsAPI.cancelRegistration(registrationToCancel);
      setRegistrations(prev => 
        prev.map(reg => 
          reg.id === registrationToCancel 
            ? { ...reg, status: 'cancelled' } 
            : reg
        )
      );
      toast.success('Inscription annulée avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'annulation de l\'inscription:', error);
      toast.error('Échec de l\'annulation de l\'inscription');
    } finally {
      setIsConfirmDialogOpen(false);
      setRegistrationToCancel(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'En attente' },
      confirmed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Confirmée' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Annulée' },
      completed: { bg: 'bg-indigo-100', text: 'text-indigo-800', label: 'Terminée' }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || 
                  { bg: 'bg-gray-100', text: 'text-gray-800', label: status };
    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-gray-900">Mes inscriptions</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gérez vos inscriptions, consultez leur statut et téléchargez vos billets.
          </p>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2 sm:items-center">
            {selectedRegistrations.length > 0 && (
              <button
                onClick={() => {
                  selectedRegistrations.forEach(id => confirmCancelRegistration(id));
                }}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Annuler ({selectedRegistrations.length})
              </button>
            )}
          </div>
          <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="relative flex items-center">
              <Filter className="absolute left-3 h-5 w-5 text-gray-400" />
              <select
                className="pl-10 pr-10 py-2 text-sm border-gray-300 focus:ring-purple-500 focus:border-purple-500 rounded-md shadow-sm w-full"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                aria-label="Filtrer par statut"
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="confirmed">Confirmées</option>
                <option value="cancelled">Annulées</option>
                <option value="completed">Terminées</option>
              </select>
              <ChevronDown className="absolute right-3 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-purple-500 focus:border-purple-500 shadow-sm"
                placeholder="Rechercher une inscription"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {filteredRegistrations.length > 0 ? (
        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-gray-50">
            <div className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                checked={isAllSelected}
                onChange={toggleSelectAll}
                id="select-all"
              />
              <label htmlFor="select-all" className="ml-2 text-sm text-gray-700">
                {selectedRegistrations.length > 0 ? `${selectedRegistrations.length} sélectionné(s)` : 'Sélectionner tout'}
              </label>
            </div>
            <div className="text-sm text-gray-500">
              {filteredRegistrations.length} inscription{filteredRegistrations.length > 1 ? 's' : ''}
            </div>
          </div>
          <ul className="divide-y divide-gray-200">
            {filteredRegistrations.map((registration) => {
              const event = eventsMap[registration.event];
              if (!event) return null;
              return (
                <li key={registration.id} className="hover:bg-gray-50 transition-colors duration-100">
                  <div className="px-4 py-4 sm:px-6 flex items-center">
                    <div className="mr-3">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        checked={selectedRegistrations.includes(registration.id)}
                        onChange={() => toggleSelectRegistration(registration.id)}
                      />
                    </div>
                    <div className="flex-shrink-0 h-16 w-16 relative rounded-md overflow-hidden">
                      <Image
                        src={event?.banner_image || '/images/defaults/default-event.png'}
                        alt={event?.title || 'Événement'}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="ml-4 flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-sm font-medium text-purple-600 truncate">
                            {event ? (
                              <Link href={`/events/${event.id}`} className="hover:underline">
                                {event.title}
                              </Link>
                            ) : (
                              'Événement non disponible'
                            )}
                          </h4>
                          <div className="mt-1 flex items-center">
                            <span className="text-xs text-gray-500 mr-2">
                              Réf: {registration.reference_code}
                            </span>
                            {getStatusBadge(registration.status)}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center text-xs text-gray-500 gap-x-4 gap-y-1">
                        <div className="flex items-center">
                          <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          <span>{format(new Date(event.start_date), 'PPP', { locale: fr })}</span>
                          <span className="ml-1 text-gray-400">({formatDistance(new Date(event.start_date), new Date(), { addSuffix: true, locale: fr })})</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          <span>{format(new Date(event.start_date), 'HH:mm')} - {format(new Date(event.end_date), 'HH:mm')}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          <span>{event.location_city}</span>
                        </div>
                        {registration.tickets && registration.tickets.length > 0 && (
                          <div className="flex items-center">
                            <CreditCard className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            <span>{registration.tickets.reduce((total, ticket) => total + ticket.total_price, 0).toLocaleString()} XAF</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex space-x-2">
                      <Link
                        href={`/dashboard/registrations/${registration.id}`}
                        className="inline-flex items-center p-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                        aria-label="Voir les détails"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      {registration.status === 'confirmed' && (
                        <button
                          onClick={() => toast('Fonctionnalité de téléchargement non implémentée')}
                          className="inline-flex items-center p-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                          aria-label="Télécharger les billets"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      )}
                      {(registration.status === 'pending' || registration.status === 'confirmed') && (
                        <button
                          onClick={() => confirmCancelRegistration(registration.id)}
                          className="inline-flex items-center p-1.5 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                          aria-label="Annuler l'inscription"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
            <AlertTriangle className="h-6 w-6 text-yellow-600" />
          </div>
          <h3 className="mt-3 text-sm font-medium text-gray-900">Aucune inscription trouvée</h3>
          <p className="mt-2 text-sm text-gray-500">
            {searchTerm || filter !== 'all' 
              ? 'Aucune inscription ne correspond à vos critères de recherche.' 
              : 'Vous n\'avez pas encore d\'inscriptions à des événements.'}
          </p>
          {!(searchTerm || filter !== 'all') && (
            <div className="mt-6">
              <Link
                href="/events"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
              >
                <Plus className="mr-2 -ml-1 h-5 w-5" />
                Découvrir des événements
              </Link>
            </div>
          )}
        </div>
      )}

      {isConfirmDialogOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Confirmer l'annulation
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Êtes-vous sûr de vouloir annuler cette inscription ? Selon les conditions de l'événement, les frais pourraient ne pas être remboursables.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                  onClick={handleCancelRegistration}
                >
                  Annuler l'inscription
                </button>
                <button 
                  type="button" 
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                  onClick={() => setIsConfirmDialogOpen(false)}
                >
                  Retour
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
