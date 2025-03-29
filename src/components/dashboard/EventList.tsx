// components/dashboard/EventList.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Event } from '@/types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { eventsAPI } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { FaCalendarAlt, FaEdit, FaEye, FaCopy, FaTrash, FaUsers, FaChartLine } from 'react-icons/fa';

export default function EventList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'past'>('all');
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      // La page du tableau de bord est protégée par le middleware, 
      // donc cette fonction ne devrait jamais être appelée
    },
  });
  useEffect(() => {
    // Ne charger les données que si l'utilisateur est connecté
    if (status !== 'authenticated' || !session) {
      return;
    }
    
    const fetchEvents = async () => {
      try {
        const response = await eventsAPI.getEvents({ organizer: 'me' });
        setEvents(response.data.results || []);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, [session, status]);

  // Si en cours de chargement ou pas de session, afficher un état de chargement
  if (status === 'loading' || !session) {
    return (
      <div className="space-y-4">
        {/* Affichage de chargement... */}
      </div>
    );
  }
  
  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.start_date);
    const today = new Date();
    
    if (activeTab === 'upcoming') {
      return eventDate > today;
    } else if (activeTab === 'past') {
      return eventDate < today;
    }
    
    return true;
  });
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline">Brouillon</Badge>;
      case 'published':
        return <Badge variant="secondary">Publié</Badge>;
      case 'validated':
        return <Badge variant="success">Validé</Badge>;
      case 'completed':
        return <Badge variant="default">Terminé</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Annulé</Badge>;
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
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Mes événements</h2>
        
        <Button href="/dashboard/create-event">
          Créer un événement
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'all'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('all')}
            >
              Tous ({events.length})
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'upcoming'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('upcoming')}
            >
              À venir
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'past'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('past')}
            >
              Passés
            </button>
          </div>
        </div>
        
        {filteredEvents.length === 0 ? (
          <div className="p-6 text-center">
            <FaCalendarAlt className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Aucun événement trouvé</h3>
            <p className="mt-1 text-sm text-gray-500">
              {activeTab === 'all'
                ? "Vous n'avez pas encore créé d'événement."
                : activeTab === 'upcoming'
                ? "Vous n'avez pas d'événements à venir."
                : "Vous n'avez pas d'événements passés."}
            </p>
            <div className="mt-6">
              <Button href="/dashboard/create-event">
                Créer un événement
              </Button>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredEvents.map((event) => (
              <div key={event.id} className="p-4 hover:bg-gray-50">
                <div className="sm:flex sm:items-center sm:justify-between">
                  <div className="sm:flex sm:items-center">
                    <div className="relative h-16 w-16 flex-shrink-0">
                      {event.banner_image ? (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${event.banner_image}`}
                          alt={event.title}
                          fill
                          className="rounded-md object-cover"
                        />
                      ) : (
                        <div className="h-16 w-16 rounded-md bg-primary/20 flex items-center justify-center">
                          <FaCalendarAlt className="h-6 w-6 text-primary/40" />
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 sm:mt-0 sm:ml-4">
                      <div className="flex items-center">
                        <h3 className="text-base font-medium text-gray-900 truncate max-w-md">
                          {event.title}
                        </h3>
                        <div className="ml-2">
                          {getStatusBadge(event.status)}
                        </div>
                      </div>
                      
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <span>{formatDate(event.start_date)}</span>
                        <span className="mx-1">•</span>
                        <span>{event.location_city}</span>
                        <span className="mx-1">•</span>
                        <Badge variant={event.event_type === 'billetterie' ? 'info' : 'success'} className="text-xs">
                          {event.event_type === 'billetterie' ? 'Billetterie' : 'Inscription'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex sm:mt-0">
                    <Link 
                      href={`/dashboard/event/${event.id}/analytics`}
                      className="mr-3 text-gray-400 hover:text-gray-500"
                    >
                      <FaChartLine className="h-5 w-5" />
                    </Link>
                    
                    <Link 
                      href={`/dashboard/event/${event.id}/registrations`}
                      className="mr-3 text-gray-400 hover:text-gray-500"
                    >
                      <FaUsers className="h-5 w-5" />
                    </Link>
                    
                    <Link 
                      href={`/events/${event.id}`} 
                      className="mr-3 text-gray-400 hover:text-gray-500"
                      target="_blank"
                    >
                      <FaEye className="h-5 w-5" />
                    </Link>
                    
                    <Link 
                      href={`/dashboard/event/${event.id}/edit`}
                      className="mr-3 text-gray-400 hover:text-gray-500"
                    >
                      <FaEdit className="h-5 w-5" />
                    </Link>
                    
                    <button 
                      className="mr-3 text-gray-400 hover:text-gray-500"
                      title="Dupliquer"
                    >
                      <FaCopy className="h-5 w-5" />
                    </button>
                    
                    <button 
                      className="text-red-400 hover:text-red-500"
                      title="Supprimer"
                    >
                      <FaTrash className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-3 gap-4 sm:grid-cols-4">
                  <div className="col-span-1">
                    <div className="flex items-center">
                      <FaUsers className="mr-2 h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500">
                        {event.registration_count || 0} inscriptions
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
