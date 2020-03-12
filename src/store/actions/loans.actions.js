export const DELETE_LOAN_DOC = 'DELETE_LOAN_DOC'
export const LOANS = 'LOANS'
export const LOANS_DOCUMENTS = 'LOANS_DOCUMENTS'
export const LOANS_DOC_ATTACHMENT = 'LOANS_DOC_ATTACHMENT'
export const LOANS_NOTES = 'LOANS_NOTES'
export const POST_LOANS_DOCUMENTS = 'POST_LOANS_DOCUMENTS'
export const POST_LOANS_NOTES = 'POST_LOANS_NOTES'

// Detail
export function loans(payload, setLoans) {
  return { type: LOANS, payload, setLoans }
}

export function loansDocuments(payload, setLoansDocuments) {
  return { type: LOANS_DOCUMENTS, payload, setLoansDocuments }
}

export function loansDocAttachment(payload, setLoansDocAttachment) {
  return { type: LOANS_DOC_ATTACHMENT, payload, setLoansDocAttachment }
}

export function loansNotes(payload, setLoansNotes) {
  return { type: LOANS_NOTES, payload, setLoansNotes }
}

// Delete
export function deleteLoanDoc(payload, deleteLoanDocId) {
  return { type: DELETE_LOAN_DOC, payload, deleteLoanDocId }
}

// Post
export function postLoansDocuments(payload, res, setPostLoansDocuments) {
  return { type: POST_LOANS_DOCUMENTS, payload, res,  setPostLoansDocuments }
}

export function postLoansNotes(payload, setPostLoansNotes) {
  return { type: POST_LOANS_NOTES, payload, setPostLoansNotes }
}