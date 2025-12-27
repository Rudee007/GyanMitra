// app/(auth)/login.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import Colors from '@/constants/Colors';
import Config from '@/constants/Config';  // ← Must end with /Config
export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    let isValid = true;

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await login(formData.email.trim().toLowerCase(), formData.password);
      // Navigation handled automatically by AuthContext
    } catch (error: any) {
      Alert.alert(
        'Login Failed',
        error.message || 'Invalid email or password. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={[Colors.primary.start, Colors.primary.end]}
        style={styles.topSection}
      >
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Welcome Back!</Text>
          <Text style={styles.headerSubtitle}>Log in to continue your learning journey</Text>
        </View>
      </LinearGradient>

      {/* Form Section */}
      <ScrollView
        style={styles.formSection}
        contentContainerStyle={styles.formContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Email Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address</Text>
          <View style={[styles.inputContainer, errors.email && styles.inputError]}>
            <Ionicons name="mail-outline" size={20} color={Colors.text.secondary} />
            <TextInput
              style={styles.input}
              placeholder="your.email@example.com"
              placeholderTextColor={Colors.text.light}
              value={formData.email}
              onChangeText={(text) => updateFormData('email', text)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
          </View>
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        {/* Password Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={[styles.inputContainer, errors.password && styles.inputError]}>
            <Ionicons name="lock-closed-outline" size={20} color={Colors.text.secondary} />
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor={Colors.text.light}
              value={formData.password}
              onChangeText={(text) => updateFormData('password', text)}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              editable={!isLoading}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={Colors.text.secondary}
              />
            </TouchableOpacity>
          </View>
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
        </View>

        {/* Forgot Password */}
        <TouchableOpacity style={styles.forgotPassword} disabled={isLoading}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
  style={[styles.loginButton, { backgroundColor: '#FF9800', marginBottom: 12 }]}
  onPress={async () => {
    try {
      console.log('🔍 Testing connection to:', Config.API_BASE_URL);
      const healthUrl = Config.API_BASE_URL + '/health';
      console.log('🔍 Health URL:', healthUrl);
      
      console.log('📡 Sending request...');
      const response = await fetch(healthUrl);
      console.log('📡 Response status:', response.status);
      
      const data = await response.json();
      console.log('📡 Response data:', data);
      
      Alert.alert(
        '✅ Backend Connected!',
        `Status: ${data.status}\nService: ${data.service}\nPort: ${data.port}\nDB: ${data.database}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('❌ Error details:', error);
      Alert.alert(
        '❌ Connection Failed',
        `Error: ${error}`,
        [{ text: 'OK' }]
      );
    }
  }}
  activeOpacity={0.8}
>
  <View style={styles.buttonGradient}>
    <Text style={styles.buttonText}>🔍 TEST CONNECTION</Text>
  </View>
</TouchableOpacity>


        {/* Login Button */}
        <TouchableOpacity
          style={[styles.loginButton, isLoading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[Colors.primary.start, Colors.primary.end]}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.buttonText}>Log In</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Sign Up Link */}
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity
            onPress={() => router.push('/(auth)/register')}
            disabled={isLoading}
          >
            <Text style={styles.signupLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topSection: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  header: {
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  formSection: {
    flex: 1,
    backgroundColor: Colors.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
  },
  formContent: {
    padding: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputError: {
    borderColor: Colors.error,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: Colors.text.primary,
  },
  errorText: {
    fontSize: 12,
    color: Colors.error,
    marginTop: 6,
    marginLeft: 4,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: Colors.primary.solid,
    fontWeight: '600',
  },
  loginButton: {
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: Colors.primary.solid,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
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
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  signupText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  signupLink: {
    fontSize: 14,
    color: Colors.primary.solid,
    fontWeight: '600',
  },
});
