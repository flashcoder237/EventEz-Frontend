import React from 'react';
import Link from 'next/link';
import { 
  Award, 
  Calendar, 
  MapPin, 
  TrendingUp, 
  Ticket, 
  Clock 
} from 'lucide-react';
import { Category } from '@/types/events';

interface CategoriesSectionProps {
  categories: Category[];
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({ categories }) => {
  // Icônes prédéfinies pour les catégories
  const categoryIcons = [
    <Award key="1" className="h-8 w-8" />,
    <Calendar key="2" className="h-8 w-8" />,
    <MapPin key="3" className="h-8 w-8" />,
    <TrendingUp key="4" className="h-8 w-8" />,
    <Ticket key="5" className="h-8 w-8" />,
    <Clock key="6" className="h-8 w-8" />
  ];

  return (
    <section className="py-20 ">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-violet-600 font-semibold text-sm uppercase tracking-wider">Explorez par intérêt</span>
          <h2 className="text-3xl font-bold mt-2">Trouvez votre prochaine expérience</h2>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.slice(0, 6).map((category, index) => (
            <Link 
              key={category.id}
              href={`/events/categories/${category.id}`}
              className="group"
            >
              <div className="aspect-square rounded-xl bg-white border border-gray-100 p-6 flex flex-col items-center justify-center shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1">
                <div className="p-4 bg-violet-50 rounded-full mb-4 text-violet-600 group-hover:bg-violet-100 transition-colors">
                  {categoryIcons[index % categoryIcons.length]}
                </div>
                <h3 className="font-semibold text-center text-gray-800">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;