import React, { useState } from 'react';
import { X, Copy, Check, Database, CheckCircle2, AlertCircle } from 'lucide-react';
import { SUPABASE_SETUP_SQL } from '../../lib/schema.sql';
import { isSupabaseConfigured } from '../../lib/supabase';

interface DatabaseSetupModalProps {
  onClose: () => void;
}

export const DatabaseSetupModal: React.FC<DatabaseSetupModalProps> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(SUPABASE_SETUP_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl my-8 rounded-3xl bg-[#0c1017] border border-white/15 shadow-2xl p-6 sm:p-8 text-left space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-mono font-semibold">
              <Database className="w-3.5 h-3.5" />
              <span>Supabase Schema Configuration</span>
            </div>
            <h2 className="text-xl font-bold text-white">Database Setup & SQL Scripts</h2>
            <p className="text-xs text-gray-400">
              Run this SQL script in your Supabase SQL Editor to provision all tables, constraints, and Row Level Security policies.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status indicator */}
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isSupabaseConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <div>
              <div className="text-xs font-bold text-white">
                {isSupabaseConfigured ? 'Supabase Credentials Configured' : 'Supabase Credentials Missing / Placeholder'}
              </div>
              <div className="text-[11px] text-gray-400">
                {isSupabaseConfigured
                  ? 'Client is communicating with your Supabase endpoint.'
                  : 'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env or environment.'}
              </div>
            </div>
          </div>
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-lg text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy SQL Schema'}</span>
          </button>
        </div>

        {/* Steps */}
        <div className="space-y-3 text-xs text-gray-300">
          <div className="font-bold text-white uppercase tracking-wider font-mono text-[11px]">
            3 Quick Steps to Link Your Database:
          </div>
          <ol className="list-decimal list-inside space-y-2 text-xs text-gray-300">
            <li>
              Go to your <strong className="text-white">Supabase Dashboard → SQL Editor</strong>.
            </li>
            <li>
              Paste and run the SQL below to create <code className="text-emerald-400">services</code>,{' '}
              <code className="text-emerald-400">appointments</code>,{' '}
              <code className="text-emerald-400">business_hours</code>,{' '}
              <code className="text-emerald-400">blocked_dates</code>,{' '}
              <code className="text-emerald-400">trainer_settings</code>, and{' '}
              <code className="text-emerald-400">admin_users</code>.
            </li>
            <li>
              Create a user in <strong className="text-white">Authentication → Users</strong>, then add their{' '}
              <code className="text-emerald-400">user_id</code> into the{' '}
              <code className="text-emerald-400">admin_users</code> table to grant coach admin access!
            </li>
          </ol>
        </div>

        {/* Code Snippet Box */}
        <div className="relative rounded-xl overflow-hidden border border-white/10 bg-[#07090d]">
          <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5 text-xs text-gray-400 font-mono">
            <span>supabase_schema.sql</span>
            <button
              onClick={handleCopy}
              className="text-gray-400 hover:text-white flex items-center gap-1 text-[11px] cursor-pointer"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre className="p-4 text-[11px] font-mono text-gray-300 overflow-x-auto max-h-72 leading-relaxed">
            {SUPABASE_SETUP_SQL}
          </pre>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/15 transition-colors cursor-pointer"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
