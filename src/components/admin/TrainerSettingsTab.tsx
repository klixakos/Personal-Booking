import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Clock, AlertCircle, Save, Check, Loader2 } from 'lucide-react';
import { TrainerSettings } from '../../types';

interface TrainerSettingsTabProps {
  trainerSettings: TrainerSettings | null;
  loading: boolean;
  onSaveSettings: (
    updates: Partial<Omit<TrainerSettings, 'id' | 'created_at'>>
  ) => Promise<void>;
}

export const TrainerSettingsTab: React.FC<TrainerSettingsTabProps> = ({
  trainerSettings,
  loading,
  onSaveSettings,
}) => {
  const [trainerName, setTrainerName] = useState('');
  const [trainerEmail, setTrainerEmail] = useState('');
  const [trainerPhone, setTrainerPhone] = useState('');
  const [trainerAddress, setTrainerAddress] = useState('');
  const [slotIntervalMinutes, setSlotIntervalMinutes] = useState(60);
  const [bookingNoticeHours, setBookingNoticeHours] = useState(12);

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (trainerSettings) {
      setTrainerName(trainerSettings.trainer_name || '');
      setTrainerEmail(trainerSettings.trainer_email || '');
      setTrainerPhone(trainerSettings.trainer_phone || '');
      setTrainerAddress(trainerSettings.trainer_address || '');
      setSlotIntervalMinutes(trainerSettings.slot_interval_minutes || 60);
      setBookingNoticeHours(trainerSettings.booking_notice_hours || 12);
    }
  }, [trainerSettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSaving(true);

    try {
      await onSaveSettings({
        trainer_name: trainerName.trim(),
        trainer_email: trainerEmail.trim(),
        trainer_phone: trainerPhone.trim(),
        trainer_address: trainerAddress.trim(),
        slot_interval_minutes: Number(slotIntervalMinutes),
        booking_notice_hours: Number(bookingNoticeHours),
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error updating trainer settings:', err);
      setErrorMessage(err?.message || 'Failed to update trainer settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Trainer Profile & Scheduling Rules</h2>
          <p className="text-xs text-gray-400">
            Configure contact details, studio location, time slot intervals, and booking advance notice.
          </p>
        </div>

        <button
          id="btn-save-trainer-settings"
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
          <span>{saving ? 'Saving...' : savedSuccess ? 'Settings Saved!' : 'Save Settings'}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Trainer settings saved! Changes are now active on the public website.</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact & Bio Card */}
        <div className="p-6 rounded-2xl bg-[#0c1017] border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-400" />
            <span>Trainer Contact & Location Details</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-gray-300">
                Trainer / Coach Name *
              </label>
              <input
                id="input-trainer-name"
                type="text"
                required
                value={trainerName}
                onChange={(e) => setTrainerName(e.target.value)}
                placeholder="e.g. Marcus Vance, CSCS"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-gray-300">
                Trainer Email *
              </label>
              <input
                id="input-trainer-email"
                type="email"
                required
                value={trainerEmail}
                onChange={(e) => setTrainerEmail(e.target.value)}
                placeholder="coach@apexperformance.com"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-gray-300">
                Trainer Phone *
              </label>
              <input
                id="input-trainer-phone"
                type="tel"
                required
                value={trainerPhone}
                onChange={(e) => setTrainerPhone(e.target.value)}
                placeholder="+1 (415) 890-3240"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-gray-300">
                Studio Address / Facility Location *
              </label>
              <input
                id="input-trainer-address"
                type="text"
                required
                value={trainerAddress}
                onChange={(e) => setTrainerAddress(e.target.value)}
                placeholder="480 Performance Blvd, Studio 4A, San Francisco, CA"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>
        </div>

        {/* Scheduling Constraints Card */}
        <div className="p-6 rounded-2xl bg-[#0c1017] border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>Scheduling & Slot Interval Engine Rules</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-gray-300">
                Slot Interval (Minutes) *
              </label>
              <select
                id="select-slot-interval"
                value={slotIntervalMinutes}
                onChange={(e) => setSlotIntervalMinutes(parseInt(e.target.value, 10))}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-400 font-mono"
              >
                <option value={30} className="bg-[#0c1017]">30 minutes</option>
                <option value={45} className="bg-[#0c1017]">45 minutes</option>
                <option value={60} className="bg-[#0c1017]">60 minutes (Standard 1 Hour)</option>
                <option value={75} className="bg-[#0c1017]">75 minutes</option>
                <option value={90} className="bg-[#0c1017]">90 minutes</option>
              </select>
              <span className="text-[11px] text-gray-400 block">
                How often new session starting slots are offered on the booking calendar.
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-gray-300">
                Minimum Advance Booking Notice (Hours) *
              </label>
              <select
                id="select-notice-hours"
                value={bookingNoticeHours}
                onChange={(e) => setBookingNoticeHours(parseInt(e.target.value, 10))}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-400 font-mono"
              >
                <option value={2} className="bg-[#0c1017]">2 hours notice</option>
                <option value={4} className="bg-[#0c1017]">4 hours notice</option>
                <option value={8} className="bg-[#0c1017]">8 hours notice</option>
                <option value={12} className="bg-[#0c1017]">12 hours notice (Recommended)</option>
                <option value={24} className="bg-[#0c1017]">24 hours notice</option>
                <option value={48} className="bg-[#0c1017]">48 hours notice</option>
              </select>
              <span className="text-[11px] text-gray-400 block">
                Prevents clients from booking on too short notice. Slots starting sooner will be hidden.
              </span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
