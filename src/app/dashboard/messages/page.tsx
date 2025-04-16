import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import MessagesList from '@/components/dashboard/messages/MessagesList';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export const metadata = {
  title: 'Messages | EventEz',
  description: 'Gérez vos messages sur EventEz',
};

export default async function MessagesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin?callbackUrl=/dashboard/messages');
  }

  return (
    <DashboardLayout title="Messages">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gérez vos messages avec les participants et autres organisateurs
          </p>
        </div>

        <MessagesList />
      </div>
    </DashboardLayout>
  );
}
