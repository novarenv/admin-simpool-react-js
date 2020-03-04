import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import * as actions from '../../store/actions/actions';

import HeaderRun from './Header.run'

class Header extends Component {

  componentDidMount() {
    HeaderRun();
  }

  toggleUserblock = e => {
    e.preventDefault();
    console.log(e)
    this.props.actions.toggleSetting('showUserBlock');
  }

  toggleCollapsed = e => {
    e.preventDefault()
    this.props.actions.toggleSetting('isCollapsed');
    this.resize()
  }

  toggleAside = e => {
    // e.preventDefault()
    this.props.actions.toggleSetting('asideToggled');
  }

  resize() {
    // all IE friendly dispatchEvent
    var evt = document.createEvent('UIEvents');
    evt.initUIEvent('resize', true, false, window, 0);
    window.dispatchEvent(evt);
    // modern dispatchEvent way
    // window.dispatchEvent(new Event('resize'));
  }

  render() {
    return (
      <header className="topnavbar-wrapper">
        { /* START Top Navbar */}
        <nav className="navbar topnavbar">
          { /* START navbar header */}
          <div className="navbar-header">
            <div className="navbar-brand">
              <div className="brand-logo">
                <img className="img-fluid" src="/img/Simpool 1 Text Dark BG.png" alt="App Logo" />
              </div>
              <div className="brand-logo-collapsed">
                <img className="img-fluid-box" src="/img/Simpool Box.png" alt="App Logo" />
              </div>
            </div>
          </div>
          { /* END navbar header */}

          { /* START Left navbar */}
          <ul className="navbar-nav mr-auto flex-row">
            <li className="nav-item">
              { /* Button used to collapse the left sidebar. Only visible on tablet and desktops */}
              <div className="nav-link d-none d-md-block d-lg-block d-xl-block cursor-pointer" onClick={this.toggleCollapsed}>
                <em className="fas fa-bars"></em>
              </div>
              { /* Button to show/hide the sidebar on mobile. Visible on mobile only. */}
              <div className="nav-link sidebar-toggle d-md-none cursor-pointer" onClick={this.toggleAside}>
                <em className="fas fa-bars"></em>
              </div>
            </li>
            { /* START User avatar toggle */}
            <li className="nav-item">
              <div className="nav-link d-block d-md-block d-lg-block d-xl-block cursor-pointer" onClick={this.toggleUserblock}>
                <em className="icon-user"></em>
              </div>
            </li>
            { /* END User avatar toggle */}
          </ul>
          { /* END Left navbar */}
          { /* START Right Navbar */}
          <ul className="navbar-nav flex-row">
            { /* Fullscreen (only desktops) */}
            {/* <li className="nav-item d-none d-md-block">
              <ToggleFullscreen className="nav-link cursor-pointer" />
            </li> */}
            { /* END Offsidebar menu */}
          </ul>
          { /* END Right Navbar */}
        </nav>
        { /* END Top Navbar */}
      </header>
    );
  }

}

Header.propTypes = {
  actions: PropTypes.object,
  settings: PropTypes.object
};

const mapStateToProps = state => ({ settings: state.settings })
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) })

export default compose(connect(
  mapStateToProps,
  mapDispatchToProps
)(Header));