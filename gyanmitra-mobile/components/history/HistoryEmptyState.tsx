// components/history/HistoryEmptyState.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';

export default function HistoryEmptyState() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Icon */}
      <View style={styles.iconContainer}>
        <LinearGradient
          colors={[Colors.primary.start, Colors.primary.end]}
          style={styles.iconGradient}
        >
          <Ionicons name="time-outline" size={48} color="#FFFFFF" />
        </LinearGradient>
      </View>

      {/* Text */}
      <Text style={styles.title}>No conversations yet</Text>
      <Text style={styles.subtitle}>
        Start chatting to see your{'\n'}conversation history here
      </Text>

      {/* Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/(tabs)/')}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[Colors.primary.start, Colors.primary.end]}
          style={styles.buttonGradient}
        >
          <Text style={styles.buttonText}>Start Chatting</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconGradient: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary.solid,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  button: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: Colors.primary.solid,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
