'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';
import { formatDate } from '@/lib/utils/dateUtils';

// Animations
const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.3
    }
  }
};

interface EventHeaderProps {
  event: any;
}

export function EventHeader({ event }: EventHeaderProps) {
  return (
    <motion.div 
      className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6 text-white"
      variants={headerVariants}
    >
      <motion.h2 
        className="text-2xl font-bold mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        Finaliser votre inscription
      </motion.h2>
      
      <div className="flex flex-wrap gap-4">
        <motion.div 
          className="flex items-center"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
        >
          <Calendar className="h-5 w-5 mr-2 text-purple-200" />
          <span>{formatDate(event.start_date, 'long')}</span>
        </motion.div>
        
        <motion.div 
          className="flex items-center"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
        >
          <MapPin className="h-5 w-5 mr-2 text-purple-200" />
          <span>{event.location_name}, {event.location_city}</span>
        </motion.div>
      </div>
    </motion.div>
  );
}