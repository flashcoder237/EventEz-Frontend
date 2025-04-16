'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
  MessageSquare, 
  Send, 
  Trash2, 
  Search, 
  User, 
  XCircle 
} from 'lucide-react';
import { messagesAPI } from '@/lib/api';
import { toast } from 'react-hot-toast';

export default function MessagesList() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [messagingEnabled, setMessagingEnabled] = useState(true);
  const [blockedUsers, setBlockedUsers] = useState([]);

  useEffect(() => {
    const fetchMessagesAndSettings = async () => {
      if (!session) return;
      setLoading(true);
      try {
        const [messagesResponse, settingsResponse] = await Promise.all([
          messagesAPI.getMessages(),
          messagesAPI.getUserMessagingSettings()
        ]);
        setMessages(messagesResponse.data.result || []);
        if (settingsResponse.data.length > 0) {
          const settings = settingsResponse.data.result[0];
          setMessagingEnabled(settings.messaging_enabled);
          setBlockedUsers(settings.blocked_users);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des messages ou paramètres:', error);
        toast.error('Impossible de charger les messages ou paramètres');
      } finally {
        setLoading(false);
      }
    };

    fetchMessagesAndSettings();
  }, [session]);

  const filteredMessages = messages.filter(msg => 
    msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.sender_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      toast.error('Le message ne peut pas être vide');
      return;
    }
    if (!messagingEnabled) {
      toast.error('La messagerie est désactivée');
      return;
    }
    try {
      await messagesAPI.sendMessage({ content: newMessage });
      toast.success('Message envoyé');
      setNewMessage('');
      // Refresh messages
      const response = await messagesAPI.getMessages();
      setMessages(response.data.result || []);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      toast.error('Échec de l\'envoi du message');
    }
  };

  const handleDeleteMessage = async (id) => {
    try {
      await messagesAPI.deleteMessage(id);
      setMessages(prev => prev.filter(msg => msg.id !== id));
      toast.success('Message supprimé');
    } catch (error) {
      console.error('Erreur lors de la suppression du message:', error);
      toast.error('Échec de la suppression du message');
    }
  };

  const toggleMessagingEnabled = async () => {
    try {
      const newValue = !messagingEnabled;
      await messagesAPI.updateUserMessagingSettings({ messaging_enabled: newValue });
      setMessagingEnabled(newValue);
      toast.success(`Messagerie ${newValue ? 'activée' : 'désactivée'}`);
    } catch (error) {
      console.error('Erreur lors de la mise à jour des paramètres de messagerie:', error);
      toast.error('Impossible de mettre à jour les paramètres');
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
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Search className="h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher des messages"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div className="flex items-center space-x-4">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={messagingEnabled}
            onChange={toggleMessagingEnabled}
            className="form-checkbox h-5 w-5 text-purple-600"
          />
          <span className="ml-2">Activer la messagerie</span>
        </label>
      </div>

      <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {filteredMessages.length === 0 && (
          <li className="p-4 text-center text-gray-500">Aucun message trouvé</li>
        )}
        {filteredMessages.map((msg) => (
          <li key={msg.id} className="p-4 hover:bg-gray-50 flex justify-between items-center">
            <div>
              <p className="font-semibold">{msg.subject}</p>
              <p className="text-sm text-gray-600">De : {msg.sender_name}</p>
              <p className="text-xs text-gray-400">{new Date(msg.created_at).toLocaleString()}</p>
            </div>
            <button
              onClick={() => handleDeleteMessage(msg.id)}
              className="text-red-600 hover:text-red-800"
              aria-label="Supprimer le message"
            >
              <Trash2 />
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-4">
        <textarea
          rows={4}
          placeholder="Écrire un nouveau message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          disabled={!messagingEnabled}
        />
        <button
          onClick={handleSendMessage}
          disabled={!messagingEnabled}
          className="mt-2 inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="mr-2 h-5 w-5" />
          Envoyer
        </button>
      </div>
    </div>
  );
}
