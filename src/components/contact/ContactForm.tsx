'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { MessageSquare, HelpCircle, Users, Send } from 'lucide-react';

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

export default function ContactForm({ animationTriggered }) {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
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

  return (
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
  );
}