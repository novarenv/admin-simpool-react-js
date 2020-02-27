export const CLIENT_INDEX = 'CLIENT_INDEX';
export const CHECK_DUPLICATE = 'CHECK_DUPLICATE';
export const CLIENT_TEMPLATE = 'CLIENT_TEMPLATE';
export const CLIENT_ADD = 'CLIENT_ADD';
export const CLIENT_ADD_IMAGE = 'CLIENT_ADD_IMAGE';
export const CLIENT_ADD_DOCUMENT = 'CLIENT_ADD_DOCUMENT';
export const DELETE_CLIENT_IMAGE = 'DELETE_CLIENT_IMAGE';
export const DELETE_CLIENT_DOC = 'DELETE_CLIENT_DOC';
export const GET_CLIENT_ACCOUNT = 'GET_CLIENT_ACCOUNT';
export const GET_CLIENT_DETAIL = 'GET_CLIENT_DETAIL';
export const GET_CLIENT_DETAIL_PARAMS = 'GET_CLIENT_DETAIL_PARAMS';
export const GET_CLIENT_DOCUMENTS = 'GET_CLIENT_DOCUMENTS';
export const GET_CLIENT_ID = 'GET_CLIENT_ID';
export const GET_CLIENT_IMAGE = 'GET_CLIENT_IMAGE';
export const GET_CLIENT_SUMMARY = 'GET_CLIENT_SUMMARY';
export const GET_DOC_ATTACH = "GET_DOC_ATTACH";
export const PUT_CLIENT_ID = 'PUT_CLIENT_ID';

// Index
export function clientIndex(payload, createRows) {
  return { type: CLIENT_INDEX, payload, createRows };
}


// Add
export function checkDuplicate(payload, checkTotalFilter) {
  return { type: CHECK_DUPLICATE, payload, checkTotalFilter };
}

export function clientTemplate(payload, setClientTemplate) {
  return { type: CLIENT_TEMPLATE, payload, setClientTemplate };
}

export function clientAdd(payload, setClientAddRes) {
  return { type: CLIENT_ADD, payload, setClientAddRes };
}

export function clientAddImage(payload, res, uploadSelfieRes) {
  return { type: CLIENT_ADD_IMAGE, payload, res, uploadSelfieRes };
}

export function clientAddDocument(payload, res, setClientDocuments) {
  return { type: CLIENT_ADD_DOCUMENT, payload, res, setClientDocuments };
}


// Detail
export function deleteClientImage(payload, setClientImage) {
  return { type: DELETE_CLIENT_IMAGE, payload, setClientImage };
}

export function deleteClientDoc(payload, setClientDocId) {
  return { type: DELETE_CLIENT_DOC, payload, setClientDocId };
}

export function getClientId(payload, setClientId) {
  return { type: GET_CLIENT_ID, payload, setClientId };
}

export function getClientAccount(payload, setClientAccount) {
  return { type: GET_CLIENT_ACCOUNT, payload, setClientAccount };
}

export function getClientDetail(payload, setClientDetail) {
  return { type: GET_CLIENT_DETAIL, payload, setClientDetail };
}

export function getClientDocuments(payload, setClientDocuments) {
  return { type: GET_CLIENT_DOCUMENTS, payload, setClientDocuments };
}

export function getClientImage(payload, getClientImage) {
  return { type: GET_CLIENT_IMAGE, payload, getClientImage };
}

export function getClientSummary(payload, setClientSummary) {
  return { type: GET_CLIENT_SUMMARY, payload, setClientSummary };
}

export function getDocAttach(payload, setDocAttach) {
  return { type: GET_DOC_ATTACH, payload, setDocAttach };
}

// Edit
export function putClientId(payload, setClientPutRes, showErrorExist, clientId) {
  return { type: PUT_CLIENT_ID, payload, setClientPutRes, showErrorExist, clientId };
}