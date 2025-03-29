'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function FaqSection({ animationTriggered }) {
  const faqItems = [
    {
      question: "Comment créer un événement sur EventEz?",
      answer: "Pour créer un événement, vous devez d'abord vous inscrire en tant qu'organisateur. Une fois connecté, accédez à votre tableau de bord et cliquez sur 'Créer un événement'. Suivez ensuite les étapes du formulaire pour configurer tous les détails de votre événement."
    },
    {
      question: "Quels modes de paiement sont acceptés?",
      answer: "EventEz accepte plusieurs méthodes de paiement adaptées au marché africain, notamment MTN Mobile Money, Orange Money, ainsi que les cartes de crédit Visa et Mastercard pour les paiements internationaux."
    },
    {
      question: "Comment fonctionne la billetterie EventEz?",
      answer: "Notre système de billetterie permet aux organisateurs de créer différents types de billets avec des quotas et des périodes de vente personnalisés. Les participants reçoivent un billet électronique avec QR code qui peut être scanné à l'entrée de l'événement via notre application mobile (même en mode hors ligne)."
    },
    {
      question: "Quels sont les frais d'utilisation d'EventEz?",
      answer: "EventEz applique une commission de 5% sur chaque billet vendu pour les événements payants. Pour les événements gratuits, l'utilisation de la plateforme est entièrement gratuite. Des fonctionnalités premium sont également disponibles via notre formule d'abonnement mensuel."
    },
    {
      question: "Puis-je utiliser EventEz pour un événement en dehors du Cameroun?",
      answer: "Absolument! Bien que notre siège social soit au Cameroun, EventEz est disponible dans plusieurs pays d'Afrique, avec des méthodes de paiement adaptées à chaque région."
    }
  ];

  return (
    <section className="py-20 bg-white" id="faq">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-section" id="faq-header">
          <motion.div 
            className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={animationTriggered["faq-header"] ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
          >
            FAQ
          </motion.div>
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={animationTriggered["faq-header"] ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Questions fréquemment posées
          </motion.h2>
          <motion.p 
            className="text-gray-600 text-lg"
            initial={{ opacity: 0 }}
            animate={animationTriggered["faq-header"] ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Tout ce que vous devez savoir pour démarrer avec EventEz
          </motion.p>
        </div>
        
        <div className="max-w-3xl mx-auto" id="faq-items">
          {faqItems.map((item, index) => (
            <motion.div 
              key={index}
              className="border border-gray-200 rounded-xl overflow-hidden mb-4 text-black"
              initial={{ opacity: 1, y: 20 }}
              animate={animationTriggered["faq-items"] ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ scale: 1.01 }}
            >
              <details className="group">
                <summary className="flex justify-between items-center cursor-pointer px-6 py-4">
                  <h3 className="text-lg font-medium text-gray-900">{item.question}</h3>
                  <span className="relative ml-1.5 h-5 w-5 flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="absolute inset-0 w-5 h-5 opacity-100 group-open:opacity-0 transition-opacity duration-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="absolute inset-0 w-5 h-5 opacity-0 group-open:opacity-100 transition-opacity duration-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </span>
                </summary>
                <div className="px-6 pb-4 text-gray-700">
                  <div className="pt-1 border-t border-gray-200 mt-1"></div>
                  <p className="mt-3">{item.answer}</p>
                </div>
              </details>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={animationTriggered["faq-items"] ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <p className="text-gray-600 mb-4">Vous ne trouvez pas la réponse à votre question?</p>
          <a href="#contact-form" className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-800 transition-colors">
            Contactez-nous directement
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}