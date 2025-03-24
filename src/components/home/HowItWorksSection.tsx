import React from 'react';
import { 
  Ticket, 
  ClipboardList, 
  BarChart2,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

const HowItWorksSection: React.FC = () => {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Notre plateforme</span>
          <h2 className="text-4xl font-bold mt-2 mb-4">Comment ça marche</h2>
          <p className="text-lg text-gray-600">
            Notre plateforme offre une solution complète pour organiser et gérer vos événements au Cameroun, du début à la fin.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Ligne de connexion */}
          <div className="hidden md:block absolute top-1/4 left-0 w-full h-1 bg-primary/20 z-0"></div>
          
          <div className="relative z-10 bg-white">
            <div className="text-center p-6">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <Ticket className="text-primary text-3xl" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">1</div>
              </div>
              <h3 className="text-2xl font-bold mb-4">Billetterie avancée</h3>
              <p className="text-gray-600">
                Gérez facilement différents types de billets, codes promotionnels, et offrez plusieurs méthodes de paiement à vos participants.
              </p>
              
              <div className="mt-6">
                <Button 
                  href="/features/ticketing" 
                  variant="ghost"
                  className="text-primary hover:bg-primary/10"
                >
                  En savoir plus
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="relative z-10 bg-white">
            <div className="text-center p-6">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <ClipboardList className="text-primary text-3xl" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">2</div>
              </div>
              <h3 className="text-2xl font-bold mb-4">Formulaires personnalisés</h3>
              <p className="text-gray-600">
                Créez des formulaires d'inscription sur mesure avec des champs personnalisés pour collecter les informations dont vous avez besoin.
              </p>
              
              <div className="mt-6">
                <Button 
                  href="/features/forms" 
                  variant="ghost"
                  className="text-primary hover:bg-primary/10"
                >
                  En savoir plus
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="relative z-10 bg-white">
            <div className="text-center p-6">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <BarChart2 className="text-primary text-3xl" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">3</div>
              </div>
              <h3 className="text-2xl font-bold mb-4">Analyses en temps réel</h3>
              <p className="text-gray-600">
                Accédez à des statistiques détaillées et des rapports personnalisés pour mesurer le succès de vos événements.
              </p>
              
              <div className="mt-6">
                <Button 
                  href="/features/analytics" 
                  variant="ghost"
                  className="text-primary hover:bg-primary/10"
                >
                  En savoir plus
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12 w-full">
            <Button 
              href="/features" 
              variant="outline"
              className="rounded-full px-8 border-2 border-primary hover:bg-primary hover:text-white transition-colors"
            >
              Découvrir toutes nos fonctionnalités
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;