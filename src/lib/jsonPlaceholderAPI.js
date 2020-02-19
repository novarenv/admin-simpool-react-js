// const apiEntryBiller =
//   'http://demo.ikkat.datacomm.co.id:8081/biller-management/api';
const apiEntrySimpool =
  'https://demo.ikkat.datacomm.co.id:8443/fineract-provider/api/v1';

export const headers = {
  'Content-Type': 'application/json',
  'Fineract-Platform-TenantId': '010006',
};

export const loginUrl = `${apiEntrySimpool}/authentication`;
export const otpUrl = `${apiEntrySimpool}/authentication/otp`;

export const searchUrl = `${apiEntrySimpool}/search`;

// Members
export const clientUrl = `${apiEntrySimpool}/clients`;
export const clientAccountUrl = clientId => `${apiEntrySimpool}/clients/${clientId}/accounts`;
export const checkDuplicateUrl = `${apiEntrySimpool}/clients/checkduplicate`;
export const clientIdUrl = clientId => `${apiEntrySimpool}/clients/${clientId}`;
export const clientImageUrl = clientId => `${apiEntrySimpool}/clients/${clientId}/images`;
export const clientDocumentUrl = clientId => `${apiEntrySimpool}/clients/${clientId}/documents`;
export const clientDetailUrl = clientId => `${apiEntrySimpool}/clients/detail/${clientId}`;
export const clientSummaryUrl = `${apiEntrySimpool}/runreports/ClientSummary`;
export const clientTemplateUrl = `${apiEntrySimpool}/clients/template`;
export const documentAttachmentUrl = (clientId, documentId) => `${apiEntrySimpool}/clients/${clientId}/documents/${documentId}/attachment`;

// Transactions
export const findAccountTransferUrl = `${apiEntrySimpool}/accounttransfers/findaccount`;
export const transactionsUrl = `${apiEntrySimpool}/transactions`;