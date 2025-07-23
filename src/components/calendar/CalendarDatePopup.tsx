import React, { useEffect, useState } from 'react';
import { X, Calendar, Clock, MapPin, Eye } from 'lucide-react';
import { Event } from '../../types';
import { formatDate, formatTime } from '../../utils/dateUtils';

interface CalendarDatePopupProps {
  date: Date;
  events: Event[];
  onClose: () => void;
  onEventClick: (event: Event) => void;
}

export function CalendarDatePopup({ date, events, onClose, onEventClick }: CalendarDatePopupProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation to complete
  };

  const handleEventClick = (event: Event) => {
    onEventClick(event);
    handleClose();
  };

  return (
    <div 
      className={`fixed inset-0 bg-black transition-opacity duration-300 z-50 flex items-center justify-center p-4 ${
        isVisible ? 'bg-opacity-50' : 'bg-opacity-0'
      }`}
      onClick={handleClose}
    >
      <div 
        className={`bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden transform transition-all duration-300 ${
          isVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-75 opacity-0 translate-y-8'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-white opacity-10 transform -skew-y-1"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <h3 className="text-lg font-bold">Agenda Hari Ini</h3>
              </div>
              <button
                onClick={handleClose}
                className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-blue-100 text-sm">
              {formatDate(date.toISOString().split('T')[0])}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {events.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">Tidak ada agenda untuk hari ini</p>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total agenda</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                    {events.length} kegiatan
                  </span>
                </div>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {events.map((event, index) => (
                  <div
                    key={event.id}
                    className={`bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition-all duration-200 cursor-pointer transform hover:scale-[1.02] animate-slide-up`}
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`px-2 py-0.5 text-xs rounded-full ${event.category.bgColor} ${event.category.color}`}>
                            {event.category.name}
                          </span>
                          {new Date(event.startDate) <= new Date() && new Date(event.endDate) >= new Date() && (
                            <span className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded-full animate-pulse">
                              Berlangsung
                            </span>
                          )}
                        </div>
                        <h4 className="font-semibold text-gray-800 text-sm leading-tight mb-2">
                          {event.title}
                        </h4>
                      </div>
                      <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-1 text-xs text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-3 h-3 flex-shrink-0" />
                        <span>{formatTime(event.startTime)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                      {event.description}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-4 py-3 text-center">
          <p className="text-xs text-gray-500">
            Klik pada agenda untuk melihat detail lengkap
          </p>
        </div>
      </div>
    </div>
  );
}