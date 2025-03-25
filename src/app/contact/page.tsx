'use client';

import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send,
  Clock,
  MessageSquare,
  Users,
  HelpCircle,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('general');
  const [animationTriggered, setAnimationTriggered] = useState({});

  useEffect(() => {
    // Configuration de l'Intersection Observer pour les animations
    const observerOptions = {
      threshold: 0.2,
      rootMargin: '-50px 0px'
    };
    
    const observerCallback = (entries) => {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Simulation d'un délai réseau pour la démo
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // TODO: Remplacer par votre logique d'envoi de formulaire
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...formData, category: activeCategory })
      });

      if (response.ok) {
        setSuccess(true);
        // Réinitialiser le formulaire
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Une erreur est survenue. Veuillez réessayer.');
      }
    } catch (err) {
      setError('Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet.');
    } finally {
      setLoading(false);
    }
  };

  // Catégories pour le formulaire
  const categories = [
    { id: 'general', label: 'Question générale', icon: <MessageSquare className="h-4 w-4" /> },
    { id: 'support', label: 'Support technique', icon: <HelpCircle className="h-4 w-4" /> },
    { id: 'business', label: 'Partenariat', icon: <Users className="h-4 w-4" /> }
  ];

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

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background avec effet parallaxe */}
        <div className="absolute inset-0 bg-gradient-to-r from-violet-900 to-indigo-800">
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
                Nous sommes à votre écoute
              </span>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-6 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Comment pouvons-nous vous aider?
            </motion.h1>
            
            <motion.p 
              className="text-xl text-indigo-100 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Notre équipe est disponible pour répondre à toutes vos questions et vous accompagner dans l'organisation de vos événements.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <a href="#contact-form" className="bg-white text-indigo-700 hover:bg-gray-100 px-6 py-3 rounded-full font-medium inline-flex items-center transition-colors">
                Envoyer un message
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
              <a href="#faq" className="border border-white/30 text-white hover:bg-white/10 px-6 py-3 rounded-full font-medium inline-flex items-center transition-colors">
                Voir les FAQ
              </a>
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

      {/* Coordonnées principales */}
      <section className="py-16 bg-white relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto -mt-24 relative z-20">
            {[
              { 
                icon: <Mail className="h-6 w-6" />, 
                title: "Email", 
                info: "contact@eventez.cm", 
                action: "Écrivez-nous", 
                link: "mailto:contact@eventez.cm",
                color: "bg-gradient-to-br from-violet-500 to-purple-600" 
              },
              { 
                icon: <Phone className="h-6 w-6" />, 
                title: "Téléphone", 
                info: "+237 670 000 000", 
                action: "Appelez-nous", 
                link: "tel:+237670000000",
                color: "bg-gradient-to-br from-blue-500 to-indigo-600" 
              },
              { 
                icon: <MapPin className="h-6 w-6" />, 
                title: "Adresse", 
                info: "Yaoundé, Cameroun", 
                action: "Directions", 
                link: "https://maps.google.com",
                color: "bg-gradient-to-br from-indigo-500 to-blue-600" 
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="animate-section"
                id={`contact-card-${index}`}
                initial={{ opacity: 0, y: 30 }}
                animate={animationTriggered[`contact-card-${index}`] ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="bg-white shadow-xl rounded-xl overflow-hidden group h-full">
                  <div className={`${item.color} p-6 text-white flex items-center justify-between transition-all group-hover:pt-8`}>
                    <h3 className="text-xl font-bold">{item.title}</h3>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      {item.icon}
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 mb-4">{item.info}</p>
                    <a 
                      href={item.link} 
                      className="text-indigo-600 font-medium inline-flex items-center hover:text-indigo-800 transition-colors"
                    >
                      {item.action}
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulaire et carte */}
      <section className="py-16 bg-gray-50" id="contact-form">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="grid md:grid-cols-5">
              {/* Carte et infos */}
              <div className="md:col-span-2 bg-gradient-to-br from-violet-600 to-indigo-700 text-white p-8 md:p-12 relative overflow-hidden">
                {/* Cercles décoratifs */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mt-20 -mr-20"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full -mb-10 -ml-10"></div>
                
                <motion.div
                  className="relative z-10 animate-section"
                  id="contact-info"
                  initial={{ opacity: 0 }}
                  animate={animationTriggered["contact-info"] ? { opacity: 1 } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-2xl font-bold mb-6">Contactez-nous</h2>
                  <p className="mb-8 text-indigo-100">Notre équipe est disponible pour vous accompagner dans tous vos projets d'événements au Cameroun et en Afrique.</p>
                  
                  <div className="space-y-6">
                    <motion.div 
                      className="flex items-center space-x-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={animationTriggered["contact-info"] ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    >
                      <div className="bg-white/20 rounded-full p-3 flex-shrink-0">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">Email</h3>
                        <p className="text-indigo-100">contact@eventez.cm</p>
                        <p className="text-indigo-100">support@eventez.cm</p>
                      </div>
                    </motion.div>

                    <motion.div 
                      className="flex items-center space-x-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={animationTriggered["contact-info"] ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <div className="bg-white/20 rounded-full p-3 flex-shrink-0">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">Téléphone</h3>
                        <p className="text-indigo-100">+237 670 000 000</p>
                        <p className="text-indigo-100">+237 696 000 000</p>
                      </div>
                    </motion.div>

                    <motion.div 
                      className="flex items-center space-x-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={animationTriggered["contact-info"] ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <div className="bg-white/20 rounded-full p-3 flex-shrink-0">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">Adresse</h3>
                        <p className="text-indigo-100">Immeuble Nko'o, Rue des Écoles</p>
                        <p className="text-indigo-100">Yaoundé, Cameroun</p>
                      </div>
                    </motion.div>

                    <motion.div 
                      className="flex items-center space-x-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={animationTriggered["contact-info"] ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <div className="bg-white/20 rounded-full p-3 flex-shrink-0">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">Horaires</h3>
                        <p className="text-indigo-100">Lun-Ven: 8h00 - 18h00</p>
                        <p className="text-indigo-100">Sam: 9h00 - 13h00</p>
                      </div>
                    </motion.div>
                  </div>
                  
                  <div className="mt-10">
                    <h3 className="font-medium mb-3">Suivez-nous</h3>
                    <div className="flex space-x-3">
                      {['facebook', 'twitter', 'instagram', 'linkedin'].map((social, idx) => (
                        <motion.a 
                          key={social}
                          href={`https://${social}.com/eventez`} 
                          className="bg-white/20 w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                          initial={{ opacity: 0, y: 10 }}
                          animate={animationTriggered["contact-info"] ? { opacity: 1, y: 0 } : {}}
                          transition={{ duration: 0.3, delay: 0.5 + (idx * 0.1) }}
                          whileHover={{ y: -3 }}
                        >
                          <span className="sr-only">{social}</span>
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            {social === 'facebook' && <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />}
                            {social === 'twitter' && <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />}
                            {social === 'instagram' && <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />}
                            {social === 'linkedin' && <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />}
                          </svg>
                        </motion.a>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
              
              {/* Formulaire */}
              <div className="md:col-span-3 p-8 md:p-12">
                <motion.div
                  className="animate-section"
                  id="contact-form-section"
                  variants={containerVariants}
                  initial="hidden"
                  animate={animationTriggered["contact-form-section"] ? "visible" : "hidden"}
                >
                  <motion.h2 
                    className="text-2xl font-bold mb-2 text-gray-800"
                    variants={itemVariants}
                  >
                    Envoyez-nous un message
                  </motion.h2>
                  
                  <motion.p 
                    className="text-gray-600 mb-6"
                    variants={itemVariants}
                  >
                    Nous vous répondrons dans les plus brefs délais
                  </motion.p>
                  
                  <motion.div 
                    className="mb-6"
                    variants={itemVariants}
                  >
                    <div className="bg-gray-50 p-1 rounded-lg inline-flex">
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => setActiveCategory(category.id)}
                          className={`px-4 py-2 rounded-md flex items-center text-sm transition-colors ${
                            activeCategory === category.id
                              ? 'bg-indigo-600 text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {category.icon}
                          <span className="ml-2">{category.label}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <motion.div variants={itemVariants}>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                        <Input 
                          id="name"
                          type="text" 
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Votre nom"
                          required
                          className="w-full px-4 py-3 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                      </motion.div>
                      
                      <motion.div variants={itemVariants}>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <Input 
                          id="email"
                          type="email" 
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="votre@email.com"
                          required
                          className="w-full px-4 py-3 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                      </motion.div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <motion.div variants={itemVariants}>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                        <Input 
                          id="phone"
                          type="tel" 
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+237 6XX XXX XXX"
                          className="w-full px-4 py-3 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                      </motion.div>
                      
                      <motion.div variants={itemVariants}>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Objet</label>
                        <Input 
                          id="subject"
                          type="text" 
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="Objet de votre message"
                          required
                          className="w-full px-4 py-3 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                      </motion.div>
                    </div>
                    
                    <motion.div className="mb-6" variants={itemVariants}>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                      <Textarea 
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Détaillez votre demande ici..."
                        rows={5}
                        required
                        className="w-full px-4 py-3 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      />
                    </motion.div>

                    {error && (
                      <motion.div 
                        className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-lg mb-6 flex items-start"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm">{error}</p>
                        </div>
                      </motion.div>
                    )}

                    {success && (
                      <motion.div 
                        className="bg-green-50 border border-green-300 text-green-800 px-4 py-3 rounded-lg mb-6 flex items-start"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm">Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.</p>
                        </div>
                      </motion.div>
                    )}
                    
                    <motion.div 
                      className="flex justify-end"
                      variants={itemVariants}
                    >
                      <Button 
                        type="submit" 
                        disabled={loading}
                        className={`px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium hover:from-indigo-700 hover:to-violet-700 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Envoi en cours...
                          </>
                        ) : (
                          <>
                            Envoyer le message
                            <Send className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </form>
                </motion.div>
              </div>
            </div>
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
            {[
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
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="border border-gray-200 rounded-xl overflow-hidden mb-4 text-black"
                initial={{ opacity: 0, y: 20 }}
                animate={animationTriggered["faq-items"] ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + (index * 0.1) }}
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
    </MainLayout>
  );
}