import { put, takeEvery } from 'redux-saga/effects';
import {
  LOGIN,
  OTP,
  LOGIN_OTP,
  loginOtpUserSuccess
} from '../actions/actions';
import {
  headers,
  loginUrl,
  otpUrl
} from '../../lib/jsonPlaceholderAPI';
import axios from 'axios';

const loginError = (data, action) => {
  if (data.userMessageGlobalisationCode === "error.msg.web.device.not.registered") {
    action.onLoginSuccess()
  }
}

function* loginUser(action) {
  try {
    const login = yield axios
      .post(loginUrl, action.payload, {
        headers: headers
      })
      .then(response => response.data)
      .catch(error => loginError(error.response.data, action))

    if (login.authenticated) {
      action.onLoginOtpSuccess()
      yield put(loginOtpUserSuccess(login.base64EncodedAuthenticationKey))
    }

  } catch (error) {
    console.log(error)
  }
}

function* otpFun(action) {
  try {
    const otp = yield axios
      .post(otpUrl, action.payload, {
        headers: headers
      })
      .then(response => response.data)
      .catch(error => console.log(error.response.data))

    action.onOtpSuccess(otp.transactionReference)

  } catch (error) {
    console.log(error)
  }
}

function* loginOtpUser(action) {
  try {
    const loginOtp = yield axios
      .post(loginUrl, action.payload, {
        headers: headers
      })
      .then(response => response.data)
      .catch(error => console.log(error.response.data))
    
    action.onLoginOtpSuccess()
    yield put(loginOtpUserSuccess(loginOtp.base64EncodedAuthenticationKey))

  } catch (error) {
    console.log(error)
  }
}

export default function* root() {
  yield takeEvery(LOGIN, loginUser);
  yield takeEvery(OTP, otpFun);
  yield takeEvery(LOGIN_OTP, loginOtpUser);
}
