import React, { Component } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  CustomInput,
  Input,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink
} from 'reactstrap';
import classnames from 'classnames';
import { useDropzone } from 'react-dropzone';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { withTranslation, Trans } from 'react-i18next';
import { Field, Formik } from 'formik';
import { Select } from 'antd';
import 'antd/dist/antd.css';

import * as actions from '../../../store/actions/actions';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';

import ContentWrapper from '../../../components/Layout/ContentWrapper';
import Swal from '../../../components/Common/Swal';

import MONTHS_ID from '../../../constants/MONTHS_ID'

// DateTimePicker
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import moment from 'moment'
import 'moment/locale/id'

const { Option } = Select;

const stepNavitemStyle = {
  backgroundColor: '#fcfcfc'
}


const onFieldChange = (val, field, form) => {
  const dd = String(val.toDate().getDate()).padStart(2, '0')
  const mm = MONTHS_ID[val.toDate().getMonth()]
  const yyyy = val.toDate().getFullYear()

  val = dd + " " + mm + " " + yyyy

  form.setFieldValue(field.name, val);
}

const DateTime = ({ field, form, locale, value, error, touched, dateParam }) => {
  let valid

  const dd = String(new Date().getDate()).padStart(2, '0')
  const mmmm = MONTHS_ID[new Date().getMonth()]
  const yyyy = new Date().getFullYear()

  const today = dd + ' ' + mmmm + ' ' + yyyy

  if (field.name === "identityValidDate") {
    const yesterday = Datetime.moment().subtract(1, 'd')
    valid = current => {
      return current.isAfter(yesterday)
    }
  } else if (field.name === "submittedOnDate" || field.name === "dateOfBirth") {
    const valueDate = moment(dateParam).add(1, 'd')
    valid = current => {
      return current.isBefore(valueDate)
    }
  } else {
    valid = current => {
      return current
    }
  }

  if (field.name === "dateOfBirth" && value === "") {
    value = today.slice(0, today.length - 4) + (parseInt(today.slice(today.length - 4, today.length)) - 17).toString()
  }

  return (
    <Datetime
      inputProps={{
        name: field.name,
        className:
          touched && error
            ? "form-control input-font-size dt-bg input-error"
            : "form-control input-font-size dt-bg"
        ,
        id: field.name,
        placeholder: "dd mmmm yyyy",
        autoComplete: "off",
        readOnly: true
      }}
      value={value}
      dateFormat="DD MMMM YYYY"
      timeFormat={false}
      closeOnSelect={true}
      locale={locale}
      isValidDate={valid}
      onChange={val => onFieldChange(val, field, form)}
    />
  )
}

const ValidDate = ({ field, form, locale, value, error, touched, name }) => {
  let yesterday = Datetime.moment().subtract(1, 'day')
  let valid = current => {
    return current.isAfter(yesterday)
  }

  return (
    <Datetime
      inputProps={{
        name: name,
        className:
          touched && error
            ? "form-control input-font-size dt-bg input-error"
            : "form-control input-font-size dt-bg",
        id: name,
        placeholder: "dd mmmm yyyy",
        autoComplete: "off",
        readOnly: true,
        value: value
      }}
      dateFormat="DD MMMM YYYY"
      timeFormat={false}
      closeOnSelect={true}
      locale={locale}
      isValidDate={valid}
      onChange={val => onFieldChange(val, field, form)}
    />
  );
}

const DragDrop = props => {
  const MAX_SIZE = 1048576
  const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
    useDropzone({
      multiple: false,
      maxSize: MAX_SIZE,
      onDrop: acceptedFiles => {
        props.setPhotos(props.name, acceptedFiles[0])
        acceptedFiles.map(file =>
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
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
          <h4>File is being uploaded..</h4>
          <em className="fas fa-circle-notch fa-spin fa-2x text-muted" />
        </div>
      )
    }
  });

  return (
    <Container className="container-md mt-3">
      <Swal options={dragReject} id="dragReject" />
      <section>
        <div {...getRootProps({ className: 'dropzone' })}>
          <input name={props.name} {...getInputProps()} />
          <p className="text-center box-placeholder m-0">
            {!isDragActive && "Drag 'n' drop some files here, or click to select files"}
            {isDragActive && "Drop Here!"}
          </p>
        </div>
        <aside>
          {files}
        </aside>
      </section>
    </Container>
  );
}

