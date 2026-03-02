// app/providers.js
'use client';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function Providers({ children }) {
  return (
    <>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        style={{ fontSize: '14px' }}
        toastStyle={{
          background: '#1a1a1a',
          color: '#fff',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          padding: '12px 24px',
          margin: '8px'
        }}
        progressStyle={{
          background: 'linear-gradient(to right, #3b82f6, #60a5fa)'
        }}
        closeButton={false}
        icon={true}
      />
    </>
  );
}