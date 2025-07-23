import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Event, User, CalendarFilter, CalendarView, CalendarState } from '../types';

interface AppState {
  user: User | null;
  calendar: CalendarState;
  isLoading: boolean;
  notification: string | null;
}

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_CALENDAR_VIEW'; payload: CalendarView }
  | { type: 'SET_CURRENT_DATE'; payload: Date }
  | { type: 'SET_SELECTED_DATE'; payload: Date | null }
  | { type: 'SET_EVENTS'; payload: Event[] }
  | { type: 'ADD_EVENT'; payload: Event }
  | { type: 'UPDATE_EVENT'; payload: Event }
  | { type: 'DELETE_EVENT'; payload: string }
  | { type: 'SET_FILTER'; payload: CalendarFilter }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_NOTIFICATION'; payload: string | null };

const initialState: AppState = {
  user: null,
  calendar: {
    currentDate: new Date(),
    view: 'month' as CalendarView,
    selectedDate: null,
    events: [],
    filteredEvents: [],
    filter: {
      category: '',
      search: '',
      startDate: '',
      endDate: ''
    }
  },
  isLoading: false,
  notification: null
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_CALENDAR_VIEW':
      return {
        ...state,
        calendar: { ...state.calendar, view: action.payload }
      };
    case 'SET_CURRENT_DATE':
      return {
        ...state,
        calendar: { ...state.calendar, currentDate: action.payload }
      };
    case 'SET_SELECTED_DATE':
      return {
        ...state,
        calendar: { ...state.calendar, selectedDate: action.payload }
      };
    case 'SET_EVENTS':
      return {
        ...state,
        calendar: { 
          ...state.calendar, 
          events: action.payload,
          filteredEvents: filterEvents(action.payload, state.calendar.filter)
        }
      };
    case 'ADD_EVENT':
      const newEvents = [...state.calendar.events, action.payload];
      return {
        ...state,
        calendar: {
          ...state.calendar,
          events: newEvents,
          filteredEvents: filterEvents(newEvents, state.calendar.filter)
        }
      };
    case 'UPDATE_EVENT':
      const updatedEvents = state.calendar.events.map(event =>
        event.id === action.payload.id ? action.payload : event
      );
      return {
        ...state,
        calendar: {
          ...state.calendar,
          events: updatedEvents,
          filteredEvents: filterEvents(updatedEvents, state.calendar.filter)
        }
      };
    case 'DELETE_EVENT':
      const filteredEventsAfterDelete = state.calendar.events.filter(
        event => event.id !== action.payload
      );
      return {
        ...state,
        calendar: {
          ...state.calendar,
          events: filteredEventsAfterDelete,
          filteredEvents: filterEvents(filteredEventsAfterDelete, state.calendar.filter)
        }
      };
    case 'SET_FILTER':
      return {
        ...state,
        calendar: {
          ...state.calendar,
          filter: action.payload,
          filteredEvents: filterEvents(state.calendar.events, action.payload)
        }
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_NOTIFICATION':
      return { ...state, notification: action.payload };
    default:
      return state;
  }
}

function filterEvents(events: Event[], filter: CalendarFilter): Event[] {
  let filtered = events;

  if (filter.category) {
    filtered = filtered.filter(event => event.category.id === filter.category);
  }

  if (filter.search) {
    const searchLower = filter.search.toLowerCase();
    filtered = filtered.filter(event =>
      event.title.toLowerCase().includes(searchLower) ||
      event.description.toLowerCase().includes(searchLower) ||
      event.location.toLowerCase().includes(searchLower)
    );
  }

  if (filter.startDate) {
    filtered = filtered.filter(event => event.startDate >= filter.startDate);
  }

  if (filter.endDate) {
    filtered = filtered.filter(event => event.endDate <= filter.endDate);
  }

  return filtered;
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}