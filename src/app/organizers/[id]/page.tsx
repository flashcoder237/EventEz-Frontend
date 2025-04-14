'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import MainLayout from '../../../components/layout/MainLayout';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from '../../../components/ui/Button';
import { ArrowLeft, Calendar, Star, MapPin, Users, Mail, Phone, Globe, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import { usersAPI, eventsAPI } from '../../../lib/api';

// Type pour l'organisateur
interface Organizer {
  id: number;
  name: string;
  firstName?: string;
  lastName?: string;
  logo: string;
  category: string;
  rating: number;
  eventCount: number;
  location: string;
  description: string;
  email?: string;
  phone?: string;
  website?: string;
  isVerified: boolean;
  joinedDate?: string;
}

// Type pour les événements
interface Event {
  id: string;
  title: string;
  bannerImage: string;
  startDate: string;
  location: string;
  category: string;
  status: string;
}

export default function OrganizerProfilePage() {
  const router = useRouter();
  const { id } = useParams();
  const [organizer, setOrganizer] = useState<Organizer | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [activeTab, setActiveTab] = useState('events');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour formater une date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Fonction pour récupérer les données de l'organisateur
  const fetchOrganizerData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Récupérer les informations de l'organisateur
      const response = await usersAPI.getUser(Number(id));
      
      if (response.data) {
        const userData = response.data;
        const organizerData: Organizer = {
          id: userData.id,
          name: userData.company_name || `${userData.first_name} ${userData.last_name}`,
          firstName: userData.first_name,
          lastName: userData.last_name,
          logo: userData.organizer_profile?.logo || (userData.organizer_type === 'organization' ? '/images/defaults/organization.png' : '/images/defaults/user.png'),
          category: userData.organizer_type === 'organization' ? 'Organisation' : 'Individuel',
          rating: userData.organizer_profile?.rating || 4.5,
          eventCount: userData.organizer_profile?.event_count || 0,
          location: "Cameroun",
          description: userData.organizer_profile?.description || "Organisateur d'événements",
          email: userData.email,
          phone: userData.phone_number,
          website: userData.organizer_profile?.website,
          isVerified: userData.is_verified,
          joinedDate: userData.date_joined
        };
        
        setOrganizer(organizerData);
        
        // Récupérer les événements de l'organisateur
        fetchOrganizerEvents(userData.id);
      }
    } catch (err) {
      console.error("Erreur lors de la récupération des données de l'organisateur:", err);
      setError("Impossible de charger les données de l'organisateur. Veuillez réessayer plus tard.");
      
      // Utiliser des données de secours en cas d'erreur
      const fallbackOrganizer: Organizer = {
        id: Number(id),
        name: "Organisateur exemple",
        firstName: "John",
        lastName: "Doe",
        logo: "/images/team-1.jpg",
        category: "Organisation",
        rating: 4.8,
        eventCount: 24,
        location: "Douala, Cameroun",
        description: "Organisation d'événements culturels et artistiques dans la ville de Douala. Spécialiste des conférences professionnelles et des festivals.",
        email: "contact@exemple.com",
        phone: "+237 123 456 789",
        website: "https://www.exemple.com",
        isVerified: true,
        joinedDate: "2022-01-15"
      };
      
      setOrganizer(fallbackOrganizer);
      
      // Générer des événements fictifs
      const fallbackEvents = Array.from({ length: 4 }, (_, i) => ({
        id: `event-${i + 1}`,
        title: `Événement exemple ${i + 1}`,
        bannerImage: `/images/team-${(i % 4) + 1}.jpg`,
        startDate: new Date(Date.now() + (i * 86400000)).toISOString(),
        location: i % 2 === 0 ? "Douala, Cameroun" : "Yaoundé, Cameroun",
        category: i % 2 === 0 ? "Conférence" : "Festival",
        status: i < 2 ? "upcoming" : "past"
      }));
      
      setEvents(fallbackEvents as Event[]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour récupérer les événements de l'organisateur
  const fetchOrganizerEvents = async (organizerId: number) => {
    try {
      const response = await eventsAPI.getEvents({ organizer: organizerId });
      
      if (response.data && response.data.results) {
        const eventsData = response.data.results.map(event => ({
          id: event.id,
          title: event.title,
          bannerImage: event.banner_image || "/images/placeholder-image.png",
          startDate: event.start_date,
          location: event.location_city,
          category: event.category?.name || "Événement",
          status: new Date(event.start_date) > new Date() ? "upcoming" : "past"
        }));
        
        setEvents(eventsData);
      }
    } catch (err) {
      console.error("Erreur lors de la récupération des événements:", err);
      
      // Utiliser des données de secours en cas d'erreur
      const fallbackEvents = Array.from({ length: 4 }, (_, i) => ({
        id: `event-${i + 1}`,
        title: `Événement exemple ${i + 1}`,
        bannerImage: `/images/team-${(i % 4) + 1}.jpg`,
        startDate: new Date(Date.now() + (i * 86400000)).toISOString(),
        location: i % 2 === 0 ? "Douala, Cameroun" : "Yaoundé, Cameroun",
        category: i % 2 === 0 ? "Conférence" : "Festival",
        status: i < 2 ? "upcoming" : "past"
      }));
      
      setEvents(fallbackEvents as Event[]);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrganizerData();
    }
  }, [id]);

  // Obtenir les événements à venir et passés
  const upcomingEvents = events.filter(event => event.status === 'upcoming');
  const pastEvents = events.filter(event => event.status === 'past');

  // Obtenir les événements à afficher selon l'onglet actif
  const getDisplayEvents = () => {
    if (activeTab === 'events') return events;
    if (activeTab === 'upcoming') return upcomingEvents;
    if (activeTab === 'past') return pastEvents;
    return events;
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto pt-32 pb-20 flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-violet-600"></div>
        </div>
      </MainLayout>
    );
  }

  if (error || !organizer) {
    return (
      <MainLayout>
        <div className="container mx-auto pt-32 pb-20">
          <div className="flex items-center mb-6">
            <Button onClick={() => router.back()} className="bg-white text-violet-700 hover:bg-violet-50 mr-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
          </div>
          
          <div className="bg-red-50 text-red-700 p-8 rounded-lg text-center max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Organisateur non trouvé</h2>
            <p className="mb-6">{error || "Impossible de trouver les informations de cet organisateur."}</p>
            <div className="flex justify-center gap-4">
              <Button 
                onClick={() => fetchOrganizerData()}
                className="bg-violet-600 hover:bg-violet-700 text-white"
              >
                Réessayer
              </Button>
              <Button 
                href="/organizers"
                className="bg-white text-violet-700 hover:bg-violet-50 border border-violet-200"
              >
                Voir tous les organisateurs
              </Button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Header Section */}
      <section className="pt-32 pb-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-6">
            <Button onClick={() => router.back()} className="bg-white text-violet-700 hover:bg-violet-50 mr-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 h-48 relative">
              {organizer.isVerified && (
                <div className="absolute top-4 right-4 bg-white px-3 py-1.5 rounded-full flex items-center text-sm font-medium text-violet-700">
                  <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                  Vérifié
                </div>
              )}
            </div>
            
            <div className="px-6 py-8 md:px-8 relative">
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="flex-shrink-0 -mt-20 md:-mt-24 mb-4 md:mb-0 md:mr-6 relative">
                  <div className="h-32 w-32 md:h-40 md:w-40 rounded-full overflow-hidden border-4 border-white shadow-md">
                    <Image
                      src={organizer.logo}
                      alt={organizer.name}
                      width={160}
                      height={160}
                      className="object-cover"
                    />
                  </div>
                </div>
                
                <div className="flex-grow">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-1">{organizer.name}</h1>
                      <p className="text-violet-600 text-sm md:text-base mb-2">{organizer.category}</p>
                      <div className="flex items-center text-sm text-gray-600 mb-4">
                        <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                        <span>{organizer.location}</span>
                      </div>
                    </div>
                    
                    <div className="flex mt-4 md:mt-0 gap-2">
                      <div className="flex items-center bg-yellow-50 px-3 py-1.5 rounded-lg">
                        <Star className="h-5 w-5 text-yellow-500 mr-1" />
                        <span className="font-medium text-gray-900">{typeof organizer.rating === 'number' ? organizer.rating.toFixed(1) : 'Pas encore noté'}</span>
                      </div>
                      
                      <div className="flex items-center bg-gray-100 px-3 py-1.5 rounded-lg">
                        <Calendar className="h-5 w-5 text-gray-600 mr-1" />
                        <span className="font-medium text-gray-900">{organizer.eventCount} événements</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                <div className="md:col-span-2">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">À propos</h2>
                  <p className="text-gray-700 mb-6">{organizer.description}</p>
                  
                  {organizer.joinedDate && (
                    <div className="flex items-center text-sm text-gray-600 mt-4">
                      <Clock className="h-4 w-4 text-gray-500 mr-2" />
                      <span>Membre depuis {formatDate(organizer.joinedDate)}</span>
                    </div>
                  )}
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact</h3>
                  <ul className="space-y-4 mt-4">
                    {organizer.email && (
                      <li className="flex items-start">
                        <Mail className="h-5 w-5 text-violet-600 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Email</p>
                          <a href={`mailto:${organizer.email}`} className="text-gray-900 hover:text-violet-600">
                            {organizer.email}
                          </a>
                        </div>
                      </li>
                    )}
                    
                    {organizer.phone && (
                      <li className="flex items-start">
                        <Phone className="h-5 w-5 text-violet-600 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Téléphone</p>
                          <a href={`tel:${organizer.phone}`} className="text-gray-900 hover:text-violet-600">
                            {organizer.phone}
                          </a>
                        </div>
                      </li>
                    )}
                    
                    {organizer.website && (
                      <li className="flex items-start">
                        <Globe className="h-5 w-5 text-violet-600 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Site web</p>
                          <a 
                            href={organizer.website.startsWith('http') ? organizer.website : `https://${organizer.website}`} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-900 hover:text-violet-600"
                          >
                            {organizer.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                          </a>
                        </div>
                      </li>
                    )}
                  </ul>
                  
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white">
                      Contacter l'organisateur
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Events Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Événements</h2>
            
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('events')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'events'
                      ? 'border-violet-600 text-violet-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Tous ({events.length})
                </button>
                <button
                  onClick={() => setActiveTab('upcoming')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'upcoming'
                      ? 'border-violet-600 text-violet-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  À venir ({upcomingEvents.length})
                </button>
                <button
                  onClick={() => setActiveTab('past')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'past'
                      ? 'border-violet-600 text-violet-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Passés ({pastEvents.length})
                </button>
              </nav>
            </div>
            
            {getDisplayEvents().length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Aucun événement trouvé</h3>
                <p className="text-gray-500">
                  {activeTab === 'upcoming' 
                    ? "Il n'y a pas d'événements à venir pour cet organisateur." 
                    : activeTab === 'past' 
                      ? "Il n'y a pas d'événements passés pour cet organisateur."
                      : "Cet organisateur n'a pas encore d'événements."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getDisplayEvents().map((event) => (
                  <motion.div 
                    key={event.id}
                    className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    whileHover={{ y: -5 }}
                  >
                    <div className="relative h-48">
                      <Image
                        src={event.bannerImage}
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 p-4">
                        <div className="bg-violet-600 text-white text-xs px-2 py-1 rounded inline-block mb-2">
                          {event.category}
                        </div>
                        <h3 className="text-white font-bold text-lg line-clamp-2">{event.title}</h3>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <Calendar className="h-4 w-4 text-gray-500 mr-1 flex-shrink-0" />
                        <span>{formatDate(event.startDate)}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mb-4">
                        <MapPin className="h-4 w-4 text-gray-500 mr-1 flex-shrink-0" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                      <Button 
                        href={`/events/${event.id}`}
                        className="w-full text-sm py-1 bg-violet-50 text-violet-700 hover:bg-violet-100 border border-violet-200"
                      >
                        {event.status === 'upcoming' ? 'Voir détails' : 'Voir récapitulatif'}
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}