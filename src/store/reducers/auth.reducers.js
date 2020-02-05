import {
  LOGIN,
  LOGIN_OTP_SUCCESS
} from '../actions/actions';

const initialState = {
  token: null,
  base64EncodedAuthenticationKey: null
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return { ...state };
    case LOGIN_OTP_SUCCESS:
      return {
        ...state,
        base64EncodedAuthenticationKey: action.payload
      }
    default:
      return state;
  }
}
export default authReducer;