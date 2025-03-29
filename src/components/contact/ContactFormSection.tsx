'use client';

import { motion } from 'framer-motion';
import ContactInfo from './ContactInfo';
import ContactForm from './ContactForm';

export default function ContactFormSection({ animationTriggered }) {
  return (
    <section className="py-16 bg-gray-50" id="contact-form">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-5">
            {/* Carte et infos */}
            <div className="md:col-span-2 bg-gradient-to-br from-violet-600 to-indigo-700 text-white p-8 md:p-12 relative overflow-hidden">
              {/* Cercles décoratifs */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mt-20 -mr-20"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full -mb-10 -ml-10"></div>
              
              <ContactInfo animationTriggered={animationTriggered} />
            </div>
            
            {/* Formulaire */}
            <div className="md:col-span-3 p-8 md:p-12">
              <ContactForm animationTriggered={animationTriggered} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}