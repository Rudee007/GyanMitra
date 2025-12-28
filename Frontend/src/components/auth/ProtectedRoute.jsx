/**
 * Protected Route Component
 * Module 2: Authentication System
 * 
 * Protects routes that require authentication
 * Redirects to /login if not authenticated (README spec)
 */

import { Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()

  // ✅ Check if dev mode is enabled
  const DEV_MODE = import.meta.env.VITE_DEV_MODE === 'true'

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  // ✅ Allow access in development mode (bypass auth)
  if (DEV_MODE) {
    if (import.meta.env.DEV) {
      console.log('🔓 DEV MODE: Bypassing authentication')
    }
    return children
  }

  // Redirect to login if not authenticated (README spec)
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
