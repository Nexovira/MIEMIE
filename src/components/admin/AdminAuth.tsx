import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Mail, Lock, KeyRound, ArrowLeft, AlertCircle, CheckCircle2, Sparkles, UserPlus, Zap } from 'lucide-react';

interface AdminAuthProps {
  onBackToStore: () => void;
}

export const AdminAuth: React.FC<AdminAuthProps> = ({ onBackToStore }) => {
  const { login, register, loginWithGoogle, quickDemoLogin, resetPassword, authError, setAuthError } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [isForgotMode, setIsForgotMode] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [quickLoading, setQuickLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMessage(null);
    setAuthError(null);

    try {
      if (isForgotMode) {
        if (!email) throw new Error('Please enter your email address.');
        await resetPassword(email);
        setSuccessMessage(`Password reset link sent to ${email}. Check your inbox or spam folder.`);
      } else if (isRegisterMode) {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match.');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters.');
        }
        await register(email, password);
        setSuccessMessage('Admin account created successfully! You are now logged in.');
      } else {
        await login(email, password);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickLogin = async () => {
    setQuickLoading(true);
    setAuthError(null);
    setSuccessMessage(null);
    try {
      await quickDemoLogin();
    } catch (err: any) {
      console.error(err);
    } finally {
      setQuickLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setAuthError(null);
    setSuccessMessage(null);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      console.error(err);
    } finally {
      setGoogleLoading(false);
    }
  };

  // Quick Demo credentials fill helper
  const handleFillDemoCreds = () => {
    setEmail('owner@thriftwithmiemie.com');
    setPassword('MiemieAdmin2026!');
    setIsRegisterMode(false);
    setAuthError(null);
  };

  return (
    <div className="min-h-screen bg-[#F4EFE6] flex items-center justify-center p-4 sm:p-6 py-12">
      
      <div className="w-full max-w-md bg-[#FBF9F5] rounded-3xl shadow-xl border border-[#E7E2D8] p-6 sm:p-8 space-y-6 relative">
        
        {/* Back to store button */}
        <button
          onClick={onBackToStore}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7A6E65] hover:text-[#1E1611] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Storefront</span>
        </button>

        {/* Brand & Security Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#1E1611] text-[#D95A2B] flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="font-display text-2xl font-black text-[#1E1611] uppercase tracking-tight">
            THRIFT WITH MIEMIE
          </h1>
          <p className="text-xs text-[#7A6E65] font-medium">
            {isForgotMode 
              ? 'Reset Administrator Password' 
              : isRegisterMode 
              ? 'Create New Owner / Admin Account' 
              : 'Secure Management Portal'}
          </p>
        </div>

        {/* 1-Click Instant Owner Login Banner */}
        {!isForgotMode && (
          <button
            type="button"
            onClick={handleQuickLogin}
            disabled={quickLoading}
            className="w-full p-3.5 bg-[#1E1611] hover:bg-[#34271E] text-white rounded-2xl flex items-center justify-between gap-3 shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#D95A2B] text-white flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 fill-white" />
              </div>
              <div>
                <span className="block text-xs font-bold text-white">1-Click Instant Owner Login</span>
                <span className="block text-[11px] text-[#C9BFB5]">Auto-initializes demo store account</span>
              </div>
            </div>
            <span className="text-xs font-bold text-[#D95A2B] group-hover:translate-x-0.5 transition-transform">
              {quickLoading ? 'Signing in...' : 'Enter →'}
            </span>
          </button>
        )}

        {/* Divider */}
        {!isForgotMode && (
          <div className="flex items-center gap-3">
            <div className="h-px bg-[#E7E2D8] flex-1" />
            <span className="text-[11px] font-bold text-[#9E948B] uppercase tracking-wider">or sign in with email</span>
            <div className="h-px bg-[#E7E2D8] flex-1" />
          </div>
        )}

        {/* Error Alert */}
        {authError && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span>{authError}</span>
            </div>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-start gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#3E2F26]">Admin Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#7A6E65] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@thriftwithmiemie.com"
                className="w-full pl-10 pr-4 py-3 bg-white rounded-xl text-xs sm:text-sm text-[#1E1611] border border-[#DCD5C9] focus:outline-hidden focus:border-[#D95A2B] focus:ring-1 focus:ring-[#D95A2B]"
              />
            </div>
          </div>

          {!isForgotMode && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#3E2F26]">Password</label>
                {!isRegisterMode && (
                  <button
                    type="button"
                    onClick={() => { setIsForgotMode(true); setAuthError(null); }}
                    className="text-[11px] text-[#D95A2B] font-semibold hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#7A6E65] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-white rounded-xl text-xs sm:text-sm text-[#1E1611] border border-[#DCD5C9] focus:outline-hidden focus:border-[#D95A2B] focus:ring-1 focus:ring-[#D95A2B]"
                />
              </div>
            </div>
          )}

          {isRegisterMode && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#3E2F26]">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#7A6E65] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-white rounded-xl text-xs sm:text-sm text-[#1E1611] border border-[#DCD5C9] focus:outline-hidden focus:border-[#D95A2B] focus:ring-1 focus:ring-[#D95A2B]"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-4 bg-[#D95A2B] hover:bg-[#C04C20] text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
          >
            {submitting ? (
              <span className="inline-block animate-spin">⏳ Processing...</span>
            ) : isForgotMode ? (
              <span>Send Password Reset Email</span>
            ) : isRegisterMode ? (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create Admin Account</span>
              </>
            ) : (
              <>
                <KeyRound className="w-4 h-4 text-white" />
                <span>Sign In to Admin Portal</span>
              </>
            )}
          </button>

          {/* Google Sign In option */}
          {!isForgotMode && (
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="w-full py-3 px-4 bg-white hover:bg-[#F4EFE6] text-[#1E1611] border border-[#DCD5C9] font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>{googleLoading ? 'Signing in...' : 'Sign in with Google'}</span>
            </button>
          )}

        </form>

        {/* Toggle between Login, Register, Forgot */}
        <div className="pt-3 border-t border-[#E7E2D8] flex flex-col items-center gap-2 text-center text-xs text-[#5A4E45]">
          {isForgotMode ? (
            <button
              type="button"
              onClick={() => { setIsForgotMode(false); setAuthError(null); }}
              className="text-[#D95A2B] font-bold hover:underline cursor-pointer"
            >
              ← Back to Sign In
            </button>
          ) : isRegisterMode ? (
            <div>
              <span>Already registered? </span>
              <button
                type="button"
                onClick={() => { setIsRegisterMode(false); setAuthError(null); }}
                className="text-[#D95A2B] font-bold hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </div>
          ) : (
            <div>
              <span>Need to set up the first admin account? </span>
              <button
                type="button"
                onClick={() => { setIsRegisterMode(true); setAuthError(null); }}
                className="text-[#D95A2B] font-bold hover:underline cursor-pointer"
              >
                Create Account
              </button>
            </div>
          )}
        </div>

        {/* Quick Credentials Autofill Card */}
        <div className="p-3.5 bg-[#FFEFEA] rounded-2xl border border-[#FCD5C8] flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-[#D95A2B]">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>Autofill Demo Credentials</span>
          </div>
          <button
            type="button"
            onClick={handleFillDemoCreds}
            className="text-[11px] font-bold bg-white text-[#1E1611] px-2.5 py-1 rounded-lg border border-[#DCD5C9] hover:border-[#D95A2B] transition-colors cursor-pointer"
          >
            Fill Form
          </button>
        </div>

      </div>

    </div>
  );
};

