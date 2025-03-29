import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { FaCalendarAlt, FaUsers, FaMoneyBillWave, FaTicketAlt, FaChartBar } from 'react-icons/fa';
import { formatCurrency } from '@/lib/utils';

interface StatisticsCardsProps {
  stats: {
    totalEvents: number;
    upcomingEvents: number;
    ongoingEvents: number;
    completedEvents: number;
    totalRevenue: number;
    totalRegistrations: number;
    conversionRate: number;
    avgFillRate: number;
    paymentCount: number;
    avgTransaction: number;
    paymentMethods: Array<{
      payment_method: string;
      percentage: number;
    }>;
    registrationTypes: Array<{
      registration_type: string;
      count: number;
    }>;
  };
}

export default function StatisticsCards({ stats }: StatisticsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
      {/* Carte des événements */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium text-gray-700 flex items-center">
            <FaCalendarAlt className="mr-2 text-primary" />
            Événements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary">{stats.totalEvents}</div>
          <div className="mt-2 flex flex-wrap text-sm text-gray-600 gap-y-1 gap-x-4">
            <div><span className="font-medium text-blue-600">{stats.upcomingEvents}</span> à venir</div>
            <div><span className="font-medium text-green-600">{stats.ongoingEvents}</span> en cours</div>
            <div><span className="font-medium text-gray-600">{stats.completedEvents}</span> terminés</div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="text-xs text-gray-500">Taux de remplissage moyen</div>
            <div className="text-sm font-semibold text-gray-700">{stats.avgFillRate.toFixed(2)}%</div>
          </div>
        </CardContent>
      </Card>
      
      {/* Carte des inscriptions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium text-gray-700 flex items-center">
            <FaUsers className="mr-2 text-blue-500" />
            Inscriptions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-500">{stats.totalRegistrations}</div>
          <div className="mt-2 flex flex-wrap text-sm text-gray-600 gap-2">
            {stats.registrationTypes.map((type, index) => (
              <Badge key={index} variant={type.registration_type === 'billetterie' ? 'info' : 'success'}>
                {type.registration_type === 'billetterie' ? 'Billetterie' : 'Inscription'}: {type.count}
              </Badge>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="text-xs text-gray-500">Taux de conversion</div>
            <div className="text-sm font-semibold text-gray-700">{stats.conversionRate}%</div>
          </div>
        </CardContent>
      </Card>
      
      {/* Carte des revenus */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium text-gray-700 flex items-center">
            <FaMoneyBillWave className="mr-2 text-green-500" />
            Revenus
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-500">{formatCurrency(stats.totalRevenue)}</div>
          <div className="mt-2 text-sm text-gray-600">
            {stats.paymentCount} paiements au total
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="text-xs text-gray-500">Transaction moyenne</div>
            <div className="text-sm font-semibold text-gray-700">{formatCurrency(stats.avgTransaction)}</div>
          </div>
        </CardContent>
      </Card>
      
      {/* Carte de répartition des paiements */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium text-gray-700 flex items-center">
            <FaTicketAlt className="mr-2 text-amber-500" />
            Répartition
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {stats.paymentMethods.slice(0, 3).map((method, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    method.payment_method === 'credit_card' ? 'bg-purple-500' :
                    method.payment_method === 'mtn_money' ? 'bg-green-500' :
                    method.payment_method === 'orange_money' ? 'bg-orange-500' :
                    'bg-gray-500'
                  }`}></div>
                  <span className="text-xs text-gray-600 capitalize">
                    {method.payment_method === 'credit_card' ? 'Carte de crédit' :
                     method.payment_method === 'mtn_money' ? 'MTN Money' :
                     method.payment_method === 'orange_money' ? 'Orange Money' :
                     method.payment_method === 'bank_transfer' ? 'Virement bancaire' :
                     method.payment_method}
                  </span>
                </div>
                <span className="text-xs font-medium">{method.percentage?.toFixed(1)}%</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full text-xs justify-center"
              href="/dashboard/analytics"
            >
              <FaChartBar className="mr-2" /> Voir les analytiques détaillées
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}