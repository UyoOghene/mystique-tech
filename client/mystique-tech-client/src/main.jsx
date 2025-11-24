// Add error boundary to main.jsx or wrap your App
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Global error handler
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  console.error('Error at:', event.filename, event.lineno, event.colno);
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);