import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ConversationProvider } from "./contexts/ConversationContext";
import ErrorBoundary from "./components/common/ErrorBoundary";
import SkipToMain from "./components/common/SkipToMain";
import { PageSkeleton } from "./components/common/SkeletonLoader";

// Lazy load routes for code splitting (Module 10: Performance Optimization)
const LandingPage = lazy(() => import("./pages/LandingPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const VerifyEmailPage = lazy(() => import("./pages/VerifyEmailPage"));
const ChatPage = lazy(() => import("./pages/ChatPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <LanguageProvider>
            <ConversationProvider>
              <SkipToMain />
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: "#333",
                    color: "#fff",
                  },
                }}
              />
              <Suspense fallback={<PageSkeleton />}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/verify" element={<VerifyEmailPage />} />

                  {/* Protected Routes - Authentication Required */}
                  <Route
                    path="/chat"
                    element={
                      <ProtectedRoute>
                        <ChatPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </Suspense>
            </ConversationProvider>
          </LanguageProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
