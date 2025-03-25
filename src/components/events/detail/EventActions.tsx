// src/components/events/detail/EventActions.tsx
'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Event } from '@/types';
import { Calendar, MapPin, Users, Clock, Heart, Share2, CreditCard, CheckCircle, AlertTriangle, Info, ArrowRight } from 'lucide-react';
import { formatDate, getDaysUntil } from '@/lib/utils/dateUtils';

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
  
  // Calculer le délai d'inscription restant
  const registrationDeadline = useMemo(() => {
    const now = new Date();
    const deadline = event.registration_deadline 
      ? new Date(event.registration_deadline) 
      : new Date(event.start_date);
    
    if (deadline <= now) return null;
    
    const diffTime = Math.abs(deadline.getTime() - now.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return { days: diffDays, hours: diffHours };
  }, [event.registration_deadline, event.start_date]);
  
  const canRegister = !isExpired && registrationDeadline !== null;
  
  // Formatte l'adresse complète
  const fullAddress = useMemo(() => {
    const parts = [
      event.location_address,
      event.location_city,
      event.location_country
    ].filter(Boolean);
    
    return parts.join(', ');
  }, [event.location_address, event.location_city, event.location_country]);
  
  // Fonction pour partager l'événement
  const shareEvent = async () => {
    const eventUrl = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.short_description || 'Découvrez cet événement',
          url: eventUrl
        });
      } catch (err) {
        console.error('Erreur lors du partage:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(eventUrl);
        setShareTooltip(true);
        setTimeout(() => setShareTooltip(false), 2000);
      } catch (err) {
        console.error('Erreur lors de la copie:', err);
      }
    }
  };

  // Rendu optimisé du bandeau d'alerte pour l'état de l'événement
  const renderEventStatusBanner = () => {
    if (isExpired) {
      return (
        <div className="bg-gray-50 rounded-lg p-4 mb-4 text-center">
          <AlertTriangle className="mx-auto h-10 w-10 text-gray-400 mb-2" />
          <h3 className="font-bold text-gray-800">Événement terminé</h3>
          <p className="text-gray-600 text-sm mt-1">
            Cet événement est déjà passé.
          </p>
        </div>
      );
    } 
    
    if (registrationDeadline) {
      return (
        <div className="bg-primary/10 rounded-lg p-4 mb-4">
          <h3 className="font-bold text-primary mb-1">Temps restant</h3>
          <div className="flex items-center justify-center gap-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{registrationDeadline.days}</div>
              <div className="text-xs text-gray-600">Jours</div>
            </div>
            <div className="text-xl font-bold text-gray-400">:</div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{registrationDeadline.hours}</div>
              <div className="text-xs text-gray-600">Heures</div>
            </div>
          </div>
        </div>
      );
    } 
    
    return (
      <div className="bg-yellow-50 rounded-lg p-4 mb-4 flex items-start">
        <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
        <div>
          <h3 className="font-bold text-gray-800">Inscription bientôt terminée</h3>
          <p className="text-gray-600 text-sm">
            La date limite d'inscription approche.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Action Card */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        {/* État de l'événement */}
        {renderEventStatusBanner()}
        
        {/* Informations et actions principales */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700 font-medium">Prix</span>
            <span className="font-bold text-gray-900">
              {isBilletterie 
                ? (event.ticket_price_range || 'Gratuit')
                : 'Gratuit'
              }
            </span>
          </div>
          
          <div className="text-sm text-gray-500 mb-6">
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
        
        {/* Actions supplémentaires */}
        <div className="border-t pt-4 flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1 group"
            onClick={() => setLiked(!liked)}
          >
            <Heart 
              className={`mr-2 h-5 w-5 transition-all ${
                liked ? 'fill-red-500 text-red-500' : 'group-hover:text-red-500'
              }`} 
            />
            {liked ? 'Aimé' : 'J\'aime'}
          </Button>
          
          <div className="relative flex-1">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={shareEvent}
            >
              <Share2 className="mr-2 h-5 w-5" />
              Partager
            </Button>
            
            {shareTooltip && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded mb-2 whitespace-nowrap">
                Lien copié !
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Informations importantes */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h3 className="font-bold text-lg mb-4 flex items-center">
          <Info className="h-4 w-4 mr-2 text-primary" />
          Informations importantes
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <Calendar className="h-5 w-5 text-primary mr-3 mt-0.5" />
            <div>
              <p className="font-medium">Date et heure</p>
              <p className="text-gray-600 text-sm">
                {formatDate(event.start_date, 'long')} à {new Date(event.start_date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className="text-gray-600 text-sm">
                Jusqu'au {formatDate(event.end_date, 'long')} à {new Date(event.end_date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <MapPin className="h-5 w-5 text-primary mr-3 mt-0.5" />
            <div>
              <p className="font-medium">Lieu</p>
              <p className="text-gray-600 text-sm">{event.location_name}</p>
              <p className="text-gray-600 text-sm">{event.location_address}</p>
              <p className="text-gray-600 text-sm">{event.location_city}, {event.location_country}</p>
            </div>
          </div>
          
          {event.registration_deadline && (
            <div className="flex items-start">
              <Clock className="h-5 w-5 text-primary mr-3 mt-0.5" />
              <div>
                <p className="font-medium">Date limite d'inscription</p>
                <p className="text-gray-600 text-sm">
                  {formatDate(event.registration_deadline, 'long')} à {new Date(event.registration_deadline).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          )}
          
          <div className="flex items-start">
            <Users className="h-5 w-5 text-primary mr-3 mt-0.5" />
            <div>
              <p className="font-medium">Participation</p>
              <p className="text-gray-600 text-sm">
                {event.registration_count} inscrit{event.registration_count !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {isExpired ? null : (
          <Button 
            href={canRegister ? `/events/${event.id}/register` : undefined}
            variant="outline"
            className="w-full mt-4 inline-flex items-center justify-center"
            disabled={!canRegister}
          >
            <ArrowRight className="mr-2 h-4 w-4" />
            Continuer vers l'inscription
          </Button>
        )}
      </div>
    </div>
  );
}