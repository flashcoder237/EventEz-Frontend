'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { 
  Bell, 
  Calendar, 
  CheckCircle, 
  Trash2, 
  Search,
  Filter,
  AlertTriangle,
  CheckSquare,
  MailOpen,
  MessageSquare,
  CreditCard,
  AlertCircle,
  Info
} from 'lucide-react';
import { notificationsAPI } from '@/lib/api';
import { Notification } from '@/types';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function NotificationsList() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const formatNotificationDate = (date: string) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr });
  };
  const toggleSelectNotification = (id: string) => {
    setSelectedNotifications((prev) =>
      prev.includes(id) ? prev.filter((nid) => nid !== id) : [...prev, id]
    );
  };
  
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const response = await notificationsAPI.getNotifications();
        const notificationsData = response.data.results || [];
        setNotifications(notificationsData);
        setFilteredNotifications(notificationsData);
      } catch (error) {
        console.error('Erreur lors de la récupération des notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchNotifications();
    }
  }, [session]);

  useEffect(() => {
    // Appliquer les filtres et la recherche
    let result = [...notifications];
    
    // Filtrer par type
    if (filter !== 'all') {
      if (filter === 'unread') {
        result = result.filter(notification => !notification.is_read);
      } else if (filter === 'read') {
        result = result.filter(notification => notification.is_read);
      } else {
        result = result.filter(notification => notification.notification_type === filter);
      }
    }
    
    // Filtrer par terme de recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        notification => 
          notification.title.toLowerCase().includes(term) || 
          notification.message.toLowerCase().includes(term)
      );
    }
    
    setFilteredNotifications(result);
  }, [notifications, filter, searchTerm]);
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'event_update':
        return <Calendar className="h-5 w-5 text-indigo-500" />;
      case 'registration_confirmation':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'payment_confirmation':
        return <CreditCard className="h-5 w-5 text-purple-500" />;
      case 'event_reminder':
        return <Bell className="h-5 w-5 text-yellow-500" />;
      case 'system_message':
        return <Info className="h-5 w-5 text-gray-500" />;
      case 'custom_message':
        return <MessageSquare className="h-5 w-5 text-indigo-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getNotificationTypeLabel = (type: string) => {
    switch (type) {
      case 'event_update':
        return 'Mise à jour d\'événement';
      case 'registration_confirmation':
        return 'Confirmation d\'inscription';
      case 'payment_confirmation':
        return 'Confirmation de paiement';
      case 'event_reminder':
        return 'Rappel d\'événement';
      case 'system_message':
        return 'Message système';
      case 'custom_message':
        return 'Message personnalisé';
      default:
        return type;
    }
  };
  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationsAPI.markAsRead(id);
      setNotifications(notifications.map(notification => 
        notification.id === id 
          ? { ...notification, is_read: true, read_at: new Date().toISOString() } 
          : notification
      ));
    } catch (error) {
      console.error('Erreur lors du marquage de la notification comme lue:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      setNotifications(notifications.map(notification => 
        !notification.is_read 
          ? { ...notification, is_read: true, read_at: new Date().toISOString() } 
          : notification
      ));
    } catch (error) {
      console.error('Erreur lors du marquage de toutes les notifications comme lues:', error);
    }
  };
  const handleDeleteNotification = async (id: string) => {
    try {
      await notificationsAPI.deleteNotification(id);
      setNotifications(notifications.filter(notification => notification.id !== id));
      setSelectedNotifications(selectedNotifications.filter(notifId => notifId !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression de la notification:', error);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedNotifications.length === 0) return;
    
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${selectedNotifications.length} notification(s) ?`)) {
      return;
    }
    
    try {
      await notificationsAPI.deleteMultiple(selectedNotifications);
      setNotifications(notifications.filter(notification => !selectedNotifications.includes(notification.id)));
      setSelectedNotifications([]);
    } catch (error) {
      console.error('Erreur lors de la suppression des notifications sélectionnées:', error);
    }
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Actions et filtres */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Toutes les notifications</option>
            <option value="unread">Non lues</option>
            <option value="read">Lues</option>
            <option value="event_update">Mises à jour d'événements</option>
            <option value="registration_confirmation">Confirmations d'inscription</option>
            <option value="payment_confirmation">Confirmations de paiement</option>
            <option value="event_reminder">Rappels d'événements</option>
            <option value="system_message">Messages système</option>
            <option value="custom_message">Messages personnalisés</option>
          </select>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleMarkAllAsRead}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            title="Marquer toutes comme lues"
          >
            <MailOpen className="h-4 w-4 mr-1" />
            Tout marquer comme lu
          </button>
          {selectedNotifications.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              title="Supprimer la sélection"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Supprimer la sélection
            </button>
          )}
        </div>
      </div>

      {/* Liste des notifications */}
      {filteredNotifications.length > 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredNotifications.map((notification) => (
              <li key={notification.id} className={`hover:bg-gray-50 ${!notification.is_read ? 'bg-purple-50' : ''}`}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        checked={selectedNotifications.includes(notification.id)}
                        onChange={() => toggleSelectNotification(notification.id)}
                      />
                    </div>
                    <div className="flex-shrink-0 pt-0.5">
                      {getNotificationIcon(notification.notification_type)}
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </p>
                        <div className="flex space-x-2">
                          <p className="text-xs text-gray-500">
                            {formatNotificationDate(notification.created_at)}
                          </p>
                          <span className="text-xs px-2 inline-flex items-center rounded-full bg-gray-100 text-gray-800">
                            {getNotificationTypeLabel(notification.notification_type)}
                          </span>
                        </div>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        {notification.message}
                      </p>
                      <div className="mt-2 flex justify-between">
                        <div className="flex space-x-2">
                          {notification.related_object_id && notification.related_object_type === 'event' && (
                            <Link
                              href={`/events/${notification.related_object_id}`}
                              className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                            >
                              Voir l'événement
                            </Link>
                          )}
                          {notification.related_object_id && notification.related_object_type === 'registration' && (
                            <Link
                              href={`/dashboard/registrations/${notification.related_object_id}`}
                              className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                            >
                              Voir l'inscription
                            </Link>
                          )}
                          {notification.related_object_id && notification.related_object_type === 'payment' && (
                            <Link
                              href={`/dashboard/payments`}
                              className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                            >
                              Voir le paiement
                            </Link>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          {!notification.is_read && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="inline-flex items-center p-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                              title="Marquer comme lu"
                            >
                              <CheckSquare className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteNotification(notification.id)}
                            className="inline-flex items-center p-1 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md p-6 text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-yellow-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune notification trouvée</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filter !== 'all'
              ? 'Aucune notification ne correspond à vos critères de recherche.'
              : 'Vous n\'avez pas encore reçu de notifications.'}
          </p>
        </div>
      )}
    </div>
  );
}
