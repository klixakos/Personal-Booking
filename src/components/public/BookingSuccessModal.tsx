import React from 'react';
import { CheckCircle2, Calendar, Clock, MapPin, User, Mail, Phone, FileText, ArrowRight, Download } from 'lucide-react';
import { Appointment, Service, TrainerSettings } from '../../types';
import { formatDateToYYYYMMDD, formatTimeDisplay } from '../../lib/availability';

interface BookingSuccessModalProps {
  appointment: Appointment;
  service: Service;
  trainerSettings: TrainerSettings | null;
  onClose: () => void;
}

export const BookingSuccessModal: React.FC<BookingSuccessModalProps> = ({
  appointment,
  service,
  trainerSettings,
  onClose,
}) => {
  const trainerName = trainerSettings?.trainer_name || 'Marcus Vance, CSCS';
  const trainerAddress = trainerSettings?.trainer_address || '480 Performance Blvd, Studio 4A, San Francisco, CA';
  const trainerPhone = trainerSettings?.trainer_phone || '+1 (415) 890-3240';

  // Format date display
  const [year, month, day] = appointment.appointment_date.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // ICS Calendar generation helper
  const handleDownloadCalendar = () => {
    const [startH, startM] = appointment.start_time.split(':').map(Number);
    const [endH, endM] = appointment.end_time.split(':').map(Number);
    const startDt = new Date(year, month - 1, day, startH, startM);
    const endDt = new Date(year, month - 1, day, endH, endM);

    const pad = (n: number) => (n < 10 ? '0' + n : n);
    const formatIcsDate = (d: Date) =>
      `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Apex Performance Coaching//Session Booking//EN',
      'BEGIN:VEVENT',
      `UID:${appointment.id}@apexperformance.com`,
      `DTSTAMP:${formatIcsDate(new Date())}Z`,
      `DTSTART:${formatIcsDate(startDt)}`,
      `DTEND:${formatIcsDate(endDt)}`,
      `SUMMARY:${service.name} with ${trainerName}`,
      `DESCRIPTION:Coaching session for ${appointment.full_name}. Coach: ${trainerName} (${trainerPhone})`,
      `LOCATION:${trainerAddress}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `training-session-${appointment.appointment_date}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div
      id="booking-success-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-300"
    >
      <div className="relative w-full max-w-xl my-8 rounded-3xl bg-[#0b0e15] border border-emerald-500/30 shadow-2xl shadow-emerald-500/10 p-6 sm:p-8 text-left space-y-6">
        {/* Success Header Banner */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-9 h-9 text-emerald-400" />
          </div>
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
              Reservation Confirmed
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Session Booked Successfully!
            </h3>
            <p className="text-xs sm:text-sm text-gray-300">
              A reservation request has been registered in the coaching system.
            </p>
          </div>
        </div>

        {/* Appointment Detail Summary Card */}
        <div className="p-5 rounded-2xl bg-[#0e131d] border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <div className="text-base font-bold text-white">{service.name}</div>
              <div className="text-xs text-emerald-400 font-mono">
                {service.duration_minutes} Minutes • ${Number(service.price).toFixed(0)}
              </div>
            </div>
            <div className="text-right">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 uppercase">
                {appointment.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-gray-300">
              <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2.5 text-gray-300">
              <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                {appointment.start_time.substring(0, 5)} - {appointment.end_time.substring(0, 5)}
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-gray-300">
              <User className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{appointment.full_name}</span>
            </div>
            <div className="flex items-center gap-2.5 text-gray-300">
              <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="truncate">{appointment.email}</span>
            </div>
            <div className="flex items-center gap-2.5 text-gray-300">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{appointment.phone}</span>
            </div>
            <div className="flex items-center gap-2.5 text-gray-300">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="truncate">{trainerAddress}</span>
            </div>
          </div>

          {appointment.notes && (
            <div className="pt-3 border-t border-white/5 text-xs text-gray-400 flex items-start gap-2">
              <FileText className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
              <span>{appointment.notes}</span>
            </div>
          )}
        </div>

        {/* Coach Note */}
        <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-xs text-gray-300 leading-relaxed">
          <strong className="text-white block mb-1">Coach Preparation Guidance:</strong>
          Please arrive 5-10 minutes prior to calibrate your movement warm-up. Wear clean flat-soled athletic shoes and bring hydration.
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            id="btn-download-calendar"
            onClick={handleDownloadCalendar}
            className="flex-1 py-3 px-4 rounded-xl text-xs font-semibold text-gray-200 bg-white/10 hover:bg-white/15 border border-white/10 flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Add to Calendar (.ics)</span>
          </button>
          <button
            id="btn-close-booking-modal"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Done / Book Another</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
