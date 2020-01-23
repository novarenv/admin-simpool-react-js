export const IMG_BOX_PATH = "IMG_BOX_PATH";
export const IMG_LANDSCAPE_PATH = "IMG_LANDSCAPE_PATH";

export function changeImgBoxPath(name, path) {
  return { type: IMG_BOX_PATH, name, path };
}

export function changeImgLandscapePath(name, path) {
  return { type: IMG_LANDSCAPE_PATH, name, path };
}