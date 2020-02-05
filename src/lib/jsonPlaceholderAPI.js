import PropTypes from 'prop-types';
import * as actions from '../store/actions/actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

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
export const clientUrl = `${apiEntrySimpool}/clients`;
export const searchUrl = `${apiEntrySimpool}/search`;