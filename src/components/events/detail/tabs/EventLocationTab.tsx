// src/components/events/detail/tabs/EventLocationTab.tsx
'use client';

import { useState } from 'react';
import { Event } from '@/types';
import { Button } from '@/components/ui/Button';
import { MapPin, Copy, ExternalLink, Map, MapIcon } from 'lucide-react';

interface EventLocationTabProps {
  event: Event;
}

export default function EventLocationTab({ event }: EventLocationTabProps) {
  const [copyTooltip, setCopyTooltip] = useState(false);

  const fullAddress = [
    event.location_address,
    event.location_city,
    event.location_country
  ].filter(Boolean).join(', ');

  const copyAddress = () => {
    navigator.clipboard.writeText(fullAddress);
    setCopyTooltip(true);
    setTimeout(() => setCopyTooltip(false), 2000);
  };

  const openInMaps = () => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
    window.open(mapsUrl, '_blank');
  };

  const openInOpenStreetMap = () => {
    // Utilisez l'adresse texte pour la recherche dans OpenStreetMap
    const osmUrl = `https://www.openstreetmap.org/search?query=${encodeURIComponent(fullAddress)}`;
    window.open(osmUrl, '_blank');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Lieu de l'événement</h2>
      
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-2">{event.location_name}</h3>
        <p className="text-gray-700 mb-4">{fullAddress}</p>
        
        <div className="flex flex-wrap gap-3 mt-4 mb-6">
          <Button 
            variant="outline" 
            size="sm"
            className="inline-flex items-center"
            onClick={openInMaps}
          >
            <MapPin className="h-4 w-4 mr-2" />
            Voir sur Google Maps
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="inline-flex items-center"
            onClick={openInOpenStreetMap}
          >
            <Map className="h-4 w-4 mr-2" />
            Voir sur OpenStreetMap
          </Button>
          
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="inline-flex items-center"
              onClick={copyAddress}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copier l'adresse
            </Button>
            {copyTooltip && (
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                Adresse copiée !
              </div>
            )}
          </div>
        </div>
        
        {/* Affichage statique au lieu de la carte interactive */}
        <div className="mt-6 overflow-hidden rounded-lg relative">
          <div className="h-80 w-full bg-gray-100 flex flex-col items-center justify-center">
            <MapIcon className="h-12 w-12 text-gray-400 mb-3" />
            <p className="text-gray-600 font-medium">Visualisation de maps non disponible pour le moment</p>
            <p className="text-gray-500 text-sm mt-2 max-w-md text-center px-4">
              Vous pouvez consulter la localisation en utilisant les boutons ci-dessus
              pour ouvrir Google Maps ou OpenStreetMap.
            </p>
          </div>
        </div>

        {/* Informations complémentaires sur le lieu */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm">
          <h4 className="font-medium text-blue-800 mb-2">Conseils pour se rendre sur place</h4>
          <p className="text-blue-700 mb-2">
            {event.location_city === 'Douala' ? (
              <>
                À Douala, il est recommandé d'arriver au moins 30 minutes avant le début de l'événement en raison du trafic.
                Vous trouverez facilement des taxis aux alentours.
              </>
            ) : event.location_city === 'Yaoundé' ? (
              <>
                À Yaoundé, prévoir un délai supplémentaire pour le trajet en raison des embouteillages fréquents.
                Des parkings sont disponibles à proximité du lieu de l'événement.
              </>
            ) : (
              <>
                Nous vous recommandons d'arriver au moins 15 minutes avant le début de l'événement.
                N'hésitez pas à contacter l'organisateur pour des conseils sur les transports et l'accès.
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}