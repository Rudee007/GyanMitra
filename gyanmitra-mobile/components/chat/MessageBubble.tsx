// components/chat/MessageBubble.tsx
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Clipboard,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';  // ✅ ADDED
import Colors from '@/constants/Colors';
import CitationCard from './CitationCard';
import FeedbackButtons from './FeedbackButtons';
import type { Citation } from '@/types/chat';

interface MessageBubbleProps {
  content: string;
  isUser: boolean;
  timestamp?: string;
  citations?: Citation[];
  conversationId?: string;
  messageIndex?: number;
  onCitationPress?: (citation: Citation) => void;
}

export default function MessageBubble({
  content,
  isUser,
  timestamp,
  citations,
  conversationId,
  messageIndex,
  onCitationPress,
}: MessageBubbleProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLongPress = () => {
    Clipboard.setString(content);
    Alert.alert('Copied', 'Message copied to clipboard');
  };

  const formatTime = (isoString?: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // ✅ Check if citations exist
  const hasCitations = citations && citations.length > 0;

  return (
    <Animated.View
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.aiContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <TouchableOpacity
        onLongPress={handleLongPress}
        activeOpacity={0.9}
        delayLongPress={500}
      >
        {isUser ? (
          <LinearGradient
            colors={[Colors.primary.start, Colors.primary.end]}
            style={[styles.bubble, styles.userBubble]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.userText}>{content}</Text>
          </LinearGradient>
        ) : (
          <View style={[styles.bubble, styles.aiBubble]}>
            <Text style={styles.aiText}>{content}</Text>
          </View>
        )}

        {timestamp && (
          <Text style={[styles.timestamp, isUser ? styles.userTimestamp : styles.aiTimestamp]}>
            {formatTime(timestamp)}
          </Text>
        )}
      </TouchableOpacity>

      {/* ✅ CITATIONS OR NO CITATIONS MESSAGE (AI messages only) */}
      {!isUser && (
        <View style={styles.citationsContainer}>
          {hasCitations ? (
            // ✅ HAS CITATIONS - Show them
            <>
              <Text style={styles.citationsTitle}>Sources:</Text>
              <View style={styles.citationsWrapper}>
                {citations.map((citation, index) => (
                  <CitationCard
                    key={`${citation.chunkId}-${index}`}
                    citation={citation}
                    onPress={() => onCitationPress?.(citation)}
                  />
                ))}
              </View>
            </>
          ) : (
            // ✅ NO CITATIONS - Show warning
            <View style={styles.citationsWrapper}>
              <View style={styles.noCitationsCard}>
                <View style={styles.noCitationsIcon}>
                  <Ionicons name="alert-circle-outline" size={18} color="#F59E0B" />
                </View>
                <View style={styles.noCitationsContent}>
                  <Text style={styles.noCitationsTitle}>No NCERT sources found</Text>
                  <Text style={styles.noCitationsText}>
                    This answer is based on general knowledge. Try asking questions related to your NCERT textbook for source-backed responses.
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>
      )}

      {/* Feedback (only for AI messages) */}
      {!isUser && conversationId && messageIndex !== undefined && (
        <FeedbackButtons
          conversationId={conversationId}
          messageIndex={messageIndex}
        />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  aiContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '85%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  userText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#FFFFFF',
  },
  aiText: {
    fontSize: 16,
    lineHeight: 22,
    color: Colors.text.primary,
  },
  timestamp: {
    fontSize: 11,
    color: Colors.text.light,
    marginTop: 4,
    marginHorizontal: 4,
  },
  userTimestamp: {
    textAlign: 'right',
  },
  aiTimestamp: {
    textAlign: 'left',
  },
  // ✅ UPDATED: Citations container styles
  citationsContainer: {
    marginTop: 8,
    width: '100%',
  },
  citationsWrapper: {
    width: '85%',
    alignSelf: 'flex-start',
  },
  citationsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.secondary,
    marginBottom: 6,
    marginLeft: 4,
  },
  // ✅ NEW: No citations card styles
  noCitationsCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FEF3C7', // Amber-50
    borderRadius: 10,
    padding: 12,
    marginVertical: 3,
    borderWidth: 1,
    borderColor: '#FCD34D', // Amber-300
  },
  noCitationsIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  noCitationsContent: {
    flex: 1,
  },
  noCitationsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E', // Amber-900
    marginBottom: 4,
  },
  noCitationsText: {
    fontSize: 11,
    color: '#B45309', // Amber-700
    lineHeight: 16,
  },
});
