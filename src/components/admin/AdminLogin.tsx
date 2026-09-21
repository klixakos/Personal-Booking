import React, { useState } from 'react';
import { Shield, Lock, Mail, Loader2, AlertCircle, ArrowLeft, Database, Copy, Check } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { checkIsAdmin } from '../../lib/api';

interface AdminLoginProps {
  onBackToSite: () => void;
  onLoginSuccess: (user: any) => void;
  onOpenSetupModal: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onBackToSite,
  onLoginSuccess,
  onOpenSetupModal,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [unauthorizedUserId, setUnauthorizedUserId] = useState<string | null>(null);
  const [copiedUid, setCopiedUid] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setUnauthorizedUserId(null);

    if (!isSupabaseConfigured) {
      setErrorMessage(
        'Supabase connection not detected. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables.'
      );
      return;
    }

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setLoading(true);

    try {
      // 1. Sign in with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMessage(error.message);
        setLoading(false);
        return;
      }

      if (!data.user) {
        setErrorMessage('Authentication succeeded but user record was not returned.');
        setLoading(false);
        return;
      }

      // 2. Check if user.id exists in admin_users.user_id
      const isAdmin = await checkIsAdmin(data.user.id);

      if (isAdmin) {
        onLoginSuccess(data.user);
      } else {
        // User authenticated but not authorized as admin
        setUnauthorizedUserId(data.user.id);
        setErrorMessage('You are signed in, but you are not authorized as an admin.');
      }
    } catch (err: any) {
      console.error('Sign in error:', err);
      setErrorMessage(err?.message || 'Authentication error. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUnauthorizedUserId(null);
    setErrorMessage(null);
  };

  const handleCopyUid = () => {
    if (unauthorizedUserId) {
      navigator.clipboard.writeText(unauthorizedUserId);
      setCopiedUid(true);
      setTimeout(() => setCopiedUid(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090d] flex flex-col justify-center items-center px-4 py-12 text-left relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top back button */}
      <div className="w-full max-w-md mb-6">
        <button
          onClick={onBackToSite}
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Public Website</span>
        </button>
      </div>

      <div className="w-full max-w-md bg-[#0c1017] border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6 relative z-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 p-0.5 mx-auto shadow-lg shadow-emerald-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-[#090b10] rounded-[14px] flex items-center justify-center">
              <Shield className="w-7 h-7 text-emerald-400" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Coach Portal Access</h1>
          <p className="text-xs text-gray-400">
            Secure administrative control panel for appointments, services, and coach availability.
          </p>
        </div>

        {/* Warning if Supabase is unconfigured */}
        {!isSupabaseConfigured && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-200 text-xs space-y-2">
            <div className="flex items-center gap-2 font-semibold">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Supabase Connection Needed</span>
            </div>
            <p className="text-gray-300 text-[11px] leading-relaxed">
              To log in with real Supabase Auth and save live database changes, set{' '}
              <code className="bg-black/40 px-1 py-0.5 rounded text-amber-300">VITE_SUPABASE_URL</code> and{' '}
              <code className="bg-black/40 px-1 py-0.5 rounded text-amber-300">VITE_SUPABASE_ANON_KEY</code>.
            </p>
            <button
              onClick={onOpenSetupModal}
              className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1 mt-1 cursor-pointer"
            >
              <Database className="w-3.5 h-3.5" />
              <span>View Database Schema & Setup SQL</span>
            </button>
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs space-y-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span className="font-semibold">{errorMessage}</span>
            </div>

            {/* If unauthorized user ID exists, show instructions to add to admin_users */}
            {unauthorizedUserId && (
              <div className="pt-2 border-t border-rose-500/20 space-y-2 text-[11px] text-gray-300">
                <p>
                  To grant this account coach admin privileges, add this User ID to the{' '}
                  <code className="text-emerald-300 font-mono">admin_users</code> table:
                </p>
                <div className="flex items-center gap-2 bg-black/50 p-2 rounded border border-white/10 font-mono text-[10px]">
                  <span className="truncate flex-1 text-white">{unauthorizedUserId}</span>
                  <button
                    onClick={handleCopyUid}
                    className="text-gray-400 hover:text-white shrink-0 p-1 cursor-pointer"
                    title="Copy User ID"
                  >
                    {copiedUid ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <button
                  onClick={handleSignOut}
                  className="mt-1 text-xs text-rose-400 hover:underline cursor-pointer"
                >
                  Sign Out of Current Account
                </button>
              </div>
            )}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-gray-300">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="admin-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="coach@apexperformance.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-emerald-400 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-gray-300">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="admin-password-input"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-emerald-400 transition-colors"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              id="admin-signin-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials & Access...</span>
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  <span>Sign In as Coach</span>
                </>
              )}
            </button>
          </div>
        </form>

        <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-500">
          <button
            onClick={onOpenSetupModal}
            className="hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Supabase Setup Guide</span>
          </button>
          <span>Admin verification via admin_users</span>
        </div>
      </div>
    </div>
  );
};
