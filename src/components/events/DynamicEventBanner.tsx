'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Music, 
  Award, 
  Code, 
  BookOpen, 
  Activity, 
  Briefcase, 
  Ticket, 
  Calendar 
} from 'lucide-react';

// Minimalist color palette with a focus on neutrals and soft accents
const COLOR_PALETTES = {
  primary: {
    background: '#f8fafc', // Soft neutral background
    textColor: '#0f172a', // Deep slate for text
    accentColor: '#64748b', // Muted slate for icons and accents
    variants: [
      '#f1f5f9', // Lighter variant
      '#e2e8f0', // Slightly darker variant
      '#cbd5e1'  // Neutral slate variant
    ]
  },
  musique: {
    background: '#f8fafc',
    textColor: '#0f172a',
    accentColor: '#475569',
    variants: [
      '#f1f5f9',
      '#e2e8f0',
      '#cbd5e1'
    ]
  },
  art: {
    background: '#f8fafc',
    textColor: '#0f172a',
    accentColor: '#64748b',
    variants: [
      '#f1f5f9',
      '#e2e8f0',
      '#cbd5e1'
    ]
  },
  technologie: {
    background: '#f8fafc',
    textColor: '#0f172a',
    accentColor: '#475569',
    variants: [
      '#f1f5f9',
      '#e2e8f0',
      '#cbd5e1'
    ]
  },
  default: {
    background: '#f8fafc',
    textColor: '#0f172a',
    accentColor: '#64748b',
    variants: [
      '#f1f5f9',
      '#e2e8f0',
      '#cbd5e1'
    ]
  }
};

// Icon mapping remains the same
const EVENT_ICONS = {
  musique: Music,
  art: Award,
  technologie: Code,
  conférence: BookOpen,
  education: BookOpen,
  sport: Activity,
  business: Briefcase,
  billetterie: Ticket,
  default: Calendar
};

interface DynamicEventBannerProps {
  title: string;
  category?: string;
  eventType?: string;
}

const DynamicEventBanner: React.FC<DynamicEventBannerProps> = ({ 
  title, 
  category = '', 
  eventType = 'default' 
}) => {
  // Determine color palette and icon
  const palette = useMemo(() => {
    const lowercaseCategory = category.toLowerCase();
    
    // Find the first matching palette key
    const paletteKey = Object.keys(COLOR_PALETTES).find(key => 
      lowercaseCategory.includes(key)
    ) || 'default';
    
    const selectedPalette = COLOR_PALETTES[paletteKey];
    
    // Randomly select a background variant
    const finalBackground = selectedPalette.variants 
      ? selectedPalette.variants[Math.floor(Math.random() * selectedPalette.variants.length)]
      : selectedPalette.background;
    
    return {
      ...selectedPalette,
      background: finalBackground
    };
  }, [category]);

  // Determine icon
  const IconComponent = useMemo(() => {
    const lowercaseCategory = category.toLowerCase();
    
    // Find the first matching icon
    const iconKey = Object.keys(EVENT_ICONS).find(key => 
      lowercaseCategory.includes(key)
    ) || 'default';
    
    return EVENT_ICONS[iconKey];
  }, [category]);

  return (
    <motion.div 
      className="relative w-full h-full overflow-hidden rounded-2xl"
      initial={{ 
        opacity: 0, 
        scale: 0.98 
      }}
      animate={{ 
        opacity: 1, 
        scale: 1 
      }}
      transition={{ 
        duration: 0.3, 
        ease: "easeOut" 
      }}
    >
      {/* Minimalist Background */}
      <div 
        className="absolute inset-0"
        style={{ 
          backgroundColor: palette.background,
          zIndex: 1
        }}
      />

      {/* Content Container */}
      <div 
        className="relative z-10 flex flex-col justify-center items-center h-full p-6 text-center"
        style={{ 
          background: 'transparent'
        }}
      >
        {/* Animated Icon with Minimal Interaction */}
        <motion.div
          initial={{ 
            scale: 0.7, 
            opacity: 0 
          }}
          animate={{ 
            scale: 1,
            opacity: 1 
          }}
          whileHover={{ 
            scale: 1.05,
            transition: { 
              duration: 0.2 
            }
          }}
          transition={{ 
            duration: 0.3, 
            type: "spring", 
            bounce: 0.2 
          }}
        >
          <IconComponent 
            className="mb-4" 
            color={palette.accentColor}
            size={48} 
            strokeWidth={1.5} 
          />
        </motion.div>

        {/* Event Title with Clean Typography */}
        <motion.h2
          className="text-2xl md:text-3xl font-medium tracking-tight"
          style={{
            color: palette.textColor,
            opacity: 0.9
          }}
          initial={{ 
            y: 15, 
            opacity: 0,
            scale: 0.98
          }}
          animate={{ 
            y: 0, 
            opacity: 1,
            scale: 1
          }}
          transition={{ 
            delay: 0.1, 
            duration: 0.3,
            type: "spring",
            bounce: 0.2
          }}
        >
          {title.length > 50 ? `${title.slice(0, 50)}...` : title}
        </motion.h2>
      </div>
    </motion.div>
  );
};

export default DynamicEventBanner;