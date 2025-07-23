/*
  # Insert sample events

  1. Sample Data
    - Insert sample events to demonstrate the application
    - Events span across different categories and dates
    - Mix of current, past, and future events

  2. Purpose
    - Provides immediate data for testing
    - Shows various event types and categories
    - Demonstrates the calendar functionality
*/

-- Insert sample events
INSERT INTO events (title, description, start_date, end_date, start_time, end_time, location, category_id, external_link) VALUES
  (
    'Rapat Koordinasi Bulanan',
    'Rapat koordinasi rutin untuk membahas progress dan rencana kegiatan bulan depan. Agenda meliputi evaluasi program, perencanaan anggaran, dan koordinasi antar divisi.',
    CURRENT_DATE,
    CURRENT_DATE,
    '09:00',
    '11:00',
    'Ruang Rapat Utama, Lantai 3',
    'meeting',
    NULL
  ),
  (
    'Workshop Digital Marketing untuk UMKM',
    'Pelatihan intensif tentang strategi pemasaran digital untuk UMKM. Materi meliputi social media marketing, SEO, content marketing, dan e-commerce.',
    CURRENT_DATE + INTERVAL '1 day',
    CURRENT_DATE + INTERVAL '1 day',
    '13:00',
    '17:00',
    'Aula Serbaguna, Gedung Utama',
    'workshop',
    'https://example.com/workshop-digital-marketing'
  ),
  (
    'Seminar Teknologi Blockchain',
    'Seminar edukasi tentang teknologi blockchain dan cryptocurrency. Pembicara dari praktisi industri fintech terkemuka.',
    CURRENT_DATE + INTERVAL '3 days',
    CURRENT_DATE + INTERVAL '3 days',
    '14:00',
    '16:30',
    'Auditorium Teknologi',
    'seminar',
    'https://example.com/blockchain-seminar'
  ),
  (
    'Pelatihan Kepemimpinan',
    'Program pelatihan kepemimpinan untuk manager dan supervisor. Fokus pada leadership skills, team management, dan komunikasi efektif.',
    CURRENT_DATE + INTERVAL '5 days',
    CURRENT_DATE + INTERVAL '7 days',
    '08:30',
    '16:00',
    'Hotel Grand Ballroom',
    'training',
    NULL
  ),
  (
    'Konferensi Inovasi Pendidikan',
    'Konferensi nasional tentang inovasi dalam dunia pendidikan. Menghadirkan pembicara dari berbagai universitas dan institusi pendidikan.',
    CURRENT_DATE + INTERVAL '10 days',
    CURRENT_DATE + INTERVAL '12 days',
    '08:00',
    '17:00',
    'Convention Center Jakarta',
    'conference',
    'https://example.com/education-conference'
  ),
  (
    'Acara Bakti Sosial',
    'Kegiatan bakti sosial berupa pembagian sembako dan layanan kesehatan gratis untuk masyarakat kurang mampu.',
    CURRENT_DATE + INTERVAL '14 days',
    CURRENT_DATE + INTERVAL '14 days',
    '07:00',
    '12:00',
    'Lapangan Desa Sukamaju',
    'social',
    NULL
  )
ON CONFLICT DO NOTHING;