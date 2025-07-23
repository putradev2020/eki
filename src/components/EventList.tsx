import React, { useState } from 'react';
import { MapPin, Clock, Calendar, Eye, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Event } from '../types';
import { formatDate, formatTime } from '../utils/dateUtils';
import { EventDetailModal } from './EventDetailModal';

export function EventList() {
  const { state } = useApp();
  const { calendar } = state;
  const { filteredEvents } = calendar;
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const sortedEvents = [...filteredEvents].sort((a, b) => 
    new Date(a.startDate + ' ' + a.startTime).getTime() - new Date(b.startDate + ' ' + b.startTime).getTime()
  );

  const handleTitleClick = (event: Event) => {
    if (event.externalLink) {
      window.open(event.externalLink, '_blank', 'noopener,noreferrer');
    } else {
      setSelectedEvent(event);
    }
  };
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-800">Daftar Agenda</h3>
        <p className="text-sm text-gray-600 mt-1">
          Menampilkan {sortedEvents.length} agenda
        </p>
      </div>
      
      <div className="divide-y max-h-[600px] overflow-y-auto">
        {sortedEvents.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Tidak ada agenda yang ditemukan</p>
          </div>
        ) : (
          sortedEvents.map(event => (
            <div key={event.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${event.category.bgColor} ${event.category.color}`}>
                      {event.category.name}
                    </span>
                    {new Date(event.startDate) <= new Date() && new Date(event.endDate) >= new Date() && (
                      <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">
                        Sedang Berlangsung
                      </span>
                    )}
                  </div>
                  
                  <h4 
                    onClick={() => handleTitleClick(event)}
                    className={`font-semibold text-gray-800 mb-2 text-sm sm:text-base leading-tight ${
                      event.externalLink ? 'cursor-pointer hover:text-blue-600 transition-colors' : ''
                    }`}
                  >
                    {event.title}
                    {event.externalLink && (
                      <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 inline ml-1 opacity-60" />
                    )}
                  </h4>
                  
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span>
                        {formatDate(event.startDate)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span>{formatTime(event.startTime)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>
                  
                  <p className="text-xs sm:text-sm text-gray-600 mt-2 line-clamp-2">
                    {event.description}
                  </p>
                </div>
                
                <div className="flex flex-col space-y-2 ml-3 sm:ml-4 flex-shrink-0">
                  {event.externalLink && (
                    <button
                      onClick={() => window.open(event.externalLink, '_blank', 'noopener,noreferrer')}
                      className="flex items-center justify-center space-x-1 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md sm:rounded-lg transition-colors min-w-0"
                    >
                      <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Website</span>
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedEvent(event)}
                    className="flex items-center justify-center space-x-1 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-blue-600 hover:bg-blue-50 rounded-md sm:rounded-lg transition-colors min-w-0"
                  >
                    <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Detail</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}