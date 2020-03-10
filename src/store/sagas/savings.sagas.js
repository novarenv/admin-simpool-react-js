import { select, takeEvery } from 'redux-saga/effects'
import axios from 'axios'

import {
  ACCOUNT_CHARGE,
  ACCOUNT_TRANSACTION,
  ACCOUNT_TRANSFER,
  QR_CODE,
  SAVINGS_ACCOUNT_ASSOSIATIONS,
  UNDO_ACCOUNT_TRANSACTION
} from '../actions/actions'
import {
  headers,
  accountChargesUrl,
  accountTransactionsUrl,
  accountTransfersUrl,
  savingsAccoountAssosiationsUrl,
  qrCodeUrl,
} from '../../lib/jsonPlaceholderAPI'
import { authSelector } from '../reducers/auth.reducers'


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

function* accountTransfer(action) {
  const auth = yield select(authSelector)

  try {
    const accountTransfer = yield axios
      .get(accountTransfersUrl(action.payload), {
        headers: {
          'Content-Type': headers()["Content-Type"],
          'Fineract-Platform-TenantId': headers()["Fineract-Platform-TenantId"],
          'Authorization': 'Basic ' + auth,
          'Access-Control-Allow-Origin': '*'
        }
      })
      .then(response => response.data)
      .catch(error => console.log(error.response.data))

      action.setAccountTransfer(accountTransfer)

  } catch (error) {
    console.log(error)
  }
}

function* accountTransaction(action) {
  const auth = yield select(authSelector)

  try {
    const accountTransaction = yield axios
      .get(accountTransactionsUrl(action.payload.accountId, action.payload.trxId), {
        headers: {
          'Content-Type': headers()["Content-Type"],
          'Fineract-Platform-TenantId': headers()["Fineract-Platform-TenantId"],
          'Authorization': 'Basic ' + auth,
          'Access-Control-Allow-Origin': '*'
        }
      })
      .then(response => response.data)
      .catch(error => console.log(error.response.data))

      action.setAccountTransaction(accountTransaction)

  } catch (error) {
    console.log(error)
  }
}

function* undoAccountTransaction(action) {
  const auth = yield select(authSelector)

  try {
    const undoAccountTransaction = yield axios
      .post(accountTransactionsUrl(action.payload.accountId, action.payload.trxId), null, {
        headers: {
          'Content-Type': headers()["Content-Type"],
          'Fineract-Platform-TenantId': headers()["Fineract-Platform-TenantId"],
          'Authorization': 'Basic ' + auth,
          'Access-Control-Allow-Origin': '*'
        },
        params: {
          command: "undo"
        }
      })
      .then(response => response.data)
      .catch(error => console.log(error.response.data))

    action.undoAccountTransaction(undoAccountTransaction)

  } catch (error) {
    console.log(error)
  }
}

function* accountCharge(action) {
  const auth = yield select(authSelector)

  try {
    const accountCharge = yield axios
      .get(accountChargesUrl(action.payload.accountId, action.payload.chargeId), {
        headers: {
          'Content-Type': headers()["Content-Type"],
          'Fineract-Platform-TenantId': headers()["Fineract-Platform-TenantId"],
          'Authorization': 'Basic ' + auth,
          'Access-Control-Allow-Origin': '*'
        }
      })
      .then(response => response.data)
      .catch(error => console.log(error.response.data))

      action.setAccountCharge(accountCharge)

  } catch (error) {
    console.log(error)
  }
}

export default function* root() {
  yield takeEvery(ACCOUNT_CHARGE, accountCharge)
  yield takeEvery(ACCOUNT_TRANSFER, accountTransfer)
  yield takeEvery(ACCOUNT_TRANSACTION, accountTransaction)
  yield takeEvery(QR_CODE, qrCode)
  yield takeEvery(SAVINGS_ACCOUNT_ASSOSIATIONS, savingsAccountAssosiations)
  yield takeEvery(UNDO_ACCOUNT_TRANSACTION, undoAccountTransaction)
}