import {
  LOGIN_OTP_SUCCESS
} from '../actions/actions';

const initialState = {
  base64EncodedAuthenticationKey: null
};

export const authSelector = state => state.auth.base64EncodedAuthenticationKey

const authReducer = (state = initialState, action) => {
  switch (action.type) {
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