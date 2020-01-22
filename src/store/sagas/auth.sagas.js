import { put, takeEvery } from 'redux-saga/effects';
import { LOGIN, loginUserSuccess } from '../actions/actions';
import { loginUrl, headers, basicAuth } from '../../lib/jsonPlaceholderAPI';
import axios from 'axios';

function* loginUser(action) {
  try {

    console.log(action.payload)

    const auth = yield axios
      .post(loginUrl, action.payload, {
        auth: basicAuth,
        headers: headers,
      })
      .then(response => response.data);

    yield put(
      loginUserSuccess({
        token: auth.token,
      }),
    );

    console.log(auth)
    action.onSuccess();

  } catch (error) {

    console.log(error.response.data.defaultUserMessage);

    action.onError(error.response.data.defaultUserMessage);
    
  }
}

export default function* root() {
  yield takeEvery(LOGIN, loginUser);
}
