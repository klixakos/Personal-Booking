import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  Search,
  Filter,
  User,
  Mail,
  Phone,
  FileText,
  CheckCircle2,
  AlertCircle,
  XCircle,
  RotateCcw,
  Check,
  ChevronDown,
} from 'lucide-react';
import { Appointment, AppointmentStatus } from '../../types';

interface AppointmentsTabProps {
  appointments: Appointment[];
  loading: boolean;
  onUpdateStatus: (id: string, status: AppointmentStatus) => Promise<void>;
}

export const AppointmentsTab: React.FC<AppointmentsTabProps> = ({
  appointments,
  loading,
  onUpdateStatus,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Filtered appointments
  const filtered = useMemo(() => {
    return appointments.filter((appt) => {
      const matchStatus = filterStatus === 'all' || appt.status === filterStatus;
      const query = searchQuery.toLowerCase().trim();
      const matchSearch =
        !query ||
        appt.full_name.toLowerCase().includes(query) ||
        appt.email.toLowerCase().includes(query) ||
        appt.phone.toLowerCase().includes(query) ||
        (appt.service?.name || '').toLowerCase().includes(query);
      return matchStatus && matchSearch;
    });
  }, [appointments, filterStatus, searchQuery]);

  const handleStatusChange = async (id: string, newStatus: AppointmentStatus) => {
    setUpdatingId(id);
    try {
      await onUpdateStatus(id, newStatus);
      if (selectedAppointment && selectedAppointment.id === id) {
        setSelectedAppointment({ ...selectedAppointment, status: newStatus });
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            Confirmed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <AlertCircle className="w-3 h-3" />
            Pending
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
            <Check className="w-3 h-3" />
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <XCircle className="w-3 h-3" />
            Cancelled
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Client Appointments</h2>
          <p className="text-xs text-gray-400">
            Manage training session requests, attendance, and status updates.
          </p>
        </div>
        <div className="text-xs text-gray-400 font-mono">
          Total: <strong className="text-white">{filtered.length}</strong> record{filtered.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by client name, email, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0c1017] border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-emerald-400"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1 bg-[#0c1017] p-1 rounded-xl border border-white/10 overflow-x-auto">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all whitespace-nowrap cursor-pointer ${
                filterStatus === status
                  ? 'bg-emerald-400 text-slate-950 font-bold shadow'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table / Card List */}
      <div className="bg-[#0c1017] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-gray-400 text-xs animate-pulse">
            Loading appointments from Supabase...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400 space-y-2">
            <Calendar className="w-8 h-8 text-gray-600 mx-auto" />
            <p className="text-sm text-gray-300 font-medium">No appointments match your filter.</p>
            <p className="text-xs text-gray-500">Try changing your search keywords or status filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.03] border-b border-white/10 text-gray-400 font-mono uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Client</th>
                  <th className="py-3.5 px-4">Service</th>
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((appt) => (
                  <tr
                    key={appt.id}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-3.5 px-4 font-semibold text-white">
                      <div>{appt.full_name}</div>
                      {appt.notes && (
                        <div className="text-[11px] text-gray-400 line-clamp-1 italic max-w-xs">
                          "{appt.notes}"
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-gray-300">
                      <div className="font-medium text-white">{appt.service?.name || 'Coaching'}</div>
                      <div className="text-[11px] text-emerald-400 font-mono">
                        {appt.service?.duration_minutes || 60}m • ${Number(appt.service?.price || 120).toFixed(0)}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-gray-300">
                      <div className="text-white font-medium">{appt.appointment_date}</div>
                      <div className="text-gray-400 text-[11px]">
                        {appt.start_time.substring(0, 5)} - {appt.end_time.substring(0, 5)}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-gray-400 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-gray-300">
                        <Mail className="w-3 h-3 text-gray-500" />
                        <span className="truncate max-w-[150px]">{appt.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-400 font-mono">
                        <Phone className="w-3 h-3 text-gray-500" />
                        <span>{appt.phone}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {getStatusBadge(appt.status)}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {appt.status !== 'confirmed' && (
                          <button
                            disabled={updatingId === appt.id}
                            onClick={() => handleStatusChange(appt.id, 'confirmed')}
                            className="px-2.5 py-1 rounded bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 text-[11px] font-semibold transition-colors cursor-pointer"
                            title="Confirm appointment"
                          >
                            Confirm
                          </button>
                        )}
                        {appt.status !== 'completed' && (
                          <button
                            disabled={updatingId === appt.id}
                            onClick={() => handleStatusChange(appt.id, 'completed')}
                            className="px-2.5 py-1 rounded bg-cyan-500/15 text-cyan-400 hover:bg-cyan-500/30 border border-cyan-500/30 text-[11px] font-semibold transition-colors cursor-pointer"
                            title="Mark completed"
                          >
                            Complete
                          </button>
                        )}
                        {appt.status !== 'cancelled' && (
                          <button
                            disabled={updatingId === appt.id}
                            onClick={() => handleStatusChange(appt.id, 'cancelled')}
                            className="px-2.5 py-1 rounded bg-rose-500/15 text-rose-400 hover:bg-rose-500/30 border border-rose-500/30 text-[11px] font-semibold transition-colors cursor-pointer"
                            title="Cancel appointment"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
