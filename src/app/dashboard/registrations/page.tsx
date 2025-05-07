import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import RegistrationsList from '@/components/dashboard/registrations/RegistrationsList';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export const metadata = {
  title: 'Mes inscriptions | EventEz',
  description: 'Gérez vos inscriptions aux événements sur EventEz',
};

export default async function RegistrationsPage() {
  // Vérifier l'authentification côté serveur
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/signin?callbackUrl=/dashboard/registrations');
  }
  
  return (
    <DashboardLayout title="Mes inscriptions">
      <div className="space-y-6">    
        <RegistrationsList />
      </div>
    </DashboardLayout>
  );
}
