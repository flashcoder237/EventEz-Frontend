'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Event } from '@/types';
import { Button } from '@/components/ui/Button';
import { 
  MapPin, 
  Copy, 
  ExternalLink, 
  Map, 
  MapIcon, 
  Navigation,
  Info,
  CheckCircle
} from 'lucide-react';

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
    const osmUrl = `https://www.openstreetmap.org/search?query=${encodeURIComponent(fullAddress)}`;
    window.open(osmUrl, '_blank');
  };

  // Location tips based on city
  const getLocationTips = () => {
    const cityTips: { [key: string]: React.ReactNode } = {
      'Douala': (
        <>
          À Douala, il est recommandé d'arriver au moins 30 minutes avant le début de l'événement en raison du trafic.
          Vous trouverez facilement des taxis aux alentours.
        </>
      ),
      'Yaoundé': (
        <>
          À Yaoundé, prévoir un délai supplémentaire pour le trajet en raison des embouteillages fréquents.
          Des parkings sont disponibles à proximité du lieu de l'événement.
        </>
      ),
      'default': (
        <>
          Nous vous recommandons d'arriver au moins 15 minutes avant le début de l'événement.
          N'hésitez pas à contacter l'organisateur pour des conseils sur les transports et l'accès.
        </>
      )
    };

    return cityTips[event.location_city] || cityTips['default'];
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
        <MapPin className="mr-4 text-primary" size={36} />
        Lieu de l'événement
      </motion.h2>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 shadow-sm overflow-hidden"
      >
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-200">
            {event.location_name}
          </h3>
          <p className="text-gray-700 dark:text-gray-400 mb-4">{fullAddress}</p>
          
          <div className="flex flex-wrap gap-3 mt-4 mb-6">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="outline" 
                size="sm"
                className="inline-flex items-center"
                onClick={openInMaps}
              >
                <MapPin className="h-4 w-4 mr-2" />
                Google Maps
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                className="inline-flex items-center"
                onClick={openInOpenStreetMap}
              >
                <Map className="h-4 w-4 mr-2" />
                OpenStreetMap
              </Button>
            </motion.div>
            
            <motion.div 
              className="relative" 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                size="sm"
                className="inline-flex items-center"
                onClick={copyAddress}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copier l'adresse
              </Button>
              <AnimatePresence>
                {copyTooltip && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute -top-10 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs px-3 py-1.5 rounded-full flex items-center"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Adresse copiée !
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
          
          {/* Placeholder for map */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 overflow-hidden rounded-xl relative"
          >
            <div className="h-80 w-full bg-gray-100 dark:bg-gray-700 flex flex-col items-center justify-center">
              <MapIcon className="h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
              <p className="text-gray-600 dark:text-gray-400 font-medium mb-2">
                Visualisation de carte non disponible
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md text-center px-4">
                Utilisez les boutons ci-dessus pour consulter la localisation sur Google Maps ou OpenStreetMap
              </p>
            </div>
          </motion.div>

          {/* Location Tips */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-5 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl"
          >
            <div className="flex items-start mb-3">
              <Info className="mr-3 mt-1 h-5 w-5 text-indigo-500 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-indigo-800 dark:text-indigo-300 mb-2">
                  Conseils pour se rendre sur place
                </h4>
                <p className="text-indigo-700 dark:text-indigo-200 text-sm leading-relaxed">
                  {getLocationTips()}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
