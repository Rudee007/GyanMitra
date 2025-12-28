import { createContext, useContext, useState, useEffect } from 'react';
import conversationService from '../services/conversationService';
import toast from 'react-hot-toast';

const ConversationContext = createContext();

export const useConversations = () => {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error('useConversations must be used within a ConversationProvider');
  }
  return context;
};

export const ConversationProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    hasMore: false
  });

  // Fetch conversations from API on mount
  useEffect(() => {
    fetchConversations();
  }, []);

  // Fetch conversations from API
  const fetchConversations = async (page = 1) => {
    setIsLoading(true);
    
    const result = await conversationService.getConversations(page, 10);
    
    if (result.success) {
      if (page === 1) {
        // Replace conversations on first page
        setConversations(result.conversations);
        
        // Set first conversation as active if none selected
        if (!activeConversationId && result.conversations.length > 0) {
          setActiveConversationId(result.conversations[0].id);
        }
      } else {
        // Append conversations on subsequent pages
        setConversations(prev => [...prev, ...result.conversations]);
      }
      
      setPagination(result.pagination);
    } else {
      toast.error('Failed to load conversations');
    }
    
    setIsLoading(false);
  };

  // Load more conversations (pagination)
  const loadMore = async () => {
    if (pagination.hasMore && !isLoading) {
      await fetchConversations(pagination.page + 1);
    }
  };

  // Create new conversation (happens automatically when sending first message)
  const createConversation = () => {
    // Backend creates conversation automatically on first query
    // Just reset active conversation
    setActiveConversationId(null);
    toast.success('Started new chat');
  };

  // Delete conversation
  const deleteConversation = async (id) => {
    const result = await conversationService.deleteConversation(id);
    
    if (result.success) {
      // Remove from local state
      setConversations(prev => prev.filter(conv => conv.id !== id));
      
      // If deleted conversation was active, switch to another
      if (activeConversationId === id) {
        const remaining = conversations.filter(conv => conv.id !== id);
        if (remaining.length > 0) {
          setActiveConversationId(remaining[0].id);
        } else {
          setActiveConversationId(null);
        }
      }
      
      toast.success('Conversation deleted');
    } else {
      toast.error('Failed to delete conversation');
    }
  };

  // Get active conversation with full messages
  const getActiveConversation = async () => {
    if (!activeConversationId) return null;
    
    const result = await conversationService.getConversationById(activeConversationId);
    
    if (result.success) {
      return result.conversation;
    }
    
    return null;
  };

  // Switch conversation
  const switchConversation = (id) => {
    setActiveConversationId(id);
  };

  // Refresh conversations (for pull-to-refresh)
  const refreshConversations = async () => {
    await fetchConversations(1);
    toast.success('Conversations refreshed');
  };

  const value = {
    conversations,
    activeConversationId,
    isLoading,
    pagination,
    fetchConversations,
    loadMore,
    createConversation,
    deleteConversation,
    getActiveConversation,
    switchConversation,
    refreshConversations
  };

  return (
    <ConversationContext.Provider value={value}>
      {children}
    </ConversationContext.Provider>
  );
};
