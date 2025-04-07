// frontend/src/index.js

/**
 * @fileOverview Entry point của ứng dụng React.
 * Render component App vào DOM.
 */

import App from './App';
import React from 'react';
import ReactDOM from 'react-dom/client';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);