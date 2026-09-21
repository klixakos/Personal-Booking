import React from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Dumbbell,
  Users,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import { Appointment, Service, TrainerSettings, AppointmentStatus } from '../../types';

interface OverviewTabProps {
  appointments: Appointment[];
  services: Service[];
  trainerSettings: TrainerSettings | null;
  onNavigateToTab: (tab: string) => void;
  onUpdateStatus: (id: string, status: AppointmentStatus) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  appointments,
  services,
  trainerSettings,
  onNavigateToTab,
  onUpdateStatus,
}) => {
  // Compute metrics
  const total = appointments.length;
  const pending = appointments.filter((a) => a.status === 'pending').length;
  const confirmed = appointments.filter((a) => a.status === 'confirmed').length;
  const completed = appointments.filter((a) => a.status === 'completed').length;
  const activeServicesCount = services.filter((s) => s.is_active).length;

  // Upcoming appointments (pending or confirmed, sorted by date)
  const upcomingAppointments = appointments
    .filter((a) => a.status === 'pending' || a.status === 'confirmed')
    .slice(0, 5);

  return (
    <div className="space-y-8 text-left">
      {/* Top Welcome Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0d121c] via-[#0b0e15] to-[#0d121c] border border-white/10 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-emerald-500/5 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-semibold uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Coach Control Center
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Welcome, {trainerSettings?.trainer_name?.split(',')[0] || 'Coach'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            Here is your live coaching schedule, pending client requests, and active service configurations.
            All updates sync immediately with the live client booking system.
          </p>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-[#0c1017] border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">
              Total Bookings
            </span>
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-300">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-white font-mono">{total}</span>
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
              <TrendingUp className="w-3 h-3" />
              All Time
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c1017] border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">
              Pending Approvals
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-amber-400 font-mono">{pending}</span>
            <button
              onClick={() => onNavigateToTab('appointments')}
              className="text-xs text-amber-400 hover:underline cursor-pointer"
            >
              Review
            </button>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c1017] border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">
              Confirmed Upcoming
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-emerald-400 font-mono">{confirmed}</span>
            <span className="text-xs text-gray-400">Active</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c1017] border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">
              Active Programs
            </span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <Dumbbell className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-cyan-400 font-mono">{activeServicesCount}</span>
            <button
              onClick={() => onNavigateToTab('services')}
              className="text-xs text-cyan-400 hover:underline cursor-pointer"
            >
              Manage
            </button>
          </div>
        </div>
      </div>

      {/* Upcoming Sessions Queue */}
      <div className="p-6 rounded-3xl bg-[#0c1017] border border-white/10 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Upcoming Session Queue</h3>
            <p className="text-xs text-gray-400">Real-time bookings awaiting execution or approval.</p>
          </div>
          <button
            onClick={() => onNavigateToTab('appointments')}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Appointments</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {upcomingAppointments.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
            <Calendar className="w-6 h-6 text-gray-500 mx-auto" />
            <p className="text-sm text-gray-300 font-medium">No pending or upcoming sessions scheduled.</p>
            <p className="text-xs text-gray-500">
              New client bookings from the public website will immediately populate here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingAppointments.map((appt) => (
              <div
                key={appt.id}
                className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{appt.full_name}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        appt.status === 'confirmed'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {appt.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-300">
                    {appt.service?.name || 'Coaching Session'}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400 font-mono pt-0.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-emerald-400" />
                      {appt.appointment_date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-emerald-400" />
                      {appt.start_time.substring(0, 5)} - {appt.end_time.substring(0, 5)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {appt.status === 'pending' && (
                    <button
                      onClick={() => onUpdateStatus(appt.id, 'confirmed')}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors cursor-pointer"
                    >
                      Confirm Session
                    </button>
                  )}
                  {appt.status === 'confirmed' && (
                    <button
                      onClick={() => onUpdateStatus(appt.id, 'completed')}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors cursor-pointer"
                    >
                      Mark Completed
                    </button>
                  )}
                  <button
                    onClick={() => onUpdateStatus(appt.id, 'cancelled')}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Access Action Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => onNavigateToTab('services')}
          className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 transition-all text-left space-y-1 cursor-pointer group"
        >
          <div className="text-xs font-bold text-white group-hover:text-emerald-400 flex items-center justify-between">
            <span>Manage Coaching Services</span>
            <ArrowUpRight className="w-4 h-4" />
          </div>
          <p className="text-[11px] text-gray-400">Edit durations, pricing, and active status.</p>
        </button>

        <button
          onClick={() => onNavigateToTab('hours')}
          className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 transition-all text-left space-y-1 cursor-pointer group"
        >
          <div className="text-xs font-bold text-white group-hover:text-emerald-400 flex items-center justify-between">
            <span>Update Business Hours</span>
            <ArrowUpRight className="w-4 h-4" />
          </div>
          <p className="text-[11px] text-gray-400">Configure open weekdays and daily start/end limits.</p>
        </button>

        <button
          onClick={() => onNavigateToTab('blocked')}
          className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 transition-all text-left space-y-1 cursor-pointer group"
        >
          <div className="text-xs font-bold text-white group-hover:text-emerald-400 flex items-center justify-between">
            <span>Block Out Dates</span>
            <ArrowUpRight className="w-4 h-4" />
          </div>
          <p className="text-[11px] text-gray-400">Prevent client bookings on specific dates.</p>
        </button>
      </div>
    </div>
  );
};
