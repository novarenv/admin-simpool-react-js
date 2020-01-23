import { IMG_BOX_PATH, IMG_LANDSCAPE_PATH } from '../actions/actions';

const initialLayout = {
  // Change Image Box Path
  imgBoxPath: "img/Simpool Box.png",
  // Change Image Landscape Path
  imgLandscapePath: "img/Simpool 1 Text Dark BG.png",
};

const layoutReducer = (state = initialLayout, action) => {
  switch (action.type) {
    case IMG_BOX_PATH:
      return {
        ...state,
        [action.name]: action.path
      }
    case IMG_LANDSCAPE_PATH:
      return {
        ...state,
        [action.name]: action.path
      }
    default:
      return state;
  }
}

export default layoutReducer;