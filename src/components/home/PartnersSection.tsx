import React from 'react';
import Image from 'next/image';

const PartnersSection: React.FC = () => {
  return (
    <section>
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <span className="text-gray-500 font-medium">Ils nous font confiance</span>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div 
              key={item} 
              className="grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all"
            >
              <Image 
                src={`/images/partner-${item}.png`}
                alt="Partenaire"
                width={120}
                height={60}
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;