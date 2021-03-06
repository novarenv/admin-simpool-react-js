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
export const checkDuplicateUrl = `${apiEntrySimpool}/clients/checkduplicate`;
export const clientUrl = `${apiEntrySimpool}/clients`;
export const clientTemplateUrl = `${apiEntrySimpool}/clients/template`;
export const clientImageUrl = clientId => `${apiEntrySimpool}/clients/${clientId}/images`;

// Transactions
export const findAccountTransferUrl = `${apiEntrySimpool}/accounttransfers/findaccount`;
export const transactionsUrl = `${apiEntrySimpool}/transactions`;