'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Event } from '@/types';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Heart, 
  Share2, 
  CreditCard, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  ArrowRight,
  Globe
} from 'lucide-react';
import { formatDate } from '@/lib/utils/dateUtils';

interface EventActionsProps {
  event: Event;
  ticketTypes?: any[];
  formFields?: any[];
}

export default function EventActions({ event, ticketTypes = [], formFields = [] }: EventActionsProps) {
  const [liked, setLiked] = useState(false);
  const [shareTooltip, setShareTooltip] = useState(false);
  
  const isBilletterie = event.event_type === 'billetterie';
  const isExpired = useMemo(() => new Date(event.end_date) < new Date(), [event.end_date]);
  
  // Enhanced registration deadline calculation
  const registrationDeadline = useMemo(() => {
    const now = new Date();
    const deadline = event.registration_deadline 
      ? new Date(event.registration_deadline) 
      : new Date(event.start_date);
    
    if (deadline <= now) return null;
    
    const diffTime = Math.abs(deadline.getTime() - now.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return { 
      days: diffDays, 
      hours: diffHours,
      percentage: Math.round((1 - diffTime / (new Date(event.start_date).getTime() - now.getTime())) * 100)
    };
  }, [event.registration_deadline, event.start_date]);
  
  const canRegister = !isExpired && registrationDeadline !== null;
  
  // Memoized full address
  const fullAddress = useMemo(() => {
    const parts = [
      event.location_address,
      event.location_city,
      event.location_country
    ].filter(Boolean);
    
    return parts.join(', ');
  }, [event.location_address, event.location_city, event.location_country]);
  
  // Optimized event sharing function
  const shareEvent = useCallback(async () => {
    const eventUrl = window.location.href;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: event.title,
          text: event.short_description || 'Découvrez cet événement',
          url: eventUrl
        });
      } else {
        await navigator.clipboard.writeText(eventUrl);
        setShareTooltip(true);
        setTimeout(() => setShareTooltip(false), 2000);
      }
    } catch (err) {
      console.error('Erreur lors du partage:', err);
    }
  }, [event.title, event.short_description]);

  // Render event status banner with more detailed information
  const renderEventStatusBanner = () => {
    if (isExpired) {
      return (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4 text-center flex flex-col items-center"
        >
          <AlertTriangle className="h-12 w-12 text-gray-400 dark:text-gray-600 mb-3" />
          <h3 className="font-bold text-xl text-gray-800 dark:text-gray-200 mb-2">
            Événement terminé
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm max-w-md">
            Cet événement a eu lieu le {formatDate(event.end_date, 'long')}.
            Consultez nos événements à venir pour ne rien manquer.
          </p>
        </motion.div>
      );
    } 
    
    if (registrationDeadline) {
      return (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 mb-4"
        >
          <h3 className="font-bold text-primary mb-3 text-center">
            Temps restant pour s'inscrire
          </h3>
          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                {registrationDeadline.days}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Jours</div>
            </div>
            <div className="text-2xl font-bold text-gray-400 dark:text-gray-600">:</div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                {registrationDeadline.hours}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Heures</div>
            </div>
          </div>
          {registrationDeadline.percentage > 0 && (
            <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
              <div 
                className="bg-primary h-1.5 rounded-full" 
                style={{ width: `${registrationDeadline.percentage}%` }}
              ></div>
            </div>
          )}
        </motion.div>
      );
    } 
    
    return (
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-yellow-50 dark:bg-yellow-900/30 rounded-lg p-4 mb-4 flex items-start"
      >
        <AlertTriangle className="h-5 w-5 text-yellow-500 dark:text-yellow-400 mt-0.5 mr-2 flex-shrink-0" />
        <div>
          <h3 className="font-bold text-gray-800 dark:text-gray-200">Inscription bientôt terminée</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            La date limite d'inscription approche. Dépêchez-vous !
          </p>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Action Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 shadow-sm p-6"
      >
        {/* Event Status */}
        {renderEventStatusBanner()}
        
        {/* Main Information and Actions */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700 dark:text-gray-300 font-medium">Prix</span>
            <span className="font-bold text-gray-900 dark:text-gray-100">
              {isBilletterie 
                ? (event.ticket_price_range || 'Gratuit')
                : 'Gratuit'
              }
            </span>
          </div>
          
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {isBilletterie 
              ? `${ticketTypes.length} type${ticketTypes.length > 1 ? 's' : ''} de billet disponible${ticketTypes.length > 1 ? 's' : ''}`
              : `${formFields.length} champ${formFields.length > 1 ? 's' : ''} à remplir`
            }
          </div>
          
          <Button 
            href={canRegister ? `/events/${event.id}/register` : undefined}
            className="w-full bg-gradient-to-r from-violet-600 to-pink-500 hover:from-violet-700 hover:to-pink-600 text-white border-0"
            disabled={!canRegister || (isBilletterie ? ticketTypes.length === 0 : formFields.length === 0)}
          >
            {isBilletterie 
              ? <><CreditCard className="mr-2 h-5 w-5" /> Acheter des billets</>
              : <><CheckCircle className="mr-2 h-5 w-5" /> S'inscrire</>
            }
          </Button>
        </div>
        
        {/* Additional Actions */}
        <div className="border-t dark:border-gray-700 pt-4 flex gap-2">
          <motion.div 
            className="flex-1"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant="outline" 
              className="w-full group"
              onClick={() => setLiked(!liked)}
            >
              <Heart 
                className={`mr-2 h-5 w-5 transition-all ${
                  liked ? 'fill-red-500 text-red-500' : 'group-hover:text-red-500'
                }`} 
              />
              {liked ? 'Aimé' : 'J\'aime'}
            </Button>
          </motion.div>
          
          <div className="relative flex-1">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="outline" 
                className="w-full"
                onClick={shareEvent}
              >
                <Share2 className="mr-2 h-5 w-5" />
                Partager
              </Button>
            </motion.div>
            
            <AnimatePresence>
              {shareTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded mb-2 whitespace-nowrap"
                >
                  Lien copié !
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
      
      {/* Important Information */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 shadow-sm p-6"
      >
        <h3 className="font-bold text-lg mb-4 flex items-center">
          <Info className="h-5 w-5 mr-2 text-primary" />
          Informations importantes
        </h3>
        
        <div className="space-y-4">
          {/* Date and Time */}
          <div className="flex items-start">
            <Calendar className="h-6 w-6 text-primary mr-3 mt-0.5" />
            <div>
              <p className="font-medium text-gray-800 dark:text-gray-200">Date et heure</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {formatDate(event.start_date, 'long')} à {new Date(event.start_date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Jusqu'au {formatDate(event.end_date, 'long')} à {new Date(event.end_date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
          
          {/* Location */}
          <div className="flex items-start">
            <MapPin className="h-6 w-6 text-primary mr-3 mt-0.5" />
            <div>
              <p className="font-medium text-gray-800 dark:text-gray-200">Lieu</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{event.location_name}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{event.location_address}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{event.location_city}, {event.location_country}</p>
              <motion.a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary text-xs mt-1 hover:underline"
                whileHover={{ scale: 1.05 }}
              >
                <Globe className="h-4 w-4 mr-1" />
                Voir sur la carte
              </motion.a>
            </div>
          </div>
          
          {/* Registration Deadline */}
          {event.registration_deadline && (
            <div className="flex items-start">
              <Clock className="h-6 w-6 text-primary mr-3 mt-0.5" />
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">Date limite d'inscription</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {formatDate(event.registration_deadline, 'long')} à {new Date(event.registration_deadline).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          )}
          
          {/* Participation */}
          <div className="flex items-start">
            <Users className="h-6 w-6 text-primary mr-3 mt-0.5" />
            <div>
              <p className="font-medium text-gray-800 dark:text-gray-200">Participation</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {event.registration_count} inscrit{event.registration_count !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Registration Button */}
        {!isExpired && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button 
              href={canRegister ? `/events/${event.id}/register` : undefined}
              variant="outline"
              className="w-full mt-4 inline-flex items-center justify-center"
              disabled={!canRegister}
            >
              <ArrowRight className="mr-2 h-4 w-4" />
              Continuer vers l'inscription
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
