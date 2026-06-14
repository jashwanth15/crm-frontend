import React, { useState } from 'react';
import axios from 'axios';
import { Eye, EyeOff, ArrowRight, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login({ onLogin, onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [isForgotMode, setIsForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');
  const [forgotPreviewUrl, setForgotPreviewUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) return setError('Email address is required');
    if (!password) return setError('Password is required');
    setIsLoading(true);
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      onLogin();
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setForgotMessage('');
    setForgotPreviewUrl('');

    if (!forgotEmail.trim()) return setError('Email address is required');
    setIsLoading(true);
    try {
      const response = await axios.post('/api/auth/forgot-password', { email: forgotEmail });
      setForgotMessage(response.data.message);
      if (response.data.previewUrl) {
        setForgotPreviewUrl(response.data.previewUrl);
      }
      toast.success('Reset link sent!');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send reset link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #e8edf5 50%, #f5f0ff 100%)' }}>
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)' }} />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }} />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-gray-300/40 border border-gray-100/80 px-8 py-10 sm:px-10 sm:py-12">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-1">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <span className="text-white font-extrabold text-2xl tracking-tight">X</span>
              </div>
            </div>
          </div>

          {isForgotMode ? (
            <>
              {/* Heading */}
              <div className="text-center mb-8">
                <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Reset Password</h1>
                <p className="mt-2 text-sm text-gray-500">Enter your email and we'll send you a password reset link</p>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-6 text-sm text-red-700 bg-red-50 p-3.5 rounded-xl border border-red-100 flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                    <span className="text-red-600 text-xs font-bold">!</span>
                  </div>
                  {error}
                </div>
              )}

              {/* Success Message */}
              {forgotMessage && (
                <div className="mb-6 text-sm text-green-700 bg-green-50 p-4 rounded-xl border border-green-100 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <span className="text-green-600 text-xs font-bold">✓</span>
                    </div>
                    {forgotMessage}
                  </div>
                  {forgotPreviewUrl && (
                    <div className="pt-2">
                      <a 
                        href={forgotPreviewUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-bold bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                      >
                        Open Ethereal Mailbox 📬
                      </a>
                    </div>
                  )}
                </div>
              )}

              <form className="space-y-5" onSubmit={handleForgotSubmit} noValidate>
                {/* Email */}
                <div>
                  <label htmlFor="forgot-email" className="block text-sm font-semibold text-gray-800 mb-2">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Mail size={16} className="text-gray-400" />
                    </div>
                    <input
                      id="forgot-email"
                      type="email"
                      required
                      placeholder="m@example.com"
                      className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-200"
                      value={forgotEmail}
                      onChange={e => setForgotEmail(e.target.value)}
                    />
                  </div>
                </div>

                {/* Send Button */}
                <button
                  disabled={isLoading}
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0"
                  style={{ background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #3b82f6 100%)' }}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending link...
                    </>
                  ) : (
                    <>
                      Send Reset Link
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              {/* Back Link */}
              <div className="mt-8 text-center">
                <button
                  onClick={() => {
                    setIsForgotMode(false);
                    setError('');
                    setForgotMessage('');
                    setForgotPreviewUrl('');
                  }}
                  className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Back to Login
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Heading */}
              <div className="text-center mb-8">
                <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Login to XENO</h1>
                <p className="mt-2 text-sm text-gray-500">Enter your credentials below to login to your account</p>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-6 text-sm text-red-700 bg-red-50 p-3.5 rounded-xl border border-red-100 flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                    <span className="text-red-600 text-xs font-bold">!</span>
                  </div>
                  {error}
                </div>
              )}

              <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                {/* Email */}
                <div>
                  <label htmlFor="login-email" className="block text-sm font-semibold text-gray-800 mb-2">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Mail size={16} className="text-gray-400" />
                    </div>
                    <input
                      id="login-email"
                      type="email"
                      required
                      placeholder="m@example.com"
                      className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-200"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="login-password" className="block text-sm font-semibold text-gray-800">Password</label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotMode(true);
                        setError('');
                      }}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Lock size={16} className="text-gray-400" />
                    </div>
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Your password"
                      className="block w-full pl-10 pr-11 py-3 border border-gray-200 rounded-xl bg-gray-50/50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-200"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Login Button */}
                <button
                  disabled={isLoading}
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0"
                  style={{ background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #3b82f6 100%)' }}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Login
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              {/* Footer */}
              <div className="mt-8 text-center">
                <span className="text-sm text-gray-500">Don't have an account? </span>
                <button
                  onClick={() => onNavigate('signup')}
                  className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Create Account
                </button>
              </div>
            </>
          )}
        </div>

        {/* Bottom branding */}
        <p className="text-center text-xs text-gray-400 mt-6">
          &copy; {new Date().getFullYear()} XENO CRM &middot; AI-Native Marketing Platform
        </p>
      </div>
    </div>
  );
}
