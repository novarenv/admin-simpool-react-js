import { TOGGLE_SETTING, CHANGE_SETTING, CHANGE_DROPDOWN_LANGUAGE } from '../actions/actions';

const initialSettings = {
    /* Layout fixed. Scroll content only */
    isFixed: true,
    /* Sidebar collapsed */
    isCollapsed: false,
    /* Boxed layout */
    isBoxed: false,
    /* Floating sidebar */
    isFloat: false,
    /* Sidebar show menu on hover only */
    asideHover: false,
    /* Show sidebar scrollbar (dont' hide it) */
    asideScrollbar: false,
    /* Sidebar collapsed with big icons and text */
    isCollapsedText: false,
    /* Toggle for the offsidebar */
    offsidebarOpen: false,
    /* Toggle for the sidebar offcanvas (mobile) */
    asideToggled: false,
    /* Toggle for the sidebar user block */
    showUserBlock: false,
    /* Enables layout horizontal */
    horizontal: false,
    /* Full size layout */
    useFullLayout: false,
    /* Hide footer */
    hiddenFooter: false,

    dropdownLanguage: "English"
};

const settingsReducer = (state = initialSettings, action) => {
    switch (action.type) {
        case TOGGLE_SETTING:
            return {
                ...state,
                [action.name]: !state[action.name]
            }
        case CHANGE_SETTING:
            return {
                ...state,
                [action.name]: action.value
            };
        case CHANGE_DROPDOWN_LANGUAGE:
            return {
                ...state,
                [action.name]: action.lng
            }
        default:
            return state;
    }
}

export default settingsReducer;