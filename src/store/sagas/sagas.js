import { all } from 'redux-saga/effects';

import auth from './auth.sagas.js';
import memberData from './memberData.sagas.js';
import search from './search.sagas.js';

export default function* combineSaga(){
  yield all([
    auth(),
    memberData(),
    search()
  ])
}