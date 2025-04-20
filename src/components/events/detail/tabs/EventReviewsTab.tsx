'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { Event, Feedback } from '@/types';
import { Button } from '@/components/ui/Button';
import { 
  MessageCircle, 
  User, 
  Star, 
  X, 
  Edit, 
  Trash, 
  CheckCircle,
  Filter,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
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
  
  // Pagination and Filtering
  const [visibleReviews, setVisibleReviews] = useState(3);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [showFilterOptions, setShowFilterOptions] = useState(false);

  // Filtered and paginated feedbacks
  const filteredFeedbacks = useMemo(() => {
    return filterRating
      ? displayedFeedbacks.filter(feedback => feedback.rating === filterRating)
      : displayedFeedbacks;
  }, [displayedFeedbacks, filterRating]);

  // Paginated feedbacks
  const paginatedFeedbacks = useMemo(() => {
    return filteredFeedbacks.slice(0, visibleReviews);
  }, [filteredFeedbacks, visibleReviews]);

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
      const feedbackData = {
        event: event.id,
        rating,
        comment
      };

      if (editMode && userFeedback) {
        await feedbacksAPI.updateFeedback(userFeedback.id, feedbackData);
        
        setDisplayedFeedbacks(prev => 
          prev.map(f => f.id === userFeedback.id 
            ? { ...f, rating, comment, updated_at: new Date().toISOString() }
            : f
          )
        );
      } else {
        const response = await feedbacksAPI.createFeedback(feedbackData);
        
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

  // Gestionnaires de pagination et filtrage
  const loadMoreReviews = () => {
    setVisibleReviews(prev => prev + 3);
  };

  const showLessReviews = () => {
    setVisibleReviews(3);
  };

  const applyRatingFilter = (rating: number | null) => {
    setFilterRating(rating);
    setVisibleReviews(3);
    setShowFilterOptions(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto"
    >
      {/* En-tête et bouton d'avis */}
      <div className="flex items-center justify-between mb-8">
        <motion.h2 
          className="text-3xl font-bold text-gray-800 dark:text-gray-200"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          Avis et commentaires
        </motion.h2>
        
        {status !== 'loading' && session?.user && !currentUserFeedback && !showReviewForm && (
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <Button 
              variant="outline" 
              size="sm"
              className="inline-flex items-center"
              onClick={() => setShowReviewForm(true)}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Laisser un avis
            </Button>
          </motion.div>
        )}
      </div>

      {/* Résumé des avis */}
      <AnimatePresence>
        {displayedFeedbacks.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-900/50 rounded-xl p-6 mb-8 shadow-sm flex justify-between items-center"
          >
            <div className="flex items-center">
              <div className="flex items-center mr-6">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    className={`h-6 w-6 ${
                      star <= Math.round(averageRating)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <div>
                <span className="font-bold text-2xl text-gray-800 dark:text-gray-200">
                  {averageRating.toFixed(1)}
                </span>
                <span className="text-gray-600 dark:text-gray-400 ml-2">
                  sur 5 ({displayedFeedbacks.length} avis)
                </span>
              </div>
            </div>
            
            {/* Filtre des avis */}
            <div className="relative">
              <Button 
                variant="outline"
                size="sm"
                onClick={() => setShowFilterOptions(!showFilterOptions)}
                className="flex items-center"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filtrer
                {filterRating ? ` (${filterRating} ★)` : ''}
              </Button>
              
              <AnimatePresence>
                {showFilterOptions && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 z-10 p-2"
                  >
                    <div className="space-y-1">
                      {[5, 4, 3, 2, 1].map(rating => (
                        <Button
                          key={rating}
                          variant={filterRating === rating ? 'default' : 'ghost'}
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => applyRatingFilter(rating)}
                        >
                          {rating} ★
                        </Button>
                      ))}
                      {filterRating && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-red-500"
                          onClick={() => applyRatingFilter(null)}
                        >
                          Effacer le filtre
                        </Button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Formulaire d'avis */}
      <AnimatePresence>
        {showReviewForm && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6 mb-8 shadow-lg"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-xl text-gray-800 dark:text-gray-200">
                {editMode ? 'Modifier votre avis' : 'Laisser un avis'}
              </h3>
              <motion.button 
                onClick={() => {
                  setShowReviewForm(false);
                  setEditMode(false);
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </motion.button>
            </div>
            
            <form onSubmit={handleSubmitReview}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Votre note
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <motion.button
                      key={star}
                      type="button"
                      onClick={() => handleRatingClick(star)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1"
                    >
                      <Star
                        className={`h-9 w-9 transition-colors ${
                          star <= rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-gray-300 dark:text-gray-600'
                        } hover:text-amber-400`}
                      />
                    </motion.button>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Votre commentaire
                </label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full border rounded-lg p-3 dark:bg-gray-900 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  rows={4}
                  placeholder="Partagez votre expérience..."
                  required
                />
              </div>
              
              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-primary hover:bg-primary-600 transition-colors"
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
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Liste des avis */}
      {filteredFeedbacks.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-50 dark:bg-gray-800 rounded-xl p-12 text-center"
        >
          <MessageCircle className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-6" />
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {filterRating 
              ? `Aucun avis avec ${filterRating} étoile${filterRating > 1 ? 's' : ''}` 
              : 'Aucun avis n\'a encore été laissé pour cet événement'}
          </p>
          {filterRating && (
            <Button
              onClick={() => applyRatingFilter(null)}
              variant="outline"
            >
              Réinitialiser le filtre
            </Button>
          )}
        </motion.div>
      ) : (
        <div className="space-y-8">
          {paginatedFeedbacks.map(feedback => {
            const isUserFeedback = session?.user?.id && feedback.user === session.user.id;
            
            return (
              <motion.div 
                key={feedback.id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border dark:border-gray-700"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                        {feedback.user_name}
                        {isUserFeedback && (
                          <span className="ml-2 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">
                            Vous
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(feedback.created_at).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="flex mr-4">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-5 w-5 ${
                            i < feedback.rating 
                              ? 'text-amber-400 fill-amber-400' 
                              : 'text-gray-300 dark:text-gray-600'
                          }`} 
                        />
                      ))}
                    </div>
                    
                    {isUserFeedback && (
                      <div className="flex">
                        <motion.button
                          onClick={() => handleEditReview(feedback)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-gray-400 hover:text-primary mr-2"
                          title="Modifier"
                        >
                          <Edit className="h-5 w-5" />
                        </motion.button>
                        <motion.button
                          onClick={() => handleDeleteReview(feedback.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-gray-400 hover:text-red-500"
                          title="Supprimer"
                        >
                          <Trash className="h-5 w-5" />
                        </motion.button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-gray-700 dark:text-gray-300 mt-4">
                  {feedback.comment}
                </div>
              </motion.div>
            );
          })}
          
          {/* Boutons de pagination */}
          {filteredFeedbacks.length > visibleReviews && (
            <div className="text-center">
              <Button
                variant="outline"
                onClick={loadMoreReviews}
                className="flex items-center mx-auto"
              >
                Voir plus d'avis
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
          
          {visibleReviews > 3 && filteredFeedbacks.length > 3 && (
            <div className="text-center">
              <Button
                variant="outline"
                onClick={showLessReviews}
                className="flex items-center mx-auto"
              >
                Voir moins d'avis
                <ChevronUp className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

