import React, { Component, useState, useEffect } from 'react'
import { Link, withRouter } from 'react-router-dom'
import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane
} from 'reactstrap'
import 'react-sliding-pane/dist/react-sliding-pane.css'
import { withTranslation } from 'react-i18next'
import Modal from 'react-modal'
import { useDropzone } from 'react-dropzone'

import Camera from 'react-html5-camera-photo'
import 'react-html5-camera-photo/build/css/index.css'

import ContentWrapper from '../../../components/Layout/ContentWrapper'
import Swal from '../../../components/Common/Swal'

import PropTypes from 'prop-types'
import * as actions from '../../../store/actions/actions'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

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

  const rowClicked = id => {
    props.history.push({
      pathname: '/simpool/member/saving-data-detail/' + id,
      search: "?tenantIdentifier=" + props.tenant
    })
  }

  const [activeSavings, setActiveSavings] = useState([])
  const [inActiveSavings, setInActiveSavings] = useState([])
  const [shownSavings, setShownSavings] = useState(true)

  const [activeDeposito, setActiveDeposito] = useState([])
  const [inActiveDeposito, setInActiveDeposito] = useState([])
  const [shownDeposito, setShownDeposito] = useState(true)

  useEffect(() => {
    props.savings.map(acc => {
      if (acc.depositType.id === 100) {
        if (acc.status.id === 600) {
          setInActiveSavings(prevArray => [...prevArray, acc])
        } else {
          setActiveSavings(prevArray => [...prevArray, acc])
        }
      }
      
      if (acc.depositType.id === 200) {
        if (acc.status.id === 600) {
          setInActiveDeposito(prevArray => [...prevArray, acc])
        } else {
          setActiveDeposito(prevArray => [...prevArray, acc])
        }
      }

      return null
    })

    return () => { };
  }, [props.savings])

  return (
    <div>
      <div className="row justify-content-between">
        <div className="col-7 col-md-8 row align-items-center ml-3">
          <h2>Savings</h2>
        </div>
        <Button outline className="mt-2 mr-3 mb-3 col-4 col-md-3" color="primary" onClick={() => setShownSavings(!shownSavings)}>
          {
            shownSavings
              ? "View Closed Savings"
              : "View Active Savings"
          }
        </Button >
      </div>

      {
        shownSavings
          ? (
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
                activeSavings.map((acc, key) => {
                  return (
                    <div key={"Savings " + key}>
                      <div className="row ft-detail list-detail d-flex justify-content-center list-hover center-parent" onClick={() => rowClicked(acc.id)}>
                        <div className="col-2">
                          {
                            acc.status.id != null
                              ? acc.status.id === 300
                                ? (<span className="ml-auto circle bg-success circle-lg" />)
                                : acc.status.id === 200
                                  ? (<span className="ml-auto circle bg-primary circle-lg" />)
                                  : acc.status.id === 100
                                    ? (<span className="ml-auto circle bg-warning circle-lg" />)
                                    : null
                              : null
                          }
                          <span>{acc.accountNo}</span>
                        </div>
                        <div className="col-2">
                          <span>{acc.productName}</span>
                        </div>
                        <div className="col-2">
                          <span>{acc.bilyetNumber}</span>
                        </div>
                        <div className="col-2">
                          <span>{
                            Array.isArray(acc.lastActiveTransactionDate) && acc.lastActiveTransactionDate.length > 0
                              ? acc.lastActiveTransactionDate[2] + " " + MONTHS_ID[acc.lastActiveTransactionDate[1] - 1] + " " + acc.lastActiveTransactionDate[0]
                              : null
                          }</span>
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
          : (
            <div>
              <div className="row ft-detail list-header d-flex justify-content-center center-parent">
                <div className="col-4">
                  <span>Account Number</span>
                </div>
                <div className="col-4">
                  <span>Saving Product</span>
                </div>
                <div className="col-4">
                  <span>Last Active</span>
                </div>
              </div>

              {
                inActiveSavings.map((acc, key) => {
                  return (
                    <div key={"Savings " + key}>
                      <div className="row ft-detail list-detail d-flex justify-content-center list-hover center-parent" onClick={() => rowClicked(acc.id)}>
                        <div className="col-4">
                          {
                            (<span className="ml-auto circle circle-lg" style={{ backgroundColor: "gray" }} />)
                          }
                          <span>{acc.accountNo}</span>
                        </div>
                        <div className="col-4">
                          <span>{acc.productName}</span>
                        </div>
                        <div className="col-4">
                          <span>{
                            Array.isArray(acc.lastActiveTransactionDate) && acc.lastActiveTransactionDate.length > 0
                              ? acc.lastActiveTransactionDate[2] + " " + MONTHS_ID[acc.lastActiveTransactionDate[1] - 1] + " " + acc.lastActiveTransactionDate[0]
                              : null
                          }</span>
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

      <div className="row justify-content-between mt-5">
        <div className="col-7 col-md-8 row align-items-center ml-3">
          <h2>Deposito</h2>
        </div>
        <Button outline className="mt-2 mr-3 mb-3 col-4 col-md-3" color="primary" onClick={() => setShownDeposito(!shownDeposito)}>
          {
            shownDeposito
              ? "View Closed Deposito"
              : "View Active Deposito"
          }
        </Button >
      </div>

      {
        shownDeposito
          ? (
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
                activeDeposito.map((acc, key) => {
                  return (
                    <div key={"Deposito " + key}>
                      <div className="row ft-detail list-detail d-flex justify-content-center list-hover center-parent" onClick={() => rowClicked(acc.id)}>
                        <div className="col-2">
                          {
                            acc.status.id != null
                              ? acc.status.id === 300
                                ? (<span className="ml-auto circle bg-success circle-lg" />)
                                : acc.status.id === 200
                                  ? (<span className="ml-auto circle bg-primary circle-lg" />)
                                  : acc.status.id === 100
                                    ? (<span className="ml-auto circle bg-warning circle-lg" />)
                                    : null
                              : null
                          }
                          <span>{acc.accountNo}</span>
                        </div>
                        <div className="col-2">
                          <span>{acc.productName}</span>
                        </div>
                        <div className="col-2">
                          <span>{acc.bilyetNumber}</span>
                        </div>
                        <div className="col-2">
                          <span>{
                            Array.isArray(acc.lastActiveTransactionDate) && acc.lastActiveTransactionDate.length > 0
                              ? acc.lastActiveTransactionDate[2] + " " + MONTHS_ID[acc.lastActiveTransactionDate[1] - 1] + " " + acc.lastActiveTransactionDate[0]
                              : null
                          }</span>
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
          : (
            <div>
              <div className="row ft-detail list-header d-flex justify-content-center center-parent">
                <div className="col-4">
                  <span>Account Number</span>
                </div>
                <div className="col-4">
                  <span>Saving Product</span>
                </div>
                <div className="col-4">
                  <span>Last Active</span>
                </div>
              </div>

              {
                inActiveDeposito.map((acc, key) => {
                  return (
                    <div key={"Deposito " + key}>
                      <div className="row ft-detail list-detail d-flex justify-content-center list-hover center-parent" onClick={() => rowClicked(acc.id)}>
                        <div className="col-4">
                          {
                            (<span className="ml-auto circle circle-lg" style={{ backgroundColor: "gray" }} />)
                          }
                          <span>{acc.accountNo}</span>
                        </div>
                        <div className="col-4">
                          <span>{acc.productName}</span>
                        </div>
                        <div className="col-4">
                          <span>{
                            Array.isArray(acc.lastActiveTransactionDate) && acc.lastActiveTransactionDate.length > 0
                              ? acc.lastActiveTransactionDate[2] + " " + MONTHS_ID[acc.lastActiveTransactionDate[1] - 1] + " " + acc.lastActiveTransactionDate[0]
                              : null
                          }</span>
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
    </div>
  )
}

const Loans = props => {
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
            <div key={"Loans " + key}>
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

const Documents = props => {
  const [modalPreview, setModalPreview] = useState(false)
  const [docImage, setDocImage] = useState(null)
  const [isImage, setIsImage] = useState(null)

  const setClientDocRes = res => {
    setDocImage(res)
  }

  const setClientDocDlRes = (res, fileName) => {
    const link = document.createElement('a');
    link.href = res;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
  }

  const handleModalPreview = doc => {
    setModalPreview(true)

    if (doc.type === "image/jpeg" || doc.type === "image/png") {
      setIsImage(true)

      props.actions.getDocAttach(
        {
          clientId: doc.parentEntityId,
          documentId: doc.id
        },
        setClientDocRes
      )
    } else {
      setIsImage(false)
    }
  }

  const handleDownload = doc => {
    props.actions.getDocAttach(
      {
        clientId: doc.parentEntityId,
        documentId: doc.id,
        fileName: doc.fileName
      },
      setClientDocDlRes
    )
  }

  const swalOption = {
    title: 'Are you sure?',
    text: 'Do you want to delete this document?',
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

  const swalCallback = (isConfirm, swal, deleteDocument, id) => {
    if (isConfirm) {
      swal("Deleted!", "Your document has been deleted.", "success")
      deleteDocument(id)
    } else {
      swal("Cancelled", "Your document is safe :)", "error");
    }
  }

  return (
    <div>
      <Modal
        isOpen={modalPreview}
        onRequestClose={() => setModalPreview(false)}
        ariaHideApp={false}
      >
        <div className="container-fluid">
          <div className="row">
            <Button outline className="col-4 col-lg-2" color="primary"
              onClick={() => setModalPreview(false)}
            >
              Kembali
            </Button>
          </div>

          <div className="mb-3 center-parent">
            <h1>Preview Image</h1>
          </div>

          <div className="center-parent mt-3">
            {
              isImage != null
                ? isImage
                  ? docImage != null
                    ? (
                      <div>
                        <div className="row justify-content-center">
                          <img className="col-md-6" src={docImage} alt="Doc" />
                        </div>
                      </div>
                    )
                    : null
                  : (<div>Dokumen bukanlah gambar PNG atau JPEG</div>)
                : null
            }
          </div>
        </div>
      </Modal>

      <div className="row ft-detail list-header d-flex justify-content-center center-parent">
        <div className="col-3">
          <span>Name</span>
        </div>
        <div className="col-3">
          <span>Description</span>
        </div>
        <div className="col-3">
          <span>File Name</span>
        </div>
        <div className="col-3">
          <span>Actions</span>
        </div>
      </div>
      {
        Array.isArray(props.documents) && props.documents.length > 0
          ? props.documents.map((doc, key) => {
            return (
              <div key={"Documents " + key}>
                <div className="row ft-detail list-docs d-flex justify-content-center">
                  <div className="col-3">
                    <span>{doc.name}</span>
                  </div>
                  <div className="col-3">
                    <span>{doc.description}</span>
                  </div>
                  <div className="col-3">
                    <span>{doc.fileName}</span>
                  </div>
                  <div className="col-3 row d-flex justify-content-center center-parent">
                    <div>
                      <button className="btn btn-sm btn-secondary mr-1" type="button" onClick={() => handleModalPreview(doc)}>
                        <em className="fa fa-eye" />
                      </button>
                    </div>
                    <div>
                      <button className="btn btn-sm btn-secondary mr-1" type="button" onClick={() => handleDownload(doc)}
                        download={
                          docImage != null
                            ? docImage
                            : null
                        }
                      >
                        <em className="fa fa-download" />
                      </button>
                    </div>
                    <Swal options={swalOption} callback={swalCallback} deleterow={props.deleteClientDoc} id={doc.id}>
                      <button className="btn btn-sm btn-secondary" type="button">
                        <em className="fa fa-times" />
                      </button>
                    </Swal>
                  </div>
                </div>
                <div className="row d-flex justify-content-center">
                  <hr className="col-11 hr-margin-0" />
                </div>
              </div>
            )
          })
          : null
      }
    </div>
  )
}

const DragDrop = props => {
  const MAX_SIZE = 1048576
  const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
    useDropzone({
      multiple: false,
      maxSize: MAX_SIZE,
      onDrop: acceptedFiles => {
        props.setPhotos(acceptedFiles[0])
        acceptedFiles.map(file => Object.assign(file, {
          preview: URL.createObjectURL(file)
        }));
      },
      onDropRejected: rejectedFiles => {
        if (rejectedFiles[0].size > MAX_SIZE) {
          document.getElementById("dragReject").click()          
        }
      }
    })

  const img = {
    width: "50%",
    height: "50%"
  }

  const dragReject = {
    title: "File size's must be under 1 MB"
  }

  const files = acceptedFiles.map(file => {
    if (file.preview != null) {
      return (
        <div key={"File " + file.path} className="center-parent">
          <h5>
            {file.path} - {file.size} bytes
          </h5>
          <img src={file.preview} style={img} alt="File Preview" />
        </div>
      )
    } else {
      return (
        <div key={"File " + file.path} className="center-parent">
          <h4>File's preview is being uploaded..</h4>
          <em className="fas fa-circle-notch fa-spin fa-2x text-muted" />
        </div>
      )
    }
  });

  return (
    <div className="container--md mt-3">
      <Swal options={dragReject} id="dragReject" />
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
    const setClientDocuments = res => {
      this.setState({
        clientDocuments: res
      })
    }
    const setClientId = res => {
      this.setState({
        clientId: res
      })
    }
    const setClientImage = res => {
      this.setState({
        clientImage: res
      })
    }
    const setClientSummary = res => {
      this.setState({
        clientSummary: res[0]
      })
    }

    this.props.actions.getClientAccount(clientIdNo, setClientAccount)
    this.props.actions.getClientDetail(clientIdNo, setClientDetail)
    this.props.actions.getClientDocuments(clientIdNo, setClientDocuments)
    this.props.actions.getClientId(clientIdNo, setClientId)
    this.props.actions.getClientImage(clientIdNo, setClientImage)
    this.props.actions.getClientSummary(clientIdNo, setClientSummary)
    Modal.setAppElement('body')

    this.state = {
      activeTab: 'detail',
      clientAccount: {
        savingsAccounts: []
      },
      clientId: null,
      clientIdNo: clientIdNo,
      clientDetail: null,
      clientDocuments: null,
      clientImage: null,
      clientSummary: null,
      documentsActive: false,
      docName: null,
      docDesc: null,
      docUpload: null,
      modalCamera: false,
      modalUpload: false,
      modalUploadDoc: false,
      selfieUri: null
    };
  }

  handleModalCamera = () => {
    this.setState({ modalCamera: !this.state.modalCamera })
  }

  handleModalUpload = () => {
    this.setState({ modalUpload: !this.state.modalUpload })
  }

  handleModalUploadDoc = () => {
    this.setState({ modalUploadDoc: !this.state.modalUploadDoc })
  }

  toggleTab = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  numToMoney = amount => {
    const amountInt = parseInt(amount)
    const amountNum = amount.toFixed(2)
    const amountStr = amountNum.toString()
    let afterComma

    if (amountStr.includes('.')) {
      afterComma = amountStr.slice(amountStr.length - 2, amountStr.length)
    }

    if (afterComma != null) {
      if (afterComma === "00") {
        return amountInt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      } else {
        return amountInt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "," + afterComma
      }
    } else {
      return amountInt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    }
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

  changeState = (name, val) => {
    this.setState({
      [name]: val
    })
  }

  deleteClientDocRes = () => {
    const setClientDocuments = res => {
      this.setState({
        clientDocuments: res
      })
    }

    this.props.actions.getClientDocuments(this.state.clientIdNo, setClientDocuments)
  }

  deleteClientDoc = docId => {
    this.props.actions.deleteClientDoc(
      {
        clientId: this.state.clientIdNo,
        documentId: docId
      },
      this.deleteClientDocRes
    )
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

        return null
      })

      return day + " " + monthMMMM + " " + year
    }

    const merchantInformationCode = code => {
      let desc

      clientDetail.merchantInformationCodeOption.map(merchant => {
        if (merchant.code === code) {
          desc = merchant.description
        }

        return null
      })

      return code + " - " + desc
    }

    const merchantCategoryCode = code => {
      let desc

      clientDetail.merchantCategoryOption.map(merchant => {
        if (merchant.code === code) {
          desc = merchant.description
        }

        return null
      })

      return code + " - " + desc
    }

    const uploadSelfieCamRes = () => {
      this.setState({
        clientImage: null
      })

      const setClientImage = res => {
        this.setState({
          clientImage: res
        })
      }

      this.props.actions.getClientImage(this.state.clientIdNo, setClientImage)

      this.handleModalCamera()
    }

    const uploadSelfieImageRes = () => {
      this.setState({
        clientImage: null
      })

      const setClientImage = res => {
        this.setState({
          clientImage: res
        })
      }

      this.props.actions.getClientImage(this.state.clientIdNo, setClientImage)

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

    const uploadDocRes = () => {
      this.handleModalUploadDoc()

      const setClientDocuments = res => {
        this.setState({
          clientDocuments: res
        })
      }

      this.props.actions.getClientDocuments(this.state.clientIdNo, setClientDocuments)
    }

    const uploadDoc = () => {
      if (this.state.docUpload != null && this.state.docName != null) {
        const docUpload = new FormData()

        docUpload.append(
          "name",
          this.state.docName
        )

        if (this.state.docDesc != null) {
          docUpload.append(
            "description",
            this.state.docDesc
          )
        }

        docUpload.append(
          "file",
          this.state.docUpload
        )

        this.props.actions.clientAddDocument(docUpload, { clientId: this.state.clientIdNo }, uploadDocRes)
      }
    }

    const setSelfieUri = photo => {
      this.setState({
        selfieUri: photo
      })
    }

    const setDocUpload = photo => {
      this.setState({
        docUpload: photo
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
                        <img className="col-md-6" src={this.state.selfieUri} alt="selfieUri" />
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

            <DragDrop setPhotos={setSelfieUri} />

            <div className="row">
              <Button outline className="col-12 mt-3" color="primary"
                onClick={() => uploadSelfieImage()}
              >
                Upload Gambar
              </Button>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={this.state.modalUploadDoc}
          onRequestClose={() => this.handleModalUploadDoc()}
        >
          <div className="container-fluid">
            <div className="row">
              <Button outline className="col-4 col-lg-2" color="primary"
                onClick={() => this.handleModalUploadDoc()}
              >
                Batalkan
              </Button>
            </div>

            <div className="row d-flex justify-content-center">
              <div className="col-md-6 center-parent form-font-size">
                <FormGroup>
                  <label htmlFor="docName">Name *</label>
                  <input className="form-control mr-3" type="text" placeholder="Enter document's name"
                    value={this.state.externalId} onChange={e => this.changeState("docName", e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <label htmlFor="docDesc">Description</label>
                  <textarea rows="4" className="form-control mr-3" type="text" placeholder="Enter descriptions"
                    value={this.state.externalId} onChange={e => this.changeState("docDesc", e.target.value)}
                  />
                </FormGroup>
              </div>
            </div>

            <div className="row d-flex justify-content-center">
              <h1>Upload File *</h1>
            </div>

            <DragDrop setPhotos={setDocUpload} />

            <div className="row">
              <Button outline className="col-12 mt-3" color="primary"
                onClick={() => uploadDoc()}
              >
                Upload Dokumen
              </Button>
            </div>
          </div>
        </Modal>

        <Card className="card-default">
          <CardBody>
            <Link
              to={{
                pathname: "/simpool/member/data",
                search: "?tenantIdentifier=" + this.props.settings.tenantIdentifier
              }}
            >
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
                      ? (<img src={this.state.clientImage} style={img} alt="client" />)
                      : (<img src={"/img/user.png"} style={img} alt="user" />)
                  }
                </div>
                <div className="mt-1 d-flex justify-content-center" style={imgOpt}>
                  <button className="btn btn-sm btn-secondary mr-1" type="button" onClick={() => this.handleModalUpload()}>
                    <em className="fa fa-upload" />
                  </button>
                  <button className="btn btn-sm btn-secondary mr-1" type="button" onClick={() => this.handleModalCamera()}>
                    <em className="fa fa-camera" />
                  </button>
                  <Swal options={this.swalOption} callback={this.swalCallback} deleterow={this.deleteImage}>
                    <button className="btn btn-sm btn-secondary" type="button">
                      <em className="fa fa-trash" />
                    </button>
                  </Swal>
                </div>
                <button className="btn btn-secondary mt-2 col-12" onClick={() => this.setState({ documentsActive: !this.state.documentsActive })}>
                  Documents
                </button>
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
                          ? clientId.member === false
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
                        ? clientSummary.lastloanamount != null
                          ? this.numToMoney(clientSummary.lastloanamount)
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
                          ? this.numToMoney(clientSummary.totalsavings)
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

            {
              this.state.documentsActive
                ? (
                  <div>
                    <Button outline className="col-12 mb-4" color="primary" type="button" onClick={() => this.handleModalUploadDoc()}>
                      Upload Dokumen
                    </Button>
                    <Documents documents={this.state.clientDocuments} actions={this.props.actions} deleteClientDoc={this.deleteClientDoc} />
                  </div>
                )
                : null
            }

            <div role="tabpanel row" className="mt-5">
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
                        <span className="col-md-4">Fullname</span>
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
                          }
                        </strong>
                      </div>
                    </div>
                  </div>

                  <Link
                    to={{
                      pathname: "/simpool/member/data-edit/" + this.state.clientIdNo,
                      search: "?tenantIdentifier=" + this.props.settings.tenantIdentifier
                    }}
                  >
                    <Button outline className="mt-4 mb-2 col-12" color="warning" tabIndex={7}>Edit Member</Button>
                  </Link>
                </TabPane>

                <TabPane tabId="savings" role="tabpanel">
                  {
                    Array.isArray(this.state.clientAccount.savingsAccounts) && this.state.clientAccount.savingsAccounts.length > 0
                      ? (
                        <Savings
                          history={this.props.history}
                          savings={this.state.clientAccount.savingsAccounts}
                          tenant={this.props.settings.tenantIdentifier}
                          clientId={this.state.clientIdNo}
                        />
                      )
                      : (
                        <div className="center-parent mt-3 ft-detail">
                          <span>Pengguna tidak punya simpanan</span>
                        </div>
                      )
                  }
                  <Link
                    to={{
                      pathname: "/simpool/member/saving-data-add",
                      search: "?tenantIdentifier=" + this.props.settings.tenantIdentifier
                    }}
                  >
                    <Button className="col-12 mt-4 mb-2" color="primary" type="button">
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
                  <Link
                    to={{
                      pathname: "/simpool/member/loan-data-add",
                      search: "?tenantIdentifier=" + this.props.settings.tenantIdentifier
                    }}
                  >
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
  search: PropTypes.object,
  settings: PropTypes.object
}

const mapStateToProps = state => ({
  memberData: state.memberData,
  search: state.search,
  settings: state.settings
})
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) })

export default compose(connect(mapStateToProps, mapDispatchToProps), withTranslation('translations'))(withRouter(MemberDataDetail))