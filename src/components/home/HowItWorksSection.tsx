'use client';

import React from 'react';
import { 
  Ticket, 
  ClipboardList, 
  BarChart2,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';

const HowItWorksSection: React.FC = () => {
  // Définir les animations
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 * i,
        duration: 0.6,
        ease: [0.6, 0.05, 0.01, 0.9]
      }
    })
  };

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <motion.span 
            custom={0} 
            variants={fadeIn} 
            className="inline-block py-1 px-3 rounded-full bg-violet-100 text-violet-700 font-medium text-sm mb-4"
          >
            Notre plateforme
          </motion.span>
          
          <motion.h2 
            custom={1} 
            variants={fadeIn} 
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent"
          >
            Comment ça marche
          </motion.h2>
          
          <motion.p 
            custom={2} 
            variants={fadeIn} 
            className="text-lg text-gray-600"
          >
            Notre plateforme offre une solution complète pour organiser et gérer vos événements au Cameroun, du début à la fin.
          </motion.p>
        </motion.div>
        
        <div className="relative">
          {/* Ligne de connexion avec animation de dessin */}
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="hidden md:block absolute top-36 left-0 h-1 bg-gradient-to-r from-violet-200 via-pink-300 to-violet-200 z-0"
          ></motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                icon: <Ticket className="h-8 w-8" />,
                title: "Billetterie avancée",
                description: "Gérez facilement différents types de billets, codes promotionnels, et offrez plusieurs méthodes de paiement à vos participants.",
                link: "/features/ticketing"
              },
              {
                icon: <ClipboardList className="h-8 w-8" />,
                title: "Formulaires personnalisés",
                description: "Créez des formulaires d'inscription sur mesure avec des champs personnalisés pour collecter les informations dont vous avez besoin.",
                link: "/features/forms"
              },
              {
                icon: <BarChart2 className="h-8 w-8" />,
                title: "Analyses en temps réel",
                description: "Accédez à des statistiques détaillées et des rapports personnalisés pour mesurer le succès de vos événements.",
                link: "/features/analytics"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={fadeIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="relative"
              >
                <div className="bg-white rounded-xl shadow-xl p-8 h-full transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-gray-100">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 flex items-center justify-center text-white">
                      {feature.icon}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-lg text-gray-700">
                      {index + 1}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 text-gray-800">{feature.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  <div className="mt-auto">
                    <Button 
                      href={feature.link}
                      variant="ghost"
                      className="group text-violet-600 hover:text-pink-500 transition-colors p-0 flex items-center space-x-1"
                    >
                      <span>En savoir plus</span>
                      <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-center mt-16"
          >
            <Button 
              href="/features" 
              className="rounded-full px-8 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-700 hover:to-fuchsia-900 text-white shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              Découvrir toutes nos fonctionnalités
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;