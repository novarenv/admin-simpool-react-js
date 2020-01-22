const apiEntryBiller =
  'http://demo.ikkat.datacomm.co.id:8081/biller-management/api';
const apiEntrySimpool =
  'https://demo.ikkat.datacomm.co.id:8443/fineract-provider/api/v1';

export const headers = {
  'Content-Type': 'application/json',
  'Fineract-Platform-TenantId': '010006',
};

export const basicAuth = {
  'username': 'agung',
  'password': '123'
}


export const loginUrl = `${apiEntrySimpool}/mobile/authentication`;
