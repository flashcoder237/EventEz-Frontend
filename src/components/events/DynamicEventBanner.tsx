'use client';

import React, { useMemo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Music, 
  Award, 
  Code, 
  BookOpen, 
  Activity, 
  Briefcase, 
  Ticket, 
  Calendar,
  Star,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import chroma from 'chroma-js';

// Système de thèmes amélioré avec motifs animés
const THEME_CONFIGS = {
  musique: {
    gradient: {
      colors: ['#8E2DE2', '#4A00E0'],
      pattern: 'linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)'
    },
    bgPattern: 'radial-gradient(circle at 80% 0%, rgba(255, 255, 255, 0.1) 0%, transparent 40%)',
    backgroundColor: '#4A00E0',
    textColor: '#FFFFFF',
    accentColor: '#FF6B6B',
    secondaryColor: '#FFC75F',
    iconBackground: 'rgba(255, 255, 255, 0.08)',
    icon: Music,
    svgPatterns: [
      // Notes de musique et ondes sonores
      `<pattern id="musicPattern" patternUnits="userSpaceOnUse" width="60" height="60" patternTransform="scale(1.5) rotate(0)">
        <path d="M30 20 Q35 10, 40 20 T50 20" stroke="rgba(255,255,255,0.2)" fill="none" />
        <circle cx="15" cy="30" r="3" fill="rgba(255,255,255,0.15)" />
        <circle cx="15" cy="30" r="1" fill="rgba(255,255,255,0.3)" />
        <circle cx="45" cy="15" r="2" fill="rgba(255,255,255,0.2)" />
        <circle cx="45" cy="15" r="0.8" fill="rgba(255,255,255,0.4)" />
        <path d="M15 30 L15 15 L17 15 L17 30" fill="rgba(255,255,255,0.15)" />
        <path d="M45 15 L45 0 L47 0 L47 15" fill="rgba(255,255,255,0.2)" />
      </pattern>`
    ]
  },
  technologie: {
    gradient: {
      colors: ['#00B4DB', '#0083B0'],
      pattern: 'linear-gradient(135deg, #00B4DB 0%, #0083B0 100%)'
    },
    bgPattern: 'radial-gradient(circle at 20% 100%, rgba(255, 255, 255, 0.1) 0%, transparent 40%)',
    backgroundColor: '#0083B0',
    textColor: '#FFFFFF',
    accentColor: '#F6E05E',
    secondaryColor: '#F6E05E',
    iconBackground: 'rgba(255, 255, 255, 0.08)',
    icon: Code,
    svgPatterns: [
      // Circuits et éléments technologiques
      `<pattern id="techPattern" patternUnits="userSpaceOnUse" width="80" height="80" patternTransform="scale(1.2) rotate(0)">
        <path d="M0 20 L40 20 L40 0" stroke="rgba(255,255,255,0.1)" fill="none" stroke-width="1.5" />
        <path d="M80 60 L40 60 L40 80" stroke="rgba(255,255,255,0.1)" fill="none" stroke-width="1.5" />
        <circle cx="40" cy="20" r="3" fill="rgba(255,255,255,0.15)" />
        <circle cx="40" cy="60" r="3" fill="rgba(255,255,255,0.15)" />
        <rect x="60" y="30" width="10" height="10" stroke="rgba(255,255,255,0.1)" fill="none" stroke-width="1.2" />
        <rect x="10" y="40" width="8" height="8" fill="rgba(255,255,255,0.08)" />
        <path d="M20 30 L30 30 L30 40 L20 40 Z" stroke="rgba(255,255,255,0.1)" fill="none" stroke-width="1" />
      </pattern>`
    ]
  },
  art: {
    gradient: {
      colors: ['#FF6B6B', '#FF8E53'],
      pattern: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)'
    },
    bgPattern: 'radial-gradient(circle at 10% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 40%)',
    backgroundColor: '#FF8E53',
    textColor: '#FFFFFF',
    accentColor: '#4ECDC4',
    secondaryColor: '#F7FFF7',
    iconBackground: 'rgba(255, 255, 255, 0.08)',
    icon: Award,
    svgPatterns: [
      // Formes artistiques et pinceaux
      `<pattern id="artPattern" patternUnits="userSpaceOnUse" width="100" height="100" patternTransform="scale(1) rotate(0)">
        <path d="M20 20 Q40 0, 60 20 T100 20" stroke="rgba(255,255,255,0.15)" fill="none" stroke-width="2" />
        <circle cx="80" cy="60" r="5" fill="rgba(255,255,255,0.1)" />
        <circle cx="30" cy="70" r="10" fill="rgba(255,255,255,0.06)" />
        <path d="M70 80 L80 90 L60 90 Z" fill="rgba(255,255,255,0.12)" />
        <rect x="40" y="40" width="20" height="10" rx="5" fill="rgba(255,255,255,0.08)" />
      </pattern>`
    ]
  },
  default: {
    gradient: {
      colors: ['#6A11CB', '#2575FC'],
      pattern: 'linear-gradient(135deg, #6A11CB 0%, #2575FC 100%)'
    },
    bgPattern: 'radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.1) 0%, transparent 40%)',
    backgroundColor: '#2575FC',
    textColor: '#FFFFFF',
    accentColor: '#FFC75F',
    secondaryColor: '#845EC2',
    iconBackground: 'rgba(255, 255, 255, 0.08)',
    icon: Calendar,
    svgPatterns: [
      // Motif géométrique abstrait
      `<pattern id="defaultPattern" patternUnits="userSpaceOnUse" width="60" height="60" patternTransform="scale(1.5) rotate(0)">
        <circle cx="10" cy="10" r="2" fill="rgba(255,255,255,0.2)" />
        <circle cx="30" cy="10" r="2" fill="rgba(255,255,255,0.15)" />
        <circle cx="50" cy="10" r="2" fill="rgba(255,255,255,0.2)" />
        <circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.15)" />
        <circle cx="40" cy="20" r="2" fill="rgba(255,255,255,0.2)" />
        <circle cx="10" cy="30" r="2" fill="rgba(255,255,255,0.15)" />
        <circle cx="30" cy="30" r="2" fill="rgba(255,255,255,0.2)" />
        <circle cx="50" cy="30" r="2" fill="rgba(255,255,255,0.15)" />
      </pattern>`
    ]
  }
};

