// src/components/events/detail/tabs/EventDetailsTab.tsx
'use client';

import { Event } from '@/types';
import { Badge } from '@/components/ui/Badge';

interface EventDetailsTabProps {
  event: Event;
}

export default function EventDetailsTab({ event }: EventDetailsTabProps) {
  return (
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
  );
}