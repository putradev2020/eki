import React from 'react';
import { X, Calendar, Clock, MapPin, Tag, ExternalLink } from 'lucide-react';
import { Event } from '../types';
import { formatDate, formatTime } from '../utils/dateUtils';

interface EventDetailModalProps {
  event: Event;
  onClose: () => void;
}

export function EventDetailModal({ event, onClose }: EventDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Detail Agenda</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {event.title}
              </h3>
              <span className={`inline-block px-3 py-1 text-sm rounded-full ${event.category.bgColor} ${event.category.color}`}>
                {event.category.name}
              </span>
            </div>
            
            {event.externalLink && (
              <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-blue-700 font-medium mb-1">Link Eksternal</div>
                    <div className="text-xs sm:text-sm text-blue-600 break-all">{event.externalLink}</div>
                  </div>
                  <button
                    onClick={() => window.open(event.externalLink, '_blank', 'noopener,noreferrer')}
                    className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm ml-3"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="hidden sm:inline">Kunjungi Website</span>
                    <span className="sm:hidden">Buka</span>
                  </button>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" />
                <div>
                  <div className="text-sm text-gray-600">Tanggal</div>
                  <div className="font-medium text-sm sm:text-base">
                    {formatDate(event.startDate)}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" />
                <div>
                  <div className="text-sm text-gray-600">Waktu</div>
                  <div className="font-medium text-sm sm:text-base">
                    {formatTime(event.startTime)}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" />
                <div>
                  <div className="text-sm text-gray-600">Lokasi</div>
                  <div className="font-medium text-sm sm:text-base">{event.location}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" />
                <div>
                  <div className="text-sm text-gray-600">Kategori</div>
                  <div className="font-medium text-sm sm:text-base">{event.category.name}</div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-600 mb-2">Deskripsi</div>
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <p className="text-gray-800 leading-relaxed text-sm sm:text-base">{event.description}</p>
              </div>
            </div>
            
            <div className="text-xs text-gray-500 pt-4 border-t">
              Dibuat: {new Date(event.createdAt).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}