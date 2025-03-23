// lib/api/index.ts
import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

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
  try {
    const session = await getSession();
    
    console.log('Session complète:', session);
    console.log('Access Token:', session?.accessToken);
    console.log('User ID:', session?.user?.id);

    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    } else {
      console.warn('Pas de token disponible');
    }
    
    return config;
  } catch (error) {
    console.error("Erreur lors de l'ajout du token d'authentification:", error);
    return config;
  }
});

// Variable pour éviter les boucles infinies de rafraîchissement
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
  config: any;
}> = [];

// Fonction pour traiter la file d'attente des requêtes échouées
const processQueue = (error: any, token: string | null = null) => {
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
    const originalRequest = error.config;
    
    // Si l'erreur est due à une réponse non JSON
    if (error.message && error.message.includes('JSON')) {
      console.error('Erreur de parsing JSON dans la réponse API:', error);
      
      // Pour les routes de ticket-types, retourner un résultat vide mais valide
      if (originalRequest.url.includes('ticket-types')) {
        return Promise.resolve({ data: { results: [] } });
      }
    }
    
    // Si l'erreur est 401 (non autorisé) et que nous n'avons pas déjà tenté de rafraîchir le token
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Code existant pour le refresh token
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

// API des événements
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
      return api.put(`/events/${id}/`, eventData, {
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
// Dans eventsAPI
  getTicketTypes: async (eventId: string) => {
    try {
      const response = await api.get('/ticket-types/', { 
        params: { event: eventId },
        // Ajouter un timeout plus long
        timeout: 30000
      });
      return response;
    } catch (error) {
      console.error("Erreur lors de la récupération des types de billets:", error);
      // Retourner une réponse formatée pour éviter les erreurs de parsing
      return { data: { results: [] } };
    }
  },
  getFormFields: async (eventId: string) => {
    return api.get('/form-fields/', { params: { event: eventId } });
  },
  uploadImages: async (eventId: string, formData: FormData) => {
    return api.post(`/events/${eventId}/upload_images/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// API d'inscriptions
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
  validateDiscount: async (discountId: string, code: string) => {
    return api.post(`/discounts/${discountId}/validate/`, { code });
  },
  generateQrCodes: async (registrationId: string) => {
    return api.post(`/registrations/${registrationId}/generate_qr_codes/`);
  },
};

// API des paiements
export const paymentsAPI = {
  createPayment: async (paymentData: any) => {
    return api.post('/payments/', paymentData);
  },
  processMtnPayment: async (paymentId: string) => {
    return api.post(`/payments/${paymentId}/process_mtn_money/`);
  },
  processOrangePayment: async (paymentId: string) => {
    return api.post(`/payments/${paymentId}/process_orange_money/`);
  },
  calculateUsageFees: async (paymentId: string) => {
    return api.post(`/payments/${paymentId}/calculate_usage_fees/`);
  },
  requestRefund: async (refundData: any) => {
    return api.post('/refunds/', refundData);
  },
  getInvoices: async () => {
    return api.get('/invoices/');
  },
  downloadInvoice: async (invoiceId: string) => {
    return api.get(`/invoices/${invoiceId}/download_pdf/`);
  },
};

// API de feedback
export const feedbackAPI = {
  getFeedbacks: async (eventId: string) => {
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
    return api.get('/validations/event_stats/', { params: { event: eventId } });
  },
};

// API de notifications
export const notificationsAPI = {
  getNotifications: async () => {
    return api.get('/notifications/');
  },
  markAsRead: async (notificationId: string) => {
    return api.post(`/notifications/${notificationId}/mark_as_read/`);
  },
  markAllAsRead: async () => {
    return api.post('/notifications/mark_all_as_read/');
  },
};

// API d'analytics
export const analyticsAPI = {
  getDashboardSummary: async (params?: any) => {
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

export default api;