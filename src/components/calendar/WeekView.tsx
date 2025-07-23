import React from 'react';
import { useApp } from '../../context/AppContext';
import { getWeekDates, getWeekDays, isSameDate, isToday, getEventsForDate } from '../../utils/dateUtils';
import { CalendarDatePopup } from './CalendarDatePopup';
import { EventDetailModal } from '../EventDetailModal';
import { Event } from '../../types';

export function WeekView() {
  const { state, dispatch } = useApp();
  const { calendar } = state;
  const { currentDate, selectedDate, filteredEvents } = calendar;
  const [popupDate, setPopupDate] = React.useState<Date | null>(null);
  const [popupEvents, setPopupEvents] = React.useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null);

  const weekDays = getWeekDays();
  const weekDates = getWeekDates(currentDate);

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

  const handleEventCardClick = (event: Event) => {
    if (event.externalLink) {
      window.open(event.externalLink, '_blank', 'noopener,noreferrer');
    } else {
      setSelectedEvent(event);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm">
      <div className="grid grid-cols-7 border-b">
        {weekDays.map((day, index) => {
          const date = weekDates[index];
          const isSelected = selectedDate && isSameDate(date, selectedDate);
            const dayEvents = getEventsForDate(filteredEvents, date);
          const isTodayDate = isToday(date);
          
          return (
            <div key={day} className="p-3 text-center border-r last:border-r-0">
              <div className="text-sm font-medium text-gray-500 mb-1">{day}</div>
              <div
                className={`text-lg font-semibold cursor-pointer p-2 rounded-lg transition-all duration-200 ${
                  isTodayDate ? 'bg-blue-500 text-white' : 'text-gray-900'
                } ${isSelected ? 'bg-blue-100 text-blue-800' : ''} ${
                    dayEvents.length > 0 ? 'hover:shadow-md hover:scale-105' : ''
                  }`}
                onClick={() => handleDateClick(date)}
              >
                {date.getDate()}
                {dayEvents.length > 0 && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto mt-1 animate-pulse"></div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="grid grid-cols-7">
        {weekDates.map((date, index) => {
          const dayEvents = getEventsForDate(filteredEvents, date);
          
          return (
            <div key={index} className="min-h-[400px] p-2 border-r last:border-r-0">
              <div className="space-y-2">
                {dayEvents.map(event => (
                  <div
                    key={event.id}
                    className={`p-2 rounded text-sm ${event.category.bgColor} ${event.category.color} cursor-pointer hover:opacity-80`}
                    onClick={() => handleEventCardClick(event)}
                  >
                    <div className="font-medium truncate">{event.title}</div>
                    <div className="text-xs mt-1">
                      {event.startTime}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
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