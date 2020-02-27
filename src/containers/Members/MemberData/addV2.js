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

import * as actions from '../../../store/actions/actions';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';

import ContentWrapper from '../../../components/Layout/ContentWrapper';
import Swal from '../../../components/Common/Swal';

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


const onFieldChange = (val, field, form) => {  
  const dd = String(val.toDate().getDate()).padStart(2, '0')
  const mm = MONTHS_ID[val.toDate().getMonth()]
  const yyyy = val.toDate().getFullYear()

  val = dd + " " + mm + " " + yyyy

  form.setFieldValue(field.name, val);
}

const DateTime = ({ field, form, locale, value, error, touched, name }) => {
  return (
    <Datetime
      inputProps={{
        name: name,
        className: 
          touched && error
            ? "form-control input-font-size dt-bg input-error"
            : "form-control input-font-size dt-bg"
        ,
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
      onChange={val => onFieldChange(val, field, form)}
    />
  );
}

const ValidDate = ({ field, form, locale, value, error, touched, name }) => {
  let yesterday = Datetime.moment().subtract(1, 'day')
  let valid = current => {
    return current.isAfter( yesterday )
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
        fullNameNonIdentity: '',
        nickname: '',
        NPWP: '',
        oldMemberNumber: '',
        marriageStatus: '',
        religion: '',
        religionOptions: [],
        genderCodeValue: '',
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
        phoneNumber: '',
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
    })
    this.changeAddValidation("identityTypeOptions", identityTypeOptions)

    let officeOptions = []
    res.officeOptions.map(row => {
      officeOptions.push(row)
    })
    this.changeAddValidation("officeOptions", officeOptions)

    let religionOptions = []
    res.religionOption.map(row => {
      religionOptions.push(row)
    })
    this.changeAddValidation("religionOptions", religionOptions)

    let countryOptions = []
    res.countryOptions.map(row => {
      countryOptions.push(row)
    })
    this.changeAddValidation("countryOptions", countryOptions)

    let provinceOptions = []
    res.provinceOptions.map(row => {
      provinceOptions.push(row)
    })
    this.changeAddValidation("provinceOptions", provinceOptions)
    
    let identityCityOptionsFilter = []
    res.cityOptions.map(row => {
      identityCityOptionsFilter.push(row)
    })
    this.changeAddValidation("identityCityOptions", identityCityOptionsFilter)
    this.changeAddValidation("identityCityOptionsFilter", identityCityOptionsFilter)

    let cityOptions = []
    res.cityOptions.map(row => {
      cityOptions.push(row)
    })
    this.changeAddValidation("cityOptions", cityOptions)
    this.changeAddValidation("cityOptionsFilter", cityOptions)

    let flagTaxOptions = []
    res.flagTaxOptions.map(row => {
      flagTaxOptions.push(row)
    })
    this.changeAddValidation("flagTaxOptions", flagTaxOptions)

    let staffOptions = []
    res.staffOptions.map(row => {
      staffOptions.push(row)
    })
    this.changeAddValidation("staffOptions", staffOptions)

    let sectorOptions = []
    let sectorCodeString
    res.sectorOptions.map(row => {
      sectorCodeString = row.code.toString()
      if (sectorCodeString.substring(0,1) === "1") {
        sectorOptions.push(row)
      }
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

  ShowNotDuplicate = () => {
    const setNotDuplicate = () => {
      this.setState({
        showNotDuplicate: false,
        privateIdentity: true,
        dcPass: true
      })
    }

    const editMember = id => {
      this.props.history.push("/simpool/member/data-edit/" + id)
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
          {
            !this.state.dcPass
              ? (
                <Button outline color="primary" className="btn btn-block mt-4 justify-content-center"
                  onClick={() => setNotDuplicate()}>Create Member</Button>
                )
              : null
          }
        </div>
      )
    } else {
      return (
        <div>
          <Button disabled className="col-12">Tidak ada data yang sama!</Button>
          {
            !this.state.dcPass
              ? (
                <Button outline color="primary" className="btn btn-block mt-4 justify-content-center"
                  onClick={() => setNotDuplicate()}>Create Member</Button>
                )
              : null
          }
        </div>
      )
    }
  }

  PrivateIdentity = () => {
    const state = this.state
    const addValidation = state.addValidation

    return (
      <div>
        <Formik
          initialValues={
            {
              active: addValidation.active,
              nickname: addValidation.nickname,
              dateOfBirth: addValidation.dateOfBirth,
              email: addValidation.email,
              externalID: addValidation.externalID,
              flagTaxCodeValue: addValidation.flagTaxCodeValue,
              fullNameNonIdentity: addValidation.fullNameNonIdentity,
              genderCodeValue: addValidation.genderCodeValue,
              identityValidDate: addValidation.identityValidDate,
              mobileUser: addValidation.mobileUser,
              mobileNo: addValidation.mobileNo,
              nip: addValidation.nip,
              officeId: addValidation.officeId,
              phoneNumber: addValidation.phoneNumber,
              placeOfBirth: addValidation.placeOfBirth,
              religion: addValidation.religion,
              sectorId: addValidation.sectorId,
              staffId: addValidation.staffId,
              submittedOnDate: addValidation.submittedOnDate,
              taxAddress: addValidation.taxAddress,
              taxName: addValidation.taxName,
              taxNumber: addValidation.taxNumber,

              NPWP: addValidation.NPWP,
              oldMemberNumber: addValidation.oldMemberNumber,
              marriageStatus: addValidation.marriageStatus
            }
          }
          validate={values => {
            const errors = {};

            if (!values.officeId) {
              errors.officeId = <Trans i18nKey='forms.REQUIRED'/>
            }

            if (values.dateOfBirth !== "") {
              this.changeAddValidation("dateOfBirth", values.dateOfBirth)
            } else if (!values.dateOfBirth) {
              errors.dateOfBirth = <Trans i18nKey='forms.REQUIRED'/>
            }

            if (/^([0-9]\d*)$/.test(values.mobileNo) === false && values.mobileNo !== "") {
              errors.mobileNo = "Mobile No. harus berisi angka 0 sampai 9"
            } else if (values.mobileNo.length < 10 || values.mobileNo.length > 15) {
              errors.mobileNo = "Mobile No. harus terdiri dari 10-15 angka"
            } 
            if (!values.mobileNo) {
              errors.mobileNo = <Trans i18nKey='forms.REQUIRED'/>
            }

            if (/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(values.email) === false && values.email !== "") {
              errors.email = "Email yang dimasukkan tidak valid"
            }

            if (!values.taxName) {
              errors.taxName = <Trans i18nKey='forms.REQUIRED'/>
            }

            if (!values.taxAddress) {
              errors.taxAddress = <Trans i18nKey='forms.REQUIRED'/>
            }

            if (values.flagTaxCodeValue === "") {
              errors.flagTaxCodeValue = <Trans i18nKey='forms.REQUIRED'/>
            }

            if (values.sectorId === "") {
              errors.sectorId = <Trans i18nKey='forms.REQUIRED'/>
            }

            if (!values.placeOfBirth) {
              errors.placeOfBirth = <Trans i18nKey='forms.REQUIRED'/>              
            }

            if (/^(0|[1-9]\d*)$/.test(values.nip) === false && values.nip !== "") {
              errors.nip = "NIP harus berisi angka 0 sampai 9"              
            }

            if (/^(0|[1-9]\d*)$/.test(values.taxNumber) === false && values.taxNumber !== "") {
              errors.taxNumber = "Tax Number harus berisi angka 0 sampai 9"              
            } else if (values.taxNumber.length > 15) {
              errors.taxNumber = "Tax Number harus <= 15 angka" 
            } else if (!values.taxNumber) {
              errors.taxNumber = <Trans i18nKey='forms.REQUIRED'/>
            }

            if (/^([0-9]\d*)$/.test(values.phoneNumber) === false && values.phoneNumber !== "") {
              errors.phoneNumber = "Phone Number harus berisi angka 0 sampai 9"              
            } else if (values.phoneNumber.length > 13 || values.phoneNumber.length < 6 && values.phoneNumber !== "") {
              errors.phoneNumber = "Phone Number harus terdiri dari 6-13 angka"              
            }

            if (values.religion === "") {
              errors.religion = <Trans i18nKey='forms.REQUIRED'/>  
            }

            
            if (/^(0|[1-9]\d*)$/.test(values.NPWP) === false && values.NPWP !== "") {
              errors.NPWP = "NPWP harus berisi angka 0 sampai 9"
            } else if (values.NPWP.length > 16) {
              errors.NPWP = "NPWP harus kurang dari 16 angka"
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
            if (values.fullNameNonIdentity) {
              this.changeAddValidation("fullNameNonIdentity", values.fullNameNonIdentity)
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
            if (values.phoneNumber) {
              this.changeAddValidation("phoneNumber", values.phoneNumber)         
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

            
            if (values.NPWP) {
              this.changeAddValidation("NPWP", values.NPWP)      
            }
            if (values.oldMemberNumber) {
              this.changeAddValidation("oldMemberNumber", values.oldMemberNumber)   
            }
            if (values.marriageStatus) {
              this.changeAddValidation("marriageStatus", values.marriageStatus)   
            }
            
            return errors;
          }}
          enableReinitialize="true"
          onSubmit={() => {
            this.setState({
              tab1Pass: true
            })

            this.toggleStep('2')
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
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <label className="mt-3" htmlFor="officeId">
                    Kantor <span className="red"> *</span>
                  </label>
                  <select
                    value={values.officeId}
                    className={
                      touched.officeId && errors.officeId
                        ? "custom-select custom-select-sm input-font-size input-error"
                        : "custom-select custom-select-sm input-font-size"
                    }
                    name="officeId" onChange={handleChange}
                  >
                    <option value="">Pilih Kantor</option>
                    {
                      Array.isArray(addValidation.officeOptions) && addValidation.officeOptions.length > 0
                        ? addValidation.officeOptions.map((option, i) => {
                          return (
                            <option value={option.id} key={"identityType " + i} >{option.name}</option>
                          )
                        })
                        : null
                    }
                  </select>
                  <div className="input-feedback">{touched.officeId && errors.officeId}</div>

                  <label className="mt-3" htmlFor="dateOfBirth">
                    <Trans i18nKey='member.data-add.BIRTHDATE' /> <span className="red"> *</span>
                  </label>
                  <Field name="dateOfBirth" onChange={handleChange} component={DateTime}
                    locale={this.props.dashboard.language} value={values.dateOfBirth}
                    error={errors.dateOfBirth} touched={touched.dateOfBirth} name="dateOfBirth"
                  />
                  <div className="input-feedback">{touched.dateOfBirth && errors.dateOfBirth}</div>

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

                  <label className="mt-3" htmlFor="fullNameNonIdentity">Nama Lengkap</label>
                  <Input
                    name="fullNameNonIdentity"
                    className="input-font-size"
                    type="text"
                    id="fullNameNonIdentity"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="contoh: Simpool Ikkat"
                    value={values.fullNameNonIdentity}
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

                  <label className="mt-3" htmlFor="genderCodeValue">Jenis Kelamin</label>
                  <div className="py-2">
                    <label className="c-radio">
                      <Input id="man" type="radio" name="genderCodeValue" className="input-font-size"
                        value="M" checked={values.genderCodeValue === "M"} onChange={handleChange} onBlur={handleBlur}
                      />
                      <span className="fa fa-circle" />
                      Laki-laki
                    </label>
                    <label className="c-radio">
                      <Input id="woman" type="radio" name="genderCodeValue" className="input-font-size"
                        value="F" checked={values.genderCodeValue === "F"} onChange={handleChange} onBlur={handleBlur}
                      />
                      <span className="fa fa-circle" />
                      Perempuan
                    </label>
                  </div>

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
                </div>

                <div className="col-md-6">
                  <label className="mt-3" htmlFor="flagTaxCodeValue">
                    Flag Tax <span className="red"> *</span>
                  </label>
                  <select
                    value={values.flagTaxCodeValue}
                    className={
                      touched.flagTaxCodeValue && errors.flagTaxCodeValue
                        ? "custom-select custom-select-sm input-font-size input-error"
                        : "custom-select custom-select-sm input-font-size"
                    }
                    name="flagTaxCodeValue" onChange={handleChange}
                  >
                    <option value="">Pilih Flag Tax</option>
                    {
                      Array.isArray(addValidation.flagTaxOptions) && addValidation.flagTaxOptions.length > 0
                        ? addValidation.flagTaxOptions.map((option, i) => {
                          return (
                            <option value={option.name} key={"Flag Tax  " + i} >{option.description}</option>
                          )
                        })
                        : null
                    }
                  </select>
                  <div className="input-feedback">{touched.flagTaxCodeValue && errors.flagTaxCodeValue}</div>

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

                  <label className="mt-3" htmlFor="staffId">
                    Staff
                  </label>
                  <select
                    value={values.staffId}
                    className="custom-select custom-select-sm input-font-size"
                    name="staffId" onChange={handleChange}
                  >
                    <option value="">Pilih Staff</option>
                    {
                      Array.isArray(addValidation.staffOptions) && addValidation.staffOptions.length > 0
                        ? addValidation.staffOptions.map((option, i) => {
                          return (
                            <option value={option.id} key={"identityType " + i} >{option.displayName}</option>
                          )
                        })
                        : null
                    }
                  </select>

                  <label className="mt-3" htmlFor="sectorId">
                    Sector <span className="red"> *</span>
                  </label>
                  <select
                    value={values.sectorId}
                    className={
                      touched.sectorId && errors.sectorId
                        ? "custom-select custom-select-sm input-font-size input-error"
                        : "custom-select custom-select-sm input-font-size"
                    }
                    name="sectorId" onChange={handleChange}
                  >
                    <option value="">Pilih Sector</option>
                    {
                      Array.isArray(addValidation.sectorOptions) && addValidation.sectorOptions.length > 0
                        ? addValidation.sectorOptions.map((option, i) => {
                          return (
                            <option value={option.code} key={"identityType " + i} >{option.name}</option>
                          )
                        })
                        : null
                    }
                  </select>
                  <div className="input-feedback">{touched.sectorId && errors.sectorId}</div>

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
                  
                  <label className="mt-3" htmlFor="phoneNumber">
                    Phone Number
                  </label>
                  <Input
                    name="phoneNumber"
                    className={
                      touched.phoneNumber && errors.phoneNumber
                        ? "input-font-size input-error"
                        : "input-font-size"
                    }
                    type="text"
                    id="phoneNumber"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="contoh: 02123456789"
                    value={values.phoneNumber}
                  />
                  <div className="input-feedback">{touched.phoneNumber && errors.phoneNumber}</div>

                  <label className="mt-3" htmlFor="religion">
                    Agama <span className="red"> *</span>
                  </label>
                  <select
                    value={values.religion}
                    className={
                      touched.religion && errors.religion
                        ? "custom-select custom-select-sm input-font-size input-error"
                        : "custom-select custom-select-sm input-font-size"
                    }
                    name="religion" onChange={handleChange}
                  >
                    <option value="">Pilih agama anda</option>
                    {
                      Array.isArray(addValidation.religionOptions) && addValidation.religionOptions.length > 0
                        ? addValidation.religionOptions.map((option, i) => {
                          return (
                            <option value={option.name} key={"identityType " + i} >{option.description}</option>
                          )
                        })
                        : null
                    }
                  </select>
                  <div className="input-feedback">{touched.religion && errors.religion}</div>
                  
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
                  
                  <label className="mt-3" htmlFor="submittedOnDate">
                    Submitted On Date <span className="red"> *</span>
                  </label>
                  <Field name="submittedOnDate" onChange={handleChange} component={DateTime}
                    locale={this.props.dashboard.language} value={values.submittedOnDate}
                    error={errors.submittedOnDate} touched={touched.submittedOnDate} name="submittedOnDate"
                  />
                  <div className="input-feedback">{touched.submittedOnDate && errors.submittedOnDate}</div>

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
              
              <label className="mt-3" htmlFor="NPWP">ZZZ NPWP</label>
              <Input
                name="NPWP"
                className={
                  touched.NPWP && errors.NPWP
                    ? "input-font-size input-error"
                    : "input-font-size"
                }
                type="text"
                id="NPWP"
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="101001002"
                value={values.NPWP}
              />
              <div className="input-feedback">{touched.NPWP && errors.NPWP}</div>

              <label className="mt-3" htmlFor="marriageStatus">ZZZ Status Pernikahan</label>
              <select value={values.marriageStatus} className="custom-select custom-select-sm input-font-size"
                name="marriageStatus" onChange={handleChange}
              >
                <option value="">Status Pernikahan</option>
                <option value="married">Menikah</option>
                <option value="single">Lajang</option>
              </select>

              <label className="mt-3" htmlFor="oldMemberNumber">ZZZ No. Anggota Lama</label>
              <Input
                name="oldMemberNumber"
                className="input-font-size"
                type="text"
                id="oldMemberNumber"
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="contoh: 123456789"
                value={values.oldMemberNumber}
              />

              <div className="d-flex justify-content-end">
                <button
                  className="btn btn-primary mt-4 col-3 col-md-2"
                  type="submit"
                >
                  Lanjutkan
                </button>
              </div>
            </form>
          )
        }
        </Formik>
      </div>
    )
  }

  toggleStep = activeStep => {
    if (this.state.activeStep !== activeStep) {
      this.setState({
        activeStep
      });
    }
  }

  handleInputChange = event => {
    const target = event.currentTarget;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  // Keep a reference to the form to access from the steps methods
  formRef = node => (this.formWizardRef = node)

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
      console.log(res)
      this.props.actions.clientAddImage(clientImage, res)

      this.props.actions.clientAddDocument(clientIdCard, res)

      this.props.actions.clientAddDocument(clientNpwp, res)

      clientOtherDocs.map(doc => {
        this.props.actions.clientAddDocument(doc, res)
      })

      this.props.history.push("/simpool/member/data-detail/" + res.clientId)
    }

    this.props.actions.clientAdd({
      legalFormId: addValidation.legalFormId,
      officeId: addValidation.officeId,
      flagTaxCodeValue: addValidation.flagTaxCodeValue,
      fullname: addValidation.fullname,
      typeOfIdentityId: addValidation.typeOfIdentityId,
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
      phoneNumber: addValidation.phoneNumber,
      religion: addValidation.religion,
      taxName: addValidation.taxName,
      taxAddress: addValidation.taxAddress,
      submittedOnDate: addValidation.submittedOnDate,
      dateOfBirth: addValidation.dateOfBirth,
      email: addValidation.email,
      staffId: addValidation.staffId,
      externalId: addValidation.externalID,
      nip: addValidation.nip,
      fullnameNonIdentity: addValidation.fullnameNonIdentity,
      nickname: addValidation.nickname,
      identityValidDate: addValidation.identityValidDate,
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
      setClientAddRes
    )
  }

  render() {
    const state = this.state
    const addValidation = state.addValidation

    const tabNotPermit = {
      title: "Tolong selesaikan langkah sebelumnya!"
    }

    const showTabNotPermit = () => [
      document.getElementById("tabNotPermit").click()
    ]

    return (
      <ContentWrapper>
        <Swal options={tabNotPermit} id="tabNotPermit" />

        <div className="content-heading">
          <div>Anggota Baru V2</div>
        </div>

        <Card className="card-default">
          <CardHeader>
            <div>{this.state.today}</div>
          </CardHeader>

          <CardBody>
            <div>
              <Link to="/simpool/member/data">
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
                      ? classnames({active: true})
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
                      ? classnames({active: true})
                      : "cursor-pointer"
                  }
                  onClick={() => {
                    if (this.state.tab1Pass) {
                      this.toggleStep('2')                      
                    } else if(!this.state.tab1Pass) {
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
                      ? classnames({active: true})
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
                    const errors = {};

                    switch (values.typeOfIdentityId) {
                      case "IC":  
                        if (/^(0|[1-9]\d*)$/.test(values.identityNumber) === false) {
                          errors.identityNumber = "E-KTP harus terdiri dari angka"
                        } else if (values.identityNumber.length !== 16) {
                          errors.identityNumber =  "E-KTP License harus berisi 16 angka"
                        }
                        break;
                      case "PASS":
                        if (/^[a-zA-Z0-9]+$/.test(values.identityNumber) === false) {
                          errors.identityNumber = "Passport harus terdiri dari alphanumeric"
                        } else if (values.identityNumber.length !== 8) {
                          errors.identityNumber =  "Passport harus berisi 8 alphanumeric"
                        }
                        break;
                      case "DL":
                        if (/^(0|[1-9]\d*)$/.test(values.identityNumber) === false) {
                          errors.identityNumber = "Driver License harus terdiri dari angka"
                        } else if (values.identityNumber.length !== 12) {
                          errors.identityNumber =  "Driver License harus berisi 12 angka"
                        }
                        break;
                      case "SC":
                        if (/^[a-zA-Z0-9]+$/.test(values.identityNumber) === false) {
                          errors.identityNumber = "Student Card harus terdiri dari alphanumeric"
                        } else if (values.identityNumber.length !== 15) {
                          errors.identityNumber =  "Student Card harus berisi 15 alphanumeric"
                        }
                        break;
                      case "NIP":
                        if (/^[a-zA-Z0-9]+$/.test(values.identityNumber) === false) {
                          errors.identityNumber = "Kartu Kepegawaian harus terdiri dari alphanumeric"
                        } else if (values.identityNumber.length < 12 && values.identityNumber.length > 14) {
                          errors.identityNumber =  "Kartu Kepegawaian harus berisi 12-14 alphanumeric"
                        }
                        break;
                    }

                    if (values.membership) {
                      this.changeAddValidation("membership", values.membership)
                    }

                    if (!values.legalFormId) {
                      errors.legalFormId = <Trans i18nKey='forms.REQUIRED'/>
                    }
                    if (values.legalFormId) {
                      this.changeAddValidation("legalFormId", values.legalFormId)
                    }

                    if (!values.fullname) {
                      errors.fullname = <Trans i18nKey='forms.REQUIRED' />
                    }
                    if (values.fullname) {
                      this.changeAddValidation("fullname", values.fullname)
                    }

                    if (values.dateOfBirth) {
                      this.changeAddValidation("dateOfBirth", values.dateOfBirth)
                    }

                    if (!values.motherName) {
                      errors.motherName = <Trans i18nKey='forms.REQUIRED' />
                    }
                    if (values.motherName) {
                      this.changeAddValidation("motherName", values.motherName)
                    }

                    if (values.typeOfIdentityId === "") {
                      errors.typeOfIdentityId = <Trans i18nKey='forms.REQUIRED' />
                    }
                    else if (values.typeOfIdentityId !== "") {
                      this.changeAddValidation("typeOfIdentityId", values.typeOfIdentityId)
                    }

                    if (!values.identityNumber) {
                      errors.identityNumber = <Trans i18nKey='forms.REQUIRED' />
                    }
                    if (values.identityNumber) {
                      this.changeAddValidation("identityNumber", values.identityNumber)
                    }

                    if (values.addressBasedOnIdentity) {
                      this.changeAddValidation("addressBasedOnIdentity", values.addressBasedOnIdentity)
                    }

                    return errors;
                  }}
                  enableReinitialize="true"
                  onSubmit={() => {
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
                                  <Trans i18nKey='member.data-add.BIRTHDATE' />
                                </label>
                                <Field name="dateOfBirth" onChange={handleChange} component={DateTime}
                                  locale={this.props.dashboard.language} value={values.dateOfBirth}
                                />

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

                                <label className="mt-3" htmlFor="typeOfIdentityId">
                                  <Trans i18nKey='member.data-add.IDENTITY_TYPE' /> <span className="red"> *</span>
                                </label>
                                <select
                                  value={values.typeOfIdentityId}
                                  className={
                                    touched.typeOfIdentityId && errors.typeOfIdentityId
                                      ? "custom-select custom-select-sm input-font-size input-error"
                                      : "custom-select custom-select-sm input-font-size"
                                  }
                                  name="typeOfIdentityId"
                                  onChange={handleChange}
                                >
                                  <option value="">
                                    {this.props.i18n.t("member.data-add.IDENTITY_TYPE_PH")}
                                  </option>
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
                              </div>
                            )
                            : null
                        }

                        <Button
                          className="btn btn-block mt-4 mb-3 justify-content-center"
                          type="submit"
                          color="primary"
                          outlined="true"
                        >
                          <Trans i18nKey='member.data-add.DUPLICATE_CHECK' />
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
                    if (values.addressBasedOnIdentity) {
                      this.changeAddValidation("addressBasedOnIdentity", values.addressBasedOnIdentity)
                    }

                    if (!values.identityCountryCodeValue) {
                      errors.identityCountryCodeValue = <Trans i18nKey='forms.REQUIRED' />                      
                    }
                    if (values.identityCountryCodeValue) {
                      this.changeAddValidation("identityCountryCodeValue", values.identityCountryCodeValue)                      
                    }

                    if (!values.identityProvinceId) {
                      errors.identityProvinceId = <Trans i18nKey='forms.REQUIRED' />                      
                    }
                    if (values.identityProvinceId) {
                      let identityCityOptionsFilter = [];
                      this.state.addValidation.identityCityOptionsFilter.map(row => {
                        if (row.provinceId === values.identityProvinceId) {
                          identityCityOptionsFilter.push(row)
                        }
                      })
                      this.changeAddValidation("identityCityOptionsFilter", identityCityOptionsFilter)
                      this.changeAddValidation("identityProvinceId", values.identityProvinceId)
                    }
                    if (values.provinceId) {
                      let cityOptionsFilter = [];
                      this.state.addValidation.cityOptionsFilter.map(row => {
                        if (row.provinceId === values.provinceId) {
                          cityOptionsFilter.push(row)
                        }
                      })
                      this.changeAddValidation("cityOptionsFilter", cityOptionsFilter)
                    }

                    if (!values.identityCityId) {
                      errors.identityCityId = <Trans i18nKey='forms.REQUIRED' />                      
                    }
                    if (values.identityCityId) {
                      this.changeAddValidation("identityCityId", values.identityCityId)                      
                    }

                    if (!values.identitySubDistrict) {
                      errors.identitySubDistrict = <Trans i18nKey='forms.REQUIRED' />  
                    }
                    if (values.identitySubDistrict) {
                      this.changeAddValidation("identitySubDistrict", values.identitySubDistrict)                      
                    }

                    if (!values.identityVillage) {
                      errors.identityVillage = <Trans i18nKey='forms.REQUIRED' />                        
                    }
                    if (values.identityVillage) {
                      this.changeAddValidation("identityVillage", values.identityVillage)                      
                    }

                    if (/^(0|[1-9]\d*)$/.test(values.identityPostalCode) === false && values.identityPostalCode !== "") {
                      errors.identityPostalCode = "Postal Code harus berisi angka"
                    } else if (values.identityPostalCode.length !== 5 && values.identityPostalCode !== "") {
                      errors.identityPostalCode = "Postal Code harus berisi 5 angka"      
                    } else if (!values.identityPostalCode) {
                      errors.identityPostalCode = "Postal Code harus diisi"      
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
                    handleSubmit
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
                        <select value={values.identityCountryCodeValue}
                          className={
                            touched.identityCountryCodeValue && errors.identityCountryCodeValue
                              ? "custom-select custom-select-sm input-font-size input-error"
                              : "custom-select custom-select-sm input-font-size"
                          } name="identityCountryCodeValue"
                          onChange={handleChange}>
                          <option value="">Pilih negara!</option>
                          {
                            Array.isArray(this.state.addValidation.countryOptions) && this.state.addValidation.countryOptions.length > 0
                              ? this.state.addValidation.countryOptions.map((option, i) => {
                                return (
                                  <option value={option.code} key={"country " + i} >{option.description}</option>
                                )
                              })
                              : null
                          }
                        </select>
                        <div className="input-feedback">{touched.identityCountryCodeValue && errors.identityCountryCodeValue}</div>

                        <label className="mt-3" htmlFor="identityProvinceId">
                          Provinsi <span className="red"> *</span>
                        </label>
                        <select 
                          value={values.identityProvinceId}
                          className={
                            touched.identityProvinceId && errors.identityProvinceId
                              ? "custom-select custom-select-sm input-font-size input-error"
                              : "custom-select custom-select-sm input-font-size"
                          }
                          name="identityProvinceId"
                          onChange={handleChange}>
                          <option value="">Pilih provinsi!</option>
                          {
                            Array.isArray(this.state.addValidation.provinceOptions) && this.state.addValidation.provinceOptions.length > 0
                              ? this.state.addValidation.provinceOptions.map((option, i) => {
                                return (
                                  <option value={option.code} key={"province " + i} >{option.description}</option>
                                )
                              })
                              : null
                          }
                        </select>
                        <div className="input-feedback">{touched.identityProvinceId && errors.identityProvinceId}</div>

                        <label className="mt-3" htmlFor="identityCityId">
                          Kabupaten / Kota <span className="red"> *</span>
                        </label>
                        <select
                          value={values.identityCityId}
                          className={
                            touched.identityCityId && errors.identityCityId
                              ? "custom-select custom-select-sm input-font-size input-error"
                              : "custom-select custom-select-sm input-font-size"
                          }
                          name="identityCityId"
                          onChange={handleChange}>
                          <option value="">Pilih kota!</option>
                          {
                            Array.isArray(this.state.addValidation.identityCityOptionsFilter) && this.state.addValidation.identityCityOptionsFilter.length > 0
                              ? this.state.addValidation.identityCityOptionsFilter.map((option, i) => {
                                return (
                                  <option value={option.code} key={"city " + i} >{option.description}</option>
                                )
                              })
                              : null
                          }
                        </select>
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
                        <select value={values.countryCodeValue}
                          className={
                            touched.countryCodeValue && errors.countryCodeValue
                              ? "custom-select custom-select-sm input-font-size input-error"
                              : "custom-select custom-select-sm input-font-size"
                          } name="countryCodeValue"
                          onChange={handleChange}>
                          <option value="">Pilih negara!</option>
                          {
                            Array.isArray(this.state.addValidation.countryOptions) && this.state.addValidation.countryOptions.length > 0
                              ? this.state.addValidation.countryOptions.map((option, i) => {
                                return (
                                  <option value={option.code} key={"country " + i} >{option.description}</option>
                                )
                              })
                              : null
                          }
                        </select>
                        <div className="input-feedback">{touched.countryCodeValue && errors.countryCodeValue}</div>

                        <label className="mt-3" htmlFor="provinceId">
                          Provinsi
                        </label>
                        <select 
                          value={values.provinceId}
                          className={
                            touched.provinceId && errors.provinceId
                              ? "custom-select custom-select-sm input-font-size input-error"
                              : "custom-select custom-select-sm input-font-size"
                          }
                          name="provinceId"
                          onChange={handleChange}>
                          <option value="">Pilih provinsi!</option>
                          {
                            Array.isArray(this.state.addValidation.provinceOptions) && this.state.addValidation.provinceOptions.length > 0
                              ? this.state.addValidation.provinceOptions.map((option, i) => {
                                return (
                                  <option value={option.code} key={"province " + i} >{option.description}</option>
                                )
                              })
                              : null
                          }
                        </select>
                        <div className="input-feedback">{touched.provinceId && errors.provinceId}</div>

                        <label className="mt-3" htmlFor="cityId">
                          Kabupaten / Kota
                        </label>
                        <select
                          value={values.cityId}
                          className={
                            touched.cityId && errors.cityId
                              ? "custom-select custom-select-sm input-font-size input-error"
                              : "custom-select custom-select-sm input-font-size"
                          }
                          name="cityId"
                          onChange={handleChange}>
                          <option value="">Pilih kota!</option>
                          {
                            Array.isArray(this.state.addValidation.cityOptionsFilter) && this.state.addValidation.cityOptionsFilter.length > 0
                              ? this.state.addValidation.cityOptionsFilter.map((option, i) => {
                                return (
                                  <option value={option.code} key={"city " + i} >{option.description}</option>
                                )
                              })
                              : null
                          }
                        </select>
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
                          Kelurahan / Desa <span className="red"> *</span>
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