import { motion } from 'framer-motion';
import { TestimonialsSectionProps } from '@/types/about';
import Image from 'next/image';

export default function TestimonialsSection({ testimonials, animationTriggered }: TestimonialsSectionProps) {
  return (
    <section className="py-28 bg-white relative overflow-hidden">
      {/* Formes décoratives */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-violet-50 to-transparent -z-0"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-indigo-50 to-transparent -z-0"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={animationTriggered ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <motion.div 
            className="inline-block mb-3 px-3 py-1.5 bg-violet-100 text-violet-800 rounded-full text-sm font-semibold shadow-sm"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={animationTriggered ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Témoignages
          </motion.div>
          <motion.h2 
            className="text-3xl md:text-5xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0 }}
            animate={animationTriggered ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Ce que disent nos clients
          </motion.h2>
          <motion.p 
            className="text-gray-700 leading-relaxed max-w-3xl mx-auto text-lg"
            initial={{ opacity: 0 }}
            animate={animationTriggered ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Découvrez l'expérience de ceux qui utilisent EventEz pour leurs événements.
          </motion.p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 max-w-5xl mx-auto">
          {testimonials.map((item, index) => (
            <motion.div 
              key={index} 
              className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 relative group overflow-hidden border border-gray-100"
              initial={{ opacity: 0, y: 30 }}
              animate={animationTriggered ? { opacity: 1, y: 0 } : {}}
              transition={{ 
                duration: 0.5, 
                delay: 0.3 + (index * 0.15)
              }}
              whileHover={{ y: -10 }}
            >
              {/* Effet de glow au survol */}
              <motion.div 
                className="absolute -inset-4 bg-gradient-to-br from-violet-200/30 to-pink-200/30 filter blur-2xl opacity-0 z-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              
              {/* Guillemets décoratifs */}
              <motion.div 
                className="absolute -top-6 -left-6 text-8xl text-violet-200 opacity-30 font-serif leading-none z-0"
                initial={{ opacity: 0, rotate: -10 }}
                animate={animationTriggered ? { opacity: 0.3, rotate: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4 + (index * 0.1) }}
              >
                "
              </motion.div>
              
              <div className="relative z-10">
                <motion.div 
                  className="flex gap-1 mb-4 text-amber-400"
                  initial={{ opacity: 0 }}
                  animate={animationTriggered ? { opacity: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.5 + (index * 0.1) }}
                >
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </motion.div>
                
                <motion.p 
                  className="text-gray-700 mb-8 relative leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={animationTriggered ? { opacity: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.6 + (index * 0.1) }}
                >
                  "{item.quote}"
                </motion.p>
                
                <motion.div 
                  className="flex items-center gap-4 pt-4 border-t border-gray-200"
                  initial={{ opacity: 0 }}
                  animate={animationTriggered ? { opacity: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.7 + (index * 0.1) }}
                >
                  <div className="w-14 h-14 rounded-full overflow-hidden shadow-md">
                    <Image src={item.image} alt={item.name} width={56} height={56} className="object-cover" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{item.name}</p>
                    <p className="text-violet-600">{item.role}</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}