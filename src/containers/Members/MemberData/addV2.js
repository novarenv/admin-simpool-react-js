import React, { Component } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Form,
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

import * as actions from '../../../store/actions/actions';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';

import ContentWrapper from '../../../components/Layout/ContentWrapper';

// DateTimePicker
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';

const stepNavitemStyle = {
  backgroundColor: '#fcfcfc'
};

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

const COLUMN_WIDTH = 250;

const BirthDate = ({ field, form, locale, tabIndex }) => {
  const onFieldChange = value => {
    form.setFieldValue(field.name, value);
  }

  return (
    <Datetime
      inputProps={{
        name: "birthdate",
        className: "form-control input-font-size dt-bg",
        id: "birthdate",
        placeholder: "dd mmmm yyyy",
        autoComplete: "off",
        required: true,
        readOnly: true,
        tabIndex: tabIndex
      }}
      dateFormat="DD MMMM YYYY"
      timeFormat={false}
      closeOnSelect={true}
      locale={locale}
      onChange={onFieldChange}
    />
  );
}

const DragDrop = props => {
  const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
    useDropzone({
      multiple: false,
      onDrop: acceptedFiles => {
        props.setPhotos(props.name, acceptedFiles[0])
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
    <Container className="container-md mt-3">
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
  const { acceptedFiles, getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: acceptedFiles => {
      props.setPhotos(props.name, acceptedFiles)
      acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      }));
    }
  });

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
    <Container className="container-md mt-3">
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

    this.state = {
      showNotDuplicate: false,
      privateIdentity: false,
      formValidateDuplicate: false,
      totalFilteredRecords: false,
      pageItems: [],
      today: '',
      activeStep: '1',
      files: [],

      rows: [],
      rowIdx: '',

      /* Group each form state in an object.
         Property name MUST match the form name */
      addValidation: {
        registrationDate: '',
        legalFormId: '1',
        membership: '',
        typeOfIdentityId: 'default',
        identityTypeOptions: [],
        fullname: '',
        placeOfBirth: '',
        addressBasedOnIdentity: '',
        identityNumber: '',
        motherName: '',

        officeId: '',
        birthdate: '',
        NPWP: '',
        oldMemberNumber: '',
        religion: '',
        religionOptions: [],
        gender: '',
        mobileNo: '',
        email: '',


        identityProvinceId: 'default',
        provinceOptions: [],
        identityCityId: 'default',
        cityOptions: [],
        cityOptionsFilter: [],
        identityPostalCode: '',
        addressDomicile: '',
        cityDomicile: '',
        zipCodeDomicile: '',


        selfiePhoto: {},
        idCardPhoto: {},
        npwpPhoto: {},
        otherDocuments: []
      }
    };

    this.props.actions.clientTemplate({}, this.setClientTemplate)
  }

  componentDidMount() {
    const dd = String(new Date().getDate()).padStart(2, '0')
    const mmmm = MONTHS_ID[new Date().getMonth()]
    const yyyy = new Date().getFullYear()

    const today = dd + ' ' + mmmm + ' ' + yyyy
    this.setState({
      today: today
    })
  }

  setClientTemplate = res => {
    let identityTypeOptions = [];
    res.typeOfIdentityOptions.map(row => {
      identityTypeOptions.push(row)
    })
    this.setState(prevState =>
      ({
        addValidation: {
          ...prevState.addValidation,
          identityTypeOptions: identityTypeOptions
        }
      })
    )

    let religionOptions = [];
    res.religionOption.map(row => {
      religionOptions.push(row)
    })
    this.setState(prevState =>
      ({
        addValidation: {
          ...prevState.addValidation,
          religionOptions: religionOptions
        }
      })
    )

    let provinceOptions = [];
    res.provinceOptions.map(row => {
      provinceOptions.push(row)
    })
    this.setState(prevState =>
      ({
        addValidation: {
          ...prevState.addValidation,
          provinceOptions: provinceOptions
        }
      })
    )

    let cityOptions = [];
    res.cityOptions.map(row => {
      cityOptions.push(row)
    })
    this.setState(prevState =>
      ({
        addValidation: {
          ...prevState.addValidation,
          cityOptions: cityOptions
        }
      })
    )
    this.setState(prevState =>
      ({
        addValidation: {
          ...prevState.addValidation,
          cityOptionsFilter: cityOptions
        }
      })
    )
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
      }
    }

    this.props.actions.checkDuplicate(
      {
        fullname: addValidation.fullname,
        dateOfBirth: addValidation.birthdate,
        addressBasedOnIdentity: addValidation.addressBasedOnIdentity,
        motherName: addValidation.motherName,
        typeOfIdentityId: addValidation.typeOfIdentityId,
        identityNumber: addValidation.identityNumber
      },
      checkTotalFilter
    )

    this.setState({
      showNotDuplicate: true,
      privateIdentity: false
    });
  }

  ShowNotDuplicate = () => {
    const setNotDuplicate = () => {
      this.setState({
        showNotDuplicate: false,
        privateIdentity: true
      });
    }

    if (this.state.totalFilteredRecords > 0) {
      return (
        <div>
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
                  <div className="row row-mx-0 ft-detail list-detail d-flex justify-content-center list-hover center-parent"
                  // onClick={() => rowClicked()}
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
          <Button outline color="primary" className="btn btn-block mt-4 justify-content-center"
            onClick={() => setNotDuplicate()}>Create Member</Button>
        </div>
      )
    } else {
      return (
        <div>
          <Button disabled className="col-12">Tidak ada data yang sama!</Button>
          <Button outline color="primary" className="btn btn-block mt-4 justify-content-center"
            onClick={() => setNotDuplicate()}>Create Member</Button>
        </div>
      )
    }
  }

  PrivateIdentity = () => {
    return (
      <div>
        <label className="mt-3" htmlFor="placeOfBirth">Tempat Lahir</label>
        <Input
          name="placeOfBirth"
          className="input-font-size"
          type="text"
          id="placeOfBirth"
          onChange={this.validateOnChange}
          placeholder="contoh: Tangerang"
          value={this.state.addValidation.placeOfBirth}
        />

        <label className="mt-3" htmlFor="gender">Jenis Kelamin</label>
        <div className="py-2">
          <label className="c-radio">
            <Input id="man" type="radio" name="gender" className="input-font-size"
              value="M" onChange={e => this.changeGender(e.target.value)}
            />
            <span className="fa fa-circle" />
            Laki-laki
          </label>
          <label className="c-radio">
            <Input id="woman" type="radio" name="gender" className="input-font-size"
              value="F" onChange={e => this.changeGender(e.target.value)}
            />
            <span className="fa fa-circle" />
            Perempuan
            </label>
        </div>

        <label className="mt-3" htmlFor="NPWP">NPWP</label>
        <Input
          name="NPWP"
          className="input-font-size"
          type="text"
          id="NPWP"
          onChange={this.validateOnChange}
          placeholder="101001002"
          value={this.state.addValidation.NPWP}
        />

        <label className="mt-3" htmlFor="oldMemberNumber">No. Anggota Lama</label>
        <Input
          name="oldMemberNumber"
          className="input-font-size"
          type="text"
          id="oldMemberNumber"
          onChange={this.validateOnChange}
          placeholder="contoh: 123456789"
          value={this.state.addValidation.oldMemberNumber}
        />

        <label className="mt-3" htmlFor="marriageStatus">Status Pernikahan</label>
        <select defaultValue="" className="custom-select custom-select-sm input-font-size" name="marriageStatus" required>
          <option>Status Pernikahan</option>
          <option defaultValue="married">Menikah</option>
          <option defaultValue="single">Lajang</option>
        </select>

        <label className="mt-3" htmlFor="religion">Agama</label>
        <select value={this.state.addValidation.religion}
          className="custom-select custom-select-sm input-font-size" name="religion"
          onChange={e => this.changeReligion(e.target.value)}>
          <option value="default">Pilih agama anda</option>
          {
            this.state.addValidation.religionOptions.map((option, i) => {
              return (
                <option value={option.name} key={"identityType " + i} >{option.description}</option>
              )
            })
          }
        </select>

        <label className="mt-3" htmlFor="mobileNo">Nomor Telpon</label>
        <Input
          name="mobileNo"
          className="input-font-size"
          type="text"
          id="mobileNo"
          onChange={this.validateOnChange}
          placeholder="contoh: 123456789"
          value={this.state.addValidation.mobileNo}
        />

        <label className="mt-3" htmlFor="email">Email</label>
        <Input
          name="email"
          className="input-font-size"
          type="email"
          id="email"
          onChange={this.validateOnChange}
          value={this.state.addValidation.email}
          placeholder="contoh: simpool@ikkat.com" />

        <div>
          <div className="d-flex">
            {/*<Button color="secondary">Previous</Button>*/}
            <Button
              className="ml-auto"
              color="primary"
              onClick={this.toggleStep('2')}
              type="submit"
            >
              Lanjutkan
            </Button>
          </div>
        </div>
      </div>
    )
  }

  toggleStep = activeStep => () => {
    if (this.state.activeStep !== activeStep) {
      this.setState({
        activeStep
      });
    }
  };

  handleInputChange = event => {
    const target = event.currentTarget;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  };

  handleDate = e => {
    let dd = String(e.toDate().getDate()).padStart(2, '0')
    let mm = MONTHS_ID[e.toDate().getMonth()]
    let yyyy = e.toDate().getFullYear()

    let date = dd + " " + mm + " " + yyyy

    this.setState({
      addValidation: {
        ...this.state.addValidation,
        birthdate: date
      }
    })
  }

  // Keep a reference to the form to access from the steps methods
  formRef = node => (this.formWizardRef = node);

  renderInputGroup = props => {
    return (
      <div className="input-group date">
        <input className="form-control" {...props} />
        <span className="input-group-append input-group-addon">
          <span className="input-group-text fas fa-calendar-alt"></span>
        </span>
      </div>
    )
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

  changeReligion = val => {
    this.setState(prevState =>
      ({
        addValidation: {
          ...prevState.addValidation,
          religion: val
        }
      })
    )
  }

  changeGender = val => {
    this.setState(prevState =>
      ({
        addValidation: {
          ...prevState.addValidation,
          gender: val
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

  changeCity = val => {
    console.log(val)
    this.setState(prevState =>
      ({
        addValidation: {
          ...prevState.addValidation,
          identityCityId: val
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
    })

    const setClientAddRes = res => {
      this.props.actions.clientAddImage(clientImage, res)

      this.props.actions.clientAddDocument(clientIdCard, res)

      this.props.actions.clientAddDocument(clientNpwp, res)

      clientOtherDocs.map(doc => {
        this.props.actions.clientAddDocument(doc, res)
      })
    }

    this.props.actions.clientAdd({
      legalFormId: 1,
      officeId: 1,
      flagTaxCodeValue: "Y",
      fullname: addValidation.fullname,
      typeOfIdentityId: addValidation.typeOfIdentityId,
      motherName: addValidation.motherName,
      addressBasedOnIdentity: addValidation.addressBasedOnIdentity,
      taxNumber: addValidation.NPWP,
      identityNumber: addValidation.identityNumber,
      sectorId: 1000,
      identityCountryCodeValue: "IDN",
      identityProvinceId: addValidation.identityProvinceId,
      identityCityId: addValidation.identityCityId,
      identitySubDistrict: "novarenu",
      identityVillage: "novarenu",
      identityPostalCode: addValidation.identityPostalCode,
      placeOfBirth: addValidation.placeOfBirth,
      genderCodeValue: addValidation.gender,
      mobileNo: addValidation.mobileNo,
      phoneNumber: "0310000000022",
      religion: addValidation.religion,
      taxName: "novarenu",
      taxAddress: "novarenu",
      submittedOnDate: state.today,
      dateOfBirth: addValidation.birthdate,

      clientNonPersonDetails: {
        locale: "id",
        dateFormat: "dd MMMM yyyy"
      },
      locale: "id",
      active: false,
      dateFormat: "dd MMMM yyyy",
      activationDate: state.today,
      savingsProductId: null
    },
      setClientAddRes
    )
  }

  render() {
    const state = this.state
    const addValidation = state.addValidation

    return (
      <ContentWrapper>
        <div className="content-heading">
          <div>Anggota Baru V2</div>
        </div>

        <Card className="card-default">
          <CardHeader>
            <div>{this.state.today} | Kantor Pelayanan</div>
          </CardHeader>

          <CardBody>
            <div>
              <Link to="/simpool/member/data">
                <Button className="btn col-4 col-lg-2 mb-4 justify-content-center" color="primary" outline>Kembali</Button>
              </Link>
            </div>
            <Nav pills justified={true}>
              <NavItem style={stepNavitemStyle}>
                <NavLink
                  tag="div"
                  className={classnames({
                    active: this.state.activeStep === '1'
                  })}
                  onClick={this.toggleStep('1')}
                >
                  <h4 className="text-left my-4">
                    1. Identitas Pribadi
                    <br />
                    <small>Identitas Anggota yang ingin dimasukkan</small>
                  </h4>
                </NavLink>
              </NavItem>
              <NavItem style={stepNavitemStyle}>
                <NavLink
                  tag="div"
                  className={classnames({
                    active: this.state.activeStep === '2'
                  })}
                  onClick={this.toggleStep('2')}
                >
                  <h4 className="text-left my-4">
                    2. Alamat
                    <br />
                    <small>Alamat sesuai KTP dan Domisili</small>
                  </h4>
                </NavLink>
              </NavItem>
              <NavItem style={stepNavitemStyle}>
                <NavLink
                  tag="div"
                  className={classnames({
                    active: this.state.activeStep === '3'
                  })}
                  onClick={this.toggleStep('3')}
                >
                  <h4 className="text-left my-4">
                    3. Dokumen
                    <br />
                    <small>Berkas penunjuang pendaftaran</small>
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
                      birthdate: addValidation.birthdate,
                      addressBasedOnIdentity: addValidation.addressBasedOnIdentity,
                      motherName: addValidation.motherName,
                      typeOfIdentityId: addValidation.typeOfIdentityId,
                      identityNumber: addValidation.identityNumber
                    }
                  }
                  validate={values => {
                    const errors = {};

                    if (!values.legalFormId) {
                      errors.legalFormId = <Trans i18nKey='forms.REQUIRED'>Field is required!</Trans>
                    }
                    if (values.legalFormId) {
                      this.changeAddValidation("legalFormId", values.legalFormId)
                    }

                    if (!values.fullname) {
                      errors.fullname = <Trans i18nKey='forms.REQUIRED'>Field is required!</Trans>
                    }

                    if (!values.motherName) {
                      errors.motherName = <Trans i18nKey='forms.REQUIRED'>Field is required!</Trans>
                    }

                    if (values.typeOfIdentityId === "default") {
                      errors.typeOfIdentityId = <Trans i18nKey='forms.REQUIRED'>Field is required!</Trans>
                    }
                    else if (values.typeOfIdentityId !== "default") {
                      this.changeAddValidation("typeOfIdentityId", values.typeOfIdentityId)
                    }

                    if (!values.identityNumber) {
                      errors.identityNumber = <Trans i18nKey='forms.REQUIRED'>Field is required!</Trans>
                    }

                    return errors;
                  }}
                  onSubmit={values => {
                    this.setState(prevState => ({
                      addValidation: {
                        ...prevState.addValidation,
                        legalFormId: values.legalFormId,
                        membership: values.membership,
                        fullname: values.fullname,
                        birthdate: values.birthdate,
                        addressaddressBasedOnIdentity: values.addressBasedOnIdentity,
                        motherName: values.motherName,
                        typeOfIdentityId: values.typeOfIdentityId,
                        identityNumber: values.identityNumber
                      }
                    }))
                    this.checkDuplicate()
                  }}
                >
                  {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit
                  }) => (
                      <form className="pt-3 mb-3" onSubmit={handleSubmit}>
                        <label className="mt-3" htmlFor="legalFormId">Jenis Anggota</label>
                        <div className="py-2">
                          <label className="c-radio">
                            <Input id="individu" type="radio" name="legalFormId" className="input-font-size" value="1" tabIndex="7"
                              checked={values.legalFormId === "1"} required onChange={handleChange}
                            />
                            <span className="fa fa-circle"></span>Individu</label>
                          <span className="span-disabled">
                            <label className="c-radio">
                              <Input id="badanUsaha" type="radio" name="legalFormId" className="input-font-size" value="2" disabled
                                checked={values.legalFormId === "2"} onChange={handleChange}
                              />
                              <span className="fa fa-circle"></span>Badan Usaha</label>
                          </span>
                        </div>
                        <div className="input-feedback">{errors.legalFormId}</div>

                        {
                          this.state.addValidation.legalFormId === "1"
                            ? (
                              <div>
                                <label htmlFor="membership">Keanggotaan</label>
                                <div className="py-2">
                                  <label className="c-radio">
                                    <Input id="anggota" type="radio" name="membership" value="anggota" checked={values.membership === "anggota"} onChange={handleChange} />
                                    <span className="fa fa-circle"></span>Anggota</label>
                                  <label className="c-radio">
                                    <Input id="anggotaLuarBiasa" type="radio" name="membership" value="anggotaLuarBiasa" checked={values.membership === "anggotaLuarBiasa"} onChange={handleChange} />
                                    <span className="fa fa-circle"></span>Anggota Luar Biasa</label>
                                  <label className="c-radio">
                                    <Input id="calonAnggota" type="radio" name="membership" value="calonAnggota" checked={values.membership === "calonAnggota"} onChange={handleChange} />
                                    <span className="fa fa-circle"></span>Calon Anggota</label>
                                </div>

                                <label className="mt-3" htmlFor="fullname">Nama Lengkap</label>
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
                                  tabIndex="1"
                                  placeholder="contoh: Ikkat Inovasi Teknologi"
                                  value={values.fullname}
                                />
                                <div className="input-feedback">{touched.fullname && errors.fullname}</div>

                                <label className="mt-3" htmlFor="birthdate">Tanggal Lahir</label>
                                <Field name="birthdate" onChange={handleChange} component={BirthDate} locale={this.props.dashboard.language} tabIndex="2" />

                                <label className="mt-3" htmlFor="addressaddressBasedOnIdentity">Alamat Sesuai Identitas</label>
                                <Input
                                  name="addressBasedOnIdentity"
                                  className="input-font-size"
                                  type="text"
                                  id="addressBasedOnIdentity"
                                  tabIndex="3"
                                  placeholder="contoh: One PM, Gading Serpong, Tangerang"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values.addressBasedOnIdentity}
                                />

                                <label className="mt-3" htmlFor="motherName">Nama Gadis Ibu Kandung</label>
                                <Input
                                  name="motherName"
                                  className={
                                    touched.motherName && errors.motherName
                                      ? "input-font-size input-error"
                                      : "input-font-size"
                                  }
                                  type="text"
                                  id="motherName"
                                  tabIndex="4"
                                  placeholder="contoh: Ibu Pertiwi"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values.motherName}
                                />
                                <div className="input-feedback">{touched.motherName && errors.motherName}</div>

                                <label className="mt-3" htmlFor="typeOfIdentityId">Tipe Identitas</label>
                                <select
                                  value={values.typeOfIdentityId}
                                  className={
                                    touched.typeOfIdentityId && errors.typeOfIdentityId
                                      ? "custom-select custom-select-sm input-font-size input-error"
                                      : "custom-select custom-select-sm input-font-size"
                                  }
                                  name="typeOfIdentityId"
                                  onChange={handleChange}
                                  tabIndex="5"
                                >
                                  <option value="default">Pilih Kartu Identitas!</option>
                                  {
                                    Array.isArray(addValidation.identityTypeOptions) && addValidation.identityTypeOptions.length > 0
                                      ? addValidation.identityTypeOptions.map((option, i) => {
                                        return (
                                          <option value={option.name} key={"identityType " + i} >{option.description}</option>
                                        )
                                      })
                                      : null
                                  }
                                </select>
                                <div className="input-feedback">{touched.typeOfIdentityId && errors.typeOfIdentityId}</div>

                                {
                                  values.typeOfIdentityId !== "default"
                                    ? (
                                      <div>
                                        <label className="mt-3" htmlFor="identityNumber">
                                          No. {
                                            Array.isArray(addValidation.identityTypeOptions) && addValidation.identityTypeOptions.length > 0
                                              ? addValidation.identityTypeOptions.map((identity, i) => {
                                                if (identity.name === values.typeOfIdentityId) {
                                                  return (<span key={"No. Identity " + i}>{identity.description}</span>)
                                                }
                                              })
                                              : null
                                          }
                                        </label>
                                        <Input
                                          name="identityNumber"
                                          className={
                                            touched.identityNumber && errors.identityNumber
                                              ? "input-font-size input-error"
                                              : "input-font-size"
                                          }
                                          type="text"
                                          maxLength="16"
                                          id="identityNumber"
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          tabIndex="6"
                                          placeholder="101001002"
                                          value={values.identityNumber}
                                        />
                                        <div className="input-feedback">{touched.identityNumber && errors.identityNumber}</div>
                                      </div>
                                    )
                                    : null
                                }
                              </div>
                            )
                            : null
                        }

                        <Button
                          className="btn btn-block mt-4 mb-3 justify-content-center"
                          type="submit"
                          color="primary"
                          tabIndex="6"
                          outlined="true"
                        >
                          Cek Duplikasi
                        </Button>
                      </form>
                    )}
                </Formik>

                {
                  this.state.showNotDuplicate
                    ? (
                      <this.ShowNotDuplicate />
                    )
                    : null
                }
                {
                  this.state.privateIdentity
                    ? (
                      <this.PrivateIdentity />
                    )
                    : null
                }
              </TabPane>

              <TabPane id="tabPane2" tabId="2">
                <div className="pt-3 mb-3">
                  <fieldset>
                    <p className="lead text-center">Identitas</p>

                    <label className="mt-3" htmlFor="address1">Alamat Sesuai Identitas</label>
                    <Input
                      name="address1"
                      className="input-font-size"
                      type="text"
                      id="address1"
                      onChange={this.validateOnChange}
                      placeholder="contoh: One PM, Gading Serpong, Tangerang"
                      value={this.state.addValidation.addressBasedOnIdentity}
                      readOnly
                    />

                    <label className="mt-3" htmlFor="province">Provinsi</label>
                    <select value={this.state.addValidation.identityProvinceId} className="custom-select custom-select-sm input-font-size" name="province"
                      onChange={e => this.changeProvince(e.target.value)}>
                      <option value="default">Pilih provinsi anda!</option>
                      {
                        Array.isArray(this.state.addValidation.provinceOptions) && this.state.addValidation.provinceOptions.length > 0
                          ? this.state.addValidation.provinceOptions.map((option, i) => {
                            return (
                              <option value={option.code} key={"identityType " + i} >{option.description}</option>
                            )
                          })
                          : null
                      }
                    </select>

                    <label className="mt-3" htmlFor="city">Kabupaten / Kota</label>
                    <select value={this.state.addValidation.identityCityId} className="custom-select custom-select-sm input-font-size" name="city"
                      onChange={e => this.changeCity(e.target.value)}>
                      <option value="default">Pilih kota anda!</option>
                      {
                        Array.isArray(this.state.addValidation.cityOptionsFilter) && this.state.addValidation.cityOptionsFilter.length > 0
                          ? this.state.addValidation.cityOptionsFilter.map((option, i) => {
                            return (
                              <option value={option.code} key={"identityType " + i} >{option.description}</option>
                            )
                          })
                          : null
                      }
                    </select>

                    <label className="mt-3" htmlFor="identityPostalCode">Kode Pos</label>
                    <Input
                      name="identityPostalCode"
                      className="input-font-size"
                      type="number"
                      id="identityPostalCode"
                      onChange={this.validateOnChange}
                      placeholder="101001002"
                      value={this.state.addValidation.identityPostalCode}
                    />


                    <p className="lead text-center mt-5">Domisili</p>
                    <label className="mt-3" htmlFor="addressDomicile">Alamat Sesuai Domisili</label>
                    <Input
                      name="addressDomicile"
                      className="input-font-size"
                      type="text"
                      id="addressDomicile"
                      onChange={this.validateOnChange}
                      placeholder="contoh: One PM, Gading Serpong, Tangerang"
                      value={this.state.addValidation.addressDomicile}
                    />

                    <label className="mt-3" htmlFor="provinceDomicile">Provinsi</label>
                    <select defaultValue="" className="custom-select custom-select-sm input-font-size" name="provinceDomicile">
                      <option>List Provinsi</option>
                      <option defaultValue="province1">Provinsi 1</option>
                      <option defaultValue="province2">Provinsi 2</option>
                      <option defaultValue="province3">Provinsi 3</option>
                    </select>

                    <label className="mt-3" htmlFor="cityDomicile">Kabupaten/Kota</label>
                    <Input
                      name="cityDomicile"
                      className="input-font-size"
                      type="text"
                      id="cityDomicile"
                      onChange={this.validateOnChange}
                      placeholder="contoh: Tangerang"
                      value={this.state.addValidation.cityDomicile}
                    />

                    <label className="mt-3" htmlFor="zipCodeDomicile">Kode Pos</label>
                    <Input
                      name="zipCodeDomicile"
                      className="input-font-size"
                      type="number"
                      id="zipCodeDomicile"
                      onChange={this.validateOnChange}
                      placeholder="101001002"
                      value={this.state.addValidation.zipCodeDomicile}
                    />
                  </fieldset>
                </div>
                <hr />
                <div className="d-flex">
                  <Button className="ml-auto mr-3" color="secondary" onClick={this.toggleStep('1')}>
                    Sebelumnya
                    </Button>
                  <Button
                    color="primary"
                    onClick={this.toggleStep('3')}
                  >
                    Lanjutkan
                    </Button>
                </div>
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
                <div className="d-flex">
                  <Button className="ml-auto mr-3" color="secondary" onClick={this.toggleStep('2')}>
                    Sebelumnya
                    </Button>
                  <Button color="primary" type="submit" onClick={() => this.finishForm()}>
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
  dasboard: PropTypes.object,
  memberData: PropTypes.object,
  search: PropTypes.object
}

const mapStateToProps = state => ({
  auth: state.auth,
  dashboard: state.dashboard,
  memberData: state.memberData,
  search: state.search
})
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) })

export default compose(connect(mapStateToProps, mapDispatchToProps), withTranslation('translations'))(withRouter(MemberDataAdd));