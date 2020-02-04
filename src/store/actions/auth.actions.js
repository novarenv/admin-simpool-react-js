export const LOGIN = 'LOGIN';
export const OTP = 'OTP';
export const LOGIN_OTP = 'LOGIN_OTP';

export function loginUser(payload, onLoginSuccess) {
  return { type: LOGIN, payload, onLoginSuccess };
}

export function otpFun(payload, onOtpSuccess) {
  return { type: OTP, payload, onOtpSuccess }
}

export function loginOtpUser(payload, onLoginOtpSuccess) {
  return { type: LOGIN_OTP, payload, onLoginOtpSuccess };
}