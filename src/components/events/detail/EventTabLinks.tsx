'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Event } from '@/types';
import { 
  FileText, 
  Ticket, 
  MapPin, 
  User, 
  MessageSquare, 
  ClipboardCheck 
} from 'lucide-react';

interface EventTabLinksProps {
  event: Event;
  activeTab: string;
  feedbacksCount: number;
}

export default function EventTabLinks({ 
  event, 
  activeTab,
  feedbacksCount
}: EventTabLinksProps) {
  const pathname = usePathname();
  const isBilletterie = event.event_type === 'billetterie';
  
  // Créer l'URL avec le paramètre d'onglet
  const createTabUrl = (tab: string) => {
    return `${pathname}?tab=${tab}`;
  };
  
  // Définition des onglets
  const tabs = [
    {
      key: 'details',
      label: 'Détails',
      icon: FileText
    },
    {
      key: isBilletterie ? 'tickets' : 'registration',
      label: isBilletterie ? 'Billets' : 'Inscription',
      icon: isBilletterie ? Ticket : ClipboardCheck
    },
    {
      key: 'location',
      label: 'Lieu',
      icon: MapPin
    },
    {
      key: 'organizer',
      label: 'Organisateur',
      icon: User
    },
    {
      key: 'reviews',
      label: 'Avis',
      count: feedbacksCount,
      icon: MessageSquare
    }
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <Link 
          key={tab.key}
          href={createTabUrl(tab.key)}
          className="group relative"
        >
          <motion.div 
            className={`
              inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium
              transition-all duration-300 ease-out
              ${activeTab === tab.key 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
              }
            `}
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <tab.icon className="h-3.5 w-3.5 mr-1.5 opacity-80" />
            {tab.label}
            
            {/* Compteur pour les avis */}
            {tab.count !== undefined && (
              <span className="ml-1.5 bg-white/20 rounded-full px-1.5 py-0.5 text-[0.625rem]">
                {tab.count}
              </span>
            )}
            
            {/* Indicateur animé */}
            <AnimatePresence>
              {activeTab === tab.key && (
                <motion.span
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: '100%', opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 30 
                  }}
                />
              )}
            </AnimatePresence>
          </motion.div>
        </Link>
      ))}
    </div>
  );
}