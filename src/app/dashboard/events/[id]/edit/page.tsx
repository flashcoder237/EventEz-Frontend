'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import EventForm from '@/components/dashboard/EventForm';
import { eventsAPI,categoriesAPI ,tagsAPI  } from '@/lib/api';
import { Category, Tag, Event } from '@/types';

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const [event, setEvent] = useState<Event | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session || !params?.id) {
      router.push('/login');
      return;
    }

const fetchData = async () => {
  setLoading(true);
  try {
    const [eventRes, categoriesRes, tagsRes] = await Promise.all([
      eventsAPI.getEvent(params.id),
      categoriesAPI.getCategories(),
      tagsAPI.getTags(),
    ]);
    setEvent(eventRes.data);
    setCategories(categoriesRes.data.results || categoriesRes.data);
    setTags(tagsRes.data.results || tagsRes.data);
  } catch (err) {
    console.error('Error fetching event data:', err);
    setError('Erreur lors du chargement des données de l\'événement.');
  } finally {
    setLoading(false);
  }
};

    fetchData();
  }, [session, params, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center mt-8">
        {error}
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center mt-8">
        Événement non trouvé.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <EventForm event={event} categories={categories} tags={tags} mode="edit" />
    </div>
  );
}
