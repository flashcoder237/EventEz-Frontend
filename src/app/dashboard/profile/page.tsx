import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ProfileForm from '@/components/dashboard/profile/ProfileForm';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export const metadata = {
  title: 'Mon profil | EventEz',
  description: 'Gérez votre profil sur EventEz',
};

export default async function ProfilePage() {
  // Vérifier l'authentification côté serveur
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/signin?callbackUrl=/dashboard/profile');
  }
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mon profil</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gérez vos informations personnelles et vos préférences
          </p>
        </div>
        
        <ProfileForm />
      </div>
    </DashboardLayout>
  );
}
