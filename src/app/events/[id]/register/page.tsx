// app/events/[id]/register/page.tsx
import { redirect, notFound } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import MainLayout from '@/components/layout/MainLayout';
import EventRegistrationForm from '@/components/events/EventRegistrationForm';
import { eventsAPI } from '@/lib/api';

// Metadata generation
export async function generateMetadata({ 
  params 
}: { 
  params: { id: string } 
}) {
  try {
    // Récupérer les détails de l'événement
    const eventResponse = await eventsAPI.getEvent(params.id);
    const event = eventResponse.data;
    
    return {
      title: `Inscription - ${event.title}`,
      description: event.short_description || event.description.substring(0, 160)
    };
  } catch (error) {
    console.error('Erreur lors du chargement des métadonnées:', error);
    return {
      title: 'Inscription à l\'événement',
      description: 'Page d\'inscription'
    };
  }
}

export default async function EventRegisterPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  // Vérifier si l'utilisateur est connecté
  const session = await getServerSession(authOptions);
  
  if (!session) {
    // Rediriger vers la page de connexion
    redirect(`/login?redirect=/events/${params.id}/register`);
  }
  
  try {
    // Récupérer les détails de l'événement
    const eventResponse = await eventsAPI.getEvent(params.id);
    const event = eventResponse.data;

    // Vérifications de base
    const now = new Date();
    const eventEndDate = new Date(event.end_date);
    const registrationDeadline = event.registration_deadline 
      ? new Date(event.registration_deadline) 
      : null;

    // Validation de l'événement
    if (
      event.status !== 'validated' || 
      eventEndDate < now || 
      (registrationDeadline && registrationDeadline < now)
    ) {
      notFound();
    }

    // Filtrage des types de billets pour les événements de type billetterie
    const ticketTypes = event.event_type === 'billetterie' 
      ? (event.ticket_types || []).filter(
          (ticketType: any) => 
            ticketType.is_visible && 
            new Date(ticketType.sales_start) <= now && 
            new Date(ticketType.sales_end) >= now &&
            ticketType.quantity_total > ticketType.quantity_sold
        )
      : [];

    // Champs de formulaire pour les événements d'inscription
    const formFields = event.event_type === 'inscription' 
      ? (event.form_fields || []) 
      : [];
    
    return (
      <MainLayout>
        {/* En-tête de la page d'inscription */}
        <div className="bg-gradient-to-r from-purple-800 to-indigo-700 text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
            <p className="text-xl text-purple-100">
              {event.event_type === 'billetterie' 
                ? 'Achetez vos billets' 
                : 'Formulaire d\'inscription'
              }
            </p>
          </div>
        </div>
        
        {/* Contenu du formulaire d'inscription */}
        <div className="container mx-auto px-4 py-12">
          <EventRegistrationForm 
            event={event}
            ticketTypes={ticketTypes}
            formFields={formFields}
          />
        </div>
      </MainLayout>
    );
  } catch (error) {
    console.error('Erreur lors de la récupération des données d\'inscription:', error);
    notFound();
  }
}