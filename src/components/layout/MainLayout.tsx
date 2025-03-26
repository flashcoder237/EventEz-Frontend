// src/components/layout/MainLayout.tsx
import { ReactNode } from 'react';
import ModernHeader from './ModernHeader';
import Footer from './Footer';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <ModernHeader />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}