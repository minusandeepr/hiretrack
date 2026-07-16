/**
 * main.jsx
 * ---------------------------------------------------------------------------
 * Application entry point.
 *
 * Mounts the React app into the DOM's #root element, wraps it with
 * BrowserRouter for client-side routing, and imports the global stylesheet.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles/index.css';
import './styles/animations.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
