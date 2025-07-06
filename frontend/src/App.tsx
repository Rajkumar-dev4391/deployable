import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import { LoginPage } from './components/auth/LoginPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ChatLayout } from './components/chat/ChatLayout';
import { SettingsPage } from './components/settings/SettingsPage';
import { MCPWorkflowPage } from './components/workflow/MCPWorkflowPage';
import { PrivacyPolicy } from './components/legal/PrivacyPolicy';
import { TermsConditions } from './components/legal/TermsConditions';
import { useAuthStore } from './store/authStore';
import { authAPI } from './services/api';

// Auth Callback Handler Component
const AuthCallbackHandler: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { setUser, setToken } = useAuthStore();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const token = searchParams.get('token');
        const error = searchParams.get('error');

        if (error) {
          console.error('Auth callback error:', error);
          window.location.href = '/login?error=' + error;
          return;
        }

        if (token) {
          setToken(token);
          
          const response = await authAPI.checkAuth();
          
          if (response.data.authenticated && response.data.user) {
            setUser(response.data.user);
            window.location.href = '/chat';
          } else {
            window.location.href = '/login?error=auth_failed';
          }
        } else {
          window.location.href = '/login?error=no_token';
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        window.location.href = '/login?error=auth_failed';
      }
    };

    handleAuthCallback();
  }, [searchParams, setUser, setToken]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
};

function App() {
  const { isAuthenticated, isLoading, setLoading } = useAuthStore();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    
    if (error) {
      console.error('Auth error:', error);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    setLoading(false);
  }, [setLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? <Navigate to="/chat" replace /> : <LoginPage />
          } 
        />
        
        {/* Legal Pages */}
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsConditions />} />
        
        {/* Auth Callback Route */}
        <Route 
          path="/auth/callback" 
          element={<AuthCallbackHandler />} 
        />
        
        {/* Protected Routes */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatLayout />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/chat/:chatId"
          element={
            <ProtectedRoute>
              <ChatLayout />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/workflow"
          element={
            <ProtectedRoute>
              <MCPWorkflowPage />
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route 
          path="/" 
          element={
            <Navigate to={isAuthenticated ? "/chat" : "/login"} replace />
          } 
        />
        
        {/* Catch all route */}
        <Route 
          path="*" 
          element={
            <Navigate to={isAuthenticated ? "/chat" : "/login"} replace />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;