import { supabase, isSupabaseConfigured } from './supabase';
import {
  Service,
  Appointment,
  BusinessHours,
  BlockedDate,
  TrainerSettings,
  AppointmentStatus,
  BookingFormData,
} from '../types';

// Default initial state when tables are empty or before first Supabase sync
export const DEFAULT_SERVICES: Service[] = [
  {
    id: 's1',
    name: '1-on-1 Personal Training Session',
    description: 'Comprehensive personalized strength, hypertrophy, or conditioning session with real-time biomechanical feedback, movement correction, and tailored progression.',
    duration_minutes: 60,
    price: 140.0,
    is_active: true,
  },
  {
    id: 's2',
    name: 'Movement & Biomechanics Assessment',
    description: 'Complete functional movement screen, joint mobility profiling, strength imbalance diagnostics, and individualized athletic training roadmap.',
    duration_minutes: 75,
    price: 165.0,
    is_active: true,
  },
  {
    id: 's3',
    name: 'Strength & Power Coaching',
    description: 'Focused barbell technique, rate of force development, nervous system potentiation, and Olympic/compound lifting precision for peak athletic output.',
    duration_minutes: 60,
    price: 150.0,
    is_active: true,
  },
  {
    id: 's4',
    name: 'Athletic Mobility & Active Recovery',
    description: 'Targeted joint capsule articulation, functional range conditioning, myofascial restoration protocols, and parasympathetic recovery optimization.',
    duration_minutes: 45,
    price: 110.0,
    is_active: true,
  },
  {
    id: 's5',
    name: 'Semi-Private Duo Training',
    description: 'High-intensity shared training for two training partners focusing on compound lifts, athletic conditioning, and collaborative accountability.',
    duration_minutes: 60,
    price: 190.0,
    is_active: true,
  },
];

export const DEFAULT_BUSINESS_HOURS: BusinessHours[] = [
  { id: 'bh-0', weekday: 0, is_open: false, start_time: '08:00:00', end_time: '14:00:00' }, // Sunday
  { id: 'bh-1', weekday: 1, is_open: true, start_time: '07:00:00', end_time: '19:00:00' }, // Monday
  { id: 'bh-2', weekday: 2, is_open: true, start_time: '07:00:00', end_time: '19:00:00' }, // Tuesday
  { id: 'bh-3', weekday: 3, is_open: true, start_time: '07:00:00', end_time: '19:00:00' }, // Wednesday
  { id: 'bh-4', weekday: 4, is_open: true, start_time: '07:00:00', end_time: '19:00:00' }, // Thursday
  { id: 'bh-5', weekday: 5, is_open: true, start_time: '07:00:00', end_time: '19:00:00' }, // Friday
  { id: 'bh-6', weekday: 6, is_open: true, start_time: '08:00:00', end_time: '15:00:00' }, // Saturday
];

export const DEFAULT_TRAINER_SETTINGS: TrainerSettings = {
  id: 'ts-default',
  trainer_name: 'Marcus Vance, CSCS',
  trainer_email: 'marcus@apexperformance.com',
  trainer_phone: '+1 (415) 890-3240',
  trainer_address: '480 Performance Blvd, Studio 4A, San Francisco, CA',
  slot_interval_minutes: 60,
  booking_notice_hours: 12,
};

// -------------------------------------------------------------
// Services API
// -------------------------------------------------------------
export async function getServices(activeOnly = true): Promise<Service[]> {
  if (!isSupabaseConfigured) {
    return activeOnly ? DEFAULT_SERVICES.filter((s) => s.is_active) : DEFAULT_SERVICES;
  }

  try {
    let query = supabase.from('services').select('*').order('created_at', { ascending: true });
    if (activeOnly) {
      query = query.eq('is_active', true);
    }
    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      console.warn('Supabase services query error or empty, using defaults:', error?.message);
      return activeOnly ? DEFAULT_SERVICES.filter((s) => s.is_active) : DEFAULT_SERVICES;
    }
    return data as Service[];
  } catch (err) {
    console.error('Error fetching services:', err);
    return activeOnly ? DEFAULT_SERVICES.filter((s) => s.is_active) : DEFAULT_SERVICES;
  }
}