const DragDropMultiple = props => {
  const MAX_SIZE = 1048576
  const { acceptedFiles, getRootProps, getInputProps, isDragActive } = useDropzone({
    maxSize: MAX_SIZE,
    onDrop: acceptedFiles => {
      props.setPhotos(props.name, acceptedFiles)
      acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      }))
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
    title: "All files size's must be under 1 MB"
  }

  const files = acceptedFiles.map(file => {
    if (file.preview != null) {
      return (
        <div key={"File " + file.path} className="center-parent">
          <h5>
            {file.path} - {file.size} bytes
          </h5>
          <img src={file.preview} style={img} alt="preview" />
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
    <Container className="container-md mt-3">
      <Swal options={dragReject} id="dragReject" />
      <section>
        <div {...getRootProps({ className: 'dropzone' })}>
          <input name={props.name} {...getInputProps()} />
          <p className="text-center box-placeholder m-0">
            {!isDragActive && "Drag 'n' drop some files here, or click to select files"}
            {isDragActive && "Drop Here!"}
          </p>
        </div>
        <aside>
          {files}
        </aside>
      </section>
    </Container>
  );
}

class MemberDataAdd extends Component {
  constructor(props) {
    super(props)

    const dd = String(new Date().getDate()).padStart(2, '0')
    const mmmm = MONTHS_ID[new Date().getMonth()]
    const yyyy = new Date().getFullYear()

    const today = dd + ' ' + mmmm + ' ' + yyyy

    this.state = {
      showNotDuplicate: false,
      privateIdentity: false,
      formValidateDuplicate: false,
      totalFilteredRecords: false,
      pageItems: [],
      today: today,
      activeStep: '1',
      files: [],
      errorMsg: "",

      dcPass: false,
      tab1Pass: false,
      tab2Pass: false,

      addValidation: {
        registrationDate: '',
        legalFormId: '1',
        fullname: '',
        membership: '',
        typeOfIdentityId: '',
        identityTypeOptions: [],
        placeOfBirth: '',
        addressBasedOnIdentity: '',
        identityNumber: '',
        motherName: '',

        officeId: '',
        officeOptions: [],
        dateOfBirth: '',
        externalID: '',
        nickname: '',
        religion: '',
        religionOptions: [],
        genderCodeValue: '',
        genderOptions: [],
        mobileNo: '',
        email: '',
        taxName: '',
        taxAddress: '',
        flagTaxCodeValue: "",
        flagTaxOptions: [],
        active: false,
        mobileUser: '',
        staffId: '',
        staffOptions: [],
        sectorId: '',
        sectorOptions: [],
        nip: '',
        taxNumber: '',
        identityValidDate: '',
        submittedOnDate: today,


        identityCountryCodeValue: '',
        countryOptions: [],
        identityProvinceId: '',
        provinceOptions: [],
        identityCityId: '',
        cityOptions: [],
        cityOptionsFilter: [],
        identityCityOptions: [],
        identityCityOptionsFilter: [],
        identityPostalCode: '',
        identitySubDistrict: '',
        identityVillage: '',
        identityRt: '',
        identityRw: '',

        address: '',
        cityId: '',
        countryCodeValue: '',
        postalCode: '',
        provinceId: '',
        subDistrict: '',
        village: '',
        rt: '',
        rw: '',


        selfiePhoto: {},
        idCardPhoto: {},
        npwpPhoto: {},
        otherDocuments: []
      }
    }

    this.props.actions.clientTemplate({}, this.setClientTemplate)
  }

  setClientTemplate = res => {
    let identityTypeOptions = []
    res.typeOfIdentityOptions.map(row => {
      identityTypeOptions.push(row)

      return null
    })
    this.changeAddValidation("identityTypeOptions", identityTypeOptions)

    let genderOptions = []
    res.genderOptions.map(row => {
      genderOptions.push(row)

      return null
    })
    this.changeAddValidation("genderOptions", genderOptions)

    let officeOptions = []
    res.officeOptions.map(row => {
      officeOptions.push(row)

      return null
    })
    this.changeAddValidation("officeOptions", officeOptions)

    let religionOptions = []
    res.religionOption.map(row => {
      religionOptions.push(row)

      return null
    })
    this.changeAddValidation("religionOptions", religionOptions)

    let countryOptions = []
    res.countryOptions.map(row => {
      countryOptions.push(row)

      return null
    })
    this.changeAddValidation("countryOptions", countryOptions)

    let provinceOptions = []
    res.provinceOptions.map(row => {
      provinceOptions.push(row)

      return null
    })
    this.changeAddValidation("provinceOptions", provinceOptions)

    let identityCityOptionsFilter = []
    res.cityOptions.map(row => {
      identityCityOptionsFilter.push(row)

      return null
    })
    this.changeAddValidation("identityCityOptions", identityCityOptionsFilter)
    this.changeAddValidation("identityCityOptionsFilter", identityCityOptionsFilter)

    let cityOptions = []
    res.cityOptions.map(row => {
      cityOptions.push(row)

      return null
    })
    this.changeAddValidation("cityOptions", cityOptions)
    this.changeAddValidation("cityOptionsFilter", cityOptions)

    let flagTaxOptions = []
    res.flagTaxOptions.map(row => {
      flagTaxOptions.push(row)

      return null
    })
    this.changeAddValidation("flagTaxOptions", flagTaxOptions)

    let staffOptions = []
    res.staffOptions.map(row => {
      staffOptions.push(row)

      return null
    })
    this.changeAddValidation("staffOptions", staffOptions)

    let sectorOptions = []
    let sectorCodeString
    res.sectorOptions.map(row => {
      sectorCodeString = row.code.toString()
      if (sectorCodeString.substring(0, 1) === "1") {
        sectorOptions.push(row)
      }

      return null
    })
    this.changeAddValidation("sectorOptions", sectorOptions)
  }

  checkDuplicate = () => {
    const state = this.state
    const addValidation = state.addValidation

    const checkTotalFilter = res => {
      if (res.totalFilteredRecords > 0) {
        this.setState({
          totalFilteredRecords: true,
          pageItems: res.pageItems
        })
      } else if (res.totalFilteredRecords === 0) {
        this.setState({
          totalFilteredRecords: false
        })
      }
    }

    this.props.actions.checkDuplicate(
      {
        fullname: addValidation.fullname,
        dateOfBirth: addValidation.dateOfBirth,
        addressBasedOnIdentity: addValidation.addressBasedOnIdentity,
        motherName: addValidation.motherName,
        typeOfIdentityId: addValidation.typeOfIdentityId,
        identityNumber: addValidation.identityNumber,
        legalFormId: addValidation.legalFormId
      },
      checkTotalFilter
    )

    this.setState({
      showNotDuplicate: true
    })
  }

  toggleStep = activeStep => {
    if (this.state.activeStep !== activeStep) {
      this.setState({
        activeStep
      });
    }
  }
  changeDateState = (name, e) => {
    let dd = String(e.toDate().getDate()).padStart(2, '0')
    let mm = MONTHS_ID[e.toDate().getMonth()]
    let yyyy = e.toDate().getFullYear()

    let date = dd + " " + mm + " " + yyyy

    this.setState(prevState => ({
      addValidation: {
        ...prevState.addValidation,
        [name]: date
      }
    }))
  }

  changeAddValidation = (name, val) => {
    this.setState(prevState =>
      ({
        addValidation: {
          ...prevState.addValidation,
          [name]: val
        }
      })
    )
  }

  changeProvince = val => {
    this.setState(prevState =>
      ({
        addValidation: {
          ...prevState.addValidation,
          identityProvinceId: val
        }
      })
    )

    let cityOptions = [];
    this.state.addValidation.cityOptions.map(row => {
      if (row.provinceId === val) {
        cityOptions.push(row)
      }

      return null
    })
    this.setState(prevState =>
      ({
        addValidation: {
          ...prevState.addValidation,
          cityOptionsFilter: cityOptions
        }
      })
    )
  }

  setPhotos = (name, file) => {
    this.setState(prevState => ({
      addValidation: {
        ...prevState.addValidation,
        [name]: file
      }
    }))
  }

  finishForm = () => {
    const state = this.state
    const addValidation = state.addValidation

    const clientImage = new FormData()
    clientImage.append(
      "file",
      addValidation.selfiePhoto
    )

    const clientIdCard = new FormData()
    clientIdCard.append(
      "name",
      "idCard"
    )
    clientIdCard.append(
      "description",
      "ID Card"
    )
    clientIdCard.append(
      "file",
      addValidation.idCardPhoto
    )

    const clientNpwp = new FormData()
    clientNpwp.append(
      "name",
      "npwp"
    )
    clientNpwp.append(
      "description",
      "NPWP"
    )
    clientNpwp.append(
      "file",
      addValidation.npwpPhoto
    )

    const clientOtherDocs = []

    this.state.addValidation.otherDocuments.map((doc, i) => {
      const formdata = new FormData()
      formdata.append(
        "name",
        "otherDocuments"
      )
      formdata.append(
        "description",
        "Other Documents"
      )
      formdata.append(
        "file",
        addValidation.otherDocuments[i]
      )

      clientOtherDocs.push(formdata)

      return null
    })

    const setClientAddRes = res => {
      this.props.actions.clientAddImage(clientImage, res)

      this.props.actions.clientAddDocument(clientIdCard, res)

      this.props.actions.clientAddDocument(clientNpwp, res)

      clientOtherDocs.map(doc => {
        this.props.actions.clientAddDocument(doc, res)

        return null
      })

      this.props.history.push({
        pathname: "/simpool/member/data-detail/" + res.clientId,
        search: "?tenantIdentifier=" + this.props.settings.tenantIdentifier
      })
    }

    const setErrorMsg = err => {
      let newError = ""

      err.errors.map(err => newError = newError + err.defaultUserMessage + "<br />")

      this.setState({
        errorMsg: newError
      })

      document.getElementById("errorForm").click()
    }

    this.props.actions.clientAdd(
      {
        legalFormId: addValidation.legalFormId,
        officeId: addValidation.officeId,
        flagTaxCodeValue: addValidation.flagTaxCodeValue,
        typeOfIdentityId: addValidation.typeOfIdentityId,
        fullname: addValidation.fullname,
        motherName: addValidation.motherName,
        addressBasedOnIdentity: addValidation.addressBasedOnIdentity,
        taxNumber: addValidation.taxNumber,
        identityNumber: addValidation.identityNumber,
        sectorId: addValidation.sectorId,
        identityCountryCodeValue: addValidation.identityCountryCodeValue,
        identityProvinceId: addValidation.identityProvinceId,
        identityCityId: addValidation.identityCityId,
        identitySubDistrict: addValidation.identitySubDistrict,
        identityVillage: addValidation.identityVillage,
        identityPostalCode: addValidation.identityPostalCode,
        placeOfBirth: addValidation.placeOfBirth,
        genderCodeValue: addValidation.genderCodeValue,
        mobileNo: addValidation.mobileNo,
        religion: addValidation.religion,
        taxName: addValidation.taxName,
        taxAddress: addValidation.taxAddress,
        submittedOnDate: addValidation.submittedOnDate,
        dateOfBirth: addValidation.dateOfBirth,
        email: addValidation.email,
        staffId: addValidation.staffId,
        externalId: addValidation.externalID,
        nip: addValidation.nip,
        nickname: addValidation.nickname,
        identityValidDate: addValidation.identityValidDate,
        identityRt: addValidation.identityRt,
        identityRw: addValidation.identityRw,
        mobileUser: addValidation.mobileUser,

        clientNonPersonDetails: {
          locale: this.props.dashboard.language,
          dateFormat: "dd MMMM yyyy"
        },
        locale: this.props.dashboard.language,
        active: addValidation.active,
        dateFormat: "dd MMMM yyyy",
        activationDate: state.today,
        savingsProductId: null
      },
      setClientAddRes,
      setErrorMsg
    )
  }

  render() {
    const state = this.state
    const addValidation = state.addValidation
    let submitFormDuplicate = null

    const tabNotPermit = {
      title: "Tolong selesaikan langkah sebelumnya!"
    }

    let h3 = document.createElement("h3");
    h3.innerHTML = state.errorMsg

    const errorForm = {
      title: "Errors",
      content: h3
    }

    const showTabNotPermit = () => {
      document.getElementById("tabNotPermit").click()
    }

    const bindFormDuplicate = submitForm => {
      submitFormDuplicate = submitForm
    }

    const ShowNotDuplicate = () => {
      const setNotDuplicate = () => {
        this.setState({
          showNotDuplicate: false,
          privateIdentity: true,
          dcPass: true
        })
      }

      const editMember = id => {
        this.props.history.push({
          pathname: "/simpool/member/data-edit/" + id,
          search: "?tenantIdentifier=" + this.props.settings.tenantIdentifier
        })
      }

      if (this.state.totalFilteredRecords > 0) {
        return (
          <div>
            <div className="row justify-content-center my-2">
              <h3>Pilih nasabah untuk di-edit !</h3>
            </div>
            <div className="row row-mx-0 ft-detail list-header d-flex justify-content-center center-parent">
              <div className="col-2">
                <span>Id</span>
              </div>
              <div className="col-2">
                <span>External ID</span>
              </div>
              <div className="col-2">
                <span>Full Name</span>
              </div>
              <div className="col-2">
                <span>Office</span>
              </div>
              <div className="col-2">
                <span>Status</span>
              </div>
            </div>
            {
              this.state.pageItems.map((item, key) => {
                return (
                  <div key={"Savings " + key}>
                    <div
                      className="row row-mx-0 ft-detail list-detail 
                        d-flex justify-content-center list-hover center-parent"
                      onClick={() => editMember(item.id)}
                    >
                      <div className="col-2">
                        <span>{item.id}</span>
                      </div>
                      <div className="col-2">
                        <span>{item.legalForm.value}</span>
                      </div>
                      <div className="col-2">
                        <span>{item.fullname}</span>
                      </div>
                      <div className="col-2">
                        <span>{item.officeName}</span>
                      </div>
                      <div className="col-2">
                        <span>{item.status.value}</span>
                      </div>
                    </div>
                    <div className="row d-flex justify-content-center">
                      <hr className="col-10 hr-margin-0" />
                    </div>
                  </div>
                )
              })
            }
            <div className="mb-3" />
          </div>
        )
      } else {
        return (
          <div>
            <Button
              disabled
              className="col-12"
            >
              Tidak ada data yang sama!
            </Button>
            <Button
              outline
              color="primary"
              className="btn btn-block mt-4 justify-content-center"
              onClick={() => setNotDuplicate()}
            >
              Create Member
            </Button>
          </div>
        )
      }
    }

    return (
      <ContentWrapper>
        <Swal options={tabNotPermit} id="tabNotPermit" />
        <Swal options={errorForm} id="errorForm" />

        <div className="content-heading">
          <div>Anggota Baru</div>
        </div>

        <Card className="card-default">
          <CardHeader>
            <div>{this.state.today}</div>
          </CardHeader>

          <CardBody>
            <div>
              <Link
                to={{
                  pathname: "/simpool/member/data",
                  search: "?tenantIdentifier=" + this.props.settings.tenantIdentifier
                }}>
                <Button className="btn col-4 col-lg-2 mb-4 justify-content-center" color="primary" outline>
                  <Trans i18nKey='common.BACK' />
                </Button>
              </Link>
            </div>
            <Nav pills justified={true}>
              <NavItem style={stepNavitemStyle}>
                <NavLink
                  tag="div"
                  className={
                    this.state.activeStep === '1'
                      ? classnames({ active: true })
                      : "cursor-pointer"
                  }
                  onClick={() => this.toggleStep('1')}
                >
                  <h4 className="text-left my-4">
                    1. <Trans i18nKey='member.data-add.PRIVATE_IDENTITY' />
                    <br />
                    <small><Trans i18nKey='member.data-add.PRIVATE_IDENTITY_SUB' /></small>
                  </h4>
                </NavLink>
              </NavItem>
              <NavItem style={stepNavitemStyle}>
                <NavLink
                  tag="div"
                  className={
                    this.state.activeStep === '2'
                      ? classnames({ active: true })
                      : "cursor-pointer"
                  }
                  onClick={() => {
                    if (this.state.tab1Pass) {
                      this.toggleStep('2')
                    } else if (!this.state.tab1Pass) {
                      showTabNotPermit()
                    }
                  }}
                >
                  <h4 className="text-left my-4">
                    2. <Trans i18nKey='member.data-add.ADDRESS' />
                    <br />
                    <small><Trans i18nKey='member.data-add.ADDRESS_SUB' /></small>
                  </h4>
                </NavLink>
              </NavItem>
              <NavItem style={stepNavitemStyle}>
                <NavLink
                  tag="div"
                  className={
                    this.state.activeStep === '3'
                      ? classnames({ active: true })
                      : "cursor-pointer"
                  }
                  onClick={() => {
                    if (this.state.tab1Pass && this.state.tab2Pass) {
                      this.toggleStep('3')
                    } else if (!this.state.tab1Pass || !this.state.tab2Pass) {
                      showTabNotPermit()
                    }
                  }}
                >
                  <h4 className="text-left my-4">
                    3. <Trans i18nKey='member.data-add.DOCUMENT' />
                    <br />
                    <small><Trans i18nKey='member.data-add.DOCUMENT_SUB' /></small>
                  </h4>
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={this.state.activeStep} className="form-font-size">
              <TabPane id="tabPane1" tabId="1">
                <Formik
                  initialValues={
                    {
                      legalFormId: addValidation.legalFormId,
                      membership: addValidation.membership,
                      fullname: addValidation.fullname,
                      dateOfBirth: addValidation.dateOfBirth,
                      addressBasedOnIdentity: addValidation.addressBasedOnIdentity,
                      motherName: addValidation.motherName,
                      typeOfIdentityId: addValidation.typeOfIdentityId,
                      identityNumber: addValidation.identityNumber
                    }
                  }
                  validate={values => {
                    const errors = {}

                    console.log(values.typeOfIdentityId)

                    if (!values.legalFormId) {
                      errors.legalFormId = <Trans i18nKey='forms.REQUIRED' />
                    }

                    if (/^[a-zA-Z\s'.-]+$/.test(values.fullname) === false) {
                      errors.fullname = this.props.i18n.t('member.data-add.FULLNAME_ID')
                        + " harus terdiri dari alphabet (a-zA-Z\\s\\'.-)"
                    }
                    if (!values.fullname) {
                      errors.fullname = <Trans i18nKey='forms.REQUIRED' />
                    }

                    if (!values.dateOfBirth) {
                      errors.dateOfBirth = <Trans i18nKey='forms.REQUIRED' />
                    }

                    if (/^[a-zA-Z\s'.-]+$/.test(values.motherName) === false && values.motherName !== "") {
                      errors.motherName = this.props.i18n.t('member.data-add.MOTHER_NAME')
                        + " harus terdiri dari alphanumeric (a-zA-Z\\s\\'.-)"
                    }

                    if (!values.motherName) {
                      errors.motherName = <Trans i18nKey='forms.REQUIRED' />
                    }

                    switch (values.typeOfIdentityId) {
                      case "IC":
                        if (/^(0|[1-9]\d*)$/.test(values.identityNumber) === false) {
                          errors.identityNumber = "E-KTP harus terdiri dari angka"
                        } else if (values.identityNumber.length !== 16) {
                          errors.identityNumber = "E-KTP License harus berisi 16 angka"
                        }
                        break;
                      case "PASS":
                        if (/^[a-zA-Z0-9]+$/.test(values.identityNumber) === false) {
                          errors.identityNumber = "Passport harus terdiri dari alphanumeric"
                        } else if (values.identityNumber.length !== 8) {
                          errors.identityNumber = "Passport harus berisi 8 alphanumeric"
                        }
                        break;
                      case "DL":
                        if (/^(0|[1-9]\d*)$/.test(values.identityNumber) === false) {
                          errors.identityNumber = "Driver License harus terdiri dari angka"
                        } else if (values.identityNumber.length !== 12) {
                          errors.identityNumber = "Driver License harus berisi 12 angka"
                        }
                        break;
                      case "SC":
                        if (/^[a-zA-Z0-9]+$/.test(values.identityNumber) === false) {
                          errors.identityNumber = "Student Card harus terdiri dari alphanumeric"
                        } else if (values.identityNumber.length !== 15) {
                          errors.identityNumber = "Student Card harus berisi 15 alphanumeric"
                        }
                        break;
                      case "NIP":
                        if (/^[a-zA-Z0-9]+$/.test(values.identityNumber) === false) {
                          errors.identityNumber = "Kartu Kepegawaian harus terdiri dari alphanumeric"
                        } else if (values.identityNumber.length < 12 && values.identityNumber.length > 14) {
                          errors.identityNumber = "Kartu Kepegawaian harus berisi 12-14 alphanumeric"
                        }
                        break;
                      default: break;
                    }
                    if (values.typeOfIdentityId === "") {
                      errors.typeOfIdentityId = <Trans i18nKey='forms.REQUIRED' />
                    }

                    if (!values.identityNumber) {
                      errors.identityNumber = <Trans i18nKey='forms.REQUIRED' />
                    }


                    if (values.legalFormId) {
                      this.changeAddValidation("legalFormId", values.legalFormId)
                    }
                    if (values.membership) {
                      this.changeAddValidation("membership", values.membership)
                    }
                    if (values.fullname) {
                      this.changeAddValidation("fullname", values.fullname)
                    }
                    if (values.dateOfBirth) {
                      this.changeAddValidation("dateOfBirth", values.dateOfBirth)
                    }
                    if (values.addressBasedOnIdentity) {
                      this.changeAddValidation("addressBasedOnIdentity", values.addressBasedOnIdentity)
                    }
                    if (values.motherName) {
                      this.changeAddValidation("motherName", values.motherName)
                    }
                    if (values.typeOfIdentityId) {
                      this.changeAddValidation("typeOfIdentityId", values.typeOfIdentityId)
                    }
                    if (values.identityNumber) {
                      this.changeAddValidation("identityNumber", values.identityNumber)
                    }

                    if (Object.keys(errors).length > 0 && errors.constructor === Object) {
                      this.setState({
                        tab1Pass: false,
                        dcPass: false
                      })
                    }

                    return errors;
                  }}
                  enableReinitialize="true"
                  onSubmit={() => {
                    if (!state.dcPass) {
                      this.checkDuplicate()
                    }
                    this.setState({
                      dcPass: true
                    })

                    return null
                  }}
                >
                  {
                    formikProps => {
                      const {
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        setFieldTouched,
                        setFieldValue,
                        submitForm
                      } = formikProps

                      bindFormDuplicate(submitForm)

                      return (
                        <form className="pt-3 mb-3" onSubmit={handleSubmit} name="tab1">
                          <label className="mt-3" htmlFor="legalFormId">
                            <Trans i18nKey='member.data-add.CLIENT_TYPE' /> <span className="red"> *</span>
                          </label>
                          <div className="py-2">
                            <label className="c-radio">
                              <Input id="individu" type="radio" name="legalFormId" className="input-font-size" value="1"
                                checked={values.legalFormId === "1"} required onChange={handleChange}
                              />
                              <span className="fa fa-circle" />Individu</label>
                            <span className="span-disabled">
                              <label className="c-radio">
                                <Input id="badanUsaha" type="radio" name="legalFormId" className="input-font-size" value="2" disabled
                                  checked={values.legalFormId === "2"} onChange={handleChange}
                                />
                                <span className="fa fa-circle" />Badan Usaha</label>
                            </span>
                          </div>
                          <div className="input-feedback">{touched.legalFormId && errors.legalFormId}</div>

                          {
                            this.state.addValidation.legalFormId === "1"
                              ? (
                                <div>
                                  <label htmlFor="membership">
                                    ZZZ <Trans i18nKey='member.data-add.MEMBERSHIP' />
                                  </label>
                                  <div className="py-2">
                                    <label className="c-radio">
                                      <Input id="anggota" type="radio" name="membership" value="anggota"
                                        checked={values.membership === "anggota"} onChange={handleChange}
                                      />
                                      <span className="fa fa-circle" />Anggota</label>
                                    <label className="c-radio">
                                      <Input id="anggotaLuarBiasa" type="radio" name="membership"
                                        value="anggotaLuarBiasa" checked={values.membership === "anggotaLuarBiasa"}
                                        onChange={handleChange}
                                      />
                                      <span className="fa fa-circle" />Anggota Luar Biasa</label>
                                    <label className="c-radio">
                                      <Input id="calonAnggota" type="radio" name="membership" value="calonAnggota"
                                        checked={values.membership === "calonAnggota"} onChange={handleChange}
                                      />
                                      <span className="fa fa-circle" />Calon Anggota</label>
                                  </div>

                                  <label className="mt-3" htmlFor="fullname">
                                    <Trans i18nKey='member.data-add.FULLNAME_ID' /> <span className="red"> *</span>
                                  </label>
                                  <Input
                                    name="fullname"
                                    className={
                                      touched.fullname && errors.fullname
                                        ? "input-font-size input-error"
                                        : "input-font-size"
                                    }
                                    type="text"
                                    id="fullname"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder={this.props.i18n.t("member.data-add.FULLNAME_ID_PH")}
                                    value={values.fullname}
                                  />
                                  <div className="input-feedback">{touched.fullname && errors.fullname}</div>

                                  <label className="mt-3" htmlFor="dateOfBirth">
                                    <Trans i18nKey='member.data-add.BIRTHDATE' /> <span className="red"> *</span>
                                  </label>
                                  <Field
                                    name="dateOfBirth"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    component={DateTime}
                                    locale={this.props.dashboard.language}
                                    value={values.dateOfBirth}
                                    touched={touched.dateOfBirth}
                                    error={errors.dateOfBirth}
                                    dateParam={state.today}
                                  />
                                  <div className="input-feedback">{touched.dateOfBirth && errors.dateOfBirth}</div>

                                  <label className="mt-3" htmlFor="typeOfIdentityId">
                                    <Trans i18nKey='member.data-add.IDENTITY_TYPE' /> <span className="red"> *</span>
                                  </label>

                                  <div>
                                    <Select
                                      value={values.typeOfIdentityId}
                                      className={
                                        touched.typeOfIdentityId && errors.typeOfIdentityId
                                          ? "col-12 input-error"
                                          : "col-12"
                                      }
                                      name="typeOfIdentityId"
                                      onChange={val => setFieldValue("typeOfIdentityId", val)}
                                      onBlur={val => setFieldTouched("typeOfIdentityId", val)}
                                      showSearch
                                      filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                      }
                                      size="large"
                                    >
                                      <Option value="">
                                        {this.props.i18n.t("member.data-add.IDENTITY_TYPE_PH")}
                                      </Option>
                                      {
                                        Array.isArray(addValidation.identityTypeOptions) && addValidation.identityTypeOptions.length > 0
                                          ? addValidation.identityTypeOptions.map((option, i) => {
                                            return (
                                              <Option value={option.name} key={"identityType " + i} >{option.description}</Option>
                                            )
                                          })
                                          : null
                                      }
                                    </Select>
                                  </div>
                                  <div className="input-feedback">{touched.typeOfIdentityId && errors.typeOfIdentityId}</div>

                                  {
                                    values.typeOfIdentityId !== ""
                                      ? (
                                        <div>
                                          <label className="mt-3" htmlFor="identityNumber">
                                            No. {
                                              Array.isArray(addValidation.identityTypeOptions) && addValidation.identityTypeOptions.length > 0
                                                ? addValidation.identityTypeOptions.map((identity, i) => {
                                                  if (identity.name === values.typeOfIdentityId) {
                                                    return (<span key={"No. Identity " + i}>{identity.description}</span>)
                                                  }

                                                  return null
                                                })
                                                : null
                                            } <span className="red"> *</span>
                                          </label>
                                          <Input
                                            name="identityNumber"
                                            className={
                                              touched.identityNumber && errors.identityNumber
                                                ? "input-font-size input-error"
                                                : "input-font-size"
                                            }
                                            type="text"
                                            id="identityNumber"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            placeholder="101001002"
                                            value={values.identityNumber}
                                          />
                                          <div className="input-feedback">{touched.identityNumber && errors.identityNumber}</div>
                                        </div>
                                      )
                                      : null
                                  }

                                  <label className="mt-3" htmlFor="motherName">
                                    <Trans i18nKey='member.data-add.MOTHER_NAME' /> <span className="red"> *</span>
                                  </label>
                                  <Input
                                    name="motherName"
                                    className={
                                      touched.motherName && errors.motherName
                                        ? "input-font-size input-error"
                                        : "input-font-size"
                                    }
                                    type="text"
                                    id="motherName"
                                    placeholder={this.props.i18n.t("member.data-add.MOTHER_NAME_PH")}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.motherName}
                                  />
                                  <div className="input-feedback">{touched.motherName && errors.motherName}</div>

                                  <label className="mt-3" htmlFor="addressBasedOnIdentity">
                                    <Trans i18nKey='member.data-add.IDENTITY_ADDRESS' />
                                  </label>
                                  <textarea
                                    rows="4"
                                    name="addressBasedOnIdentity"
                                    className="form-control form-font-size"
                                    type="text"
                                    id="addressBasedOnIdentity"
                                    placeholder={this.props.i18n.t("member.data-add.IDENTITY_ADDRESS_PH")}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.addressBasedOnIdentity}
                                  />
                                </div>
                              )
                              : null
                          }

                          {
                            state.privateIdentity
                              ? null
                              : (
                                <Button
                                  className="btn btn-block mt-4 mb-3 justify-content-center"
                                  type="submit"
                                  color="primary"
                                  outlined="true"
                                >
                                  <Trans i18nKey='member.data-add.DUPLICATE_CHECK' />
                                </Button>
                              )
                          }
                        </form>
                      )
                    }
                  }
                </Formik>

                {
                  this.state.showNotDuplicate
                    ? (
                      <ShowNotDuplicate />
                    )
                    : null
                }
                {
                  this.state.privateIdentity
                    ? (
                      <Formik
                        initialValues={
                          {
                            active: addValidation.active,
                            nickname: addValidation.nickname,
                            dateOfBirth: addValidation.dateOfBirth,
                            email: addValidation.email,
                            externalID: addValidation.externalID,
                            flagTaxCodeValue: addValidation.flagTaxCodeValue,
                            genderCodeValue: addValidation.genderCodeValue,
                            identityValidDate: addValidation.identityValidDate,
                            mobileUser: addValidation.mobileUser,
                            mobileNo: addValidation.mobileNo,
                            nip: addValidation.nip,
                            officeId: addValidation.officeId,
                            placeOfBirth: addValidation.placeOfBirth,
                            religion: addValidation.religion,
                            sectorId: addValidation.sectorId,
                            staffId: addValidation.staffId,
                            submittedOnDate: addValidation.submittedOnDate,
                            taxAddress: addValidation.taxAddress,
                            taxName: addValidation.taxName,
                            taxNumber: addValidation.taxNumber
                          }
                        }
                        validate={values => {
                          const errors = {}

                          if (!values.officeId) {
                            errors.officeId = <Trans i18nKey='forms.REQUIRED' />
                          }

                          if (!values.dateOfBirth) {
                            errors.dateOfBirth = <Trans i18nKey='forms.REQUIRED' />
                          }

                          if (!values.genderCodeValue) {
                            errors.genderCodeValue = <Trans i18nKey='forms.REQUIRED' />
                          }

                          if (/^([0-9]\d*)$/.test(values.mobileNo) === false && values.mobileNo !== "") {
                            errors.mobileNo = "Mobile No. harus berisi angka 0 sampai 9"
                          } else if (values.mobileNo.length < 10 || values.mobileNo.length > 15) {
                            errors.mobileNo = "Mobile No. harus terdiri dari 10-15 angka"
                          }
                          if (!values.mobileNo) {
                            errors.mobileNo = <Trans i18nKey='forms.REQUIRED' />
                          }

                          if (/^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/.test(values.email) === false && values.email !== "") {
                            errors.email = "Email yang dimasukkan tidak valid"
                          }

                          if (/^[a-zA-Z\s'.-]+$/.test(values.taxName) === false) {
                            errors.taxName = "Name based on tax harus terdiri dari alphanumeric (a-zA-Z\\s\\'.-)"
                          }
                          if (!values.taxName) {
                            errors.taxName = <Trans i18nKey='forms.REQUIRED' />
                          }

                          if (!values.taxAddress) {
                            errors.taxAddress = <Trans i18nKey='forms.REQUIRED' />
                          }

                          if (values.flagTaxCodeValue === "") {
                            errors.flagTaxCodeValue = <Trans i18nKey='forms.REQUIRED' />
                          }

                          if (values.sectorId === "") {
                            errors.sectorId = <Trans i18nKey='forms.REQUIRED' />
                          }

                          if (!values.placeOfBirth) {
                            errors.placeOfBirth = <Trans i18nKey='forms.REQUIRED' />
                          }

                          if (/^(0|[1-9]\d*)$/.test(values.nip) === false && values.nip !== "") {
                            errors.nip = "NIP harus berisi angka 0 sampai 9"
                          }

                          if (/^(0|[1-9]\d*)$/.test(values.taxNumber) === false && values.taxNumber !== "") {
                            errors.taxNumber = "Tax Number harus berisi angka 0 sampai 9"
                          } else if (values.taxNumber.length > 15) {
                            errors.taxNumber = "Tax Number harus <= 15 angka"
                          }
                          if (!values.taxNumber) {
                            errors.taxNumber = <Trans i18nKey='forms.REQUIRED' />
                          }

                          if (values.religion === "") {
                            errors.religion = <Trans i18nKey='forms.REQUIRED' />
                          }


                          if (values.active) {
                            this.changeAddValidation("active", values.active)
                          }
                          if (values.nickname) {
                            this.changeAddValidation("nickname", values.nickname)
                          }
                          if (values.dateOfBirth) {
                            this.changeAddValidation("dateOfBirth", values.dateOfBirth)
                          }
                          if (values.email) {
                            this.changeAddValidation("email", values.email)
                          }
                          if (values.externalID) {
                            this.changeAddValidation("externalID", values.externalID)
                          }
                          if (values.flagTaxCodeValue) {
                            this.changeAddValidation("flagTaxCodeValue", values.flagTaxCodeValue)
                          }
                          if (values.genderCodeValue) {
                            this.changeAddValidation("genderCodeValue", values.genderCodeValue)
                          }
                          if (values.identityValidDate) {
                            this.changeAddValidation("identityValidDate", values.identityValidDate)
                          }
                          if (values.mobileUser) {
                            this.changeAddValidation("mobileUser", values.mobileUser)
                          }
                          if (values.mobileNo) {
                            this.changeAddValidation("mobileNo", values.mobileNo)
                          }
                          if (values.nip) {
                            this.changeAddValidation("nip", values.nip)
                          }
                          if (values.officeId) {
                            this.changeAddValidation("officeId", values.officeId)
                          }
                          if (values.placeOfBirth) {
                            this.changeAddValidation("placeOfBirth", values.placeOfBirth)
                          }
                          if (values.religion) {
                            this.changeAddValidation("religion", values.religion)
                          }
                          if (values.sectorId) {
                            this.changeAddValidation("sectorId", values.sectorId)
                          }
                          if (values.staffId) {
                            this.changeAddValidation("staffId", values.staffId)
                          }
                          if (values.taxAddress) {
                            this.changeAddValidation("taxAddress", values.taxAddress)
                          }
                          if (values.taxName) {
                            this.changeAddValidation("taxName", values.taxName)
                          }
                          if (values.taxNumber) {
                            this.changeAddValidation("taxNumber", values.taxNumber)
                          }
                          if (values.submittedOnDate) {
                            this.changeAddValidation("submittedOnDate", values.submittedOnDate)
                          }

                          return errors;
                        }}
                        enableReinitialize="true"
                        onSubmit={e => {
                          this.setState({
                            tab1Pass: true
                          })

                          if (state.dcPass) {
                            this.toggleStep('2')
                          }
                        }}
                      >
                        {({
                          values,
                          errors,
                          touched,
                          handleChange,
                          handleBlur,
                          handleSubmit,
                          setFieldTouched,
                          setFieldValue
                        }) => (
                            <form onSubmit={handleSubmit}>
                              <div className="row">
                                <div className="col-md-6">
                                  <label className="mt-3" htmlFor="officeId">
                                    Kantor <span className="red"> *</span>
                                  </label>
                                  <Select
                                    value={values.officeId}
                                    className={
                                      touched.officeId && errors.officeId
                                        ? "col-12 input-error"
                                        : "col-12"
                                    }
                                    name="officeId"
                                    onChange={val => setFieldValue("officeId", val)}
                                    onBlur={val => setFieldTouched("officeId", val)}
                                    showSearch
                                    filterOption={(input, option) =>
                                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    size="large"
                                  >
                                    <Option value="">Pilih Kantor</Option>
                                    {
                                      Array.isArray(addValidation.officeOptions) && addValidation.officeOptions.length > 0
                                        ? addValidation.officeOptions.map((option, i) => {
                                          return (
                                            <Option value={option.id} key={"identityType " + i} >{option.name}</Option>
                                          )
                                        })
                                        : null
                                    }
                                  </Select>
                                  <div className="input-feedback">{touched.officeId && errors.officeId}</div>

                                  <label className="mt-3" htmlFor="placeOfBirth">
                                    Tempat Lahir <span className="red"> *</span>
                                  </label>
                                  <Input
                                    name="placeOfBirth"
                                    className={
                                      touched.placeOfBirth && errors.placeOfBirth
                                        ? "input-font-size input-error"
                                        : "input-font-size"
                                    }
                                    type="text"
                                    id="placeOfBirth"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="contoh: Tangerang"
                                    value={values.placeOfBirth}
                                  />
                                  <div className="input-feedback">{touched.placeOfBirth && errors.placeOfBirth}</div>

                                  <label className="mt-3" htmlFor="dateOfBirth">
                                    <Trans i18nKey='member.data-add.BIRTHDATE' /> <span className="red"> *</span>
                                  </label>
                                  <Field
                                    name="dateOfBirth"
                                    onChange={handleChange}
                                    component={DateTime}
                                    locale={this.props.dashboard.language}
                                    value={values.dateOfBirth}
                                    error={errors.dateOfBirth}
                                    touched={touched.dateOfBirth}
                                    dateParam={state.today}
                                  />
                                  <div className="input-feedback">{touched.dateOfBirth && errors.dateOfBirth}</div>

                                  <label className="mt-3" htmlFor="genderCodeValue">
                                    Jenis Kelamin <span className="red"> *</span>
                                  </label>
                                  <div className="py-2">
                                    {
                                      state.addValidation.genderOptions.map(gender => {
                                        return (
                                          <label className="c-radio" key={"gender " + gender.name}>
                                            <Input id={gender.name} type="radio" name="genderCodeValue" className="input-font-size"
                                              value={gender.name} checked={values.genderCodeValue === gender.name} onChange={handleChange} onBlur={handleBlur}
                                            />
                                            <span className="fa fa-circle" />
                                            {gender.description}
                                          </label>
                                        )
                                      })
                                    }
                                  </div>
                                  <div className="input-feedback">{touched.genderCodeValue && errors.genderCodeValue}</div>

                                  <label className="mt-3" htmlFor="religion">
                                    Agama <span className="red"> *</span>
                                  </label>
                                  <Select
                                    value={values.religion}
                                    className={
                                      touched.religion && errors.religion
                                        ? "col-12 input-error"
                                        : "col-12"
                                    }
                                    name="religion"
                                    onChange={val => setFieldValue("religion", val)}
                                    onBlur={val => setFieldTouched("religion", val)}
                                    showSearch
                                    filterOption={(input, option) =>
                                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    size="large"
                                  >
                                    <Option value="">Pilih agama anda</Option>
                                    {
                                      Array.isArray(addValidation.religionOptions) && addValidation.religionOptions.length > 0
                                        ? addValidation.religionOptions.map((option, i) => {
                                          return (
                                            <Option value={option.name} key={"identityType " + i} >{option.description}</Option>
                                          )
                                        })
                                        : null
                                    }
                                  </Select>
                                  <div className="input-feedback">{touched.religion && errors.religion}</div>

                                  <label className="mt-3" htmlFor="mobileNo">
                                    Mobile No. <span className="red"> *</span>
                                  </label>
                                  <Input
                                    name="mobileNo"
                                    className={
                                      touched.mobileNo && errors.mobileNo
                                        ? "input-font-size input-error"
                                        : "input-font-size"
                                    }
                                    type="text"
                                    id="mobileNo"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="contoh: 08123456789"
                                    value={values.mobileNo}
                                  />
                                  <div className="input-feedback">{touched.mobileNo && errors.mobileNo}</div>

                                  <label className="mt-3" htmlFor="externalID">External ID</label>
                                  <Input
                                    name="externalID"
                                    className="input-font-size"
                                    type="text"
                                    id="externalID"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="contoh: 123456789"
                                    value={values.externalID}
                                  />

                                  <label className="mt-3" htmlFor="nickname">Alias</label>
                                  <Input
                                    name="nickname"
                                    className="input-font-size"
                                    type="text"
                                    id="nickname"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="contoh: Ikkat"
                                    value={values.nickname}
                                  />

                                  <label className="mt-3" htmlFor="identityValidDate">
                                    Identity Valid Date
                                </label>
                                  <Field name="identityValidDate" onChange={handleChange} component={ValidDate}
                                    locale={this.props.dashboard.language} value={values.identityValidDate}
                                  />

                                  <label className="mt-3" htmlFor="email">Email</label>
                                  <Input
                                    name="email"
                                    className={
                                      touched.email && errors.email
                                        ? "input-font-size input-error"
                                        : "input-font-size"
                                    }
                                    type="email"
                                    id="email"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.email}
                                    placeholder="contoh: simpool@ikkat.com"
                                  />
                                  <div className="input-feedback">{touched.email && errors.email}</div>

                                  <label className="mt-3" htmlFor="mobileUser">
                                    Mobile Username
                                </label>
                                  <Input
                                    name="mobileUser"
                                    className="input-font-size"
                                    type="text"
                                    id="mobileUser"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.mobileUser}
                                    placeholder="contoh: simpool"
                                  />
                                </div>

                                <div className="col-md-6">
                                  <label className="mt-3" htmlFor="submittedOnDate">
                                    Submitted On Date <span className="red"> *</span>
                                  </label>
                                  <Field
                                    name="submittedOnDate"
                                    onChange={handleChange}
                                    component={DateTime}
                                    locale={this.props.dashboard.language}
                                    value={values.submittedOnDate}
                                    error={errors.submittedOnDate}
                                    touched={touched.submittedOnDate}
                                    dateParam={state.today}
                                  />
                                  <div className="input-feedback">{touched.submittedOnDate && errors.submittedOnDate}</div>

                                  <label className="mt-3" htmlFor="sectorId">
                                    Sector <span className="red"> *</span>
                                  </label>
                                  <Select
                                    value={values.sectorId}
                                    className={
                                      touched.sectorId && errors.sectorId
                                        ? "col-12 input-error"
                                        : "col-12"
                                    }
                                    name="sectorId"
                                    onChange={val => setFieldValue("sectorId", val)}
                                    onBlur={val => setFieldTouched("sectorId", val)}
                                    showSearch
                                    filterOption={(input, option) =>
                                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    size="large"
                                  >
                                    <Option value="">Pilih Sector</Option>
                                    {
                                      Array.isArray(addValidation.sectorOptions) && addValidation.sectorOptions.length > 0
                                        ? addValidation.sectorOptions.map((option, i) => {
                                          return (
                                            <Option value={option.code} key={"identityType " + i} >{option.name}</Option>
                                          )
                                        })
                                        : null
                                    }
                                  </Select>
                                  <div className="input-feedback">{touched.sectorId && errors.sectorId}</div>

                                  <label className="mt-3" htmlFor="taxNumber">
                                    Tax Number <span className="red"> *</span>
                                  </label>
                                  <Input
                                    name="taxNumber"
                                    className={
                                      touched.taxNumber && errors.taxNumber
                                        ? "input-font-size input-error"
                                        : "input-font-size"
                                    }
                                    type="text"
                                    id="taxNumber"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="contoh: 123456789"
                                    value={values.taxNumber}
                                  />
                                  <div className="input-feedback">{touched.taxNumber && errors.taxNumber}</div>

                                  <label className="mt-3" htmlFor="taxName">
                                    Name Based on Tax <span className="red"> *</span>
                                  </label>
                                  <Input
                                    name="taxName"
                                    className={
                                      touched.taxName && errors.taxName
                                        ? "input-font-size input-error"
                                        : "input-font-size"
                                    }
                                    type="text"
                                    id="taxName"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.taxName}
                                    placeholder="contoh: simpool"
                                  />
                                  <div className="input-feedback">{touched.taxName && errors.taxName}</div>

                                  <label className="mt-3" htmlFor="taxName">
                                    Address Based on Tax <span className="red"> *</span>
                                  </label>
                                  <Input
                                    name="taxAddress"
                                    className={
                                      touched.taxAddress && errors.taxAddress
                                        ? "input-font-size input-error"
                                        : "input-font-size"
                                    }
                                    type="text"
                                    id="taxAddress"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.taxAddress}
                                    placeholder="contoh: Jl. Gading Serpong"
                                  />
                                  <div className="input-feedback">{touched.taxAddress && errors.taxAddress}</div>

                                  <label className="mt-3" htmlFor="flagTaxCodeValue">
                                    Flag Tax <span className="red"> *</span>
                                  </label>
                                  <Select
                                    value={values.flagTaxCodeValue}
                                    className={
                                      touched.flagTaxCodeValue && errors.flagTaxCodeValue
                                        ? "col-12 input-error"
                                        : "col-12"
                                    }
                                    name="flagTaxCodeValue"
                                    onChange={val => setFieldValue("flagTaxCodeValue", val)}
                                    onBlur={val => setFieldTouched("flagTaxCodeValue", val)}
                                    showSearch
                                    filterOption={(input, option) =>
                                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    size="large"
                                  >
                                    <Option value="">Pilih Flag Tax</Option>
                                    {
                                      Array.isArray(addValidation.flagTaxOptions) && addValidation.flagTaxOptions.length > 0
                                        ? addValidation.flagTaxOptions.map((option, i) => {
                                          return (
                                            <Option value={option.name} key={"Flag Tax  " + i} >{option.description}</Option>
                                          )
                                        })
                                        : null
                                    }
                                  </Select>
                                  <div className="input-feedback">{touched.flagTaxCodeValue && errors.flagTaxCodeValue}</div>

                                  <label className="mt-3" htmlFor="staffId">
                                    Staff
                                </label>
                                  <Select
                                    value={values.staffId}
                                    className={
                                      touched.staffId && errors.staffId
                                        ? "col-12 input-error"
                                        : "col-12"
                                    }
                                    name="staffId"
                                    onChange={val => setFieldValue("staffId", val)}
                                    onBlur={val => setFieldTouched("staffId", val)}
                                    showSearch
                                    filterOption={(input, option) =>
                                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    size="large"
                                  >
                                    <Option value="">Pilih Staff</Option>
                                    {
                                      Array.isArray(addValidation.staffOptions) && addValidation.staffOptions.length > 0
                                        ? addValidation.staffOptions.map((option, i) => {
                                          return (
                                            <Option value={option.id} key={"identityType " + i} >{option.displayName}</Option>
                                          )
                                        })
                                        : null
                                    }
                                  </Select>

                                  <label className="mt-3" htmlFor="nip">
                                    Working ID Number
                                </label>
                                  <Input
                                    name="nip"
                                    className={
                                      touched.nip && errors.nip
                                        ? "input-font-size input-error"
                                        : "input-font-size"
                                    }
                                    type="text"
                                    id="nip"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.nip}
                                    placeholder="contoh: 123456789"
                                  />
                                  <div className="input-feedback">{touched.nip && errors.nip}</div>

                                  <CustomInput
                                    type="checkbox"
                                    id="active"
                                    className="mt-3"
                                    name="active"
                                    checked={values.active}
                                    label="Active"
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>

                              <div className="d-flex justify-content-end">
                                <button
                                  className="btn btn-primary mt-4 col-3 col-md-2"
                                  type="submit"
                                  onClick={e => submitFormDuplicate(e)}
                                >
                                  Lanjutkan
                              </button>
                              </div>
                            </form>
                          )
                        }
                      </Formik>
                    )
                    : null
                }
              </TabPane>

              <TabPane id="tabPane2" tabId="2">
                <Formik
                  initialValues={{
                    addressBasedOnIdentity: addValidation.addressBasedOnIdentity,
                    identityCityId: addValidation.identityCityId,
                    identityCountryCodeValue: addValidation.identityCountryCodeValue,
                    identityPostalCode: addValidation.identityPostalCode,
                    identityProvinceId: addValidation.identityProvinceId,
                    identitySubDistrict: addValidation.identitySubDistrict,
                    identityVillage: addValidation.identityVillage,
                    identityRt: addValidation.identityRt,
                    identityRw: addValidation.identityRw,

                    address: addValidation.address,
                    cityId: addValidation.cityId,
                    countryCodeValue: addValidation.countryCodeValue,
                    postalCode: addValidation.postalCode,
                    provinceId: addValidation.provinceId,
                    subDistrict: addValidation.subDistrict,
                    village: addValidation.village,
                    rt: addValidation.rt,
                    rw: addValidation.rw
                  }}
                  validate={values => {
                    const errors = {};

                    if (!values.addressBasedOnIdentity) {
                      errors.addressBasedOnIdentity = <Trans i18nKey='forms.REQUIRED' />
                    }

                    if (!values.identityCountryCodeValue) {
                      errors.identityCountryCodeValue = <Trans i18nKey='forms.REQUIRED' />
                    }

                    if (!values.identityProvinceId) {
                      errors.identityProvinceId = <Trans i18nKey='forms.REQUIRED' />
                    }

                    if (!values.identityCityId) {
                      errors.identityCityId = <Trans i18nKey='forms.REQUIRED' />
                    }

                    if (!values.identitySubDistrict) {
                      errors.identitySubDistrict = <Trans i18nKey='forms.REQUIRED' />
                    }

                    if (!values.identityVillage) {
                      errors.identityVillage = <Trans i18nKey='forms.REQUIRED' />
                    }

                    if (/^(0|[1-9]\d*)$/.test(values.identityPostalCode) === false && values.identityPostalCode !== "") {
                      errors.identityPostalCode = "Postal Code harus berisi angka"
                    } else if (values.identityPostalCode.length !== 5 && values.identityPostalCode !== "") {
                      errors.identityPostalCode = "Postal Code harus berisi 5 angka"
                    }
                    if (!values.identityPostalCode) {
                      errors.identityPostalCode = "Postal Code harus diisi"
                    }


                    if (values.addressBasedOnIdentity) {
                      this.changeAddValidation("addressBasedOnIdentity", values.addressBasedOnIdentity)
                    }
                    if (values.identityCountryCodeValue) {
                      this.changeAddValidation("identityCountryCodeValue", values.identityCountryCodeValue)
                    }
                    if (values.identityProvinceId) {
                      let identityCityOptionsFilter = [];
                      this.state.addValidation.identityCityOptionsFilter.map(row => {
                        if (row.provinceId === values.identityProvinceId) {
                          identityCityOptionsFilter.push(row)
                        }

                        return null
                      })
                      this.changeAddValidation("identityCityOptionsFilter", identityCityOptionsFilter)
                      this.changeAddValidation("identityProvinceId", values.identityProvinceId)
                    }
                    if (values.identityCityId) {
                      this.changeAddValidation("identityCityId", values.identityCityId)
                    }
                    if (values.identitySubDistrict) {
                      this.changeAddValidation("identitySubDistrict", values.identitySubDistrict)
                    }
                    if (values.identityVillage) {
                      this.changeAddValidation("identityVillage", values.identityVillage)
                    }
                    if (values.identityPostalCode) {
                      this.changeAddValidation("identityPostalCode", values.identityPostalCode)
                    }
                    if (values.identityRt) {
                      this.changeAddValidation("identityRt", values.identityRt)
                    }
                    if (values.identityRw) {
                      this.changeAddValidation("identityRw", values.identityRw)
                    }

                    if (values.provinceId) {
                      let cityOptionsFilter = [];
                      this.state.addValidation.cityOptionsFilter.map(row => {
                        if (row.provinceId === values.provinceId) {
                          cityOptionsFilter.push(row)
                        }

                        return null
                      })
                      this.changeAddValidation("cityOptionsFilter", cityOptionsFilter)
                    }

                    return errors;
                  }}
                  enableReinitialize="true"
                  onSubmit={values => {
                    this.setState({
                      tab2Pass: true
                    })
                    this.toggleStep('3')
                  }}
                >
                  {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    setFieldTouched,
                    setFieldValue,
                  }) => (
                      <form className="mt-5 row" onSubmit={handleSubmit} name="tab2">
                        <div className="col-md-6">
                          <p className="lead text-center">Identitas</p>

                          <label className="mt-3" htmlFor="addressBasedOnIdentity">
                            Alamat Sesuai Identitas <span className="red"> *</span>
                          </label>
                          <textarea
                            rows="4"
                            name="addressBasedOnIdentity"
                            className={
                              touched.addressBasedOnIdentity && errors.addressBasedOnIdentity
                                ? "form-control form-font-size input-error"
                                : "form-control form-font-size"
                            }
                            type="text"
                            onChange={handleChange}
                            placeholder="contoh: One PM, Gading Serpong, Tangerang"
                            value={values.addressBasedOnIdentity}
                          />
                          <div className="input-feedback">{touched.addressBasedOnIdentity && errors.addressBasedOnIdentity}</div>

                          <label className="mt-3" htmlFor="identityCountryCodeValue">
                            Negara <span className="red"> *</span>
                          </label>
                          <Select
                            value={values.identityCountryCodeValue}
                            className={
                              touched.identityCountryCodeValue && errors.identityCountryCodeValue
                                ? "col-12 input-error"
                                : "col-12"
                            }
                            name="identityCountryCodeValue"
                            onChange={val => setFieldValue("identityCountryCodeValue", val)}
                            onBlur={val => setFieldTouched("identityCountryCodeValue", val)}
                            showSearch
                            filterOption={(input, option) =>
                              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            size="large"
                          >
                            <Option value="">Pilih negara!</Option>
                            {
                              Array.isArray(this.state.addValidation.countryOptions) && this.state.addValidation.countryOptions.length > 0
                                ? this.state.addValidation.countryOptions.map((option, i) => {
                                  return (
                                    <Option value={option.code} key={"country " + i} >{option.description}</Option>
                                  )
                                })
                                : null
                            }
                          </Select>
                          <div className="input-feedback">{touched.identityCountryCodeValue && errors.identityCountryCodeValue}</div>

                          <label className="mt-3" htmlFor="identityProvinceId">
                            Provinsi <span className="red"> *</span>
                          </label>
                          <Select
                            value={values.identityProvinceId}
                            className={
                              touched.identityProvinceId && errors.identityProvinceId
                                ? "col-12 input-error"
                                : "col-12"
                            }
                            name="identityProvinceId"
                            onChange={val => setFieldValue("identityProvinceId", val)}
                            onBlur={val => setFieldTouched("identityProvinceId", val)}
                            showSearch
                            filterOption={(input, option) =>
                              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            size="large"
                          >
                            <Option value="">Pilih provinsi!</Option>
                            {
                              Array.isArray(this.state.addValidation.provinceOptions) && this.state.addValidation.provinceOptions.length > 0
                                ? this.state.addValidation.provinceOptions.map((option, i) => {
                                  return (
                                    <Option value={option.code} key={"province " + i} >{option.description}</Option>
                                  )
                                })
                                : null
                            }
                          </Select>
                          <div className="input-feedback">{touched.identityProvinceId && errors.identityProvinceId}</div>

                          <label className="mt-3" htmlFor="identityCityId">
                            Kabupaten / Kota <span className="red"> *</span>
                          </label>
                          <Select
                            value={values.identityCityId}
                            className={
                              touched.identityCityId && errors.identityCityId
                                ? "col-12 input-error"
                                : "col-12"
                            }
                            name="identityCityId"
                            onChange={val => setFieldValue("identityCityId", val)}
                            onBlur={val => setFieldTouched("identityCityId", val)}
                            showSearch
                            filterOption={(input, option) =>
                              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            size="large"
                          >
                            <Option value="">Pilih kota!</Option>
                            {
                              Array.isArray(this.state.addValidation.identityCityOptionsFilter) && this.state.addValidation.identityCityOptionsFilter.length > 0
                                ? this.state.addValidation.identityCityOptionsFilter.map((option, i) => {
                                  return (
                                    <Option value={option.code} key={"city " + i} >{option.description}</Option>
                                  )
                                })
                                : null
                            }
                          </Select>
                          <div className="input-feedback">{touched.identityCityId && errors.identityCityId}</div>

                          <label className="mt-3" htmlFor="identitySubDistrict">
                            Kecamatan <span className="red"> *</span>
                          </label>
                          <Input
                            name="identitySubDistrict"
                            className={
                              touched.identitySubDistrict && errors.identitySubDistrict
                                ? "input-font-size input-error"
                                : "input-font-size"
                            }
                            type="text"
                            id="identitySubDistrict"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="contoh: Mulyorejo"
                            value={values.identitySubDistrict}
                          />
                          <div className="input-feedback">{touched.identitySubDistrict && errors.identitySubDistrict}</div>

                          <label className="mt-3" htmlFor="identityPostalCode">
                            Kode Pos <span className="red"> *</span>
                          </label>
                          <Input
                            name="identityPostalCode"
                            className={
                              touched.identityPostalCode && errors.identityPostalCode
                                ? "input-font-size input-error"
                                : "input-font-size"
                            }
                            type="text"
                            id="identityPostalCode"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="contoh: 12345"
                            value={values.identityPostalCode}
                          />
                          <div className="input-feedback">{touched.identityPostalCode && errors.identityPostalCode}</div>

                          <label className="mt-3" htmlFor="identityVillage">
                            Kelurahan / Desa <span className="red"> *</span>
                          </label>
                          <Input
                            name="identityVillage"
                            className={
                              touched.identityVillage && errors.identityVillage
                                ? "input-font-size input-error"
                                : "input-font-size"
                            }
                            type="text"
                            id="identityVillage"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="contoh: Mulyosari"
                            value={values.identityVillage}
                          />
                          <div className="input-feedback">{touched.identityVillage && errors.identityVillage}</div>

                          <div className="row">
                            <div className="col-6">
                              <label className="mt-3" htmlFor="identityRt">
                                RT
                            </label>
                              <Input
                                name="identityRt"
                                className="input-font-size"
                                type="text"
                                id="identityRt"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="contoh: 1"
                                value={values.identityRt}
                              />
                            </div>
                            <div className="col-6">
                              <label className="mt-3" htmlFor="identityRw">
                                RW
                            </label>
                              <Input
                                name="identityRw"
                                className="input-font-size"
                                type="text"
                                id="identityRw"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="contoh: 1"
                                value={values.identityRw}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <p className="lead text-center">ZZZ Domisili</p>

                          <label className="mt-3" htmlFor="address">
                            Alamat Sesuai Domisili
                          </label>
                          <textarea
                            rows="4"
                            name="address"
                            className={
                              touched.address && errors.address
                                ? "form-control form-font-size input-error"
                                : "form-control form-font-size"
                            }
                            type="text"
                            onChange={handleChange}
                            placeholder="contoh: One PM, Gading Serpong, Tangerang"
                            value={values.address}
                          />
                          <div className="input-feedback">{touched.address && errors.address}</div>

                          <label className="mt-3" htmlFor="countryCodeValue">
                            Negara
                        </label>
                          <Select
                            value={values.countryCodeValue}
                            className={
                              touched.countryCodeValue && errors.countryCodeValue
                                ? "col-12 input-error"
                                : "col-12"
                            }
                            name="countryCodeValue"
                            onChange={val => setFieldValue("countryCodeValue", val)}
                            onBlur={val => setFieldTouched("countryCodeValue", val)}
                            showSearch
                            filterOption={(input, option) =>
                              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            size="large"
                          >
                            <Option value="">Pilih negara!</Option>
                            {
                              Array.isArray(this.state.addValidation.countryOptions) && this.state.addValidation.countryOptions.length > 0
                                ? this.state.addValidation.countryOptions.map((option, i) => {
                                  return (
                                    <Option value={option.code} key={"country " + i} >{option.description}</Option>
                                  )
                                })
                                : null
                            }
                          </Select>
                          <div className="input-feedback">{touched.countryCodeValue && errors.countryCodeValue}</div>

                          <label className="mt-3" htmlFor="provinceId">
                            Provinsi
                        </label>
                          <Select
                            value={values.provinceId}
                            className={
                              touched.provinceId && errors.provinceId
                                ? "col-12 input-error"
                                : "col-12"
                            }
                            name="provinceId"
                            onChange={val => setFieldValue("provinceId", val)}
                            onBlur={val => setFieldTouched("provinceId", val)}
                            showSearch
                            filterOption={(input, option) =>
                              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            size="large"
                          >
                            <Option value="">Pilih provinsi!</Option>
                            {
                              Array.isArray(this.state.addValidation.provinceOptions) && this.state.addValidation.provinceOptions.length > 0
                                ? this.state.addValidation.provinceOptions.map((option, i) => {
                                  return (
                                    <Option value={option.code} key={"province " + i} >{option.description}</Option>
                                  )
                                })
                                : null
                            }
                          </Select>
                          <div className="input-feedback">{touched.provinceId && errors.provinceId}</div>

                          <label className="mt-3" htmlFor="cityId">
                            Kabupaten / Kota
                        </label>
                            <Select
                              value={values.cityId}
                              className={
                                touched.cityId && errors.cityId
                                  ? "col-12 input-error"
                                  : "col-12"
                              }
                              name="cityId"
                              onChange={val => setFieldValue("cityId", val)}
                              onBlur={val => setFieldTouched("cityId", val)}
                              showSearch
                              filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                              }
                              size="large"
                            >
                            <Option value="">Pilih kota!</Option>
                            {
                              Array.isArray(this.state.addValidation.cityOptionsFilter) && this.state.addValidation.cityOptionsFilter.length > 0
                                ? this.state.addValidation.cityOptionsFilter.map((option, i) => {
                                  return (
                                    <Option value={option.code} key={"city " + i} >{option.description}</Option>
                                  )
                                })
                                : null
                            }
                          </Select>
                          <div className="input-feedback">{touched.cityId && errors.cityId}</div>

                          <label className="mt-3" htmlFor="subDistrict">
                            Kecamatan
                          </label>
                          <Input
                            name="subDistrict"
                            className={
                              touched.subDistrict && errors.subDistrict
                                ? "input-font-size input-error"
                                : "input-font-size"
                            }
                            type="text"
                            id="subDistrict"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="contoh: Mulyorejo"
                            value={values.subDistrict}
                          />
                          <div className="input-feedback">{touched.subDistrict && errors.subDistrict}</div>

                          <label className="mt-3" htmlFor="village">
                            Kelurahan / Desa
                        </label>
                          <Input
                            name="village"
                            className={
                              touched.village && errors.village
                                ? "input-font-size input-error"
                                : "input-font-size"
                            }
                            type="text"
                            id="village"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="contoh: Mulyosari"
                            value={values.village}
                          />
                          <div className="input-feedback">{touched.village && errors.village}</div>

                          <label className="mt-3" htmlFor="postalCode">
                            Kode Pos
                        </label>
                          <Input
                            name="postalCode"
                            className={
                              touched.postalCode && errors.postalCode
                                ? "input-font-size input-error"
                                : "input-font-size"
                            }
                            type="text"
                            id="postalCode"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="contoh: 12345"
                            value={values.postalCode}
                          />
                          <div className="input-feedback">{touched.postalCode && errors.postalCode}</div>

                          <div className="row">
                            <div className="col-6">
                              <label className="mt-3" htmlFor="rt">
                                RT
                            </label>
                              <Input
                                name="rt"
                                className="input-font-size"
                                type="text"
                                id="rt"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="contoh: 1"
                                value={values.rt}
                              />
                            </div>
                            <div className="col-6">
                              <label className="mt-3" htmlFor="rw">
                                RW
                            </label>
                              <Input
                                name="rw"
                                className="input-font-size"
                                type="text"
                                id="rw"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="contoh: 1"
                                value={values.rw}
                              />
                            </div>
                          </div>
                        </div>

                        <hr />
                        <div className="mt-4 col-12 d-flex justify-content-between">
                          <Button color="primary col-3 col-md-2" onClick={() => this.toggleStep('1')} outline>
                            Sebelumnya
                        </Button>
                          <Button
                            className="col-3 col-md-2"
                            color="primary"
                            type="submit"
                          >
                            Lanjutkan
                        </Button>
                        </div>
                      </form>
                    )}
                </Formik>
              </TabPane>


              <TabPane id="tabPane3" tabId="3">
                <div className="pt-3 mb-3">
                  <fieldset>
                    <Container className="container-md">
                      <p className="lead text-center">Upload Foto</p>
                      <DragDrop name="selfiePhoto" setPhotos={this.setPhotos} />
                    </Container>

                    <Container className="container-md mt-3">
                      <p className="lead text-center">Upload KTP</p>
                      <DragDrop name="idCardPhoto" setPhotos={this.setPhotos} />
                    </Container>

                    <Container className="container-md mt-3">
                      <p className="lead text-center">Upload NPWP</p>
                      <DragDrop name="npwpPhoto" setPhotos={this.setPhotos} />
                    </Container>

                    <Container className="container-md mt-3">
                      <p className="lead text-center">Upload Dokumen Lain</p>
                      <DragDropMultiple name="otherDocuments" setPhotos={this.setPhotos} />
                    </Container>
                  </fieldset>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <Button className="ml-auto mr-3 col-3 col-md-2" color="secondary" onClick={() => this.toggleStep('2')}>
                    Sebelumnya
                  </Button>
                  <Button color="primary col-3 col-md-2" type="submit" onClick={() => this.finishForm()}>
                    Finish
                  </Button>
                </div>
              </TabPane>
            </TabContent>
          </CardBody>
        </Card>
      </ContentWrapper>
    );
  }
}

MemberDataAdd.propTypes = {
  actions: PropTypes.object,
  auth: PropTypes.object,
  dashboard: PropTypes.object,
  memberData: PropTypes.object,
  search: PropTypes.object,
  settings: PropTypes.object
}

const mapStateToProps = state => ({
  auth: state.auth,
  dashboard: state.dashboard,
  memberData: state.memberData,
  search: state.search,
  settings: state.settings
})
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) })

export default compose(connect(mapStateToProps, mapDispatchToProps), withTranslation('translations'))(withRouter(MemberDataAdd));