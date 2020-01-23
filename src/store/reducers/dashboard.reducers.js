import { CHANGE_DROPDOWN_LANGUAGE, CHANGE_LANGUAGE } from '../actions/actions';

const initialDashboard = {
  // Change Dowpdown Language Button
  dropdownLanguage: "English",
  // Change Language i18n
  language: "en"
};

const dashboardReducer = (state = initialDashboard, action) => {
  switch (action.type) {
    case CHANGE_DROPDOWN_LANGUAGE:
      return {
        ...state,
        [action.name]: action.lng
      }
    case CHANGE_LANGUAGE:
      return {
        ...state,
        [action.name]: action.lng
      }
    default:
      return state;
  }
}

export default dashboardReducer;