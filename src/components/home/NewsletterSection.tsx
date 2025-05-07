import React from 'react';
import { Button } from '@/components/ui/Button';

const NewsletterSection: React.FC = () => {
  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Restez informé</h2>
          <p className="text-gray-600 mb-6">
            Abonnez-vous à notre newsletter pour recevoir les dernières actualités sur les événements à venir
          </p>
          
          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input 
              type="email" 
              placeholder="Votre adresse email"
              className="flex-1 h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet"
              required
            />
            <Button type="submit" className="h-12 whitespace-nowrap">
              S'abonner
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;