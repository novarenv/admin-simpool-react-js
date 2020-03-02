import React from 'react';
import PropTypes from 'prop-types';
import { Button, Collapse } from 'reactstrap';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';
import { Link, withRouter } from 'react-router-dom';

const logOut = () => {
  Cookies.remove("loginToken")
}

const SidebarUserBlock = props => {
  return (
    <Collapse id="user-block" isOpen={props.showUserBlock}>
      <div>
        <div className="item user-block center-block">
          <div className="user-block-picture">
            <div className="user-block-status">
              <img className="img-fluid-box" src="/img/Simpool Box.png" alt="Avatar" />
              <div className="circle bg-success circle-lg" />
            </div>
          </div>

          <div className="user-block-info">
            <span className="user-block-name">Hello, {props.auth.authRes.username ? props.auth.authRes.username : null}</span>
            <span className="user-block-role">{props.auth.authRes.roles[0].name ? props.auth.authRes.roles[0].name : null}</span>
            <Link to={{
              pathname: "/simpool/login",
              search: "?tenantIdentifier=" + props.settings.tenantIdentifier
            }}
            >
              <Button
                outline
                className="mt-2 btn-logout"
                color="danger"
                type="button"
                onClick={logOut}>
                Log Out
                </Button>
            </Link>
          </div>
        </div>
      </div>
    </Collapse>
  )
}

SidebarUserBlock.propTypes = {
  auth: PropTypes.object,
  settings: PropTypes.object,
  showUserBlock: PropTypes.bool,
};

const mapStateToProps = state => ({
  auth: state.auth,
  settings: state.settings,
  showUserBlock: state.settings.showUserBlock,
})

export default withRouter(
  connect(mapStateToProps)(SidebarUserBlock)
);