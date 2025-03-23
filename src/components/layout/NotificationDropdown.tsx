// components/layout/NotificationDropdown.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { notificationsAPI } from '@/lib/api';
import { Notification } from '@/types';
import { Button } from '../ui/Button';
import { FaBell, FaCheck } from 'react-icons/fa';
import { useSession } from 'next-auth/react'; // Ajoutez cette ligne si nécessaire

export default function NotificationDropdown() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      // Ne pas charger les notifications si l'utilisateur n'est pas connecté
    },
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      // Ne charger les notifications que si l'utilisateur est connecté
      if (status !== 'authenticated' || !session) {
        setLoading(false);
        return;
      }
      
      try {
        const response = await notificationsAPI.getNotifications();
        setNotifications(response.data.results || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [session, status]);

  const markAsRead = async (id: string) => {
    try {
      await notificationsAPI.markAsRead(id);
      setNotifications(prevNotifications =>
        prevNotifications.map(notification =>
          notification.id === id
            ? { ...notification, is_read: true, read_at: new Date().toISOString() }
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      setNotifications(prevNotifications =>
        prevNotifications.map(notification => ({
          ...notification,
          is_read: true,
          read_at: new Date().toISOString()
        }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50">
      <div className="py-2 border-b border-gray-200">
        <div className="px-4 flex justify-between items-center">
          <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={markAllAsRead}
            className="text-xs"
          >
            Tout marquer comme lu
          </Button>
        </div>
      </div>
      
      <div className="max-h-96 overflow-y-auto py-2">
        {loading ? (
          <div className="text-center py-4">Chargement...</div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            <FaBell className="mx-auto h-8 w-8 text-gray-300 mb-2" />
            <p className="text-sm">Aucune notification</p>
          </div>
        ) : (
          notifications.map(notification => (
            <div
              key={notification.id}
              className={`px-4 py-3 hover:bg-gray-50 ${
                !notification.is_read ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex justify-between">
                <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                <button
                  onClick={() => markAsRead(notification.id)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <FaCheck className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">{notification.message}</p>
              <p className="text-xs text-gray-400 mt-1">
                {formatDate(notification.created_at)}
              </p>
            </div>
          ))
        )}
      </div>
      
      <div className="py-2 border-t border-gray-200 text-center">
        <Link
          href="/notifications"
          className="text-xs text-blue-500 hover:text-blue-700 font-medium"
        >
          Voir toutes les notifications
        </Link>
      </div>
    </div>
  );
}
