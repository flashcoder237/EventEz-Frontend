// src/app/(dashboard)/layout.tsx
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { authOptions } from '@/app/api/auth/[...nextauth]/options'; 

export default async function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  
  // Vérification de l'authentification côté serveur
  if (!session || !session.user) {
    redirect('/login?redirect=/dashboard');
  }
  
  // Vérification du rôle d'organisateur
  if (session.user.role !== 'organizer' && session.user.role !== 'admin') {
    redirect('/');
  }
  
  return <DashboardLayout>{children}</DashboardLayout>;
}