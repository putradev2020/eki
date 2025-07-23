import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle, X } from 'lucide-react';

export function Notification() {
  const { state, dispatch } = useApp();
  const { notification } = state;

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        dispatch({ type: 'SET_NOTIFICATION', payload: null });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification, dispatch]);

  if (!notification) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
      <div className="bg-white border-l-4 border-green-500 rounded-lg shadow-lg p-4 max-w-sm">
        <div className="flex items-center">
          <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
          <p className="text-gray-800 flex-1">{notification}</p>
          <button
            onClick={() => dispatch({ type: 'SET_NOTIFICATION', payload: null })}
            className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}