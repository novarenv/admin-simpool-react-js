import {
  LOGIN
} from '../actions/actions';

const initialState = {
  token: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return { ...state };
    default:
      return state;
  }
}
export default authReducer;