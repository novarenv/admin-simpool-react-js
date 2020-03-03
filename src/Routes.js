import React, { Suspense, lazy, useEffect, useState } from 'react';
import { withRouter, Switch, Route, Redirect } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Cookies from "js-cookie";
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import queryString from 'query-string'

import * as actions from './store/actions/actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

/* loader component for Suspense*/
import PageLoader from './components/Common/PageLoader';

import Base from './components/Layout/Base';
import BasePage from './components/Layout/BasePage';

import { setTenantIdentifier as setTenantId } from './lib/jsonPlaceholderAPI'

const waitFor = Tag => props => <Tag {...props} />;

const Dashboard = lazy(() => import('./containers/Dashboard'));

// Auth
const Login = lazy(() => import('./containers/Auth/Login'));

// Members
const MemberData = lazy(() => import('./containers/Members/MemberData'));
const MemberDataAdd = lazy(() => import('./containers/Members/MemberData/add'));
const MemberDataDetail = lazy(() => import('./containers/Members/MemberData/detail'));
const MemberDataEdit = lazy(() => import('./containers/Members/MemberData/edit'));
const SavingData = lazy(() => import('./containers/Members/SavingData/index'));
const SavingDataAdd = lazy(() => import('./containers/Members/SavingData/add'));
const SavingDataDetail = lazy(() => import('./containers/Members/SavingData/detail'));
const SavingDataEdit = lazy(() => import('./containers/Members/SavingData/edit'));
const SavingDataHistory = lazy(() => import('./containers/Members/SavingData/history'));
const SavingDataHistoryDetail = lazy(() => import('./containers/Members/SavingData/historyDetail'));
const SavingDataHistoryEdit = lazy(() => import('./containers/Members/SavingData/historyEdit'));
const LoanData = lazy(() => import('./containers/Members/LoanData'));
const LoanDataAdd = lazy(() => import('./containers/Members/LoanData/add'));
const LoanDataDetail = lazy(() => import('./containers/Members/LoanData/detail'));
const LoanDataEdit = lazy(() => import('./containers/Members/LoanData/edit'));
const LoanDataHistory = lazy(() => import('./containers/Members/LoanData/history'));
const LoanDataHistoryDetail = lazy(() => import('./containers/Members/LoanData/historyDetail'));
const LoanDataHistoryEdit = lazy(() => import('./containers/Members/LoanData/historyEdit'));
const LoanDataView = lazy(() => import('./containers/Members/LoanData/view'));
const LoanDataViewDetail = lazy(() => import('./containers/Members/LoanData/viewDetail'));
const LoanDataViewEdit = lazy(() => import('./containers/Members/LoanData/viewEdit'));
const MobileUser = lazy(() => import('./containers/Members/MobileUser'));
const MobileUserDetail = lazy(() => import('./containers/Members/MobileUser/detail'));
const MobileUserEdit = lazy(() => import('./containers/Members/MobileUser/edit'));

// Transactions
const Deposit = lazy(() => import('./containers/Transactions/Deposit'));
const Withdrawal = lazy(() => import('./containers/Transactions/Withdrawal'));
const LoanPayment = lazy(() => import('./containers/Transactions/LoanPayment'));
const Transfer = lazy(() => import('./containers/Transactions/Transfer'));

// Accounting
const AccountChart = lazy(() => import('./containers/Accounting/AccountChart'));
const AccountChartDetail = lazy(() => import('./containers/Accounting/AccountChart/detail'));
const AccountChartEdit = lazy(() => import('./containers/Accounting/AccountChart/edit'));
const AccountChartTree = lazy(() => import('./containers/Accounting/AccountChart/treeView'));
const BeginningBalance = lazy(() => import('./containers/Accounting/BeginningBalance'));

