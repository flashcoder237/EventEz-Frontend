import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export const metadata = {
  title: 'Tableau de bord | EventEz',
  description: 'Gérez vos événements et inscriptions sur EventEz',
};

export default async function DashboardPage() {
  // Vérifier l'authentification côté serveur
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/signin?callbackUrl=/dashboard');
  }
  
  return (
    <DashboardLayout title="Tableau de bord">
      <DashboardOverview />
    </DashboardLayout>
  );
}
