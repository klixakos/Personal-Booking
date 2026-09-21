/**
 * Supabase SQL Schema for the Personal Trainer Booking & Admin Platform.
 * Matches required schema fields exactly:
 * - services
 * - appointments
 * - business_hours
 * - blocked_dates
 * - trainer_settings
 * - admin_users
 */

export const SUPABASE_SETUP_SQL = `-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Services Table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  price NUMERIC(10, 2) NOT NULL DEFAULT 120.00,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
  appointment_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Business Hours Table (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
CREATE TABLE IF NOT EXISTS business_hours (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  weekday INTEGER NOT NULL UNIQUE CHECK (weekday >= 0 AND weekday <= 6),
  is_open BOOLEAN NOT NULL DEFAULT true,
  start_time TIME NOT NULL DEFAULT '07:00:00',
  end_time TIME NOT NULL DEFAULT '19:00:00'
);

-- 5. Blocked Dates Table
CREATE TABLE IF NOT EXISTS blocked_dates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  blocked_date DATE NOT NULL UNIQUE,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Trainer Settings Table
CREATE TABLE IF NOT EXISTS trainer_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trainer_name TEXT NOT NULL,
  trainer_email TEXT NOT NULL,
  trainer_phone TEXT NOT NULL,
  trainer_address TEXT NOT NULL,
  slot_interval_minutes INTEGER NOT NULL DEFAULT 60,
  booking_notice_hours INTEGER NOT NULL DEFAULT 12,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Admin Users Table (Authorized via user_id foreign key to auth.users)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Row Level Security (RLS) Enablement
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainer_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- 9. RLS Policies
-- Services: Public read active; Admins full access
CREATE POLICY "Public read active services" ON services FOR SELECT USING (is_active = true OR auth.uid() IN (SELECT user_id FROM admin_users));
CREATE POLICY "Admins full services" ON services FOR ALL USING (auth.uid() IN (SELECT user_id FROM admin_users));

-- Business Hours: Public read; Admins full access
CREATE POLICY "Public read business_hours" ON business_hours FOR SELECT USING (true);
CREATE POLICY "Admins full business_hours" ON business_hours FOR ALL USING (auth.uid() IN (SELECT user_id FROM admin_users));

-- Blocked Dates: Public read; Admins full access
CREATE POLICY "Public read blocked_dates" ON blocked_dates FOR SELECT USING (true);
CREATE POLICY "Admins full blocked_dates" ON blocked_dates FOR ALL USING (auth.uid() IN (SELECT user_id FROM admin_users));

-- Trainer Settings: Public read; Admins full access
CREATE POLICY "Public read trainer_settings" ON trainer_settings FOR SELECT USING (true);
CREATE POLICY "Admins full trainer_settings" ON trainer_settings FOR ALL USING (auth.uid() IN (SELECT user_id FROM admin_users));

-- Appointments: Anyone can create; Admins can view/update all; Public can view occupied times to avoid double-booking
CREATE POLICY "Public insert appointments" ON appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read appointments for slots" ON appointments FOR SELECT USING (true);
CREATE POLICY "Admins full appointments" ON appointments FOR ALL USING (auth.uid() IN (SELECT user_id FROM admin_users));

-- Admin Users: Admins can view
CREATE POLICY "Admins view admin_users" ON admin_users FOR SELECT USING (auth.uid() IN (SELECT user_id FROM admin_users) OR auth.uid() = user_id);

-- 10. Initial Seed Data
INSERT INTO services (name, description, duration_minutes, price, is_active)
VALUES
  ('1-on-1 Personal Training Session', 'Intensive personalized strength, hypertrophy, or conditioning session with hands-on biomechanical feedback and tailored progression.', 60, 140.00, true),
  ('Movement & Performance Assessment', 'Full functional movement screen, joint mobility profiling, and individualized athletic roadmap development.', 75, 165.00, true),
  ('Strength & Power Coaching', 'Focused barbell technique, nervous system potentiation, and targeted power development for peak performance.', 60, 150.00, true),
  ('Athletic Mobility & Recovery', 'Active joint articulation, targeted myofascial release protocols, and nervous system down-regulation for restored movement capacity.', 45, 110.00, true),
  ('Semi-Private Duo Training', 'High-energy, shared coaching experience for two athletes targeting compound strength and functional conditioning.', 60, 190.00, true)
ON CONFLICT DO NOTHING;

INSERT INTO business_hours (weekday, is_open, start_time, end_time)
VALUES
  (1, true, '07:00:00', '19:00:00'), -- Monday
  (2, true, '07:00:00', '19:00:00'), -- Tuesday
  (3, true, '07:00:00', '19:00:00'), -- Wednesday
  (4, true, '07:00:00', '19:00:00'), -- Thursday
  (5, true, '07:00:00', '19:00:00'), -- Friday
  (6, true, '08:00:00', '14:00:00'), -- Saturday
  (0, false, '08:00:00', '14:00:00') -- Sunday (Closed)
ON CONFLICT (weekday) DO NOTHING;

INSERT INTO trainer_settings (trainer_name, trainer_email, trainer_phone, trainer_address, slot_interval_minutes, booking_notice_hours)
VALUES
  ('Marcus Vance', 'marcus@apexperformance.com', '+1 (415) 890-3240', '480 Performance Blvd, Studio 4A, San Francisco, CA', 60, 12)
ON CONFLICT DO NOTHING;
`;
