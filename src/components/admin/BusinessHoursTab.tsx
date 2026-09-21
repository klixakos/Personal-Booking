import React, { useState, useEffect } from 'react';
import { Clock, Check, Loader2, AlertCircle, Save } from 'lucide-react';
import { BusinessHours } from '../../types';

interface BusinessHoursTabProps {
  businessHours: BusinessHours[];
  loading: boolean;
  onSaveHours: (updatedHours: BusinessHours[]) => Promise<void>;
}

const WEEKDAY_CONFIG = [
  { index: 1, name: 'Monday' },
  { index: 2, name: 'Tuesday' },
  { index: 3, name: 'Wednesday' },
  { index: 4, name: 'Thursday' },
  { index: 5, name: 'Friday' },
  { index: 6, name: 'Saturday' },
  { index: 0, name: 'Sunday' },
];

export const BusinessHoursTab: React.FC<BusinessHoursTabProps> = ({
  businessHours,
  loading,
  onSaveHours,
}) => {
  const [localHours, setLocalHours] = useState<BusinessHours[]>([]);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Ensure all 7 weekdays are accounted for
    const merged: BusinessHours[] = WEEKDAY_CONFIG.map(({ index }) => {
      const existing = businessHours.find((bh) => Number(bh.weekday) === index);
      if (existing) return { ...existing };
      return {
        id: `bh-${index}`,
        weekday: index,
        is_open: index !== 0, // open Mon-Sat by default
        start_time: '07:00:00',
        end_time: '19:00:00',
      };
    });
    setLocalHours(merged);
  }, [businessHours]);

  const handleToggleDay = (weekday: number) => {
    setLocalHours((prev) =>
      prev.map((item) =>
        item.weekday === weekday ? { ...item, is_open: !item.is_open } : item
      )
    );
    setSavedSuccess(false);
  };

  const handleTimeChange = (
    weekday: number,
    field: 'start_time' | 'end_time',
    value: string
  ) => {
    // Convert e.g. "07:00" to "07:00:00"
    const formatted = value.length === 5 ? `${value}:00` : value;
    setLocalHours((prev) =>
      prev.map((item) =>
        item.weekday === weekday ? { ...item, [field]: formatted } : item
      )
    );
    setSavedSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSaving(true);
    try {
      await onSaveHours(localHours);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error saving business hours:', err);
      setErrorMessage(err?.message || 'Failed to update business hours.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Business Hours & Schedule Limits</h2>
          <p className="text-xs text-gray-400">
            Define working hours for each day of the week. Slots outside these windows are automatically omitted from client booking.
          </p>
        </div>

        <button
          id="btn-save-business-hours"
          onClick={handleSubmit}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : savedSuccess ? (
            <Check className="w-4 h-4" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{saving ? 'Saving...' : savedSuccess ? 'Schedule Saved!' : 'Save Changes'}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Business hours successfully synchronized with Supabase!</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Weekday List */}
      <div className="bg-[#0c1017] border border-white/10 rounded-2xl overflow-hidden shadow-xl divide-y divide-white/5">
        {WEEKDAY_CONFIG.map(({ index, name }) => {
          const day = localHours.find((h) => h.weekday === index) || {
            weekday: index,
            is_open: false,
            start_time: '07:00:00',
            end_time: '19:00:00',
          };

          return (
            <div
              key={index}
              className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                day.is_open ? 'bg-transparent' : 'bg-white/[0.01] opacity-70'
              }`}
            >
              {/* Day title & open toggle */}
              <div className="flex items-center gap-4 min-w-[180px]">
                <button
                  type="button"
                  onClick={() => handleToggleDay(index)}
                  className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${
                    day.is_open ? 'bg-emerald-400' : 'bg-white/15'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-slate-950 transition-transform absolute top-1 ${
                      day.is_open ? 'left-5' : 'left-1'
                    }`}
                  />
                </button>
                <div>
                  <span className="text-sm font-bold text-white block">{name}</span>
                  <span className="text-[11px] font-mono text-gray-400">
                    {day.is_open ? 'Open for Training' : 'Closed'}
                  </span>
                </div>
              </div>

              {/* Time inputs */}
              {day.is_open ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-gray-400">From:</span>
                    <input
                      type="time"
                      value={day.start_time.substring(0, 5)}
                      onChange={(e) => handleTimeChange(index, 'start_time', e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                  <span className="text-gray-500 font-mono">-</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-gray-400">To:</span>
                    <input
                      type="time"
                      value={day.end_time.substring(0, 5)}
                      onChange={(e) => handleTimeChange(index, 'end_time', e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>
              ) : (
                <div className="text-xs text-gray-500 italic">
                  No sessions will be scheduled on this day.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
