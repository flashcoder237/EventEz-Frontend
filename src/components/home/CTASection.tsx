import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

const CTASection: React.FC = () => {
  return (
    <section className="py-20 ">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full translate-y-1/3 -translate-x-1/4"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-white">Prêt à lancer votre prochain événement ?</h2>
          <p className="text-xl mb-8 text-white">
            Rejoignez notre communauté d'organisateurs et profitez d'une plateforme complète pour faire de votre événement un succès retentissant.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              href="/register-organizer" 
              variant="default" 
              size="xl"
              className="rounded-full px-8 py-6 text-lg font-medium bg-white text-violet-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all"
            >
              Créer mon compte organisateur
            </Button>
            <Button 
              href="/contact" 
              variant="outline" 
              size="xl"
              className="rounded-full px-8 py-6 text-lg font-medium bg-transparent text-white border-white hover:bg-white/10 transition-all"
            >
              Nous contacter
            </Button>
          </div>
          
          <p className="mt-8 text-white/90">
            Déjà membre ? <Link href="/login" className="text-white font-medium underline hover:no-underline">Connectez-vous</Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;