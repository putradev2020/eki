import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  getDaysInMonth, 
  getFirstDayOfMonth, 
  isSameDate, 
  isToday, 
  getEventsForDate,
  addDays,
  startOfMonth
} from '../../utils/dateUtils';
import { CalendarDatePopup } from './CalendarDatePopup';
import { EventDetailModal } from '../EventDetailModal';
import { Event } from '../../types';

export function MonthView() {
  const { state, dispatch } = useApp();
  const { calendar } = state;
  const { currentDate, selectedDate, filteredEvents } = calendar;
  const [popupDate, setPopupDate] = React.useState<Date | null>(null);
  const [popupEvents, setPopupEvents] = React.useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null);

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = getFirstDayOfMonth(currentDate);
  const startDate = addDays(startOfMonth(currentDate), -firstDayOfMonth);

  const handleDateClick = (date: Date) => {
    const dayEvents = getEventsForDate(filteredEvents, date);
    
    if (dayEvents.length > 0) {
      setPopupDate(date);
      setPopupEvents(dayEvents);
    } else {
      dispatch({ type: 'SET_SELECTED_DATE', payload: date });
    }
  };

  const handleClosePopup = () => {
    setPopupDate(null);
    setPopupEvents([]);
  };

  const handleEventClick = (event: Event) => {
    if (event.externalLink) {
      window.open(event.externalLink, '_blank', 'noopener,noreferrer');
    } else {
      setSelectedEvent(event);
    }
  };

  // Generate calendar grid (6 weeks x 7 days = 42 cells)
  const calendarDays = [];
  for (let i = 0; i < 42; i++) {
    const date = addDays(startDate, i);
    const isCurrentMonth = date.getMonth() === currentDate.getMonth();
    const isSelected = selectedDate && isSameDate(date, selectedDate);
    const isTodayDate = isToday(date);
    const dayEvents = getEventsForDate(filteredEvents, date);

    calendarDays.push(
      <div
        key={i}
        className={`min-h-[120px] p-2 border border-gray-200 cursor-pointer transition-all duration-200 ${
          !isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white hover:bg-gray-50'
        } ${isSelected ? 'bg-blue-50 border-blue-300' : ''} ${
          dayEvents.length > 0 ? 'hover:shadow-md hover:scale-[1.02]' : ''
        }`}
        onClick={() => handleDateClick(date)}
      >
        <div className={`text-sm font-medium mb-1 ${
          isTodayDate ? 'text-blue-600 font-bold' : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
        }`}>
          {date.getDate()}
          {isTodayDate && (
            <div className="w-2 h-2 bg-blue-500 rounded-full inline-block ml-1 animate-pulse"></div>
          )}
        </div>
        
        <div className="space-y-1">
          {dayEvents.slice(0, 3).map((event, index) => (
            <div
              key={event.id}
              className={`text-xs p-1 rounded truncate ${event.category.bgColor} ${event.category.color} hover:opacity-80 transition-opacity`}
              title={event.title}
            >
              {event.title}
            </div>
          ))}
          {dayEvents.length > 3 && (
            <div className="text-xs text-gray-500 font-medium">
              +{dayEvents.length - 3} lainnya
            </div>
          )}
        </div>
        
        {dayEvents.length > 0 && (
          <div className="absolute top-1 right-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm">
        {/* Days of week header */}
        <div className="grid grid-cols-7 border-b">
          {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => (
            <div key={day} className="p-3 text-center font-medium text-gray-500 border-r last:border-r-0">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7">
          {calendarDays}
        </div>
      </div>

      {popupDate && (
        <CalendarDatePopup
          date={popupDate}
          events={popupEvents}
          onClose={handleClosePopup}
          onEventClick={handleEventClick}
        />
      )}

      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </>
  );
}