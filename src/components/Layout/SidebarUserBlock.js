import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Collapse } from 'reactstrap';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';
import { Link, withRouter } from 'react-router-dom';

const logOut = () => {
  console.log("Log Out Clicked")
  Cookies.remove("loginToken")
}

class SidebarUserBlock extends Component {

  state = {
    showUserBlock: false
  }

  componentWillReceiveProps(newProps) {
    if (newProps.showUserBlock !== this.props.showUserBlock) {
      this.setState({ showUserBlock: newProps.showUserBlock })
    }
  }

  render() {
    return (
      <Collapse id="user-block" isOpen={this.state.showUserBlock}>
        <div>
          <div className="item user-block center-block">
            {/* User picture */}
            <div className="user-block-picture">
              <div className="user-block-status">
                <img className="img-fluid-box" src="img/Simpool Box.png" alt="Avatar" />
                <div className="circle bg-success circle-lg"></div>
              </div>
            </div>
            {/* Name and Job */}
            <div className="user-block-info">
              <span className="user-block-name">Hello, Simpool's Admin</span>
              <span className="user-block-role">Administrator</span>
              <Link to="/login">
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
}

SidebarUserBlock.propTypes = {
  showUserBlock: PropTypes.bool
};

const mapStateToProps = state => ({ showUserBlock: state.settings.showUserBlock })

export default withRouter(
  connect(mapStateToProps)(SidebarUserBlock)
);