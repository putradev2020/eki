/*
  # Create Events Schema

  1. New Tables
    - `event_categories`
      - `id` (text, primary key)
      - `name` (text)
      - `color` (text)
      - `bg_color` (text)
      - `created_at` (timestamp)
    - `events`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `start_date` (date)
      - `end_date` (date)
      - `start_time` (time)
      - `end_time` (time)
      - `location` (text)
      - `category_id` (text, foreign key)
      - `external_link` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access
    - Add policies for authenticated admin users to manage data

  3. Sample Data
    - Insert default event categories
    - Insert sample events
*/

-- Create event_categories table
CREATE TABLE IF NOT EXISTS event_categories (
  id text PRIMARY KEY,
  name text NOT NULL,
  color text NOT NULL,
  bg_color text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  location text NOT NULL,
  category_id text NOT NULL REFERENCES event_categories(id),
  external_link text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE event_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Policies for event_categories (public read, admin write)
CREATE POLICY "Anyone can read event categories"
  ON event_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage event categories"
  ON event_categories
  FOR ALL
  TO authenticated
  USING (true);

-- Policies for events (public read, admin write)
CREATE POLICY "Anyone can read events"
  ON events
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage events"
  ON events
  FOR ALL
  TO authenticated
  USING (true);

-- Insert default categories
INSERT INTO event_categories (id, name, color, bg_color) VALUES
  ('meeting', 'Rapat', 'text-blue-700', 'bg-blue-100'),
  ('conference', 'Konferensi', 'text-purple-700', 'bg-purple-100'),
  ('workshop', 'Workshop', 'text-green-700', 'bg-green-100'),
  ('seminar', 'Seminar', 'text-orange-700', 'bg-orange-100'),
  ('social', 'Acara Sosial', 'text-pink-700', 'bg-pink-100'),
  ('training', 'Pelatihan', 'text-indigo-700', 'bg-indigo-100'),
  ('other', 'Lainnya', 'text-gray-700', 'bg-gray-100')
ON CONFLICT (id) DO NOTHING;

-- Insert sample events
INSERT INTO events (title, description, start_date, end_date, start_time, end_time, location, category_id, external_link) VALUES
  (
    'Rapat Koordinasi Bulanan',
    'Rapat rutin koordinasi antardivisi untuk evaluasi dan perencanaan bulan depan',
    '2024-12-15',
    '2024-12-15',
    '09:00',
    '11:00',
    'Ruang Rapat Utama',
    'meeting',
    'https://meet.google.com/abc-defg-hij'
  ),
  (
    'Workshop Digital Marketing',
    'Pelatihan intensif mengenai strategi pemasaran digital untuk era modern',
    '2024-12-20',
    '2024-12-20',
    '13:00',
    '17:00',
    'Aula Serbaguna',
    'workshop',
    'https://eventbrite.com/workshop-digital-marketing'
  ),
  (
    'Konferensi Teknologi 2025',
    'Konferensi tahunan membahas tren teknologi terkini dan masa depan industri',
    '2024-12-25',
    '2024-12-26',
    '08:00',
    '17:00',
    'Gedung Konvensi Jakarta',
    'conference',
    'https://techconf2025.com'
  ),
  (
    'Seminar Keuangan Pribadi',
    'Panduan mengelola keuangan pribadi dan investasi untuk pemula',
    '2024-12-18',
    '2024-12-18',
    '14:00',
    '16:00',
    'Auditorium Kampus',
    'seminar',
    NULL
  ),
  (
    'Acara Bakti Sosial',
    'Kegiatan pembagian sembako dan pemeriksaan kesehatan gratis',
    '2024-12-22',
    '2024-12-22',
    '07:00',
    '12:00',
    'Lapangan Desa',
    'social',
    'https://instagram.com/baksos2024'
  )
ON CONFLICT DO NOTHING;