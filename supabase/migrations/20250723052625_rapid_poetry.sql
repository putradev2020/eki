/*
  # Create events table

  1. New Tables
    - `events`
      - `id` (uuid, primary key) - Event unique identifier
      - `title` (text) - Event title
      - `description` (text) - Event description
      - `start_date` (date) - Event start date
      - `end_date` (date) - Event end date
      - `start_time` (time) - Event start time
      - `end_time` (time) - Event end time
      - `location` (text) - Event location
      - `category_id` (text) - Foreign key to event_categories
      - `external_link` (text, nullable) - Optional external website link
      - `created_at` (timestamp) - Creation timestamp
      - `updated_at` (timestamp) - Last update timestamp

  2. Security
    - Enable RLS on `events` table
    - Add policy for public read access
    - Add policy for authenticated users to manage events

  3. Constraints
    - Foreign key constraint to event_categories table
*/

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

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read events"
  ON events
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage events"
  ON events
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS events_start_date_idx ON events(start_date);
CREATE INDEX IF NOT EXISTS events_category_id_idx ON events(category_id);