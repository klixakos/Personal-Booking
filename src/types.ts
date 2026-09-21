export interface Service {
  id: string;
  name: string;
  description: string;
  duration_minutes: number;
  price: number;
  is_active: boolean;
  created_at?: string;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Appointment {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  service_id: string;
  appointment_date: string; // YYYY-MM-DD
  start_time: string; // HH:mm:ss or HH:mm
  end_time: string; // HH:mm:ss or HH:mm
  status: AppointmentStatus;
  notes: string | null;
  created_at?: string;
  // Join helper if loaded with service
  service?: Service;
}

export interface BusinessHours {
  id: string;
  weekday: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday (or 1-7)
  is_open: boolean;
  start_time: string; // "08:00" or "08:00:00"
  end_time: string; // "18:00" or "18:00:00"
}

export interface BlockedDate {
  id: string;
  blocked_date: string; // YYYY-MM-DD
  reason: string;
  created_at?: string;
}

export interface TrainerSettings {
  id: string;
  trainer_name: string;
  trainer_email: string;
  trainer_phone: string;
  trainer_address: string;
  slot_interval_minutes: number;
  booking_notice_hours: number;
  created_at?: string;
}

export interface AdminUser {
  id: string;
  user_id: string;
  created_at?: string;
}

export interface TimeSlot {
  start: Date;
  end: Date;
  label: string;
}

export interface BookingFormData {
  service_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  full_name: string;
  email: string;
  phone: string;
  notes?: string;
}
