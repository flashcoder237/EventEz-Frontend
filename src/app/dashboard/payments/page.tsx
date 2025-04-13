import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import PaymentsList from '@/components/dashboard/payments/PaymentsList';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export const metadata = {
  title: 'Mes paiements | EventEz',
  description: 'Gérez vos paiements sur EventEz',
};

export default async function PaymentsPage() {
  // Vérifier l'authentification côté serveur
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/signin?callbackUrl=/dashboard/payments');
  }
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes paiements</h1>
          <p className="mt-1 text-sm text-gray-500">
            Historique et gestion de vos paiements
          </p>
        </div>
        
        <PaymentsList />
      </div>
    </DashboardLayout>
  );
}
