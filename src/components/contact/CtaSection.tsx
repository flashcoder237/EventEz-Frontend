'use client';

import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';

export default function CtaSection() {
  return (
    <section className="py-20 bg-gradient-to-r from-violet-600 to-indigo-700 text-white relative overflow-hidden">
      {/* Formes décoratives */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-0 right-0 w-80 h-80 bg-white opacity-10 rounded-full -mt-20 -mr-20"
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
          className="absolute bottom-0 left-0 w-60 h-60 bg-white opacity-10 rounded-full -mb-20 -ml-20"
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
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Prêt à organiser votre prochain événement?</h2>
            <p className="text-lg text-indigo-100 mb-10 max-w-xl mx-auto">
              Rejoignez des milliers d'organisateurs qui font confiance à EventEz pour créer des expériences mémorables.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <a 
                  href="/register-organizer" 
                  className="bg-white text-indigo-700 hover:bg-gray-100 px-8 py-4 rounded-full text-lg font-medium inline-flex items-center shadow-lg hover:shadow-xl transition-all"
                >
                  Créer un compte
                  <CheckCircle className="ml-2 h-5 w-5" />
                </a>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <a 
                  href="/demo" 
                  className="bg-transparent text-white border-2 border-white hover:bg-white/10 px-8 py-4 rounded-full text-lg font-medium inline-flex items-center transition-colors"
                >
                  Demander une démo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}