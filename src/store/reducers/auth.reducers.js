import {
  LOGIN_OTP_SUCCESS
} from '../actions/actions';

const initialState = {
  authRes: null
};

export const authSelector = state => state.auth.authRes.base64EncodedAuthenticationKey

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_OTP_SUCCESS:
      return {
        ...state,
        authRes: action.payload
      }
    default:
      return state;
  }
}
export default authReducer;