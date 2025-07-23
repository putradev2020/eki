import React from 'react';
import { useApp } from '../../context/AppContext';
import { getHourlyEvents } from '../../utils/dateUtils';

export function DayView() {
  const { state } = useApp();
  const { calendar } = state;
  const { currentDate, filteredEvents } = calendar;

  const hourlyEvents = getHourlyEvents(filteredEvents, currentDate);
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0') + ':00');

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">
          {currentDate.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </h3>
      </div>
      
      <div className="max-h-[600px] overflow-y-auto">
        {hours.map(hour => (
          <div key={hour} className="flex border-b">
            <div className="w-16 p-3 text-sm text-gray-500 font-medium border-r">
              {hour}
            </div>
            <div className="flex-1 p-3 min-h-[60px]">
              <div className="space-y-2">
                {hourlyEvents[hour].map(event => (
                  <div
                    key={event.id}
                    className={`p-2 rounded text-sm ${event.category.bgColor} ${event.category.color}`}
                  >
                    <div className="font-medium">{event.title}</div>
                    <div className="text-xs mt-1">
                      {event.startTime} | {event.location}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}