import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import EventForm from '@/components/dashboard/events/EventForm';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export const metadata = {
  title: 'Créer un événement | EventEz',
  description: 'Créez un nouvel événement sur EventEz',
};

export default async function CreateEventPage() {
  // Vérifier l'authentification côté serveur
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/signin?callbackUrl=/dashboard/events/create');
  }
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Créer un événement</h1>
          <p className="mt-1 text-sm text-gray-500">
            Remplissez le formulaire ci-dessous pour créer un nouvel événement
          </p>
        </div>
        
        <EventForm />
      </div>
    </DashboardLayout>
  );
}
