"use client"
import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { 
  MessageSquare, 
  Send, 
  Trash2, 
  Search, 
  User, 
  XCircle,
  Phone,
  Video,
  MoreVertical,
  ChevronLeft,
  Paperclip,
  Image as ImageIcon,
  Smile,
  Check,
  CheckCheck,
  Clock,
  Archive,
  Star,
  Flag,
  Menu,
  Settings,
  Filter,
  Plus
} from 'lucide-react';
import { messagesAPI } from '@/lib/api';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

const MessagingSystem = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [messagingEnabled, setMessagingEnabled] = useState(true);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'unread', 'archived', 'starred'
  const [showSettings, setShowSettings] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef(null);
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileConversation, setShowMobileConversation] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [unreadTotal, setUnreadTotal] = useState(0);
  const [replyingTo, setReplyingTo] = useState(null);
  const messageInputRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!session) return;
      setLoading(true);
      try {
        const [conversationsResponse, settingsResponse, usersResponse] = await Promise.all([
          messagesAPI.getConversations(),
          messagesAPI.getUserMessagingSettings(),
          messagesAPI.getUsers()
        ]);
        
        const conversationsData = conversationsResponse.data?.results || [];
        setAvailableUsers(usersResponse.data?.results || []);
        
        const enrichedConversations = conversationsData.map(conv => {
          const otherParticipants = conv.participants
            .filter(p => p !== session.user.id)
            .map(p => {
              const user = usersResponse.data?.results.find(u => u.id === p);
              return user || { id: p };
            });
          
          const unreadCount = conv.user_messages?.filter(msg => 
            !msg.read_by.includes(session.user.id) && 
            msg.sender !== session.user.id
          ).length || 0;
          
          return {
            ...conv,
            otherParticipants,
            lastMessage: conv.user_messages?.length ? conv.user_messages[conv.user_messages.length - 1] : null,
            unreadCount
          };
        });
        
        setConversations(enrichedConversations);
        
        // Calculate total unread
        const totalUnread = enrichedConversations.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);
        setUnreadTotal(totalUnread);
        
        if (settingsResponse.data) {
          setMessagingEnabled(settingsResponse.data.messaging_enabled);
          setBlockedUsers(settingsResponse.data.blocked_users || []);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des conversations:', error);
        toast.error('Impossible de charger les conversations');
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
    
    // Set up polling for new messages
    const interval = setInterval(fetchConversations, 30000); // every 30 seconds
    
    return () => clearInterval(interval);
  }, [session]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessagesForConversation(selectedConversation.id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    if (replyingTo && messageInputRef.current) {
      messageInputRef.current.focus();
    }
  }, [replyingTo]);

  const fetchMessagesForConversation = async (conversationId) => {
    setLoading(true);
    try {
      const response = await messagesAPI.getMessages({ conversation: conversationId });
      setMessages(response.data?.results || []);
      
      // Mark messages as read
      const unreadMessages = response.data?.results.filter(msg => 
        !msg.read_by.includes(session.user.id) && 
        msg.sender !== session.user.id
      ) || [];
      
      if (unreadMessages.length > 0) {
        await Promise.all(unreadMessages.map(msg => 
          messagesAPI.markMessageAsRead(msg.id)
        ));
        
        // Update the unread count in conversations list
        setConversations(prev => {
          const updated = prev.map(conv => 
            conv.id === conversationId 
            ? { ...conv, unreadCount: 0 }
            : conv
          );
          
          // Recalculate total unread
          const totalUnread = updated.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);
          setUnreadTotal(totalUnread);
          
          return updated;
        });
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des messages:', error);
      toast.error('Impossible de charger les messages');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableUsers = async () => {
    try {
      const response = await messagesAPI.getUsers();
      setAvailableUsers(response.data?.results || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      toast.error('Impossible de charger les utilisateurs');
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      toast.error('Le message ne peut pas être vide');
      return;
    }
    
    if (!messagingEnabled) {
      toast.error('La messagerie est désactivée');
      return;
    }
    
    if (!selectedConversation && !selectedUser) {
      toast.error('Aucun destinataire sélectionné');
      return;
    }
    
    setSendingMessage(true);
    
    try {
      let conversationId = selectedConversation?.id;
      
      // If creating a new conversation
      if (!conversationId && selectedUser) {
        const newConversation = await messagesAPI.createConversation({
          participants: [session.user.id, selectedUser.id]
        });
        conversationId = newConversation.data.id;
      }
      
      const messageData = {
        content: newMessage,
        conversation: conversationId,
        sender: session.user.id
      };
      
      // Add reply_to if replying to a message
      if (replyingTo) {
        messageData.reply_to = replyingTo.id;
      }
      
      await messagesAPI.sendMessage(messageData);
      
      setNewMessage('');
      setReplyingTo(null);
      
      // Refresh messages and conversations
      fetchMessagesForConversation(conversationId);
      const conversationsResponse = await messagesAPI.getConversations();
      
      const conversationsData = conversationsResponse.data?.results || [];
      const enrichedConversations = conversationsData.map(conv => {
        const otherParticipants = conv.participants
          .filter(p => p !== session.user.id)
          .map(p => {
            const user = availableUsers.find(u => u.id === p);
            return user || { id: p };
          });
        
        return {
          ...conv,
          otherParticipants,
          lastMessage: conv.user_messages?.length ? conv.user_messages[conv.user_messages.length - 1] : null,
          unreadCount: conv.user_messages?.filter(msg => 
            !msg.read_by.includes(session.user.id) && 
            msg.sender !== session.user.id
          ).length || 0
        };
      });
      
      setConversations(enrichedConversations);
      
      // Recalculate total unread
      const totalUnread = enrichedConversations.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);
      setUnreadTotal(totalUnread);
      
      // If this was a new conversation, select it
      if (!selectedConversation) {
        const newConv = conversationsData.find(c => c.id === conversationId);
        if (newConv) {
          const enrichedNewConv = {
            ...newConv,
            otherParticipants: newConv.participants
              .filter(p => p !== session.user.id)
              .map(p => {
                const user = availableUsers.find(u => u.id === p);
                return user || { id: p };
              }),
            lastMessage: newConv.user_messages?.length ? newConv.user_messages[newConv.user_messages.length - 1] : null,
            unreadCount: 0
          };
          
          setSelectedConversation(enrichedNewConv);
          setShowNewConversation(false);
          setSelectedUser(null);
        }
      }
      
      setShowMobileConversation(true);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      toast.error('Échec de l\'envoi du message');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleTyping = () => {
    // This would typically send a "user is typing" notification to the other participants
    // For now, we'll just simulate the behavior
    
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    
    // In a real app, you would emit a "typing" event here
    // socket.emit('typing', { conversationId: selectedConversation.id, userId: session.user.id });
    
    // Clear the typing indicator after a few seconds of inactivity
    const timeout = setTimeout(() => {
      // In a real app, you would emit a "stopped typing" event here
      // socket.emit('stoppedTyping', { conversationId: selectedConversation.id, userId: session.user.id });
    }, 2000);
    
    setTypingTimeout(timeout);
  };

  const handleDeleteConversation = async (id) => {
    try {
      await messagesAPI.deleteConversation(id);
      setConversations(prev => prev.filter(conv => conv.id !== id));
      
      if (selectedConversation?.id === id) {
        setSelectedConversation(null);
        setMessages([]);
      }
      
      toast.success('Conversation supprimée');
    } catch (error) {
      console.error('Erreur lors de la suppression de la conversation:', error);
      toast.error('Échec de la suppression de la conversation');
    }
  };

  const toggleMessageStar = async (message) => {
    try {
      const updated = { ...message, is_starred: !message.is_starred };
      await messagesAPI.updateMessage(message.id, { is_starred: !message.is_starred });
      
      setMessages(prev => prev.map(m => m.id === message.id ? updated : m));
      toast.success(updated.is_starred ? 'Message marqué comme important' : 'Marquage supprimé');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du message:', error);
      toast.error('Impossible de mettre à jour le message');
    }
  };

  const toggleConversationArchive = async (conversation) => {
    try {
      const updated = { ...conversation, is_archived: !conversation.is_archived };
      await messagesAPI.updateConversation(conversation.id, { is_archived: !conversation.is_archived });
      
      setConversations(prev => prev.map(c => c.id === conversation.id ? updated : c));
      toast.success(updated.is_archived ? 'Conversation archivée' : 'Conversation désarchivée');
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la conversation:', error);
      toast.error('Impossible de mettre à jour la conversation');
    }
  };

  const toggleConversationStar = async (conversation) => {
    try {
      const updated = { ...conversation, is_starred: !conversation.is_starred };
      await messagesAPI.updateConversation(conversation.id, { is_starred: !conversation.is_starred });
      
      setConversations(prev => prev.map(c => c.id === conversation.id ? updated : c));
      toast.success(updated.is_starred ? 'Conversation ajoutée aux favoris' : 'Conversation retirée des favoris');
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la conversation:', error);
      toast.error('Impossible de mettre à jour la conversation');
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

  const toggleBlockUser = async (userId) => {
    try {
      const isBlocked = blockedUsers.includes(userId);
      const newBlockedUsers = isBlocked
        ? blockedUsers.filter(id => id !== userId)
        : [...blockedUsers, userId];
      
      await messagesAPI.updateUserMessagingSettings({ blocked_users: newBlockedUsers });
      setBlockedUsers(newBlockedUsers);
      toast.success(`Utilisateur ${isBlocked ? 'débloqué' : 'bloqué'}`);
    } catch (error) {
      console.error('Erreur lors de la mise à jour des utilisateurs bloqués:', error);
      toast.error('Impossible de mettre à jour les utilisateurs bloqués');
    }
  };

  const startNewConversation = () => {
    setShowNewConversation(true);
    setSelectedConversation(null);
    setMessages([]);
    setReplyingTo(null);
    fetchAvailableUsers();
    setShowMobileConversation(true);
  };

  const selectUser = (user) => {
    setSelectedUser(user);
    setShowNewConversation(false);
  };

  const setReplyToMessage = (message) => {
    setReplyingTo(message);
    if (messageInputRef.current) {
      messageInputRef.current.focus();
    }
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  const getOtherParticipantNames = (conversation) => {
    if (!conversation || !conversation.otherParticipants) return 'Conversation';
    
    return conversation.otherParticipants
      .map(participant => 
        participant.first_name && participant.last_name 
          ? `${participant.first_name} ${participant.last_name}`
          : participant.email || participant.username || 'Utilisateur'
      )
      .join(', ');
  };

  const getMessageTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    const isToday = date.toDateString() === now.toDateString();
    const isYesterday = new Date(now.setDate(now.getDate() - 1)).toDateString() === date.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (isYesterday) {
      return 'Hier';
    } else if (diff < 7 * 24 * 60 * 60 * 1000) {
      return date.toLocaleDateString([], { weekday: 'long' });
    } else {
      return date.toLocaleDateString();
    }
  };

  const filteredConversations = conversations.filter(conv => {
    // Filter by tab
    switch (activeTab) {
      case 'unread':
        if (!conv.unreadCount) return false;
        break;
      case 'archived':
        if (!conv.is_archived) return false;
        break;
      case 'starred':
        if (!conv.is_starred) return false;
        break;
    }
    
    // Filter by search term
    if (searchTerm) {
      const participantNames = getOtherParticipantNames(conv).toLowerCase();
      const lastMessageContent = conv.lastMessage?.content?.toLowerCase() || '';
      
      return participantNames.includes(searchTerm.toLowerCase()) ||
             lastMessageContent.includes(searchTerm.toLowerCase());
    }
    
    return true;
  });

  const filteredUsers = availableUsers.filter(user => 
    user.id !== session?.user?.id &&
    !blockedUsers.includes(user.id) &&
    (user.email?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
     user.username?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
     `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase().includes(userSearchTerm.toLowerCase()))
  );

  if (loading && !conversations.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const renderConversationsList = () => (
    <div className={`bg-white rounded-lg shadow-lg ${isMobile && showMobileConversation ? 'hidden' : 'block'} ${isMobile ? 'w-full' : 'w-1/3'} border-r border-gray-200`}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Messages</h2>
          <div className="flex space-x-2">
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
            >
              <Settings size={20} />
            </button>
            <button 
              onClick={startNewConversation}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher des conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        
        <div className="flex space-x-1 mt-3 border-b border-gray-200 pb-3">
          <button 
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1 text-sm rounded-md ${activeTab === 'all' ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100'}`}
          >
            Tous
          </button>
          <button 
            onClick={() => setActiveTab('unread')}
            className={`px-3 py-1 text-sm rounded-md ${activeTab === 'unread' ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100'} flex items-center`}
          >
            Non lus 
            {unreadTotal > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-purple-600 text-white text-xs rounded-full">
                {unreadTotal}
              </span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('starred')}
            className={`px-3 py-1 text-sm rounded-md ${activeTab === 'starred' ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100'}`}
          >
            Favoris
          </button>
          <button 
            onClick={() => setActiveTab('archived')}
            className={`px-3 py-1 text-sm rounded-md ${activeTab === 'archived' ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100'}`}
          >
            Archives
          </button>
        </div>
      </div>
      
      {showSettings && (
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <h3 className="font-medium text-gray-700 mb-3">Paramètres de messagerie</h3>
          <div className="flex items-center mb-3">
            <input
              type="checkbox"
              id="messaging-toggle"
              checked={messagingEnabled}
              onChange={toggleMessagingEnabled}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="messaging-toggle" className="ml-2 block text-sm text-gray-700">
              Activer la messagerie
            </label>
          </div>
          
          {blockedUsers.length > 0 && (
            <div className="mt-3">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Utilisateurs bloqués</h4>
              <ul className="text-sm text-gray-600">
                {blockedUsers.map(userId => {
                  const user = availableUsers.find(u => u.id === userId);
                  return (
                    <li key={userId} className="flex justify-between items-center py-1">
                      <span>{user ? `${user.first_name || ''} ${user.last_name || ''}` : `Utilisateur #${userId}`}</span>
                      <button 
                        onClick={() => toggleBlockUser(userId)}
                        className="text-xs text-red-600 hover:text-red-800"
                      >
                        Débloquer
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}
      
      <div className="overflow-y-auto max-h-[calc(100vh-16rem)]">
        {filteredConversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            Aucune conversation trouvée
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredConversations.map((conversation) => (
              <li 
                key={conversation.id} 
                onClick={() => {
                  setSelectedConversation(conversation);
                  setShowNewConversation(false);
                  setSelectedUser(null);
                  setReplyingTo(null);
                  setShowMobileConversation(true);
                }}
                className={`
                  p-4 cursor-pointer hover:bg-gray-50 relative
                  ${selectedConversation?.id === conversation.id ? 'bg-purple-50' : ''}
                  ${conversation.is_archived ? 'bg-gray-50' : ''}
                `}
              >
                <div className="flex justify-between">
                  <div className="flex-grow pr-3">
                    <div className="flex justify-between items-start">
                      <h3 className={`font-semibold ${conversation.unreadCount ? 'text-gray-900' : 'text-gray-700'}`}>
                        {getOtherParticipantNames(conversation)}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {conversation.lastMessage ? getMessageTime(conversation.lastMessage.created_at) : ''}
                      </span>
                    </div>
                    
                    <p className={`text-sm truncate mt-1 ${conversation.unreadCount ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                      {conversation.lastMessage
                        ? (conversation.lastMessage.sender === session?.user?.id 
                          ? `Vous: ${conversation.lastMessage.content}` 
                          : conversation.lastMessage.content)
                        : 'Nouvelle conversation'}
                    </p>
                  </div>
                </div>
                
                {conversation.unreadCount > 0 && (
                  <span className="absolute top-4 right-4 px-2 py-0.5 bg-purple-600 text-white text-xs rounded-full">
                    {conversation.unreadCount}
                  </span>
                )}
                
                {conversation.is_starred && (
                  <Star className="absolute bottom-2 right-2 h-4 w-4 text-yellow-500 fill-yellow-500" />
                )}
                
                {conversation.is_archived && (
                  <Archive className="absolute bottom-2 right-2 h-4 w-4 text-gray-400" />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );

  const renderConversationContent = () => (
    <div className={`flex-1 flex flex-col ${isMobile && !showMobileConversation ? 'hidden' : 'block'}`}>
      {(selectedConversation || selectedUser || showNewConversation) ? (
        <>
          {/* Conversation Header */}
          <div className="p-4 border-b border-gray-200 bg-white flex items-center">
            {isMobile && (
              <button 
                onClick={() => setShowMobileConversation(false)}
                className="p-1 mr-2 rounded-full text-gray-500 hover:bg-gray-100"
              >
                <ChevronLeft size={24} />
              </button>
            )}
            
            {selectedConversation && (
              <>
                <div className="flex-grow">
                  <h2 className="text-lg font-bold">{getOtherParticipantNames(selectedConversation)}</h2>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => toggleConversationStar(selectedConversation)}
                    className={`p-2 rounded-full ${selectedConversation.is_starred ? 'text-yellow-500' : 'text-gray-500 hover:bg-gray-100'}`}
                  >
                    <Star size={20} className={selectedConversation.is_starred ? 'fill-yellow-500' : ''} />
                  </button>
                  <button 
                    onClick={() => toggleConversationArchive(selectedConversation)}
                    className={`p-2 rounded-full ${selectedConversation.is_archived ? 'text-indigo-500' : 'text-gray-500 hover:bg-gray-100'}`}
                  >
                    <Archive size={20} />
                  </button>
                  <button 
                    onClick={() => handleDeleteConversation(selectedConversation.id)}
                    className="p-2 rounded-full text-red-500 hover:bg-red-50"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </>
            )}
            
            {selectedUser && (
              <div className="flex-grow">
                <h2 className="text-lg font-bold">
                  {selectedUser.first_name && selectedUser.last_name 
                    ? `${selectedUser.first_name} ${selectedUser.last_name}`
                    : selectedUser.email || selectedUser.username || 'Nouvel utilisateur'}
                </h2>
              </div>
            )}
            
            {showNewConversation && !selectedUser && (
              <div className="flex-grow">
                <h2 className="text-lg font-bold">Nouvelle conversation</h2>
              </div>
            )}
          </div>
          
          {/* New Conversation UI */}
          {showNewConversation && !selectedUser && (
            <div className="flex-1 bg-gray-50 p-4">
              <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium mb-4">Sélectionner un destinataire</h3>
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Rechercher un utilisateur..."
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                
                <ul className="max-h-80 overflow-y-auto divide-y divide-gray-200">
                  {filteredUsers.length === 0 ? (
                    <li className="py-3 text-center text-gray-500">Aucun utilisateur trouvé</li>
                  ) : (
                    filteredUsers.map(user => (
                      <li 
                        key={user.id} 
                        onClick={() => selectUser(user)}
                        className="py-3 px-2 hover:bg-gray-50 cursor-pointer rounded-md"
                      >
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-800 font-medium mr-3">
                            {user.first_name?.[0]}
                            {user.last_name?.[0]}
                            {!user.first_name && !user.last_name && user.username?.[0]}
                            {!user.first_name && !user.last_name && !user.username && user.email?.[0]}
                          </div>
                          <div>
                            <p className="font-medium">
                              {user.first_name && user.last_name 
                                ? `${user.first_name} ${user.last_name}`
                                : user.username || user.email}
                            </p>
                            {user.email && user.username && (
                              <p className="text-sm text-gray-500">{user.email}</p>
                            )}
                          </div>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          )}
          
          {/* Message List */}
          {!showNewConversation && (selectedConversation || selectedUser) && (
            <div 
              className="flex-1 p-4 overflow-y-auto bg-gray-50"
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              <div className="flex-1">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-10">
                    <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                    <p>Aucun message. Commencez la conversation !</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.map((message, index) => {
                      const isCurrentUser = message.sender === session?.user?.id;
                      const showDateHeader = index === 0 || 
                        new Date(message.created_at).toDateString() !== 
                        new Date(messages[index - 1].created_at).toDateString();
                      
                      // Find the message this one is replying to
                      const repliedToMessage = message.reply_to 
                        ? messages.find(m => m.id === message.reply_to) 
                        : null;
                      
                      return (
                        <React.Fragment key={message.id}>
                          {showDateHeader && (
                            <div className="text-center my-4">
                              <span className="inline-block px-4 py-1 bg-gray-200 text-gray-700 rounded-full text-xs">
                                {new Date(message.created_at).toLocaleDateString([], {
                                  weekday: 'long', 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                          )}
                          
                          <div 
                            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                          >
                            <div 
                              className={`relative max-w-3/4 ${
                                isCurrentUser 
                                  ? 'bg-purple-600 text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg' 
                                  : 'bg-white text-gray-800 rounded-tr-lg rounded-tl-lg rounded-br-lg shadow-sm'
                              } ${message.is_starred ? 'border-2 border-yellow-400' : ''} px-4 py-2 rounded-lg`}
                            >
                              {/* Reply preview */}
                              {repliedToMessage && (
                                <div 
                                  className={`text-xs p-2 mb-2 rounded border-l-2 ${
                                    isCurrentUser
                                      ? 'bg-purple-700 border-purple-300'
                                      : 'bg-gray-100 border-gray-300'
                                  }`}
                                >
                                  <div className="font-medium mb-1">
                                    {repliedToMessage.sender === session?.user?.id 
                                      ? 'Vous' 
                                      : (availableUsers.find(u => u.id === repliedToMessage.sender)?.first_name || 'Utilisateur')}
                                  </div>
                                  <div className="truncate">{repliedToMessage.content}</div>
                                </div>
                              )}

                              <p className="whitespace-pre-wrap break-words">{message.content}</p>
                              <div className={`text-xs mt-1 flex items-center justify-end ${
                                isCurrentUser ? 'text-purple-200' : 'text-gray-500'
                              }`}>
                                <span className="mr-1">
                                  {new Date(message.created_at).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                                {isCurrentUser && (
                                  <div className="flex items-center">
                                    {message.read_by?.length > 0 
                                      ? <CheckCheck size={12} className="text-indigo-300" /> 
                                      : <Check size={12} />}
                                  </div>
                                )}
                              </div>

                              {/* Message actions - only show on hover */}
                              <div className={`absolute ${isCurrentUser ? 'left-0' : 'right-0'} top-0 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1 bg-white shadow-md rounded-full p-1`}>
                                <button 
                                  onClick={() => setReplyToMessage(message)} 
                                  className="p-1 rounded-full hover:bg-gray-100"
                                  title="Répondre"
                                >
                                  <Send size={12} className="text-gray-600" />
                                </button>
                                <button 
                                  onClick={() => toggleMessageStar(message)} 
                                  className="p-1 rounded-full hover:bg-gray-100"
                                  title={message.is_starred ? "Retirer l'importance" : "Marquer comme important"}
                                >
                                  <Star size={12} className={message.is_starred ? "text-yellow-500 fill-yellow-500" : "text-gray-600"} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </React.Fragment>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Message Composer */}
          <div className="p-4 border-t border-gray-200 bg-white">
            {/* Reply indicator */}
            {replyingTo && (
              <div className="mb-2 p-2 bg-gray-100 rounded-lg flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-700">
                    Réponse à {replyingTo.sender === session?.user?.id 
                      ? 'votre message' 
                      : (availableUsers.find(u => u.id === replyingTo.sender)?.first_name || 'utilisateur')}
                  </p>
                  <p className="text-sm text-gray-600 truncate">{replyingTo.content}</p>
                </div>
                <button 
                  onClick={cancelReply}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle size={16} />
                </button>
              </div>
            )}

            <div className="flex items-center">
              <div className="flex space-x-2 mr-3">
                <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
                  <Smile size={20} />
                </button>
                <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
                  <Paperclip size={20} />
                </button>
                <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
                  <ImageIcon size={20} />
                </button>
              </div>
              
              <div className="flex-1 relative">
                <textarea
                  ref={messageInputRef}
                  rows={1}
                  placeholder="Écrivez un message..."
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    handleTyping();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none max-h-32"
                  disabled={!messagingEnabled || sendingMessage}
                />
              </div>
              
              <button
                onClick={handleSendMessage}
                disabled={!messagingEnabled || !newMessage.trim() || sendingMessage}
                className="ml-3 p-2 bg-purple-600 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors"
              >
                {sendingMessage ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Send size={20} />
                )}
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50 p-8">
          <div className="text-center">
            <MessageSquare className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">Aucune conversation sélectionnée</h3>
            <p className="text-gray-500 mb-6">Sélectionnez une conversation ou démarrez-en une nouvelle</p>
            <button
              onClick={startNewConversation}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <Plus className="mr-2 h-5 w-5" />
              Nouvelle conversation
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 flex overflow-hidden">
        {renderConversationsList()}
        {renderConversationContent()}
      </div>
    </div>
  );
};

export default MessagingSystem;