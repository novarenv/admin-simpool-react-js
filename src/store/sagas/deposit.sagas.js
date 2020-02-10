import { select, takeEvery } from 'redux-saga/effects';
import axios from 'axios';

import {
  DEPOSIT,
} from '../actions/actions';
import {
  headers,
  clientUrl,
} from '../../lib/jsonPlaceholderAPI';
import { authSelector } from '../reducers/auth.reducers'

function* deposit(action) {
  const auth = yield select(authSelector)
  
  try {
    const deposit = yield axios
      .get(clientUrl, {
        headers: {
          ...headers,
          'Authorization': 'Basic ' + auth
        }
      })
      .then(response => response.data)
      .catch(error => console.log(error.response.data, action))

    action.createRows(deposit)

  } catch (error) {
    console.log(error)
  }
}

export default function* root() {
  yield takeEvery(DEPOSIT, deposit);
}