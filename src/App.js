import React from 'react';
import { BrowserRouter } from 'react-router-dom';

// App Routes
import Routes from './Routes';

// Vendor dependencies
import "./Vendor";
// Application Styles
import './styles/bootstrap.scss';
import './styles/app.scss'

import './App.scss';

function App() {
  const basename = '/';

  return (
    <BrowserRouter basename={basename}>
        <Routes />
    </BrowserRouter>
  );
}

export default App;
