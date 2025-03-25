import { motion } from 'framer-motion';
import Image from 'next/image';
import { SectionProps } from '@/types/about';

export default function HistoryTab({ animationTriggered }: SectionProps) {
  return (
    <motion.div 
      className="flex flex-col md:flex-row gap-12 items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      key="histoire-tab"
    >
      <motion.div 
        className="w-full md:w-5/12"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
      >
        <div className="relative aspect-square md:aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
          {/* Effet de blur réactif */}
          <motion.div 
            className="absolute -inset-0 bg-gradient-to-r from-violet-500/30 to-pink-500/30 filter blur-3xl z-0 opacity-0"
            whileHover={{ opacity: 0.7, scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
          
          <Image 
            src="/images/about-story.jpg" 
            alt="L'équipe EventEz" 
            fill 
            className="object-cover relative z-10"
            sizes="(max-width: 768px) 100vw, 40vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-20"></div>
          <motion.div 
            className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-lg p-4 max-w-xs z-30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <p className="text-sm font-medium text-violet-800">Fondée en 2023</p>
            <p className="text-xs text-gray-600">Yaoundé, Cameroun</p>
          </motion.div>
        </div>
      </motion.div>
      
      <motion.div 
        className="w-full md:w-7/12 space-y-6"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <motion.h3 
          className="text-2xl font-bold text-gray-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          De l'idée à la plateforme leader
        </motion.h3>
        <motion.p 
          className="text-gray-700 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          EventEz est né d'un constat simple : l'organisation d'événements au Cameroun et en Afrique en général présente des défis uniques qui nécessitent des solutions adaptées. Lancée en 2023, notre plateforme a été conçue par une équipe d'entrepreneurs camerounais passionnés par la technologie et les événements.
        </motion.p>
        <motion.p 
          className="text-gray-700 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          Face aux difficultés de gestion des inscriptions, des paiements et de la communication lors d'événements locaux, nous avons développé une solution qui prend en compte les réalités du marché africain : connexion internet parfois instable, prévalence des paiements mobiles, et besoin de flexibilité.
        </motion.p>
        
        <motion.div 
          className="pt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h4 className="font-semibold text-gray-900 mb-3">Notre parcours</h4>
          <ul className="space-y-4">
            {[1, 2, 3].map((num, index) => (
              <motion.li 
                key={index}
                className="flex gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.7 + (index * 0.15) }}
              >
                <div className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0 mt-0.5 relative">
                  <motion.div 
                    className="absolute inset-0 rounded-full bg-violet-200 filter blur-sm z-0"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ opacity: 1, scale: 1.5 }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="text-violet-600 text-xs font-bold relative z-10">{num}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {index === 0 && "Identification du problème"}
                    {index === 1 && "Développement de la plateforme"}
                    {index === 2 && "Croissance et expansion"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {index === 0 && "Analyse des défis uniques du marché événementiel africain"}
                    {index === 1 && "Création d'une solution adaptée aux réalités locales"}
                    {index === 2 && "Aujourd'hui, leader de la gestion d'événements au Cameroun"}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}