// app/(auth)/verify-email.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import authService from '@/services/authService';
import Colors from '@/constants/Colors';

export default function VerifyEmailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;

  const [isChecking, setIsChecking] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [countdown, setCountdown] = useState(0);

  // Poll verification status every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      checkVerification();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Countdown for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const checkVerification = async () => {
    try {
      const response = await authService.checkVerificationStatus(email);
      
      if (response.verified) {
        Alert.alert(
          '✅ Email Verified!',
          'Your email has been verified successfully. You can now login.',
          [
            {
              text: 'Continue',
              onPress: () => router.replace('/(auth)/login')
            }
          ]
        );
      }
    } catch (error) {
      // Silent fail - user can manually check
    }
  };

  const handleCheckVerification = async () => {
    setIsChecking(true);
    try {
      const response = await authService.checkVerificationStatus(email);
      
      if (response.verified) {
        Alert.alert(
          '✅ Email Verified!',
          'Your email has been verified successfully. You can now login.',
          [
            {
              text: 'Login',
              onPress: () => router.replace('/(auth)/login')
            }
          ]
        );
      } else {
        Alert.alert(
          '📧 Not Verified Yet',
          'Please check your email and click the verification link.',
          [{ text: 'OK' }]
        );
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to check verification status');
    } finally {
      setIsChecking(false);
    }
  };

  const handleResendEmail = async () => {
    if (!canResend) return;

    setIsResending(true);
    try {
      await authService.resendVerification(email);
      
      setCanResend(false);
      setCountdown(60);
      
      Alert.alert(
        '📧 Email Sent',
        'Verification email has been resent. Please check your inbox.',
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to resend email');
    } finally {
      setIsResending(false);
    }
  };

  const handleOpenEmail = () => {
    Linking.openURL('mailto:');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.primary.start, Colors.primary.end]}
        style={styles.header}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="mail" size={80} color="#FFFFFF" />
        </View>
        <Text style={styles.headerTitle}>Check Your Email</Text>
        <Text style={styles.headerSubtitle}>
          We've sent a verification link to:
        </Text>
        <Text style={styles.email}>{email}</Text>
      </LinearGradient>

      <View style={styles.content}>
        {/* Instructions Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Next Steps:</Text>
          
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={styles.stepText}>Open your email app</Text>
          </View>

          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={styles.stepText}>Find the email from GyanMitra</Text>
          </View>

          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={styles.stepText}>Click the verification link</Text>
          </View>

          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>4</Text>
            </View>
            <Text style={styles.stepText}>Come back here and click "I've Verified"</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleOpenEmail}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[Colors.primary.start, Colors.primary.end]}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons name="mail-open" size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Open Email App</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryButton, isChecking && styles.buttonDisabled]}
          onPress={handleCheckVerification}
          disabled={isChecking}
          activeOpacity={0.8}
        >
          {isChecking ? (
            <ActivityIndicator color={Colors.primary.solid} />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={20} color={Colors.primary.solid} />
              <Text style={styles.secondaryButtonText}>I've Verified</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Resend Email */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the email? </Text>
          <TouchableOpacity
            onPress={handleResendEmail}
            disabled={!canResend || isResending}
          >
            <Text style={[styles.resendLink, (!canResend || isResending) && styles.resendDisabled]}>
              {isResending ? 'Sending...' : canResend ? 'Resend' : `Resend (${countdown}s)`}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Back to Login */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace('/(auth)/login')}
        >
          <Text style={styles.backButtonText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 50,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: Colors.shadow.color,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: Colors.shadow.opacity,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 20,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary.solid,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: Colors.text.secondary,
  },
  primaryButton: {
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: Colors.primary.solid,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  secondaryButton: {
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: Colors.primary.solid,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary.solid,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  resendText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  resendLink: {
    fontSize: 14,
    color: Colors.primary.solid,
    fontWeight: '600',
  },
  resendDisabled: {
    opacity: 0.5,
  },
  backButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  backButtonText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
});
