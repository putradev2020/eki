/*
  # Create event categories table

  1. New Tables
    - `event_categories`
      - `id` (text, primary key) - Category identifier
      - `name` (text) - Category display name
      - `color` (text) - Text color class for styling
      - `bg_color` (text) - Background color class for styling
      - `created_at` (timestamp) - Creation timestamp

  2. Security
    - Enable RLS on `event_categories` table
    - Add policy for public read access
    - Add policy for authenticated users to manage categories

  3. Sample Data
    - Insert default event categories with proper styling
*/

-- Create event categories table
CREATE TABLE IF NOT EXISTS event_categories (
  id text PRIMARY KEY,
  name text NOT NULL,
  color text NOT NULL,
  bg_color text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE event_categories ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read event categories"
  ON event_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage event categories"
  ON event_categories
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

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