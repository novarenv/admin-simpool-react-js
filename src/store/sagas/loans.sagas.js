import { select, takeEvery } from 'redux-saga/effects'
import axios from 'axios'

import {
  LOANS
} from '../actions/actions'

import {
  headers,
  loansUrl
} from '../../lib/jsonPlaceholderAPI'

import { authSelector } from '../reducers/auth.reducers'

function* loans(action) {
  const auth = yield select(authSelector)

  try {
    const loans = yield axios
      .get(loansUrl(action.payload), {
        headers: {
          'Content-Type': headers()["Content-Type"],
          'Fineract-Platform-TenantId': headers()["Fineract-Platform-TenantId"],
          'Authorization': 'Basic ' + auth,
          'Access-Control-Allow-Origin': '*'
        },
        params: {
          associations: "all",
          exclude: "guarantors"
        }
      })
      .then(response => response.data)
      .catch(error => console.log(error.response.data))

      action.setLoans(loans)

  } catch (error) {
    console.log(error)
  }
}

export default function* root() {
  yield takeEvery(LOANS, loans)
}