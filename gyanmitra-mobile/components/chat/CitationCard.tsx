// components/chat/CitationCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import type { Citation } from '@/types/chat';

interface CitationCardProps {
  citation: Citation;
  onPress?: () => void;
}

export default function CitationCard({ citation, onPress }: CitationCardProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      {/* Icon Badge */}
      <View style={styles.badge}>
        <Ionicons name="book-outline" size={14} color={Colors.primary.solid} />
      </View>
      
      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.source} numberOfLines={1} ellipsizeMode="tail">
          {citation.source}
        </Text>
        <Text style={styles.meta} numberOfLines={1} ellipsizeMode="tail">
          Chapter {citation.chapter} · Page {citation.page}
        </Text>
      </View>
      
      {/* Chevron (optional) */}
      {onPress && (
        <Ionicons name="chevron-forward" size={14} color={Colors.text.light} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginVertical: 3,
    borderWidth: 1,
    borderColor: Colors.border,
    // ✅ FIXED: Remove maxWidth from here, let parent control it
    width: '100%', // Take full width of parent
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: 7,
    backgroundColor: `${Colors.primary.solid}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    flexShrink: 0, // ✅ Prevent badge from shrinking
  },
  content: {
    flex: 1, // ✅ Take remaining space
    marginRight: 8, // Space before chevron
  },
  source: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  meta: {
    fontSize: 11,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
});
