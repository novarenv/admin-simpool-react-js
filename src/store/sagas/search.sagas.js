import { put, select, takeEvery } from 'redux-saga/effects';
import axios from 'axios';

import {
  SEARCH, searchResponse
} from '../actions/actions';
import {
  headers,
  searchUrl
} from '../../lib/jsonPlaceholderAPI';
import { authSelector } from '../reducers/auth.reducers'

function* search(action) {
  const auth = yield select(authSelector)
  
  try {
    const search = yield axios
      .get(searchUrl, {
        headers: {
          'Content-Type': headers()["Content-Type"],
          'Fineract-Platform-TenantId': headers()["Fineract-Platform-TenantId"],
          'Authorization': 'Basic ' + auth
        },
        params: {
          exactMatch: false,
          query: action.payload.input,
          resource: "clients,clientIdentifiers"
        }
      })
      .then(response => response.data)
      .catch(error => console.log(error.response.data, action))

    yield put(
      searchResponse(search)
    )
    
    action.searchResponse(search)

  } catch (error) {
    console.log(error)
  }
}

export default function* root() {
  yield takeEvery(SEARCH, search);
}