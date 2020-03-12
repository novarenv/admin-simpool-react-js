import { select, takeEvery } from 'redux-saga/effects'
import axios from 'axios'

import {
  DELETE_LOAN_DOC,
  LOANS,
  LOANS_DOCUMENTS,
  LOANS_DOC_ATTACHMENT,
  POST_LOANS_DOCUMENTS
} from '../actions/actions'

import {
  headers,
  loansUrl,
  loansDocumentsUrl,
  loansDocumentsIdUrl,
  loansDocAttachmentUrl
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

function* loansDocuments(action) {
  const auth = yield select(authSelector)

  try {
    const loansDocuments = yield axios
      .get(loansDocumentsUrl(action.payload), {
        headers: {
          'Content-Type': headers()["Content-Type"],
          'Fineract-Platform-TenantId': headers()["Fineract-Platform-TenantId"],
          'Authorization': 'Basic ' + auth,
          'Access-Control-Allow-Origin': '*'
        }
      })
      .then(response => response.data)
      .catch(error => console.log(error.response.data))

      action.setLoansDocuments(loansDocuments)

  } catch (error) {
    console.log(error)
  }
}

function* loansDocAttachment(action) {
  const auth = yield select(authSelector)
  console.log(action.payload)

  try {
    const loansDocAttachment = yield axios
      .get(loansDocAttachmentUrl(action.payload.loanId, action.payload.docId), {
        headers: {
          'Content-Type': 'image/jpeg',
          'Fineract-Platform-TenantId': headers()["Fineract-Platform-TenantId"],
          'Authorization': 'Basic ' + auth,
          'Access-Control-Allow-Origin': '*'
        },
        responseType: 'blob'
      })
      .then(response => window.URL.createObjectURL(new Blob([response.data])))
      .catch(error => console.log(error.response.data))

      action.setLoansDocAttachment(loansDocAttachment, action.payload.fileName)

  } catch (error) {
    console.log(error)
  }
}

function* deleteLoanDoc(action) {
  const auth = yield select(authSelector)

  try {
    yield axios
      .delete(
        loansDocumentsIdUrl(
          action.payload.loanId,
          action.payload.docId
        ), {
        headers: {
          'Content-Type': headers()["Content-Type"],
          'Fineract-Platform-TenantId': headers()["Fineract-Platform-TenantId"],
          'Authorization': 'Basic ' + auth,
          'Access-Control-Allow-Origin': '*'
        }
      })
      .then(response => response.data)
      .catch(error => console.log(error.response.data))

    action.deleteLoanDocId()

  } catch (error) {
    console.log(error)
  }
}

function* postLoansDocuments(action) {
  const auth = yield select(authSelector)

  try {
    yield axios
      .post(
        loansDocumentsUrl(
          action.res.loanId
        ), action.payload, {
        headers: {
          'Content-Type': headers()["Content-Type"],
          'Fineract-Platform-TenantId': headers()["Fineract-Platform-TenantId"],
          'Authorization': 'Basic ' + auth,
          'Access-Control-Allow-Origin': '*'
        }
      })
      .then(response => response.data)
      .catch(error => console.log(error.response.data))

    action.setPostLoansDocuments()

  } catch (error) {
    console.log(error)
  }
}

export default function* root() {
  yield takeEvery(DELETE_LOAN_DOC, deleteLoanDoc)
  yield takeEvery(LOANS, loans)
  yield takeEvery(LOANS_DOCUMENTS, loansDocuments)
  yield takeEvery(LOANS_DOC_ATTACHMENT, loansDocAttachment)
  yield takeEvery(POST_LOANS_DOCUMENTS, postLoansDocuments)
}