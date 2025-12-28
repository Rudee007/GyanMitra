/**
 * Chat Page - DEBUG VERSION
 * Will show exactly what data we're receiving
 */

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Menu, X, LogOut, Moon, Sun } from 'lucide-react';
import SubjectSelector from '../components/chat/SubjectSelector';
import MessageBubble from '../components/chat/MessageBubble';
import InputBar from '../components/chat/InputBar';
import EmptyState from '../components/chat/EmptyState';
import axiosInstance from '../lib/axiosInstance';
import conversationService from '../services/conversationService';
import toast from 'react-hot-toast';

const ChatPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const chatContainerRef = useRef(null);
  const messagesEndRef = useRef(null);

  const [selectedGrade, setSelectedGrade] = useState(() => {
    const userGrade = user?.grade;
    if (typeof userGrade === 'number') {
      return `Grade ${userGrade}`;
    } else if (typeof userGrade === 'string' && !userGrade.includes('Grade')) {
      return `Grade ${userGrade}`;
    }
    return userGrade || 'Grade 9';
  });
  
  const [selectedSubject, setSelectedSubject] = useState('science');
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true' ||
      (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    scrollToBottom('smooth');
  }, [messages, isLoading]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDarkMode]);

  useEffect(() => {
    loadConversations();
  }, []);

  const scrollToBottom = (behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior, block: 'end' });
  };

  const loadConversations = async () => {
    try {
      const result = await conversationService.getConversations(1, 10);
      if (result.success) {
        setConversations(result.conversations);
      }
    } catch (error) {
      console.error('[ChatPage] Error loading conversations:', error);
    }
  };

  // ✅ SUPER DEBUG VERSION
  const handleSendMessage = async (question) => {
    if (!question.trim()) return;

    const userMessage = {
      role: 'user',
      content: question.trim(),
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setTimeout(() => scrollToBottom('smooth'), 100);

    try {
      let gradeNumber;
      if (typeof selectedGrade === 'number') {
        gradeNumber = selectedGrade;
      } else if (typeof selectedGrade === 'string') {
        gradeNumber = parseInt(selectedGrade.replace(/\D/g, '')) || 9;
      } else {
        gradeNumber = user?.grade || 9;
      }

      const subjectFormatted = (selectedSubject || 'science')
        .toLowerCase()
        .replace(/\s+/g, '_');

      console.log('🚀 [DEBUG] Starting query...');
      console.log('📤 [DEBUG] Payload:', {
        query: question.trim(),
        grade: gradeNumber,
        subject: subjectFormatted,
        language: selectedLanguage,
        conversationId: conversationId,
        top_k: 5
      });

      const response = await axiosInstance.post('/query', {
        query: question.trim(),
        grade: gradeNumber,
        subject: subjectFormatted,
        language: selectedLanguage,
        conversationId: conversationId,
        top_k: 5
      });

      // ✅ DETAILED LOGGING
      console.log('📥 [DEBUG] Raw response:', response);
      console.log('📥 [DEBUG] response.data:', response.data);
      console.log('📥 [DEBUG] response.data.success:', response.data.success);
      console.log('📥 [DEBUG] response.data.answer:', response.data.answer?.substring(0, 100));
      console.log('📥 [DEBUG] response.data.citations:', response.data.citations);
      console.log('📥 [DEBUG] response.data.citations type:', typeof response.data.citations);
      console.log('📥 [DEBUG] response.data.citations length:', response.data.citations?.length);
      
      // ✅ Log each citation
      if (response.data.citations && Array.isArray(response.data.citations)) {
        console.log('✅ [DEBUG] Citations is an array with', response.data.citations.length, 'items');
        response.data.citations.forEach((cit, idx) => {
          console.log(`📚 [DEBUG] Citation ${idx}:`, cit);
        });
      } else {
        console.error('❌ [DEBUG] Citations is NOT an array or is undefined!');
      }

      if (response.data.success) {
        setTimeout(() => {
          const aiMessage = {
            role: 'assistant',
            content: response.data.answer || '',
            citations: response.data.citations || [],
            sourceChunks: response.data.sourceChunks || [],
            timestamp: new Date().toISOString(),
            metadata: response.data.metadata || {}
          };

          console.log('💬 [DEBUG] Created aiMessage:', aiMessage);
          console.log('💬 [DEBUG] aiMessage.citations:', aiMessage.citations);
          console.log('💬 [DEBUG] aiMessage.citations length:', aiMessage.citations.length);

          setMessages(prev => {
            const newMessages = [...prev, aiMessage];
            console.log('📝 [DEBUG] New messages array:', newMessages);
            console.log('📝 [DEBUG] Last message (AI):', newMessages[newMessages.length - 1]);
            console.log('📝 [DEBUG] Last message citations:', newMessages[newMessages.length - 1].citations);
            return newMessages;
          });

          if (response.data.conversationId) {
            setConversationId(response.data.conversationId);
          }

          loadConversations();
        }, 300);
      } else {
        console.error('❌ [DEBUG] Response success is false');
        toast.error('Failed to get response');
        setMessages(prev => prev.slice(0, -1));
      }
    } catch (error) {
      console.error('❌ [DEBUG] Error:', error);
      console.error('❌ [DEBUG] Error response:', error.response?.data);
      toast.error(error.response?.data?.error || 'An error occurred');
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setTimeout(() => setIsLoading(false), 300);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setConversationId(null);
    setIsSidebarOpen(false);
    toast.success('New chat started');
  };

  const handleLoadConversation = async (id) => {
    try {
      const result = await conversationService.getConversationById(id);

      if (result.success && result.conversation) {
        const loadedMessages = result.conversation.messages || [];

        setMessages(loadedMessages);
        setConversationId(id);

        if (result.conversation.metadata) {
          if (result.conversation.metadata.grade) {
            setSelectedGrade(`Grade ${result.conversation.metadata.grade}`);
          }
          if (result.conversation.metadata.subject) {
            const subject = result.conversation.metadata.subject
              .charAt(0).toUpperCase() + 
              result.conversation.metadata.subject.slice(1).replace('_', ' ');
            setSelectedSubject(subject);
          }
        }

        setIsSidebarOpen(false);
        toast.success('Conversation loaded');
        setTimeout(() => scrollToBottom('auto'), 100);
      } else {
        toast.error('Failed to load conversation');
      }
    } catch (error) {
      console.error('[ChatPage] Error loading conversation:', error);
      toast.error('An error occurred while loading the conversation');
    }
  };

  const handleLogout = () => setShowLogoutModal(true);
  const confirmLogout = () => {
    logout();
    setShowLogoutModal(false);
  };
  const cancelLogout = () => setShowLogoutModal(false);
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30 hidden md:block">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="flex h-screen w-full relative z-10">
        <div className={`fixed lg:static inset-y-0 left-0 z-50 w-72 sm:w-80 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 shadow-2xl transform transition-all duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <span className="font-bold text-lg text-gray-900 dark:text-white">GyanMitra</span>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-4">
            <button onClick={handleNewChat} className="group relative w-full py-3 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300">
              <span className="relative z-10 flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Chat
              </span>
            </button>
          </div>

          <div className="px-4 pb-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">Recent Conversations</h3>
            {conversations.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-6">No conversations yet</p>
            ) : (
              <div className="space-y-2">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => handleLoadConversation(conv.id)}
                    className={`group w-full text-left p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all duration-300 hover:shadow-md ${conversationId === conv.id ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-500 shadow-lg' : 'border-2 border-transparent'}`}
                  >
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {conv.title || 'Untitled Chat'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(conv.updatedAt || conv.createdAt).toLocaleDateString()}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 sm:h-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg flex items-center justify-between px-3 sm:px-4">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
              <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                <span className="font-bold text-base sm:text-lg text-gray-900 dark:text-white hidden sm:inline">GyanMitra</span>
              </div>
            </div>

            <div className="flex items-center space-x-1 sm:space-x-2">
              <div className="hidden md:block">
                <SubjectSelector selectedGrade={selectedGrade} selectedSubject={selectedSubject} onSubjectChange={setSelectedSubject} />
              </div>
              <button onClick={toggleDarkMode} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                {isDarkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-600" />}
              </button>
              <button onClick={() => navigate('/profile')} className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <span className="hidden lg:inline text-sm font-medium text-gray-700 dark:text-gray-300">Profile</span>
              </button>
              <button onClick={handleLogout} className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-red-600 dark:text-red-400">
                <LogOut className="w-5 h-5" />
                <span className="hidden lg:inline text-sm font-medium">Logout</span>
              </button>
            </div>
          </header>

          <div className="md:hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 px-4 py-2">
            <SubjectSelector selectedGrade={selectedGrade} selectedSubject={selectedSubject} onSubjectChange={setSelectedSubject} />
          </div>

          <main ref={chatContainerRef} className="flex-1 overflow-y-auto p-3 sm:p-4 scroll-smooth" style={{ WebkitOverflowScrolling: 'touch', scrollBehavior: 'smooth' }}>
            {messages.length === 0 ? (
              <EmptyState onQuestionClick={handleSendMessage} />
            ) : (
              <div className="max-w-4xl mx-auto space-y-4">
                {messages.map((message, index) => {
                  // ✅ DEBUG: Log each message being rendered
                  console.log(`🎨 [DEBUG] Rendering message ${index}:`, message);
                  console.log(`🎨 [DEBUG] Message ${index} citations:`, message.citations);
                  
                  return (
                    <div
                      key={`message-${index}-${message.timestamp}`}
                      className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                      style={{ animationDelay: `${Math.min(index * 50, 500)}ms`, animationFillMode: 'backwards' }}
                    >
                      <MessageBubble
                        message={message}
                        isUser={message.role === 'user'}
                        messageIndex={index}
                        conversationId={conversationId}
                        isStreaming={message.isStreaming || false}
                      />
                    </div>
                  );
                })}
                
                {isLoading && (
                  <div className="flex justify-start animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex space-x-2 items-center">
                        <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            )}
          </main>

          <InputBar onSendMessage={handleSendMessage} disabled={isLoading} />
        </div>

        {isSidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-in fade-in duration-200" onClick={() => setIsSidebarOpen(false)} />
        )}

        {showLogoutModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={cancelLogout}>
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-sm animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <LogOut className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 text-center">Logout Confirmation</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 text-center">Are you sure you want to log out?</p>
              <div className="flex space-x-4">
                <button onClick={cancelLogout} className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">Cancel</button>
                <button onClick={confirmLogout} className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:shadow-xl transition-all">Logout</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
