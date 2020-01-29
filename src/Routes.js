import React, { Suspense, lazy, useEffect } from 'react';
import { withRouter, Switch, Route, Redirect } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Cookies from "js-cookie";
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

/* loader component for Suspense*/
import PageLoader from './components/Common/PageLoader';

import Base from './components/Layout/Base';
import BasePage from './components/Layout/BasePage';
import * as actions from './store/actions/actions';

const waitFor = Tag => props => <Tag {...props} />;

const Dashboard = lazy(() => import('./containers/Dashboard'));

// Auth
const Login = lazy(() => import('./containers/Auth/Login'));

// Members
const MemberData = lazy(() => import('./containers/Members/MemberData'));
const MemberDataAdd = lazy(() => import('./containers/Members/MemberData/add'));
const MemberDataDetail = lazy(() => import('./containers/Members/MemberData/detail'));
const MemberDataEdit = lazy(() => import('./containers/Members/MemberData/edit'));
const SavingData = lazy(() => import('./containers/Members/SavingData'));
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

// Transactions
const Deposit = lazy(() => import('./containers/Transactions/Deposit'));
const Withdrawal = lazy(() => import('./containers/Transactions/Withdrawal'));
const LoanPayment = lazy(() => import('./containers/Transactions/LoanPayment'));
const Transfer = lazy(() => import('./containers/Transactions/Transfer'));

// Accounting
const AccountChart = lazy(() => import('./containers/Accounting/AccountChart'));
const AccountChartTree = lazy(() => import('./containers/Accounting/AccountChart/TreeView'));
const BeginningBalance = lazy(() => import('./containers/Accounting/BeginningBalance'));

const Register = lazy(() => import('./components/Pages/Register'));
const Recover = lazy(() => import('./components/Pages/Recover'));
const Lock = lazy(() => import('./components/Pages/Lock'));
const NotFound = lazy(() => import('./components/Pages/NotFound'));
const Error500 = lazy(() => import('./components/Pages/Error500'));
const Maintenance = lazy(() => import('./components/Pages/Maintenance'));

const listofPages = [
  '/lock',
  '/notfound',
  '/error500',
  '/maintenance'
];

const Routes = ({ location, ...props } ) => {
  const currentKey = location.pathname.split('/')[1] || '/';
  const timeout = { enter: 500, exit: 500 };

  // Animations supported
  //      'rag-fadeIn'
  //      'rag-fadeInRight'
  //      'rag-fadeInLeft'

  const animationName = 'rag-fadeIn'

  useEffect(() => {
    props.i18n.changeLanguage(props.dashboard.language)
    
    return () => { };
  }, [])

  if (Cookies.get("loginToken")) {
    if (listofPages.indexOf(location.pathname) > -1) {
      return (
        // Page Layout component wrapper
        <BasePage>
          <Suspense fallback={<PageLoader />}>
            <Switch location={location}>
              <Route exact path="/lock" component={waitFor(Lock)} />
              <Route exact path="/notfound" component={waitFor(NotFound)} />
              <Route exact path="/error500" component={waitFor(Error500)} />
              <Route exact path="/maintenance" component={waitFor(Maintenance)} />
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

                    {/* Dashboard */}
                    <Route exact path="/" component={waitFor(Dashboard)} />
                    <Route exact path="/dashboard" component={waitFor(Dashboard)} />

                    {/* Members */}
                    <Route exact path="/member/data" component={waitFor(MemberData)} />
                    <Route exact path="/member/data-add" component={waitFor(MemberDataAdd)} />
                    <Route exact path="/member/data-detail" component={waitFor(MemberDataDetail)} />
                    <Route exact path="/member/data-edit" component={waitFor(MemberDataEdit)} />
                    <Route exact path="/member/saving-data" component={waitFor(SavingData)} />
                    <Route exact path="/member/saving-data-add" component={waitFor(SavingDataAdd)} />
                    <Route exact path="/member/saving-data-detail" component={waitFor(SavingDataDetail)} />
                    <Route exact path="/member/saving-data-edit" component={waitFor(SavingDataEdit)} />
                    <Route exact path="/member/saving-data-history" component={waitFor(SavingDataHistory)} />
                    <Route exact path="/member/saving-data-history-detail" component={waitFor(SavingDataHistoryDetail)} />
                    <Route exact path="/member/saving-data-history-edit" component={waitFor(SavingDataHistoryEdit)} />
                    <Route exact path="/member/loan-data" component={waitFor(LoanData)} />
                    <Route exact path="/member/loan-data-add" component={waitFor(LoanDataAdd)} />
                    <Route exact path="/member/loan-data-detail" component={waitFor(LoanDataDetail)} />
                    <Route exact path="/member/loan-data-edit" component={waitFor(LoanDataEdit)} />
                    <Route exact path="/member/loan-data-history" component={waitFor(LoanDataHistory)} />
                    <Route exact path="/member/loan-data-history-detail" component={waitFor(LoanDataHistoryDetail)} />
                    <Route exact path="/member/loan-data-history-edit" component={waitFor(LoanDataHistoryEdit)} />
                    <Route exact path="/member/loan-data-view" component={waitFor(LoanDataView)} />
                    <Route exact path="/member/loan-data-view-detail" component={waitFor(LoanDataViewDetail)} />
                    <Route exact path="/member/loan-data-view-edit" component={waitFor(LoanDataViewEdit)} />
                    <Route exact path="/member/mobile-user" component={waitFor(MobileUser)} />

                    {/* Transactions */}
                    <Route exact path="/transaction/deposit" component={waitFor(Deposit)} />
                    <Route exact path="/transaction/withdrawal" component={waitFor(Withdrawal)} />
                    <Route exact path="/transaction/loan-payment" component={waitFor(LoanPayment)} />
                    <Route exact path="/transaction/transfer" component={waitFor(Transfer)} />

                    {/* Accounting */}
                    <Route exact path="/accounting/account-chart" component={waitFor(AccountChart)} />
                    <Route exact path="/accounting/account-chart-tree" component={waitFor(AccountChartTree)} />
                    <Route exact path="/accounting/beginning-balance" component={waitFor(BeginningBalance)} />

                    <Redirect from="/login" to="/" />
                    <Redirect to="/notfound" />
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
            <Route exact path="/login" component={waitFor(Login)} />
            <Route exact path="/register" component={waitFor(Register)} />
            <Route exact path="/recover" component={waitFor(Recover)} />

            <Redirect from="*" to="/login" />
          </Switch>
        </Suspense>
      </BasePage>
    )
  }
}

Routes.propTypes = {
  actions: PropTypes.object,
  dashboard: PropTypes.object
}

const mapStateToProps = state => ({ dashboard: state.dashboard })
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation('translations')(withRouter(Routes)));