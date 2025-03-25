import { motion } from 'framer-motion';
import { AdvantagesSectionProps } from '@/types/about';
import { Calendar, CreditCard, BarChart2, Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AdvantagesSection({ advantages, animationTriggered }: AdvantagesSectionProps) {
  // Fonction pour obtenir l'icône correspondante
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Calendar':
        return <Calendar className="h-7 w-7 text-violet-600 group-hover:text-white transition-colors" />;
      case 'CreditCard':
        return <CreditCard className="h-7 w-7 text-violet-600 group-hover:text-white transition-colors" />;
      case 'BarChart2':
        return <BarChart2 className="h-7 w-7 text-violet-600 group-hover:text-white transition-colors" />;
      case 'Shield':
        return <Shield className="h-7 w-7 text-violet-600 group-hover:text-white transition-colors" />;
      default:
        return <Calendar className="h-7 w-7 text-violet-600 group-hover:text-white transition-colors" />;
    }
  };

  return (
    <section className="py-20 bg-gradient-to-r from-violet-50 to-purple-50">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={animationTriggered ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <motion.div 
            className="inline-block mb-3 px-3 py-1 bg-violet-100 text-violet-800 rounded-full text-sm font-semibold"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={animationTriggered ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Nos Avantages
          </motion.div>
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0 }}
            animate={animationTriggered ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Pourquoi choisir EventEz
          </motion.h2>
          <motion.p 
            className="text-gray-700 leading-relaxed max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={animationTriggered ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Notre plateforme offre des avantages uniques pour la gestion d'événements en Afrique.
          </motion.p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {advantages.map((item, index) => (
            <motion.div 
              key={index}
              className="flex gap-5 items-start group p-6 rounded-xl hover:bg-white transition-colors relative"
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              animate={animationTriggered ? { opacity: 1, x: 0 } : {}}
              transition={{ 
                duration: 0.7, 
                delay: 0.2 + (index * 0.1),
                ease: "easeOut"
              }}
              whileHover={{ y: -5 }}
            >
              {/* Effet de blur au survol */}
              <motion.div 
                className="absolute -inset-2 bg-gradient-to-r from-violet-200/30 to-pink-200/30 rounded-xl filter blur-xl opacity-0 -z-10"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              
              <div className="w-14 h-14 bg-violet-100 group-hover:bg-violet-600 transition-colors rounded-2xl flex items-center justify-center flex-shrink-0">
                <motion.div 
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  {getIcon(item.icon)}
                </motion.div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-violet-600 transition-colors">{item.title}</h3>
                <p className="text-gray-700 mb-4">{item.description}</p>
                <div className="flex items-center gap-8">
                  {item.stats.map((stat, statIdx) => (
                    <motion.div 
                      key={statIdx}
                      initial={{ opacity: 0 }}
                      animate={animationTriggered ? { opacity: 1 } : {}}
                      transition={{ duration: 0.5, delay: 0.5 + (index * 0.1) + (statIdx * 0.1) }}
                    >
                      <span className="block text-2xl font-bold text-violet-600">{stat.value}</span>
                      <span className="text-sm text-gray-500">{stat.label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={animationTriggered ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Button href="/register-organizer" className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white border-0 px-8 py-4 rounded-full text-lg shadow-lg hover:shadow-xl transition-all relative overflow-hidden group">
              {/* Élément de blur animé */}
              <motion.div 
                className="absolute inset-0 bg-white opacity-0 filter blur-md"
                animate={{ 
                  x: ["0%", "100%"], 
                  opacity: [0, 0.3, 0] 
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2,
                  ease: "easeInOut" 
                }}
              />
              <span className="relative z-10">Commencer gratuitement</span>
              <ArrowRight className="ml-2 h-5 w-5 relative z-10" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}