// Fonction pour obtenir la couleur de texte optimale basée sur l'arrière-plan
const getOptimalTextColor = (backgroundColor) => {
  try {
    const luminance = chroma(backgroundColor).luminance();
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  } catch {
    return '#FFFFFF';
  }
};

// Hook personnalisé pour détecter la taille de l'écran
const useWindowSize = () => {
  // Initialize with null values (important for SSR)
  const [windowSize, setWindowSize] = useState({
    width: null,
    height: null,
  });

  // Only update after component mounts (client-side only)
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    // Set initial size
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

interface DynamicEventBannerProps {
  title: string;
  category?: string;
  isFeatured?: boolean;
  description?: string;
  className?: string;
  onInteract?: () => void;
  minHeight?: string;
  maxHeight?: string;
}

const DynamicEventBanner: React.FC<DynamicEventBannerProps> = ({
  title,
  category = 'default',
  isFeatured = false,
  description = '',
  className = '',
  onInteract,
  minHeight = '300px',
  maxHeight = '400px',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [contentTruncated, setContentTruncated] = useState(false);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const { width: windowWidth } = useWindowSize();
  
  // Effet pour relancer l'animation périodiquement
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationKey(prev => prev + 1);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Effet pour vérifier si le contenu est tronqué
  useEffect(() => {
    if (descriptionRef.current) {
      const isTruncated = descriptionRef.current.scrollHeight > descriptionRef.current.clientHeight;
      setContentTruncated(isTruncated);
    }
  }, [description, windowWidth, descriptionRef]);

  // Sélection du thème
  const theme = useMemo(() => {
    const lowercaseCategory = category.toLowerCase();
    const themeKey = Object.keys(THEME_CONFIGS).find(key => 
      lowercaseCategory.includes(key)
    ) || 'default';
    
    const selectedTheme = { ...THEME_CONFIGS[themeKey] };
    
    // Calcul dynamique de la couleur du texte si nécessaire
    if (!selectedTheme.textColor) {
      selectedTheme.textColor = getOptimalTextColor(selectedTheme.backgroundColor);
    }
    
    return selectedTheme;
  }, [category]);

  // Calcul des tailles en fonction de l'écran
  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;
  const isDesktop = windowWidth >= 1024;

  // Formats de titre adaptés à la taille d'écran
  const getTitleFormat = () => {
    const maxLength = isMobile ? 25 : isTablet ? 35 : 60;
    return title.length > maxLength ? `${title.slice(0, maxLength)}...` : title;
  };
  
  // Formats de description adaptés à la taille d'écran
  const getDescriptionFormat = () => {
    // Sur mobile, nous montrons moins de texte initialement
    const maxLength = isMobile ? 60 : isTablet ? 100 : 150;
    
    if (!isExpanded && description.length > maxLength) {
      return `${description.slice(0, maxLength)}...`;
    }
    
    return description;
  };

  return (
    <motion.div 
      className={`relative overflow-hidden rounded-lg  cursor-pointer flex flex-col justify-center ${className}`}
      style={{
        background: theme.gradient.pattern,
        minHeight: minHeight,
        height: isExpanded ? 'auto' : 'unset',
        maxHeight: isExpanded ? 'none' : maxHeight,
        width: '100%',
        color: theme.textColor
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)'
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onInteract && onInteract()}
    >
      {/* Motif d'arrière-plan */}
      <div 
        className="absolute inset-0 opacity-60"
        style={{ background: theme.bgPattern }}
      />
      
      {/* Ligne décorative en haut */}
      <motion.div 
        className="absolute top-0 left-0 right-0 h-1"
        style={{ background: theme.accentColor }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />

      {/* Badge "En vedette" si applicable */}
      {isFeatured && (
        <motion.div
          className="absolute top-3 right-3 z-20"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div 
            className="flex items-center space-x-1 px-3 py-1.5 rounded-full"
            style={{ 
              backgroundColor: theme.accentColor,
              border: `1px solid ${theme.accentColor}`
            }}
          >
            <Star fill="white" color="white" size={isMobile ? 12 : 14} />
            <span className="text-xs font-medium text-white">
              En vedette
            </span>
          </div>
        </motion.div>
      )}

      {/* Conteneur de contenu principal */}
      <div className="relative z-10 w-full p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start">
        {/* Conteneur pour l'icône */}
        <div className="w-20 sm:w-24 md:w-28 flex justify-center items-center mb-4 sm:mb-0 sm:mr-6">
          <motion.div 
            key={`icon-${animationKey}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: [0.8, 1.1, 1],
              opacity: [0, 1, 1],
              y: [20, -5, 0]
            }}
            transition={{ 
              duration: 1.2,
              times: [0, 0.6, 1]
            }}
          >
            <div 
              className="rounded-full p-3 sm:p-4 md:p-5"
              style={{
                background: theme.iconBackground,
                backdropFilter: 'blur(10px)'
              }}
            >
              <theme.icon 
                size={isMobile ? 28 : isTablet ? 35 : 40} 
                color={theme.accentColor} 
                strokeWidth={1.5} 
              />
            </div>
          </motion.div>
        </div>

        {/* Conteneur pour le texte */}
        <div className="flex flex-col flex-grow text-center sm:text-left self-center sm:self-auto">
          {/* Badge de catégorie */}
          <motion.div 
            className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 sm:mb-3 mx-auto sm:mx-0"
            style={{ 
              background: theme.iconBackground,
              color: theme.accentColor,
              backdropFilter: 'blur(4px)'
            }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {category.toUpperCase()}
          </motion.div>

          {/* Titre avec taille adaptative */}
          <motion.h2 
            className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3"
            style={{ 
              color: theme.textColor,
              textShadow: '0 2px 10px rgba(0,0,0,0.15)'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {getTitleFormat()}
          </motion.h2>

          {/* Description avec animation de fade et troncature adaptative */}
          <AnimatePresence>
            <motion.div
              ref={descriptionRef}
              className={`text-xs sm:text-sm max-w-full md:max-w-md overflow-hidden mx-auto sm:mx-0 ${
                isExpanded ? 'max-h-none' : 'max-h-16 sm:max-h-20'
              }`}
              style={{ 
                color: `${theme.textColor}CC`, // Ajout de transparence
                lineHeight: 1.5,
                transition: 'max-height 0.3s ease-in-out'
              }}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: isHovered ? 1 : 0.8,
              }}
              transition={{ duration: 0.4 }}
            >
              {getDescriptionFormat()}
            </motion.div>
          </AnimatePresence>

          {/* Bouton "Voir plus" si le contenu est tronqué */}
          {contentTruncated && (
            <motion.button
              className="text-xs mt-2 flex items-center mx-auto sm:mx-0"
              style={{ color: theme.accentColor }}
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {isExpanded ? (
                <>
                  <span>Voir moins</span>
                  <ChevronUp size={14} className="ml-1" />
                </>
              ) : (
                <>
                  <span>Voir plus</span>
                  <ChevronDown size={14} className="ml-1" />
                </>
              )}
            </motion.button>
          )}

          {/* Élément décoratif si mis en avant */}
          {isFeatured && (
            <motion.div
              className="mt-3 pt-2 sm:pt-3 flex justify-center sm:justify-start"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <div className="flex items-center">
                <Star fill={theme.secondaryColor} color={theme.secondaryColor} size={isMobile ? 14 : 16} />
                <span className="ml-2 text-xs font-medium" style={{ color: theme.secondaryColor }}>
                  Événement à ne pas manquer
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DynamicEventBanner;