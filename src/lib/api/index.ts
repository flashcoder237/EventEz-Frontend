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
  refreshToken: async (refreshToken: string) => {
    return api.post('/token/refresh/', { refresh: refreshToken });
  },
};

// API des utilisateurs
export const usersAPI = {
  getOrganizers: async () => {
    try {
      // Endpoint spécifique pour obtenir les organisateurs sans authentification
      return api.get('/users/organizers/');
    } catch (error) {
      console.error("Erreur lors de la récupération des organisateurs:", error);
      throw error;
    }
  },
  getUsers: async (params?: any) => {
    return api.get('/users/', { params });
  },
  getUser: async (id: number) => {
    return api.get(`/users/${id}/`);
  },
  createUser: async (userData: any) => {
    return api.post('/users/', userData);
  },
  updateUser: async (id: number, userData: any) => {
    return api.put(`/users/${id}/`, userData);
  },
  patchUser: async (id: number, userData: any) => {
    return api.patch(`/users/${id}/`, userData);
  },
  deleteUser: async (id: number) => {
    return api.delete(`/users/${id}/`);
  },
  getUserProfile: async () => {
    return api.get('/users/me/');
  },
  updateUserProfile: async (userData: any) => {
    return api.patch('/users/me/', userData);
  },
  updateProfile: async (userData: any) => {
    return api.put('/users/update_profile/', userData);
  },
  becomeOrganizer: async (organizerData?: any) => {
    return api.post('/users/become_organizer/', organizerData || {});
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

// API des catégories d'événements
export const categoriesAPI = {
  getCategories: async (params?: any) => {
    return api.get('/categories/', { params });
  },
  getCategory: async (id: number) => {
    return api.get(`/categories/${id}/`);
  },
  createCategory: async (categoryData: any) => {
    return api.post('/categories/', categoryData);
  },
  updateCategory: async (id: number, categoryData: any) => {
    return api.put(`/categories/${id}/`, categoryData);
  },
  patchCategory: async (id: number, categoryData: any) => {
    return api.patch(`/categories/${id}/`, categoryData);
  },
  deleteCategory: async (id: number) => {
    return api.delete(`/categories/${id}/`);
  },
  getCategoryEvents: async (id: number) => {
    return api.get(`/categories/${id}/events/`);
  },
};

// API des tags d'événements
export const tagsAPI = {
  getTags: async (params?: any) => {
    return api.get('/tags/', { params });
  },
  getTag: async (id: number) => {
    return api.get(`/tags/${id}/`);
  },
  createTag: async (tagData: any) => {
    return api.post('/tags/', tagData);
  },
  updateTag: async (id: number, tagData: any) => {
    return api.put(`/tags/${id}/`, tagData);
  },
  patchTag: async (id: number, tagData: any) => {
    return api.patch(`/tags/${id}/`, tagData);
  },
  deleteTag: async (id: number) => {
    return api.delete(`/tags/${id}/`);
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
      return api.patch(`/events/${id}/`, eventData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    return api.put(`/events/${id}/`, eventData);
  },
  patchEvent: async (id: string, eventData: any) => {
    return api.patch(`/events/${id}/`, eventData);
  },
  deleteEvent: async (id: string) => {
    return api.delete(`/events/${id}/`);
  },
  getFeaturedEvents: async (params?: any) => {
    return api.get('/events/featured/', { params });
  },
  getMyEvents: async () => {
    return api.get('/events/my_events/');
  },
  uploadImages: async (id: string, formData: FormData) => {
    return api.post(`/events/${id}/upload_images/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  // Form Fields
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
  updateFormFields: async (id: string, fieldsData: any) => {
    return api.post(`/events/${id}/update_form_fields/`, fieldsData);
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
  requestFeature: async (id: string, message: string) => {
    return api.post(`/events/${id}/request_feature/`, { message });
  },
};

// API des types de billets
export const ticketTypesAPI = {
  getTicketTypes: async (params?: any) => {
    try {
      const response = await api.get('/ticket-types/', { 
        params,
        timeout: 30000
      });
      return response;
    } catch (error) {
      console.error("Erreur lors de la récupération des types de billets:", error);
      return { data: { results: [] } };
    }
  },
  getTicketType: async (id: number) => {
    return api.get(`/ticket-types/${id}/`);
  },
  createTicketType: async (ticketTypeData: any) => {
    return api.post('/ticket-types/', ticketTypeData);
  },
  updateTicketType: async (id: number, ticketTypeData: any) => {
    return api.put(`/ticket-types/${id}/`, ticketTypeData);
  },
  patchTicketType: async (id: number, ticketTypeData: any) => {
    return api.patch(`/ticket-types/${id}/`, ticketTypeData);
  },
  deleteTicketType: async (id: number) => {
    return api.delete(`/ticket-types/${id}/`);
  },
};

// API des achats de billets
export const ticketPurchasesAPI = {
  getTicketPurchases: async (params?: any) => {
    return api.get('/ticket-purchases/', { params });
  },
  getTicketPurchase: async (id: number) => {
    return api.get(`/ticket-purchases/${id}/`);
  },
  createTicketPurchase: async (purchaseData: any) => {
    return api.post('/ticket-purchases/', purchaseData);
  },
  updateTicketPurchase: async (id: number, purchaseData: any) => {
    return api.put(`/ticket-purchases/${id}/`, purchaseData);
  },
  patchTicketPurchase: async (id: number, purchaseData: any) => {
    return api.patch(`/ticket-purchases/${id}/`, purchaseData);
  },
  deleteTicketPurchase: async (id: number) => {
    return api.delete(`/ticket-purchases/${id}/`);
  },
  checkIn: async (id: number) => {
    return api.post(`/ticket-purchases/${id}/check_in/`);
  },
};

// API des codes de réduction
export const discountsAPI = {
  getDiscounts: async (params?: any) => {
    return api.get('/discounts/', { params });
  },
  getDiscount: async (id: number) => {
    return api.get(`/discounts/${id}/`);
  },
  createDiscount: async (discountData: any) => {
    return api.post('/discounts/', discountData);
  },
  updateDiscount: async (id: number, discountData: any) => {
    return api.put(`/discounts/${id}/`, discountData);
  },
  patchDiscount: async (id: number, discountData: any) => {
    return api.patch(`/discounts/${id}/`, discountData);
  },
  deleteDiscount: async (id: number) => {
    return api.delete(`/discounts/${id}/`);
  },
  validateDiscount: async (id: number, code: string) => {
    return api.post(`/discounts/${id}/validate/`, { code });
  },
};

// API des inscriptions
export const registrationsAPI = {
  getRegistrations: async (params?: any) => {
    return api.get('/registrations/', { params });
  },
  getRegistration: async (id: string) => {
    return api.get(`/registrations/${id}/`);
  },
  createRegistration: async (registrationData: any) => {
    return api.post('/registrations/', registrationData);
  },
  updateRegistration: async (id: string, registrationData: any) => {
    return api.put(`/registrations/${id}/`, registrationData);
  },
  patchRegistration: async (id: string, registrationData: any) => {
    return api.patch(`/registrations/${id}/`, registrationData);
  },
  deleteRegistration: async (id: string) => {
    return api.delete(`/registrations/${id}/`);
  },
  getMyRegistrations: async () => {
    return api.get('/registrations/my_registrations/');
  },
  generateQrCodes: async (id: string) => {
    return api.post(`/registrations/${id}/generate_qr_codes/`);
  },
  cancelRegistration: async (id: string) => {
    return api.post(`/registrations/${id}/cancel/`);
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

// API des commentaires sur les événements
export const feedbacksAPI = {
  getFeedbacks: async (params?: any) => {
    if (!isClient) {
      const url = `${API_URL}/feedbacks/`;
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
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
    return api.get('/feedbacks/', { params });
  },
  getFeedback: async (id: number) => {
    return api.get(`/feedbacks/${id}/`);
  },
  createFeedback: async (feedbackData: any) => {
    return api.post('/feedbacks/', feedbackData);
  },
  updateFeedback: async (id: number, feedbackData: any) => {
    return api.put(`/feedbacks/${id}/`, feedbackData);
  },
  patchFeedback: async (id: number, feedbackData: any) => {
    return api.patch(`/feedbacks/${id}/`, feedbackData);
  },
  deleteFeedback: async (id: number) => {
    return api.delete(`/feedbacks/${id}/`);
  },
  getMyFeedback: async () => {
    return api.get('/feedbacks/my_feedback/');
  },
};

// API des signalements d'événements
export const flagsAPI = {
  getFlags: async (params?: any) => {
    return api.get('/flags/', { params });
  },
  getFlag: async (id: number) => {
    return api.get(`/flags/${id}/`);
  },
  createFlag: async (flagData: any) => {
    return api.post('/flags/', flagData);
  },
  updateFlag: async (id: number, flagData: any) => {
    return api.put(`/flags/${id}/`, flagData);
  },
  patchFlag: async (id: number, flagData: any) => {
    return api.patch(`/flags/${id}/`, flagData);
  },
  deleteFlag: async (id: number) => {
    return api.delete(`/flags/${id}/`);
  },
  resolveFlag: async (id: number, resolutionData: any) => {
    return api.post(`/flags/${id}/resolve/`, resolutionData);
  },
  getUnresolvedFlags: async () => {
    return api.get('/flags/unresolved/');
  },
};

// API des validations d'événements
export const validationsAPI = {
  getValidations: async (params?: any) => {
    return api.get('/validations/', { params });
  },
  getValidation: async (id: number) => {
    return api.get(`/validations/${id}/`);
  },
  createValidation: async (validationData: any) => {
    return api.post('/validations/', validationData);
  },
  updateValidation: async (id: number, validationData: any) => {
    return api.put(`/validations/${id}/`, validationData);
  },
  patchValidation: async (id: number, validationData: any) => {
    return api.patch(`/validations/${id}/`, validationData);
  },
  deleteValidation: async (id: number) => {
    return api.delete(`/validations/${id}/`);
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

// API des notifications
export const notificationsAPI = {
  getNotifications: async (params?: any) => {
    return api.get('/notifications/', { params });
  },
  getNotification: async (id: string) => {
    return api.get(`/notifications/${id}/`);
  },
  createNotification: async (notificationData: any) => {
    return api.post('/notifications/', notificationData);
  },
  updateNotification: async (id: string, notificationData: any) => {
    return api.put(`/notifications/${id}/`, notificationData);
  },
  patchNotification: async (id: string, notificationData: any) => {
    return api.patch(`/notifications/${id}/`, notificationData);
  },
  deleteNotification: async (id: string) => {
    return api.delete(`/notifications/${id}/`);
  },
  markAsRead: async (id: string) => {
    return api.post(`/notifications/${id}/mark_as_read/`);
  },
  markAllAsRead: async () => {
    return api.post('/notifications/mark_all_as_read/');
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
  getScheduledNotifications: async () => {
    return api.get('/notifications/scheduled/');
  },
  getNotificationStatistics: async (params?: any) => {
    return api.get('/notifications/statistics/', { params });
  },
};

// API des modèles de notifications
export const notificationTemplatesAPI = {
  getNotificationTemplates: async (params?: any) => {
    return api.get('/notification-templates/', { params });
  },
  getNotificationTemplate: async (id: number) => {
    return api.get(`/notification-templates/${id}/`);
  },
  createNotificationTemplate: async (templateData: any) => {
    return api.post('/notification-templates/', templateData);
  },
  updateNotificationTemplate: async (id: number, templateData: any) => {
    return api.put(`/notification-templates/${id}/`, templateData);
  },
  patchNotificationTemplate: async (id: number, templateData: any) => {
    return api.patch(`/notification-templates/${id}/`, templateData);
  },
  deleteNotificationTemplate: async (id: number) => {
    return api.delete(`/notification-templates/${id}/`);
  },
};

// API des paiements
export const paymentsAPI = {
  getPayments: async (params?: any) => {
    return api.get('/payments/', { params });
  },
  getPayment: async (id: string) => {
    return api.get(`/payments/${id}/`);
  },
  createPayment: async (paymentData: any) => {
    return api.post('/payments/', paymentData);
  },
  updatePayment: async (id: string, paymentData: any) => {
    return api.put(`/payments/${id}/`, paymentData);
  },
  patchPayment: async (id: string, paymentData: any) => {
    return api.patch(`/payments/${id}/`, paymentData);
  },
  deletePayment: async (id: string) => {
    return api.delete(`/payments/${id}/`);
  },
  calculateUsageFees: async (id: string) => {
    return api.post(`/payments/${id}/calculate_usage_fees/`);
  },
  processMtnMoney: async (id: string, paymentData?: any) => {
    return api.post(`/payments/${id}/process_mtn_money/`, paymentData || {});
  },
  processOrangeMoney: async (id: string, paymentData?: any) => {
    return api.post(`/payments/${id}/process_orange_money/`, paymentData || {});
  },
};

// API des remboursements
export const refundsAPI = {
  getRefunds: async (params?: any) => {
    return api.get('/refunds/', { params });
  },
  getRefund: async (id: number) => {
    return api.get(`/refunds/${id}/`);
  },
  createRefund: async (refundData: any) => {
    return api.post('/refunds/', refundData);
  },
  updateRefund: async (id: number, refundData: any) => {
    return api.put(`/refunds/${id}/`, refundData);
  },
  patchRefund: async (id: number, refundData: any) => {
    return api.patch(`/refunds/${id}/`, refundData);
  },
  deleteRefund: async (id: number) => {
    return api.delete(`/refunds/${id}/`);
  },
  processRefund: async (id: number, refundData?: any) => {
    return api.post(`/refunds/${id}/process_refund/`, refundData || {});
  },
};

// API des factures
export const invoicesAPI = {
  getInvoices: async (params?: any) => {
    return api.get('/invoices/', { params });
  },
  getInvoice: async (id: number) => {
    return api.get(`/invoices/${id}/`);
  },
  downloadPdf: async (id: number) => {
    return api.get(`/invoices/${id}/download_pdf/`);
  },
};

// API des analyses
export const analyticsAPI = {
  // Résumés et analyses
  getDashboardSummary: async (params?: any) => {
    return api.get('/analytics/analytics/dashboard_summary/', { params });
  },
  getEventAnalytics: async (params?: any) => {
    return api.get('/analytics/analytics/events/', { params });
  },
  getEventRegistrationsAnalytics: async (params?: any) => {
    return api.get('/analytics/analytics/event_registrations/', { params });
  },
  predictAttendance: async (params?: any) => {
    return api.get('/analytics/analytics/predict_attendance/', { params });
  },
  getRegistrationAnalytics: async (params?: any) => {
    return api.get('/analytics/analytics/registrations/', { params });
  },
  getRevenueAnalytics: async (params?: any) => {
    return api.get('/analytics/analytics/revenue/', { params });
  },
  getUserAnalytics: async (params?: any) => {
    return api.get('/analytics/analytics/users/', { params });
  },
  
  // Tableaux de bord
  getDashboards: async (params?: any) => {
    return api.get('/analytics/dashboards/', { params });
  },
  getDashboard: async (id: number) => {
    return api.get(`/analytics/dashboards/${id}/`);
  },
  createDashboard: async (dashboardData: any) => {
    return api.post('/analytics/dashboards/', dashboardData);
  },
  updateDashboard: async (id: number, dashboardData: any) => {
    return api.put(`/analytics/dashboards/${id}/`, dashboardData);
  },
  patchDashboard: async (id: number, dashboardData: any) => {
    return api.patch(`/analytics/dashboards/${id}/`, dashboardData);
  },
  deleteDashboard: async (id: number) => {
    return api.delete(`/analytics/dashboards/${id}/`);
  },
  getDashboardWidgets: async (id: number) => {
    return api.get(`/analytics/dashboards/${id}/widgets/`);
  },
  
  // Widgets
  getDashboardWidgetsAll: async (params?: any) => {
    return api.get('/analytics/dashboard-widgets/', { params });
  },
  getDashboardWidget: async (id: number) => {
    return api.get(`/analytics/dashboard-widgets/${id}/`);
  },
  createDashboardWidget: async (widgetData: any) => {
    return api.post('/analytics/dashboard-widgets/', widgetData);
  },
  updateDashboardWidget: async (id: number, widgetData: any) => {
    return api.put(`/analytics/dashboard-widgets/${id}/`, widgetData);
  },
  patchDashboardWidget: async (id: number, widgetData: any) => {
    return api.patch(`/analytics/dashboard-widgets/${id}/`, widgetData);
  },
  deleteDashboardWidget: async (id: number) => {
    return api.delete(`/analytics/dashboard-widgets/${id}/`);
  },
  
  // Rapports
  getReports: async (params?: any) => {
    return api.get('/analytics/reports/', { params });
  },
  getReport: async (id: number) => {
    return api.get(`/analytics/reports/${id}/`);
  },
  createReport: async (reportData: any) => {
    return api.post('/analytics/reports/', reportData);
  },
  updateReport: async (id: number, reportData: any) => {
    return api.put(`/analytics/reports/${id}/`, reportData);
  },
  patchReport: async (id: number, reportData: any) => {
    return api.patch(`/analytics/reports/${id}/`, reportData);
  },
  deleteReport: async (id: number) => {
    return api.delete(`/analytics/reports/${id}/`);
  },
  exportReport: async (id: number, format: string) => {
    return api.get(`/analytics/reports/${id}/export/`, { params: { format } });
  },
  generateReport: async (reportData: any) => {
    return api.post('/analytics/reports/generate/', reportData);
  },
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