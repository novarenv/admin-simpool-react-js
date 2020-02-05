import { put, select, takeEvery } from 'redux-saga/effects';
import axios from 'axios';

import {
  INDEX
} from '../actions/actions';
import {
  headers,
  clientUrl
} from '../../lib/jsonPlaceholderAPI';
import { authSelector } from '../reducers/auth.reducers'

function* index(action) {
  const auth = yield select(authSelector)
  console.log(auth)
  try {
    const index = yield axios
      .post(clientUrl, {
        headers: {
          ...headers,
          'Authorization': 'Basic ' + auth,
          'Access-Control-Allow-Origin': 'http://localhost:3000/'
        },
        params: {
          limit: action.payload.limit,
          offset: action.payload.offset
        }
      })
      // .then(response => response.data)
      // .catch(error => console.log(error.response.data, action))
    
    console.log(index)

  } catch (error) {
    console.log(error)
  }
}

export default function* root() {
  yield takeEvery(INDEX, index);
}