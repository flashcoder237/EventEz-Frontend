import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import NotificationsList from '@/components/dashboard/notifications/NotificationsList';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export const metadata = {
  title: 'Mes notifications | EventEz',
  description: 'Gérez vos notifications sur EventEz',
};

export default async function NotificationsPage() {
  // Vérifier l'authentification côté serveur
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/signin?callbackUrl=/dashboard/notifications');
  }
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mes notifications</h1>
            <p className="mt-1 text-sm text-gray-500">
              Restez informé des mises à jour de vos événements et inscriptions
            </p>
          </div>
        </div>
        
        <NotificationsList />
      </div>
    </DashboardLayout>
  );
}
