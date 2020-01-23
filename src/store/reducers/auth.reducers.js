import { LOGIN, LOGIN_SUCCESS } from '../actions/actions';

const initialState = {
  token: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return {...state, loggingIn: true};
    case LOGIN_SUCCESS:
      return {
        ...state,
        token: action.payload.token,
        loggingIn: false,
      };
    default:
      return state;
  }
}
export default authReducer;