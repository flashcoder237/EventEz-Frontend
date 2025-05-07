import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import EventsList from '@/components/dashboard/events/EventsList';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export const metadata = {
  title: 'Mes événements | EventEz',
  description: 'Gérez vos événements sur EventEz',
};

export default async function EventsPage() {
  // Vérifier l'authentification côté serveur
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/signin?callbackUrl=/dashboard/events');
  }
  
  return (
    <DashboardLayout title="Mes événements">
      <div className="space-y-6">  
        <EventsList />
      </div>
    </DashboardLayout>
  );
}
