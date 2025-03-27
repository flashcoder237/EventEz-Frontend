'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Event } from '@/types';
import { Button } from '@/components/ui/Button';
import { 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  Globe, 
  Phone, 
  Send,
  CheckCircle,
  Award
} from 'lucide-react';
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
  const [messageSent, setMessageSent] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchOrganizerEvents = async () => {
      try {
        const response = await eventsAPI.getEvents({
          status: 'validated',
          limit: 5
        });
        
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
    setMessageSent(true);
    setTimeout(() => {
      setContactMessage('');
      setContactFormVisible(false);
      setMessageSent(false);
    }, 2000);
  };

  const goToOrganizerProfile = () => {
    router.push('/organisateurs');
  };

  const goToOrganizerEvents = () => {
    router.push('/evenements');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto"
    >
      <motion.h2 
        className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-200 flex items-center"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <Award className="mr-4 text-primary" size={36} />
        À propos de l'organisateur
      </motion.h2>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 shadow-sm overflow-hidden"
      >
        <div className="p-6">
          {/* Organizer Header */}
          <div className="flex items-center mb-6">
            <motion.div 
              className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mr-6"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <User className="h-10 w-10 text-primary" />
            </motion.div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                {event.organizer_name || 'Organisateur'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Organisateur d'événements
              </p>
            </div>
          </div>
          
          {/* Organizer Description */}
          <div className="mb-6">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Organisateur actif sur la plateforme EventEz depuis 2021. Spécialisé dans 
              l'organisation d'événements professionnels et culturels au Cameroun.
              Notre équipe s'engage à offrir des expériences uniques et mémorables à nos participants.
            </p>
          </div>
          
          {/* Contact Information */}
          <div className="mb-6 space-y-3">
            <motion.div 
              className="flex items-center text-sm text-gray-600 dark:text-gray-400"
              whileHover={{ x: 5 }}
            >
              <Mail className="h-5 w-5 mr-3 text-primary" />
              <span>contact@{event.organizer_name?.toLowerCase().replace(/\s+/g, '')}.com</span>
            </motion.div>
            <motion.div 
              className="flex items-center text-sm text-gray-600 dark:text-gray-400"
              whileHover={{ x: 5 }}
            >
              <Phone className="h-5 w-5 mr-3 text-primary" />
              <span>+237 6XX XXX XXX</span>
            </motion.div>
            <motion.div 
              className="flex items-center text-sm text-gray-600 dark:text-gray-400"
              whileHover={{ x: 5 }}
            >
              <Globe className="h-5 w-5 mr-3 text-primary" />
              <span className="hover:underline cursor-pointer">
                www.{event.organizer_name?.toLowerCase().replace(/\s+/g, '')}.com
              </span>
            </motion.div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="outline" 
                className="inline-flex items-center"
                onClick={goToOrganizerProfile}
              >
                <User className="mr-2 h-4 w-4" />
                Voir le profil
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="outline" 
                className="inline-flex items-center"
                onClick={() => setContactFormVisible(!contactFormVisible)}
              >
                <Mail className="mr-2 h-4 w-4" />
                Contacter
              </Button>
            </motion.div>
          </div>
          
          {/* Contact Form */}
          <AnimatePresence>
            {contactFormVisible && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 p-6 bg-gray-50 dark:bg-gray-700 rounded-xl"
              >
                {messageSent ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-green-600 dark:text-green-400 flex items-center justify-center"
                  >
                    <CheckCircle className="mr-2 h-6 w-6" />
                    Message envoyé avec succès !
                  </motion.div>
                ) : (
                  <form onSubmit={handleContactSubmit}>
                    <h4 className="font-semibold mb-4 text-gray-800 dark:text-gray-200">
                      Envoyer un message à l'organisateur
                    </h4>
                    <div className="mb-4">
                      <textarea 
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-primary/50"
                        rows={4}
                        placeholder="Votre message pour l'organisateur..."
                        required
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button 
                        type="submit" 
                        className="bg-primary hover:bg-primary-600 flex items-center"
                      >
                        <Send className="mr-2 h-4 w-4" />
                        Envoyer
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setContactFormVisible(false)}
                      >
                        Annuler
                      </Button>
                    </div>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      
      {/* Other Events Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8"
      >
        <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
          Autres événements de cet organisateur
        </h3>
        
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((_, i) => (
              <div 
                key={i} 
                className="animate-pulse bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700"
              >
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : organizerEvents.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Aucun autre événement à venir de cet organisateur.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {organizerEvents.map(otherEvent => (
              <motion.div
                key={otherEvent.id}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Link 
                  href={`/events/${otherEvent.id}`}
                  className="block p-4 border rounded-lg hover:border-primary hover:shadow-sm transition-all bg-white dark:bg-gray-800 dark:border-gray-700"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-20 h-16 relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                      {otherEvent.banner_image ? (
                        <Image 
                          src={otherEvent.banner_image} 
                          alt={otherEvent.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Calendar className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary hover:text-primary-dark transition-colors">
                        {otherEvent.title}
                      </h4>
                      <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center mt-1">
                        <Calendar className="h-4 w-4 mr-2" />
                        {formatDate(otherEvent.start_date, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center mt-1">
                        <MapPin className="h-4 w-4 mr-2" />
                        {otherEvent.location_city}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}

            {organizerEvents.length > 0 && (
              <div className="pt-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={goToOrganizerEvents}
                >
                  Voir tous les événements de cet organisateur
                </Button>
              </div>
            )}
          </div>
        )}
      </motion.div>

      </motion.div>
  );
}
