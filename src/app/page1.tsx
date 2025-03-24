// app/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import EventGrid from '@/components/events/EventGrid';
import { eventsAPI,categoriesAPI } from '@/lib/api';

export const metadata: Metadata = {
  title: 'EventEz - Accueil',
  description: 'Découvrez et créez des événements en ligne au Cameroun',
};

async function getFeaturedEvents() {
  try {
    const response = await eventsAPI.getEvents({ is_featured: true, status: 'validated' });
    return response.data.results || [];
  } catch (error) {
    console.error('Error fetching featured events:', error);
    return [];
  }
}

async function getCategories() {
  try {
    const response = await categoriesAPI.getCategories();
    return response.data.results || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function Home() {
  const featuredEvents = await getFeaturedEvents();
  const categories = await getCategories();
  
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/images/hero-bg.jpg"
            alt="Background"
            fill
            className="object-cover opacity-30"
          />
        </div>
        
        <div className="relative container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Découvrez et créez des événements exceptionnels au Cameroun
            </h1>
            <p className="text-lg text-gray-300 mb-8">
              EventEz est une plateforme complète de gestion d'événements, adaptée aux réalités locales du Cameroun.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button href="/events" size="lg">
                Explorer les événements
              </Button>
              <Button href="/register-organizer" variant="outline" size="lg">
                Devenir organisateur
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Events Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Événements en vedette</h2>
            <Link href="/events" className="text-primary font-medium hover:underline">
              Voir tous les événements
            </Link>
          </div>
          
          <EventGrid events={featuredEvents} />
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Explorer par catégorie
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link key={category.id} href={`/events?category=${category.id}`}>
                <div className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-shadow">
                  <div className="h-16 w-16 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center">
                    {category.image ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${category.image}`}
                        alt={category.name}
                        width={32}
                        height={32}
                      />
                    ) : (
                      <span className="text-2xl text-primary">
                        {category.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <h3 className="font-medium">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
            Pourquoi choisir EventEz ?
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Une solution complète pour tous vos besoins en matière d'organisation d'événements
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center text-primary mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Billetterie en ligne</h3>
              <p className="text-gray-600">
              Vendez des billets en ligne avec différentes options (standard, VIP, early bird) et acceptez les paiements via Mobile Money (MTN, Orange) et méthodes internationales.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center text-primary mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Formulaires personnalisés</h3>
              <p className="text-gray-600">
                Créez des formulaires d'inscription adaptés pour les événements ne nécessitant pas l'achat de billets, avec facturation basée sur l'usage.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center text-primary mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Analytiques détaillées</h3>
              <p className="text-gray-600">
                Accédez à des statistiques et rapports détaillés pour comprendre le succès de vos événements et optimiser vos futures stratégies.
              </p>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}