export const fetchActiveServices = () => getServices(true);
export const fetchAllServices = () => getServices(false);

export async function createService(serviceData: {
  name: string;
  description: string;
  duration_minutes: number;
  price: number;
  is_active: boolean;
}): Promise<Service> {
  if (!isSupabaseConfigured) {
    const newService: Service = {
      ...serviceData,
      id: 'local-' + Date.now(),
      created_at: new Date().toISOString(),
    };
    return newService;
  }

  const { data, error } = await supabase.from('services').insert([serviceData]).select().single();
  if (error || !data) {
    throw new Error(error?.message || 'Failed to create service.');
  }
  return data as Service;
}

export async function updateService(
  id: string,
  updates: Partial<Omit<Service, 'id' | 'created_at'>>
): Promise<Service> {
  if (!isSupabaseConfigured) {
    return { id, name: '', description: '', duration_minutes: 60, price: 100, is_active: true, ...updates } as Service;
  }

  const { data, error } = await supabase
    .from('services')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error || !data) {
    throw new Error(error?.message || 'Failed to update service.');
  }
  return data as Service;
}

// -------------------------------------------------------------
// Appointments API
// -------------------------------------------------------------
export async function getAppointments(): Promise<Appointment[]> {
  if (!isSupabaseConfigured) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*, service:services(*)')
      .order('appointment_date', { ascending: true })
      .order('start_time', { ascending: true });

    if (error) {
      console.warn('Error fetching appointments:', error.message);
      return [];
    }
    return (data || []) as Appointment[];
  } catch (err) {
    console.error('Error fetching appointments:', err);
    return [];
  }
}

export const fetchAllAppointments = getAppointments;

export async function createAppointment(
  booking: BookingFormData
): Promise<Appointment> {
  if (!isSupabaseConfigured) {
    const mockAppt: Appointment = {
      id: 'mock-appt-' + Math.random().toString(36).substring(2, 9),
      ...booking,
      status: 'pending',
      notes: booking.notes || null,
      created_at: new Date().toISOString(),
    };
    return mockAppt;
  }

  const { data, error } = await supabase
    .from('appointments')
    .insert([
      {
        full_name: booking.full_name,
        email: booking.email,
        phone: booking.phone,
        service_id: booking.service_id,
        appointment_date: booking.appointment_date,
        start_time: booking.start_time,
        end_time: booking.end_time,
        status: 'pending',
        notes: booking.notes || null,
      },
    ])
    .select('*, service:services(*)')
    .single();

  if (error || !data) {
    throw new Error(error?.message || 'Failed to create appointment.');
  }
  return data as Appointment;
}

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus
): Promise<{ id: string; status: AppointmentStatus }> {
  if (!isSupabaseConfigured) {
    return { id, status };
  }

  const { error } = await supabase.from('appointments').update({ status }).eq('id', id);
  if (error) {
    throw new Error(error.message);
  }
  return { id, status };
}

// -------------------------------------------------------------
// Business Hours API
// -------------------------------------------------------------
export async function getBusinessHours(): Promise<BusinessHours[]> {
  if (!isSupabaseConfigured) {
    return DEFAULT_BUSINESS_HOURS;
  }

  try {
    const { data, error } = await supabase
      .from('business_hours')
      .select('*')
      .order('weekday', { ascending: true });

    if (error || !data || data.length === 0) {
      return DEFAULT_BUSINESS_HOURS;
    }
    return data as BusinessHours[];
  } catch (err) {
    console.error('Error fetching business hours:', err);
    return DEFAULT_BUSINESS_HOURS;
  }
}

export const fetchBusinessHours = getBusinessHours;

