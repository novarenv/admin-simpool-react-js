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
  GET_CLIENT_ACCOUNT,
  GET_CLIENT_DETAIL,
  GET_CLIENT_DETAIL_PARAMS,
  GET_CLIENT_IMAGE,
  GET_CLIENT_ID,
  GET_CLIENT_SUMMARY,
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
  clientImageUrl,
  clientIdUrl,
  clientSummaryUrl
} from '../../lib/jsonPlaceholderAPI';
import { authSelector } from '../reducers/auth.reducers'

// Index
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


// Add
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
          ...headers,
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
          ...headers,
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

function* deleteClientImage(action) {
  const auth = yield select(authSelector)

  try {
    const clientAddImage = yield axios
      .delete(
        clientImageUrl(
          action.payload
        ), {
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

function* getClientDetail(action) {
  const auth = yield select(authSelector)

  try {
    const getClientDetail = yield axios
      .get(
        clientDetailUrl(
          action.payload
        ), {
        headers: {
          ...headers,
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

function* getClientDetailParams(action) {
  const auth = yield select(authSelector)

  try {
    const getClientDetail = yield axios
      .get(
        clientDetailUrl(
          action.payload
        ), {
        headers: {
          ...headers,
          'Authorization': 'Basic ' + auth,
          'Access-Control-Allow-Origin': '*'
        },
        params: {
          "staffInSelectedOfficeOnly": "true",
          "template": "true"
        }
      })
      .then(response => response.data)
      .catch(error => console.log(error.response.data, action))

    action.setClientDetail(getClientDetail)

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
          ...headers,
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
          ...headers,
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
          ...headers,
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

function* putClientId(action) {
  const auth = yield select(authSelector)

  try {
    const getClientId = yield axios
      .put(
        clientIdUrl(
          action.payload.clientId
        ),
        {
          "officeId": 1,
          "legalForm": "PERSON",
          "firstname": "Angga",
          "lastname": "Identity",
          "active": true,
          "accountNo": "1201200002",
          "staffId": 1,
          "externalId": "081324872280",
          "mobileNo": "081324872280",
          "genderCodeValue": "M",
          "address": "Alamat Domisili",
          "typeOfIdentityId": "IC",
          "provinceId": "1200",
          "provinceName": "Jawa Timur",
          "cityId": "1291",
          "cityName": "Kota Surabaya",
          "countryCodeValue": "IDN",
          "flagTaxCodeValue": "Y",
          "placeOfBirth": "Kota Surabaya",
          "motherName": "mama",
          "sectorId": 1000,
          "mobileUser": "angga01",
          "nip": "081324872281",
          "identityNumber": "3213123133213123",
          "postalCode": "32132",
          "fullname": "Angga Identity",
          "member": false,
          "directorateCode": "N/A",
          "companyCode": "N/A",
          "addressBasedOnIdentity": "alamat",
          "phoneNumber": "031324872280",
          "religion": "Islam",
          "email": "anggaa.pradipta@gmail.com",
          "merchantCategoryCode": "8931",
          "merchantInformationCode": "02",
          "spouseIdentityNumber": "3213123133213123",
          "spouseName": "Angga's Spouse",
          "prePostNuptialAggreement": "Y",
          "typeOfIdentitySpouse": "1",
          "clientNonPersonDetails": {
            "businessType": "",
            "corporateId": "",
            "isLjk": false,
            "ljkCode": null,
            "bankFlag": null,
            "incorporationDate": "",
            "incorpValidityTillDate": "",
            "publicationDate": "",
            "legalityEndDate": ""
          },
          "prefixCode": "H.",
          "suffixCode": "S.T.",
          "nickname": "Angga Alias",
          "identityValidDate": "12 Maret 2020",
          "maritalStatusCode": "Kawin",
          "lastEducationLevelCode": "0199",
          "lastEducationLevelDescription": "D4",
          "isCitizen": true,
          "taxNumber": "324232131231231",
          "taxName": "Angga Tax",
          "taxAddress": "Alamat Tax",
          "rt": "1",
          "rw": "1",
          "village": "Village Domisili",
          "subDistrict": "Distric Domisili",
          "faxNumber": "081324872280",
          "identitySubDistrict": "distric",
          "identityVillage": "village",
          "identityPostalCode": "32132",
          "identityProvinceId": "1200",
          "identityProvinceName": "Jawa Timur",
          "identityCityId": "1291",
          "identityCityName": "Kota Surabaya",
          "identityCountryCodeValue": "IDN",
          "identityRt": "1",
          "identityRw": "1",
          "fullnameNonIdentity": "Angga Full",
          "otherHomeOwnershipStatus": "Angga Status",
          "homeOwnershipStatus": "99",
          "legalFormId": 1,
          "locale": "id",
          "dateFormat": "dd MMMM yyyy",
          "activationDate": "20 Januari 2020",
          "dateOfBirth": "01 Januari 2020",
          "submittedOnDate": "20 Januari 2020",
          "dateOfBirthSpouse": "29 Januari 2020"
        },
        {
          headers: {
            ...headers,
            'Authorization': 'Basic ' + auth,
            'Access-Control-Allow-Origin': '*'
          }
        }
      )
      .then(response => response.data)
      .catch(error => console.log(error.response.data, action))

    console.log(getClientId)

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
  yield takeEvery(GET_CLIENT_ACCOUNT, getClientAccount);
  yield takeEvery(GET_CLIENT_DETAIL, getClientDetail);
  yield takeEvery(GET_CLIENT_DETAIL_PARAMS, getClientDetailParams);
  yield takeEvery(GET_CLIENT_IMAGE, getClientImage);
  yield takeEvery(GET_CLIENT_ID, getClientId);
  yield takeEvery(GET_CLIENT_SUMMARY, getClientSummary);
  yield takeEvery(PUT_CLIENT_ID, putClientId);
}