import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App.jsx';

import '../styles/shared/general.css';
import '../styles/shared/amazon-header.css';
import '../styles/pages/amazon.css';
import '../styles/pages/orders.css';
import '../styles/pages/tracking.css';
import '../styles/pages/checkout/checkout-header.css';
import '../styles/pages/checkout/checkout.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
