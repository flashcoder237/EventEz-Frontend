'use client';

import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { 
  Check, 
  ArrowRight, 
  CheckCircle,
  CreditCard,
  Users,
  Calendar,
  Shield,
  HelpCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

// Types
type PricingPlan = {
  id: string;
  name: string;
  description: string;
  price: string;
  currency: string;
  frequency: string;
  features: string[];
  highlighted: boolean;
  mostPopular: boolean;
  ctaText: string;
  color: string;
};

type FAQ = {
  question: string;
  answer: string;
};

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [animationTriggered, setAnimationTriggered] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Configuration de l'Intersection Observer pour les animations
    const observerOptions = {
      threshold: 0.2,
      rootMargin: '-50px 0px'
    };
    
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setAnimationTriggered(prev => ({
            ...prev,
            [entry.target.id]: true
          }));
        }
      });
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Observer les sections pour les animations
    const sections = document.querySelectorAll('.animate-section');
    sections.forEach(section => {
      observer.observe(section);
    });
    
    return () => {
      sections.forEach(section => {
        observer.unobserve(section);
      });
    };
  }, []);

  const toggleFaq = (index: number) => {
    if (expandedFaq === index) {
      setExpandedFaq(null);
    } else {
      setExpandedFaq(index);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  // Données - Plans tarifaires
  const pricingPlans: PricingPlan[] = [
    {
      id: 'free',
      name: 'Gratuit',
      description: 'Pour les petits événements et organisateurs débutants',
      price: billingCycle === 'monthly' ? '0' : '0',
      currency: 'XAF',
      frequency: billingCycle === 'monthly' ? '/mois' : '/an',
      features: [
        'Jusqu\'à 50 participants par événement',
        '1 événement actif à la fois',
        'Billetterie de base',
        'Paiements Mobile Money',
        'Assistance email'
      ],
      highlighted: false,
      mostPopular: false,
      ctaText: 'Commencer gratuitement',
      color: 'from-gray-500 to-gray-600'
    },
    {
      id: 'essential',
      name: 'Essentiel',
      description: 'Pour les événements réguliers de taille moyenne',
      price: billingCycle === 'monthly' ? '15,000' : '150,000',
      currency: 'XAF',
      frequency: billingCycle === 'monthly' ? '/mois' : '/an',
      features: [
        'Jusqu\'à 200 participants par événement',
        '5 événements actifs simultanés',
        'Billetterie personnalisée',
        'Tous les modes de paiement',
        'Analyse des ventes',
        'Scan de billets',
        'Assistance en ligne 24/7'
      ],
      highlighted: true,
      mostPopular: true,
      ctaText: 'Essayer 14 jours gratuits',
      color: 'from-indigo-600 to-violet-600'
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Pour les organisateurs professionnels et grands événements',
      price: billingCycle === 'monthly' ? '40,000' : '400,000',
      currency: 'XAF',
      frequency: billingCycle === 'monthly' ? '/mois' : '/an',
      features: [
        'Participants illimités',
        'Événements illimités',
        'Billetterie avancée avec sièges assignés',
        'Mode hors-ligne complet',
        'API d\'intégration',
        'Équipe dédiée',
        'Assistance téléphonique prioritaire',
        'Personnalisation complète'
      ],
      highlighted: false,
      mostPopular: false,
      ctaText: 'Contacter les ventes',
      color: 'from-blue-600 to-blue-800'
    }
  ];

  // FAQ section data
  const faqs: FAQ[] = [
    {
      question: 'Quels sont les frais par transaction?',
      answer: 'EventEz prélève une commission de 5% + 100 XAF par billet vendu sur tous les plans, y compris le plan gratuit. Cette commission couvre les frais de traitement des paiements et l\'utilisation de la plateforme.'
    },
    {
      question: 'Puis-je changer de plan à tout moment?',
      answer: 'Oui, vous pouvez passer à un plan supérieur à tout moment. Si vous passez à un plan inférieur, le changement prendra effet à la fin de votre période de facturation courante.'
    },
    {
      question: 'Y a-t-il des contrats à long terme?',
      answer: 'Non, tous nos plans sont sans engagement. Vous pouvez annuler à tout moment et vous ne serez facturé que pour la période que vous avez utilisée.'
    },
    {
      question: 'Comment fonctionne l\'essai gratuit?',
      answer: 'L\'essai gratuit de 14 jours vous donne accès à toutes les fonctionnalités du plan Essentiel. Aucune carte de crédit n\'est requise pour commencer. À la fin de la période d\'essai, vous pouvez choisir de passer à un plan payant ou de revenir au plan Gratuit.'
    },
    {
      question: 'Offrez-vous des remises pour les organisations à but non lucratif?',
      answer: 'Oui, nous offrons une remise de 30% sur tous nos plans payants pour les organisations à but non lucratif vérifiées. Contactez notre équipe commerciale pour en savoir plus.'
    }
  ];

  // Additional services
  const additionalServices = [
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Personnalisation sur mesure',
      description: 'Solutions adaptées à vos besoins spécifiques, y compris la marque, le design et les fonctionnalités.',
      price: 'Sur devis'
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: 'Assistance événementielle',
      description: 'Personnel EventEz sur place pour gérer la billetterie et l\'entrée lors de votre événement.',
      price: 'À partir de 75,000 XAF/jour'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Formation et onboarding',
      description: 'Sessions de formation personnalisées pour votre équipe pour tirer le meilleur parti de la plateforme.',
      price: 'À partir de 50,000 XAF'
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: 'Intégration de paiement personnalisée',
      description: 'Intégration avec vos processeurs de paiement préférés ou spécifiques à votre région.',
      price: 'Sur devis'
    }
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background avec effet parallaxe */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-violet-800">
          <motion.div 
            className="absolute inset-0 opacity-10"
            animate={{ 
              backgroundPosition: ['0px 0px', '100px 50px'],
            }}
            transition={{ 
              repeat: Infinity, 
              repeatType: "mirror", 
              duration: 20, 
              ease: "linear" 
            }}
            style={{
              backgroundImage: 'url("/images/pattern-dots.svg")',
              backgroundSize: '30px'
            }}
          />
        </div>

        {/* Formes décoratives animées */}
        <motion.div 
          className="absolute top-20 right-[20%] w-64 h-64 rounded-full bg-purple-500/20 filter blur-3xl z-0"
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div 
          className="absolute bottom-10 left-[30%] w-48 h-48 rounded-full bg-blue-500/20 filter blur-3xl z-0"
          animate={{
            x: [0, -20, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />

        {/* Contenu */}
        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md text-white rounded-full text-sm font-medium mb-4">
                Tarifs simples et transparents
              </span>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-6 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Choisissez le plan adapté à vos besoins
            </motion.h1>
            
            <motion.p 
              className="text-xl text-indigo-100 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Une tarification adaptée au contexte africain, sans frais cachés et avec toutes les fonctionnalités essentielles incluses.
            </motion.p>

            {/* Toggle mensuel/annuel */}
            <motion.div
              className="flex justify-center mt-8 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="bg-white/10 p-1 rounded-full backdrop-blur-md">
                <div className="flex items-center">
                  <button
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                      billingCycle === 'monthly'
                        ? 'bg-white text-indigo-700'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    Mensuel
                  </button>
                  <button
                    onClick={() => setBillingCycle('yearly')}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                      billingCycle === 'yearly'
                        ? 'bg-white text-indigo-700'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    Annuel <span className="text-xs opacity-80">(2 mois gratuits)</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Forme décorative en bas */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden z-10">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12 md:h-20">
            <path fill="white" d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25"></path>
            <path fill="white" d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5"></path>
            <path fill="white" d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
          </svg>
        </div>
      </section>

      {/* Pricing Cards Section */}
        <section className="py-16 bg-white relative z-20">
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto -mt-24 relative z-20">
            {pricingPlans.map((plan, index) => (
                <motion.div 
                key={plan.id}
                className="animate-section"
                id={`pricing-card-${index}`}
                initial={{ opacity: 0, y: 30 }}
                animate={animationTriggered[`pricing-card-${index}`] ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                >
                <div className={`bg-white shadow-xl rounded-xl overflow-hidden h-full flex flex-col border ${plan.mostPopular ? 'border-indigo-500' : 'border-transparent'}`}>
                    {plan.mostPopular && (
                    <div className="bg-indigo-500 text-white py-1.5 px-4 text-sm font-medium text-center">
                        Le plus populaire
                    </div>
                    )}
                    <div className={`bg-gradient-to-br ${plan.color} p-6 text-white`}>
                    <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                    <p className="text-indigo-100 text-sm mb-4">{plan.description}</p>
                    <div className="flex items-end mb-2">
                        <span className="text-sm mr-1">{plan.currency}</span>
                        <span className="text-4xl font-bold">{plan.price}</span>
                        <span className="text-indigo-100 ml-1">{plan.frequency}</span>
                    </div>
                    </div>
                    <div className="p-6 flex-grow">
                    <ul className="space-y-3 mb-6">
                        {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                            <Check className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{feature}</span>
                        </li>
                        ))}
                    </ul>
                    </div>
                    <div className="p-6 pt-0">
                    <Button 
                        className={`w-full py-3 rounded-lg ${
                        plan.highlighted 
                            ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700' 
                            : 'bg-white border border-gray-300 text-gray-800 hover:bg-gray-50'
                        }`}
                    >
                        {plan.ctaText}
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    </div>
                </div>
                </motion.div>
            ))}
            </div>
        </div>
        </section>

        {/* Section frais de transaction */}
{/* Section frais de transaction */}
<section className="py-20 bg-gradient-to-br from-indigo-50 to-violet-50 relative overflow-hidden">
  {/* Éléments décoratifs */}
  <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full blur-3xl opacity-70 -translate-y-1/2 translate-x-1/4"></div>
  <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-full blur-3xl opacity-70 translate-y-1/3 -translate-x-1/4"></div>
  
  <div className="absolute inset-0 opacity-20">
    <motion.div 
      className="absolute inset-0"
      animate={{ 
        backgroundPosition: ['0px 0px', '100px 100px'],
      }}
      transition={{ 
        repeat: Infinity, 
        repeatType: "mirror", 
        duration: 15, 
        ease: "linear" 
      }}
      style={{
        backgroundImage: 'url("/images/pattern-dots.svg")',
        backgroundSize: '20px'
      }}
    />
  </div>

  <div className="container mx-auto px-4 relative z-10">
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-16 animate-section" id="transaction-fees-header">
        <motion.div 
          className="inline-block px-4 py-1.5 bg-white text-indigo-600 rounded-full text-sm font-medium mb-4 shadow-sm"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={animationTriggered["transaction-fees-header"] ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5 }}
        >
          Tarification transparente
        </motion.div>
        <motion.h2 
          className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={animationTriggered["transaction-fees-header"] ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Comprendre nos frais de transaction
        </motion.h2>
        <motion.p 
          className="text-gray-700 text-xl max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={animationTriggered["transaction-fees-header"] ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Une structure simple et prévisible pour chaque billet vendu sur la plateforme
        </motion.p>
      </div>

      <motion.div 
        className="bg-white rounded-3xl shadow-xl overflow-hidden animate-section" 
        id="transaction-fees-details"
        initial={{ opacity: 0, y: 20 }}
        animate={animationTriggered["transaction-fees-details"] ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {/* Ruban "Inclus dans tous les plans" */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 py-3 px-8 text-white text-center font-medium">
          Tarification uniforme incluse dans tous les plans
        </div>
        
        <div className="p-8 md:p-12">
          <div className="grid md:grid-cols-12 gap-x-10 gap-y-12">
            {/* Colonne Structure des frais */}
            <div className="md:col-span-7">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-indigo-100 text-indigo-600 w-10 h-10 rounded-full flex items-center justify-center mr-4">
                  <CreditCard className="h-5 w-5" />
                </span>
                Structure des frais
              </h3>
              
              <div className="space-y-8">
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <span className="h-10 w-10 rounded-full bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 font-bold mr-4">%</span>
                      <div>
                        <h4 className="font-bold text-xl text-gray-900">5%</h4>
                        <p className="text-gray-600">Commission fixe</p>
                      </div>
                    </div>
                    <div className="w-16 h-16 flex items-center justify-center bg-indigo-600 text-white rounded-full text-lg font-bold">+</div>
                  </div>
                  <p className="text-gray-700">Prélevée sur le montant total de chaque billet vendu via la plateforme, quel que soit votre forfait.</p>
                </div>
                
                <div className="bg-gradient-to-br from-violet-50 to-violet-100 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center mb-4">
                    <span className="h-10 w-10 rounded-full bg-violet-600 text-white flex items-center justify-center flex-shrink-0 font-bold mr-4">XAF</span>
                    <div>
                      <h4 className="font-bold text-xl text-gray-900">100 XAF</h4>
                      <p className="text-gray-600">Par billet</p>
                    </div>
                  </div>
                  <p className="text-gray-700">Frais fixes appliqués sur chaque transaction pour couvrir les coûts de traitement des paiements.</p>
                </div>
              </div>
              
              <div className="mt-8 pt-8 border-t border-dashed border-gray-300">
                <h4 className="font-bold text-lg text-gray-900 mb-4">Comment ça marche - Exemple concret</h4>
                <div className="bg-gray-50 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-medium text-gray-900">Pour un billet vendu à 5 000 XAF :</span>
                    <span className="bg-indigo-600 text-white rounded-full px-4 py-1 text-sm font-medium">Calcul</span>
                  </div>
                  <table className="w-full text-gray-700">
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="py-3">Prix du billet</td>
                        <td className="py-3 text-right font-medium">5 000 XAF</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-3">Commission (5%)</td>
                        <td className="py-3 text-right">- 250 XAF</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-3">Frais fixes</td>
                        <td className="py-3 text-right">- 100 XAF</td>
                      </tr>
                      <tr>
                        <td className="py-3 font-bold text-lg text-indigo-700">Montant reversé</td>
                        <td className="py-3 text-right font-bold text-lg text-indigo-700">4 650 XAF</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            {/* Colonne Modes de paiement */}
            <div className="md:col-span-5">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-indigo-100 text-indigo-600 w-10 h-10 rounded-full flex items-center justify-center mr-4">
                  <CreditCard className="h-5 w-5" />
                </span>
                Modes de paiement
              </h3>
              
              <div className="bg-gray-50 rounded-2xl p-6 shadow-inner mb-8">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center mr-1 font-bold text-sm">OM</div>
                    <span className="font-medium">Orange Money</span>
                  </div>
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center mr-1 font-bold text-sm">MM</div>
                    <span className="font-medium">MTN Mobile</span>
                  </div>
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center mr-1 font-bold text-sm">CB</div>
                    <span className="font-medium">Carte bancaire</span>
                  </div>
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-green-100 text-green-500 flex items-center justify-center mr-1 font-bold text-sm">VP</div>
                    <span className="font-medium">Virement</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                  <h4 className="font-semibold flex items-center text-gray-900 mb-3">
                    <span className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                      <Check className="h-4 w-4" />
                    </span>
                    Tout est inclus
                  </h4>
                  <p className="text-gray-700">Les frais de 5% + 100 XAF comprennent déjà les commissions des processeurs de paiement. Aucun frais supplémentaire ne sera appliqué.</p>
                </div>
                
                <div className="bg-violet-50 p-6 rounded-xl border border-violet-100">
                  <h4 className="font-semibold flex items-center text-gray-900 mb-3">
                    <span className="bg-violet-100 text-violet-600 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                      <HelpCircle className="h-4 w-4" />
                    </span>
                    Choix de tarification
                  </h4>
                  <p className="text-gray-700">Répercutez ces frais sur vos participants ou intégrez-les dans vos prix. Cette option est configurable pour chaque événement.</p>
                </div>
                
                <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 rounded-xl text-white flex items-center">
                  <div className="mr-4 flex-shrink-0">
                    <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Paiements sécurisés</h4>
                    <p className="text-indigo-100 text-sm">Transferts automatiques et traçables. Délai de versement de 48h après l'événement.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 p-8 text-white">
          <div className="flex flex-wrap items-center justify-between">
            <div className="mb-6 md:mb-0 md:max-w-lg">
              <h4 className="font-bold text-xl mb-2 flex items-center">
                <span className="bg-indigo-500 h-8 w-8 rounded-full flex items-center justify-center mr-3">
                  <HelpCircle className="h-4 w-4" />
                </span>
                Questions sur notre tarification?
              </h4>
              <p className="text-gray-300">Notre équipe commerciale est à votre disposition pour élaborer une solution parfaitement adaptée à vos besoins spécifiques.</p>
            </div>
            <div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <a 
                  href="/contact" 
                  className="bg-white text-gray-800 hover:bg-gray-100 px-6 py-3 rounded-xl inline-flex items-center font-bold shadow-lg hover:shadow-xl transition-all"
                >
                  Demander un devis personnalisé
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </div>
</section>
      {/* CTA Section */}
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
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Prêt à faire passer vos événements au niveau supérieur?</h2>
              <p className="text-lg text-indigo-100 mb-10 max-w-xl mx-auto">
                Rejoignez des milliers d'organisateurs qui font confiance à EventEz pour simplifier leur billetterie et améliorer l'expérience de leurs participants.
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
                    Commencer gratuitement
                    <CheckCircle className="ml-2 h-5 w-5" />
                  </a>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <a 
                    href="/contact" 
                    className="bg-transparent text-white border-2 border-white hover:bg-white/10 px-8 py-4 rounded-full text-lg font-medium inline-flex items-center transition-colors"
                  >
                    Parler à un conseiller
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </motion.div>
              </div>

              <p className="text-indigo-200 mt-8">
                Pas d'engagement. Annulez à tout moment.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
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
                Questions fréquentes sur la tarification
            </motion.h2>
            <motion.p 
                className="text-gray-600 text-lg"
                initial={{ opacity: 0 }}
                animate={animationTriggered["faq-header"] ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                Tout ce que vous devez savoir sur nos tarifs et conditions
            </motion.p>
            </div>
            
            <div className="max-w-3xl mx-auto" id="faq-items">
            {faqs.map((item, index) => (
                <motion.div 
                key={index}
                className="border border-gray-200 rounded-xl overflow-hidden mb-4 text-black"
                initial={{ opacity: 1, y: 20 }}
                animate={animationTriggered["faq-items"] ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0 + (index * 0.1) }}
                whileHover={{ scale: 1.1 }}
                >
                <details className="group" open={expandedFaq === index}>
                    <summary 
                    className="flex justify-between items-center cursor-pointer px-6 py-4"
                    onClick={(e) => {
                        e.preventDefault();
                        toggleFaq(index);
                    }}
                    >
                    <h2 className="text-lg font-medium text-gray-900">{item.question}</h2>
                    <span className="relative ml-1.5 h-5 w-5 flex-shrink-0">
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`absolute inset-0 w-5 h-5 transition-opacity duration-300 ${expandedFaq === index ? 'opacity-0' : 'opacity-100'}`}
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
                        className={`absolute inset-0 w-5 h-5 transition-opacity duration-300 ${expandedFaq === index ? 'opacity-100' : 'opacity-0'}`}
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
            <p className="text-gray-900 mb-4">Vous avez d'autres questions sur nos tarifs?</p>
            <a href="/contact" className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-800 transition-colors">
                Contactez notre équipe commerciale
                <ArrowRight className="ml-2 h-4 w-4" />
            </a>
            </motion.div>
        </div>
        </section>

      {/* Entreprises qui nous font confiance */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-semibold text-gray-700 mb-3">
              Ils nous font confiance pour leurs événements
            </h2>
            <p className="text-gray-500 text-xl">
              Rejoignez plus de 500 entreprises et organisations qui utilisent EventEz
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 max-w-5xl mx-auto opacity-70">
            {/* Les logos seraient normalement des images, mais ici nous utilisons des placeholders */}
            {Array.from({ length: 6 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="h-12 w-24 bg-gray-400 rounded flex items-center justify-center text-white font-bold"
              >
                LOGO {index + 1}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}