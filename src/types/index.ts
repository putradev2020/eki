export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location: string;
  category: EventCategory;
  externalLink?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventCategory {
  id: string;
  name: string;
  color: string;
  bgColor: string;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'public';
  name: string;
}

export interface CalendarFilter {
  category: string;
  search: string;
  startDate: string;
  endDate: string;
}

export type CalendarView = 'month' | 'week' | 'day';

export interface CalendarState {
  currentDate: Date;
  view: CalendarView;
  selectedDate: Date | null;
  events: Event[];
  filteredEvents: Event[];
  filter: CalendarFilter;
}