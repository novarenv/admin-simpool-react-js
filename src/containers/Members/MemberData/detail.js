import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane
} from 'reactstrap';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import PropTypes from 'prop-types';
import { withTranslation, Trans } from 'react-i18next';

import ContentWrapper from '../../../components/Layout/ContentWrapper';

import * as actions from '../../../store/actions/actions';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';

const SHORT_MONTHS_ID = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'Mei',
  'Jun',
  'Jul',
  'Agu',
  'Sep',
  'Okt',
  'Nov',
  'Des',
];

const MONTHS_ID = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember'
]

const Savings = props => {
  const NumberFormatted = amount => {
    const amountInt = parseInt(amount)

    return amountInt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  return (
    <div>
      <div className="row ft-detail list-header d-flex justify-content-center center-parent">
        <div className="col-2">
          <span>Account Number</span>
        </div>
        <div className="col-2">
          <span>Saving Product</span>
        </div>
        <div className="col-2">
          <span>Bilyet Number</span>
        </div>
        <div className="col-2">
          <span>Last Active</span>
        </div>
        <div className="col-2">
          <span>Balance</span>
        </div>
      </div>
      {
        props.savings.map((acc, key) => {
          const rowClicked = () => {
            console.log("Clicked!")
          }

          return (
            <div key={"Saving " + key}>
              <div className="row ft-detail list-detail d-flex justify-content-center list-hover center-parent" onClick={() => rowClicked()}>
                <div className="col-2">
                  <span>{acc.accountNo}</span>
                </div>
                <div className="col-2">
                  <span>{acc.productName}</span>
                </div>
                <div className="col-2">
                  <span>{acc.bilyetNumber}</span>
                </div>
                <div className="col-2">
                  <span>{acc.lastActiveTransactionDate[2]} {MONTHS_ID[acc.lastActiveTransactionDate[1] - 1]} {acc.lastActiveTransactionDate[0]}</span>
                </div>
                <div className="col-2">
                  {
                    acc.accountBalance != null
                      ? (<span>{NumberFormatted(acc.accountBalance)}</span>)
                      : null
                  }
                </div>
              </div>
              <div className="row d-flex justify-content-center">
                <hr className="col-10 hr-margin-0" />
              </div>
            </div>
          )
        })
      }
    </div>
  )
}

class MemberDataDetail extends Component {
  constructor(props) {
    super(props);

    const clientIdNo = this.props.match.params.id

    const setClientAccount = res => {
      this.setState({
        clientAccount: res
      })
    }
    const setClientDetail = res => {
      this.setState({
        clientDetail: res
      })
    }
    const setClientImage = res => {
      this.setState({
        clientImage: res
      })
    }
    const setClientId = res => {
      this.setState({
        clientId: res
      })
    }
    const setClientSummary = res => {
      this.setState({
        clientSummary: res[0]
      })
    }

    this.props.actions.getClientAccount(clientIdNo, setClientAccount)
    this.props.actions.getClientDetail(clientIdNo, setClientDetail)
    this.props.actions.getClientImage(clientIdNo, setClientImage)
    this.props.actions.getClientId(clientIdNo, setClientId)
    this.props.actions.getClientSummary(clientIdNo, setClientSummary)

    this.state = {
      activeTab: 'detail',
      clientId: null,
      clientIdNo: clientIdNo,
      clientAccount: {
        savingsAccounts: []
      },
      clientDetail: null,
      clientImage: null,
      clientSummary: null
    };
  }

  toggleTab = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  NumberFormatted = amount => {
    const amountInt = parseInt(amount)

    return amountInt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  render() {
    const img = {
      maxWidth: "250px",
      maxHeight: "250px"
    }

    const clientDetail = this.state.clientDetail
    const clientId = this.state.clientId
    const clientSummary = this.state.clientSummary

    const dateOfBirthSpouse = date => {
      const day = date.substring(4, 6)
      const month = date.substring(0, 3)
      const year = date.substring(8, 12)
      let monthMMMM

      SHORT_MONTHS_ID.map((monthMap, key) => {
        if (month === monthMap) {
          monthMMMM = MONTHS_ID[key]
        }
      })

      return day + " " + monthMMMM + " " + year
    }

    const merchantInformationCode = code => {
      let desc

      clientDetail.merchantInformationCodeOption.map(merchant => {
        if (merchant.code === code) {
          desc = merchant.description
        } 
      })

      return code + " - " + desc
    }

    const merchantCategoryCode = code => {
      let desc

      clientDetail.merchantCategoryOption.map(merchant => {
        if (merchant.code === code) {
          desc = merchant.description
        }
      })

      return code + " - " + desc
    }

    return (
      <ContentWrapper>
        <div className="content-heading">
          <div>Detail Member</div>
        </div>

        <Card className="card-default">
          <CardBody>
            <Link to="/simpool/member/data">
              <Button outline className="col-4 col-lg-2" color="primary"
                type="submit" tabIndex={7}
              >
                Kembali
              </Button>
            </Link>

            <div className="center-parent mt-5">
              <h1>
                {
                  clientDetail != null
                    ? clientDetail.fullname
                    : null
                }
              </h1>
            </div>

            <div className="row mt-5 mb-2">
              <div className="mt-2 col-lg-2 center-parent mb-3">
                <div>
                  {
                    this.state.clientImage != null
                      ? (<img src={this.state.clientImage} style={img} />)
                      : (<img src={"/img/user.png"} style={img} />)
                  }
                </div>
                <div className="mt-1">
                  <button className="btn btn-sm btn-secondary mr-1" type="button">
                    <em className="fa fa-upload"></em>
                  </button>
                  <button className="btn btn-sm btn-secondary mr-1" type="button">
                    <em className="fa fa-camera"></em>
                  </button>
                  <button className="btn btn-sm btn-secondary" type="button">
                    <em className="fa fa-trash"></em>
                  </button>
                </div>
              </div>
              <div className="mt-2 col-lg-5 ft-detail mb-3">
                <div className="center-parent">
                  <h3>Profile</h3>
                </div>
                <div className="row mt-3">
                  <span className="col-md-4">Activation Date</span>
                  <strong className="col-md-8">
                    {
                      clientId != null
                        ? clientId.activationDate[2] + " " + MONTHS_ID[clientId.activationDate[1] - 1] + " " + clientId.activationDate[0]
                        : "-"
                    }
                  </strong>
                </div>
                <div className="row mt-3">
                  <span className="col-md-4">Member of</span>
                  <strong className="col-md-8">
                    {
                      clientId != null
                        ? clientId.member == false
                          ? "Unassigned"
                          : clientId.member
                        : "-"
                    }
                  </strong>
                </div>
                <div className="row mt-3">
                  <span className="col-md-4">Mobile Number</span>
                  <strong className="col-md-8">
                    {
                      clientId != null
                        ? clientId.mobileNo
                        : "-"
                    }
                  </strong>
                </div>
                <div className="row mt-3">
                  <span className="col-md-4">Gender</span>
                  <strong className="col-md-8">
                    {
                      clientId != null
                        ? clientId.gender.description
                        : "-"
                    }
                  </strong>
                </div>
                <div className="row mt-3">
                  <span className="col-md-4">Date of Birth</span>
                  <strong className="col-md-8">
                    {
                      clientId != null
                        ? clientId.dateOfBirth[2] + " " + MONTHS_ID[clientId.dateOfBirth[1] - 1] + " " + clientId.dateOfBirth[0]
                        : "-"
                    }
                  </strong>
                </div>
              </div>
              <div className="mt-2 col-lg-5 ft-detail mb-3">
                <div className="center-parent">
                  <h3>Performance History</h3>
                </div>
                <div className="row mt-3">
                  <span className="col-md-4">Loan Cycle</span>
                  <strong className="col-md-8">
                    {
                      clientSummary != null
                        ? clientSummary.loancycle
                        : "-"
                    }
                  </strong>
                </div>
                <div className="row mt-3">
                  <span className="col-md-4">Last Loan Ammount</span>
                  <strong className="col-md-8">
                    {
                      clientSummary != null
                        ? clientSummary.loancycle != null
                          ? clientSummary.loancycle
                          : 0
                        : "-"
                    }
                  </strong>
                </div>
                <div className="row mt-3">
                  <span className="col-md-4">Active Loans</span>
                  <strong className="col-md-8">
                    {
                      clientSummary != null
                        ? clientSummary.activeloans
                        : "-"
                    }
                  </strong>
                </div>
                <div className="row mt-3">
                  <span className="col-md-4">Total Savings</span>
                  <strong className="col-md-8">
                    {
                      clientSummary != null
                        ? this.NumberFormatted(clientSummary.totalsavings)
                        : "-"
                    }
                  </strong>
                </div>
                <div className="row mt-3">
                  <span className="col-md-4">Active Savings</span>
                  <strong className="col-md-8">
                    {
                      clientSummary != null
                        ? clientSummary.activesavings
                        : "-"
                    }
                  </strong>
                </div>
                <div className="row mt-3">
                  <span className="col-md-4">Tax Status</span>
                  <strong className="col-md-8">-</strong>
                </div>
                <div className="row mt-3">
                  <span className="col-md-4">Last Tax Active</span>
                  <strong className="col-md-8">-</strong>
                </div>
              </div>
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
                  <div className="center-parent mt-3 mb-3">
                    <h3>Identity</h3>
                  </div>

                  <div className="row">
                    <div className="col-lg-6">
                      <div className="row mt-3">
                        <span className="col-md-4">Office</span>
                        <strong className="col-md-8">
                          {
                            clientId != null
                              ? clientId.officeName
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Staff</span>
                        <strong className="col-md-8">
                          {
                            clientId != null
                              ? clientId.staffName
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Client Type</span>
                        <strong className="col-md-8">
                          {
                            clientId != null
                              ? clientId.legalForm.value
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Sector</span>
                        <strong className="col-md-8">
                          {
                            clientId != null
                              ? clientId.sector.name
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">CIF Number</span>
                        <strong className="col-md-8">
                          {
                            clientId != null
                              ? clientId.accountNo
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">External ID</span>
                        <strong className="col-md-8">
                          {
                            clientId != null
                              ? clientId.externalId
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Working ID Number</span>
                        <strong className="col-md-8">
                          {
                            clientId != null
                              ? clientId.nip
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Prefix Title Name</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.prefixDescription.description
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Identity Name</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.fullname
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Full Name</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.fullnameNonIdentity
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Alias</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.nickname
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Suffix Title Name</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.suffixDescription.description
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Type of Identity</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.typeOfIdentity.description
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Identity Number</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.identityNumber
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Identity Valid Date</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.identityValidDate[2] + " " + MONTHS_ID[clientDetail.identityValidDate[1] - 1] + " " + clientDetail.identityValidDate[0]
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Address Based on Identity</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.addressBasedOnIdentity
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Country</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.identityCountry.description
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Province</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.identityProvince.description
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">District / City</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.identityCity.description
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Sub District</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.identitySubDistrict
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Village</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.identityVillage
                              : "-"
                          }
                        </strong>
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="row mt-3">
                        <span className="col-md-4">Postal Code</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.identityPostalCode
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">RT</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.identityRt
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">RW</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.identityRw
                              : "-"
                          }
                        </strong>
                      </div>
                      <hr className="col-6" />
                      <div className="row mt-3">
                        <span className="col-md-4">Gender</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.gender.description
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Date of Birth</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.dateOfBirth[2] + " " + MONTHS_ID[clientDetail.dateOfBirth[1] - 1] + " " + clientDetail.dateOfBirth[0]
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Mother's Maiden Name</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.motherName
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Place of Birth</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.placeOfBirth
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Mobile Number</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.mobileNo
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Phone Number</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.phoneNumber
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Fax Number</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.faxNumber
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Religion</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.religion.description
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Email</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.email
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Marital Status</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.maritalStatusCode.description
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Type of Identity</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.typeOfIdentityBiOptions[clientDetail.biInformation.typeOfIdentity - 1].description
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Spouse Identity Number</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.biInformation.spouseIdentityNumber
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Spouse Name</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.biInformation.spouseName
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Pre-post Nuptial Agreement</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.biInformation.prePostNuptialAggreement
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Date of Birth of Spouse</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? dateOfBirthSpouse(clientDetail.biInformation.dateOfBirthSpouse)
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Last Education Level</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.lastEducationLevelCode.description
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Last Education Level Other</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.lastEducationLevelDescription
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Is Citizen ?</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.isCitizen
                                ? "true"
                                : "false"
                              : "-"
                          }
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="center-parent mt-5 mb-3">
                    <h3>Address</h3>
                  </div>

                  <div className="row">
                    <div className="col-lg-6">
                      <div className="row mt-3">
                        <span className="col-md-4">Domicile Address</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.address
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Country</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.country.description
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Province</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.province.description
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">District / City</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.city.description
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Sub District</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.subDistrict
                              : "-"
                          }
                        </strong>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="row mt-3">
                        <span className="col-md-4">Village</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.village
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Postal Code</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.postalCode
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">RT</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.rt
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">RW</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.rw
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Home Ownership Status</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.otherHomeOwnershipStatus
                              : "-"
                          }
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="center-parent mt-5 mb-3">
                    <h3>Other Information</h3>
                  </div>

                  <div className="row">
                    <div className="col-lg-6">
                      <div className="row mt-3">
                        <span className="col-md-4">Tax Number</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.taxNumber
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Name Based on Tax</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.taxName
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Address Based on Tax</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.taxAddress
                              : "-"
                          }
                        </strong>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="row mt-3">
                        <span className="col-md-4">Flag Tax</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.isTaxActive
                                ? "Yes"
                                : "No"
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Merchant Account Information Code</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? merchantInformationCode(clientDetail.merchantInformationCode)
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Merchant Category</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? merchantCategoryCode(clientDetail.merchantCategoryCode)
                              : "-"
                          }
                        </strong>
                      </div>
                    </div>
                  </div>
                  <hr className="col-6" />
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="row">
                        <span className="col-md-4">Mobile Username</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.mobileUser
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Activation CIF Date</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.timeline.activatedOnDate[2] + " " + MONTHS_ID[clientDetail.timeline.activatedOnDate[1] - 1] + " " + clientDetail.timeline.activatedOnDate[0]
                              : "-"
                          }
                        </strong>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="row">
                        <span className="col-md-4">Submitted on Date</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.timeline.submittedOnDate[2] + " " + MONTHS_ID[clientDetail.timeline.submittedOnDate[1] - 1] + " " + clientDetail.timeline.submittedOnDate[0]
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Resignation Date</span>
                        <strong className="col-md-8">
                          {
                            // clientId != null
                            //   ? clientId.officeName
                            //   : 
                              "-"
                          }
                        </strong>
                      </div>
                    </div>
                  </div>

                  <Link to="/simpool/member/data-edit">
                    <Button outline className="mt-4 mb-2 col-12" color="warning" tabIndex={7}>Edit Member</Button>
                  </Link>
                </TabPane>

                <TabPane tabId="savings" role="tabpanel">
                  {
                    Array.isArray(this.state.clientAccount.savingsAccounts) && this.state.clientAccount.savingsAccounts.length > 0
                      ? (<Savings savings={this.state.clientAccount.savingsAccounts} />)
                      : (
                        <div className="center-parent mt-3 ft-detail">
                          <span>Pengguna tidak punya simpanan</span>
                        </div>
                      )
                  }
                  <Link to="/simpool/member/saving-data-add">
                    <Button outline className="col-12 mt-4 mb-2" color="primary" type="button">
                      Tambah Simpanan
                    </Button>
                  </Link>
                </TabPane>

                <TabPane tabId="loan" role="tabpanel">
                  <Link to="/simpool/member/loan-data-add">
                    <Button outline className="col-12 mt-4 mb-2" color="primary" type="button">
                      Pinjaman
                    </Button>
                  </Link>
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