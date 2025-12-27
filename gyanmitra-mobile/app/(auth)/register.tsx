// app/(auth)/register.tsx
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
import Config from '@/constants/Config';
import Colors from '@/constants/Colors';

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();

  const [step, setStep] = useState(1); // 1: Email/Password, 2: Profile Info
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    grade: 8,
    preferredLanguage: 'english',
    subjects: [] as string[],
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const validateStep1 = () => {
    const newErrors: any = {};
    let isValid = true;

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
      isValid = false;
    }

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
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const validateStep2 = () => {
    const newErrors: any = {};
    let isValid = true;

    if (formData.subjects.length === 0) {
      newErrors.subjects = 'Please select at least one subject';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleRegister = async () => {
    if (!validateStep2()) return;
  
    setIsLoading(true);
    try {
      const response = await register({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        grade: formData.grade,
        preferredLanguage: formData.preferredLanguage,
        subjects: formData.subjects,
      });
      
      // Navigate to verify email screen
      router.push({
        pathname: '/(auth)/verify-email',
        params: { email: formData.email.trim().toLowerCase() }
      });
      
    } catch (error: any) {
      Alert.alert(
        'Registration Failed',
        error.message || 'Something went wrong. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateFormData = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const toggleSubject = (subject: string) => {
    const subjects = formData.subjects.includes(subject)
      ? formData.subjects.filter((s) => s !== subject)
      : [...formData.subjects, subject];
    updateFormData('subjects', subjects);
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
          onPress={() => (step === 1 ? router.back() : setStep(1))}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Create Account</Text>
          <Text style={styles.headerSubtitle}>
            {step === 1 ? 'Enter your details' : 'Choose your preferences'}
          </Text>
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressDot, step >= 1 && styles.progressDotActive]} />
          <View style={[styles.progressLine, step >= 2 && styles.progressLineActive]} />
          <View style={[styles.progressDot, step >= 2 && styles.progressDotActive]} />
        </View>
      </LinearGradient>

      {/* Form Section */}
      <ScrollView
        style={styles.formSection}
        contentContainerStyle={styles.formContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {step === 1 ? (
          <>
            {/* Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View style={[styles.inputContainer, errors.name && styles.inputError]}>
                <Ionicons name="person-outline" size={20} color={Colors.text.secondary} />
                <TextInput
                  style={styles.input}
                  placeholder="John Doe"
                  placeholderTextColor={Colors.text.light}
                  value={formData.name}
                  onChangeText={(text) => updateFormData('name', text)}
                  autoCapitalize="words"
                  editable={!isLoading}
                />
              </View>
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

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
                  placeholder="At least 6 characters"
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

            {/* Confirm Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={[styles.inputContainer, errors.confirmPassword && styles.inputError]}>
                <Ionicons name="lock-closed-outline" size={20} color={Colors.text.secondary} />
                <TextInput
                  style={styles.input}
                  placeholder="Re-enter your password"
                  placeholderTextColor={Colors.text.light}
                  value={formData.confirmPassword}
                  onChangeText={(text) => updateFormData('confirmPassword', text)}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  editable={!isLoading}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Ionicons
                    name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={Colors.text.secondary}
                  />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}
            </View>

            {/* Next Button */}
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNext}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[Colors.primary.start, Colors.primary.end]}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.buttonText}>Next</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* Grade Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Select Your Grade</Text>
              <View style={styles.gradeContainer}>
                {Config.GRADES.map((grade) => (
                  <TouchableOpacity
                    key={grade}
                    style={[
                      styles.gradeButton,
                      formData.grade === grade && styles.gradeButtonActive,
                    ]}
                    onPress={() => updateFormData('grade', grade)}
                    disabled={isLoading}
                  >
                    <Text
                      style={[
                        styles.gradeButtonText,
                        formData.grade === grade && styles.gradeButtonTextActive,
                      ]}
                    >
                      {grade}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Language Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Preferred Language</Text>
              {Config.LANGUAGES.map((lang) => (
                <TouchableOpacity
                  key={lang.value}
                  style={[
                    styles.languageOption,
                    formData.preferredLanguage === lang.value && styles.languageOptionActive,
                  ]}
                  onPress={() => updateFormData('preferredLanguage', lang.value)}
                  disabled={isLoading}
                >
                  <Text style={styles.languageFlag}>{lang.flag}</Text>
                  <Text
                    style={[
                      styles.languageText,
                      formData.preferredLanguage === lang.value && styles.languageTextActive,
                    ]}
                  >
                    {lang.label}
                  </Text>
                  {formData.preferredLanguage === lang.value && (
                    <Ionicons name="checkmark-circle" size={24} color={Colors.primary.solid} />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Subject Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Select Subjects</Text>
              <Text style={styles.helperText}>Choose at least one subject</Text>
              <View style={styles.subjectsContainer}>
                {Config.SUBJECTS.map((subject) => (
                  <TouchableOpacity
                    key={subject.value}
                    style={[
                      styles.subjectChip,
                      formData.subjects.includes(subject.value) && styles.subjectChipActive,
                    ]}
                    onPress={() => toggleSubject(subject.value)}
                    disabled={isLoading}
                  >
                    <Text
                      style={[
                        styles.subjectChipText,
                        formData.subjects.includes(subject.value) && styles.subjectChipTextActive,
                      ]}
                    >
                      {subject.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.subjects && <Text style={styles.errorText}>{errors.subjects}</Text>}
            </View>

            {/* Register Button */}
            <TouchableOpacity
              style={[styles.registerButton, isLoading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[Colors.success.start, Colors.success.end]}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Text style={styles.buttonText}>Create Account</Text>
                    <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}

        {/* Login Link */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')} disabled={isLoading}>
            <Text style={styles.loginLink}>Log In</Text>
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
    paddingBottom: 32,
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
    marginBottom: 24,
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
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  progressDotActive: {
    backgroundColor: '#FFFFFF',
  },
  progressLine: {
    width: 60,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 8,
  },
  progressLineActive: {
    backgroundColor: '#FFFFFF',
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
  helperText: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: 12,
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
  gradeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gradeButton: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradeButtonActive: {
    backgroundColor: Colors.primary.solid,
    borderColor: Colors.primary.solid,
  },
  gradeButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  gradeButtonTextActive: {
    color: '#FFFFFF',
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  languageOptionActive: {
    backgroundColor: Colors.card,
    borderColor: Colors.primary.solid,
  },
  languageFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  languageText: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  languageTextActive: {
    color: Colors.primary.solid,
    fontWeight: '600',
  },
  subjectsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  subjectChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  subjectChipActive: {
    backgroundColor: Colors.primary.solid,
    borderColor: Colors.primary.solid,
  },
  subjectChipText: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  subjectChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  nextButton: {
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 12,
    marginBottom: 20,
    shadowColor: Colors.primary.solid,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  registerButton: {
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 12,
    marginBottom: 20,
    shadowColor: Colors.success.solid,
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  loginText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  loginLink: {
    fontSize: 14,
    color: Colors.primary.solid,
    fontWeight: '600',
  },
});
