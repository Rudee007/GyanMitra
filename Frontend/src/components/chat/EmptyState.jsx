/**
 * Empty State Component
 * Module 3: Main Chat Interface
 * 
 * Displays when no messages in chat
 * As specified in README.md Module 3
 * 
 * Centered in chat area with large icon (96px, gradient), title 28px, subtitle 16px
 * Quick question cards (300px wide, border, hover shadow+scale)
 * Click → send as query
 */

import { MessageSquare, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const EmptyState = ({ onQuestionClick }) => {
  // Quick question suggestions
  const quickQuestions = [
    {
      title: 'Explain Photosynthesis',
      question: 'What is photosynthesis and how does it work?',
      icon: '🌱'
    },
    {
      title: 'Pythagorean Theorem',
      question: 'Explain the Pythagorean theorem with an example',
      icon: '📐'
    },
    {
      title: 'Indian History',
      question: 'Tell me about the Indian Independence Movement',
      icon: '🇮🇳'
    },
    {
      title: 'Grammar Rules',
      question: 'What are the basic rules of English grammar?',
      icon: '📚'
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full py-6 sm:py-12 px-4">
      {/* Large icon (96px, gradient) - README spec - Responsive sizing */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="w-20 h-20 sm:w-24 sm:h-24 bg-linear-to-r from-blue-500 to-purple-600 rounded-2xl sm:rounded-3xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg"
      >
        <MessageSquare className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
      </motion.div>

      {/* Title 28px - README spec - Responsive sizing */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 text-center px-4"
      >
        Welcome to GyanMitra!
      </motion.h2>

      {/* Subtitle 16px - README spec - Responsive sizing */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 text-center max-w-sm sm:max-w-md px-4"
      >
        Your AI-powered NCERT learning assistant. Ask me anything about your textbooks!
      </motion.p>

      {/* Quick Question Cards (300px wide, border, hover shadow+scale) - README spec - Mobile optimized */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-4xl w-full px-4">
        {quickQuestions.map((item, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onQuestionClick(item.question)}
            className="w-full p-3 sm:p-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200 text-left group touch-manipulation"
          >
            <div className="flex items-start space-x-3">
              <div className="text-2xl sm:text-3xl shrink-0">{item.icon}</div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {item.question}
                </p>
              </div>
              <Sparkles className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors shrink-0" />
            </div>
          </motion.button>
        ))}
      </div>

      {/* Additional hint - Mobile optimized */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-6 sm:mt-8 text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center px-4"
      >
        Click on a suggestion or type your own question below
      </motion.p>
    </div>
  );
};

export default EmptyState;
