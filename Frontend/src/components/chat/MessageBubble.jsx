/**
 * Message Bubble Component - Premium Design v2.0 (Optimized)
 * Shows only 2-3 best citations for clean, professional look
 * WITH FEEDBACK BUTTONS + NO CITATIONS MESSAGE
 */

import { memo } from 'react';
import { BookOpen, ChevronDown, AlertCircle } from 'lucide-react';  // ✅ Added AlertCircle
import { useState } from 'react';
import CitationCard from './CitationCard';
import FeedbackButtons from './FeedbackButtons';

const MessageBubble = memo(({ 
  message, 
  isUser, 
  messageIndex = 0, 
  conversationId,
  isStreaming = false 
}) => {
  const [showAllCitations, setShowAllCitations] = useState(false);

  // Format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  // Get top 3 citations by relevance (or default to first 3)
  const getTopCitations = () => {
    if (!message.citations || message.citations.length === 0) return [];
    
    const sorted = [...message.citations].sort((a, b) => {
      const aRelevance = a.relevancePercent || a.relevance * 100 || 0;
      const bRelevance = b.relevancePercent || b.relevance * 100 || 0;
      return bRelevance - aRelevance;
    });
    
    return showAllCitations ? sorted : sorted.slice(0, 3);
  };

  const topCitations = getTopCitations();
  const hasMoreCitations = message.citations && message.citations.length > 3;
  const hasCitations = message.citations && message.citations.length > 0;

  if (isUser) {
    // ✨ USER MESSAGE - Sleek Design
    return (
      <div className="flex justify-end mb-4 animate-in fade-in slide-in-from-bottom-2">
        <div className="max-w-[75%] bg-gradient-to-br from-blue-600 via-blue-600 to-purple-700 text-white rounded-3xl rounded-br-none px-5 py-3.5 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
          <p className="text-sm leading-relaxed font-medium">{message.content}</p>
          <div className="text-xs text-blue-100 mt-2 text-right font-medium">
            {formatTime(message.timestamp)}
          </div>
        </div>
      </div>
    );
  }

  // ✨ AI MESSAGE - Professional Design
  return (
    <div className="flex justify-start mb-4 animate-in fade-in slide-in-from-left-2">
      <div className="max-w-[85%] bg-gradient-to-br from-white via-white to-gray-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-3xl rounded-bl-none px-6 py-5 shadow-lg hover:shadow-xl transition-all duration-300">
        
        {/* Answer Section */}
        <div className="text-sm text-gray-800 dark:text-gray-100 leading-relaxed font-medium mb-5">
          {message.content}
          
          {isStreaming && (
            <span className="inline-block w-0.5 h-4 bg-blue-600 dark:bg-blue-400 ml-1 animate-pulse" />
          )}
        </div>

        {/* ✨ CITATIONS SECTION */}
        {!isStreaming && (
          <>
            {/* ✅ HAS CITATIONS - Show them */}
            {hasCitations ? (
              <div className="mt-6 pt-5 border-t border-gray-300 dark:border-gray-600">
                {/* Header with Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        Key Sources
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {message.citations.length} {message.citations.length === 1 ? 'reference' : 'references'}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Citation Cards - Clean & Compact */}
                <div className="space-y-2.5">
                  {topCitations.map((citation, citIndex) => (
                    <CitationCard
                      key={`${citation.chunkId}-${citIndex}`}
                      citation={citation}
                      index={citation.number || citIndex + 1}
                    />
                  ))}
                </div>

                {/* Show More Button - Only if there are more citations */}
                {hasMoreCitations && (
                  <button
                    onClick={() => setShowAllCitations(!showAllCitations)}
                    className="mt-3 w-full flex items-center justify-center space-x-1 py-2 px-3 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                  >
                    <span>
                      {showAllCitations 
                        ? `Show less` 
                        : `Show all ${message.citations.length} sources`}
                    </span>
                    <ChevronDown 
                      className={`w-4 h-4 transition-transform duration-300 ${showAllCitations ? 'rotate-180' : ''}`}
                    />
                  </button>
                )}
              </div>
            ) : (
              /* ✅ NO CITATIONS - Show friendly message */
              <div className="mt-6 pt-5 border-t border-gray-300 dark:border-gray-600">
                <div className="flex items-start space-x-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                  <div className="shrink-0 mt-0.5">
                    <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-amber-900 dark:text-amber-300 mb-1">
                      No NCERT sources found
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                      This answer is based on general knowledge. Try asking questions related to your NCERT textbook for source-backed responses.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ✅ FEEDBACK & TIMESTAMP SECTION */}
        {!isStreaming && (
          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              {/* Timestamp */}
              <div className="text-xs text-gray-500 dark:text-gray-500 font-medium">
                {formatTime(message.timestamp)}
              </div>
              
              {/* Feedback Buttons - Only show for valid conversations */}
              {conversationId && (
                <FeedbackButtons
                  conversationId={conversationId}
                  messageIndex={messageIndex}
                  onFeedbackGiven={(rating) => {
                    console.log(`✅ Feedback given for message ${messageIndex}:`, rating);
                  }}
                />
              )}
            </div>
          </div>
        )}

        {/* Streaming indicator */}
        {isStreaming && (
          <div className="mt-4 flex items-center space-x-3">
            <div className="flex space-x-1">
              <div className="w-2.5 h-2.5 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2.5 h-2.5 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2.5 h-2.5 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400 font-semibold">Generating response...</span>
          </div>
        )}
      </div>
    </div>
  );
});

MessageBubble.displayName = 'MessageBubble';

export default MessageBubble;