const Lock = lazy(() => import('./components/Pages/Lock'));
const NotFound = lazy(() => import('./components/Pages/NotFound'));
const Error500 = lazy(() => import('./components/Pages/Error500'));
const Maintenance = lazy(() => import('./components/Pages/Maintenance'));

const listofPages = [
  '/simpool/lock',
  '/simpool/notfound',
  '/simpool/error500',
  '/simpool/maintenance'
];

const Routes = ({ location, ...props }) => {
  const currentKey = location.pathname.split('/')[1] || '/';
  const timeout = { enter: 500, exit: 500 };

  // Animations supported
  //      'rag-fadeIn'
  //      'rag-fadeInRight'
  //      'rag-fadeInLeft'

  const animationName = 'rag-fadeIn'

  const [tenantIdentifier, setTenantIdentifier] = useState(props.settings.tenantIdentifier)

  useEffect(() => {
    const values = queryString.parse(location.search)

    // Redirect if tenant different
    // if (values.tenantIdentifier === props.settings.tenantIdentifier) {
    //   console.log(props)
      
    //   props.history.replace({
    //     pathname: "/simpool/login",
    //     search: "?tenantIdentifier=" + tenantIdentifier
    //   })
    //   return (
    //     <Redirect to={"/simpool/dashboard"} />
    //   )
    // }

    if (values.tenantIdentifier !== null) {
      setTenantId(values.tenantIdentifier)
      setTenantIdentifier(values.tenantIdentifier)

      props.actions.changeSetting("tenantIdentifier", values.tenantIdentifier)
    }

    return () => { };
  }, [location.search, props.actions])

  useEffect(() => {
    props.i18n.changeLanguage(props.dashboard.language)

    return () => { };
  }, [props.dashboard.language, props.i18n])

  if (Cookies.get("loginToken")) {
    if (listofPages.indexOf(location.pathname) > -1) {
      return (
        // Page Layout component wrapper
        <BasePage>
          <Suspense fallback={<PageLoader />}>
            <Switch location={location}>
              <Route exact path="/simpool/lock" component={waitFor(Lock)} />
              <Route exact path="/simpool/notfound" component={waitFor(NotFound)} />
              <Route exact path="/simpool/error500" component={waitFor(Error500)} />
              <Route exact path="/simpool/maintenance" component={waitFor(Maintenance)} />
            </Switch>
          </Suspense>
        </BasePage>
      )
    }
    else {
      return (
        // Layout component wrapper
        // Use <BaseHorizontal> to change layout
        <Base>
          <TransitionGroup>
            <CSSTransition key={currentKey} timeout={timeout} classNames={animationName} exit={false}>
              <div>
                <Suspense fallback={<PageLoader />}>
                  <Switch location={location}>
                    <Route exact path="/simpool/lock" component={waitFor(Lock)} />
                    <Route exact path="/simpool/notfound" component={waitFor(NotFound)} />
                    <Route exact path="/simpool/error500" component={waitFor(Error500)} />
                    <Route exact path="/simpool/maintenance" component={waitFor(Maintenance)} />

                    {/* Dashboard */}
                    <Route exact path="/simpool/dashboard/" component={waitFor(Dashboard)} />

                    {/* Members */}
                    <Route exact path="/simpool/member/data" component={waitFor(MemberData)} />
                    <Route exact path="/simpool/member/data-add" component={waitFor(MemberDataAdd)} />
                    <Route exact path="/simpool/member/data-detail/:id" component={waitFor(MemberDataDetail)} />
                    <Route exact path="/simpool/member/data-edit/:id" component={waitFor(MemberDataEdit)} />
                    <Route exact path="/simpool/member/saving-data" component={waitFor(SavingData)} />
                    <Route exact path="/simpool/member/saving-data-add" component={waitFor(SavingDataAdd)} />
                    <Route exact path="/simpool/member/saving-data-detail/:id" component={waitFor(SavingDataDetail)} />
                    <Route exact path="/simpool/member/saving-data-edit" component={waitFor(SavingDataEdit)} />
                    <Route exact path="/simpool/member/saving-data-history" component={waitFor(SavingDataHistory)} />
                    <Route exact path="/simpool/member/saving-data-history-detail" component={waitFor(SavingDataHistoryDetail)} />
                    <Route exact path="/simpool/member/saving-data-history-edit" component={waitFor(SavingDataHistoryEdit)} />
                    <Route exact path="/simpool/member/loan-data" component={waitFor(LoanData)} />
                    <Route exact path="/simpool/member/loan-data-add" component={waitFor(LoanDataAdd)} />
                    <Route exact path="/simpool/member/loan-data-detail" component={waitFor(LoanDataDetail)} />
                    <Route exact path="/simpool/member/loan-data-edit" component={waitFor(LoanDataEdit)} />
                    <Route exact path="/simpool/member/loan-data-history" component={waitFor(LoanDataHistory)} />
                    <Route exact path="/simpool/member/loan-data-history-detail" component={waitFor(LoanDataHistoryDetail)} />
                    <Route exact path="/simpool/member/loan-data-history-edit" component={waitFor(LoanDataHistoryEdit)} />
                    <Route exact path="/simpool/member/loan-data-view" component={waitFor(LoanDataView)} />
                    <Route exact path="/simpool/member/loan-data-view-detail" component={waitFor(LoanDataViewDetail)} />
                    <Route exact path="/simpool/member/loan-data-view-edit" component={waitFor(LoanDataViewEdit)} />
                    <Route exact path="/simpool/member/mobile-user" component={waitFor(MobileUser)} />
                    <Route exact path="/simpool/member/mobile-user-detail" component={waitFor(MobileUserDetail)} />
                    <Route exact path="/simpool/member/mobile-user-edit" component={waitFor(MobileUserEdit)} />

                    {/* Transactions */}
                    <Route exact path="/simpool/transaction/deposit" component={waitFor(Deposit)} />
                    <Route exact path="/simpool/transaction/withdrawal" component={waitFor(Withdrawal)} />
                    <Route exact path="/simpool/transaction/loan-payment" component={waitFor(LoanPayment)} />
                    <Route exact path="/simpool/transaction/transfer" component={waitFor(Transfer)} />

                    {/* Accounting */}
                    <Route exact path="/simpool/accounting/account-chart" component={waitFor(AccountChart)} />
                    <Route exact path="/simpool/accounting/account-chart-detail" component={waitFor(AccountChartDetail)} />
                    <Route exact path="/simpool/accounting/account-chart-edit" component={waitFor(AccountChartEdit)} />
                    <Route exact path="/simpool/accounting/account-chart-tree" component={waitFor(AccountChartTree)} />
                    <Route exact path="/simpool/accounting/beginning-balance" component={waitFor(BeginningBalance)} />

                    {
                      
                    }

                    <Redirect from="*" to={{
                      pathname: "/simpool/dashboard",
                      search: "?tenantIdentifier=" + tenantIdentifier
                    }} />
                  </Switch>
                </Suspense>
              </div>
            </CSSTransition>
          </TransitionGroup>
        </Base>
      )
    }
  } else {
    return (
      <BasePage>
        <Suspense fallback={<PageLoader />}>
          <Switch location={location}>
            <Route exact path="/simpool/login" component={waitFor(Login)} />

            <Redirect from="*" to={{
              pathname: "/simpool/login",
              search: "?tenantIdentifier=" + tenantIdentifier
            }} />
          </Switch>
        </Suspense>
      </BasePage>
    )
  }
}

Routes.propTypes = {
  actions: PropTypes.object,
  auth: PropTypes.object,
  dasboard: PropTypes.object,
  settings: PropTypes.object
}

const mapStateToProps = state => ({
  auth: state.auth,
  dashboard: state.dashboard,
  settings: state.settings
})
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation('translations')(withRouter(Routes)));