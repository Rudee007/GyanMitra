import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, BookOpen, Globe, GraduationCap, ArrowLeft, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import authService from '../services/authService';

const ProfilePage = () => {
  const { user: authUser, updateUser } = useAuth();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    grade: 5,
    subjects: [],
    preferredLanguage: 'english'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Grade options (backend expects number 5-10)
  const grades = [5, 6, 7, 8, 9, 10];
  
  // Subject options (display capitalized, send lowercase)
  const subjects = ['Math', 'Science', 'Social Science', 'English', 'Hindi', 'Sanskrit'];
  
  // Language options (display capitalized, send lowercase)
  const languages = ['English', 'Hindi', 'Marathi', 'Urdu'];

  /**
   * Fetch user profile on mount
   */
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      
      const result = await authService.getProfile();
      
      if (result.success && result.user) {
        setUser(result.user);
        
        // Set form data from fetched user
        setFormData({
          name: result.user.name || '',
          email: result.user.email || '',
          grade: result.user.grade || 5,
          subjects: result.user.subjects || [],
          preferredLanguage: result.user.preferredLanguage || 'english'
        });
      } else {
        toast.error('Failed to load profile');
      }
      
      setIsLoading(false);
    };

    fetchProfile();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubjectToggle = (subject) => {
    const subjectLower = subject.toLowerCase().replace(/\s+/g, '_');
    
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subjectLower)
        ? prev.subjects.filter(s => s !== subjectLower)
        : [...prev.subjects, subjectLower]
    }));
  };

  const handleSave = async () => {
    // Validation
    if (!formData.name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (formData.subjects.length === 0) {
      toast.error('Please select at least one subject');
      return;
    }

    setIsSaving(true);

    try {
      // Prepare updates (only send changed fields)
      const updates = {};
      
      if (formData.name !== user.name) {
        updates.name = formData.name;
      }
      
      if (formData.grade !== user.grade) {
        updates.grade = parseInt(formData.grade);
      }
      
      if (JSON.stringify(formData.subjects) !== JSON.stringify(user.subjects)) {
        updates.subjects = formData.subjects;
      }
      
      if (formData.preferredLanguage !== user.preferredLanguage) {
        updates.preferredLanguage = formData.preferredLanguage;
      }

      // Call API to update profile
      const result = await authService.updateProfile(updates);

      if (result.success) {
        // Update local user state
        setUser(result.user);
        
        // Update auth context
        updateUser(result.user);
        
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      } else {
        toast.error(result.error.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form to current user data
    setFormData({
      name: user.name || '',
      email: user.email || '',
      grade: user.grade || 5,
      subjects: user.subjects || [],
      preferredLanguage: user.preferredLanguage || 'english'
    });
    setIsEditing(false);
  };

  // Helper function to capitalize subject names for display
  const getDisplaySubject = (subject) => {
    if (subject === 'social_science') return 'Social Science';
    return subject.charAt(0).toUpperCase() + subject.slice(1);
  };

  // Helper function to capitalize language names for display
  const getDisplayLanguage = (lang) => {
    return lang.charAt(0).toUpperCase() + lang.slice(1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/5 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/5">
      {/* Decorative background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-emerald-500/5 to-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-4xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/chat')}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Chat</span>
          </button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
            Profile Settings
          </h1>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
        >
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-white">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30">
                  <User className="w-12 h-12" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-400 rounded-full border-4 border-white flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold">{formData.name || 'Student'}</h2>
                <p className="text-white/80">Grade {formData.grade}</p>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="p-8 space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                Personal Information
              </h3>
              {!isEditing && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg"
                >
                  Edit Profile
                </motion.button>
              )}
            </div>

            {/* Full Name */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <User className="w-4 h-4" />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-3 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 shadow-sm text-gray-800 dark:text-white disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <Mail className="w-4 h-4" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50 rounded-xl text-gray-600 dark:text-gray-400 cursor-not-allowed"
              />
            </div>

            {/* Grade */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <GraduationCap className="w-4 h-4" />
                <span>Grade</span>
              </label>
              <select
                value={formData.grade}
                onChange={(e) => handleInputChange('grade', parseInt(e.target.value))}
                disabled={!isEditing}
                className="w-full px-4 py-3 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 shadow-sm text-gray-800 dark:text-white disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {grades.map(grade => (
                  <option key={grade} value={grade}>Grade {grade}</option>
                ))}
              </select>
            </div>

            {/* Subjects */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                <BookOpen className="w-4 h-4" />
                <span>Subjects</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {subjects.map(subject => {
                  const subjectLower = subject.toLowerCase().replace(/\s+/g, '_');
                  const isSelected = formData.subjects.includes(subjectLower);
                  
                  return (
                    <motion.button
                      key={subject}
                      whileHover={{ scale: isEditing ? 1.05 : 1 }}
                      whileTap={{ scale: isEditing ? 0.95 : 1 }}
                      onClick={() => isEditing && handleSubjectToggle(subject)}
                      disabled={!isEditing}
                      className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                        isSelected
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      } ${!isEditing ? 'cursor-default' : 'cursor-pointer hover:shadow-lg'}`}
                    >
                      {subject}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Preferred Language */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <Globe className="w-4 h-4" />
                <span>Preferred Language</span>
              </label>
              <select
                value={formData.preferredLanguage}
                onChange={(e) => handleInputChange('preferredLanguage', e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-3 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 shadow-sm text-gray-800 dark:text-white disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {languages.map(lang => (
                  <option key={lang} value={lang.toLowerCase()}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="w-5 h-5" />
                  <span>Cancel</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5" />
                  <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                </motion.button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
