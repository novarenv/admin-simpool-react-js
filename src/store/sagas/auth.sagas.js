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

const loginError = (error, action) => {
  if (!error.response) {
    action.onServerDown()
  } else {
    if (error.response.data.userMessageGlobalisationCode === "error.msg.web.device.not.registered") {
      action.onLoginSuccess()
    } else if (
      error.response.data.userMessageGlobalisationCode === "error.msg.invalid.username.password"
        || error.response.data.userMessageGlobalisationCode === "error.msg.invalid.username.login"
        || error.response.data.userMessageGlobalisationCode === "error.msg.username.login"
    ) {
      action.onLoginFailed(error.response.data.defaultUserMessage)
    }
  }

  if (error.code === "ECONNABORTED") {
    action.onCTO()
  }
}

function* loginUser(action) {
  try {
    const login = yield axios
      .post(loginUrl, action.payload, {
        headers: headers()
      })
      .then(response => response.data)
      .catch(error => loginError(error, action))

    console.log(login)
    if (login?.authenticated) {
      yield put(loginOtpUserSuccess(login))

      action.onLoginOtpSuccess()
    }

  } catch (error) {
    console.log(error)
  }
}

function* otpFun(action) {
  try {
    const otp = yield axios
      .post(otpUrl, action.payload, {
        headers: headers()
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
    const loginOtpUser = yield axios
      .post(loginUrl, action.payload, {
        headers: headers()
      })
      .then(response => response.data)
      .catch(error => console.log(error.response.data))

    yield put(loginOtpUserSuccess(loginOtpUser))

    action.onLoginOtpSuccess()

  } catch (error) {
    console.log(error)
  }
}

export default function* root() {
  yield takeEvery(LOGIN, loginUser);
  yield takeEvery(OTP, otpFun);
  yield takeEvery(LOGIN_OTP, loginOtpUser);
}
