import React, { Suspense, lazy } from 'react';
import { withRouter, Switch, Route, Redirect } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

/* loader component for Suspense*/
import PageLoader from './components/Common/PageLoader';

import Base from './components/Layout/Base';
import BasePage from './components/Layout/BasePage';

const waitFor = Tag => props => <Tag {...props}/>;

const Dashboard = lazy(() => import('./components/Dashboard/Dashboard'));

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
                              <Route path="/dashboard" component={waitFor(Dashboard)}/>
                              
                              <Redirect to="/dashboard"/>
                              
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