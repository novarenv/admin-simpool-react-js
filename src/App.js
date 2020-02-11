import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

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
    <MuiThemeProvider>
      <BrowserRouter basename={basename}>
        <Routes />
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
