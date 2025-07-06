import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { authAPI } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../config/supabase';

interface Feedback {
  id: string;
  user_name: string;
  user_image: string;
  message: string;
  rating: number;
  created_at: string;
}

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [currentFeedbackIndex, setCurrentFeedbackIndex] = useState(0);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser, isAuthenticated } = useAuthStore();

  // Load feedback data from Supabase
  useEffect(() => {
    loadFeedback();
  }, []);

  // Auto-rotate feedback every 5 seconds
  useEffect(() => {
    if (feedbacks.length > 0) {
      const interval = setInterval(() => {
        setCurrentFeedbackIndex((prev) => (prev + 1) % feedbacks.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [feedbacks.length]);

  const loadFeedback = async () => {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error loading feedback:', error);
      } else {
        setFeedbacks(data || []);
      }
    } catch (error) {
      console.error('Error loading feedback:', error);
    }
  };

  // Handle OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const error = urlParams.get('error');
    
    if (success === 'true') {
      checkAuthStatus();
    } else if (error) {
      setError(decodeURIComponent(error));
      window.history.replaceState({}, document.title, '/login');
    }
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await authAPI.checkAuth();
      if (response.data.authenticated && response.data.user) {
        setUser(response.data.user);
        const redirectPath = localStorage.getItem('redirect_after_auth') || '/chat';
        localStorage.removeItem('redirect_after_auth');
        navigate(redirectPath);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await authAPI.login({ email, password });
      
      if (response.data.user) {
        setUser(response.data.user);
        const from = location.state?.from?.pathname || '/chat';
        navigate(from, { replace: true });
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError('');
      authAPI.googleLogin();
    } catch (error: any) {
      console.error('Google login failed:', error);
      setError('Google login failed. Please try again.');
      setIsLoading(false);
    }
  };

  const nextFeedback = () => {
    setCurrentFeedbackIndex((prev) => (prev + 1) % feedbacks.length);
  };

  const prevFeedback = () => {
    setCurrentFeedbackIndex((prev) => (prev - 1 + feedbacks.length) % feedbacks.length);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  if (isAuthenticated) {
    navigate('/chat', { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - Welcome message and feedback carousel */}
      <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-6 lg:p-12 relative overflow-hidden">
        <div className="max-w-md z-10 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start mb-8">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center mr-3">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            <span className="text-xl font-semibold text-gray-900">MCP Chat Bot</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            Welcome to MCP Chat Bot
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            Sign in to experience our AI-powered conversational tools with seamless Google Workspace integration.
          </p>

          {/* User Feedback Carousel */}
          {feedbacks.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 relative">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                What our users say
              </h3>
              
              <div className="relative min-h-[200px] flex items-center">
                <button
                  onClick={prevFeedback}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  disabled={feedbacks.length <= 1}
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>

                <div className="mx-8 text-center">
                  <div className="flex justify-center mb-4">
                    <img
                      src={feedbacks[currentFeedbackIndex]?.user_image}
                      alt={feedbacks[currentFeedbackIndex]?.user_name}
                      className="w-16 h-16 rounded-full object-cover border-4 border-gray-200"
                    />
                  </div>
                  
                  <div className="flex justify-center mb-3">
                    {renderStars(feedbacks[currentFeedbackIndex]?.rating || 5)}
                  </div>
                  
                  <p className="text-gray-700 italic mb-4 min-h-[60px] flex items-center justify-center">
                    "{feedbacks[currentFeedbackIndex]?.message}"
                  </p>
                  
                  <p className="font-semibold text-gray-900">
                    {feedbacks[currentFeedbackIndex]?.user_name}
                  </p>
                </div>

                <button
                  onClick={nextFeedback}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  disabled={feedbacks.length <= 1}
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Dots indicator */}
              <div className="flex justify-center space-x-2 mt-4">
                {feedbacks.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentFeedbackIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentFeedbackIndex ? 'bg-gray-900' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Abstract lines */}
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <svg className="absolute -top-40 -right-40 w-96 h-96 text-gray-200" viewBox="0 0 400 400" fill="none">
            <path d="M50 200 Q 200 50 350 200 Q 200 350 50 200" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.3"/>
            <path d="M80 200 Q 200 80 320 200 Q 200 320 80 200" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.4"/>
            <path d="M110 200 Q 200 110 290 200 Q 200 290 110 200" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5"/>
          </svg>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in with your Google account to continue</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Google Sign In Button */}
          <div className="mb-6">
            <Button
              onClick={handleGoogleLogin}
              className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
              size="lg"
              loading={isLoading}
              disabled={isLoading}
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">OR</span>
            </div>
          </div>

          {/* Email/Password Form (for demo purposes) */}
          <form onSubmit={handleEmailLogin} className="space-y-6">
            <Input
              label="Email"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-5 h-5 text-gray-400" />}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-5 h-5 text-gray-400" />}
              required
            />

            <Button
              type="submit"
              className="w-full"
              loading={isLoading}
              size="lg"
              disabled={isLoading}
            >
              Sign in with Email
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <span className="font-medium text-gray-900">
              Sign up with Google above
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};