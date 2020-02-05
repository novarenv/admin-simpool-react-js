import {
  INDEX
} from '../actions/actions';

const initialState = {
  token: null
};

const memberDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case INDEX:
      return { ...state };
    default:
      return state;
  }
}
export default memberDataReducer;