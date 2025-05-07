'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Calendar, 
  Users, 
  CreditCard, 
  Edit, 
  Trash2, 
  Eye, 
  AlertTriangle,
  Filter,
  Search,
  Plus,
  ChevronDown
} from 'lucide-react';
import { eventsAPI } from '@/lib/api';
import { Event } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'react-hot-toast';

export default function EventsListEnhanced() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchEvents = async () => {
      if (!session) return;
      setLoading(true);
      try {
        const response = await eventsAPI.getMyEvents();
        setEvents(response.data || []);
      } catch (error) {
        console.error('Erreur lors de la récupération des événements:', error);
        toast.error('Impossible de charger les événements');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [session]);

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const statusMatch = filter === 'all' || event.status === filter;
      const searchMatch = 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.short_description && event.short_description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase());
      return statusMatch && searchMatch;
    });
  }, [events, filter, searchTerm]);

  const isAllSelected = useMemo(() => {
    return filteredEvents.length > 0 && selectedEvents.length === filteredEvents.length;
  }, [selectedEvents, filteredEvents]);

  const toggleSelectEvent = (id: string) => {
    setSelectedEvents(prev => 
      prev.includes(id) ? prev.filter(eventId => eventId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedEvents([]);
    } else {
      setSelectedEvents(filteredEvents.map(event => event.id));
    }
  };

  const confirmDeleteEvent = (eventId: string) => {
    setEventToDelete(eventId);
    setIsConfirmDialogOpen(true);
  };

  const handleDeleteEvent = async () => {
    if (!eventToDelete) return;
    try {
      await eventsAPI.deleteEvent(eventToDelete);
      setEvents(prev => prev.filter(event => event.id !== eventToDelete));
      toast.success('Événement supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'événement:', error);
      toast.error('Échec de la suppression de l\'événement');
    } finally {
      setIsConfirmDialogOpen(false);
      setEventToDelete(null);
    }
  };

  const deleteSelectedEvents = async () => {
    if (selectedEvents.length === 0) return;
    try {
      await Promise.all(selectedEvents.map(id => eventsAPI.deleteEvent(id)));
      setEvents(prev => prev.filter(event => !selectedEvents.includes(event.id)));
      setSelectedEvents([]);
      toast.success(`${selectedEvents.length} événements supprimés avec succès`);
    } catch (error) {
      console.error('Erreur lors de la suppression des événements:', error);
      toast.error('Échec de la suppression des événements');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Brouillon' },
      published: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Publié' },
      validated: { bg: 'bg-green-100', text: 'text-green-800', label: 'Validé' },
      completed: { bg: 'bg-indigo-100', text: 'text-indigo-800', label: 'Terminé' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Annulé' }
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
          <h1 className="text-xl font-semibold text-gray-900">Mes événements</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gérez vos événements, consultez leur statut et créez-en de nouveaux.
          </p>
        </div>
        <div className="flex-shrink-0">
          <Link
            href="/dashboard/events/create"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
          >
            <Plus className="mr-2 h-4 w-4" />
            Créer un événement
          </Link>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2 sm:items-center">
            {selectedEvents.length > 0 && (
              <button
                onClick={deleteSelectedEvents}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer ({selectedEvents.length})
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
                <option value="draft">Brouillons</option>
                <option value="published">Publiés</option>
                <option value="validated">Validés</option>
                <option value="completed">Terminés</option>
                <option value="cancelled">Annulés</option>
              </select>
              <ChevronDown className="absolute right-3 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-purple-500 focus:border-purple-500 shadow-sm"
                placeholder="Rechercher un événement"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {filteredEvents.length > 0 ? (
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
                {selectedEvents.length > 0 ? `${selectedEvents.length} sélectionné(s)` : 'Sélectionner tout'}
              </label>
            </div>
            <div className="text-sm text-gray-500">
              {filteredEvents.length} événement{filteredEvents.length > 1 ? 's' : ''}
            </div>
          </div>
          <ul className="divide-y divide-gray-200">
            {filteredEvents.map((event) => (
              <li key={event.id} className="hover:bg-gray-50 transition-colors duration-100">
                <div className="px-4 py-4 sm:px-6 flex items-center">
                  <div className="mr-3">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      checked={selectedEvents.includes(event.id)}
                      onChange={() => toggleSelectEvent(event.id)}
                    />
                  </div>
                  <div className="flex-shrink-0 h-16 w-16 relative rounded-md overflow-hidden">
                    <Image
                      src={event.banner_image || '/images/defaults/default-event.png'}
                      alt={event.title}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="ml-4 flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-medium text-purple-600 truncate">
                          <Link href={`/events/${event.id}`} className="hover:underline">
                            {event.title}
                          </Link>
                        </h4>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {event.short_description || (event.description ? event.description.substring(0, 100) : '') + '...'}
                        </p>
                      </div>
                      <div className="flex-shrink-0 ml-2">
                        {getStatusBadge(event.status)}
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center text-xs text-gray-500 gap-x-4 gap-y-1">
                      <div className="flex items-center">
                        <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        <span>{format(new Date(event.start_date), 'PPP', { locale: fr })}</span>
                      </div>
                      {event.category && (
                        <div className="flex items-center">
                          <span className="mr-1.5 h-4 w-4 text-gray-400">{event.category.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex items-center space-x-2">
                    <Link
                      href={`/events/${event.id}`}
                      className="inline-flex items-center p-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                      aria-label="Voir"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/dashboard/events/${event.id}/edit`}
                      className="inline-flex items-center p-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                      aria-label="Modifier"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => confirmDeleteEvent(event.id)}
                      className="inline-flex items-center p-1.5 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                      aria-label="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
            <AlertTriangle className="h-6 w-6 text-yellow-600" />
          </div>
          <h3 className="mt-3 text-sm font-medium text-gray-900">Aucun événement trouvé</h3>
          <p className="mt-2 text-sm text-gray-500">
            {searchTerm || filter !== 'all' 
              ? 'Aucun événement ne correspond à vos critères de recherche.' 
              : 'Vous n\'avez pas encore créé d\'événement.'}
          </p>
          {!(searchTerm || filter !== 'all') && (
            <div className="mt-6">
              <Link
                href="/dashboard/events/create"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
              >
                <Plus className="mr-2 -ml-1 h-5 w-5" />
                Créer un événement
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
                      Confirmer la suppression
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Êtes-vous sûr de vouloir supprimer cet événement ? Cette action est irréversible.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                  onClick={handleDeleteEvent}
                >
                  Supprimer
                </button>
                <button 
                  type="button" 
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                  onClick={() => setIsConfirmDialogOpen(false)}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
