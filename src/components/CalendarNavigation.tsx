import React from 'react';
import { ChevronLeft, ChevronRight, Calendar, List, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CalendarView } from '../types';
import { getMonthName, addMonths, addWeeks, addDays } from '../utils/dateUtils';

export function CalendarNavigation() {
  const { state, dispatch } = useApp();
  const { calendar } = state;
  const { currentDate, view } = calendar;

  const navigatePrevious = () => {
    let newDate: Date;
    switch (view) {
      case 'month':
        newDate = addMonths(currentDate, -1);
        break;
      case 'week':
        newDate = addWeeks(currentDate, -1);
        break;
      case 'day':
        newDate = addDays(currentDate, -1);
        break;
      default:
        newDate = currentDate;
    }
    dispatch({ type: 'SET_CURRENT_DATE', payload: newDate });
  };

  const navigateNext = () => {
    let newDate: Date;
    switch (view) {
      case 'month':
        newDate = addMonths(currentDate, 1);
        break;
      case 'week':
        newDate = addWeeks(currentDate, 1);
        break;
      case 'day':
        newDate = addDays(currentDate, 1);
        break;
      default:
        newDate = currentDate;
    }
    dispatch({ type: 'SET_CURRENT_DATE', payload: newDate });
  };

  const goToToday = () => {
    dispatch({ type: 'SET_CURRENT_DATE', payload: new Date() });
  };

  const changeView = (newView: CalendarView) => {
    dispatch({ type: 'SET_CALENDAR_VIEW', payload: newView });
  };

  const getTitle = () => {
    switch (view) {
      case 'month':
        return getMonthName(currentDate);
      case 'week':
        return `Minggu ${getMonthName(currentDate)}`;
      case 'day':
        return currentDate.toLocaleDateString('id-ID', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      default:
        return '';
    }
  };

  return (
    <div className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <button
                onClick={navigatePrevious}
                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-md sm:rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={navigateNext}
                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-md sm:rounded-lg transition-colors"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
            
            <button
              onClick={goToToday}
              className="px-2 sm:px-3 py-1.5 sm:py-2 bg-blue-600 text-white rounded-md sm:rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm"
            >
              Hari Ini
            </button>
            
            <h2 className="text-base sm:text-xl font-semibold text-gray-800 truncate">
              {getTitle()}
            </h2>
          </div>

          <div className="flex bg-gray-100 rounded-md sm:rounded-lg p-0.5 sm:p-1">
            <button
              onClick={() => changeView('month')}
              className={`flex items-center justify-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-sm sm:rounded-md transition-colors text-xs sm:text-sm ${
                view === 'month' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Bulan</span>
            </button>
            <button
              onClick={() => changeView('week')}
              className={`flex items-center justify-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-sm sm:rounded-md transition-colors text-xs sm:text-sm ${
                view === 'week' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <List className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Minggu</span>
            </button>
            <button
              onClick={() => changeView('day')}
              className={`flex items-center justify-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-sm sm:rounded-md transition-colors text-xs sm:text-sm ${
                view === 'day' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Hari</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}