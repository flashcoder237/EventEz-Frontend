// src/components/events/detail/EventTabLinks.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  
  // Style commun pour tous les tags
  const baseStyle = "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mr-2 mb-2 transition-colors";
  // Style pour les tags actifs et inactifs
  const activeStyle = "bg-primary text-white";
  const inactiveStyle = "bg-gray-100 text-gray-600 hover:bg-gray-200";
  
  return (
    <div className="flex flex-wrap">
      <Link 
        href={createTabUrl('details')}
        className={`${baseStyle} ${activeTab === 'details' ? activeStyle : inactiveStyle}`}
      >
        <FileText className="h-3 w-3 mr-1" />
        Détails
      </Link>
      
      {isBilletterie ? (
        <Link 
          href={createTabUrl('tickets')}
          className={`${baseStyle} ${activeTab === 'tickets' ? activeStyle : inactiveStyle}`}
        >
          <Ticket className="h-3 w-3 mr-1" />
          Billets
        </Link>
      ) : (
        <Link 
          href={createTabUrl('registration')}
          className={`${baseStyle} ${activeTab === 'registration' ? activeStyle : inactiveStyle}`}
        >
          <ClipboardCheck className="h-3 w-3 mr-1" />
          Inscription
        </Link>
      )}
      
      <Link 
        href={createTabUrl('location')}
        className={`${baseStyle} ${activeTab === 'location' ? activeStyle : inactiveStyle}`}
      >
        <MapPin className="h-3 w-3 mr-1" />
        Lieu
      </Link>
      
      <Link 
        href={createTabUrl('organizer')}
        className={`${baseStyle} ${activeTab === 'organizer' ? activeStyle : inactiveStyle}`}
      >
        <User className="h-3 w-3 mr-1" />
        Organisateur
      </Link>
      
      <Link 
        href={createTabUrl('reviews')}
        className={`${baseStyle} ${activeTab === 'reviews' ? activeStyle : inactiveStyle}`}
      >
        <MessageSquare className="h-3 w-3 mr-1" />
        Avis ({feedbacksCount})
      </Link>
    </div>
  );
}