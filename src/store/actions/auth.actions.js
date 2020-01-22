export const LOGIN = 'LOGIN';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

export function loginUser(payload) {
  return { type: LOGIN, payload };
}

export function loginUserSuccess(payload) {
  return { type: LOGIN_SUCCESS, payload };
}

export function loginUserFailure(payload) {
  return { type: LOGIN_FAILURE, payload };
}