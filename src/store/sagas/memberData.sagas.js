import { select, takeEvery } from 'redux-saga/effects';
import axios from 'axios';

import {
  CLIENT_INDEX,
  CHECK_DUPLICATE,
  CLIENT_TEMPLATE,
  CLIENT_ADD,
  CLIENT_ADD_IMAGE,
  CLIENT_ADD_DOCUMENT,
  DELETE_CLIENT_IMAGE,
  DELETE_CLIENT_DOC,
  GET_CLIENT_ACCOUNT,
  GET_CLIENT_DETAIL,
  GET_CLIENT_DOCUMENTS,
  GET_CLIENT_IMAGE,
  GET_CLIENT_ID,
  GET_CLIENT_SUMMARY,
  GET_DOC_ATTACH,
  PUT_CLIENT_ID
} from '../actions/actions';
import {
  headers,
  clientUrl,
  checkDuplicateUrl,
  clientTemplateUrl,
  clientAccountUrl,
  clientDetailUrl,
  clientDocumentUrl,
  clientDocumentIdUrl,
  clientImageUrl,
  clientIdUrl,
  clientSummaryUrl,
  docAttachUrl
} from '../../lib/jsonPlaceholderAPI';
import { authSelector } from '../reducers/auth.reducers'
import { languageSelector } from '../reducers/dashboard.reducers';

