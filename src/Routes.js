import React, { Suspense, lazy } from 'react';
import { withRouter, Switch, Route, Redirect } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

/* loader component for Suspense*/
import PageLoader from './components/Common/PageLoader';

import Base from './components/Layout/Base';
import BasePage from './components/Layout/BasePage';

const waitFor = Tag => props => <Tag {...props}/>;

const Dashboard = lazy(() => import('./containers/Dashboard'));

// Members
const MemberData = lazy(() => import('./containers/Members/MemberData'));
const MemberDataAdd = lazy(() => import('./containers/Members/MemberData/add'));
const SavingData = lazy(() => import('./containers/Members/SavingData'));
const SavingDataAdd = lazy(() => import('./containers/Members/SavingData/add'));
const SavingHistory = lazy(() => import('./containers/Members/SavingData/history'));
const LoanData = lazy(() => import('./containers/Members/LoanData'));
const LoanDataAdd = lazy(() => import('./containers/Members/LoanData/add'));
const LoanDataHistory = lazy(() => import('./containers/Members/LoanData/history'));
const LoanDataView = lazy(() => import('./containers/Members/LoanData/view'));

// Transactions
const Deposit = lazy(() => import('./containers/Transactions/Deposit'));
const Withdrawal = lazy(() => import('./containers/Transactions/Withdrawal'));
const LoanPayment = lazy(() => import('./containers/Transactions/LoanPayment'));
const Transfer = lazy(() => import('./containers/Transactions/Transfer'));

// Accounting
const AccountChart = lazy(() => import('./containers/Accounting/AccountChart'));

const Login = lazy(() => import('./components/Pages/Login'));
const Register = lazy(() => import('./components/Pages/Register'));
const Recover = lazy(() => import('./components/Pages/Recover'));
const Lock = lazy(() => import('./components/Pages/Lock'));
const NotFound = lazy(() => import('./components/Pages/NotFound'));
const Error500 = lazy(() => import('./components/Pages/Error500'));
const Maintenance = lazy(() => import('./components/Pages/Maintenance'));

const listofPages = [
  '/login',
  '/register',
  '/recover',
  '/lock',
  '/notfound',
  '/error500',
  '/maintenance'
];

const Routes = ({ location }) => {
  const currentKey = location.pathname.split('/')[1] || '/';
  const timeout = { enter: 500, exit: 500 };

  // Animations supported
  //      'rag-fadeIn'
  //      'rag-fadeInRight'
  //      'rag-fadeInLeft'

  const animationName = 'rag-fadeIn'

  if(listofPages.indexOf(location.pathname) > -1) {
      return (
          // Page Layout component wrapper
          <BasePage>
              <Suspense fallback={<PageLoader/>}>
                  <Switch location={location}>
                      <Route path="/login" component={waitFor(Login)}/>
                      <Route path="/register" component={waitFor(Register)}/>
                      <Route path="/recover" component={waitFor(Recover)}/>
                      <Route path="/lock" component={waitFor(Lock)}/>
                      <Route path="/notfound" component={waitFor(NotFound)}/>
                      <Route path="/error500" component={waitFor(Error500)}/>
                      <Route path="/maintenance" component={waitFor(Maintenance)}/>
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
                      <Suspense fallback={<PageLoader/>}>
                          <Switch location={location}>

                              {/*Dashboard*/}
                              <Route exact path="/" component={waitFor(Dashboard)}/>
                              <Route path="/dashboard" component={waitFor(Dashboard)}/>
                              
                              {/* Members */}
                              <Route path="/member/data" component={waitFor(MemberData)}/>
                              <Route path="/member/data-add" component={waitFor(MemberDataAdd)}/>
                              <Route path="/member/saving-data" component={waitFor(SavingData)}/>
                              <Route path="/member/saving-data-add" component={waitFor(SavingDataAdd)}/>
                              <Route path="/member/saving-data-history" component={waitFor(SavingHistory)}/>
                              <Route path="/member/loan-data" component={waitFor(LoanData)}/>
                              <Route path="/member/loan-data-add" component={waitFor(LoanDataAdd)}/>
                              <Route path="/member/loan-data-history" component={waitFor(LoanDataHistory)}/>
                              <Route path="/member/loan-data-view" component={waitFor(LoanDataView)}/>

                              {/* Transactions */}
                              <Route path="/transaction/deposit" component={waitFor(Deposit)}/>
                              <Route path="/transaction/withdrawal" component={waitFor(Withdrawal)}/>
                              <Route path="/transaction/loan-payment" component={waitFor(LoanPayment)}/>
                              <Route path="/transaction/transfer" component={waitFor(Transfer)}/>

                              {/* Accounting */}
                              <Route path="/accounting/account-chart" component={waitFor(AccountChart)}/>
                              
                              <Redirect to="/notfound"/>
                              
                          </Switch>
                      </Suspense>
                  </div>
              </CSSTransition>
            </TransitionGroup>
          </Base>
      )
  }
}

export default withRouter(Routes);