-- ============================================================
-- Migration: Hero Buttons + About Us + Scheduling System
-- Date: 2024-01-01
-- Description:
--   1. Add About Us fields to config table
--   2. Create work_schedules table
--   3. Add scheduling columns to booking_requests table
--   4. Seed work_schedules with 7 weekdays
--   5. Enable RLS on work_schedules
-- ============================================================

-- ============================================================
-- 1. Add About Us fields to config table
-- ============================================================
ALTER TABLE config
  ADD COLUMN IF NOT EXISTS about_us_title TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS about_us_subtitle TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS about_us_description TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS about_us_full_description TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS about_us_video TEXT DEFAULT '';

-- ============================================================
-- 2. Create work_schedules table
-- ============================================================
CREATE TABLE IF NOT EXISTS work_schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  day_of_week SMALLINT NOT NULL UNIQUE CHECK (day_of_week >= 0 AND day_of_week <= 6),
  is_working_day BOOLEAN NOT NULL DEFAULT false,
  start_time TIME DEFAULT NULL,
  end_time TIME DEFAULT NULL,
  max_requests INTEGER NOT NULL DEFAULT 0 CHECK (max_requests >= 0),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE work_schedules ENABLE ROW LEVEL SECURITY;

-- RLS policies for work_schedules (authenticated users can do everything)
CREATE POLICY "Authenticated users can view work schedules"
  ON work_schedules FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert work schedules"
  ON work_schedules FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update work schedules"
  ON work_schedules FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete work schedules"
  ON work_schedules FOR DELETE
  TO authenticated
  USING (true);

-- Public can read schedules (needed for booking flow)
CREATE POLICY "Public can view work schedules"
  ON work_schedules FOR SELECT
  TO anon
  USING (true);

-- ============================================================
-- 3. Add scheduling columns to booking_requests table
-- ============================================================
ALTER TABLE booking_requests
  ADD COLUMN IF NOT EXISTS scheduled_date DATE DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS scheduled_day_of_week SMALLINT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS scheduled_start_time TIME DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS scheduled_end_time TIME DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS schedule_status TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS schedule_note TEXT DEFAULT NULL;

-- ============================================================
-- 4. Seed work_schedules with 7 weekdays (Mon-Fri working)
-- ============================================================
INSERT INTO work_schedules (day_of_week, is_working_day, start_time, end_time, max_requests)
VALUES
  (0, false, NULL, NULL, 0),    -- Sunday
  (1, true, '09:00', '17:00', 10),  -- Monday
  (2, true, '09:00', '17:00', 10),  -- Tuesday
  (3, true, '09:00', '17:00', 10),  -- Wednesday
  (4, true, '09:00', '17:00', 10),  -- Thursday
  (5, true, '09:00', '17:00', 10),  -- Friday
  (6, false, NULL, NULL, 0)     -- Saturday
ON CONFLICT (day_of_week) DO NOTHING;

-- ============================================================
-- 5. Update RLS for booking_requests to allow scheduled_date reads
--    (Existing policies should already cover this, but ensure
--     the public insert policy includes new columns)
-- ============================================================
-- If you previously created RLS policies for booking_requests,
-- they should automatically cover new columns. No extra action needed.
-- If you need to recreate the public insert policy:
-- CREATE POLICY "Public can insert booking requests"
--   ON booking_requests FOR INSERT
--   TO anon
--   WITH CHECK (true);
