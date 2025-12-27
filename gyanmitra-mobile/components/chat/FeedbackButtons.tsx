// components/chat/FeedbackButtons.tsx
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import feedbackService from '@/services/feedbackService';
import Colors from '@/constants/Colors';

interface FeedbackButtonsProps {
  conversationId: string;
  messageIndex: number;
  onFeedbackSubmit?: (rating: 'positive' | 'negative') => void;
}

export default function FeedbackButtons({
  conversationId,
  messageIndex,
  onFeedbackSubmit,
}: FeedbackButtonsProps) {
  const [selectedRating, setSelectedRating] = useState<'positive' | 'negative' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Check if feedback was already given on mount
  useEffect(() => {
    const checkExistingFeedback = async () => {
      try {
        const feedbackKey = `feedback_${conversationId}_${messageIndex}`;
        const existingFeedback = await AsyncStorage.getItem(feedbackKey);
        
        if (existingFeedback) {
          // If feedback exists, hide immediately
          setIsHidden(true);
        }
      } catch (error) {
        console.error('Error checking existing feedback:', error);
      }
    };

    checkExistingFeedback();
  }, [conversationId, messageIndex]);

  const handleFeedback = async (rating: 'positive' | 'negative') => {
    if (isSubmitting || selectedRating) return;

    setIsSubmitting(true);
    try {
      await feedbackService.submitFeedback({
        conversationId,
        messageIndex,
        rating,
      });

      setSelectedRating(rating);
      onFeedbackSubmit?.(rating);

      // Store feedback in local storage
      const feedbackKey = `feedback_${conversationId}_${messageIndex}`;
      await AsyncStorage.setItem(feedbackKey, rating);

      // Wait 1.5 seconds, then animate out
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setIsHidden(true);
        });
      }, 1500);
    } catch (error: any) {
      console.error('Feedback error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isHidden) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <Text style={styles.label}>Was this helpful?</Text>
      
      <View style={styles.buttons}>
        <TouchableOpacity
          style={[
            styles.button,
            selectedRating === 'positive' && styles.buttonActivePositive,
          ]}
          onPress={() => handleFeedback('positive')}
          disabled={isSubmitting || selectedRating !== null}
          activeOpacity={0.7}
        >
          <Ionicons
            name={selectedRating === 'positive' ? 'thumbs-up' : 'thumbs-up-outline'}
            size={16}
            color={
              selectedRating === 'positive'
                ? '#4CAF50'
                : Colors.text.secondary
            }
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            selectedRating === 'negative' && styles.buttonActiveNegative,
          ]}
          onPress={() => handleFeedback('negative')}
          disabled={isSubmitting || selectedRating !== null}
          activeOpacity={0.7}
        >
          <Ionicons
            name={selectedRating === 'negative' ? 'thumbs-down' : 'thumbs-down-outline'}
            size={16}
            color={
              selectedRating === 'negative'
                ? '#F44336'
                : Colors.text.secondary
            }
          />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    paddingVertical: 4,
  },
  label: {
    fontSize: 11,
    color: Colors.text.secondary,
    marginRight: 10,
  },
  buttons: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonActivePositive: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  buttonActiveNegative: {
    backgroundColor: '#FFEBEE',
    borderColor: '#F44336',
  },
});
