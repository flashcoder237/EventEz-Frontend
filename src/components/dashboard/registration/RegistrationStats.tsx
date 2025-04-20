import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Registration } from '@/types';

interface RegistrationStatsProps {
  registrations: Registration[];
  totalRegistrations: number;
}

export default function RegistrationStats({ registrations, totalRegistrations }: RegistrationStatsProps) {
  // Calculer les statistiques
  const confirmedCount = registrations.filter(r => r.status === 'confirmed').length;
  const pendingCount = registrations.filter(r => r.status === 'pending').length;
  const checkedInCount = registrations.filter(r => r.is_checked_in).length;
  
  // Calculer les pourcentages (éviter division par zéro)
  const confirmedPercentage = registrations.length > 0 
    ? ((confirmedCount / registrations.length) * 100).toFixed(1) 
    : '0.0';
  
  const checkedInPercentage = registrations.length > 0 
    ? ((checkedInCount / registrations.length) * 100).toFixed(1) 
    : '0.0';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
      <StatCard 
        title="Total des inscriptions"
        value={totalRegistrations}
        subtitle="Tous événements confondus"
      />
      
      <StatCard 
        title="Confirmées"
        value={confirmedCount}
        subtitle={`${confirmedPercentage}% du total`}
        valueColor="text-green-600"
      />
      
      <StatCard 
        title="En attente"
        value={pendingCount}
        subtitle="Nécessitent une action"
        valueColor="text-amber-600"
      />
      
      <StatCard 
        title="Présence"
        value={checkedInCount}
        subtitle={`${checkedInPercentage}% de présence`}
        valueColor="text-indigo-600"
      />
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  subtitle: string;
  valueColor?: string;
}

function StatCard({ title, value, subtitle, valueColor = '' }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${valueColor}`}>{value}</div>
        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
      </CardContent>
    </Card>
  );
}