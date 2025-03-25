// src/components/events/detail/tabs/EventReviewsTab.tsx
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Event, Feedback } from '@/types';
import { Button } from '@/components/ui/Button';
import { MessageCircle, User, Star, X, Edit, Trash } from 'lucide-react';
import { feedbacksAPI } from '@/lib/api';

interface EventReviewsTabProps {
  feedbacks: Feedback[];
  event: Event;
}

export default function EventReviewsTab({ feedbacks, event }: EventReviewsTabProps) {
  const { data: session, status } = useSession();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [userFeedback, setUserFeedback] = useState<Feedback | null>(null);
  const [displayedFeedbacks, setDisplayedFeedbacks] = useState(feedbacks);
  const [editMode, setEditMode] = useState(false);

  // Vérifier si l'utilisateur actuel a déjà laissé un avis
  const currentUserFeedback = displayedFeedbacks.find(
    feedback => session?.user?.id && feedback.user === session.user.id
  );

  // Calculer la note moyenne
  const averageRating = displayedFeedbacks.length > 0
    ? displayedFeedbacks.reduce((sum, item) => sum + item.rating, 0) / displayedFeedbacks.length
    : 0;

  const handleRatingClick = (value: number) => {
    setRating(value);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) return;

    setLoading(true);
    try {
      // Créer un nouveau feedback
      const feedbackData = {
        event: event.id,
        rating,
        comment
      };

      if (editMode && userFeedback) {
        // Mettre à jour un feedback existant
        await feedbacksAPI.updateFeedback(userFeedback.id, feedbackData);
        
        // Mettre à jour l'affichage local
        setDisplayedFeedbacks(prev => 
          prev.map(f => f.id === userFeedback.id 
            ? { ...f, rating, comment, updated_at: new Date().toISOString() }
            : f
          )
        );
      } else {
        // Créer un nouveau feedback
        const response = await feedbacksAPI.createFeedback(feedbackData);
        
        // Ajouter à l'affichage local
        const newFeedback = {
          id: response.data.id,
          event: event.id,
          user: session.user.id,
          user_name: session.user.name || 'Utilisateur',
          rating,
          comment,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_approved: true,
          is_featured: false
        };
        
        setDisplayedFeedbacks([newFeedback, ...displayedFeedbacks]);
      }

      // Réinitialiser le formulaire
      setRating(5);
      setComment('');
      setShowReviewForm(false);
      setEditMode(false);
    } catch (error) {
      console.error('Erreur lors de la soumission de l\'avis:', error);
      alert('Une erreur est survenue lors de la soumission de votre avis.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditReview = (feedback: Feedback) => {
    setUserFeedback(feedback);
    setRating(feedback.rating);
    setComment(feedback.comment);
    setEditMode(true);
    setShowReviewForm(true);
  };

  const handleDeleteReview = async (feedbackId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet avis ?')) return;
    
    try {
      await feedbacksAPI.deleteFeedback(feedbackId);
      setDisplayedFeedbacks(prev => prev.filter(f => f.id !== feedbackId));
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'avis:', error);
      alert('Une erreur est survenue lors de la suppression de votre avis.');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Avis et commentaires</h2>
        
        {status !== 'loading' && session?.user && !currentUserFeedback && !showReviewForm && (
          <Button 
            variant="outline" 
            size="sm"
            className="inline-flex items-center"
            onClick={() => setShowReviewForm(true)}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Laisser un avis
          </Button>
        )}
      </div>
      
      {/* Résumé des avis */}
      {displayedFeedbacks.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="flex items-center mr-4">
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= Math.round(averageRating)
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <div>
              <span className="font-bold text-lg">{averageRating.toFixed(1)}</span>
              <span className="text-gray-600 ml-1">
                sur 5 ({displayedFeedbacks.length} avis)
              </span>
            </div>
          </div>
        </div>
      )}
      
      {/* Formulaire d'avis */}
      {showReviewForm && (
        <div className="bg-white rounded-lg border p-4 mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-lg">
              {editMode ? 'Modifier votre avis' : 'Laisser un avis'}
            </h3>
            <button 
              onClick={() => {
                setShowReviewForm(false);
                setEditMode(false);
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmitReview}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Votre note</label>
              <div className="flex">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingClick(star)}
                    className="p-1"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= rating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-gray-300'
                      } hover:text-amber-400 transition-colors`}
                    />
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="comment" className="block text-sm font-medium mb-2">
                Votre commentaire
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border rounded-md p-2"
                rows={4}
                placeholder="Partagez votre expérience..."
                required
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={loading}
                className="bg-primary"
              >
                {loading 
                  ? 'Envoi en cours...' 
                  : editMode 
                    ? 'Mettre à jour' 
                    : 'Publier l\'avis'
                }
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowReviewForm(false);
                  setEditMode(false);
                }}
              >
                Annuler
              </Button>
            </div>
          </form>
        </div>
      )}
      
      {/* Liste des avis */}
      {displayedFeedbacks.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Aucun avis n'a encore été laissé pour cet événement.</p>
          {status !== 'loading' && session?.user && !showReviewForm && (
            <Button
              onClick={() => setShowReviewForm(true)}
              className="mt-4 bg-primary"
            >
              Soyez le premier à laisser un avis
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {displayedFeedbacks.map(feedback => {
            const isUserFeedback = session?.user?.id && feedback.user === session.user.id;
            
            return (
              <div key={feedback.id} className="border-b pb-6 last:border-0">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium flex items-center">
                        {feedback.user_name}
                        {isUserFeedback && (
                          <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                            Vous
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(feedback.created_at).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-5 w-5 ${i < feedback.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    
                    {isUserFeedback && (
                      <div className="flex ml-3">
                        <button
                          onClick={() => handleEditReview(feedback)}
                          className="text-gray-400 hover:text-primary mr-2"
                          title="Modifier"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteReview(feedback.id)}
                          className="text-gray-400 hover:text-red-500"
                          title="Supprimer"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-3 text-gray-700">
                  {feedback.comment}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}