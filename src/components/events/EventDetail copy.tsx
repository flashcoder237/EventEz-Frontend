'use client';

import { useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Event, TicketType, FormField, Feedback } from '@/types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/Tabs';
import { formatDate, getDaysUntil } from '@/lib/utils/dateUtils';
import { 
  Calendar, Clock, MapPin, Users, Share2, Heart, ChevronRight, 
  User, Star, MessageCircle, CheckCircle, AlertTriangle, CreditCard,
  Info, ArrowRight, Copy, Mail
} from 'lucide-react';

interface EventDetailProps {
  event: Event;
  ticketTypes?: TicketType[];
  formFields?: FormField[];
  feedbacks?: Feedback[];
}

export default function EventDetail({ 
  event, 
  ticketTypes = [], // Fournir un tableau vide par défaut
  formFields = [], 
  feedbacks = [] 
}: EventDetailProps) {
  const { data: session, status } = useSession({
    required: false,
    onUnauthenticated() {
      // Pas besoin de rediriger ici, l'événement peut être consulté par tous
    },
  });
  const [activeTab, setActiveTab] = useState('details');
  const [liked, setLiked] = useState(false);
  const [shareTooltip, setShareTooltip] = useState(false);
  
  // Extraire les données de l'événement pour éviter les calculs répétés
  const isBilletterie = event.event_type === 'billetterie';
  const isExpired = useMemo(() => new Date(event.end_date) < new Date(), [event.end_date]);
  const daysRemaining = useMemo(() => getDaysUntil(event.registration_deadline || event.start_date), 
  [event.registration_deadline, event.start_date]);
  
  // Calculer le délai d'inscription restant
  const canLeaveReview = session?.user && !isExpired;
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
  const shareEvent = useCallback(async () => {
    const eventUrl = `${window.location.origin}/events/${event.id}`;
    
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
  }, [event.id, event.title, event.short_description]);
  
  // Fonction de rendu pour les éléments de métadonnées
  const renderMetaItem = useCallback((icon: React.ReactNode, text: string) => (
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-gray-700">{text}</span>
    </div>
  ), []);

  // Afficher le décompte du temps restant de manière optimisée
  const renderTimeRemaining = useCallback(() => {
    if (!registrationDeadline) return null;
    
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
  }, [registrationDeadline]);

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
      return renderTimeRemaining();
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
    <div className="max-w-6xl mx-auto">
      {/* Hero Section - Optimisé pour le chargement progressif et l'aspect visuel */}
      <div className="relative rounded-xl overflow-hidden mb-8 shadow-lg">
        <div className="aspect-[21/9] relative">
          {event.banner_image ? (
            <Image 
              src={event.banner_image}
              alt={event.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              className="object-cover"
              priority
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMDAgMjAwIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2NjY2NjYyIvPjwvc3ZnPg=="
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-gray-700 to-gray-900 flex items-center justify-center">
              <Calendar className="text-gray-400 h-24 w-24" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>
        </div>
        
        {/* Event meta info sur l'image */}
        <div className="absolute bottom-0 left-0 w-full px-6 py-8 text-white animate-fade-in-delayed">
          <div className="flex flex-wrap gap-3 mb-3">
            <Badge 
              variant={isBilletterie ? "info" : "success"} 
              className="px-3 py-1"
            >
              {isBilletterie ? 'Billetterie' : 'Inscription'}
            </Badge>
            
            <Badge variant="secondary" className="px-3 py-1">
              {event.category.name}
            </Badge>
            
            {event.is_featured && (
              <Badge variant="warning" className="px-3 py-1 bg-amber-500">
                En vedette
              </Badge>
            )}
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4 drop-shadow-sm">{event.title}</h1>
          
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {renderMetaItem(
              <Calendar className="h-5 w-5 text-primary" />,
              formatDate(event.start_date, 'long')
            )}
            
            {renderMetaItem(
              <Clock className="h-5 w-5 text-primary" />,
              `${new Date(event.start_date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - ${new Date(event.end_date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`
            )}
            
            {renderMetaItem(
              <MapPin className="h-5 w-5 text-primary" />,
              `${event.location_name}, ${event.location_city}`
            )}
            
            {renderMetaItem(
              <Users className="h-5 w-5 text-primary" />,
              `${event.registration_count} inscrit${event.registration_count !== 1 ? 's' : ''}`
            )}
          </div>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Contenu principal */}
        <div className="w-full lg:w-2/3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="mb-2">
              <TabsTrigger value="details">Détails</TabsTrigger>
              {isBilletterie && <TabsTrigger value="tickets">Billets</TabsTrigger>}
              {!isBilletterie && <TabsTrigger value="registration">Inscription</TabsTrigger>}
              <TabsTrigger value="location">Lieu</TabsTrigger>
              <TabsTrigger value="organizer">Organisateur</TabsTrigger>
              <TabsTrigger value="reviews">Avis ({feedbacks.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="pt-6 animate-fade-in">
              <div className="prose prose-lg max-w-none">
                <h2 className="text-2xl font-bold mb-4">À propos de cet événement</h2>
                <div className="text-gray-700 leading-relaxed space-y-4">
                  {event.description.split('\n\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
                
                {event.tags && event.tags.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-xl font-bold mb-4">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map(tag => (
                        <Badge key={tag.id} variant="outline" className="px-3 py-1 bg-gray-50 hover:bg-gray-100 transition-colors">
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            {isBilletterie && (
              <TabsContent value="tickets" className="pt-6 animate-fade-in">
                <h2 className="text-2xl font-bold mb-6">Billets disponibles</h2>
                
                {ticketTypes.length === 0 ? (
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Aucun billet n'est disponible pour cet événement.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {ticketTypes.map(ticket => (
                      <div key={ticket.id} className="border rounded-lg p-6 transition-all hover:border-primary hover:shadow-sm">
                        <div className="flex flex-wrap justify-between items-start gap-4">
                          <div>
                            <h3 className="text-lg font-bold">{ticket.name}</h3>
                            <p className="text-gray-600 mt-1">{ticket.description || 'Aucune description'}</p>
                            
                            <div className="mt-4 flex flex-wrap items-center gap-4">
                              <span className="text-sm text-gray-500 flex items-center">
                                <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                                Jusqu'au {formatDate(ticket.sales_end, 'short')}
                              </span>
                              
                              {ticket.available_quantity > 0 ? (
                                <span className="text-sm text-green-600 flex items-center">
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  {ticket.available_quantity} disponible{ticket.available_quantity > 1 ? 's' : ''}
                                </span>
                              ) : (
                                <span className="text-sm text-red-600 flex items-center">
                                  <AlertTriangle className="h-4 w-4 mr-1" />
                                  Épuisé
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">
                              {ticket.price > 0 ? `${ticket.price.toLocaleString()} XAF` : 'Gratuit'}
                            </div>
                            
                            {ticket.available_quantity > 0 && canRegister && (
                              <div className="mt-4">
                                <Button 
                                  size="sm"
                                  onClick={() => {}}
                                  disabled={isExpired}
                                  className="bg-primary hover:bg-primary-dark transition-colors"
                                >
                                  Sélectionner
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            )}
            
            {!isBilletterie && (
              <TabsContent value="registration" className="pt-6 animate-fade-in">
                <h2 className="text-2xl font-bold mb-6">Informations d'inscription</h2>
                
                {formFields.length === 0 ? (
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Aucun champ de formulaire n'est défini pour cet événement.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <p className="text-gray-700">
                      Pour vous inscrire à cet événement, vous devrez fournir les informations suivantes :
                    </p>
                    
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-medium mb-4">Champs requis</h3>
                      <ul className="space-y-3">
                        {formFields.map(field => (
                          <li key={field.id} className="flex items-start">
                            <CheckCircle className={`h-5 w-5 mr-2 ${field.required ? 'text-primary' : 'text-gray-400'}`} />
                            <div>
                              <span className="font-medium">{field.label}</span>
                              {field.required && <span className="text-red-500 ml-1">*</span>}
                              {field.help_text && (
                                <p className="text-sm text-gray-500 mt-1">{field.help_text}</p>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </TabsContent>
            )}
            
            <TabsContent value="location" className="pt-6 animate-fade-in">
              <h2 className="text-2xl font-bold mb-6">Lieu de l'événement</h2>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-2">{event.location_name}</h3>
                <p className="text-gray-700 mb-4">{fullAddress}</p>
                
                {/* Ajout d'actions pour la localisation */}
                <div className="flex flex-wrap gap-3 mt-4 mb-6">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="inline-flex items-center"
                    onClick={() => {
                      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
                      window.open(mapsUrl, '_blank');
                    }}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Voir sur Google Maps
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="inline-flex items-center"
                    onClick={() => navigator.clipboard.writeText(fullAddress)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copier l'adresse
                  </Button>
                </div>
                
                {/* Map placeholder - real implementation would use Google Maps or similar */}
                <div className="mt-6 bg-gray-200 rounded-lg h-80 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Carte non disponible</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="organizer" className="pt-6 animate-fade-in">
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
                
                <p className="text-gray-700 mb-6">
                  {/* Placeholder for organizer description */}
                  Organisateur actif sur la plateforme EventEz. Pour plus d'informations, contactez l'organisateur directement.
                </p>
                
                <div className="flex flex-wrap gap-3">
                  <Button 
                    variant="outline" 
                    className="inline-flex items-center"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Voir le profil
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="inline-flex items-center"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Contacter
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="pt-6 animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Avis et commentaires</h2>
                
                {status !== 'loading' && session?.user && !isExpired && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="inline-flex items-center"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Laisser un avis
                  </Button>
                )}
              </div>
              
              {feedbacks.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Aucun avis n'a encore été laissé pour cet événement.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {feedbacks.map(feedback => (
                    <div key={feedback.id} className="border-b pb-6 last:border-0">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{feedback.user_name}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(feedback.created_at).toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-5 w-5 ${i < feedback.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-3 text-gray-700">
                        {feedback.comment}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Sidebar - Réorganisé pour une meilleure UX */}
        <div className="w-full lg:w-1/3 space-y-6">
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
          
          {/* Informations importantes - Nouvelle section */}
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
          
          {/* Related Events */}
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h3 className="font-bold text-lg mb-4">Événements similaires</h3>
            
            <div className="space-y-4">
              {/* This would be populated with actual related events in a real implementation */}
              <div className="text-center py-6">
                <p className="text-gray-500 mb-3">Aucun événement similaire trouvé.</p>
                <Button
                  href={`/events?category=${event.category.id}`}
                  variant="outline"
                  size="sm"
                  className="inline-flex items-center"
                >
                  Explorer {event.category.name}
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Partager l'événement - Section supplémentaire pour les options de partage */}
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h3 className="font-bold text-lg mb-4">Partager l'événement</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="inline-flex items-center justify-center"
                onClick={() => {
                  const text = `Découvrez ${event.title} sur EventEz! ${window.location.href}`;
                  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="#25D366">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </Button>
              
              <Button
                variant="outline"
                className="inline-flex items-center justify-center"
                onClick={() => {
                  const url = window.location.href;
                  const text = `Découvrez ${event.title} sur EventEz!`;
                  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`, '_blank');
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </Button>
              
              <Button
                variant="outline"
                className="inline-flex items-center justify-center"
                onClick={() => {
                  const text = `Découvrez ${event.title}`;
                  const url = window.location.href;
                  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="#1DA1F2">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
                Twitter
              </Button>
              
              <Button
                variant="outline"
                className="inline-flex items-center justify-center"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setShareTooltip(true);
                  setTimeout(() => setShareTooltip(false), 2000);
                }}
              >
                <Copy className="h-5 w-5 mr-2" />
                Copier le lien
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}