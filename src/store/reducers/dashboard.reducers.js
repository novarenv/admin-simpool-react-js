import { CHANGE_DROPDOWN_LANGUAGE } from '../actions/actions';
import { CHANGE_LANGUAGE } from '../actions/actions';

const initialSettings = {
    // Change Dowpdown Language Button
    dropdownLanguage: "English",
    // Change Language i18n
    language: "en"
};

const dashboardReducer = (state = initialSettings, action) => {
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