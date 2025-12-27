// components/history/ConversationCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Colors from '@/constants/Colors';
import type { Conversation } from '@/types/chat';
import { formatRelativeTime, getSubjectStyle } from '@/utils/formatters';

interface ConversationCardProps {
  conversation: Conversation;
  onPress: () => void;
  onDelete: (id: string) => void;
}

export default function ConversationCard({ 
  conversation, 
  onPress,
  onDelete,
}: ConversationCardProps) {
  const subjectStyle = getSubjectStyle(conversation.metadata.subject);
  
  // Get first and last messages
  const firstMessage = conversation.messages?.[0]?.content || conversation.title || 'New conversation';
  const lastMessage = conversation.lastMessage?.content || '';

  // Render delete action (shown when swiping left)
  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity
        style={styles.deleteAction}
        onPress={() => onDelete(conversation.id)}
        activeOpacity={0.8}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <Ionicons name="trash-outline" size={24} color="#FFFFFF" />
          <Text style={styles.deleteText}>Delete</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      overshootRight={false}
      friction={2}
    >
      <TouchableOpacity
        style={styles.container}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {/* Subject Badge */}
        <View style={[styles.badge, { backgroundColor: `${subjectStyle.color}15` }]}>
          <Ionicons 
            name={subjectStyle.icon as any} 
            size={18} 
            color={subjectStyle.color} 
          />
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Header: Subject + Timestamp */}
          <View style={styles.header}>
            <Text style={[styles.subject, { color: subjectStyle.color }]}>
              {conversation.metadata.subject.replace('_', ' ')}
            </Text>
            <Text style={styles.timestamp}>
              {formatRelativeTime(conversation.updatedAt)}
            </Text>
          </View>

          {/* Title (First message) */}
          <Text style={styles.title} numberOfLines={1}>
            {firstMessage}
          </Text>

          {/* Preview (Last message) */}
          {lastMessage && (
            <Text style={styles.preview} numberOfLines={2}>
              {lastMessage}
            </Text>
          )}

          {/* Message Count */}
          <Text style={styles.messageCount}>
            {conversation.messageCount} {conversation.messageCount === 1 ? 'message' : 'messages'}
          </Text>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadow.color,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  badge: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  subject: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  timestamp: {
    fontSize: 11,
    color: Colors.text.light,
    fontWeight: '500',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  preview: {
    fontSize: 13,
    color: Colors.text.secondary,
    lineHeight: 18,
    marginBottom: 6,
  },
  messageCount: {
    fontSize: 11,
    color: Colors.text.light,
    fontWeight: '500',
  },
  // Delete action styles
  deleteAction: {
    backgroundColor: Colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    width: 90,
    marginVertical: 6,
    marginRight: 16,
    borderRadius: 12,
  },
  deleteText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
});