// Index
function* clientIndex(action) {
  const auth = yield select(authSelector)
  const allHeaders = headers()
  console.log(allHeaders)

  try {
    const clientIndex = yield axios
      .get(clientUrl, {
        headers: {
          'Content-Type': headers()["Content-Type"],
          'Fineract-Platform-TenantId': headers()["Fineract-Platform-TenantId"],
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


// Add
function* checkDuplicate(action) {
  const auth = yield select(authSelector)
  const language = yield select(languageSelector)

  try {
    const checkDuplicate = yield axios
      .get(checkDuplicateUrl, {
        headers: {
          'Content-Type': headers()["Content-Type"],
          'Fineract-Platform-TenantId': headers()["Fineract-Platform-TenantId"],
          'Authorization': 'Basic ' + auth
        }, params: {
          fullname: action.payload.fullname,
          dateOfBirth: action.payload.dateOfBirth,
          addressBasedOnIdentity: action.payload.addressBasedOnIdentity,
          motherName: action.payload.motherName,
          typeOfIdentityId: action.payload.typeOfIdentityId,
          identityNumber: action.payload.identityNumber,
          isDuplicate: "false",
          legalForm: action.payload.legalFormId,
          locale: language,
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
          'Content-Type': headers()["Content-Type"],
          'Fineract-Platform-TenantId': headers()["Fineract-Platform-TenantId"],
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
          'Content-Type': headers()["Content-Type"],
          'Fineract-Platform-TenantId': headers()["Fineract-Platform-TenantId"],
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


// Detail
function* getClientAccount(action) {
  const auth = yield select(authSelector)

  try {
    const getClientAccount = yield axios
      .get(
        clientAccountUrl(
          action.payload
        ), {
        headers: {
          'Content-Type': headers()["Content-Type"],
          'Fineract-Platform-TenantId': headers()["Fineract-Platform-TenantId"],
          'Authorization': 'Basic ' + auth,
          'Access-Control-Allow-Origin': '*'
        }
      })
      .then(response => response.data)
      .catch(error => console.log(error.response.data, action))

    action.setClientAccount(getClientAccount)

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
          'Content-Type': headers()["Content-Type"],
          'Fineract-Platform-TenantId': headers()["Fineract-Platform-TenantId"],
          'Authorization': 'Basic ' + auth,
          'Access-Control-Allow-Origin': '*'
        }
      })
      .then(response => response.data)
      .catch(error => console.log(error.response.data, action))

    action.uploadSelfieRes(clientAddImage)

  } catch (error) {
    console.log(error)
  }
}

function* clientAddDocument(action) {
  const auth = yield select(authSelector)

  try {
    const clientAddDocument = yield axios
      .post(
        clientDocumentUrl(
          action.res.clientId
        ), action.payload, {
        headers: {
          'Content-Type': headers()["Content-Type"],
          'Fineract-Platform-TenantId': headers()["Fineract-Platform-TenantId"],
          'Authorization': 'Basic ' + auth,
          'Access-Control-Allow-Origin': '*'
        }
      })
      .then(response => response.data)
      .catch(error => console.log(error.response.data, action))

    if (typeof action.setClientDocuments == 'function') {
      action.setClientDocuments()
    }
    console.log(clientAddDocument)

  } catch (error) {
    console.log(error)
  }
}

function* deleteClientImage(action) {
  const auth = yield select(authSelector)

  try {
    const clientAddImage = yield axios
      .delete(
        clientImageUrl(
          action.payload
        ), {
        headers: {
          'Content-Type': headers()["Content-Type"],
          'Fineract-Platform-TenantId': headers()["Fineract-Platform-TenantId"],
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

function* deleteClientDoc(action) {
  const auth = yield select(authSelector)

  try {
    const deleteClientDoc = yield axios
      .delete(
        clientDocumentIdUrl(
          action.payload.clientId,
          action.payload.documentId
        ), {
        headers: {
          'Content-Type': headers()["Content-Type"],
          'Fineract-Platform-TenantId': headers()["Fineract-Platform-TenantId"],
          'Authorization': 'Basic ' + auth,
          'Access-Control-Allow-Origin': '*'
        }
      })
      .then(response => response.data)
      .catch(error => console.log(error.response.data, action))

    action.setClientDocId()

  } catch (error) {
    console.log(error)
  }
}

function* getClientDetail(action) {
  const auth = yield select(authSelector)
  console.log(auth)

  try {
    const getClientDetail = yield axios
      .get(
        clientDetailUrl(
          action.payload
        ), {
        headers: {
          'Content-Type': headers()["Content-Type"],
          'Fineract-Platform-TenantId': headers()["Fineract-Platform-TenantId"],
          'Authorization': 'Basic ' + auth,
          'Access-Control-Allow-Origin': '*'
        }
      })
      .then(response => response.data)
      .catch(error => console.log(error.response.data, action))

    action.setClientDetail(getClientDetail)

  } catch (error) {
    console.log(error)
  }
}

function* getClientDocuments(action) {
  const auth = yield select(authSelector)

  try {
    const getClientDocuments = yield axios
      .get(
        clientDocumentUrl(
          action.payload
        ), {
        headers: {
          'Content-Type': headers()["Content-Type"],
          'Fineract-Platform-TenantId': headers()["Fineract-Platform-TenantId"],
          'Authorization': 'Basic ' + auth,
          'Access-Control-Allow-Origin': '*'
        }
      })
      .then(response => response.data)
      .catch(error => console.log(error.response.data, action))

    action.setClientDocuments(getClientDocuments)

  } catch (error) {
    console.log(error)
  }
}

function* getClientImage(action) {
  const auth = yield select(authSelector)

  try {
    const getClientImage = yield axios
      .get(
        clientImageUrl(
          action.payload
        ), {
        headers: {
          'Content-Type': headers()["Content-Type"],
          'Fineract-Platform-TenantId': headers()["Fineract-Platform-TenantId"],
          'Authorization': 'Basic ' + auth,
          'Access-Control-Allow-Origin': '*'
        }
      })
      .then(response => response.data)
      .catch(error => console.log(error.response.data, action))

    action.getClientImage(getClientImage)

  } catch (error) {
    console.log(error)
  }
}

function* getClientId(action) {
  const auth = yield select(authSelector)

  try {
    const getClientId = yield axios
      .get(
        clientIdUrl(
          action.payload
        ), {
        headers: {
          'Content-Type': headers()["Content-Type"],
          'Fineract-Platform-TenantId': headers()["Fineract-Platform-TenantId"],
          'Authorization': 'Basic ' + auth,
          'Access-Control-Allow-Origin': '*'
        }
      })
      .then(response => response.data)
      .catch(error => console.log(error.response.data, action))

    action.setClientId(getClientId)

  } catch (error) {
    console.log(error)
  }
}

function* getClientSummary(action) {
  const auth = yield select(authSelector)

  try {
    const getClientSummary = yield axios
      .get(
        clientSummaryUrl, {
        headers: {
          'Content-Type': headers()["Content-Type"],
          'Fineract-Platform-TenantId': headers()["Fineract-Platform-TenantId"],
          'Authorization': 'Basic ' + auth,
          'Access-Control-Allow-Origin': '*'
        },
        params: {
          R_clientId: action.payload,
          genericResultSet: false
        }
      })
      .then(response => response.data)
      .catch(error => console.log(error.response.data, action))

    action.setClientSummary(getClientSummary)

  } catch (error) {
    console.log(error)
  }
}

function* getDocAttach(action) {
  const auth = yield select(authSelector)

  try {
    const getDocAttach = yield axios
      .get(
        docAttachUrl(
          action.payload.clientId,
          action.payload.documentId
        ), {
        headers: {
          'Content-Type': headers()["Content-Type"],
          'Fineract-Platform-TenantId': headers()["Fineract-Platform-TenantId"],
          'Authorization': 'Basic ' + auth,
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'image/jpeg'
        },
        params: {
          R_clientId: action.payload,
          genericResultSet: false
        },
        responseType: 'blob'
      })
      .then(response => window.URL.createObjectURL(new Blob([response.data])))
      .catch(error => console.log(error.response.data, action))

    action.setDocAttach(getDocAttach, action.payload.fileName)

  } catch (error) {
    console.log(error)
  }
}

function* putClientId(action) {
  const auth = yield select(authSelector)

  try {
    const putClientId = yield axios
      .put(
        clientIdUrl(
          action.clientId
        ),
        action.payload,
        {
          headers: {
            'Content-Type': headers()["Content-Type"],
            'Fineract-Platform-TenantId': headers()["Fineract-Platform-TenantId"],
            'Authorization': 'Basic ' + auth,
            'Access-Control-Allow-Origin': '*'
          }
        }
      )
      .then(response => {   
        action.setClientPutRes(response.data)
        return(response.data)
      })
      .catch(error => action.showErrorExist(error.response.data))

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
  yield takeEvery(DELETE_CLIENT_IMAGE, deleteClientImage);
  yield takeEvery(DELETE_CLIENT_DOC, deleteClientDoc);
  yield takeEvery(GET_CLIENT_ACCOUNT, getClientAccount);
  yield takeEvery(GET_CLIENT_DETAIL, getClientDetail);
  yield takeEvery(GET_CLIENT_DOCUMENTS, getClientDocuments);
  yield takeEvery(GET_CLIENT_IMAGE, getClientImage);
  yield takeEvery(GET_CLIENT_ID, getClientId);
  yield takeEvery(GET_CLIENT_SUMMARY, getClientSummary);
  yield takeEvery(GET_DOC_ATTACH, getDocAttach);
  yield takeEvery(PUT_CLIENT_ID, putClientId);
}