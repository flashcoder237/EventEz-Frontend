import React from 'react';

const StatsSection: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-primary mb-2">10K+</div>
            <p className="text-gray-600 font-medium">Événements organisés</p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-primary mb-2">500+</div>
            <p className="text-gray-600 font-medium">Organisateurs actifs</p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-primary mb-2">98%</div>
            <p className="text-gray-600 font-medium">Taux de satisfaction</p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-primary mb-2">100K+</div>
            <p className="text-gray-600 font-medium">Participants</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;