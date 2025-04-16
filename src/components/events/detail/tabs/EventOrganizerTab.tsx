'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Event } from 'types';
import { Button } from '@/components/ui/Button';
import { toast } from 'react-hot-toast';
import { 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  Globe, 
  Phone, 
  Send,
  CheckCircle,
  Award,
  LogIn
} from 'lucide-react';
import { eventsAPI } from '@/lib/api';
import { messagesAPI } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/lib/utils/dateUtils';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface EventOrganizerTabProps {
  event: Event;
}

export default function EventOrganizerTab({ event }: EventOrganizerTabProps) {
  const [organizerEvents, setOrganizerEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [contactFormVisible, setContactFormVisible] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [messageSent, setMessageSent] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [sendingMessage, setSendingMessage] = useState(false);
  
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession({
    required: false,
    onUnauthenticated() {
      // Normal d'être non authentifié sur la page d'événement
    },
  });

  // Vérifier si l'utilisateur est l'organisateur
  const isCurrentUserOrganizer = session?.user?.id === event.organizer?.id;
  const isAuthenticated = status === 'authenticated';

  // Récupérer ou créer une conversation à l'ouverture du formulaire
  useEffect(() => {
    if (contactFormVisible && isAuthenticated && !isCurrentUserOrganizer) {
      getOrCreateConversation();
    }
  }, [contactFormVisible, isAuthenticated, isCurrentUserOrganizer]);

  // Recherche des événements de l'organisateur
  useEffect(() => {
    const fetchOrganizerEvents = async () => {
      try {
        const response = await eventsAPI.getEvents({
          status: 'validated',
          limit: 5
        });
        const filteredEvents = response.data.results.filter(
          (e: Event) => e.organizer?.organizer_name === event.organizer?.organizer_name && e.id !== event.id
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

  // Fonction pour récupérer ou créer une conversation
  const getOrCreateConversation = async () => {
    if (!session?.user?.id || !event.organizer?.id) return;
    
    try {
      // Chercher si une conversation existe déjà
      const response = await messagesAPI.getConversations();
      
      // Vérifier la structure de la réponse
      const conversationsArray = Array.isArray(response.data) 
        ? response.data 
        : (response.data?.results || []);
      
      // Chercher une conversation existante entre les deux participants
      let existingConversation = conversationsArray.find(conv => 
        conv.participants.includes(session.user.id) && 
        conv.participants.includes(event.organizer.id)
      );
      
      if (existingConversation) {
        setConversationId(existingConversation.id);
      } else {
        // Créer une nouvelle conversation
        const newConversation = await messagesAPI.createConversation({
          participants: [session.user.id, event.organizer.id]
        });
        
        // Vérifier si la réponse a un id direct ou est imbriquée dans data
        const conversationId = newConversation.data?.id || newConversation.id;
        setConversationId(conversationId);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération/création de la conversation:', error);
      
      // Log détaillé pour le débogage
      if (error.response) {
        console.error('Détails de l\'erreur:', error.response.data);
      }
      
      toast.error('Impossible d\'établir une conversation avec l\'organisateur.');
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      toast.error('Vous devez être connecté pour envoyer un message.');
      return;
    }
    
    if (!contactMessage.trim()) {
      toast.error('Le message ne peut pas être vide.');
      return;
    }
    
    if (!conversationId) {
      toast.error('Impossible d\'établir une conversation. Veuillez réessayer.');
      return;
    }
    
    setSendingMessage(true);
    
    try {
      await messagesAPI.sendMessage({
        content: contactMessage,
        conversation: conversationId,
        sender: session.user.id
      });
      
      setMessageSent(true);
      toast.success('Message envoyé avec succès !');
      
      setTimeout(() => {
        setContactMessage('');
        setContactFormVisible(false);
        setMessageSent(false);
      }, 2000);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      
      // Gestion des erreurs spécifiques de validation
      if (error.response?.data) {
        const errorData = error.response.data;
        // Afficher les erreurs de validation spécifiques
        Object.entries(errorData).forEach(([field, messages]) => {
          const messageArray = Array.isArray(messages) ? messages : [messages];
          toast.error(`${field}: ${messageArray.join(', ')}`);
        });
      } else {
        toast.error('Une erreur est survenue lors de l\'envoi du message.');
      }
    } finally {
      setSendingMessage(false);
    }
  };

  const handleContactOrganizer = () => {
    if (!isAuthenticated) {
      // Rediriger vers la page de connexion avec le retour sur cette page
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    
    if (isCurrentUserOrganizer) {
      toast.error('Vous ne pouvez pas vous envoyer de messages à vous-même.');
      return;
    }
    
    setContactFormVisible(!contactFormVisible);
  };

  const goToOrganizerProfile = () => {
    router.push('/organizers/' + event.organizer.id);
  };

  const goToOrganizerEvents = () => {
    router.push('/organizers/' + event.organizer.id);
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
                {event.organizer.company_name || 'Organisateur'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Organisateur d'événements
              </p>
            </div>
          </div>
          
          {/* Organizer Description */}
          <div className="mb-6">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
             {event.organizer.organizer_profile?.description || 'Pas de description disponible.'}
            </p>
          </div>
          
          {/* Contact Information */}
          <div className="mb-6 space-y-3">
            <motion.div 
              className="flex items-center text-sm text-gray-600 dark:text-gray-400"
              whileHover={{ x: 5 }}
            >
              <Mail className="h-5 w-5 mr-3 text-primary" />
              <span>{event.organizer.email}</span>
            </motion.div>
            <motion.div 
              className="flex items-center text-sm text-gray-600 dark:text-gray-400"
              whileHover={{ x: 5 }}
            >
              <Phone className="h-5 w-5 mr-3 text-primary" />
              <span>{event.organizer.phone_number}</span>
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
            
            {/* Bouton de contact - adapté selon le statut de l'utilisateur */}
            {!isCurrentUserOrganizer && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="outline" 
                  className="inline-flex items-center"
                  onClick={handleContactOrganizer}
                >
                  {!isAuthenticated ? (
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      Se connecter pour contacter
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Contacter
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </div>
          
          {/* Message pour les organisateurs qui ne peuvent pas s'écrire à eux-mêmes */}
          {isCurrentUserOrganizer && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                Vous êtes l'organisateur de cet événement. Vous ne pouvez pas vous envoyer de messages.
              </p>
            </div>
          )}
          
          {/* Notification pour les utilisateurs non connectés */}
          {!isAuthenticated && contactFormVisible && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl mb-6"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <LogIn className="h-5 w-5 text-yellow-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                    Connexion requise
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-200">
                    <p>
                      Vous devez être connecté pour envoyer un message à l'organisateur. 
                      Connectez-vous pour continuer.
                    </p>
                  </div>
                  <div className="mt-4">
                    <Button
                      onClick={() => router.push(`/login?redirect=${encodeURIComponent(pathname)}`)}
                      className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white"
                    >
                      <LogIn className="mr-2 h-4 w-4" />
                      Se connecter
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Contact Form - visible uniquement pour les utilisateurs authentifiés qui ne sont pas l'organisateur */}
          <AnimatePresence>
            {contactFormVisible && isAuthenticated && !isCurrentUserOrganizer && (
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
                        disabled={sendingMessage}
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button 
                        type="submit" 
                        className="bg-primary hover:bg-primary-600 flex items-center"
                        disabled={sendingMessage}
                      >
                        {sendingMessage ? (
                          <>
                            <span className="inline-block h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            Envoi...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Envoyer
                          </>
                        )}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setContactFormVisible(false)}
                        disabled={sendingMessage}
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