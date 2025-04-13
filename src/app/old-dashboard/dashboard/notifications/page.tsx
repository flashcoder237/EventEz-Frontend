// app/(dashboard)/dashboard/notifications/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { notificationsAPI } from '@/lib/api';
import { Notification } from '@/types';
import { Switch } from '@/components/ui/Switch';
import {
  Bell,
  Mail,
  MessageSquare,
  Calendar,
  Flag,
  Search,
  Check,
  Info,
  AlertTriangle,
  MoreHorizontal,
  Filter,
  Clock,
  RefreshCw,
  Trash2,
  CheckCircle,
  X
} from 'lucide-react';

export default function NotificationsPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
      router.push(`/login?redirect=${returnUrl}`);
    },
  });

  const [currentTab, setCurrentTab] = useState('all');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [scheduledMessages, setScheduledMessages] = useState<any[]>([]);
  
  // État pour la création d'une nouvelle notification
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    notification_type: 'custom_message',
    channel: 'in_app',
    scheduled_for: '',
    scheduled_time: '',
    event_id: '',
    send_to_all: true,
    user_segments: [] as string[]
  });

  // Options des segments d'utilisateurs
  const userSegments = [
    { value: 'all_users', label: 'Tous les utilisateurs' },
    { value: 'recent_registrations', label: 'Inscriptions récentes' },
    { value: 'inactive_users', label: 'Utilisateurs inactifs' },
    { value: 'high_spenders', label: 'Grands dépensiers' }
  ];

  // Charger les notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      if (status !== 'authenticated' || !session) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await notificationsAPI.getNotifications();
        setNotifications(response.data.results || []);
        
        // Simuler le chargement des templates (cette API n'est pas encore implémentée)
        setTemplates([
          { id: '1', name: 'Rappel d\'événement', type: 'event_reminder' },
          { id: '2', name: 'Confirmation d\'inscription', type: 'registration_confirmation' },
          { id: '3', name: 'Confirmation de paiement', type: 'payment_confirmation' },
          { id: '4', name: 'Promotion', type: 'custom_message' },
          { id: '5', name: 'Mise à jour de l\'événement', type: 'event_update' }
        ]);
        
        // Simuler le chargement des messages programmés
        setScheduledMessages([
          { id: '1', title: 'Rappel Concert Live', event: 'Concert Live', scheduled_for: '2025-03-30 18:00', status: 'pending' },
          { id: '2', title: 'Promotion Atelier Cuisine', event: 'Atelier Cuisine', scheduled_for: '2025-04-05 10:00', status: 'pending' },
          { id: '3', title: 'Rappel Conférence Tech', event: 'Conférence Tech', scheduled_for: '2025-03-27 09:00', status: 'pending' }
        ]);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setError('Une erreur est survenue lors du chargement des notifications. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [session, status]);

  // Filtrer les notifications en fonction de l'onglet actif
  const filteredNotifications = notifications.filter(notification => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        notification.title.toLowerCase().includes(query) ||
        notification.message.toLowerCase().includes(query)
      );
    }
    
    if (currentTab === 'all') return true;
    if (currentTab === 'unread') return !notification.is_read;
    if (currentTab === 'read') return notification.is_read;
    
    return notification.notification_type === currentTab;
  });

  // Marquer une notification comme lue
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

  // Marquer toutes les notifications comme lues
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

  // Gestion des notifications sélectionnées
  const toggleSelectNotification = (id: string) => {
    setSelectedNotifications(prev => 
      prev.includes(id) 
        ? prev.filter(notifId => notifId !== id)
        : [...prev, id]
    );
  };

  const selectAllNotifications = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map(n => n.id));
    }
  };

  // Supprimer les notifications sélectionnées
  const deleteSelectedNotifications = async () => {
    try {
      // Cette API n'est pas encore implémentée, à remplacer par l'API réelle
      // await notificationsAPI.deleteMultiple(selectedNotifications);
      
      // Mise à jour côté client (en attendant l'API)
      setNotifications(prev => prev.filter(n => !selectedNotifications.includes(n.id)));
      setSelectedNotifications([]);
    } catch (error) {
      console.error('Error deleting notifications:', error);
    }
  };

  // Gérer le changement dans le formulaire de notification
  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewNotification(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Gérer le changement de l'option "envoyer à tous"
  const handleSendToAllChange = (checked: boolean) => {
    setNewNotification(prev => ({
      ...prev,
      send_to_all: checked,
      user_segments: checked ? [] : prev.user_segments
    }));
  };

  // Gérer le changement des segments d'utilisateurs
  const handleSegmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setNewNotification(prev => ({
      ...prev,
      user_segments: selectedOptions
    }));
  };

  // Envoyer une nouvelle notification
  const sendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Logique d'envoi de la notification (à implémenter avec l'API réelle)
    console.log('Sending notification:', newNotification);
    
    // Réinitialiser le formulaire
    setNewNotification({
      title: '',
      message: '',
      notification_type: 'custom_message',
      channel: 'in_app',
      scheduled_for: '',
      scheduled_time: '',
      event_id: '',
      send_to_all: true,
      user_segments: []
    });
    
    setShowScheduleForm(false);
  };

  // Gérer le chargement
  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Notifications</h1>
          <div className="animate-pulse h-10 w-32 bg-gray-200 rounded mt-4 md:mt-0"></div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b">
            <div className="animate-pulse h-10 bg-gray-200 rounded w-full"></div>
          </div>
          
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Gérer les erreurs
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          <p className="font-medium">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
          >
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  // Organiser les notifications par date
  const groupNotificationsByDate = (notifications: Notification[]) => {
    const groups: { [key: string]: Notification[] } = {};
    
    notifications.forEach(notification => {
      const date = new Date(notification.created_at).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      if (!groups[date]) {
        groups[date] = [];
      }
      
      groups[date].push(notification);
    });
    
    return groups;
  };
  
  const groupedNotifications = groupNotificationsByDate(filteredNotifications);

  // Formater la date et l'heure
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Obtenir l'icône appropriée pour le type de notification
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'event_update':
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case 'registration_confirmation':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'payment_confirmation':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'event_reminder':
        return <Clock className="h-5 w-5 text-orange-500" />;
      case 'system_message':
        return <Info className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  // Obtenir l'étiquette pour le type de notification
  const getNotificationTypeLabel = (type: string) => {
    switch (type) {
      case 'event_update':
        return "Mise à jour d'événement";
      case 'registration_confirmation':
        return "Confirmation d'inscription";
      case 'payment_confirmation':
        return "Confirmation de paiement";
      case 'event_reminder':
        return "Rappel d'événement";
      case 'system_message':
        return "Message système";
      case 'custom_message':
        return "Message personnalisé";
      default:
        return type;
    }
  };

  // Obtenir l'icône pour le canal de notification
  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email':
        return <Mail className="h-4 w-4 text-gray-500" />;
      case 'sms':
        return <MessageSquare className="h-4 w-4 text-gray-500" />;
      case 'push':
        return <Bell className="h-4 w-4 text-gray-500" />;
      case 'in_app':
        return <Bell className="h-4 w-4 text-gray-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-gray-600">
            Gérez et envoyez des notifications à vos utilisateurs
          </p>
        </div>
      </div>
      
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <TabsList className="bg-gray-100 p-1 rounded-lg">
            <TabsTrigger value="all" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Toutes
            </TabsTrigger>
            <TabsTrigger value="unread" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Non lues
            </TabsTrigger>
            <TabsTrigger value="event_reminder" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Rappels
            </TabsTrigger>
            <TabsTrigger value="system_message" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Système
            </TabsTrigger>
          </TabsList>
          
          <div className="flex w-full md:w-auto">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button 
              variant="outline" 
              className="ml-2"
              onClick={() => setShowScheduleForm(!showScheduleForm)}
            >
              Créer
            </Button>
          </div>
        </div>
        
        <TabsContent value={currentTab} className="mt-0">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between p-4">
              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  checked={selectedNotifications.length === filteredNotifications.length && filteredNotifications.length > 0}
                  onChange={selectAllNotifications}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={markAllAsRead}
                  disabled={notifications.every(n => n.is_read)}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Tout marquer comme lu
                </Button>
              </div>
              
              {selectedNotifications.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    {selectedNotifications.length} sélectionnée{selectedNotifications.length > 1 ? 's' : ''}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={deleteSelectedNotifications}
                  >
                    <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                    Supprimer
                  </Button>
                </div>
              )}
            </CardHeader>
            
            <CardContent className="p-0">
              {Object.entries(groupedNotifications).length === 0 ? (
                <div className="p-10 text-center">
                  <Bell className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg font-medium">Aucune notification trouvée</p>
                  <p className="text-gray-400 mt-1">
                    {currentTab === 'all' 
                      ? 'Vous n\'avez pas encore de notifications.' 
                      : 'Aucune notification ne correspond aux critères sélectionnés.'}
                  </p>
                </div>
              ) : (
                <div>
                  {Object.entries(groupedNotifications).map(([date, notifs]) => (
                    <div key={date}>
                      <div className="px-6 py-2 bg-gray-50 sticky top-0 z-10">
                        <h3 className="text-sm font-medium text-gray-500">{date}</h3>
                      </div>
                      <div className="divide-y">
                        {notifs.map((notification) => (
                          <div 
                            key={notification.id} 
                            className={`flex items-start p-4 hover:bg-gray-50 ${!notification.is_read ? 'bg-blue-50 hover:bg-blue-50/80' : ''}`}
                          >
                            <div className="flex items-center h-full pr-4">
                              <input
                                type="checkbox"
                                checked={selectedNotifications.includes(notification.id)}
                                onChange={() => toggleSelectNotification(notification.id)}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                              />
                            </div>
                            <div className="flex-shrink-0 mr-4">
                              <div className="p-2 rounded-full bg-gray-100">
                                {getNotificationIcon(notification.notification_type)}
                              </div>
                            </div>
                            <div className="flex-grow">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium text-gray-900 mb-0.5 flex items-center">
                                  {notification.title}
                                  {!notification.is_read && (
                                    <span className="ml-2 w-2 h-2 rounded-full bg-blue-500"></span>
                                  )}
                                </h4>
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-gray-500">
                                    {new Date(notification.created_at).toLocaleTimeString('fr-FR', {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                  <Badge variant="outline" className="text-xs">
                                    {getChannelIcon(notification.channel)}
                                    <span className="ml-1">{notification.channel}</span>
                                  </Badge>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="p-1 h-auto"
                                    onClick={() => markAsRead(notification.id)}
                                    disabled={notification.is_read}
                                  >
                                    <Check className="h-4 w-4 text-gray-500" />
                                  </Button>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                              <div className="mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {getNotificationTypeLabel(notification.notification_type)}
                                </Badge>
                                {notification.related_object_type && (
                                  <span className="ml-2 text-xs text-gray-500">
                                    {notification.related_object_type}: {notification.related_object_id}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Formulaire de création de notification */}
      <Tabs defaultValue="create" className="space-y-6 mt-8">
        <TabsList className="bg-gray-100 p-1 rounded-lg">
          <TabsTrigger value="create" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Créer une notification
          </TabsTrigger>
          <TabsTrigger value="templates" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Modèles
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Notifications programmées
          </TabsTrigger>
        </TabsList>
        
        {/* Onglet de création de notification */}
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Créer une nouvelle notification</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={sendNotification} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Titre"
                    name="title"
                    value={newNotification.title}
                    onChange={handleNotificationChange}
                    required
                  />
                  
                  <Select
                    label="Type de notification"
                    name="notification_type"
                    value={newNotification.notification_type}
                    onChange={handleNotificationChange}
                    options={[
                      { value: 'custom_message', label: 'Message personnalisé' },
                      { value: 'event_reminder', label: 'Rappel d\'événement' },
                      { value: 'event_update', label: 'Mise à jour d\'événement' },
                      { value: 'system_message', label: 'Message système' }
                    ]}
                  />
                  
                  <div className="md:col-span-2">
                    <Textarea
                      label="Message"
                      name="message"
                      value={newNotification.message}
                      onChange={handleNotificationChange}
                      required
                      className="min-h-32"
                    />
                  </div>
                  
                  <Select
                    label="Canal"
                    name="channel"
                    value={newNotification.channel}
                    onChange={handleNotificationChange}
                    options={[
                      { value: 'in_app', label: 'Notification in-app' },
                      { value: 'email', label: 'Email' },
                      { value: 'sms', label: 'SMS' },
                      { value: 'push', label: 'Notification push' }
                    ]}
                  />
                  
                  <Select
                    label="Événement"
                    name="event_id"
                    value={newNotification.event_id}
                    onChange={handleNotificationChange}
                    options={[
                      { value: '', label: 'Sélectionnez un événement (optionnel)' },
                      { value: '1', label: 'Concert Live' },
                      { value: '2', label: 'Atelier Cuisine' },
                      { value: '3', label: 'Conférence Tech' }
                    ]}
                  />
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Destinataires</h3>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={newNotification.send_to_all} 
                      onCheckedChange={handleSendToAllChange}
                      id="send-to-all"
                    />
                    <label htmlFor="send-to-all" className="text-sm font-medium">
                      Envoyer à tous les utilisateurs
                    </label>
                  </div>
                  
                  {!newNotification.send_to_all && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Segments d'utilisateurs</label>
                      <select
                        multiple
                        name="user_segments"
                        value={newNotification.user_segments}
                        onChange={handleSegmentChange}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md min-h-32"
                      >
                        {userSegments.map(segment => (
                          <option key={segment.value} value={segment.value}>
                            {segment.label}
                          </option>
                        ))}
                      </select>
                      <p className="mt-1 text-sm text-gray-500">
                        Maintenez Ctrl (ou Cmd) pour sélectionner plusieurs segments
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={showScheduleForm} 
                      onCheckedChange={setShowScheduleForm}
                      id="schedule-notification"
                    />
                    <label htmlFor="schedule-notification" className="text-sm font-medium">
                      Programmer l'envoi pour plus tard
                    </label>
                  </div>
                  
                  {showScheduleForm && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        type="date"
                        label="Date d'envoi"
                        name="scheduled_for"
                        value={newNotification.scheduled_for}
                        onChange={handleNotificationChange}
                        min={new Date().toISOString().split('T')[0]}
                        required={showScheduleForm}
                      />
                      
                      <Input
                        type="time"
                        label="Heure d'envoi"
                        name="scheduled_time"
                        value={newNotification.scheduled_time}
                        onChange={handleNotificationChange}
                        required={showScheduleForm}
                      />
                    </div>
                  )}
                </div>
                
                <div className="pt-6 flex justify-end">
                  <Button type="submit">
                    {showScheduleForm ? 'Programmer la notification' : 'Envoyer maintenant'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Onglet Modèles */}
        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Modèles de notification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {templates.map(template => (
                  <div 
                    key={template.id} 
                    className={`border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${
                      selectedTemplate === template.id ? 'border-primary ring-2 ring-primary/20' : ''
                    }`}
                    onClick={() => setSelectedTemplate(template.id === selectedTemplate ? null : template.id)}
                  >
                    <div className="flex items-start">
                      <div className="p-2 bg-purple-100 rounded-full mr-4">
                        {getNotificationIcon(template.type)}
                      </div>
                      <div>
                        <h3 className="font-medium">{template.name}</h3>
                        <p className="text-sm text-gray-500 mb-4">{getNotificationTypeLabel(template.type)}</p>
                        <Button size="sm" variant="outline">Utiliser ce modèle</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Onglet Notifications programmées */}
        <TabsContent value="scheduled">
          <Card>
            <CardHeader>
              <CardTitle>Notifications programmées</CardTitle>
            </CardHeader>
            <CardContent>
              {scheduledMessages.length === 0 ? (
                <div className="text-center py-10">
                  <Clock className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg font-medium">Aucune notification programmée</p>
                  <p className="text-gray-400 mt-1">
                    Les notifications que vous programmez apparaîtront ici
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="border-b">
                      <tr>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Titre</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Événement</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Date prévue</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Statut</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {scheduledMessages.map(message => (
                        <tr key={message.id} className="hover:bg-gray-50">
                          <td className="py-4 px-4 text-sm">{message.title}</td>
                          <td className="py-4 px-4 text-sm">{message.event}</td>
                          <td className="py-4 px-4 text-sm">{message.scheduled_for}</td>
                          <td className="py-4 px-4 text-sm">
                            <Badge variant="outline" className={
                              message.status === 'sent' ? 'bg-green-100 text-green-800 border-green-200' :
                              message.status === 'failed' ? 'bg-red-100 text-red-800 border-red-200' :
                              'bg-blue-100 text-blue-800 border-blue-200'
                            }>
                              {message.status === 'sent' ? 'Envoyée' :
                               message.status === 'failed' ? 'Échec' :
                               'En attente'}
                            </Badge>
                          </td>
                          <td className="py-4 px-4 text-sm">
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <RefreshCw className="h-4 w-4 text-blue-500" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Section des statistiques de notification */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Statistiques d'engagement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm text-gray-500 font-medium">Taux d'ouverture</h3>
                <div className="text-green-600 flex items-center text-xs">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  <span>5.2%</span>
                </div>
              </div>
              <p className="text-2xl font-bold">75.3%</p>
              <div className="mt-2 h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-green-500 rounded-full" style={{ width: '75.3%' }}></div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm text-gray-500 font-medium">Taux de clic</h3>
                <div className="text-red-600 flex items-center text-xs">
                  <ArrowDown className="h-3 w-3 mr-1" />
                  <span>2.3%</span>
                </div>
              </div>
              <p className="text-2xl font-bold">42.8%</p>
              <div className="mt-2 h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-blue-500 rounded-full" style={{ width: '42.8%' }}></div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm text-gray-500 font-medium">Conversions</h3>
                <div className="text-green-600 flex items-center text-xs">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  <span>8.7%</span>
                </div>
              </div>
              <p className="text-2xl font-bold">23.5%</p>
              <div className="mt-2 h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-purple-500 rounded-full" style={{ width: '23.5%' }}></div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm text-gray-500 font-medium">Désabonnements</h3>
                <div className="text-green-600 flex items-center text-xs">
                  <ArrowDown className="h-3 w-3 mr-1" />
                  <span>1.2%</span>
                </div>
              </div>
              <p className="text-2xl font-bold">2.4%</p>
              <div className="mt-2 h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-red-500 rounded-full" style={{ width: '2.4%' }}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}