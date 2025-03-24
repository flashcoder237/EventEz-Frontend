// src/lib/api/index.ts
import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Vérification de l'environnement d'exécution
const isClient = typeof window !== 'undefined';

// Créer une instance axios avec la configuration de base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // Timeout de 15 secondes
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(async (config) => {
  // Ne pas essayer d'utiliser getSession côté serveur
  if (!isClient) {
    return config;
  }
  
  try {
    const session = await getSession();
    
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
    
    return config;
  } catch (error) {
    console.error("Erreur lors de l'ajout du token d'authentification:", error);
    return config;
  }
});

// Variable pour éviter les boucles infinies de rafraîchissement
let isRefreshing = false;
let failedQueue = [];

// Fonction pour traiter la file d'attente des requêtes échouées
const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject, config }) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      resolve(api(config));
    } else {
      reject(error);
    }
  });
  
  failedQueue = [];
};

// Intercepteur pour gérer les erreurs et le rafraîchissement du token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Si on n'est pas côté client, on retourne simplement l'erreur
    if (!isClient) {
      return Promise.reject(error);
    }
    
    const originalRequest = error.config;
    
    // Si l'erreur est 401 (non autorisé) et que nous n'avons pas déjà tenté de rafraîchir le token
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Si un rafraîchissement est déjà en cours, ajouter cette requête à la file d'attente
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const session = await getSession();
        
        if (!session?.refreshToken) {
          // Si pas de refresh token, déconnecter l'utilisateur
          if (isClient) {
            await signOut({ redirect: false });
          }
          return Promise.reject(error);
        }
        
        // Tentative de rafraîchissement du token
        const response = await axios.post(`${API_URL}/token/refresh/`, {
          refresh: session.refreshToken
        });
        
        if (response.data.access) {
          // Mettre à jour le header d'autorisation pour la requête originale
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
          
          // Traiter les requêtes en attente avec le nouveau token
          processQueue(null, response.data.access);
          
          isRefreshing = false;
          return api(originalRequest);
        } else {
          processQueue(error, null);
          if (isClient) {
            await signOut({ redirect: false });
          }
          return Promise.reject(error);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        
        if (isClient) {
          await signOut({ redirect: false });
        }
        
        isRefreshing = false;
        return Promise.reject(refreshError);
      }
    }
    
    // Log détaillé des erreurs API pour faciliter le débogage
    if (error.response) {
      console.error(`Erreur API ${error.response.status}:`, error.response.data);
    } else if (error.request) {
      console.error("Erreur de requête (pas de réponse):", error.request);
    } else {
      console.error("Erreur lors de la configuration de la requête:", error.message);
    }

    return Promise.reject(error);
  }
);

// Fonction d'authentification
export const authAPI = {
  login: async (email: string, password: string) => {
    return api.post('/token/', { email, password });
  },
  register: async (userData: any) => {
    return api.post('/register/', userData);
  },
  registerOrganizer: async (organizerData: any) => {
    return api.post('/register/organizer/', organizerData);
  },
};

