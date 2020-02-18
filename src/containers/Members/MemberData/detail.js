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
import { withTranslation } from 'react-i18next';
import Modal from 'react-modal';
import { useDropzone } from 'react-dropzone';

import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';

import ContentWrapper from '../../../components/Layout/ContentWrapper';
import Swal from '../../../components/Common/Swal';

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


  const rowClicked = () => {
    console.log("Clicked!")
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

const Loans = props => {
  const NumberFormatted = amount => {
    const amountInt = parseInt(amount)

    return amountInt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }


  const rowClicked = () => {
    console.log("Clicked!")
  }

  return (
    <div>
      <div className="row ft-detail list-header d-flex justify-content-center center-parent">
        <div className="col-2">
          <span>Account ID</span>
        </div>
        <div className="col-2">
          <span>Loan Account</span>
        </div>
        <div className="col-2">
          <span>Original Loan</span>
        </div>
        <div className="col-2">
          <span>Loan Balance</span>
        </div>
        <div className="col-2">
          <span>Ammount Paid</span>
        </div>
        <div className="col-2 row d-flex justify-content-center">
          <div className="col-6">
            <span>Type</span>
          </div>
          <div className="col-6">
            <span>Actions</span>
          </div>
        </div>
      </div>
      {
        props.loans.map((acc, key) => {
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
                  <span></span>
                </div>
                <div className="col-2">
                  <span></span>
                </div>
                <div className="col-2">
                  <span></span>
                </div>
                <div className="col-2 row d-flex justify-content-center">
                  <div className="col-6">
                    <span>{acc.loanType.value}</span>
                  </div>
                  <div className="col-6">
                    <span>{acc.status.value}</span>
                  </div>
                </div>
              </div>
              <div className="row d-flex justify-content-center">
                <hr className="col-11 hr-margin-0" />
              </div>
            </div>
          )
        })
      }
    </div>
  )
}

