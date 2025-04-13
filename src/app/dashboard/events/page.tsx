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
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mes événements</h1>
            <p className="mt-1 text-sm text-gray-500">
              Gérez tous vos événements
            </p>
          </div>
          <a
            href="/dashboard/events/create"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Créer un événement
          </a>
        </div>
        
        <EventsList />
      </div>
    </DashboardLayout>
  );
}
