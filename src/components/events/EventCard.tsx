// components/events/EventCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import { FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt, FaRegClipboard } from 'react-icons/fa';
import { Event } from '@/types';
import { Badge } from '../ui/Badge';
import { formatDate } from '@/lib/utils';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 w-full">
        {event.banner_image ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${event.banner_image}`}
            alt={event.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="bg-primary/20 h-full flex items-center justify-center">
            <FaCalendarAlt className="h-16 w-16 text-primary/40" />
          </div>
        )}
        
        {event.is_featured && (
          <div className="absolute top-2 right-2">
            <Badge variant="warning">En vedette</Badge>
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-4">
          <div className="flex items-center space-x-2 mb-1">
            <Badge variant={event.event_type === 'billetterie' ? 'info' : 'success'}>
              {event.event_type === 'billetterie' ? 'Billetterie' : 'Inscription'}
            </Badge>
            <Badge variant="secondary">{event.category.name}</Badge>
          </div>
          <h3 className="text-white font-semibold truncate">{event.title}</h3>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <FaCalendarAlt className="mr-1 text-primary" />
          <span>{formatDate(event.start_date)}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <FaMapMarkerAlt className="mr-1 text-primary" />
          <span className="truncate">{event.location_city}, {event.location_country}</span>
        </div>
        
        <p className="text-sm text-gray-700 line-clamp-2 mb-4">{event.short_description || event.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="text-sm">
            <span className="text-gray-600">Par </span>
            <span className="font-medium">{event.organizer_name}</span>
          </div>
          
          {event.event_type === 'billetterie' && event.ticket_price_range && (
            <div className="text-sm font-medium text-primary">
              {event.ticket_price_range}
            </div>
          )}
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <span className="flex items-center text-xs text-gray-500">
            {event.event_type === 'billetterie' 
              ? <FaTicketAlt className="mr-1" /> 
              : <FaRegClipboard className="mr-1" />}
            {event.registration_count} {event.registration_count > 1 ? 'inscrits' : 'inscrit'}
          </span>
          
          <Link 
            href={`/events/${event.id}`}
            className="text-sm font-medium text-primary hover:text-primary/80"
          >
            Voir les détails
          </Link>
        </div>
      </div>
    </div>
  );
}