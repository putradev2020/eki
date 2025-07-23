import { supabase, isSupabaseAvailable } from '../lib/supabase';
import { Event, EventCategory } from '../types';

// Mock data for when Supabase is not configured
const mockCategories: EventCategory[] = [
  { id: 'meeting', name: 'Rapat', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  { id: 'conference', name: 'Konferensi', color: 'text-purple-700', bgColor: 'bg-purple-100' },
  { id: 'workshop', name: 'Workshop', color: 'text-green-700', bgColor: 'bg-green-100' },
  { id: 'seminar', name: 'Seminar', color: 'text-orange-700', bgColor: 'bg-orange-100' },
  { id: 'social', name: 'Acara Sosial', color: 'text-pink-700', bgColor: 'bg-pink-100' },
  { id: 'training', name: 'Pelatihan', color: 'text-indigo-700', bgColor: 'bg-indigo-100' },
  { id: 'other', name: 'Lainnya', color: 'text-gray-700', bgColor: 'bg-gray-100' }
];

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Rapat Koordinasi Bulanan',
    description: 'Rapat koordinasi rutin untuk membahas progress dan rencana kegiatan bulan depan.',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '11:00',
    location: 'Ruang Rapat Utama',
    category: mockCategories[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Workshop Digital Marketing',
    description: 'Pelatihan intensif tentang strategi pemasaran digital untuk UMKM.',
    startDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    startTime: '13:00',
    endTime: '17:00',
    location: 'Aula Serbaguna',
    category: mockCategories[2],
    externalLink: 'https://example.com/workshop',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Event Categories
export const fetchEventCategories = async (): Promise<EventCategory[]> => {
  if (!isSupabaseAvailable()) {
    console.warn('Supabase not configured, returning mock categories');
    return mockCategories;
  }

  const { data, error } = await supabase
    .from('event_categories')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    console.warn('Falling back to mock categories');
    return mockCategories;
  }

  return data.map(category => ({
    id: category.id,
    name: category.name,
    color: category.color,
    bgColor: category.bg_color
  }));
};

// Events
export const fetchEvents = async (): Promise<Event[]> => {
  if (!isSupabaseAvailable()) {
    console.warn('Supabase not configured, returning mock events');
    return mockEvents;
  }

  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      event_categories (
        id,
        name,
        color,
        bg_color
      )
    `)
    .order('start_date', { ascending: true });

  if (error) {
    console.error('Error fetching events:', error);
    console.warn('Falling back to mock events');
    return mockEvents;
  }

  return data.map(event => ({
    id: event.id,
    title: event.title,
    description: event.description,
    startDate: event.start_date,
    endDate: event.end_date,
    startTime: event.start_time,
    endTime: event.end_time,
    location: event.location,
    category: {
      id: event.event_categories.id,
      name: event.event_categories.name,
      color: event.event_categories.color,
      bgColor: event.event_categories.bg_color
    },
    externalLink: event.external_link || undefined,
    createdAt: event.created_at,
    updatedAt: event.updated_at
  }));
};

export const createEvent = async (eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<Event> => {
  if (!isSupabaseAvailable()) {
    throw new Error('Supabase not configured. Please set up your environment variables to create events.');
  }

  const { data, error } = await supabase
    .from('events')
    .insert({
      title: eventData.title,
      description: eventData.description,
      start_date: eventData.startDate,
      end_date: eventData.endDate,
      start_time: eventData.startTime,
      end_time: eventData.endTime,
      location: eventData.location,
      category_id: eventData.category.id,
      external_link: eventData.externalLink || null
    })
    .select(`
      *,
      event_categories (
        id,
        name,
        color,
        bg_color
      )
    `)
    .single();

  if (error) {
    console.error('Error creating event:', error);
    throw error;
  }

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    startDate: data.start_date,
    endDate: data.end_date,
    startTime: data.start_time,
    endTime: data.end_time,
    location: data.location,
    category: {
      id: data.event_categories.id,
      name: data.event_categories.name,
      color: data.event_categories.color,
      bgColor: data.event_categories.bg_color
    },
    externalLink: data.external_link || undefined,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
};

export const updateEvent = async (id: string, eventData: Partial<Omit<Event, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Event> => {
  if (!isSupabaseAvailable()) {
    throw new Error('Supabase not configured. Please set up your environment variables to update events.');
  }

  const updateData: any = {
    updated_at: new Date().toISOString()
  };

  if (eventData.title) updateData.title = eventData.title;
  if (eventData.description) updateData.description = eventData.description;
  if (eventData.startDate) updateData.start_date = eventData.startDate;
  if (eventData.endDate) updateData.end_date = eventData.endDate;
  if (eventData.startTime) updateData.start_time = eventData.startTime;
  if (eventData.endTime) updateData.end_time = eventData.endTime;
  if (eventData.location) updateData.location = eventData.location;
  if (eventData.category) updateData.category_id = eventData.category.id;
  if (eventData.externalLink !== undefined) updateData.external_link = eventData.externalLink || null;

  const { data, error } = await supabase
    .from('events')
    .update(updateData)
    .eq('id', id)
    .select(`
      *,
      event_categories (
        id,
        name,
        color,
        bg_color
      )
    `)
    .single();

  if (error) {
    console.error('Error updating event:', error);
    throw error;
  }

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    startDate: data.start_date,
    endDate: data.end_date,
    startTime: data.start_time,
    endTime: data.end_time,
    location: data.location,
    category: {
      id: data.event_categories.id,
      name: data.event_categories.name,
      color: data.event_categories.color,
      bgColor: data.event_categories.bg_color
    },
    externalLink: data.external_link || undefined,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
};

export const deleteEvent = async (id: string): Promise<void> => {
  if (!isSupabaseAvailable()) {
    throw new Error('Supabase not configured. Please set up your environment variables to delete events.');
  }

  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};