import { select, takeEvery } from 'redux-saga/effects';
import axios from 'axios';

import {
  CLIENT_INDEX,
  CHECK_DUPLICATE,
  CLIENT_TEMPLATE,
  CLIENT_ADD,
  CLIENT_ADD_IMAGE,
  CLIENT_ADD_DOCUMENT
} from '../actions/actions';
import {
  headers,
  clientUrl,
  checkDuplicateUrl,
  clientTemplateUrl,
  clientImageUrl,
  clientDocumentUrl
} from '../../lib/jsonPlaceholderAPI';
import { authSelector } from '../reducers/auth.reducers'

function* clientIndex(action) {
  const auth = yield select(authSelector)
  try {
    const clientIndex = yield axios
      .get(clientUrl, {
        headers: {
          ...headers,
          'Authorization': 'Basic ' + auth,
          'Access-Control-Allow-Origin': '*'
        },
        params: {
          limit: action.payload.limit,
          offset: action.payload.offset
        }
      })
      .then(response => response.data)
      .catch(error => console.log(error.response.data, action))

    action.createRows(clientIndex)

  } catch (error) {
    console.log(error)
  }
}

function* checkDuplicate(action) {
  const auth = yield select(authSelector)

  try {
    const checkDuplicate = yield axios
      .get(checkDuplicateUrl, {
        headers: {
          ...headers,
          'Authorization': 'Basic ' + auth
        }, params: {
          fullname: action.payload.fullname,
          dateOfBirth: action.payload.dateOfBirth,
          addressBasedOnIdentity: action.payload.addressBasedOnIdentity,
          motherName: action.payload.motherName,
          typeOfIdentityId: action.payload.typeOfIdentityId,
          identityNumber: action.payload.identityNumber,
          isDuplicate: "false",
          legalForm: "1",
          locale: "id",
          limit: "1000"
        }
      })
      .then(response => response.data)
      .catch(error => console.log(error.response.data, action))

    action.checkTotalFilter(checkDuplicate)

  } catch (error) {
    console.log(error)
  }
}

function* clientTemplate(action) {
  const auth = yield select(authSelector)

  try {
    const clientTemplate = yield axios
      .get(clientTemplateUrl, {
        headers: {
          ...headers,
          'Authorization': 'Basic ' + auth
        }, params: {
          staffInSelectedOfficeOnly: "true"
        }
      })
      .then(response => response.data)
      .catch(error => console.log(error.response.data, action))

    action.setClientTemplate(clientTemplate)

  } catch (error) {
    console.log(error)
  }
}

function* clientAdd(action) {
  const auth = yield select(authSelector)

  try {
    const clientAdd = yield axios
      .post(clientUrl, action.payload, {
        headers: {
          ...headers,
          'Authorization': 'Basic ' + auth
        }
      })
      .then(response => response.data)
      .catch(error => console.log(error.response.data, action))

    action.setClientAddRes(clientAdd)

  } catch (error) {
    console.log(error)
  }
}

function* clientAddImage(action) {
  const auth = yield select(authSelector)

  try {
    const clientAddImage = yield axios
      .post(
        clientImageUrl(
          action.res.clientId
        ), action.payload, {
        headers: {
          ...headers,
          'Authorization': 'Basic ' + auth,
          'Access-Control-Allow-Origin': '*'
        }
      })
      .then(response => response.data)
      .catch(error => console.log(error.response.data, action))

    console.log(clientAddImage)

  } catch (error) {
    console.log(error)
  }
}

function* clientAddDocument(action) {
  const auth = yield select(authSelector)

  console.log(action.payload)
  
  try {
    const clientAddDocument = yield axios
      .post(
        clientDocumentUrl(
          action.res.clientId
        ), action.payload, {
        headers: {
          ...headers,
          'Authorization': 'Basic ' + auth,
          'Access-Control-Allow-Origin': '*'
        }
      })
      .then(response => response.data)
      .catch(error => console.log(error.response.data, action))

    console.log(clientAddDocument)

  } catch (error) {
    console.log(error)
  }
}

export default function* root() {
  yield takeEvery(CLIENT_INDEX, clientIndex);
  yield takeEvery(CHECK_DUPLICATE, checkDuplicate);
  yield takeEvery(CLIENT_TEMPLATE, clientTemplate);
  yield takeEvery(CLIENT_ADD, clientAdd);
  yield takeEvery(CLIENT_ADD_IMAGE, clientAddImage);
  yield takeEvery(CLIENT_ADD_DOCUMENT, clientAddDocument);
}