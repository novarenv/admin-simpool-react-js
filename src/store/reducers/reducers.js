import { combineReducers } from 'redux';

import authReducer from './auth.reducers.js';
import dashboardReducer from './dashboard.reducers.js';
import memberDataReducer from './memberData.reducers.js';
import searchReducer from './search.reducers.js';
import settingsReducer from './settings.reducers.js';
import themesReducer from './themes.reducers.js';

export default combineReducers({
    auth: authReducer,
    dashboard: dashboardReducer,
    memberData: memberDataReducer,
    search: searchReducer,
    settings: settingsReducer,
    theme: themesReducer
});
