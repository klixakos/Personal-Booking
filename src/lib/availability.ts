import { Service, BusinessHours, BlockedDate, TrainerSettings, Appointment, TimeSlot } from '../types';

/**
 * Format a Date object to YYYY-MM-DD string safely using local timezone.
 */
export function formatDateToYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format a Date object to HH:mm:ss for Supabase TIME column.
 */
export function formatTimeToHHMMSS(date: Date): string {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

/**
 * Format time for display (e.g. "9:00 AM", "2:30 PM").
 */
export function formatTimeDisplay(date: Date): string {
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
}

/**
 * Parses time string (e.g. "08:30" or "08:30:00") and returns hours and minutes.
 */
function parseTimeString(timeStr: string): { hours: number; minutes: number } {
  if (!timeStr) return { hours: 0, minutes: 0 };
  const parts = timeStr.split(':').map((part) => parseInt(part, 10));
  return {
    hours: isNaN(parts[0]) ? 0 : parts[0],
    minutes: isNaN(parts[1]) ? 0 : parts[1],
  };
}

/**
 * Generate available time slots based on:
 * - business_hours
 * - services.duration_minutes
 * - trainer_settings.slot_interval_minutes
 * - trainer_settings.booking_notice_hours
 * - blocked_dates
 * - existing appointments
 */
export function generateAvailableSlots({
  targetDate,
  service,
  businessHours,
  trainerSettings,
  blockedDates,
  appointments,
  currentTime = new Date(),
}: {
  targetDate: Date;
  service: Service;
  businessHours: BusinessHours[];
  trainerSettings: TrainerSettings | null;
  blockedDates: BlockedDate[];
  appointments: Appointment[];
  currentTime?: Date;
}): TimeSlot[] {
  if (!service || !targetDate) return [];

  const dateStr = formatDateToYYYYMMDD(targetDate);

  // 1. Check if the date is blocked
  const isBlocked = blockedDates.some((b) => b.blocked_date === dateStr);
  if (isBlocked) {
    return [];
  }

  // 2. Find business hours for this weekday (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const dayOfWeek = targetDate.getDay();
  const dayHours = businessHours.find((bh) => Number(bh.weekday) === dayOfWeek);

  if (!dayHours || !dayHours.is_open) {
    return [];
  }

  // 3. Determine business open and close Date objects for the target day
  const { hours: openH, minutes: openM } = parseTimeString(dayHours.start_time);
  const { hours: closeH, minutes: closeM } = parseTimeString(dayHours.end_time);

  const openDate = new Date(
    targetDate.getFullYear(),
    targetDate.getMonth(),
    targetDate.getDate(),
    openH,
    openM,
    0,
    0
  );

  const closeDate = new Date(
    targetDate.getFullYear(),
    targetDate.getMonth(),
    targetDate.getDate(),
    closeH,
    closeM,
    0,
    0
  );

  // If business hours close before or equal to open, return empty
  if (closeDate <= openDate) {
    return [];
  }

  // 4. Calculate minimum booking time respecting trainer's notice hours
  const noticeHours = trainerSettings?.booking_notice_hours ?? 12;
  const minimumBookingTime = new Date(currentTime.getTime() + noticeHours * 60 * 60 * 1000);

  // 5. Durations and intervals
  const durationMinutes = Math.max(15, service.duration_minutes || 60);
  const intervalMinutes = Math.max(15, trainerSettings?.slot_interval_minutes || 60);

  // 6. Filter active appointments on this date (ignoring cancelled)
  const activeDayAppointments = appointments
    .filter((a) => a.appointment_date === dateStr && a.status !== 'cancelled')
    .map((a) => {
      const startParts = parseTimeString(a.start_time);
      const endParts = parseTimeString(a.end_time);
      const start = new Date(
        targetDate.getFullYear(),
        targetDate.getMonth(),
        targetDate.getDate(),
        startParts.hours,
        startParts.minutes,
        0,
        0
      );
      const end = new Date(
        targetDate.getFullYear(),
        targetDate.getMonth(),
        targetDate.getDate(),
        endParts.hours,
        endParts.minutes,
        0,
        0
      );
      return { start, end };
    });

  // 7. Generate slots starting from openDate in interval increments
  const slots: TimeSlot[] = [];
  let currentSlotStart = new Date(openDate.getTime());

  while (currentSlotStart < closeDate) {
    const candidateEnd = new Date(currentSlotStart.getTime() + durationMinutes * 60 * 1000);

    // Cannot extend past closing time
    if (candidateEnd > closeDate) {
      break;
    }

    // Must respect minimum notice period
    if (currentSlotStart >= minimumBookingTime) {
      // Overlap check rule:
      // Overlap occurs if new_start < existing_end AND new_end > existing_start
      const hasConflict = activeDayAppointments.some((appt) => {
        return currentSlotStart < appt.end && candidateEnd > appt.start;
      });

      if (!hasConflict) {
        slots.push({
          start: new Date(currentSlotStart.getTime()),
          end: new Date(candidateEnd.getTime()),
          label: `${formatTimeDisplay(currentSlotStart)} - ${formatTimeDisplay(candidateEnd)}`,
        });
      }
    }

    // Step by interval
    currentSlotStart = new Date(currentSlotStart.getTime() + intervalMinutes * 60 * 1000);
  }

  return slots;
}