export async function saveBusinessHours(
  hours: BusinessHours[]
): Promise<BusinessHours[]> {
  if (!isSupabaseConfigured) {
    return hours;
  }

  for (const item of hours) {
    const { error } = await supabase
      .from('business_hours')
      .upsert({
        weekday: item.weekday,
        is_open: item.is_open,
        start_time: item.start_time,
        end_time: item.end_time,
      }, { onConflict: 'weekday' });
    if (error) {
      throw new Error(error.message);
    }
  }

  return await getBusinessHours();
}

export const updateBusinessHours = saveBusinessHours;

// -------------------------------------------------------------
// Blocked Dates API
// -------------------------------------------------------------
export async function getBlockedDates(): Promise<BlockedDate[]> {
  if (!isSupabaseConfigured) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('blocked_dates')
      .select('*')
      .order('blocked_date', { ascending: true });

    if (error) {
      return [];
    }
    return (data || []) as BlockedDate[];
  } catch (err) {
    console.error('Error fetching blocked dates:', err);
    return [];
  }
}

export const fetchBlockedDates = getBlockedDates;

export async function createBlockedDate(
  blocked_date: string,
  reason: string
): Promise<BlockedDate> {
  if (!isSupabaseConfigured) {
    return {
      id: 'local-' + Date.now(),
      blocked_date,
      reason,
      created_at: new Date().toISOString(),
    };
  }

  const { data, error } = await supabase
    .from('blocked_dates')
    .insert([{ blocked_date, reason }])
    .select()
    .single();

  if (error || !data) {
    throw new Error(error?.message || 'Failed to add blocked date.');
  }
  return data as BlockedDate;
}

export const addBlockedDate = createBlockedDate;

export async function deleteBlockedDate(id: string): Promise<{ success: boolean }> {
  if (!isSupabaseConfigured) {
    return { success: true };
  }

  const { error } = await supabase.from('blocked_dates').delete().eq('id', id);
  if (error) {
    throw new Error(error.message);
  }
  return { success: true };
}

// -------------------------------------------------------------
// Trainer Settings API
// -------------------------------------------------------------
export async function getTrainerSettings(): Promise<TrainerSettings> {
  if (!isSupabaseConfigured) {
    return DEFAULT_TRAINER_SETTINGS;
  }

  try {
    const { data, error } = await supabase
      .from('trainer_settings')
      .select('*')
      .limit(1)
      .single();

    if (error || !data) {
      return DEFAULT_TRAINER_SETTINGS;
    }
    return data as TrainerSettings;
  } catch (err) {
    console.error('Error fetching trainer settings:', err);
    return DEFAULT_TRAINER_SETTINGS;
  }
}

export const fetchTrainerSettings = getTrainerSettings;

export async function updateTrainerSettings(
  updates: Partial<Omit<TrainerSettings, 'id' | 'created_at'>>,
  existingId?: string
): Promise<TrainerSettings> {
  if (!isSupabaseConfigured) {
    return { ...DEFAULT_TRAINER_SETTINGS, ...updates };
  }

  let targetId = existingId;
  if (!targetId) {
    const current = await getTrainerSettings();
    targetId = current.id;
  }

  const { data, error } = await supabase
    .from('trainer_settings')
    .update(updates)
    .eq('id', targetId)
    .select()
    .single();

  if (error || !data) {
    throw new Error(error?.message || 'Failed to update trainer settings.');
  }
  return data as TrainerSettings;
}

// -------------------------------------------------------------
// Admin Verification API
// Check if user.id exists in admin_users.user_id
// -------------------------------------------------------------
export async function checkIsAdmin(userId: string): Promise<boolean> {
  if (!userId || !isSupabaseConfigured) {
    return false;
  }

  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('id, user_id')
      .eq('user_id', userId)
      .maybeSingle();

    if (error || !data) {
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error verifying admin authorization:', err);
    return false;
  }
}
