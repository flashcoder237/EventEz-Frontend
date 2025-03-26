import { ReactNode } from 'react';
import ModernHeader from './ModernHeader';
import Footer from './Footer';
import DashboardSidebar from './DashboardSidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

/**
 * Layout pour toutes les pages dashboard
 * Inclut le header, le sidebar et le footer
 */
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <ModernHeader />
      <div className="flex flex-1 py-16">
        <DashboardSidebar />
        <main className="flex-1 bg-gray-50 p-4 overflow-auto">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}