// Wrapper pour les méthodes de l'API Events qui gère le comportement serveur/client
// API des événements (extension)
export const eventsAPI = {
  getEvents: async (params?: any) => {
    return api.get('/events/', { params });
  },
  getEvent: async (id: string) => {
    return api.get(`/events/${id}/`);
  },
  createEvent: async (eventData: any) => {
    return api.post('/events/', eventData);
  },
  updateEvent: async (id: string, eventData: any) => {
    // Vérifier si les données sont un FormData pour l'upload d'images
    if (eventData instanceof FormData) {
      return api.patch(`/events/${id}/`, eventData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    return api.put(`/events/${id}/`, eventData);
  },
  deleteEvent: async (id: string) => {
    return api.delete(`/events/${id}/`);
  },
  getCategories: async () => {
    return api.get('/categories/');
  },
  getTags: async () => {
    return api.get('/tags/');
  },
  getTicketTypes: async (eventId: string) => {
    try {
      const response = await api.get('/ticket-types/', { 
        params: { event: eventId },
        timeout: 30000
      });
      return response;
    } catch (error) {
      console.error("Erreur lors de la récupération des types de billets:", error);
      return { data: { results: [] } };
    }
  },
  createTicketType: async (ticketData: any) => {
    return api.post('/ticket-types/', ticketData);
  },
  updateTicketType: async (id: number, ticketData: any) => {
    return api.put(`/ticket-types/${id}/`, ticketData);
  },
  deleteTicketType: async (id: number) => {
    return api.delete(`/ticket-types/${id}/`);
  },
  getFormFields: async (eventId: string) => {
    return api.get('/form-fields/', { params: { event: eventId } });
  },
  createFormField: async (fieldData: any) => {
    return api.post('/form-fields/', fieldData);
  },
  updateFormField: async (id: number, fieldData: any) => {
    return api.put(`/form-fields/${id}/`, fieldData);
  },
  deleteFormField: async (id: number) => {
    return api.delete(`/form-fields/${id}/`);
  },
  uploadImages: async (eventId: string, formData: FormData) => {
    return api.post(`/events/${id}/upload_images/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  publishEvent: async (id: string) => {
    return api.post(`/events/${id}/publish/`);
  },
  cancelEvent: async (id: string, reason: string) => {
    return api.post(`/events/${id}/cancel/`, { reason });
  },
  duplicateEvent: async (id: string) => {
    return api.post(`/events/${id}/duplicate/`);
  },
  validateEventDetails: async (eventData: any) => {
    return api.post('/events/validate/', eventData);
  },
  getFeaturedEvents: async (params?: any) => {
    return api.get('/events/featured/', { params });
  },
  requestFeature: async (id: string, message: string) => {
    return api.post(`/events/${id}/request_feature/`, { message });
  },
};

// API d'analytiques avec gestion serveur/client
export const analyticsAPI = {
  getDashboardSummary: async (params?: any) => {
    // if (!isClient) {
    //   // Rechercher le token dans la requête si nécessaire
    //   // Note: Dans une implémentation réelle, vous devriez transmettre un token server-side
    //   // Utiliser cookies ou headers pour cela
    //   const queryParams = new URLSearchParams();
    //   if (params) {
    //     Object.entries(params).forEach(([key, value]) => {
    //       if (value !== undefined && value !== null) {
    //         queryParams.append(key, String(value));
    //       }
    //     });
    //   }
      
    //   // Pour les appels côté serveur, retourner des données par défaut
    //   // Dans une implémentation complète, utilisez un fetch authentifié
    //   return { 
    //     data: {
    //       event_summary: {
    //         total_events: 0,
    //         upcoming_events: 0,
    //         ongoing_events: 0,
    //         completed_events: 0,
    //         avg_fill_rate: 0
    //       },
    //       revenue_summary: {
    //         total_revenue: 0,
    //         avg_transaction: 0
    //       },
    //       registration_summary: {
    //         summary: {
    //           total_registrations: 0,
    //           conversion_rate: 0
    //         }
    //       }
    //     }
    //   };
    // }
    return api.get('/analytics/analytics/dashboard_summary/', { params });
  },
  getEventAnalytics: async (eventId: string) => {
    return api.get('/analytics/analytics/events/', { params: { event_id: eventId } });
  },
  getRevenueAnalytics: async (params?: any) => {
    return api.get('/analytics/analytics/revenue/', { params });
  },
  getUserAnalytics: async (params?: any) => {
    return api.get('/analytics/analytics/users/', { params });
  },
  getRegistrationAnalytics: async (params?: any) => {
    return api.get('/analytics/analytics/registrations/', { params });
  },
  generateReport: async (reportData: any) => {
    return api.post('/analytics/reports/generate/', reportData);
  },
  getReports: async () => {
    return api.get('/analytics/reports/');
  },
  getReport: async (reportId: string) => {
    return api.get(`/analytics/reports/${reportId}/`);
  },
  exportReport: async (reportId: string, format: string) => {
    return api.get(`/analytics/reports/${reportId}/export/`, { params: { format } });
  },
};


// API de feedback avec gestion serveur/client
export const feedbackAPI = {
  getFeedbacks: async (eventId: string) => {
    if (!isClient) {
      const url = `${API_URL}/feedbacks/?event=${eventId}`;
      try {
        const response = await fetch(url);
        if (!response.ok) {
          console.error(`Erreur API: ${response.status}`);
          return { data: { results: [] } };
        }
        return { data: await response.json() };
      } catch (error) {
        console.error('Erreur lors de la récupération des feedbacks:', error);
        return { data: { results: [] } };
      }
    }
    return api.get('/feedbacks/', { params: { event: eventId } });
  },
  createFeedback: async (feedbackData: any) => {
    return api.post('/feedbacks/', feedbackData);
  },
  flagEvent: async (flagData: any) => {
    return api.post('/flags/', flagData);
  },
  validateEvent: async (validationData: any) => {
    return api.post('/validations/', validationData);
  },
  getEventStats: async (eventId: string) => {
    if (!isClient) {
      const url = `${API_URL}/validations/event_stats/?event=${eventId}`;
      try {
        const response = await fetch(url);
        if (!response.ok) {
          return { data: {} };
        }
        return { data: await response.json() };
      } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
        return { data: {} };
      }
    }
    return api.get('/validations/event_stats/', { params: { event: eventId } });
  },
};

// API de notifications (mise à jour)
export const notificationsAPI = {
  getNotifications: async (params?: any) => {
    return api.get('/notifications/', { params });
  },
  markAsRead: async (notificationId: string) => {
    return api.post(`/notifications/${notificationId}/mark_as_read/`);
  },
  markAllAsRead: async () => {
    return api.post('/notifications/mark_all_as_read/');
  },
  deleteNotification: async (notificationId: string) => {
    return api.delete(`/notifications/${notificationId}/`);
  },
  deleteMultiple: async (notificationIds: string[]) => {
    return api.post('/notifications/delete_multiple/', { notification_ids: notificationIds });
  },
  sendNotification: async (notificationData: any) => {
    return api.post('/notifications/send/', notificationData);
  },
  scheduleNotification: async (notificationData: any) => {
    return api.post('/notifications/schedule/', notificationData);
  },
  cancelScheduledNotification: async (notificationId: string) => {
    return api.post(`/notifications/${notificationId}/cancel_scheduled/`);
  },
  getNotificationTemplates: async () => {
    return api.get('/notifications/templates/');
  },
  getScheduledNotifications: async () => {
    return api.get('/notifications/scheduled/');
  },
  getNotificationStatistics: async (params?: any) => {
    return api.get('/notifications/statistics/', { params });
  },
};

// API de gestion des utilisateurs
export const usersAPI = {
  getUserProfile: async () => {
    return api.get('/users/me/');
  },
  updateUserProfile: async (userData: any) => {
    return api.patch('/users/me/', userData);
  },
  updateProfileImage: async (formData: FormData) => {
    return api.patch('/users/me/upload_profile_image/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  changePassword: async (passwordData: { current_password: string; new_password: string }) => {
    return api.post('/users/change_password/', passwordData);
  },
  updateNotificationSettings: async (settingsData: any) => {
    return api.patch('/users/notification_settings/', settingsData);
  },
  getUserAnalytics: async () => {
    return api.get('/users/analytics/');
  },
};

// API d'inscriptions (extension)
export const registrationsAPI = {
  getRegistrations: async (params?: any) => {
    return api.get('/registrations/', { params });
  },
  getRegistration: async (id: string) => {
    return api.get(`/registrations/${id}/`);
  },
  getMyRegistrations: async () => {
    return api.get('/registrations/my_registrations/');
  },
  createRegistration: async (registrationData: any) => {
    return api.post('/registrations/', registrationData);
  },
  updateRegistration: async (id: string, registrationData: any) => {
    return api.patch(`/registrations/${id}/`, registrationData);
  },
  cancelRegistration: async (id: string) => {
    return api.post(`/registrations/${id}/cancel/`);
  },
  validateDiscount: async (discountId: string, code: string) => {
    return api.post(`/discounts/${discountId}/validate/`, { code });
  },
  generateQrCodes: async (registrationId: string) => {
    return api.post(`/registrations/${registrationId}/generate_qr_codes/`);
  },
  checkIn: async (registrationId: string) => {
    return api.post(`/registrations/${registrationId}/check_in/`);
  },
  bulkCheckIn: async (registrationIds: string[]) => {
    return api.post('/registrations/bulk_check_in/', { registration_ids: registrationIds });
  },
  bulkGenerateTickets: async (registrationIds: string[]) => {
    return api.post('/registrations/bulk_generate_tickets/', { registration_ids: registrationIds });
  },
  exportRegistrations: async (params?: any) => {
    return api.get('/registrations/export/', { 
      params,
      responseType: 'blob'
    });
  },
  sendEmailToRegistrants: async (data: {
    registration_ids: string[];
    subject: string;
    message: string;
    include_tickets?: boolean;
  }) => {
    return api.post('/registrations/send_email/', data);
  },
  getRegistrationStats: async (eventId: string) => {
    return api.get('/registrations/stats/', { params: { event_id: eventId } });
  },
  getRegistrationsByUser: async (userId: string) => {
    return api.get('/registrations/by_user/', { params: { user_id: userId } });
  },
  searchRegistrations: async (query: string) => {
    return api.get('/registrations/search/', { params: { query } });
  },
  resendConfirmation: async (registrationId: string) => {
    return api.post(`/registrations/${registrationId}/resend_confirmation/`);
  },
  verifyTicket: async (ticketCode: string) => {
    return api.post('/registrations/verify_ticket/', { code: ticketCode });
  }
};

// Types pour les statistiques d'inscriptions
export interface RegistrationStats {
  total_registrations: number;
  confirmed_registrations: number;
  pending_registrations: number;
  cancelled_registrations: number;
  checked_in_count: number;
  check_in_percentage: number;
  registration_by_day: Array<{
    date: string;
    count: number;
  }>;
  registration_by_ticket_type?: Array<{
    ticket_type: string;
    count: number;
    percentage: number;
  }>;
  revenue: number;
  average_revenue_per_registration: number;
}

export default api;