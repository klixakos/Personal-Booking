import React, { useState } from 'react';
import { Calendar, Trash2, Plus, AlertCircle, Loader2, Check } from 'lucide-react';
import { BlockedDate } from '../../types';

interface BlockedDatesTabProps {
  blockedDates: BlockedDate[];
  loading: boolean;
  onAddBlockedDate: (date: string, reason: string) => Promise<void>;
  onDeleteBlockedDate: (id: string) => Promise<void>;
}

export const BlockedDatesTab: React.FC<BlockedDatesTabProps> = ({
  blockedDates,
  loading,
  onAddBlockedDate,
  onDeleteBlockedDate,
}) => {
  const [newDate, setNewDate] = useState('');
  const [newReason, setNewReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!newDate) {
      setError('Please select a date to block.');
      return;
    }
    if (!newReason.trim()) {
      setError('Please enter a reason (e.g. Coach Seminar, Holiday, Facility Maintenance).');
      return;
    }

    if (blockedDates.some((b) => b.blocked_date === newDate)) {
      setError('This date is already blocked.');
      return;
    }

    setSubmitting(true);
    try {
      await onAddBlockedDate(newDate, newReason.trim());
      setNewDate('');
      setNewReason('');
    } catch (err: any) {
      console.error('Error adding blocked date:', err);
      setError(err?.message || 'Failed to add blocked date.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await onDeleteBlockedDate(id);
    } catch (err: any) {
      console.error('Error deleting blocked date:', err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Blocked Calendar Dates</h2>
          <p className="text-xs text-gray-400">
            Designate holidays, coach travel, or studio maintenance days. Clients will see these dates as unavailable.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Add Blocked Date Form Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0c1017] border border-white/10 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white">Add New Blocked Date</h3>
        <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
          <div className="sm:col-span-4 space-y-1.5">
            <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-gray-300">
              Date to Block *
            </label>
            <input
              type="date"
              required
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div className="sm:col-span-5 space-y-1.5">
            <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-gray-300">
              Reason / Memo *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Continuing Education, Studio Turf Renovation"
              value={newReason}
              onChange={(e) => setNewReason(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div className="sm:col-span-3">
            <button
              id="btn-add-blocked-date"
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              <span>Block Date</span>
            </button>
          </div>
        </form>
      </div>

      {/* Blocked Dates List */}
      <div className="bg-[#0c1017] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="px-5 py-3.5 bg-white/[0.02] border-b border-white/5 text-xs font-mono uppercase tracking-wider text-gray-400">
          Currently Blocked Dates ({blockedDates.length})
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-gray-400 animate-pulse">
            Loading blocked dates...
          </div>
        ) : blockedDates.length === 0 ? (
          <div className="p-12 text-center text-gray-400 space-y-2">
            <Calendar className="w-7 h-7 text-gray-600 mx-auto" />
            <p className="text-sm text-gray-300 font-medium">No dates currently blocked.</p>
            <p className="text-xs text-gray-500">
              All dates within working hours are open for booking.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {blockedDates.map((item) => (
              <div
                key={item.id}
                className="p-4 flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-mono font-bold text-white block">
                      {item.blocked_date}
                    </span>
                    <span className="text-xs text-gray-400">{item.reason}</span>
                  </div>
                </div>

                <button
                  disabled={deletingId === item.id}
                  onClick={() => handleDelete(item.id)}
                  className="p-2 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  title="Remove block"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
