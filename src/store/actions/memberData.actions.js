export const CLIENT_INDEX = 'CLIENT_INDEX';
export const CHECK_DUPLICATE = 'CHECK_DUPLICATE';
export const CLIENT_TEMPLATE = 'CLIENT_TEMPLATE';
export const CLIENT_ADD = 'CLIENT_ADD';
export const CLIENT_ADD_IMAGE = 'CLIENT_ADD_IMAGE';

export function clientIndex(payload, createRows) {
  return { type: CLIENT_INDEX, payload, createRows };
}

export function checkDuplicate(payload, checkTotalFilter) {
  return { type: CHECK_DUPLICATE, payload, checkTotalFilter };
}

export function clientTemplate(payload, setClientTemplate) {
  return { type: CLIENT_TEMPLATE, payload, setClientTemplate };
}

export function clientAdd(payload, setClientAddRes) {
  return { type: CLIENT_ADD, payload, setClientAddRes };
}

export function clientAddImage(payload) {
  return { type: CLIENT_ADD_IMAGE, payload };
}