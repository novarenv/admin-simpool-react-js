import { combineReducers } from 'redux';

import settingsReducer from './settings.reducers.js';
import themesReducer from './themes.reducers.js';
import dashboardReducer from './dashboard.reducers.js';

export default combineReducers({
    settings: settingsReducer,
    theme: themesReducer,
    dashboard: dashboardReducer
});
