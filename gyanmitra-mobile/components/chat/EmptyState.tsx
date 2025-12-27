// components/chat/EmptyState.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';

interface EmptyStateProps {
  onQuickQuestion?: (question: string) => void;
}

const SAMPLE_QUESTIONS = [
  "What is photosynthesis?",
  "Explain Pythagoras theorem",
  "Tell me about the Indian Constitution",
];

export default function EmptyState({ onQuickQuestion }: EmptyStateProps) {
  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <LinearGradient
          colors={[Colors.primary.start, Colors.primary.end]}
          style={styles.iconGradient}
        >
          <Text style={styles.iconEmoji}>📚</Text>
        </LinearGradient>
        
        <Text style={styles.title}>Ask me anything!</Text>
        <Text style={styles.subtitle}>
          Get answers from your NCERT textbooks
        </Text>
      </View>

      {/* Quick Questions */}
      <View style={styles.questionsSection}>
        {SAMPLE_QUESTIONS.map((question, index) => (
          <TouchableOpacity
            key={index}
            style={styles.questionCard}
            onPress={() => onQuickQuestion?.(question)}
            activeOpacity={0.7}
          >
            <Text style={styles.questionText}>{question}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 60,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 48,
  },
  iconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: Colors.primary.solid,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  iconEmoji: {
    fontSize: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  questionsSection: {
    gap: 12,
  },
  questionCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadow.color,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  questionText: {
    fontSize: 15,
    color: Colors.text.primary,
    lineHeight: 22,
  },
});
