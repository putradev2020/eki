import React from 'react';
import { Calendar, User, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { signOut } from '../lib/supabase';
import { showInfoAlert, showErrorAlert } from '../utils/sweetAlert';

interface HeaderProps {
  onShowLogin: () => void;
}

export function Header({ onShowLogin }: HeaderProps) {
  const { state, dispatch } = useApp();
  const { user } = state;

  const handleLogout = async () => {
    try {
      await signOut();
      dispatch({ type: 'SET_USER', payload: null });
      setTimeout(() => {
        showInfoAlert('Logout Berhasil', 'Anda telah berhasil keluar dari sistem');
      }, 100);
    } catch (error) {
      console.error('Logout error:', error);
      showErrorAlert('Error Logout', 'Gagal melakukan logout. Silakan coba lagi.');
    }
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-lg">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <Calendar className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" />
            <div>
              <h1 className="text-lg sm:text-2xl font-bold leading-tight">Agenda Kegiatan Publik</h1>
              <p className="text-blue-100 text-xs sm:text-sm hidden sm:block">Sistem Informasi Agenda Terpadu</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            {user ? (
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-medium text-sm sm:text-base hidden sm:inline">{user.name}</span>
                  <span className="bg-blue-500 text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                    {user.role === 'admin' ? 'Admin' : 'Publik'}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 sm:space-x-2 bg-white/10 hover:bg-white/20 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md sm:rounded-lg transition-colors text-sm sm:text-base"
                >
                  <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onShowLogin}
                className="bg-white text-blue-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg font-medium hover:bg-blue-50 transition-colors text-sm sm:text-base"
              >
                <span className="hidden sm:inline">Login Admin</span>
                <span className="sm:hidden">Login</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}