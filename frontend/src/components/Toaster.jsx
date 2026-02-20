// src/components/Toaster.jsx
import { Toaster } from 'react-hot-toast';

export default function AppToaster() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        // Define default options
        className: '',
        duration: 3000,
        style: {
          background: '#1a1a2e',
          color: '#fff',
          border: '1px solid rgba(255, 215, 0, 0.2)',
          boxShadow: '0 10px 30px -10px rgba(0,0,0,0.3)',
          fontFamily: 'Inter, sans-serif',
          fontWeight: '500',
          padding: '12px 20px',
          borderRadius: '12px',
        },
        success: {
          iconTheme: {
            primary: '#FFD700', // gold
            secondary: '#1a1a2e',
          },
          style: {
            border: '1px solid rgba(255, 215, 0, 0.5)',
          },
        },
        error: {
          iconTheme: {
            primary: '#ff4d4d',
            secondary: '#1a1a2e',
          },
          style: {
            border: '1px solid rgba(255, 77, 77, 0.5)',
          },
        },
      }}
    />
  );
}