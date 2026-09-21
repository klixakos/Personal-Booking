import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Mail,
  Phone,
  Check,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  Dumbbell,
  FileText,
  Loader2,
  CalendarCheck,
} from 'lucide-react';
import {
  Service,
  BusinessHours,
  BlockedDate,
  TrainerSettings,
  Appointment,
  TimeSlot,
  BookingFormData,
} from '../../types';
import {
  generateAvailableSlots,
  formatDateToYYYYMMDD,
  formatTimeDisplay,
  formatTimeToHHMMSS,
} from '../../lib/availability';
import { createAppointment } from '../../lib/api';
import { BookingSuccessModal } from './BookingSuccessModal';

interface BookingSectionProps {
  services: Service[];
  businessHours: BusinessHours[];
  blockedDates: BlockedDate[];
  trainerSettings: TrainerSettings | null;
  appointments: Appointment[];
  preselectedService?: Service | null;
  onBookingCreated: (newAppointment: Appointment) => void;
}

export const BookingSection: React.FC<BookingSectionProps> = ({
  services,
  businessHours,
  blockedDates,
  trainerSettings,
  appointments,
  preselectedService,
  onBookingCreated,
}) => {
  // Wizard state: 1 = Service, 2 = Date & Slot, 3 = Details
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedService, setSelectedService] = useState<Service | null>(preselectedService || null);

  // Sync preselected service if passed from outside
  React.useEffect(() => {
    if (preselectedService) {
      setSelectedService(preselectedService);
      setCurrentStep(2);
    }
  }, [preselectedService]);

  // Calendar dates generation (next 21 days starting today)
  const availableDates = useMemo(() => {
    const dates: Date[] = [];
    const now = new Date();
    for (let i = 0; i < 21; i++) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
      dates.push(d);
    }
    return dates;
  }, []);

  const [selectedDate, setSelectedDate] = useState<Date>(availableDates[0]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  // Compute available slots for currently selected date and service
  const timeSlots = useMemo(() => {
    if (!selectedService || !selectedDate) return [];
    return generateAvailableSlots({
      targetDate: selectedDate,
      service: selectedService,
      businessHours,
      trainerSettings,
      blockedDates,
      appointments,
      currentTime: new Date(),
    });
  }, [selectedDate, selectedService, businessHours, trainerSettings, blockedDates, appointments]);

  // Group slots by period
  const slotGroups = useMemo(() => {
    const morning: TimeSlot[] = [];
    const afternoon: TimeSlot[] = [];
    const evening: TimeSlot[] = [];

    timeSlots.forEach((slot) => {
      const h = slot.start.getHours();
      if (h < 12) morning.push(slot);
      else if (h < 17) afternoon.push(slot);
      else evening.push(slot);
    });

    return { morning, afternoon, evening };
  }, [timeSlots]);

  // Check if a given date is blocked or closed
  const getDateStatus = (date: Date) => {
    const dateStr = formatDateToYYYYMMDD(date);
    if (blockedDates.some((b) => b.blocked_date === dateStr)) {
      return { status: 'blocked', label: 'Blocked' };
    }
    const dayHours = businessHours.find((bh) => Number(bh.weekday) === date.getDay());
    if (!dayHours || !dayHours.is_open) {
      return { status: 'closed', label: 'Closed' };
    }
    return { status: 'open', label: 'Open' };
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!selectedService) {
      setFormError('Please select a coaching service.');
      setCurrentStep(1);
      return;
    }
    if (!selectedDate || !selectedSlot) {
      setFormError('Please choose a date and time slot.');
      setCurrentStep(2);
      return;
    }
    if (!fullName.trim()) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setFormError('Please enter a valid email address.');
      return;
    }
    if (!phone.trim()) {
      setFormError('Please enter your contact phone number.');
      return;
    }

    setSubmitting(true);

    try {
      const payload: BookingFormData = {
        service_id: selectedService.id,
        appointment_date: formatDateToYYYYMMDD(selectedDate),
        start_time: formatTimeToHHMMSS(selectedSlot.start),
        end_time: formatTimeToHHMMSS(selectedSlot.end),
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        notes: notes.trim() || undefined,
      };

      const newAppt = await createAppointment(payload);

      if (newAppt) {
        onBookingCreated(newAppt);
        setConfirmedAppointment(newAppt);
      }
    } catch (err) {
      console.error('Booking submission error:', err);
      setFormError('An unexpected error occurred. Please verify your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetBookingFlow = () => {
    setConfirmedAppointment(null);
    setCurrentStep(1);
    setSelectedSlot(null);
    setNotes('');
  };

  return (
    <section id="booking" className="py-24 bg-[#07090d] relative overflow-hidden text-left">
      {/* Background Lighting */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 left-10 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="max-w-3xl mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wider uppercase font-mono">
            <CalendarCheck className="w-3.5 h-3.5" />
            Live Session Reservations
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            BOOK YOUR TRAINING SESSION.
          </h2>
          <p className="text-gray-400 text-base sm:text-lg">
            Real-time calendar synchronization. Choose your coaching program, pick an available slot,
            and submit your training reservation.
          </p>
        </div>

        {/* 3-Step Wizard Indicator */}
        <div className="mb-10 max-w-2xl">
          <div className="grid grid-cols-3 gap-2">
            {[
              { num: 1, label: 'Choose Service', icon: Dumbbell },
              { num: 2, label: 'Date & Time', icon: CalendarIcon },
              { num: 3, label: 'Your Details', icon: User },
            ].map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.num;
              const isCompleted = currentStep > step.num;

              return (
                <button
                  key={step.num}
                  type="button"
                  onClick={() => {
                    if (step.num < currentStep || (step.num === 2 && selectedService)) {
                      setCurrentStep(step.num);
                    }
                  }}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                    isActive
                      ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                      : isCompleted
                      ? 'bg-white/5 border-emerald-500/40 text-gray-200'
                      : 'bg-white/[0.02] border-white/5 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold font-mono ${
                      isActive
                        ? 'bg-emerald-400 text-slate-950'
                        : isCompleted
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-white/5 text-gray-500'
                    }`}
                  >
                    {isCompleted ? <Check className="w-3.5 h-3.5" /> : step.num}
                  </div>
                  <div className="hidden sm:block min-w-0">
                    <div className="text-xs font-semibold truncate">{step.label}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Wizard Step Panel */}
          <div className="lg:col-span-8 bg-[#0b0e15] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
            {/* STEP 1: SERVICE SELECTION */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div>
                    <h3 className="text-xl font-bold text-white">Select Coaching Program</h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Choose the session format that fits your athletic goals.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-medium text-emerald-400">Step 1 of 3</span>
                </div>

                <div className="space-y-3">
                  {services.map((service) => {
                    const isSelected = selectedService?.id === service.id;
                    return (
                      <div
                        key={service.id}
                        id={`select-service-item-${service.id}`}
                        onClick={() => setSelectedService(service)}
                        className={`p-4 sm:p-5 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                          isSelected
                            ? 'bg-emerald-500/10 border-emerald-400 shadow-md shadow-emerald-500/10'
                            : 'bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.05]'
                        }`}
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-base font-bold text-white">{service.name}</span>
                            {isSelected && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-bold font-mono uppercase">
                                Selected
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-300 leading-relaxed font-normal">
                            {service.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-emerald-400/90 font-mono pt-1">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {service.duration_minutes} Minutes
                            </span>
                            <span>•</span>
                            <span className="font-bold text-white">${Number(service.price).toFixed(0)}</span>
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center justify-end">
                          <div
                            className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                              isSelected
                                ? 'bg-emerald-400 border-emerald-400 text-slate-950'
                                : 'border-white/20 text-transparent'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    id="btn-step1-continue"
                    disabled={!selectedService}
                    onClick={() => setCurrentStep(2)}
                    className="px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>Continue to Date & Time</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: DATE & TIME SELECTION */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div>
                    <h3 className="text-xl font-bold text-white">Choose Date & Time Slot</h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Times are calculated in real time based on coach availability and notice rules.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-medium text-emerald-400">Step 2 of 3</span>
                </div>

                {/* Date Slider / Picker */}
                <div>
                  <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-gray-300 mb-3">
                    Available Dates (Next 21 Days)
                  </label>
                  <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none">
                    {availableDates.map((date) => {
                      const dateStr = formatDateToYYYYMMDD(date);
                      const isSelected = formatDateToYYYYMMDD(selectedDate) === dateStr;
                      const { status, label } = getDateStatus(date);
                      const isClickable = status === 'open';

                      return (
                        <button
                          key={dateStr}
                          type="button"
                          disabled={!isClickable}
                          onClick={() => handleDateSelect(date)}
                          className={`min-w-[76px] p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-between gap-1 shrink-0 ${
                            isSelected
                              ? 'bg-emerald-500/15 border-emerald-400 shadow-md shadow-emerald-500/10 text-white'
                              : isClickable
                              ? 'bg-white/[0.03] border-white/10 hover:border-white/20 text-gray-300'
                              : 'bg-white/[0.01] border-white/5 text-gray-600 opacity-40 cursor-not-allowed'
                          }`}
                        >
                          <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400">
                            {date.toLocaleDateString('en-US', { weekday: 'short' })}
                          </span>
                          <span className="text-lg font-black font-mono">
                            {date.getDate()}
                          </span>
                          <span className="text-[10px] font-mono text-gray-400 uppercase">
                            {date.toLocaleDateString('en-US', { month: 'short' })}
                          </span>
                          {status !== 'open' && (
                            <span className="text-[9px] font-mono text-rose-400 tracking-tight">
                              {label}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Slots display */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-gray-300">
                      Available Starting Times for{' '}
                      <span className="text-emerald-400">
                        {selectedDate.toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </label>
                    <span className="text-xs text-gray-400 font-mono">
                      {timeSlots.length} slot{timeSlots.length !== 1 ? 's' : ''} available
                    </span>
                  </div>

                  {timeSlots.length === 0 ? (
                    <div className="p-8 rounded-xl bg-white/[0.02] border border-white/10 text-center space-y-2">
                      <Clock className="w-6 h-6 text-gray-500 mx-auto" />
                      <p className="text-sm text-gray-300 font-medium">No open slots on this date.</p>
                      <p className="text-xs text-gray-500 max-w-sm mx-auto">
                        This date may be fully booked, outside scheduled hours, or within the coach's{' '}
                        {trainerSettings?.booking_notice_hours || 12}-hour advance notice requirement. Please select another day.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Morning slots */}
                      {slotGroups.morning.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">
                            Morning
                          </span>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                            {slotGroups.morning.map((slot, idx) => {
                              const isSlotSelected = selectedSlot?.start.getTime() === slot.start.getTime();
                              return (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => handleSlotSelect(slot)}
                                  className={`p-2.5 rounded-lg border text-xs font-mono font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                    isSlotSelected
                                      ? 'bg-emerald-400 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20 font-bold'
                                      : 'bg-white/5 border-white/10 text-gray-200 hover:bg-white/10 hover:border-white/20'
                                  }`}
                                >
                                  <Clock className="w-3 h-3" />
                                  <span>{formatTimeDisplay(slot.start)}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Afternoon slots */}
                      {slotGroups.afternoon.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">
                            Afternoon
                          </span>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                            {slotGroups.afternoon.map((slot, idx) => {
                              const isSlotSelected = selectedSlot?.start.getTime() === slot.start.getTime();
                              return (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => handleSlotSelect(slot)}
                                  className={`p-2.5 rounded-lg border text-xs font-mono font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                    isSlotSelected
                                      ? 'bg-emerald-400 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20 font-bold'
                                      : 'bg-white/5 border-white/10 text-gray-200 hover:bg-white/10 hover:border-white/20'
                                  }`}
                                >
                                  <Clock className="w-3 h-3" />
                                  <span>{formatTimeDisplay(slot.start)}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Evening slots */}
                      {slotGroups.evening.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">
                            Evening
                          </span>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                            {slotGroups.evening.map((slot, idx) => {
                              const isSlotSelected = selectedSlot?.start.getTime() === slot.start.getTime();
                              return (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => handleSlotSelect(slot)}
                                  className={`p-2.5 rounded-lg border text-xs font-mono font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                    isSlotSelected
                                      ? 'bg-emerald-400 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20 font-bold'
                                      : 'bg-white/5 border-white/10 text-gray-200 hover:bg-white/10 hover:border-white/20'
                                  }`}
                                >
                                  <Clock className="w-3 h-3" />
                                  <span>{formatTimeDisplay(slot.start)}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-300 hover:bg-white/5 border border-white/10 flex items-center gap-2 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back to Services</span>
                  </button>
                  <button
                    id="btn-step2-continue"
                    disabled={!selectedSlot}
                    onClick={() => setCurrentStep(3)}
                    className="px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>Continue to Details</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: CLIENT DETAILS FORM */}
            {currentStep === 3 && (
              <form onSubmit={handleSubmitBooking} className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div>
                    <h3 className="text-xl font-bold text-white">Enter Your Details</h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Your session confirmation and preparation details will be sent here.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-medium text-emerald-400">Step 3 of 3</span>
                </div>

                {formError && (
                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-gray-300">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="input-full-name"
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Jordan Miller"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-emerald-400 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-gray-300">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="input-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="jordan@example.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-emerald-400 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-gray-300">
                    Phone Number (SMS Notifications) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="input-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-emerald-400 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-gray-300">
                    Optional Coaching Notes / Goals / Injuries
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
                    <textarea
                      id="input-notes"
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Share your current lifting background, upcoming athletic events, or movement limitations..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-emerald-400 transition-colors resize-none"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-300 hover:bg-white/5 border border-white/10 flex items-center gap-2 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back to Calendar</span>
                  </button>

                  <button
                    id="btn-submit-booking"
                    type="submit"
                    disabled={submitting}
                    className="px-7 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Reserving Session...</span>
                      </>
                    ) : (
                      <>
                        <span>Confirm & Reserve Session</span>
                        <Check className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Dynamic Reservation Summary Box */}
          <div className="lg:col-span-4 bg-[#0c1017] border border-white/10 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                Reservation Summary
              </span>
              <span className="text-[11px] text-gray-400">Step {currentStep} of 3</span>
            </div>

            {selectedService ? (
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-bold text-white">{selectedService.name}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {selectedService.duration_minutes} min duration
                  </div>
                </div>

                {selectedDate && selectedSlot && (
                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-gray-200">
                      <CalendarIcon className="w-3.5 h-3.5 text-emerald-400" />
                      <span>
                        {selectedDate.toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-200">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{selectedSlot.label}</span>
                    </div>
                  </div>
                )}

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-medium">Session Fee:</span>
                  <span className="text-xl font-mono font-black text-white">
                    ${Number(selectedService.price).toFixed(0)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-gray-500">
                Please select a coaching service to begin.
              </div>
            )}

            {/* Coach Policies */}
            <div className="pt-4 border-t border-white/5 space-y-2 text-[11px] text-gray-400">
              <div className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">•</span>
                <span>Minimum {trainerSettings?.booking_notice_hours || 12}h advance booking notice required.</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">•</span>
                <span>Includes biomechanical analysis and movement warm-up protocol.</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">•</span>
                <span>Free cancellation up to 24 hours prior to session.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {confirmedAppointment && selectedService && (
        <BookingSuccessModal
          appointment={confirmedAppointment}
          service={selectedService}
          trainerSettings={trainerSettings}
          onClose={resetBookingFlow}
        />
      )}
    </section>
  );
};
