// src/components/events/registration/RegistrationHeader.jsx
import { Calendar, MapPin } from 'lucide-react';
import { formatDate } from '@/lib/utils/dateUtils';

const RegistrationHeader = ({ event }) => {
  return (
    <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">Finaliser votre inscription</h2>
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-purple-200" />
          <span>{formatDate(event.start_date, 'long')}</span>
        </div>
        <div className="flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-purple-200" />
          <span>{event.location_name}, {event.location_city}</span>
        </div>
      </div>
    </div>
  );
};

export default RegistrationHeader;