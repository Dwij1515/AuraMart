import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { AuthProvider } from './context/AuthContext';
import './styles/global.css';

// Intercept all /api calls to prepend the production API URL if configured
const originalFetch = window.fetch;
window.fetch = function (url, options) {
  if (typeof url === 'string' && url.startsWith('/api')) {
    const baseUrl = process.env.REACT_APP_API_URL;
    if (baseUrl) {
      const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
      if (cleanBaseUrl.endsWith('/api')) {
        url = url.replace(/^\/api/, cleanBaseUrl);
      } else {
        url = cleanBaseUrl + url;
      }
    }
  }
  return originalFetch(url, options);
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </Provider>
);
