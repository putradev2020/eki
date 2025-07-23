import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Event } from '../../types';
import { createEvent, updateEvent, fetchEventCategories } from '../../services/eventService';
import { EventCategory } from '../../types';
import { showCRUDSuccessAlert, showErrorAlert, showLoadingAlert } from '../../utils/sweetAlert';
import Swal from 'sweetalert2';

interface EventFormProps {
  event?: Event | null;
  onClose: () => void;
}

export function EventForm({ event, onClose }: EventFormProps) {
  const { dispatch } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    startTime: '',
    location: '',
    categoryId: 'meeting',
    externalLink: ''
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await fetchEventCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };
    loadCategories();

    // Set default values for new events
    if (!event) {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const currentTime = now.toTimeString().slice(0, 5);
      
      setFormData(prev => ({
        ...prev,
        startDate: today,
        startTime: currentTime
      }));
    }
  }, []);

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description,
        startDate: event.startDate,
        startTime: event.startTime,
        location: event.location,
        categoryId: event.category.id,
        externalLink: event.externalLink || ''
      });
    }
  }, [event]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Show loading alert
    const actionText = event ? 'Memperbarui Agenda...' : 'Menambahkan Agenda...';
    showLoadingAlert(actionText, 'Mohon tunggu sebentar');

    try {
      const category = categories.find(cat => cat.id === formData.categoryId);
      if (!category) {
        Swal.close();
        showErrorAlert('Error Validasi', 'Kategori tidak ditemukan');
        return;
      }

      const eventData = {
        title: formData.title,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.startDate, // Same as start date
        startTime: formData.startTime,
        endTime: formData.startTime, // Same as start time
        location: formData.location,
        category,
        externalLink: formData.externalLink || undefined
      };

      let savedEvent: Event;
      if (event) {
        savedEvent = await updateEvent(event.id, eventData);
        Swal.close();
        dispatch({ type: 'UPDATE_EVENT', payload: savedEvent });
        setTimeout(() => {
          showCRUDSuccessAlert('update', 'Agenda');
        }, 100);
      } else {
        savedEvent = await createEvent(eventData);
        Swal.close();
        dispatch({ type: 'ADD_EVENT', payload: savedEvent });
        setTimeout(() => {
          showCRUDSuccessAlert('create', 'Agenda');
        }, 100);
      }
      onClose();
    } catch (error) {
      console.error('Error saving event:', error);
      Swal.close();
      showErrorAlert('Error Sistem', 'Gagal menyimpan agenda. Silakan coba lagi.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {event ? 'Edit Agenda' : 'Tambah Agenda Baru'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Judul Agenda *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Masukkan judul agenda"
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Deskripsi *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Masukkan deskripsi lengkap agenda"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal *
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Jam *
                </label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Lokasi *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Masukkan lokasi kegiatan"
              />
            </div>
            
            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                Kategori *
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="externalLink" className="block text-sm font-medium text-gray-700 mb-1">
                Link Eksternal (Opsional)
              </label>
              <input
                type="url"
                id="externalLink"
                name="externalLink"
                value={formData.externalLink}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com"
              />
              <p className="text-xs text-gray-500 mt-1">
                Link akan membuat judul agenda dapat diklik untuk membuka website eksternal
              </p>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                <span>{isLoading ? 'Menyimpan...' : 'Simpan'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}