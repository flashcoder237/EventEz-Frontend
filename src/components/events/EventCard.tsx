import Image from 'next/image';
import Link from 'next/link';
import { FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt, FaRegClipboard, FaStar, FaTheaterMasks, FaUserFriends } from 'react-icons/fa';
import { Event } from '@/types';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/utils/utils';
import { formatDate } from '../../lib/utils/dateUtils';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  // Determine styles based on event type
  const isBilletterie = event.event_type === 'billetterie';
  
  // Different style variations based on event type
  const gradientStyle = isBilletterie 
    ? "from-purple-900/80 via-purple-800/40 to-transparent" 
    : "from-green-900/80 via-green-800/40 to-transparent";
  
  const accentColor = isBilletterie ? "text-purple-500" : "text-green-600";
  const hoverAccentColor = isBilletterie ? "group-hover:text-purple-600" : "group-hover:text-green-700";
  const iconColor = isBilletterie ? "text-purple-500/80" : "text-green-600/80";
  const badgeBgColor = isBilletterie ? "bg-purple-100 text-purple-800" : "bg-green-100 text-green-800";
  const borderColor = isBilletterie ? "border-purple-100" : "border-green-100";
  
  // Icon based on event type
  const EventTypeIcon = isBilletterie ? FaTheaterMasks : FaUserFriends;
  
  return (
    <div className={`group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border ${borderColor} flex flex-col h-full`}>
      {/* Image container with gradient overlay */}
      <div className="relative h-52 w-full overflow-hidden">
        {event.banner_image ? (
          <Image
            src={`${event.banner_image}`}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            {/* Dynamic background based on event type and category */}
            <div className={`absolute inset-0 opacity-10 ${
              isBilletterie ? 'bg-purple-200' : 'bg-green-200'
            } flex items-center justify-center`}>
              {/* Pattern overlay for visual interest */}
              <div className="w-full h-full" style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.2\'%3E%3Cpath d=\'M0 0h20L0 20z\'/%3E%3C/g%3E%3C/svg%3E")',
                backgroundSize: '20px 20px'
              }}></div>
            </div>
            
            {/* Dynamic Event Icon */}
            <div className={`relative z-10 rounded-full p-6 ${
              isBilletterie ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
            }`}>
              <EventTypeIcon size={48} />
            </div>
            
            {/* Category display as a small overlay */}
            <div className="absolute bottom-3 left-0 w-full text-center">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                isBilletterie ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
              }`}>
                {event.category.name}
              </span>
            </div>
          </div>
        )}
        
        {/* Gradient overlay with type-specific color */}
        <div className={`absolute inset-0 bg-gradient-to-t ${gradientStyle}`}></div>
        
        {/* Event type icon */}
        <div className="absolute top-3 left-3 bg-white p-2 rounded-full shadow-sm">
          <EventTypeIcon className={iconColor} size={16} />
        </div>
        
        {/* Featured badge */}
        {event.is_featured && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-amber-400 text-amber-900 px-3 py-1 rounded-full text-xs font-medium">
            <FaStar className="text-amber-900" size={12} />
            <span>En vedette</span>
          </div>
        )}
      </div>
      
      {/* Content container */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Category & Type badges */}
        <div className="flex flex-wrap gap-2 mb-3 -mt-13 relative z-10">
          <Badge 
            variant={isBilletterie ? "info" : "success"}
            className="text-xs font-medium px-3 py-1"
          >
            {isBilletterie ? 'Billetterie' : 'Inscription'}
          </Badge>
          
          <Badge 
            variant="secondary"
            className="text-xs font-medium px-3 py-1"
          >
            {event.category.name}
          </Badge>
        </div>
        
        {/* Title */}
        <h3 className={`text-lg font-semibold text-gray-800 mb-3 line-clamp-2 ${accentColor} ${hoverAccentColor} transition-colors duration-200`}>
          {event.title}
        </h3>
        
        {/* Info items */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <FaCalendarAlt className={`mr-2 ${iconColor}`} size={14} />
            <span>{formatDate(event.start_date)}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <FaMapMarkerAlt className={`mr-2 ${iconColor} flex-shrink-0`} size={14} />
            <span className="truncate">{event.location_city}, {event.location_country}</span>
          </div>
        </div>
        
        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
          {event.short_description || event.description}
        </p>
        
        <div className={`mt-auto pt-4 border-t ${borderColor}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm">
              <span className="text-gray-500">Par </span>
              <span className="font-medium text-gray-800">{event.organizer_name}</span>
            </div>
            
            {isBilletterie && event.ticket_price_range && (
              <div className={`text-sm font-semibold ${accentColor}`}>
                {event.ticket_price_range}
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <span className="flex items-center text-xs text-gray-500">
              {isBilletterie 
                ? <FaTicketAlt className="mr-1" size={12} /> 
                : <FaRegClipboard className="mr-1" size={12} />}
              <span>{event.registration_count} {event.registration_count > 1 ? 'inscrits' : 'inscrit'}</span>
            </span>
            
            <Link 
              href={`/events/${event.id}`}
              className={`text-sm font-medium ${accentColor} hover:opacity-80 flex items-center transition-colors duration-200`}
            >
              Voir les détails
              <svg className="ml-1 w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}