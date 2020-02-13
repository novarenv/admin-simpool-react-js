import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  Input,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane
} from 'reactstrap';
import Modal from 'react-modal';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import ReactDataGrid from 'react-data-grid';
import PropTypes from 'prop-types';
import { withTranslation, Trans } from 'react-i18next';

import ContentWrapper from '../../../components/Layout/ContentWrapper';

import * as actions from '../../../store/actions/actions';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';

class MemberDataDetail extends Component {
  constructor(props) {
    super(props);

    const clientId = this.props.match.params.id

    const setClientDetail = res => {
      console.log(res)
      this.setState({
        clientDetail: res
      })
    }
    const setClientImage = res => {
      this.setState({
        clientImage: res
      })
    }

    this.props.actions.getClientDetail(clientId, setClientDetail)
    this.props.actions.getClientImage(clientId, setClientImage)
    
    this.state = {
      activeTab: 'detail',
      clientId: clientId,
      clientDetail: '',
      clientImage: null
    };
  }
  
  toggleTab = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  openPane = () => {
    this.setState({ isPaneOpen: !this.state.isPaneOpen })
    console.log(this.state.isPaneOpen)
  }

  render() {
    const dd = String(new Date().getDate()).padStart(2, '0')
    const mm = String(new Date().getMonth() + 1).padStart(2, '0') //January is 0!
    const yyyy = new Date().getFullYear()

    const today = dd + '/' + mm + '/' + yyyy

    const img = {
      width: "10%",
      height: "10%"
    }

    return (
      <ContentWrapper>
        <div className="content-heading">
          <div>Detail Member</div>
        </div>

        <Card className="card-default">
          <CardBody>    
            <div className="row mb-3">
              <div className="col-md-4 col-lg-2">
                <Link to="/simpool/member/data">
                  <Button outline className="col-12" color="primary" type="submit" tabIndex={7}>Kembali</Button>
                </Link>
              </div>
              <div className="col-md-8 col-lg-10">
                <Link to="/simpool/member/saving-data-add">
                  <Button className="col-md-5 offset-md-1 col-lg-3 offset-lg-5" color="primary" type="button">
                    Simpanan
                  </Button>
                </Link>
                <Link to="/simpool/member/loan-data-add">
                  <Button className="col-md-5 offset-md-1 col-lg-3 offset-lg-1" color="primary" type="button">
                    Pinjaman
                  </Button>
                </Link>
              </div>
            </div>

            <div className="center-parent mt-5">
              <h1>{this.state.clientDetail.fullname}</h1>
              <img className="mt-2" src={this.state.clientImage} style={img} />
            </div>

            <div role="tabpanel row">
                <Nav tabs justified>
                  <NavItem className="nav-tab">
                    <NavLink className={this.state.activeTab === 'detail' ? 'active' : ''}
                      onClick={() => { this.toggleTab('detail'); }}
                    >
                      Detail
                    </NavLink>
                  </NavItem>
                  <NavItem className="nav-tab">
                    <NavLink className={this.state.activeTab === 'saving' ? 'active' : ''}
                      onClick={() => { this.toggleTab('saving'); }}
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
                  <TabPane tabId="detail" role="tabpanel">            
                    <form className="form-font-size mt-3">
                      <label htmlFor="savingType">Jenis Simpanan</label>
                      <select defaultValue="" className="custom-select custom-select-sm input-font-size" name="savingType" tabIndex={1} disabled>
                        <option>Jenis Simpanan</option>
                        <option defaultValue="pokok">Pokok</option>
                        <option defaultValue="wajib">Wajib</option>
                        <option defaultValue="sukarela">Sukarela</option>
                      </select>

                      <label className="mt-3" htmlFor="member">Anggota</label>
                      <Input className="form-control mr-3 input-font-size" type="text" placeholder="Search anggota.."
                          value={this.state.selectedMember} tabIndex={2} readOnly/>

                      <label className="mt-3" htmlFor="openDate">Tanggal Buka</label>
                      <Input
                        type="text"
                        id="openDate"
                        name="openDate"
                        className="input-font-size"
                        placeholder="dd-mm-yyyy"
                        value={today}
                        tabIndex={4}
                        readOnly
                      />

                      <label className="mt-3" htmlFor="initDepositValue">// Nanti Ambil dari API</label><br />
                      <label className="mt-3" htmlFor="initDepositValue">Nilai Setoran Awal</label>
                      <Input
                        type="number"
                        id="initDepositValue"
                        name="initDepositValue"
                        className="input-font-size"
                        placeholder="minimal 3.000.000"
                        tabIndex={5}
                        readOnly
                      />

                      <label className="mt-3" htmlFor="initDepositValue">// Nomor Rekening Ambil dari Anggota</label><br />
                      <label className="mt-3" htmlFor="depositNumber">Nomor Rekening Simpanan</label>
                      <Input
                        type="text"
                        id="depositNumber"
                        name="depositNumber"
                        className="input-font-size"
                        tabIndex={6}
                        readOnly
                      />

                      <Link to="/simpool/member/data-edit">
                        <Button outline className="mt-3 col-12" color="warning" tabIndex={7}>Edit Anggota</Button>
                      </Link>
                    </form>             
                  </TabPane>

                  <TabPane tabId="saving" role="tabpanel">
                    
                  </TabPane>

                  <TabPane tabId="loan" role="tabpanel">
                    
                  </TabPane>
                </TabContent>
              </div>
          </CardBody>
        </Card>
      </ContentWrapper>
    )
  }
}


MemberDataDetail.propTypes = {
  actions: PropTypes.object,
  memberData: PropTypes.object,
  search: PropTypes.object
}

const mapStateToProps = state => ({
  memberData: state.memberData,
  search: state.search
})
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) })

export default compose(connect(mapStateToProps, mapDispatchToProps), withTranslation('translations'))(withRouter(MemberDataDetail));