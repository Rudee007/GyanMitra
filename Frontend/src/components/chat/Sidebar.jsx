/**
 * Sidebar Component
 * Module 4: Conversation History
 * 
 * Displays conversation history with grouping by date
 * As specified in README.md Module 4
 * 
 * Layout:
 * ┌─────────────────────┐
 * │  [+ New Chat]       │
 * ├─────────────────────┤
 * │  Today              │
 * │  ┌────────────────┐ │
 * │  │ What is...     │ │
 * │  │ 2 hours ago    │ │
 * │  └────────────────┘ │
 * │  Yesterday          │
 * │  ┌────────────────┐ │
 * │  │ Explain...     │ │
 * │  │ Yesterday      │ │
 * │  └────────────────┘ │
 * │  [Load More]        │
 * └─────────────────────┘
 */

import { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import conversationService from '../../services/conversationService';
import toast from 'react-hot-toast';

const Sidebar = ({ 
  conversations, 
  activeConversationId, 
  onNewChat, 
  onSelectConversation, 
  onDeleteConversation,
  onLoadMore,
  hasMore = false,
  isOpen = false,
  onClose
}) => {
  const [hoveredId, setHoveredId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Group conversations by date (README spec)
  const groupedConversations = conversationService.groupConversationsByDate(conversations);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      setDeletingId(id);
      const result = await conversationService.deleteConversation(id);
      
      if (result.success) {
        toast.success('Conversation deleted');
        onDeleteConversation(id);
      } else {
        toast.error('Failed to delete conversation');
      }
      setDeletingId(null);
    }
  };

  const renderConversationCard = (conv) => {
    const isActive = activeConversationId === conv.id;
    const isHovered = hoveredId === conv.id;
    const isDeleting = deletingId === conv.id;

    return (
      <div
        key={conv.id}
        onClick={() => onSelectConversation(conv.id)}
        onMouseEnter={() => setHoveredId(conv.id)}
        onMouseLeave={() => setHoveredId(null)}
        className={`
          relative cursor-pointer rounded-lg p-3 mx-4 mb-2 transition-all duration-200
          ${isActive 
            ? 'bg-white dark:bg-gray-700 border-2 border-blue-500 shadow-sm' 
            : 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
          }
          ${isDeleting ? 'opacity-50' : ''}
        `}
      >
        {/* Title - 14px bold, truncate 1 line (README spec) */}
        <p className="text-sm font-bold text-gray-900 dark:text-white truncate pr-6">
          {conv.title || 'Untitled Chat'}
        </p>
        
        {/* Timestamp - 11px light text (README spec) */}
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {conversationService.formatConversation(conv).relativeTime}
        </p>

        {/* Delete icon (X) visible on hover (README spec) */}
        {isHovered && !isDeleting && (
          <button
            onClick={(e) => handleDelete(e, conv.id)}
            className="absolute top-2 right-2 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  };

  const renderGroup = (title, convs) => {
    if (convs.length === 0) return null;

    return (
      <div key={title} className="mb-4">
        {/* Group headers - 12px uppercase bold secondary color padding 16px (README spec) */}
        <h3 className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 px-4 py-2">
          {title}
        </h3>
        {convs.map(renderConversationCard)}
      </div>
    );
  };

  return (
    // Sidebar bg: #FAFAFA, Border-right: 1px solid #E0E0E0 (README spec)
    <div className={`
      fixed lg:static inset-y-0 left-0 z-50 w-72 
      bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
      transform transition-transform duration-300
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      {/* Close button for mobile */}
      <div className="lg:hidden absolute top-4 right-4">
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* New Chat button - full width, primary gradient background, white text, 12px radius, margin 16px (README spec) */}
      <div className="p-4">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-linear-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Conversation List */}
      <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 120px)' }}>
        {conversations.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No conversations yet
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              Start a new chat to begin
            </p>
          </div>
        ) : (
          <>
            {/* Grouping: "Today", "Yesterday", "Last 7 Days", "Older" (README spec) */}
            {renderGroup('Today', groupedConversations.today)}
            {renderGroup('Yesterday', groupedConversations.yesterday)}
            {renderGroup('Last 7 Days', groupedConversations.lastWeek)}
            {renderGroup('Older', groupedConversations.older)}

            {/* Load More button (README spec) */}
            {hasMore && (
              <div className="px-4 py-4">
                <button
                  onClick={onLoadMore}
                  className="w-full py-2 px-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
