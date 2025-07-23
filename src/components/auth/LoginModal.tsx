import React, { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { signInWithEmail, signUpWithEmail } from '../../lib/supabase';
import { showLoginSuccessAlert, showErrorAlert, showLoadingAlert } from '../../utils/sweetAlert';
import Swal from 'sweetalert2';

interface LoginModalProps {
  onClose: () => void;
}

export function LoginModal({ onClose }: LoginModalProps) {
  const { dispatch } = useApp();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Show loading alert
    showLoadingAlert('Memproses Login...', 'Mohon tunggu sebentar');

    try {
      const { data, error } = await signInWithEmail(formData.email, formData.password);
      
      if (error) {
        // Handle different error scenarios
        Swal.close();
        if (error.message === 'Invalid login credentials') {
          if (formData.email === 'admin@example.com' && formData.password === 'admin123') {
            // Try to create demo account if it doesn't exist
            try {
              showLoadingAlert('Membuat Akun Demo...', 'Sedang menyiapkan akun administrator');
              const { data: signUpData, error: signUpError } = await signUpWithEmail(
                'admin@example.com', 
                'admin123'
              );
              
              if (signUpError) {
                Swal.close();
                if (signUpError.message.includes('already registered')) {
                  showErrorAlert('Akun Sudah Terdaftar', 'Akun demo sudah ada tetapi password tidak cocok. Silakan gunakan kredensial yang benar.');
                } else {
                  showErrorAlert('Gagal Membuat Akun', 'Gagal membuat akun demo: ' + signUpError.message);
                }
                return;
              }
              
              if (signUpData.user) {
                Swal.close();
                dispatch({
                  type: 'SET_USER',
                  payload: {
                    id: signUpData.user.id,
                    email: signUpData.user.email || '',
                    role: 'admin',
                    name: 'Administrator'
                  }
                });
                await showLoginSuccessAlert('Administrator');
                onClose();
                return;
              }
            } catch (signUpError) {
              console.error('Sign up error:', signUpError);
              showErrorAlert('Gagal Membuat Akun Demo', 'Terjadi kesalahan saat membuat akun demo. Periksa konfigurasi Supabase Anda (RLS policies, database triggers) atau gunakan kredensial yang sudah ada.');
              return;
            }
          } else {
            showErrorAlert('Login Gagal', 'Email atau password salah. Periksa kembali kredensial Anda.');
            setError('Email atau password salah. Periksa kembali kredensial Anda.');
          }
        } else {
          showErrorAlert('Error Login', 'Login gagal: ' + error.message);
          setError('Login gagal: ' + error.message);
        }
        return;
      }

      if (data.user) {
        Swal.close();
        dispatch({
          type: 'SET_USER',
          payload: {
            id: data.user.id,
            email: data.user.email || '',
            role: 'admin',
            name: data.user.user_metadata?.name || 'Administrator'
          }
        });
        setTimeout(() => {
          showLoginSuccessAlert(data.user.user_metadata?.name || 'Administrator');
        }, 100);
        onClose();
      } else {
        Swal.close();
        showErrorAlert('Login Gagal', 'Data user tidak ditemukan');
        setError('Login gagal: Data user tidak ditemukan');
      }
    } catch (error) {
      console.error('Login error:', error);
      Swal.close();
      showErrorAlert('Error Sistem', 'Terjadi kesalahan saat login');
      setError('Terjadi kesalahan saat login');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Login Admin</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="admin@example.com"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="admin123"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Demo Login:</strong><br />
                Email: admin@example.com<br />
                Password: admin123<br />
                <em className="text-xs">*Akun akan dibuat otomatis jika belum ada</em>
              </p>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Memproses...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}