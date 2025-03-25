import { motion } from 'framer-motion';
import { CtaSectionProps } from '@/types/about';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function CtaSection({ animationTriggered }: CtaSectionProps) {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-700 z-0"></div>
      
      {/* Formes décoratives */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <motion.div 
          className="absolute -top-24 -right-24 w-96 h-96 bg-purple-400 rounded-full opacity-20 blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        ></motion.div>
        <motion.div 
          className="absolute -bottom-24 -left-24 w-96 h-96 bg-pink-400 rounded-full opacity-20 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        ></motion.div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full">
          <svg className="absolute top-0 left-0 opacity-10" width="100%" height="100%" viewBox="0 0 800 800">
            <defs>
              <pattern id="pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="2" fill="white" />
              </pattern>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern)" />
          </svg>
        </div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={animationTriggered ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-white mb-6"
              initial={{ opacity: 0 }}
              animate={animationTriggered ? { opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              Prêt à révolutionner vos événements?
            </motion.h2>
            <motion.p 
              className="text-xl text-white/80 mb-8 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={animationTriggered ? { opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Rejoignez les milliers d'organisateurs qui font confiance à EventEz pour leurs événements.
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap gap-4 justify-center"
              initial={{ opacity: 0 }}
              animate={animationTriggered ? { opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Button 
                  href="/register" 
                  variant="default" 
                  className="bg-white text-violet-700 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-shadow px-8 py-4 rounded-full text-lg"
                >
                  Créer un compte gratuitement
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Button 
                  href="/demo" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white/10 px-8 py-4 rounded-full text-lg"
                >
                  Demander une démo
                </Button>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="mt-12 text-white/80 text-sm"
              initial={{ opacity: 0 }}
              animate={animationTriggered ? { opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <p>Pas encore prêt? <Link href="/events" className="text-white underline">Explorez les événements</Link> sur notre plateforme.</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}