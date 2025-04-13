import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import SettingsForm from '@/components/dashboard/settings/SettingsForm';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export const metadata = {
  title: 'Paramètres | EventEz',
  description: 'Configurez vos paramètres sur EventEz',
};

export default async function SettingsPage() {
  // Vérifier l'authentification côté serveur
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/signin?callbackUrl=/dashboard/settings');
  }
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
          <p className="mt-1 text-sm text-gray-500">
            Configurez vos préférences et options de compte
          </p>
        </div>
        
        <SettingsForm />
      </div>
    </DashboardLayout>
  );
}
