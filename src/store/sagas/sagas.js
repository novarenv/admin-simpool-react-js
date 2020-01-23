// import { all } from 'redux-saga/effects';

import authSaga from './auth.sagas.js';

export default function* combineSaga(){
  yield authSaga
}

// Use for multiple saga files
// yield all([
//   ...authSaga
// ])