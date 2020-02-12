export const CLIENT_INDEX = 'CLIENT_INDEX';
export const CHECK_DUPLICATE = 'CHECK_DUPLICATE';
export const CLIENT_TEMPLATE = 'CLIENT_TEMPLATE';
export const CLIENT_ADD = 'CLIENT_ADD';
export const CLIENT_ADD_IMAGE = 'CLIENT_ADD_IMAGE';
export const CLIENT_ADD_DOCUMENT = 'CLIENT_ADD_DOCUMENT';
export const GET_CLIENT_DETAIL = 'GET_CLIENT_DETAIL';
export const GET_CLIENT_IMAGE = 'GET_CLIENT_IMAGE';

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

export function clientAddImage(payload, res) {
  return { type: CLIENT_ADD_IMAGE, payload, res };
}

export function clientAddDocument(payload, res) {
  return { type: CLIENT_ADD_DOCUMENT, payload, res };
}


// Detail
export function getClientDetail(payload, setClientDetail) {
  return { type: GET_CLIENT_DETAIL, payload, setClientDetail };
}

export function getClientImage(payload, setClientImage) {
  return { type: GET_CLIENT_IMAGE, payload, setClientImage };
}