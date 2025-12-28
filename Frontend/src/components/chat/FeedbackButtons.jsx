import { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import feedbackService from '../../services/feedbackService';
import toast from 'react-hot-toast';

const FeedbackButtons = ({ conversationId, messageIndex, onFeedbackGiven }) => {
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Don't show feedback buttons if conversationId is invalid
  if (!conversationId || typeof conversationId !== 'string' || conversationId.startsWith('temp')) {
    console.log('⚠️ Invalid conversationId, hiding feedback buttons:', conversationId);
    return null;
  }

  // Check if feedback already given
  useEffect(() => {
    const existingFeedback = feedbackService.getFeedbackState(conversationId, messageIndex);
    if (existingFeedback) {
      setSelectedFeedback(existingFeedback.rating);
      setIsVisible(false);
    }
  }, [conversationId, messageIndex]);

  // Handle feedback submission
  const handleFeedback = async (rating) => {
    if (selectedFeedback || isSubmitting) return;

    setIsSubmitting(true);

    console.log('👍 Submitting feedback:', { conversationId, messageIndex, rating });

    // Call API
    const result = await feedbackService.submitFeedback(
      conversationId,
      messageIndex,
      rating
    );

    if (result.success) {
      // Highlight selected button
      setSelectedFeedback(rating);

      // Store feedback in localStorage
      feedbackService.storeFeedbackState(conversationId, messageIndex, rating);

      toast.success('Thank you for your feedback!');

      // Fade out after 1.5s
      setTimeout(() => {
        setIsVisible(false);
        if (onFeedbackGiven) {
          onFeedbackGiven(rating);
        }
      }, 1500);
    } else {
      // Handle duplicate feedback
      if (result.duplicate) {
        setSelectedFeedback(rating);
        setIsVisible(false);
        toast.error('You have already provided feedback for this message');
      } else {
        toast.error(result.error?.message || 'Failed to submit feedback');
      }
    }

    setIsSubmitting(false);
  };

  if (!isVisible) return null;

  return (
    <div className={`flex items-center space-x-2 transition-opacity duration-500 ${!isVisible ? 'opacity-0' : 'opacity-100'}`}>
      <span className="text-xs text-gray-500 dark:text-gray-400">
        Was this helpful?
      </span>

      {/* Thumbs Up */}
      <button
        onClick={() => handleFeedback('positive')}
        disabled={selectedFeedback !== null || isSubmitting}
        className={`
          w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200
          ${selectedFeedback === 'positive'
            ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
            : 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
          }
          ${(selectedFeedback !== null || isSubmitting) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
        `}
        title="Helpful"
      >
        <ThumbsUp className="w-4 h-4" />
      </button>

      {/* Thumbs Down */}
      <button
        onClick={() => handleFeedback('negative')}
        disabled={selectedFeedback !== null || isSubmitting}
        className={`
          w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200
          ${selectedFeedback === 'negative'
            ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
            : 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
          }
          ${(selectedFeedback !== null || isSubmitting) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
        `}
        title="Not helpful"
      >
        <ThumbsDown className="w-4 h-4" />
      </button>
    </div>
  );
};

export default FeedbackButtons;
