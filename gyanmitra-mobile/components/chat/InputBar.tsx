// components/chat/InputBar.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';

interface InputBarProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export default function InputBar({
  onSend,
  isLoading = false,
  placeholder = "Ask anything from your NCERT textbooks...",
}: InputBarProps) {
  const [message, setMessage] = useState('');
  const [inputHeight, setInputHeight] = useState(48);
  const inputRef = useRef<TextInput>(null);

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !isLoading) {
      onSend(trimmedMessage);
      setMessage('');
      setInputHeight(48); // Reset height
      inputRef.current?.blur();
    }
  };

  const handleContentSizeChange = (event: any) => {
    const height = event.nativeEvent.contentSize.height;
    // Max 4 lines (approximately 120px)
    setInputHeight(Math.min(Math.max(48, height), 120));
  };

  const canSend = message.trim().length > 0 && !isLoading;

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          style={[styles.input, { height: inputHeight }]}
          value={message}
          onChangeText={setMessage}
          placeholder={placeholder}
          placeholderTextColor={Colors.text.light}
          multiline
          maxLength={500}
          onContentSizeChange={handleContentSizeChange}
          editable={!isLoading}
          returnKeyType="send"
          blurOnSubmit={false}
          onSubmitEditing={handleSend}
        />

        <TouchableOpacity
          style={[styles.sendButton, !canSend && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!canSend}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <LinearGradient
              colors={canSend ? [Colors.primary.start, Colors.primary.end] : ['#E0E0E0', '#E0E0E0']}
              style={styles.sendButtonGradient}
            >
              <Ionicons
                name="send"
                size={20}
                color={canSend ? '#FFFFFF' : Colors.text.light}
              />
            </LinearGradient>
          )}
        </TouchableOpacity>
      </View>

      {message.length > 450 && (
        <View style={styles.characterCount}>
          <Ionicons
            name={message.length >= 500 ? 'warning' : 'information-circle'}
            size={12}
            color={message.length >= 500 ? Colors.error : Colors.text.secondary}
          />
          <View style={{ width: 4 }} />
          <Text style={[
            styles.characterCountText,
            { color: message.length >= 500 ? Colors.error : Colors.text.secondary }
          ]}>
            {message.length}/500
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 12,
    fontSize: 16,
    color: Colors.text.primary,
    maxHeight: 120,
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  characterCount: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  characterCountText: {
    fontSize: 11,
  },
});
