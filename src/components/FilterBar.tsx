import React from 'react';
import { Search, Filter, X, Download, Printer } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { exportToCSV, printCalendar } from '../utils/exportUtils';
import { fetchEventCategories } from '../services/eventService';
import { EventCategory } from '../types';
import { showInfoAlert } from '../utils/sweetAlert';

export function FilterBar() {
  const { state, dispatch } = useApp();
  const { calendar } = state;
  const { filter, filteredEvents } = calendar;
  const [categories, setCategories] = React.useState<EventCategory[]>([]);

  React.useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await fetchEventCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };
    loadCategories();
  }, []);

  const handleFilterChange = (key: keyof typeof filter, value: string) => {
    dispatch({
      type: 'SET_FILTER',
      payload: { ...filter, [key]: value }
    });
  };

  const resetFilters = () => {
    dispatch({
      type: 'SET_FILTER',
      payload: {
        category: '',
        search: '',
        startDate: '',
        endDate: ''
      }
    });
  };

  const handleExportCSV = () => {
    // Store current events for print function
    localStorage.setItem('currentEvents', JSON.stringify(filteredEvents));
    exportToCSV(filteredEvents);
    showInfoAlert('Export Berhasil', `${filteredEvents.length} agenda berhasil diekspor ke file CSV`);
  };

  const handlePrint = () => {
    // Store current events for print function
    localStorage.setItem('currentEvents', JSON.stringify(filteredEvents));
    printCalendar();
    showInfoAlert('Print Dimulai', 'Halaman cetak telah dibuka di tab baru');
  };

  return (
    <div className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 sm:space-y-4 lg:space-y-0">
          <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-3 lg:space-x-4">
            <div className="relative">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari agenda..."
                value={filter.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 border border-gray-300 rounded-md sm:rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64 text-sm sm:text-base"
              />
            </div>

            <select
              value={filter.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="px-2 sm:px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md sm:rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            >
              <option value="">Semua Kategori</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <div className="flex space-x-2 sm:space-x-3">
              <input
                type="date"
                value={filter.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="px-2 sm:px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md sm:rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base flex-1"
              />
              <input
                type="date"
                value={filter.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="px-2 sm:px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md sm:rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base flex-1"
              />
            </div>

            {(filter.category || filter.search || filter.startDate || filter.endDate) && (
              <button
                onClick={resetFilters}
                className="flex items-center justify-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 sm:py-2.5 text-gray-600 hover:bg-gray-100 rounded-md sm:rounded-lg transition-colors text-sm sm:text-base"
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <span className="text-gray-600 text-xs sm:text-sm text-center sm:text-left">
              {filteredEvents.length} agenda ditemukan
            </span>
            <div className="flex space-x-2 justify-center sm:justify-start">
              <button
                onClick={handleExportCSV}
                className="flex items-center justify-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-green-600 text-white rounded-md sm:rounded-lg hover:bg-green-700 transition-colors text-xs sm:text-sm"
              >
                <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Export CSV</span>
                <span className="sm:hidden">CSV</span>
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center justify-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-600 text-white rounded-md sm:rounded-lg hover:bg-gray-700 transition-colors text-xs sm:text-sm"
              >
                <Printer className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Cetak</span>
                <span className="sm:hidden">Print</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}