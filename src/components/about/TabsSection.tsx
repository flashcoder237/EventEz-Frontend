import { motion } from 'framer-motion';
import { TabsSectionProps } from '@/types/about';
import Image from 'next/image';
import { CheckCircle } from 'lucide-react';
import HistoryTab from './tabs/HistoryTab';
import ValuesTab from './tabs/ValuesTab';
import MissionTab from './tabs/MissionTab';

export default function TabsSection({ activeTab, setActiveTab, animationTriggered }: TabsSectionProps) {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div 
          className="flex flex-col items-center mb-12"
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
            Notre Entreprise
          </motion.div>
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center text-gray-900"
            initial={{ opacity: 0 }}
            animate={animationTriggered ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Notre histoire et nos valeurs
          </motion.h2>
        </motion.div>
        
        {/* Navigation tabs */}
        <motion.div 
          className="flex justify-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={animationTriggered ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="inline-flex rounded-full border border-gray-200 p-1 bg-white relative">
            {/* Blur glow derrière l'onglet actif */}
            <motion.div 
              className="absolute inset-0 rounded-full bg-violet-200 filter blur-md z-0"
              initial={{ opacity: 0 }}
              animate={animationTriggered ? { 
                opacity: 0.6,
                left: activeTab === 'histoire' ? '0%' : activeTab === 'valeurs' ? '33.33%' : '66.66%',
                width: '33.33%'
              } : {}}
              transition={{ duration: 0.4 }}
            />
            
            <button 
              onClick={() => setActiveTab('histoire')}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-colors relative z-10 ${
                activeTab === 'histoire' 
                  ? 'bg-violet-600 text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              Notre Histoire
            </button>
            <button 
              onClick={() => setActiveTab('valeurs')}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-colors relative z-10 ${
                activeTab === 'valeurs' 
                  ? 'bg-violet-600 text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              Nos Valeurs
            </button>
            <button 
              onClick={() => setActiveTab('mission')}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-colors relative z-10 ${
                activeTab === 'mission' 
                  ? 'bg-violet-600 text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              Notre Mission
            </button>
          </div>
        </motion.div>
        
        {/* Tab content */}
        <div className="max-w-5xl mx-auto">
          {activeTab === 'histoire' && <HistoryTab animationTriggered={animationTriggered} />}
          {activeTab === 'valeurs' && <ValuesTab animationTriggered={animationTriggered} />}
          {activeTab === 'mission' && <MissionTab animationTriggered={animationTriggered} />}
        </div>
      </div>
    </section>
  );
}