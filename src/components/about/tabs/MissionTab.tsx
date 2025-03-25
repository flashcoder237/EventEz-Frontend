import { motion } from 'framer-motion';
import { SectionProps } from '@/types/about';
import { CheckCircle } from 'lucide-react';
import Image from 'next/image';

export default function MissionTab({ animationTriggered }: SectionProps) {
  const objectives = [
    "Faciliter l'économie événementielle locale",
    "Réduire les barrières technologiques pour les organisateurs",
    "Promouvoir la culture et les talents africains",
    "Créer des emplois dans le secteur technologique"
  ];

  return (
    <motion.div 
      className="flex flex-col md:flex-row gap-12 items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      key="mission-tab"
    >
      <motion.div 
        className="w-full md:w-1/2 space-y-6"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
      >
        <motion.h3 
          className="text-2xl font-bold text-gray-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Notre mission
        </motion.h3>
        <motion.p 
          className="text-gray-700 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Nous avons pour mission de démocratiser l'accès aux technologies événementielles de pointe au Cameroun et dans toute l'Afrique, en offrant des solutions adaptées aux réalités locales.
        </motion.p>
        <motion.p 
          className="text-gray-700 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Nous croyons fermement que les événements sont des catalyseurs de changement social, économique et culturel. Notre ambition est de faciliter la création et la gestion de ces expériences transformatrices à travers notre technologie.
        </motion.p>
        
        <motion.div 
          className="pt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h4 className="font-semibold text-gray-900 mb-4">Nos objectifs d'impact</h4>
          <motion.div className="space-y-3">
            {objectives.map((item, idx) => (
              <motion.div 
                key={idx}
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + (idx * 0.1) }}
              >
                <motion.div
                  whileHover={{ scale: 1.2, color: "#8b5cf6" }}
                  transition={{ duration: 0.2 }}
                >
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                </motion.div>
                <p className="text-gray-700">{item}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
      
      <motion.div 
        className="w-full md:w-1/2"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <div className="relative aspect-video rounded-xl overflow-hidden shadow-xl border-8 border-white group">
          {/* Effet de blur sur le poster */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-violet-500/30 to-pink-500/30 filter blur-2xl z-0"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 0.8 }}
            transition={{ duration: 0.3 }}
          />
          
          <Image 
            src="/images/mission-video-poster.jpg" 
            alt="Notre mission" 
            fill 
            className="object-cover z-10 relative"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <motion.button 
              className="w-20 h-20 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg group relative overflow-hidden"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              {/* Effet de glow animé */}
              <motion.div 
                className="absolute inset-0 bg-violet-200 filter blur-xl opacity-0"
                animate={{ 
                  opacity: [0, 0.5, 0],
                  scale: [1, 1.5, 1]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2,
                  ease: "easeInOut" 
                }}
              />
              
              <span className="ml-1 w-0 h-0 border-y-8 border-y-transparent border-l-12 border-l-violet-600 group-hover:border-l-violet-800 transition-colors relative z-10"></span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}