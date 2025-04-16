import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import AnalyticsDashboard from '@/components/dashboard/analytics/AnalyticsDashboard';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export const metadata = {
  title: 'Statistiques | EventEz',
  description: 'Analysez les performances de vos événements sur EventEz',
};

export default async function AnalyticsPage() {
  // Vérifier l'authentification côté serveur
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/signin?callbackUrl=/dashboard/analytics');
  }
  
  return (
    <DashboardLayout title="Statistiques">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Statistiques et analyses</h1>
          <p className="mt-1 text-sm text-gray-500">
            Suivez les performances de vos événements et inscriptions
          </p>
        </div>
        
        <AnalyticsDashboard />
      </div>
    </DashboardLayout>
  );
}
