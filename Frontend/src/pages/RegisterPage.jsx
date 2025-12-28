/**
 * Register Page
 * Module 2: Authentication System
 * 
 * Registration page with name, email, password, grade, and subjects
 * As specified in README.md Module 2
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, User, Mail, Lock, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const RegisterPage = () => {
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    grade: '',
    subjects: []
  });
  
  // Validation errors
  const [errors, setErrors] = useState({});
  
  // Loading state
  const [submitting, setSubmitting] = useState(false);

  // Grade options (5-10) as per README spec
  const grades = ['5', '6', '7', '8', '9', '10'];
  
  // Subject options as per README spec
  const subjects = ['Math', 'Science', 'Social Science', 'English', 'Hindi', 'Sanskrit'];

  /**
   * Handle input change
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  /**
   * Handle grade selection (README spec: single selection)
   */
  const handleGradeSelect = (grade) => {
    setFormData(prev => ({
      ...prev,
      grade
    }));
    
    if (errors.grade) {
      setErrors(prev => ({
        ...prev,
        grade: ''
      }));
    }
  };

  /**
   * Handle subject selection (README spec: multiple selection)
   */
  const handleSubjectToggle = (subject) => {
    setFormData(prev => {
      const subjects = prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject];
      
      return {
        ...prev,
        subjects
      };
    });
    
    if (errors.subjects) {
      setErrors(prev => ({
        ...prev,
        subjects: ''
      }));
    }
  };

  /**
   * Validate form (README spec)
   * - Name: min 3 chars
   * - Email: valid
   * - Password: min 6 chars
   * - Grade & ≥ 1 subject required
   */
  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Grade validation
    if (!formData.grade) {
      newErrors.grade = 'Please select your grade';
    }

    // Subjects validation
    if (formData.subjects.length === 0) {
      newErrors.subjects = 'Please select at least one subject';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submit (README spec)
   * - Call authService.register()
   * - On success → "Registration successful! Check email to verify."
   * - Redirect to /login after 3s
   * - On error → show toast
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      await register(
        formData.name,
        formData.email,
        formData.password,
        formData.grade,
        formData.subjects
      );
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 flex items-center justify-center p-4 relative">
      {/* Back to Landing Page Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 flex items-center space-x-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 z-20"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to Home</span>
      </button>

      <div className="w-full max-w-2xl p-10">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Create Your Account
          </h1>
          
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Start learning with AI
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name, Email, Password in a row (README layout) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Full Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full h-12 pl-10 pr-4 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                    placeholder="Your name"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full h-12 pl-10 pr-4 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                    placeholder="your@email.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full h-12 pl-10 pr-4 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                    placeholder="Min 6 characters"
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                )}
              </div>
            </div>

            {/* Grade Selector (README spec: pill buttons, single selection) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Select Grade (5–10)
              </label>
              <div className="flex flex-wrap gap-3">
                {grades.map((grade) => (
                  <button
                    key={grade}
                    type="button"
                    onClick={() => handleGradeSelect(grade)}
                    className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                      formData.grade === grade
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105'
                        : 'border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-500 dark:hover:border-blue-400'
                    }`}
                  >
                    Grade {grade}
                  </button>
                ))}
              </div>
              {errors.grade && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.grade}</p>
              )}
            </div>

            {/* Subject Selector (README spec: checkboxes, multiple selection) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Select Subjects
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {subjects.map((subject) => (
                  <label
                    key={subject}
                    className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      formData.subjects.includes(subject)
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.subjects.includes(subject)}
                      onChange={() => handleSubjectToggle(subject)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      {subject}
                    </span>
                  </label>
                ))}
              </div>
              {errors.subjects && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.subjects}</p>
              )}
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={submitting || isLoading}
              className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:scale-105 hover:shadow-lg transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {submitting || isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Register'
              )}
            </button>
          </form>

          {/* Already have account? Login (README spec) */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
          <p>By registering, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
