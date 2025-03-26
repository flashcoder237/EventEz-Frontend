'use client';

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import chroma from 'chroma-js';

// Advanced Theming System
const THEME_CONFIGS = {
  musique: {
    gradient: {
      colors: ['#8E2DE2', '#4A00E0'],
      pattern: 'radial-gradient(circle at 30% 107%, #8E2DE2 0%, #4A00E0 5%, rgba(142,45,226,0.1) 45%, rgba(74,0,224,0.1) 90%)'
    },
    backgroundColor: '#4A00E0',
    textColor: null,
    accentColor: '#FF6B6B',
    iconBackground: 'rgba(255, 255, 255, 0.1)',
    patterns: [
      'linear-gradient(45deg, rgba(142,45,226,0.1) 0%, rgba(74,0,224,0.1) 100%)',
      'radial-gradient(circle at 10% 20%, rgba(142,45,226,0.05) 0%, rgba(74,0,224,0.05) 90%)'
    ],
    icon: Music
  },
  technologie: {
    gradient: {
      colors: ['#00B4DB', '#0083B0'],
      pattern: 'radial-gradient(circle at 30% 107%, #00B4DB 0%, #0083B0 5%, rgba(0,180,219,0.1) 45%, rgba(0,131,176,0.1) 90%)'
    },
    backgroundColor: '#0083B0',
    textColor: null,
    accentColor: '#48BB78',
    iconBackground: 'rgba(255, 255, 255, 0.1)',
    patterns: [
      'linear-gradient(45deg, rgba(0,180,219,0.1) 0%, rgba(0,131,176,0.1) 100%)',
      'repeating-radial-gradient(circle at 100% 100%, rgba(0,180,219,0.03) 0px, rgba(0,131,176,0.03) 10px, transparent 10px, transparent 20px)'
    ],
    icon: Code
  },
  art: {
    gradient: {
      colors: ['#FF6B6B', '#FFA726'],
      pattern: 'radial-gradient(circle at 30% 107%, #FF6B6B 0%, #FFA726 5%, rgba(255,107,107,0.1) 45%, rgba(255,167,38,0.1) 90%)'
    },
    backgroundColor: '#FFA726',
    textColor: null,
    accentColor: '#4ECDC4',
    iconBackground: 'rgba(255, 255, 255, 0.1)',
    patterns: [
      'linear-gradient(45deg, rgba(255,107,107,0.1) 0%, rgba(255,167,38,0.1) 100%)',
      'polygon-gradient(50% 50%, rgba(255,107,107,0.05) 0%, rgba(255,167,38,0.05) 100%)'
    ],
    icon: Award
  },
  default: {
    gradient: {
      colors: ['#6A11CB', '#2575FC'],
      pattern: 'radial-gradient(circle at 30% 107%, #6A11CB 0%, #2575FC 5%, rgba(106,17,203,0.1) 45%, rgba(37,117,252,0.1) 90%)'
    },
    backgroundColor: '#2575FC',
    textColor: null,
    accentColor: '#7928CA',
    iconBackground: 'rgba(255, 255, 255, 0.1)',
    patterns: [
      'linear-gradient(45deg, rgba(106,17,203,0.1) 0%, rgba(37,117,252,0.1) 100%)',
      'repeating-linear-gradient(45deg, rgba(106,17,203,0.03) 0%, rgba(37,117,252,0.03) 10px, transparent 10px, transparent 20px)'
    ],
    icon: Calendar
  }
};

// Function to calculate optimal text color based on background
const getOptimalTextColor = (backgroundColor) => {
  try {
    const luminance = chroma(backgroundColor).luminance();
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  } catch {
    return '#FFFFFF';
  }
};

interface ModernEventBannerProps {
  title: string;
  category?: string;
  isFeatured?: boolean;
  description?: string;
  className?: string;
  onInteract?: () => void;
}

const ModernEventBanner: React.FC<ModernEventBannerProps> = ({
  title,
  category = 'default',
  isFeatured = false,
  description = '',
  className = '',
  onInteract
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Theme Selection
  const theme = useMemo(() => {
    const lowercaseCategory = category.toLowerCase();
    const themeKey = Object.keys(THEME_CONFIGS).find(key => 
      lowercaseCategory.includes(key)
    ) || 'default';
    
    const selectedTheme = { ...THEME_CONFIGS[themeKey] };
    
    // Dynamically calculate text color
    selectedTheme.textColor = getOptimalTextColor(selectedTheme.backgroundColor);
    
    return selectedTheme;
  }, [category]);

  // Dynamic Background Variants
  const backgroundVariants = {
    initial: { 
      backgroundPosition: '0% 50%',
      backgroundSize: '200% 200%'
    },
    animate: {
      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      backgroundSize: ['200% 200%', '220% 220%', '200% 200%'],
      transition: {
        duration: 20, // Slower animation
        repeat: Infinity,
        ease: 'linear'
      }
    },
    hover: {
      backgroundPosition: '100% 50%',
      backgroundSize: '250% 250%',
      transition: {
        duration: 1,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <motion.div 
      className={`relative overflow-hidden rounded-3xl shadow-2xl cursor-pointer group ${className}`}
      style={{
        background: theme.gradient.pattern,
        minHeight: '400px',
        color: theme.textColor
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onInteract}
    >
      {/* Animated Background Layers */}
      <motion.div 
        className="absolute inset-0 opacity-20"
        style={{
          background: theme.patterns[0],
          mixBlendMode: 'overlay'
        }}
        variants={backgroundVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
      />
      <motion.div 
        className="absolute inset-0 opacity-10"
        style={{
          background: theme.patterns[1],
          mixBlendMode: 'color-dodge'
        }}
        variants={backgroundVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
      />

      {/* Content Container */}
      <div className="relative z-10 flex flex-col justify-between p-8 h-full">
        {/* Middle Section */}
        <div className="flex-grow flex flex-col justify-center items-center text-center">
          {/* Animated Icon */}
          <motion.div 
            className="rounded-full p-4 mb-1"
            style={{
              backgroundColor: theme.iconBackground,
              backdropFilter: 'blur(10px)'
            }}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ 
              scale: 1.1,
              rotate: [0, -10, 10, 0]
            }}
          >
            <theme.icon 
              size={64} 
              color={theme.accentColor} 
              strokeWidth={1.5} 
            />
          </motion.div>

          {/* Title with Dynamic Contrast */}
          <motion.h2 
            className="text-2xl md:text-3xl font-bold mb-1 tracking-tight"
            style={{ 
              color: theme.accentColor,
            }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            {title.length > 50 ? `${title.slice(0, 50)}...` : title}
          </motion.h2>

          {/* Description */}
          {isHovered && description && (
            <div
              className="text-sm max-w-xl mx-auto"
              style={{ 
                color: theme.textColor,
              }}
            >
              {description}
            </div>
          )}
        </div>

        {/* Bottom Section (intentionally left empty) */}
        <div></div>
      </div>
    </motion.div>
  );
};

export default ModernEventBanner;