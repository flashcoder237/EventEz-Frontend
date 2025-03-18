// components/layout/DashboardLayout.tsx
import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import DashboardSidebar from './DashboardSidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 bg-gray-50">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}