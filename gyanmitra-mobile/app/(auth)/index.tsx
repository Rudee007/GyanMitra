// app/(auth)/index.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

const { width, height } = Dimensions.get('window');

// Golden Ratio constant
const PHI = 1.618;
const BASE_UNIT = 8; // Base unit for spacing

export default function AuthEntryScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Soft gradient background */}
      <LinearGradient
        colors={[Colors.professional.bgTop, Colors.professional.bgBottom]}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo and Title Section */}
        <View style={styles.headerSection}>
          {/* Logo with icon */}
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={[Colors.professional.blue, Colors.professional.blueLight]}
              style={styles.logoGradient}
            >
              <Ionicons name="book" size={BASE_UNIT * PHI * 3} color="white" />
            </LinearGradient>
          </View>
          
          {/* Title with two-tone color */}
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: Colors.professional.blue }]}>Gyan</Text>
            <Text style={[styles.title, { color: Colors.professional.orange }]}>Mitra</Text>
          </View>
          
          <Text style={styles.subtitle}>Your Smart Study Friend</Text>
          
          {/* Trust badge */}
          <View style={styles.trustBadge}>
            <Ionicons name="shield-checkmark" size={BASE_UNIT * 1.5} color={Colors.professional.blue} />
            <Text style={styles.trustText}>NCERT Aligned</Text>
          </View>
        </View>

        {/* Feature Cards Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.featuresSectionTitle}>WHY STUDENTS LOVE US</Text>
          
          {/* Feature Card 1 */}
          <View style={[styles.featureCard, styles.featureCardShadow]}>
            <View style={[styles.iconCircle, { backgroundColor: Colors.professional.orangeLight }]}>
              <Ionicons name="flash" size={BASE_UNIT * PHI * 1.5} color={Colors.professional.orange} />
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Get Instant Solutions</Text>
              <Text style={styles.featureSubtext}>AI-powered answers from NCERT</Text>
            </View>
          </View>

          {/* Feature Card 2 */}
          <View style={[styles.featureCard, styles.featureCardShadow]}>
            <View style={[styles.iconCircle, { backgroundColor: Colors.professional.blueLight }]}>
              <Ionicons name="book-outline" size={BASE_UNIT * PHI * 1.5} color={Colors.professional.blue} />
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Perfectly Cited Answers</Text>
              <Text style={styles.featureSubtext}>With exact page numbers</Text>
            </View>
          </View>

          {/* Feature Card 3 */}
          <View style={[styles.featureCard, styles.featureCardShadow]}>
            <View style={[styles.iconCircle, { backgroundColor: Colors.professional.purpleLight }]}>
              <Ionicons name="language-outline" size={BASE_UNIT * PHI * 1.5} color={Colors.professional.purple} />
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Learn in Your Language</Text>
              <Text style={styles.featureSubtext}>Hindi, English & more</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={[styles.primaryButton, styles.buttonShadow]}
            onPress={() => router.push('/(auth)/register')}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[Colors.professional.orange, Colors.professional.orangeDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.primaryButtonText}>Get Started</Text>
              <Ionicons name="arrow-forward" size={BASE_UNIT * PHI * 1.25} color="white" style={styles.buttonIcon} />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push('/(auth)/login')}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-forward-circle-outline" size={BASE_UNIT * PHI * 1.25} color={Colors.professional.blue} />
            <Text style={styles.secondaryButtonText}>I already have an account</Text>
          </TouchableOpacity>
        </View>

        {/* Social Proof - Moved to bottom */}
        <View style={styles.socialProof}>
          <Ionicons name="star" size={BASE_UNIT * PHI} color={Colors.professional.orange} />
          <Text style={styles.socialProofText}>
            4.8 • Trusted by 50,000+ students
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: BASE_UNIT * 3, // 24px (8 × 3)
    paddingTop: height * 0.06,
    paddingBottom: BASE_UNIT * PHI * 2, // ~25.9px
  },
  
  // Header Section - Golden Ratio Applied
  headerSection: {
    alignItems: 'center',
    marginBottom: BASE_UNIT * PHI * 2, // ~25.9px
  },
  logoContainer: {
    width: BASE_UNIT * PHI * PHI * 5, // ~104px (using φ²)
    height: BASE_UNIT * PHI * PHI * 5,
    marginBottom: BASE_UNIT * PHI, // ~12.9px
    shadowColor: Colors.professional.blue,
    shadowOffset: { width: 0, height: BASE_UNIT / 2 },
    shadowOpacity: 0.15,
    shadowRadius: BASE_UNIT,
    elevation: 6,
  },
  logoGradient: {
    width: '100%',
    height: '100%',
    borderRadius: BASE_UNIT * PHI * PHI * 2.5, // Half of container
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  titleContainer: {
    flexDirection: 'row',
  },
  title: {
    fontSize: BASE_UNIT * PHI * PHI * 1.5, // ~31.2px
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: BASE_UNIT * 0.75, // 6px
  },
  subtitle: {
    fontSize: BASE_UNIT * PHI, // ~12.9px
    color: Colors.text.secondary,
    fontWeight: '500',
    marginBottom: BASE_UNIT * 1.25, // 10px
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.professional.blueLight,
    paddingHorizontal: BASE_UNIT * 1.25, // 10px
    paddingVertical: BASE_UNIT * 0.625, // 5px
    borderRadius: BASE_UNIT * 2, // 16px
    gap: BASE_UNIT / 2, // 4px
  },
  trustText: {
    fontSize: BASE_UNIT * 1.375, // 11px
    color: Colors.professional.blue,
    fontWeight: '600',
  },

  // Features Section - Golden Ratio Spacing
  featuresSection: {
    marginBottom: BASE_UNIT * PHI * 1.5, // ~19.4px
  },
  featuresSectionTitle: {
    fontSize: BASE_UNIT * 1.375, // 11px
    fontWeight: '600',
    color: Colors.text.secondary,
    letterSpacing: 0.8,
    marginBottom: BASE_UNIT * 1.5, // 12px
    textAlign: 'center',
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: BASE_UNIT * PHI, // ~12.9px
    borderRadius: BASE_UNIT * PHI, // ~12.9px
    marginBottom: BASE_UNIT, // 8px
  },
  featureCardShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: BASE_UNIT / 2,
    elevation: 2,
  },
  iconCircle: {
    width: BASE_UNIT * PHI * 3, // ~38.8px
    height: BASE_UNIT * PHI * 3,
    borderRadius: BASE_UNIT * PHI * 1.5, // Half of width
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: BASE_UNIT * 1.5, // 12px
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: BASE_UNIT * 1.75, // 14px
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: BASE_UNIT / 4, // 2px
  },
  featureSubtext: {
    fontSize: BASE_UNIT * 1.375, // 11px
    color: Colors.text.secondary,
    fontWeight: '400',
  },

  // Action Buttons - Golden Ratio
  actionSection: {
    marginBottom: BASE_UNIT * 2, // 16px
  },
  primaryButton: {
    borderRadius: BASE_UNIT * 1.5, // 12px
    marginBottom: BASE_UNIT * 1.5, // 12px
    overflow: 'hidden',
  },
  buttonShadow: {
    shadowColor: Colors.professional.orange,
    shadowOffset: { width: 0, height: BASE_UNIT / 2 },
    shadowOpacity: 0.2,
    shadowRadius: BASE_UNIT,
    elevation: 5,
  },
  buttonGradient: {
    flexDirection: 'row',
    paddingVertical: BASE_UNIT * PHI, // ~12.9px
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: BASE_UNIT * 2, // 16px
    fontWeight: '700',
    color: 'white',
  },
  buttonIcon: {
    marginLeft: BASE_UNIT * 0.75, // 6px
  },
  secondaryButton: {
    flexDirection: 'row',
    paddingVertical: BASE_UNIT * 1.5, // 12px
    alignItems: 'center',
    justifyContent: 'center',
    gap: BASE_UNIT * 0.75, // 6px
  },
  secondaryButtonText: {
    fontSize: BASE_UNIT * 1.75, // 14px
    color: Colors.professional.blue,
    fontWeight: '600',
  },

  // Social Proof - At Bottom with Golden Ratio
  socialProof: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: BASE_UNIT * PHI, // ~12.9px
    gap: BASE_UNIT / 2, // 4px
  },
  socialProofText: {
    fontSize: BASE_UNIT * 1.375, // 11px
    color: Colors.text.secondary,
    fontWeight: '500',
  },
});
