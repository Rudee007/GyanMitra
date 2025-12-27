// components/chat/SubjectSelector.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import Config from '@/constants/Config';

interface SubjectSelectorProps {
  currentSubject: string;
  currentGrade: number;
  onSubjectChange: (subject: string) => void;
}

const SUBJECT_ICONS: Record<string, { icon: string; color: string }> = {
  math: { icon: 'calculator', color: '#2196F3' },
  science: { icon: 'flask', color: '#4CAF50' },
  social_science: { icon: 'globe', color: '#FF9800' },
  english: { icon: 'book', color: '#9C27B0' },
  hindi: { icon: 'language', color: '#F44336' },
  sanskrit: { icon: 'leaf', color: '#FF6F00' },
};

export default function SubjectSelector({
  currentSubject,
  currentGrade,
  onSubjectChange,
}: SubjectSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentSubjectData = Config.SUBJECTS.find(s => s.value === currentSubject);
  const subjectIcon = SUBJECT_ICONS[currentSubject] || { icon: 'book', color: Colors.primary.solid };

  const handleSubjectSelect = (subject: string) => {
    onSubjectChange(subject);
    setIsOpen(false);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.trigger}
        onPress={() => setIsOpen(true)}
        activeOpacity={0.7}
      >
        <View style={styles.triggerContent}>
          <View style={[styles.iconCircle, { backgroundColor: subjectIcon.color + '20' }]}>
            <Ionicons name={subjectIcon.icon as any} size={20} color={subjectIcon.color} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.label}>Grade {currentGrade}</Text>
            <Text style={styles.subject}>{currentSubjectData?.label || 'Select Subject'}</Text>
          </View>
          <Ionicons name="chevron-down" size={20} color={Colors.text.secondary} />
        </View>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Subject</Text>
              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <Ionicons name="close" size={24} color={Colors.text.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.subjectsList}>
              {Config.SUBJECTS.map((subject) => {
                const icon = SUBJECT_ICONS[subject.value] || { icon: 'book', color: Colors.primary.solid };
                const isSelected = subject.value === currentSubject;

                return (
                  <TouchableOpacity
                    key={subject.value}
                    style={[
                      styles.subjectItem,
                      isSelected && styles.subjectItemSelected,
                    ]}
                    onPress={() => handleSubjectSelect(subject.value)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.subjectIcon, { backgroundColor: icon.color + '20' }]}>
                      <Ionicons name={icon.icon as any} size={24} color={icon.color} />
                    </View>
                    <Text style={[styles.subjectLabel, isSelected && styles.subjectLabelSelected]}>
                      {subject.label}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={24} color={Colors.primary.solid} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: Colors.shadow.color,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  triggerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  subject: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  subjectsList: {
    padding: 16,
  },
  subjectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  subjectItemSelected: {
    borderColor: Colors.primary.solid,
    backgroundColor: Colors.card,
  },
  subjectIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  subjectLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  subjectLabelSelected: {
    fontWeight: '600',
    color: Colors.primary.solid,
  },
});
