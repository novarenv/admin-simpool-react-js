import { all } from 'redux-saga/effects';

import authSaga from './auth.sagas.js';

export default function* combineSaga(){
  yield all([
    ...authSaga
  ])
}