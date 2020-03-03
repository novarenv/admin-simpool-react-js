import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import {
  Button,
  Card,
  CardBody,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane
} from 'reactstrap'
import { withTranslation } from 'react-i18next'
import Modal from 'react-modal'

import PropTypes from 'prop-types'
import * as actions from '../../../store/actions/actions'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import ContentWrapper from '../../../components/Layout/ContentWrapper'

class SavingDataDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalQr: false
    }
  }

  render() {
    const state = this.state

    return (
      <ContentWrapper ref={ref => this.el = ref}>
        <Modal
          isOpen={state.modalQr}
          onRequestClose={() => this.setState({modalQr: false})}
        >
          <div className="container-fluid">
            <div className="row">
              <Button outline className="col-4 col-lg-2" color="primary"
                onClick={() => this.setState({modalQr: false})}
              >
                Kembali
            </Button>
            </div>
          </div>
        </Modal>

        <div className="content-heading">
          <div>Detail Simpanan</div>
        </div>

        <Card className="card-default">
          <CardBody>
            <Link
              to={{
                pathname: "/simpool/member/saving-data",
                search: "?tenantIdentifier=" + this.props.tenantIdentifier
              }}>
              <Button outline className="mt-3 col-4 col-md-2" color="primary" type="submit">Kembali</Button>
            </Link>


            <div className="center-parent mt-5">
              <h1>
                Simpanan Anggota
              </h1>
              <h3
                style={{ marginBottom: 0 }}
              >
                00122000041
              </h3>
              <button
                className="btn btn-secondary mt-2"
                style={{ marginTop: 0 }}
                onClick={console.log("Hi")}>
                Generate QR
              </button>
            </div>

            <Nav tabs justified className="mt-5">
              <NavItem className="nav-tab">
                <NavLink className={this.state.activeTab === 'detail' ? 'active' : ''}
                  onClick={() => { this.toggleTab('detail'); }}
                >
                  Detail
                  </NavLink>
              </NavItem>
              <NavItem className="nav-tab">
                <NavLink className={this.state.activeTab === 'savings' ? 'active' : ''}
                  onClick={() => { this.toggleTab('savings'); }}
                >
                  Simpanan
                  </NavLink>
              </NavItem>
              <NavItem className="nav-tab">
                <NavLink className={this.state.activeTab === 'loan' ? 'active' : ''}
                  onClick={() => { this.toggleTab('loan'); }}
                >
                  Pinjaman
                  </NavLink>
              </NavItem>
            </Nav>

            <TabContent activeTab={this.state.activeTab}>
              <TabPane className="ft-detail" tabId="detail" role="tabpanel">

              </TabPane>
              <TabPane className="ft-detail" tabId="detail" role="tabpanel">

              </TabPane>
              <TabPane className="ft-detail" tabId="detail" role="tabpanel">

              </TabPane>
            </TabContent>
          </CardBody>
        </Card>
      </ContentWrapper>
    )
  }
}


SavingDataDetail.propTypes = {
  actions: PropTypes.object,
  settings: PropTypes.object
}

const mapStateToProps = state => ({
  settings: state.settings
})
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) })

export default compose(connect(mapStateToProps, mapDispatchToProps), withTranslation('translations'))(withRouter(SavingDataDetail))