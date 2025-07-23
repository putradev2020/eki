import React, { useState } from 'react';
import { Plus, Edit, Trash2, Settings } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Event } from '../../types';
import { EventForm } from './EventForm';
import { deleteEvent } from '../../services/eventService';
import { showConfirmDialog, showCRUDSuccessAlert, showErrorAlert, showLoadingAlert } from '../../utils/sweetAlert';
import Swal from 'sweetalert2';

export function AdminPanel() {
  const { state, dispatch } = useApp();
  const { calendar, user } = state;
  const { events } = calendar;
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  if (!user || user.role !== 'admin') {
    return null;
  }

  const handleAddEvent = () => {
    setEditingEvent(null);
    setIsFormOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsFormOpen(true);
  };

  const handleDeleteEvent = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    const eventTitle = event ? event.title : 'agenda ini';
    
    showConfirmDialog(
      'Konfirmasi Hapus Agenda',
      `Apakah Anda yakin ingin menghapus "${eventTitle}"? Tindakan ini tidak dapat dibatalkan.`,
      'Ya, Hapus!',
      'Batal'
    ).then(async (result) => {
      if (result.isConfirmed) {
        showLoadingAlert('Menghapus Agenda...', 'Mohon tunggu sebentar');
        
        try {
          await deleteEvent(eventId);
          Swal.close();
          dispatch({ type: 'DELETE_EVENT', payload: eventId });
          setTimeout(() => {
            showCRUDSuccessAlert('delete', eventTitle);
          }, 100);
        } catch (error) {
          console.error('Error deleting event:', error);
          Swal.close();
          showErrorAlert('Error Sistem', 'Gagal menghapus agenda. Silakan coba lagi.');
        }
      }
    });
  };

  const sortedEvents = [...events].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-3 sm:p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          <h3 className="text-base sm:text-lg font-semibold text-gray-800">Panel Admin</h3>
        </div>
        <button
          onClick={handleAddEvent}
          className="flex items-center justify-center space-x-1 sm:space-x-2 bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-md sm:rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base w-full sm:w-auto"
        >
          <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>Tambah Agenda</span>
        </button>
      </div>
      
      <div className="p-3 sm:p-4">
        <div className="mb-4">
          <h4 className="font-medium text-gray-800 mb-2 text-sm sm:text-base">Statistik</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-2 sm:p-3 rounded-md sm:rounded-lg">
              <div className="text-xl sm:text-2xl font-bold text-blue-600">{events.length}</div>
              <div className="text-xs sm:text-sm text-blue-700">Total Agenda</div>
            </div>
            <div className="bg-green-50 p-2 sm:p-3 rounded-md sm:rounded-lg">
              <div className="text-xl sm:text-2xl font-bold text-green-600">
                {events.filter(e => new Date(e.startDate) >= new Date()).length}
              </div>
              <div className="text-xs sm:text-sm text-green-700">Agenda Mendatang</div>
            </div>
            <div className="bg-orange-50 p-2 sm:p-3 rounded-md sm:rounded-lg">
              <div className="text-xl sm:text-2xl font-bold text-orange-600">
                {events.filter(e => new Date(e.startDate) <= new Date() && new Date(e.endDate) >= new Date()).length}
              </div>
              <div className="text-xs sm:text-sm text-orange-700">Sedang Berlangsung</div>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-800 mb-3 text-sm sm:text-base">Kelola Agenda</h4>
          <div className="space-y-2 max-h-80 sm:max-h-96 overflow-y-auto">
            {sortedEvents.map(event => (
              <div key={event.id} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-md sm:rounded-lg">
                <div className="flex-1">
                  <h5 className="font-medium text-gray-800 text-sm sm:text-base truncate">{event.title}</h5>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {event.startDate} • {event.startTime}
                  </p>
                </div>
                <div className="flex items-center space-x-1 sm:space-x-2 ml-2">
                  <button
                    onClick={() => handleEditEvent(event)}
                    className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-100 rounded-md sm:rounded-lg transition-colors"
                  >
                    <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="p-1.5 sm:p-2 text-red-600 hover:bg-red-100 rounded-md sm:rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {isFormOpen && (
        <EventForm
          event={editingEvent}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}