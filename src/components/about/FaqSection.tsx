import { motion } from 'framer-motion';
import { FaqSectionProps } from '@/types/about';
import { Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function FaqSection({ faqs, expandedFaq, toggleFaq, animationTriggered }: FaqSectionProps) {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={animationTriggered ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <motion.div 
            className="inline-block mb-3 px-3 py-1 bg-violet-100 text-violet-800 rounded-full text-sm font-semibold"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={animationTriggered ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            FAQ
          </motion.div>
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0 }}
            animate={animationTriggered ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Questions fréquentes
          </motion.h2>
          <motion.p 
            className="text-gray-700 leading-relaxed max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={animationTriggered ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Tout ce que vous devez savoir sur EventEz et notre plateforme.
          </motion.p>
        </motion.div>
        
        <div className="max-w-3xl mx-auto space-y-6">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index} 
              className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={animationTriggered ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + (index * 0.1) }}
              whileHover={{ scale: 1.01 }}
            >
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none bg-white hover:bg-gray-50 transition-colors"
                onClick={() => toggleFaq(index)}
                aria-expanded={expandedFaq === index}
                aria-controls={`faq-content-${index}`}
              >
                <span className="font-medium text-gray-900">{faq.question}</span>
                <span className={`transition-transform duration-300 ${expandedFaq === index ? 'rotate-180' : ''}`}>
                  {expandedFaq === index ? (
                    <Minus className="h-5 w-5 text-violet-600" />
                  ) : (
                    <Plus className="h-5 w-5 text-gray-500" />
                  )}
                </span>
              </button>
              <motion.div 
                id={`faq-content-${index}`}
                className={`px-6 py-4 bg-white border-t border-gray-100`}
                initial={{ height: 0, opacity: 0, overflow: 'hidden' }}
                animate={{ 
                  height: expandedFaq === index ? 'auto' : 0,
                  opacity: expandedFaq === index ? 1 : 0
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <p className="text-gray-700">{faq.answer}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={animationTriggered ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <p className="text-gray-700 mb-6">Vous ne trouvez pas la réponse à votre question?</p>
          <Button 
            href="/contact" 
            variant="outline" 
            className="border-violet-600 text-violet-600 hover:bg-violet-50 px-6 py-3 rounded-full"
          >
            Contactez notre équipe
          </Button>
        </motion.div>
      </div>
    </section>
  );
}