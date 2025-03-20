'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Event, TicketType, FormField, Feedback } from '@/types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/Tabs';
import { formatDate } from '@/lib/utils/dateUtils';
import { 
  Calendar, Clock, MapPin, Users, Share2, Heart, ChevronRight, 
  User, Star, MessageCircle, CheckCircle, AlertTriangle, CreditCard
} from 'lucide-react';

interface EventDetailProps {
  event: Event;
  ticketTypes?: TicketType[];
  formFields?: FormField[];
  feedbacks?: Feedback[];
}

export default function EventDetail({ event, ticketTypes = [], formFields = [], feedbacks = [] }: EventDetailProps) {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('details');
  const [liked, setLiked] = useState(false);
  
  const isExpired = useMemo(() => {
    return new Date(event.end_date) < new Date();
  }, [event.end_date]);
  
  const isBilletterie = event.event_type === 'billetterie';
  
  const calculateTimeRemaining = () => {
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
      hours: diffHours
    };
  };
  
  const timeRemaining = calculateTimeRemaining();
  const canRegister = !isExpired && timeRemaining !== null;
  
  const renderMetaItem = (icon: React.ReactNode, text: string) => (
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-gray-700">{text}</span>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="relative rounded-xl overflow-hidden mb-8">
        <div className="aspect-[21/9] relative">
          {event.banner_image ? (
            <Image 
              src={event.banner_image}
              alt={event.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-gray-700 to-gray-900 flex items-center justify-center">
              <Calendar className="text-gray-400 h-24 w-24" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30"></div>
        </div>
        
        {/* Event meta info on hero image */}
        <div className="absolute bottom-0 left-0 w-full px-6 py-8 text-white">
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
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{event.title}</h1>
          
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
        {/* Main Content */}
        <div className="w-full lg:w-2/3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList>
              <TabsTrigger value="details">Détails</TabsTrigger>
              {isBilletterie && <TabsTrigger value="tickets">Billets</TabsTrigger>}
              {!isBilletterie && <TabsTrigger value="registration">Inscription</TabsTrigger>}
              <TabsTrigger value="location">Lieu</TabsTrigger>
              <TabsTrigger value="organizer">Organisateur</TabsTrigger>
              <TabsTrigger value="reviews">Avis ({feedbacks.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="pt-6">
              <div className="prose prose-lg max-w-none">
                <h2 className="text-2xl font-bold mb-4">À propos de cet événement</h2>
                <div dangerouslySetInnerHTML={{ __html: event.description.replace(/\n/g, '<br />') }} />
                
                {event.tags && event.tags.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-xl font-bold mb-4">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map(tag => (
                        <Badge key={tag.id} variant="outline" className="px-3 py-1">
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            {isBilletterie && (
              <TabsContent value="tickets" className="pt-6">
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
                            
                            <div className="mt-4 flex items-center gap-4">
                              <span className="text-sm text-gray-500">
                                Disponible jusqu'au {formatDate(ticket.sales_end, 'short')}
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
              <TabsContent value="registration" className="pt-6">
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
            
            <TabsContent value="location" className="pt-6">
              <h2 className="text-2xl font-bold mb-6">Lieu de l'événement</h2>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-2">{event.location_name}</h3>
                <p className="text-gray-700 mb-4">{event.location_address}</p>
                <p className="text-gray-700">{event.location_city}, {event.location_country}</p>
                
                {/* Map placeholder - real implementation would use Google Maps or similar */}
                <div className="mt-6 bg-gray-200 rounded-lg h-80 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Carte non disponible</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="organizer" className="pt-6">
              <h2 className="text-2xl font-bold mb-6">À propos de l'organisateur</h2>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                    <User className="h-8 w-8 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{event.organizer_name || 'Organisateur'}</h3>
                    <p className="text-gray-600">Organisateur d'événements</p>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-6">
                  {/* Placeholder for organizer description */}
                  Organisateur actif sur la plateforme Eventez. Pour plus d'informations, contactez l'organisateur directement.
                </p>
                
                <Button variant="outline">
                  Voir le profil de l'organisateur
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="pt-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Avis et commentaires</h2>
                
                {session && !isExpired && (
                  <Button variant="outline" size="sm">
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
                          <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                            <User className="h-5 w-5 text-gray-400" />
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
        
        {/* Sidebar */}
        <div className="w-full lg:w-1/3 space-y-6">
          {/* Action Card */}
          <div className="bg-white rounded-xl border shadow-sm p-6">
            {isExpired ? (
              <div className="bg-gray-50 rounded-lg p-4 mb-4 text-center">
                <AlertTriangle className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                <h3 className="font-bold text-gray-800">Événement terminé</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Cet événement est déjà passé.
                </p>
              </div>
            ) : timeRemaining ? (
              <div className="bg-primary/10 rounded-lg p-4 mb-4">
                <h3 className="font-bold text-primary mb-1">Temps restant</h3>
                <div className="flex items-center justify-center gap-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">{timeRemaining.days}</div>
                    <div className="text-xs text-gray-600">Jours</div>
                  </div>
                  <div className="text-xl font-bold text-gray-400">:</div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">{timeRemaining.hours}</div>
                    <div className="text-xs text-gray-600">Heures</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 rounded-lg p-4 mb-4">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mb-1" />
                <h3 className="font-bold text-gray-800">Inscription bientôt terminée</h3>
                <p className="text-gray-600 text-sm">
                  La date limite d'inscription approche.
                </p>
              </div>
            )}
            
            {isBilletterie ? (
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700">Prix</span>
                  <span className="font-bold text-gray-900">
                    {/* Show ticket price range if available, otherwise "Gratuit" */}
                    {event.ticket_price_range || 'Gratuit'}
                  </span>
                </div>
                
                <div className="text-sm text-gray-500 mb-6">
                  {ticketTypes.length > 0 
                    ? `${ticketTypes.length} type${ticketTypes.length > 1 ? 's' : ''} de billet disponible${ticketTypes.length > 1 ? 's' : ''}`
                    : 'Aucun billet disponible actuellement'
                  }
                </div>
                
                <Button 
                  href={canRegister ? `/events/${event.id}/register` : undefined}
                  className="w-full"
                  disabled={!canRegister || ticketTypes.length === 0}
                >
                  <CreditCard className="mr-2 h-5 w-5" />
                  Acheter des billets
                </Button>
              </div>
            ) : (
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700">Participation</span>
                  <span className="font-bold text-gray-900">Gratuit</span>
                </div>
                
                <div className="text-sm text-gray-500 mb-6">
                  {formFields.length > 0 
                    ? `${formFields.length} champ${formFields.length > 1 ? 's' : ''} à remplir`
                    : 'Aucun formulaire disponible actuellement'
                  }
                </div>
                
                <Button 
                  href={canRegister ? `/events/${event.id}/register` : undefined}
                  className="w-full"
                  disabled={!canRegister || formFields.length === 0}
                >
                  <CheckCircle className="mr-2 h-5 w-5" />
                  S'inscrire
                </Button>
              </div>
            )}
            
            <div className="border-t pt-4 flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setLiked(!liked)}
              >
                <Heart className={`mr-2 h-5 w-5 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
                {liked ? 'Aimé' : 'J\'aime'}
              </Button>
              
              <Button variant="outline" className="flex-1">
                <Share2 className="mr-2 h-5 w-5" />
                Partager
              </Button>
            </div>
          </div>
          
          {/* Related Events */}
          <div className="rounded-xl border shadow-sm p-6">
            <h3 className="font-bold text-lg mb-4">Événements similaires</h3>
            <p className="text-gray-500 text-sm">Découvrez d'autres événements similaires à {event.title}</p>
            
            <div className="mt-4 space-y-4">
              {/* This would be populated with actual related events in a real implementation */}
              <div className="text-center py-8">
                <p className="text-gray-500">Aucun événement similaire trouvé.</p>
              </div>
            </div>
            
            <div className="mt-4">
              <Link 
                href={`/events?category=${event.category.id}`}
                className="text-primary flex items-center justify-center font-medium"
              >
                Voir plus dans {event.category.name}
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}