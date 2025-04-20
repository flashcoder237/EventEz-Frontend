'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

export default function ContactCards({ animationTriggered }) {
  const contactItems = [
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
      color: "bg-gradient-to-br from-indigo-500 to-indigo-600" 
    },
    { 
      icon: <MapPin className="h-6 w-6" />, 
      title: "Adresse", 
      info: "Yaoundé, Cameroun", 
      action: "Directions", 
      link: "https://maps.google.com",
      color: "bg-gradient-to-br from-indigo-500 to-indigo-600" 
    }
  ];

  return (
    <section className="py-16 bg-white relative z-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto -mt-24 relative z-20">
          {contactItems.map((item, index) => (
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
  );
}