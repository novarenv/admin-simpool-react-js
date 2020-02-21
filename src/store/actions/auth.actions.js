export const LOGIN = 'LOGIN';
export const OTP = 'OTP';
export const LOGIN_OTP = 'LOGIN_OTP';
export const LOGIN_OTP_SUCCESS = 'LOGIN_OTP_SUCCESS';

export function loginUser(payload, onLoginSuccess, onLoginFailed, onCTO, onServerDown, onLoginOtpSuccess, loginOtpUserSuccess) {
  return { type: LOGIN, payload, onLoginSuccess, onLoginFailed, onCTO, onServerDown, onLoginOtpSuccess, loginOtpUserSuccess };
}

export function otpFun(payload, onOtpSuccess) {
  return { type: OTP, payload, onOtpSuccess }
}

export function loginOtpUser(payload, onLoginOtpSuccess, loginOtpUserSuccess) {
  return { type: LOGIN_OTP, payload, onLoginOtpSuccess, loginOtpUserSuccess };
}

export function loginOtpUserSuccess(payload) {
  return { type: LOGIN_OTP_SUCCESS, payload }
}