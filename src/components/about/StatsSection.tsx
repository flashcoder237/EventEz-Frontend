import { motion } from 'framer-motion';
import { StatsSectionProps } from '@/types/about';

export default function StatsSection({ achievements, animationTriggered }: StatsSectionProps) {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {achievements.map((item, index) => (
            <motion.div 
              key={index} 
              className="relative p-8 rounded-xl hover:shadow-xl transition-all duration-300 border border-gray-100 bg-white group overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              animate={animationTriggered ? { opacity: 1, y: 0 } : {}}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                ease: "easeOut" 
              }}
              whileHover={{ 
                scale: 1.03,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.01)",
                transition: { duration: 0.2 } 
              }}
            >
              {/* Cercle de gradient décoratif */}
              <div className="absolute -right-20 -bottom-20 w-64 h-64 rounded-full bg-gradient-to-tl from-violet-50 to-white group-hover:from-violet-100 opacity-0 group-hover:opacity-100 transition-all duration-500 z-0"></div>
              
              {/* Effet de blur au survol */}
              <motion.div 
                className="absolute -inset-1 rounded-xl bg-violet-200/0 blur-xl z-0"
                initial={{ opacity: 0 }}
                whileHover={{ 
                  opacity: 0.7,
                  backgroundColor: "rgba(196, 181, 253, 0.3)" // violet-200 avec opacité
                }}
                transition={{ duration: 0.3 }}
              />
              
              <div className="relative z-10 text-center">
                <motion.div 
                  className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 mb-3 inline-block"
                  initial={{ opacity: 0 }}
                  animate={animationTriggered ? { 
                    opacity: 1,
                    transition: {
                      delay: index * 0.1 + 0.3
                    }
                  } : {}}
                >
                  {item.number}
                </motion.div>
                <motion.div 
                  className="text-gray-600 font-medium"
                  initial={{ opacity: 0 }}
                  animate={animationTriggered ? { 
                    opacity: 1,
                    transition: {
                      delay: index * 0.1 + 0.5
                    }
                  } : {}}
                >
                  {item.text}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}