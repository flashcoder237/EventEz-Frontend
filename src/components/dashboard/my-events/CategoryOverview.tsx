import { Badge } from '@/components/ui/Badge';

interface CategoryOverviewProps {
  categoryData: Array<{
    category__name: string;
    count: number;
  }>;
  totalEvents: number;
}

export default function CategoryOverview({ categoryData, totalEvents }: CategoryOverviewProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Répartition par catégorie</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {categoryData.map((category, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-700">{category.category__name}</span>
              <Badge variant="outline">{category.count}</Badge>
            </div>
            <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-primary" 
                style={{ width: `${(category.count / totalEvents) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}