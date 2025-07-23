import React, { useState, useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { CalendarNavigation } from './components/CalendarNavigation';
import { MonthView } from './components/calendar/MonthView';
import { WeekView } from './components/calendar/WeekView';
import { DayView } from './components/calendar/DayView';
import { EventList } from './components/EventList';
import { AdminPanel } from './components/admin/AdminPanel';
import { LoginModal } from './components/auth/LoginModal';
import { Notification } from './components/Notification';
import { useApp } from './context/AppContext';
import { Github } from 'lucide-react';
import { fetchEvents, fetchEventCategories } from './services/eventService';
import { getCurrentUser } from './lib/supabase';

function CalendarContent() {
  const { state } = useApp();
  const { calendar } = state;
  const { view } = calendar;

  const renderCalendarView = () => {
    switch (view) {
      case 'month':
        return <MonthView />;
      case 'week':
        return <WeekView />;
      case 'day':
        return <DayView />;
      default:
        return <MonthView />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        {renderCalendarView()}
      </div>
      <div className="space-y-6">
        <EventList />
        <AdminPanel />
      </div>
    </div>
  );
}

function AppContent() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { dispatch } = useApp();

  useEffect(() => {
    // Load initial data
    const loadData = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        
        // Load events
        const events = await fetchEvents();
        dispatch({ type: 'SET_EVENTS', payload: events });
        
        // Check for existing user session
        const { user } = await getCurrentUser();
        if (user) {
          dispatch({
            type: 'SET_USER',
            payload: {
              id: user.id,
              email: user.email || '',
              role: 'admin',
              name: user.user_metadata?.name || 'Administrator'
            }
          });
        }
      } catch (error) {
        console.error('Error loading data:', error);
        dispatch({ type: 'SET_NOTIFICATION', payload: 'Gagal memuat data' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadData();
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header onShowLogin={() => setShowLoginModal(true)} />
      <FilterBar />
      <CalendarNavigation />
      
      <main className="flex-1 container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <CalendarContent />
      </main>
      
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-xs sm:text-sm text-center">© 2025 Agenda Kegiatan Publik - Dibuat oleh</span>
            <a 
              href="https://github.com/jambidev" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-1 sm:space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <Github className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="font-medium text-xs sm:text-sm">Mardiato Eka Saputra</span>
            </a>
          </div>
        </div>
      </footer>
      
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
      
      <Notification />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;