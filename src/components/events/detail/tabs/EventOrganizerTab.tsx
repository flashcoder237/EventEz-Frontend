// src/components/events/detail/tabs/EventOrganizerTab.tsx
'use client';

import { useState, useEffect } from 'react';
import { Event } from '@/types';
import { Button } from '@/components/ui/Button';
import { User, Mail, Calendar, MapPin, Globe, Phone } from 'lucide-react';
import { eventsAPI } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/lib/utils/dateUtils';
import { useRouter } from 'next/navigation';

interface EventOrganizerTabProps {
  event: Event;
}

export default function EventOrganizerTab({ event }: EventOrganizerTabProps) {
  const [organizerEvents, setOrganizerEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [contactFormVisible, setContactFormVisible] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchOrganizerEvents = async () => {
      try {
        // Dans une implémentation réelle, vous auriez un endpoint pour obtenir les événements d'un organisateur
        const response = await eventsAPI.getEvents({
          status: 'validated',
          limit: 5
        });
        
        // Simuler le filtrage par organisateur (puisque l'API n'a pas ce paramètre)
        const filteredEvents = response.data.results.filter(
          (e: Event) => e.organizer === event.organizer && e.id !== event.id
        );
        
        setOrganizerEvents(filteredEvents.slice(0, 3));
      } catch (error) {
        console.error('Erreur lors du chargement des événements de l\'organisateur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizerEvents();
  }, [event.organizer, event.id]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simuler l'envoi du message
    alert('Votre message a été envoyé à l\'organisateur');
    setContactMessage('');
    setContactFormVisible(false);
  };

  // Navigation programmatique (au lieu de Link)
  const goToOrganizerProfile = () => {
    // Naviguer vers une page statique, en attendant une meilleure implémentation
    router.push('/organisateurs');
  };

  const goToOrganizerEvents = () => {
    // Naviguer vers une page statique, en attendant une meilleure implémentation
    router.push('/evenements');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">À propos de l'organisateur</h2>
      
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mr-4">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold">{event.organizer_name || 'Organisateur'}</h3>
            <p className="text-gray-600">Organisateur d'événements</p>
          </div>
        </div>
        
        <div className="prose prose-sm max-w-none mb-6">
          <p className="text-gray-700">
            {/* Dans une implémentation réelle, vous afficheriez la description de l'organisateur */}
            Organisateur actif sur la plateforme EventEz depuis 2021. Spécialisé dans 
            l'organisation d'événements professionnels et culturels au Cameroun.
            Notre équipe s'engage à offrir des expériences uniques et mémorables à nos participants.
          </p>
          
          {/* Informations de contact simulées */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <Mail className="h-4 w-4 mr-2 text-gray-400" />
              <span>contact@{event.organizer_name?.toLowerCase().replace(/\s+/g, '')}.com</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="h-4 w-4 mr-2 text-gray-400" />
              <span>+237 6XX XXX XXX</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Globe className="h-4 w-4 mr-2 text-gray-400" />
              <span className="text-primary hover:underline cursor-pointer">
                www.{event.organizer_name?.toLowerCase().replace(/\s+/g, '')}.com
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Button 
            variant="outline" 
            className="inline-flex items-center"
            onClick={goToOrganizerProfile}
          >
            <User className="mr-2 h-4 w-4" />
            Voir le profil
          </Button>
          
          <Button 
            variant="outline" 
            className="inline-flex items-center"
            onClick={() => setContactFormVisible(!contactFormVisible)}
          >
            <Mail className="mr-2 h-4 w-4" />
            Contacter
          </Button>
        </div>
        
        {/* Formulaire de contact */}
        {contactFormVisible && (
          <div className="mt-6 p-4 border rounded-lg bg-white">
            <h4 className="font-medium mb-3">Envoyer un message à l'organisateur</h4>
            <form onSubmit={handleContactSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea 
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  rows={4}
                  placeholder="Votre message pour l'organisateur..."
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-primary">Envoyer</Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setContactFormVisible(false)}
                >
                  Annuler
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
      
      {/* Autres événements de l'organisateur */}
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Autres événements de cet organisateur</h3>
        
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((_, i) => (
              <div key={i} className="animate-pulse bg-white p-4 rounded-lg border">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : organizerEvents.length === 0 ? (
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <p className="text-gray-600">
              Aucun autre événement à venir de cet organisateur.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {organizerEvents.map(otherEvent => (
              <Link 
                key={otherEvent.id} 
                href={`/events/${otherEvent.id}`}
                className="block p-4 border rounded-lg hover:border-primary hover:shadow-sm transition-all bg-white"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-16 h-12 relative rounded overflow-hidden bg-gray-100">
                    {otherEvent.banner_image ? (
                      <Image 
                        src={otherEvent.banner_image} 
                        alt={otherEvent.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-primary hover:text-primary-dark transition-colors">
                      {otherEvent.title}
                    </h4>
                    <div className="text-sm text-gray-600 flex items-center mt-1">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(otherEvent.start_date, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                    <div className="text-sm text-gray-600 flex items-center mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      {otherEvent.location_city}
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {/* Voir plus d'événements - utiliser un Button au lieu d'un Link */}
            {organizerEvents.length > 0 && (
              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-sm"
                  onClick={goToOrganizerEvents}
                >
                  Voir tous les événements de cet organisateur
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Section bonus: Statistiques de l'organisateur */}
      <div className="mt-8 bg-white border rounded-lg p-4">
        <h3 className="text-lg font-medium mb-3">Statistiques de l'organisateur</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-2xl font-bold text-primary">
              {organizerEvents.length + 1}
            </p>
            <p className="text-xs text-gray-500">Événements</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-2xl font-bold text-primary">
              {Math.floor(Math.random() * 1000) + 100}
            </p>
            <p className="text-xs text-gray-500">Participants</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-2xl font-bold text-primary">
              4.{Math.floor(Math.random() * 10)}
            </p>
            <p className="text-xs text-gray-500">Évaluation</p>
          </div>
        </div>

        {/* Badges ou certifications */}
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Certifications</h4>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Organisateur vérifié
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Top événements
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              Pro depuis 2+ ans
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}