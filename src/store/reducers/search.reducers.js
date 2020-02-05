import {
  SEARCH,
  SEARCH_RESPONSE
} from '../actions/actions';

const initialState = {
  searchRes: []
};

const searchReducer = (state = initialState, action) => {
  switch (action.type) {
    case SEARCH:
      return { 
        ...state
      };
    case SEARCH_RESPONSE:
      return {
        ...state,
        serachResponse: action.payload
      }
    default:
      return state;
  }
}
export default searchReducer;