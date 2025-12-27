// app/(tabs)/index.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalSearchParams } from 'expo-router';
import chatService from '@/services/chatService';
import conversationService from '@/services/conversationService';
import MessageBubble from '@/components/chat/MessageBubble';
import SubjectSelector from '@/components/chat/SubjectSelector';
import InputBar from '@/components/chat/InputBar';
import EmptyState from '@/components/chat/EmptyState';
import Colors from '@/constants/Colors';
import type { Citation } from '@/types/chat';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
  citations?: Citation[];
  conversationId?: string;
  messageIndex?: number;
  feedbackGiven?: boolean;
}

export default function ChatScreen() {
  const { user } = useAuth();
  const params = useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingConversation, setIsLoadingConversation] = useState(false);
  const [currentSubject, setCurrentSubject] = useState(user?.subjects?.[0] || 'math');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);

  // Load conversation from history when conversationId param exists
  useEffect(() => {
    const loadConversation = async () => {
      const historyConversationId = params.conversationId as string;
      
      if (historyConversationId) {
        setIsLoadingConversation(true);
        try {
          const conversation = await conversationService.getConversationById(historyConversationId);
          
          setConversationId(conversation.id);
          setCurrentSubject(conversation.metadata.subject);
          
          const loadedMessages: Message[] = await Promise.all(
            conversation.messages.map(async (msg: any, index: number) => {
              const feedbackKey = `feedback_${conversation.id}_${index}`;
              const feedbackGiven = await AsyncStorage.getItem(feedbackKey);
              
              return {
                id: `${msg.role}-${index}`,
                content: msg.content,
                isUser: msg.role === 'user',
                timestamp: msg.timestamp,
                citations: msg.citations,
                conversationId: conversation.id,
                messageIndex: index,
                feedbackGiven: !!feedbackGiven,
              };
            })
          );
          
          setMessages(loadedMessages);
          
        } catch (error: any) {
          console.error('Failed to load conversation:', error);
          Alert.alert('Error', 'Failed to load conversation history.');
        } finally {
          setIsLoadingConversation(false);
        }
      }
    };

    loadConversation();
  }, [params.conversationId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  // ✅ Scroll to bottom when keyboard appears
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  const handleSendMessage = async (messageText: string) => {
    if (!user) {
      Alert.alert('Error', 'Please login to continue');
      return;
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: messageText,
      isUser: true,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await chatService.submitQuery({
        query: messageText,
        grade: user.grade,
        subject: currentSubject,
        language: user.preferredLanguage,
        conversationId: conversationId || undefined,
      });

      if (response.isNewConversation || !conversationId) {
        setConversationId(response.conversationId);
      }

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        content: response.answer,
        isUser: false,
        timestamp: new Date().toISOString(),
        citations: response.citations,
        conversationId: response.conversationId,
        messageIndex: messages.length + 1,
        feedbackGiven: false,
      };

      setMessages((prev) => [...prev, aiMessage]);

      if (!response.inScope) {
        Alert.alert(
          'Out of Scope',
          'This question may not be directly related to NCERT textbooks. The answer might be limited.',
          [{ text: 'OK' }]
        );
      }
    } catch (error: any) {
      console.error('Failed to send message:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to send message. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question);
  };

  const handleCitationPress = (citation: Citation) => {
    Alert.alert(
      'Source Details',
      `Source: ${citation.source}\nChapter: ${citation.chapter}\nPage: ${citation.page}\n\n"${citation.excerpt}"`,
      [{ text: 'Close' }]
    );
  };

  const handleSubjectChange = (newSubject: string) => {
    setCurrentSubject(newSubject);
    setMessages([]);
    setConversationId(null);
    Alert.alert(
      'Subject Changed',
      `Switched to ${newSubject}. Starting a new conversation.`,
      [{ text: 'OK' }]
    );
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <MessageBubble
      content={item.content}
      isUser={item.isUser}
      timestamp={item.timestamp}
      citations={item.citations}
      conversationId={item.conversationId}
      messageIndex={item.messageIndex}
      onCitationPress={handleCitationPress}
    />
  );

  const keyExtractor = (item: Message) => item.id;

  if (isLoadingConversation) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary.solid} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      {/* Subject Selector */}
      <SubjectSelector
        currentSubject={currentSubject}
        currentGrade={user?.grade || 8}
        onSubjectChange={handleSubjectChange}
      />

      {/* Messages List */}
      {messages.length === 0 ? (
        <EmptyState onQuickQuestion={handleQuickQuestion} />
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        />
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <View style={styles.loadingIndicator}>
          <ActivityIndicator color={Colors.primary.solid} size="small" />
        </View>
      )}

      {/* Input Bar */}
      <InputBar onSend={handleSendMessage} isLoading={isLoading} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  messagesList: {
    paddingVertical: 16,
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingIndicator: {
    paddingVertical: 12,
    alignItems: 'center',
  },
});
