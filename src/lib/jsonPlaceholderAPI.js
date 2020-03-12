// const apiEntryBiller =
//   'http://demo.ikkat.datacomm.co.id:8081/biller-management/api';
const apiEntrySimpool =
  'https://demo.simpool.id:8444/fineract-provider/api/v1';

let tenantIdentifier
export const setTenantIdentifier = id => {
  tenantIdentifier = id
}

export const headers = () => {
  return {
    'Content-Type': 'application/json',
    'Fineract-Platform-TenantId': tenantIdentifier,
  }
}

export const loginUrl = `${apiEntrySimpool}/authentication`
export const otpUrl = `${apiEntrySimpool}/authentication/otp`

export const searchUrl = `${apiEntrySimpool}/search`

// Members
export const clientUrl = `${apiEntrySimpool}/clients`
export const clientAccountUrl = clientId => `${apiEntrySimpool}/clients/${clientId}/accounts`
export const checkDuplicateUrl = `${apiEntrySimpool}/clients/checkduplicate`
export const clientIdUrl = clientId => `${apiEntrySimpool}/clients/${clientId}`
export const clientImageUrl = clientId => `${apiEntrySimpool}/clients/${clientId}/images`
export const clientDocumentUrl = clientId => `${apiEntrySimpool}/clients/${clientId}/documents`
export const clientDocumentIdUrl = (clientId, documentId) => `${apiEntrySimpool}/clients/${clientId}/documents/${documentId}`
export const clientDetailUrl = clientId => `${apiEntrySimpool}/clients/detail/${clientId}`
export const clientSummaryUrl = `${apiEntrySimpool}/runreports/ClientSummary`
export const clientTemplateUrl = `${apiEntrySimpool}/clients/template`
export const docAttachUrl = (clientId, documentId) => `${apiEntrySimpool}/clients/${clientId}/documents/${documentId}/attachment`

// Savings
export const accountChargesUrl = (clientId, chargeId) => `${apiEntrySimpool}/savingsaccounts/${clientId}/charges/${chargeId}`
export const accountTransactionsUrl = (clientId, trxId) => `${apiEntrySimpool}/savingsaccounts/${clientId}/transactions/${trxId}`
export const accountTransfersUrl = tfId => `${apiEntrySimpool}/accounttransfers/${tfId}`
export const qrCodeUrl = savingsId => `${apiEntrySimpool}/ppob/qrcode/${savingsId}/100`
export const savingsAccountAssosiationsUrl = savingsId => `${apiEntrySimpool}/savingsaccounts/${savingsId}`

// Loans
export const loansUrl = loanId => `${apiEntrySimpool}/loans/${loanId}`
export const loansDocumentsUrl = loanId => `${apiEntrySimpool}/loans/${loanId}/documents`
export const loansDocumentsIdUrl = (loanId, docId) => `${apiEntrySimpool}/loans/${loanId}/documents/${docId}`
export const loansDocAttachmentUrl = (loanId, docId) => `${apiEntrySimpool}/loans/${loanId}/documents/${docId}/attachment`
export const loansNotesUrl = loanId => `${apiEntrySimpool}/loans/${loanId}/notes`

// Transactions
export const findAccountTransferUrl = `${apiEntrySimpool}/accounttransfers/findaccount`
export const transactionsUrl = `${apiEntrySimpool}/transactions`