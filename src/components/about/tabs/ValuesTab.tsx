import { motion } from 'framer-motion';
import { SectionProps } from '@/types/about';
import { Heart, Shield, Globe } from 'lucide-react';

export default function ValuesTab({ animationTriggered }: SectionProps) {
  const values = [
    { 
      icon: <Heart className="h-8 w-8 text-violet-600 group-hover:text-white transition-colors" />, 
      title: "Innovation locale", 
      description: "Nous développons des solutions technologiques adaptées aux réalités africaines, en prenant en compte les infrastructures locales et les habitudes des utilisateurs." 
    },
    { 
      icon: <Shield className="h-8 w-8 text-violet-600 group-hover:text-white transition-colors" />, 
      title: "Confiance et transparence", 
      description: "Nous bâtissons des relations de confiance avec nos utilisateurs grâce à une tarification transparente et une communication ouverte sur notre fonctionnement." 
    },
    { 
      icon: <Globe className="h-8 w-8 text-violet-600 group-hover:text-white transition-colors" />, 
      title: "Accessibilité", 
      description: "Nous nous efforçons de rendre la technologie événementielle accessible à tous, des grands organisateurs aux plus petites associations, avec des outils simples et puissants." 
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      key="valeurs-tab"
    >
      <motion.div 
        className="text-center mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-gray-700 leading-relaxed max-w-3xl mx-auto">
          Chez EventEz, nos valeurs fondamentales guident chacune de nos décisions et façonnent notre approche du service client.
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {values.map((item, index) => (
          <motion.div 
            key={index} 
            className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 group relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            whileHover={{ y: -5 }}
          >
            {/* Effet de blur au survol */}
            <motion.div 
              className="absolute -inset-20 bg-violet-100 filter blur-3xl z-0"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 0.6 }}
              transition={{ duration: 0.3 }}
            />
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-violet-100 group-hover:bg-violet-600 transition-colors rounded-full flex items-center justify-center mb-6">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-700">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}