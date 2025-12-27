// app/(tabs)/profile.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import userService from '@/services/userService';
import Config from '@/constants/Config';
import Colors from '@/constants/Colors';

export default function ProfileScreen() {
  const { user, logout, updateUser } = useAuth();
  
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showSubjectsModal, setShowSubjectsModal] = useState(false);
  
  const [selectedGrade, setSelectedGrade] = useState(user?.grade || 8);
  const [selectedLanguage, setSelectedLanguage] = useState(user?.preferredLanguage || 'english');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(user?.subjects || []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const updatedUser = await userService.getProfile();
      await updateUser(updatedUser);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to refresh profile');
    } finally {
      setRefreshing(false);
    }
  };

  const handleUpdateGrade = async () => {
    setIsLoading(true);
    try {
      const updatedUser = await userService.updateProfile({ grade: selectedGrade });
      await updateUser(updatedUser);
      setShowGradeModal(false);
      Alert.alert('Success', 'Grade updated successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update grade');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateLanguage = async () => {
    setIsLoading(true);
    try {
      const updatedUser = await userService.updateProfile({ preferredLanguage: selectedLanguage });
      await updateUser(updatedUser);
      setShowLanguageModal(false);
      Alert.alert('Success', 'Language updated successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update language');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSubjects = async () => {
    if (selectedSubjects.length === 0) {
      Alert.alert('Error', 'Please select at least one subject');
      return;
    }

    setIsLoading(true);
    try {
      const updatedUser = await userService.updateProfile({ subjects: selectedSubjects });
      await updateUser(updatedUser);
      setShowSubjectsModal(false);
      Alert.alert('Success', 'Subjects updated successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update subjects');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSubject = (subjectValue: string) => {
    if (selectedSubjects.includes(subjectValue)) {
      setSelectedSubjects(selectedSubjects.filter(s => s !== subjectValue));
    } else {
      setSelectedSubjects([...selectedSubjects, subjectValue]);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure? You will need to log in again.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            }
          },
        },
      ]
    );
  };

  const getSubjectNames = () => {
    if (!user?.subjects || user.subjects.length === 0) return 'Select subjects';
    return Config.SUBJECTS
      .filter(s => user.subjects.includes(s.value))
      .map(s => s.label)
      .join(', ');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#6366F1', '#8B5CF6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>My Profile</Text>
        <Text style={styles.headerSubtitle}>Manage your account settings</Text>
      </LinearGradient>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#6366F1']}
            tintColor="#6366F1"
          />
        }
      >
        {/* User Info Card */}
        <View style={styles.userCard}>
          <View style={styles.userCardContent}>
            <View style={styles.userNameContainer}>
              <Text style={styles.userName}>{user?.name}</Text>
              {user?.verified && (
                <MaterialCommunityIcons 
                  name="check-circle" 
                  size={20} 
                  color="#10B981" 
                />
              )}
            </View>
            
            <View style={styles.emailContainer}>
              <MaterialCommunityIcons 
                name="email-outline" 
                size={16} 
                color="#9CA3AF" 
              />
              <Text style={styles.userEmail}>{user?.email}</Text>
            </View>

            {user?.verified && (
              <View style={styles.verifiedBadge}>
                <MaterialCommunityIcons 
                  name="shield-check" 
                  size={14} 
                  color="#FFFFFF" 
                />
                <Text style={styles.verifiedText}>Verified Account</Text>
              </View>
            )}
          </View>
        </View>

        {/* Academic Settings Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons 
              name="book-open-page-variant" 
              size={24} 
              color="#6366F1" 
            />
            <Text style={styles.sectionTitle}>Academic Settings</Text>
          </View>

          {/* Grade Card */}
          <TouchableOpacity
            style={styles.settingCard}
            onPress={() => {
              setSelectedGrade(user?.grade || 8);
              setShowGradeModal(true);
            }}
            activeOpacity={0.6}
          >
            <View style={styles.settingIconContainer}>
              <MaterialCommunityIcons 
                name="school" 
                size={24} 
                color="#6366F1" 
              />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Grade Level</Text>
              <Text style={styles.settingValue}>{user?.grade}</Text>
            </View>
            <MaterialCommunityIcons 
              name="chevron-right" 
              size={24} 
              color="#D1D5DB" 
            />
          </TouchableOpacity>

          {/* Language Card */}
          <TouchableOpacity
            style={styles.settingCard}
            onPress={() => {
              setSelectedLanguage(user?.preferredLanguage || 'english');
              setShowLanguageModal(true);
            }}
            activeOpacity={0.6}
          >
            <View style={styles.settingIconContainer}>
              <MaterialCommunityIcons 
                name="globe-model" 
                size={24} 
                color="#8B5CF6" 
              />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Preferred Language</Text>
              <Text style={styles.settingValue}>
                {user?.preferredLanguage === 'english' ? 'English' : 'हिंदी'}
              </Text>
            </View>
            <MaterialCommunityIcons 
              name="chevron-right" 
              size={24} 
              color="#D1D5DB" 
            />
          </TouchableOpacity>

          {/* Subjects Card */}
          <TouchableOpacity
            style={[styles.settingCard, styles.settingCardLast]}
            onPress={() => {
              setSelectedSubjects(user?.subjects || []);
              setShowSubjectsModal(true);
            }}
            activeOpacity={0.6}
          >
            <View style={styles.settingIconContainer}>
              <MaterialCommunityIcons 
                name="notebook-multiple" 
                size={24} 
                color="#EC4899" 
              />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Subjects</Text>
              <Text 
                style={styles.settingValue} 
                numberOfLines={1}
              >
                {getSubjectNames()}
              </Text>
            </View>
            <MaterialCommunityIcons 
              name="chevron-right" 
              size={24} 
              color="#D1D5DB" 
            />
          </TouchableOpacity>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons 
              name="cog" 
              size={24} 
              color="#6366F1" 
            />
            <Text style={styles.sectionTitle}>Account</Text>
          </View>

          <TouchableOpacity
            style={styles.dangerCard}
            onPress={handleLogout}
            activeOpacity={0.6}
          >
            <View style={styles.dangerIconContainer}>
              <MaterialCommunityIcons 
                name="logout-variant" 
                size={24} 
                color="#EF4444" 
              />
            </View>
            <View style={styles.dangerContent}>
              <Text style={styles.dangerLabel}>Logout</Text>
              <Text style={styles.dangerDescription}>
                Sign out from this device
              </Text>
            </View>
            <MaterialCommunityIcons 
              name="chevron-right" 
              size={24} 
              color="#FCA5A5" 
            />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Grade Modal */}
      <Modal
        visible={showGradeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowGradeModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modal}>
            <View style={styles.modalHandle} />
            
            <Text style={styles.modalTitle}>Select Grade</Text>
            <Text style={styles.modalDescription}>
              Choose your current grade level
            </Text>
            
            <View style={styles.gradeGrid}>
              {Config.GRADES.map((grade) => (
                <TouchableOpacity
                  key={grade}
                  style={[
                    styles.gradeButton,
                    selectedGrade === grade && styles.gradeButtonActive
                  ]}
                  onPress={() => setSelectedGrade(grade)}
                >
                  <Text style={[
                    styles.gradeButtonText,
                    selectedGrade === grade && styles.gradeButtonTextActive
                  ]}>
                    {String(grade)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.buttonSecondary}
                onPress={() => setShowGradeModal(false)}
              >
                <Text style={styles.buttonSecondaryText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.buttonPrimary}
                onPress={handleUpdateGrade}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.buttonPrimaryText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Language Modal */}
      <Modal
        visible={showLanguageModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modal}>
            <View style={styles.modalHandle} />
            
            <Text style={styles.modalTitle}>Preferred Language</Text>
            <Text style={styles.modalDescription}>
              Choose how you want to learn
            </Text>
            
            <View style={styles.languageList}>
              {/* English */}
              <TouchableOpacity
                style={[
                  styles.languageButton,
                  selectedLanguage === 'english' && styles.languageButtonActive
                ]}
                onPress={() => setSelectedLanguage('english')}
              >
                <View style={styles.languageContent}>
                  <View style={[
                    styles.languageBadge,
                    selectedLanguage === 'english' && styles.languageBadgeActive
                  ]}>
                    <Text style={[
                      styles.languageBadgeText,
                      selectedLanguage === 'english' && styles.languageBadgeTextActive
                    ]}>
                      EN
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.languageName}>English</Text>
                    <Text style={styles.languageSubtext}>Primary Language</Text>
                  </View>
                </View>
                {selectedLanguage === 'english' && (
                  <View style={styles.checkmark}>
                    <MaterialCommunityIcons 
                      name="check" 
                      size={20} 
                      color="#FFFFFF" 
                    />
                  </View>
                )}
              </TouchableOpacity>

              {/* Hindi */}
              <TouchableOpacity
                style={[
                  styles.languageButton,
                  selectedLanguage === 'hindi' && styles.languageButtonActive
                ]}
                onPress={() => setSelectedLanguage('hindi')}
              >
                <View style={styles.languageContent}>
                  <View style={[
                    styles.languageBadge,
                    selectedLanguage === 'hindi' && styles.languageBadgeActive
                  ]}>
                    <Text style={[
                      styles.languageBadgeText,
                      selectedLanguage === 'hindi' && styles.languageBadgeTextActive
                    ]}>
                      HI
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.languageName}>हिंदी</Text>
                    <Text style={styles.languageSubtext}>Hindi Language</Text>
                  </View>
                </View>
                {selectedLanguage === 'hindi' && (
                  <View style={styles.checkmark}>
                    <MaterialCommunityIcons 
                      name="check" 
                      size={20} 
                      color="#FFFFFF" 
                    />
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.buttonSecondary}
                onPress={() => setShowLanguageModal(false)}
              >
                <Text style={styles.buttonSecondaryText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.buttonPrimary}
                onPress={handleUpdateLanguage}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.buttonPrimaryText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Subjects Modal */}
      <Modal
        visible={showSubjectsModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSubjectsModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modal}>
            <View style={styles.modalHandle} />
            
            <Text style={styles.modalTitle}>Choose Subjects</Text>
            <Text style={styles.modalDescription}>
              Select at least one subject to continue
            </Text>
            
            <View style={styles.subjectsList}>
              {Config.SUBJECTS.map((subject) => (
                <TouchableOpacity
                  key={subject.value}
                  style={[
                    styles.subjectButton,
                    selectedSubjects.includes(subject.value) && styles.subjectButtonActive
                  ]}
                  onPress={() => toggleSubject(subject.value)}
                >
                  <View style={[
                    styles.checkbox,
                    selectedSubjects.includes(subject.value) && styles.checkboxActive
                  ]}>
                    {selectedSubjects.includes(subject.value) && (
                      <MaterialCommunityIcons 
                        name="check" 
                        size={16} 
                        color="#FFFFFF" 
                      />
                    )}
                  </View>
                  <Text style={styles.subjectName}>{subject.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.buttonSecondary}
                onPress={() => setShowSubjectsModal(false)}
              >
                <Text style={styles.buttonSecondaryText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.buttonPrimary}
                onPress={handleUpdateSubjects}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.buttonPrimaryText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingBottom: 40,
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  userCardContent: {
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  userNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  userName: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  userEmail: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '500',
    flex: 1,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  verifiedText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#047857',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  settingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  settingCardLast: {
    marginBottom: 0,
  },
  settingIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  settingValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  dangerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FEE2E2',
  },
  dangerIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  dangerContent: {
    flex: 1,
  },
  dangerLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
  },
  dangerDescription: {
    fontSize: 13,
    color: '#F87171',
    marginTop: 2,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 24,
    fontWeight: '500',
  },
  gradeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 28,
    justifyContent: 'space-between',
  },
  gradeButton: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradeButtonActive: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  gradeButtonText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#9CA3AF',
    textAlign: 'center',
    textAlignVertical: 'center',
    lineHeight: 32,
    includeFontPadding: false,
  },
  gradeButtonTextActive: {
    color: '#FFFFFF',
  },
  languageList: {
    marginBottom: 28,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  languageButtonActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#6366F1',
  },
  languageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  languageBadge: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#C7D2FE',
  },
  languageBadgeActive: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  languageBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6366F1',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  languageBadgeTextActive: {
    color: '#FFFFFF',
  },
  languageName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  languageSubtext: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 2,
    fontWeight: '400',
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subjectsList: {
    marginBottom: 28,
  },
  subjectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  subjectButtonActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#6366F1',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxActive: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  buttonSecondary: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  buttonSecondaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  buttonPrimary: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonPrimaryText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
