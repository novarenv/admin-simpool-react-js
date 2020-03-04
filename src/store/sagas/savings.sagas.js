import { select, takeEvery } from 'redux-saga/effects'
import axios from 'axios'

import {
  SAVINGS_ACCOUNT_ASSOSIATIONS, QR_CODE
} from '../actions/actions'
import {
  headers,
  savingsAccoountAssosiationsUrl,
  qrCodeUrl
} from '../../lib/jsonPlaceholderAPI'
import { authSelector } from '../reducers/auth.reducers'


// savingsAccountAssosiations
function* savingsAccountAssosiations(action) {
  const auth = yield select(authSelector)

  try {
    const savingsAccountAssosiations = yield axios
      .get(savingsAccoountAssosiationsUrl(action.payload), {
        headers: {
          'Content-Type': headers()["Content-Type"],
          'Fineract-Platform-TenantId': headers()["Fineract-Platform-TenantId"],
          'Authorization': 'Basic ' + auth,
          'Access-Control-Allow-Origin': '*'
        },
        params: {
          associations: "all"
        }
      })
      .then(response => response.data)
      .catch(error => console.log(error.response.data))

      action.setSavingsAssosiations(savingsAccountAssosiations)

  } catch (error) {
    console.log(error)
  }
}

function* qrCode(action) {
  const auth = yield select(authSelector)

  try {
    const qrCode = yield axios
      .get(qrCodeUrl(action.payload), {
        headers: {
          'Content-Type': headers()["Content-Type"],
          'Fineract-Platform-TenantId': headers()["Fineract-Platform-TenantId"],
          'Authorization': 'Basic ' + auth,
          'Access-Control-Allow-Origin': '*'
        }
      })
      .then(response => response.data)
      .catch(error => console.log(error.response.data))

      action.setQrCode(qrCode)

  } catch (error) {
    console.log(error)
  }
}

export default function* root() {
  yield takeEvery(SAVINGS_ACCOUNT_ASSOSIATIONS, savingsAccountAssosiations)
  yield takeEvery(QR_CODE, qrCode)
}