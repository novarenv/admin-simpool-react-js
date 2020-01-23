import { combineReducers } from 'redux';

import authReducer from './auth.reducers.js';
import dashboardReducer from './dashboard.reducers.js';
import layoutReducer from './layout.reducers.js';
import settingsReducer from './settings.reducers.js';
import themesReducer from './themes.reducers.js';

export default combineReducers({
    auth: authReducer,
    dashboard: dashboardReducer,
    layout: layoutReducer,
    settings: settingsReducer,
    theme: themesReducer
});
