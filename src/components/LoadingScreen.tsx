import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Load the Lottie web component script
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@lottiefiles/dotlottie-wc@0.6.2/dist/dotlottie-wc.js';
    script.type = 'module';
    document.head.appendChild(script);

    // Set timer for 3 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onLoadingComplete();
      }, 500); // Wait for fade out animation
    }, 3000);

    return () => {
      clearTimeout(timer);
      // Clean up script
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [onLoadingComplete]);

  if (!isVisible) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center z-50 animate-fade-out">
        <div className="text-center">
          <div className="mb-8">
            <dotlottie-wc 
              src="https://lottie.host/0a65f741-760b-4fdc-b1e9-ef5497472b28/7BSl7784DS.lottie" 
              style={{ width: '300px', height: '300px' }}
              speed="1" 
              autoplay 
              loop
            />
          </div>
          <h1 className="text-3xl font-bold text-white animate-pulse-text">
            Agenda Kegiatan
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="mb-8">
          <dotlottie-wc 
            src="https://lottie.host/0a65f741-760b-4fdc-b1e9-ef5497472b28/7BSl7784DS.lottie" 
            style={{ width: '300px', height: '300px' }}
            speed="1" 
            autoplay 
            loop
          />
        </div>
        <h1 className="text-3xl font-bold text-white animate-pulse-text">
          Agenda Kegiatan
        </h1>
      </div>
    </div>
  );
}