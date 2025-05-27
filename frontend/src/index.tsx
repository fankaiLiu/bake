import React from 'react';
import ReactDOM from 'react-dom/client';
import './i18n';
import './styles/globals.css';
import App from './App';
import { SemiLocaleProvider } from './contexts/SemiLocaleContext';

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <SemiLocaleProvider>
        <App />
      </SemiLocaleProvider>
    </React.StrictMode>,
  );
}
