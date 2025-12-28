// src/pages/VerifyEmail.jsx

import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axiosInstance from '../lib/axiosInstance';
import toast from 'react-hot-toast';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth(); // Use login from auth context
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    verifyEmail();
  }, []);

  const verifyEmail = async () => {
    try {
      const token = searchParams.get('token');

      if (!token) {
        setStatus('error');
        setMessage('No verification token provided');
        toast.error('No verification token provided');
        return;
      }

      console.log('[VerifyEmail] Attempting verification with token:', token.substring(0, 20) + '...');

      // Call backend verification endpoint
      const response = await axiosInstance.get(`/auth/verify-email?token=${token}`);

      if (response.data.success) {
        console.log('[VerifyEmail] Verification successful:', response.data);

        // ✅ Store token in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // ✅ Set axios default header
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

        // ✅ Update auth context
        if (login) {
          login(response.data.token, response.data.user);
        }

        setStatus('success');
        setMessage(response.data.message);
        toast.success('Email verified! Redirecting...');

        // ✅ Redirect to home after 2 seconds
        setTimeout(() => {
          navigate('/home');
        }, 2000);

      } else {
        setStatus('error');
        setMessage(response.data.error || 'Verification failed');
        toast.error('Verification failed');
      }

    } catch (error) {
      console.error('[VerifyEmail] Error:', error);
      setStatus('error');
      setMessage(error.response?.data?.error || 'Something went wrong. Please try again.');
      toast.error('Verification error');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
        
        {status === 'verifying' && (
          <div className="text-center">
            <Loader className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Verifying Email
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Please wait while we verify your email...
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Email Verified! ✅
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {message}
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to home page in 2 seconds...
            </p>
            <div className="mt-6 flex justify-center">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce mx-2" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Verification Failed ❌
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {message}
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/signup')}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate('/login')}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                Go to Login
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default VerifyEmail;
