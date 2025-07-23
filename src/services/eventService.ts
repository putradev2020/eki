import { supabase } from '../lib/supabase';
import { Event, EventCategory } from '../types';

// Event Categories
export const fetchEventCategories = async (): Promise<EventCategory[]> => {
  const { data, error } = await supabase
    .from('event_categories')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    throw error;
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
    throw error;
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
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};