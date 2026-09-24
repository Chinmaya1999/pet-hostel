import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: { borderRadius: '999px', background: '#1F1535', color: '#FFF8F0', fontWeight: 600, padding: '12px 20px' },
            success: { iconTheme: { primary: '#3DD9B3', secondary: '#1F1535' } },
            error: { iconTheme: { primary: '#FF6B4A', secondary: '#1F1535' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