const DragDrop = props => {
  const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
    useDropzone({
      multiple: false,
      onDrop: acceptedFiles => {
        props.setPhotos(acceptedFiles[0])
        acceptedFiles.map(file => Object.assign(file, {
          preview: URL.createObjectURL(file)
        }));
      }
    })

  const img = {
    width: "50%",
    height: "50%"
  }

  const files = acceptedFiles.map(file => {
    if (file.preview != null) {
      return (
        <div key={"File " + file.path} className="center-parent">
          <h5>
            {file.path} - {file.size} bytes
          </h5>
          <img src={file.preview} style={img} />
        </div>
      )
    } else {
      return (
        <div key={"File " + file.path} className="center-parent">
          <h4>File is being uploaded..</h4>
          <em className="fas fa-circle-notch fa-spin fa-2x text-muted" />
        </div>
      )
    }
  });

  return (
    <div className="container--md mt-3">
      <section>
        <div {...getRootProps({ className: 'dropzone' })}>
          <input name={props.name} {...getInputProps()} />
          <p className="text-center box-placeholder-upload m-0 ft-detail">
            {!isDragActive && "Drag 'n' drop some files here, or click to select files"}
            {isDragActive && "Drop Here!"}
          </p>
        </div>
        <aside>
          {files}
        </aside>
      </section>
    </div>
  );
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
    Modal.setAppElement('body')

    this.state = {
      activeTab: 'detail',
      clientId: null,
      clientIdNo: clientIdNo,
      clientAccount: {
        savingsAccounts: []
      },
      clientDetail: null,
      clientImage: null,
      clientSummary: null,
      modalCamera: false,
      modalUpload: false,
      selfieUri: null
    };
  }

  handleModalCamera() {
    this.setState({ modalCamera: !this.state.modalCamera })
  }

  handleModalUpload() {
    this.setState({ modalUpload: !this.state.modalUpload })
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

  swalOption = {
    title: 'Are you sure?',
    text: 'Do you want to delete this photo?',
    icon: 'warning',
    buttons: {
      cancel: {
        text: 'No, I\'d like to save it!',
        value: null,
        visible: true,
        className: "",
        closeModal: false
      },
      confirm: {
        text: 'Yes, delete it!',
        value: true,
        visible: true,
        className: "bg-danger",
        closeModal: false
      }
    }
  }

  deleteImage = () => {
    this.props.actions.deleteClientImage(this.state.clientIdNo)
    this.setState({ clientImage: null })
  }

  swalCallback = (isConfirm, swal, deleteImage) => {
    if (isConfirm) {
      swal("Deleted!", "Your image has been deleted.", "success")
      deleteImage()
    } else {
      swal("Cancelled", "Your image is safe :)", "error");
    }
  }

  render() {
    const img = {
      maxWidth: "100%",
      maxHeight: "200px"
    }

    const imgOpt = {
      width: "100%"
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

    const uploadSelfieCamRes = () => {
      this.setState({
        clientImage: this.state.selfieUri
      })

      this.handleModalCamera()
    }

    const uploadSelfieImageRes = () => {
      this.setState({
        clientImage: this.state.selfieUri
      })

      this.handleModalUpload()
    }

    const uploadSelfieCam = () => {
      this.props.actions.clientAddImage(this.state.selfieUri, { clientId: this.state.clientIdNo }, uploadSelfieCamRes)
    }

    const uploadSelfieImage = () => {
      const selfieImage = new FormData()

      selfieImage.append(
        "file",
        this.state.selfieUri
      )

      this.props.actions.clientAddImage(selfieImage, { clientId: this.state.clientIdNo }, uploadSelfieImageRes)
    }

    const setPhoto = photo => {
      this.setState({
        selfieUri: photo
      })
    }

    return (
      <ContentWrapper>
        <div className="content-heading">
          <div>Detail Member</div>
        </div>

        <Modal
          isOpen={this.state.modalCamera}
          onRequestClose={() => this.handleModalCamera()}
        >
          <div className="container-fluid">
            <div className="row">
              <Button outline className="col-4 col-lg-2" color="primary"
                onClick={() => this.handleModalCamera()}
              >
                Tutup Kamera
              </Button>
            </div>

            <div className="row justify-content-center mt-3">
              <Camera
                isMaxResolution="true"
                onTakePhoto={(dataUri) => { this.setState({ selfieUri: dataUri }); }}
              />
            </div>

            <div className="center-parent mt-3">
              {
                this.state.selfieUri != null
                  ? (
                    <div>
                      <div className="mb-3">
                        <h1>Preview Image</h1>
                      </div>
                      <div className="row justify-content-center">
                        <img className="col-md-6" src={this.state.selfieUri} />
                      </div>
                    </div>
                  )
                  : null
              }
            </div>

            <div className="row">
              <Button outline className="col-12 mt-3" color="primary"
                onClick={() => uploadSelfieCam()}
              >
                Upload Gambar
              </Button>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={this.state.modalUpload}
          onRequestClose={() => this.handleModalUpload()}
        >
          <div className="container-fluid">
            <div className="row">
              <Button outline className="col-4 col-lg-2" color="primary"
                onClick={() => this.handleModalUpload()}
              >
                Batalkan
              </Button>
            </div>

            <DragDrop setPhotos={setPhoto} />

            <div className="row">
              <Button outline className="col-12 mt-3" color="primary"
                onClick={() => uploadSelfieImage()}
              >
                Upload Gambar
              </Button>
            </div>
          </div>
        </Modal>

        <Card className="card-default">
          <CardBody>
            <Link to="/simpool/member/data">
              <Button outline className="col-4 col-lg-2" color="primary" >
                Kembali
              </Button>
            </Link>

            <div className="center-parent mt-5">
              <h1>
                {
                  clientDetail != null
                    ? clientDetail.fullname != null
                      ? clientDetail.fullname
                      : "'"
                    : "-"
                }
              </h1>
            </div>

            <div className="row mt-5 mb-2">
              <div className="mt-2 col-lg-2 mb-3 center-parent">
                <div className="center-parent" style={imgOpt}>
                  {
                    this.state.clientImage != null
                      ? (<img src={this.state.clientImage} style={img} />)
                      : (<img src={"/img/user.png"} style={img} />)
                  }
                </div>
                <div className="mt-1 d-flex justify-content-center" style={imgOpt}>
                  <button className="btn btn-sm btn-secondary mr-1" type="button" onClick={() => this.handleModalUpload()}>
                    <em className="fa fa-upload" />
                  </button>
                  <button className="btn btn-sm btn-secondary mr-1" type="button" onClick={() => this.handleModalCamera()}>
                    <em className="fa fa-camera" />
                  </button>
                  <Swal options={this.swalOption} callback={this.swalCallback} deleteRow={this.deleteImage}>
                    <button className="btn btn-sm btn-secondary" type="button">
                      <em className="fa fa-trash" />
                    </button>
                  </Swal>
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
                        ? Array.isArray(clientId.activationDate) && clientId.activationDate.length > 0
                          ? clientId.activationDate[2] + " " + MONTHS_ID[clientId.activationDate[1] - 1] + " " + clientId.activationDate[0]
                          : "-"
                        : "-"
                    }
                  </strong>
                </div>
                <div className="row mt-3">
                  <span className="col-md-4">Member of</span>
                  <strong className="col-md-8">
                    {
                      clientId != null
                        ? clientId.member != null
                          ? clientId.member == false
                            ? "Unassigned"
                            : clientId.member
                          : "-"
                        : "-"
                    }
                  </strong>
                </div>
                <div className="row mt-3">
                  <span className="col-md-4">Mobile Number</span>
                  <strong className="col-md-8">
                    {
                      clientId != null
                        ? clientId.mobileNo != null
                          ? clientId.mobileNo
                          : "-"
                        : "-"
                    }
                  </strong>
                </div>
                <div className="row mt-3">
                  <span className="col-md-4">Gender</span>
                  <strong className="col-md-8">
                    {
                      clientId != null
                        ? clientId.gender.description != null
                          ? clientId.gender.description
                          : "-"
                        : "-"
                    }
                  </strong>
                </div>
                <div className="row mt-3">
                  <span className="col-md-4">Date of Birth</span>
                  <strong className="col-md-8">
                    {
                      clientId != null
                        ? clientId.dateOfBirth != null
                          ? clientId.dateOfBirth[2] + " " + MONTHS_ID[clientId.dateOfBirth[1] - 1] + " " + clientId.dateOfBirth[0]
                          : "-"
                        : "-"
                    }
                  </strong>
                </div>
              </div>
              <div className="mt-2 col-lg-5 ft-detail mb-5">
                <div className="center-parent">
                  <h3>Performance History</h3>
                </div>
                <div className="row mt-3">
                  <span className="col-md-4">Loan Cycle</span>
                  <strong className="col-md-8">
                    {
                      clientSummary != null
                        ? clientSummary.loancycle != null
                          ? clientSummary.loancycle
                          : "-"
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
                        ? clientSummary.activeloans != null
                          ? clientSummary.activeloans
                          : "-"
                        : "-"
                    }
                  </strong>
                </div>
                <div className="row mt-3">
                  <span className="col-md-4">Total Savings</span>
                  <strong className="col-md-8">
                    {
                      clientSummary != null
                        ? clientSummary.totalsavings != null
                          ? this.NumberFormatted(clientSummary.totalsavings)
                          : "-"
                        : "-"
                    }
                  </strong>
                </div>
                <div className="row mt-3">
                  <span className="col-md-4">Active Savings</span>
                  <strong className="col-md-8">
                    {
                      clientSummary != null
                        ? clientSummary.activesavings != null
                          ? clientSummary.activesavings
                          : "-"
                        : "-"
                    }
                  </strong>
                </div>
                <div className="row mt-3">
                  <span className="col-md-4">Tax Status</span>
                  <strong className="col-md-8">
                    {
                      clientDetail != null
                        ? clientDetail.isTaxActive != null
                          ? clientDetail.isTaxActive === true
                            ? "Active"
                            : "Inactive"
                          : "Inactive"
                        : "-"
                    }
                  </strong>
                </div>
                <div className="row mt-3">
                  <span className="col-md-4">Last Tax Active</span>
                  <strong className="col-md-8">
                    {
                      clientDetail != null
                        ? Array.isArray(clientDetail.lastTaxActive) && clientDetail.lastTaxActive.length > 0
                          ? clientDetail.lastTaxActive[2] + " " + MONTHS_ID[clientDetail.lastTaxActive[1] - 1] + " " + clientDetail.lastTaxActive[0]
                          : "-"
                        : "-"
                    }
                  </strong>
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
                              ? clientId.officeName != null
                                ? clientId.officeName
                                : "-"
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Staff</span>
                        <strong className="col-md-8">
                          {
                            clientId != null
                              ? clientId.staffName != null
                                ? clientId.staffName
                                : "-"
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Client Type</span>
                        <strong className="col-md-8">
                          {
                            clientId != null
                              ? clientId.legalForm.value != null
                                ? clientId.legalForm.value
                                : "-"
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Sector</span>
                        <strong className="col-md-8">
                          {
                            clientId != null
                              ? clientId.sector.name != null
                                ? clientId.sector.name
                                : "-"
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">CIF Number</span>
                        <strong className="col-md-8">
                          {
                            clientId != null
                              ? clientId.accountNo != null
                                ? clientId.accountNo
                                : "-"
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">External ID</span>
                        <strong className="col-md-8">
                          {
                            clientId != null
                              ? clientId.externalId != null
                                ? clientId.externalId
                                : "-"
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Working ID Number</span>
                        <strong className="col-md-8">
                          {
                            clientId != null
                              ? clientId.nip != null
                                ? clientId.nip
                                : "-"
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Prefix Title Name</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.prefixDescription.description != null
                                ? clientDetail.prefixDescription.code + " - " + clientDetail.prefixDescription.description
                                : "-"
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Identity Name</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.fullname != null
                                ? clientDetail.fullname
                                : "-"
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Full Name</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.fullnameNonIdentity != null
                                ? clientDetail.fullnameNonIdentity
                                : "-"
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Alias</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.nickname != null
                                ? clientDetail.nickname
                                : "-"
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Suffix Title Name</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.suffixDescription.description != null
                                ? clientDetail.suffixDescription.code + " - " + clientDetail.suffixDescription.description
                                : "-"
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Type of Identity</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.typeOfIdentity.description != null
                                ? clientDetail.typeOfIdentity.description
                                : "-"
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Identity Number</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.identityNumber != null
                                ? clientDetail.identityNumber
                                : "-"
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Identity Valid Date</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.identityValidDate != null
                                ? clientDetail.identityValidDate[2] + " " + MONTHS_ID[clientDetail.identityValidDate[1] - 1] + " " + clientDetail.identityValidDate[0]
                                : "-"
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Address Based on Identity</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.addressBasedOnIdentity != null
                                ? clientDetail.addressBasedOnIdentity
                                : "-"
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Country</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.identityCountry.description != null
                                ? clientDetail.identityCountry.description
                                : "-"
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Province</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.identityProvince.description != null
                                ? clientDetail.identityProvince.description
                                : "-"
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">District / City</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.identityCity.description != null
                                ? clientDetail.identityCity.description
                                : "-"
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Sub District</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.identitySubDistrict != null
                                ? clientDetail.identitySubDistrict
                                : "-"
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Village</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.identityVillage != null
                                ? clientDetail.identityVillage
                                : "-"
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
                              ? clientDetail.identityPostalCode != null
                                ? clientDetail.identityPostalCode
                                : "-"
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">RT</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.identityRt != null
                                ? clientDetail.identityRt
                                : "-"
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">RW</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.identityRw != null
                                ? clientDetail.identityRw
                                : "-"
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
                              ? clientDetail.gender.description != null
                                ? clientDetail.gender.description
                                : "-"
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Date of Birth</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.dateOfBirth != null
                                ? clientDetail.dateOfBirth[2] + " " + MONTHS_ID[clientDetail.dateOfBirth[1] - 1] + " " + clientDetail.dateOfBirth[0]
                                : "-"
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Mother's Maiden Name</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.motherName != null
                                ? clientDetail.motherName
                                : "-"
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Place of Birth</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.placeOfBirth != null
                                ? clientDetail.placeOfBirth
                                : "-"
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Mobile Number</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.mobileNo != null
                                ? clientDetail.mobileNo
                                : "-"
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Phone Number</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.phoneNumber != null
                                ? clientDetail.phoneNumber
                                : "-"
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Fax Number</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.faxNumber != null
                                ? clientDetail.faxNumber
                                : "-"
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Religion</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.religion.description != null
                                ? clientDetail.religion.description
                                : "-"
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Email</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.email != null
                                ? clientDetail.email
                                : "-"
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Marital Status</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.maritalStatusCode.description != null
                                ? clientDetail.maritalStatusCode.description
                                : "-"
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Type of Identity</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.biInformation.typeOfIdentity != null
                                ? clientDetail.typeOfIdentityBiOptions[clientDetail.biInformation.typeOfIdentity - 1].description
                                : "-"
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Spouse Identity Number</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.biInformation.spouseIdentityNumber != null
                                ? clientDetail.biInformation.spouseIdentityNumber
                                : "-"
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Spouse Name</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.biInformation.spouseName != null
                                ? clientDetail.biInformation.spouseName
                                : "-"
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Pre-post Nuptial Agreement</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.biInformation.prePostNuptialAggreement != null
                                ? clientDetail.biInformation.prePostNuptialAggreement
                                : "-"
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Date of Birth of Spouse</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.biInformation.dateOfBirthSpouse != null
                                ? dateOfBirthSpouse(clientDetail.biInformation.dateOfBirthSpouse)
                                : "-"
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Last Education Level</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.lastEducationLevelCode.description != null
                                ? clientDetail.lastEducationLevelCode.description
                                : "-"
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Last Education Level Other</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.lastEducationLevelDescription != null
                                ? clientDetail.lastEducationLevelDescription
                                : "-"
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Is Citizen ?</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.isCitizen != null
                                ? clientDetail.isCitizen
                                  ? "true"
                                  : "false"
                                : "-"
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
                              ? clientDetail.address != null
                                ? clientDetail.address
                                : "-"
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Country</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.country.description != null
                                ? clientDetail.country.description
                                : "-"
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Province</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.province.description != null
                                ? clientDetail.province.description
                                : "-"
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">District / City</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.city.description != null
                                ? clientDetail.city.description
                                : "-"
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Sub District</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.subDistrict != null
                                ? clientDetail.subDistrict
                                : "-"
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
                              ? clientDetail.village != null
                                ? clientDetail.village
                                : "-"
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Postal Code</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.postalCode != null
                                ? clientDetail.postalCode
                                : "-"
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">RT</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.rt != null
                                ? clientDetail.rt
                                : "-"
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">RW</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.rw != null
                                ? clientDetail.rw
                                : "-"
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Home Ownership Status</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.homeOwnershipStatus != null
                                ? clientDetail.homeOwnershipStatus.id === 100
                                  ? clientDetail.homeOwnershipStatus.description
                                  : clientDetail.homeOwnershipStatus.id === 99
                                    ? clientDetail.otherHomeOwnershipStatus
                                    : "-"
                                : "-"
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
                              ? clientDetail.taxNumber != null
                                ? clientDetail.taxNumber
                                : "-"
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Name Based on Tax</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.taxName != null
                                ? clientDetail.taxName
                                : "-"
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Address Based on Tax</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.taxAddress != null
                                ? clientDetail.taxAddress
                                : "-"
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
                              ? clientDetail.isTaxActive != null
                                ? clientDetail.isTaxActive
                                  ? "Yes"
                                  : "No"
                                : "-"
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Merchant Account Information Code</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.merchantInformationCode != null
                                ? merchantInformationCode(clientDetail.merchantInformationCode)
                                : "-"
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Merchant Category</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? clientDetail.merchantCategoryCode != null
                                ? merchantCategoryCode(clientDetail.merchantCategoryCode)
                                : "-"
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
                              ? clientDetail.mobileUser != null
                                ? clientDetail.mobileUser
                                : "-"
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Activation CIF Date</span>
                        <strong className="col-md-8">
                          {
                            clientDetail != null
                              ? Array.isArray(clientDetail.timeline.activatedOnDate) && clientDetail.timeline.activatedOnDate.length > 0
                                ? clientDetail.timeline.activatedOnDate[2] + " " + MONTHS_ID[clientDetail.timeline.activatedOnDate[1] - 1] + " " + clientDetail.timeline.activatedOnDate[0]
                                : "-"
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
                              ? Array.isArray(clientDetail.timeline.submittedOnDate) && clientDetail.timeline.submittedOnDate.length > 0
                                ? clientDetail.timeline.submittedOnDate[2] + " " + MONTHS_ID[clientDetail.timeline.submittedOnDate[1] - 1] + " " + clientDetail.timeline.submittedOnDate[0]
                                : "-"
                              : "-"
                          }
                        </strong>
                      </div>
                      <div className="row mt-3">
                        <span className="col-md-4">Resignation Date</span>
                        <strong className="col-md-8">
                          {
                            "-"
                            // clientId != null
                            //   ? clientId.officeName != null
                            //     ? clientId.officeName
                            //     : "-"
                            //   : 
                            // "-"
                          }
                        </strong>
                      </div>
                    </div>
                  </div>

                  <Link to={"/simpool/member/data-edit/" + this.state.clientIdNo}>
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
                  {
                    Array.isArray(this.state.clientAccount.loanAccounts) && this.state.clientAccount.loanAccounts.length > 0
                      ? (<Loans loans={this.state.clientAccount.loanAccounts} />)
                      : (
                        <div className="center-parent mt-3 ft-detail">
                          <span>Pengguna tidak punya pinjaman</span>
                        </div>
                      )
                  }
                  <Link to="/simpool/member/loan-data-add">
                    <Button outline className="col-12 mt-4 mb-2" color="primary" type="button">
                      Tambah Pinjaman
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

export default compose(connect(mapStateToProps, mapDispatchToProps), withTranslation('translations'))(withRouter(MemberDataDetail))