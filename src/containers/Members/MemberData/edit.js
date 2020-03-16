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
  TabPane,
  FormGroup
} from 'reactstrap'
import PropTypes from 'prop-types'
import { withTranslation, Trans } from 'react-i18next'
import { Field, Formik } from 'formik'
import { Select } from 'antd'
import 'antd/dist/antd.css'

import ContentWrapper from '../../../components/Layout/ContentWrapper'
import Swal from '../../../components/Common/Swal'

import MONTHS_ID from '../../../constants/MONTHS_ID'
import SHORT_MONTHS_ID from '../../../constants/SHORT_MONTHS_ID'

// DateTimePicker
import Datetime from 'react-datetime'
import 'react-datetime/css/react-datetime.css'
import moment from 'moment'
import 'moment/locale/id'

import * as actions from '../../../store/actions/actions'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

const { Option } = Select

const onFieldChange = (val, field, form) => {
  const dd = String(val.toDate().getDate()).padStart(2, '0')
  const mm = MONTHS_ID[val.toDate().getMonth()]
  const yyyy = val.toDate().getFullYear()

  val = dd + " " + mm + " " + yyyy

  form.setFieldValue(field.name, val);
}

const DateTime = ({ field, form, locale, value, error, touched, dateParam }) => {
  let valid

  if (field.name === "submittedOnDate") {
    const dateParamSplit = dateParam.split(" ", 3)

    MONTHS_ID.map((month, i) => {
      if (month === dateParamSplit[1]) {
        if (i <= 10) {
          dateParamSplit[1] = "0" + (i + 1)
        }
      }

      return null
    })

    dateParam = dateParamSplit[2] + "-" + dateParamSplit[1] + "-" + dateParamSplit[0]
  }

  if (field.name === "identityValidDate") {
    const yesterday = Datetime.moment().subtract(1, 'd')
    valid = current => {
      return current.isAfter(yesterday)
    }
  } else if (field.name === "submittedOnDate") {
    const valueDate = moment(dateParam).add(1, 'd')
    valid = current => {
      return current.isBefore(valueDate)
    }
  }
  else {
    valid = current => {
      return current
    }
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
  );
}

class MemberDataEdit extends Component {
  constructor(props) {
    super(props);

    const clientIdNo = this.props.match.params.id

    this.state = {
      accountNo: '',
      activationDate: "",
      active: false,
      activeTab: "identity",
      address: '',
      addressBasedOnIdentity: '',
      cityId: '',
      cityName: '',
      cityOptions: [],
      cityOptionsFilter: [],
      clientIdNo: clientIdNo,
      clientLegalFormOptions: "",
      clientNonPersonDetails: {},
      clientTypeIsActive: false,
      clientTypeOptions: [],
      companyCode: '',
      countryCodeValue: '',
      countryOptions: [],
      countryIsActive: false,
      dateOfBirth: "",
      dateOfBirthSpouse: [],
      directorateCode: '',
      email: '',
      externalId: '',
      faxNumber: '',
      firstname: '',
      flagTaxCodeValue: '',
      flagTaxOptions: [],
      fullname: '',
      fullnameNonIdentity: '',
      genderCodeValue: '',
      genderOptions: [],
      homeOwnershipStatus: '',
      homeOwnershipStatusOption: [],
      identityCityId: '',
      identityCityName: '',
      identityCityOptionsFilter: [],
      identityCountryCodeValue: '',
      identityCountryIsActive: false,
      identityNumber: '',
      identityPostalCode: '',
      identityProvinceId: '',
      identityProvinceName: '',
      identityRt: '',
      identityRw: '',
      identitySubDistrict: '',
      identityValidDate: "",
      identityVillage: '',
      isCitizen: false,
      lastname: '',
      lastEducationLevelCode: "",
      lastEducationLevelCodeOption: [],
      lastEducationLevelDescription: '',
      lasEducationOtherIsActive: false,
      legalForm: '',
      legalFormId: '',
      maritalStatusCode: '',
      maritalStatusOption: [],
      member: false,
      merchantCategoryCode: '',
      merchantCategoryOption: [],
      merchantInformationCode: '',
      merchantInformationCodeOption: [],
      middlename: '',
      mobileNo: '',
      mobileUser: '',
      motherName: '',
      nickname: '',
      nip: '',
      officeId: "",
      officeOptions: [],
      otherHomeOwnershipStatus: '',
      phoneNumber: '',
      placeOfBirth: '',
      postalCode: '',
      prefixCode: '',
      prefixNameCodeOption: [],
      prePostNuptialAggreement: "",
      provinceId: '',
      provinceName: '',
      provinceOptions: [],
      religion: '',
      religionOption: [],
      rt: '',
      rw: '',
      sectorId: "",
      sectorOptions: [],
      spouseIdentityNumber: '',
      spouseName: '',
      staffId: "",
      staffOptions: [],
      submittedOnDate: "",
      submittedOnDateStatic: "",
      subDistrict: '',
      suffixCode: "",
      suffixNameCodeOption: [],
      taxAddress: '',
      taxName: '',
      taxNumber: '',
      typeOfIdentityId: "",
      typeOfIdentitySpouse: "",
      typeOfIdentityOptions: [],
      typeOfIdentitySpouseOptions: [],
      village: '',

      formIdentityErrors: {},
      formAddressErrors: {},
      formOthersErrors: {}
    }

    const setClientDetail = res => {
      let cityOptions = []
      let identityCityOptions = []

      res.cityOptions.map(city => {
        if (city.provinceId === res.identityProvince.code) {
          identityCityOptions.push(city)
        }

        if (city.provinceId === res.province.code) {
          cityOptions.push(city)
        }

        return null
      })

      res.lastEducationLevelCode.name === "0199"
        ? this.setState({ lasEducationOtherIsActive: true })
        : this.setState({ lasEducationOtherIsActive: false })

      const dateOfBirthSpouseConv = date => {
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

      let dateOfBirthSpouse

      if (res.biInformation.dateOfBirthSpouse) {
        dateOfBirthSpouse = dateOfBirthSpouseConv(res.biInformation.dateOfBirthSpouse)
      }

      this.setState(prevState => ({
        accountNo: res.accountNo ? res.accountNo : "",
        activationDate:
          Array.isArray(res.activationDate) && res.activationDate.length > 0
            ? res.activationDate[2] + " " + MONTHS_ID[res.activationDate[1] - 1] + " " + res.activationDate[0]
            : "",
        active: res.active ? res.active : false,
        address: res.address ? res.address : "",
        addressBasedOnIdentity: res.addressBasedOnIdentity ? res.addressBasedOnIdentity : "",
        nickname: res.nickname ? res.nickname : "",
        cityId: res.city.code ? res.city.code : "",
        cityName: res.city.description ? res.city.description : "",
        cityOptions: res.cityOptions ? res.cityOptions : "",
        cityOptionsFilter: cityOptions ? cityOptions : "",
        clientNonPersonDetails: {
          ...prevState.clientNonPersonDetails,
          businessType: res.clientNonPersonDetails.businessType ? res.clientNonPersonDetails.businessType : "",
          corporateId: res.clientNonPersonDetails.corporateId ? res.clientNonPersonDetails.corporateId : "",
          isLjk: res.clientNonPersonDetails.isLjk ? res.clientNonPersonDetails.isLjk : "",
          ljkCode: res.clientNonPersonDetails.ljkCode ? res.clientNonPersonDetails.ljkCode : "",
          bankFlag: res.clientNonPersonDetails.bankFlag ? res.clientNonPersonDetails.bankFlag : "",
          incorporationDate: res.clientNonPersonDetails.incorporationDate ? res.clientNonPersonDetails.incorporationDate : "",
          incorpValidityTillDate: res.clientNonPersonDetails.incorpValidityTillDate ? res.clientNonPersonDetails.incorpValidityTillDate : "",
          publicationDate: res.clientNonPersonDetails.publicationDate ? res.clientNonPersonDetails.publicationDate : "",
          legalityEndDate: res.clientNonPersonDetails.legalityEndDate ? res.clientNonPersonDetails.legalityEndDate : ""
        },
        clientTypeIsActive: res.clientType.isActive ? res.clientType.isActive : "",
        clientLegalFormOptions: res.clientLegalFormOptions ? res.clientLegalFormOptions : "",
        companyCode: res.company.name ? res.company.name : "",
        countryCodeValue: res.country.name ? res.country.name : "",
        countryOptions: res.countryOptions ? res.countryOptions : "",
        countryIsActive: res.country.isActive ? res.country.isActive : "",
        dateOfBirth:
          Array.isArray(res.activationDate) && res.activationDate.length > 0
            ? res.dateOfBirth[2] + " " + MONTHS_ID[res.dateOfBirth[1] - 1] + " " + res.dateOfBirth[0]
            : "",
        dateOfBirthSpouse: dateOfBirthSpouse ? dateOfBirthSpouse : "",
        directorateCode: res.directorate.name ? res.directorate.name : "",
        email: res.email ? res.email : "",
        externalId: res.externalId ? res.externalId : "",
        faxNumber: res.faxNumber ? res.faxNumber : "",
        firstname: res.firstname ? res.firstname : "",
        flagTaxCodeValue: res.flagTax.name ? res.flagTax.name : "",
        flagTaxOptions: res.flagTaxOptions ? res.flagTaxOptions : "",
        fullname: res.fullname ? res.fullname : "",
        fullnameNonIdentity: res.fullnameNonIdentity ? res.fullnameNonIdentity : "",
        genderCodeValue: res.gender.name ? res.gender.name : "",
        genderOptions: res.genderOptions ? res.genderOptions : "",
        homeOwnershipStatus: res.homeOwnershipStatus ? res.homeOwnershipStatus.name : "",
        homeOwnershipStatusOption: res.homeOwnershipStatusOption ? res.homeOwnershipStatusOption : "",
        identityCityId: res.identityCity.code ? res.identityCity.code : "",
        identityCityName: res.identityCity.description ? res.identityCity.description : "",
        identityCityOptionsFilter: identityCityOptions ? identityCityOptions : "",
        identityNumber: res.identityNumber ? res.identityNumber : "",
        identityCountryCodeValue: res.identityCountry.name ? res.identityCountry.name : "",
        identityCountryIsActive: res.identityCountry.isActive ? res.identityCountry.isActive : "",
        identityPostalCode: res.identityPostalCode ? res.identityPostalCode : "",
        identityProvinceId: res.identityProvince.code ? res.identityProvince.code : "",
        identityProvinceName: res.identityProvince.description ? res.identityProvince.description : "",
        identityRt: res.identityRt ? res.identityRt : "",
        identityRw: res.identityRw ? res.identityRw : "",
        identitySubDistrict: res.identitySubDistrict ? res.identitySubDistrict : "",
        identityValidDate: res.identityValidDate ? res.identityValidDate : "",
        identityVillage: res.identityVillage ? res.identityVillage : "",
        isCitizen: res.isCitizen ? res.isCitizen : "",
        lastname: res.lastname ? res.lastname : "",
        lastEducationLevelCode: res.lastEducationLevelCode.name ? res.lastEducationLevelCode.name : "",
        lastEducationLevelCodeOption: res.lastEducationLevelCodeOption ? res.lastEducationLevelCodeOption : "",
        lastEducationLevelDescription: res.lastEducationLevelDescription ? res.lastEducationLevelDescription : "",
        legalForm: res.legalForm.value ? res.legalForm.value : "",
        legalFormId: res.legalForm.id ? res.legalForm.id : "",
        maritalStatusCode: res.maritalStatusCode.name ? res.maritalStatusCode.name : "",
        maritalStatusOption: res.maritalStatusCodeOption ? res.maritalStatusCodeOption : "",
        member: res.member ? res.member : false,
        merchantCategoryCode: res.merchantCategoryCode ? res.merchantCategoryCode : "",
        merchantCategoryOption: res.merchantCategoryOption ? res.merchantCategoryOption : "",
        merchantInformationCode: res.merchantInformationCode ? res.merchantInformationCode : "",
        merchantInformationCodeOption: res.merchantInformationCodeOption ? res.merchantInformationCodeOption : "",
        middlename: res.middlename ? res.middlename : "",
        mobileNo: res.mobileNo ? res.mobileNo : "",
        mobileUser: res.mobileUser ? res.mobileUser : "",
        motherName: res.motherName ? res.motherName : "",
        nip: res.nip ? res.nip : "",
        officeId: res.officeId ? res.officeId : "",
        officeOptions: res.officeOptions ? res.officeOptions : "",
        otherHomeOwnershipStatus: res.otherHomeOwnershipStatus ? res.otherHomeOwnershipStatus : "",
        phoneNumber: res.phoneNumber ? res.phoneNumber : "",
        placeOfBirth: res.placeOfBirth ? res.placeOfBirth : "",
        postalCode: res.postalCode ? res.postalCode : "",
        prefixCode: res.prefixDescription.code ? res.prefixDescription.code : "",
        prefixNameCodeOption: res.prefixNameCodeOption ? res.prefixNameCodeOption : "",
        prePostNuptialAggreement: res.biInformation.prePostNuptialAggreement ? res.biInformation.prePostNuptialAggreement : "",
        provinceId: res.province.code ? res.province.code : "",
        provinceName: res.province.description ? res.province.description : "",
        provinceOptions: res.provinceOptions ? res.provinceOptions : "",
        religion: res.religion.description ? res.religion.description : "",
        religionOptions: res.religionOption ? res.religionOption : "",
        rt: res.rt ? res.rt : "",
        rw: res.rw ? res.rw : "",
        sectorId: res.sector.code ? res.sector.code : "",
        sectorOptions: res.sectorOptions ? res.sectorOptions : "",
        spouseIdentityNumber: res.biInformation.spouseIdentityNumber ? res.biInformation.spouseIdentityNumber : "",
        spouseName: res.biInformation.spouseName ? res.biInformation.spouseName : "",
        staffId: res.staffId ? res.staffId : "",
        staffOptions: res.staffOptions ? res.staffOptions : "",
        submittedOnDate:
          Array.isArray(res.timeline.submittedOnDate) && res.timeline.submittedOnDate.length > 0
            ? res.timeline.submittedOnDate[2] + " " + MONTHS_ID[res.timeline.submittedOnDate[1] - 1] + " " + res.timeline.submittedOnDate[0]
            : "",
        submittedOnDateStatic:
          Array.isArray(res.timeline.submittedOnDate) && res.timeline.submittedOnDate.length > 0
            ? res.timeline.submittedOnDate[2] + " " + MONTHS_ID[res.timeline.submittedOnDate[1] - 1] + " " + res.timeline.submittedOnDate[0]
            : "",
        subDistrict: res.subDistrict ? res.subDistrict : "",
        suffix: res.suffixDescription.code ? res.suffixDescription.code : "",
        suffixNameCodeOption: res.suffixNameCodeOption ? res.suffixNameCodeOption : "",
        taxAddress: res.taxAddress ? res.taxAddress : "",
        taxName: res.taxName ? res.taxName : "",
        taxNumber: res.taxNumber ? res.taxNumber : "",
        typeOfIdentityId: res.typeOfIdentity.name ? res.typeOfIdentity.name : "",
        typeOfIdentityOptions: res.typeOfIdentityOptions ? res.typeOfIdentityOptions : "",
        typeOfIdentitySpouse: res.biInformation.typeOfIdentity ? res.biInformation.typeOfIdentity : "",
        typeOfIdentitySpouseOptions: res.typeOfIdentityBiOptions ? res.typeOfIdentityBiOptions : "",
        village: res.village ? res.village : ""
      }))
    }

    this.props.actions.getClientDetail(clientIdNo, setClientDetail)
  }

  toggleTab = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  changeDateState = (name, e) => {
    let dd = String(e.toDate().getDate()).padStart(2, '0')
    let mm = MONTHS_ID[e.toDate().getMonth()]
    let yyyy = e.toDate().getFullYear()

    let date = dd + " " + mm + " " + yyyy

    this.setState({
      [name]: date
    })
  }

  changeState = (name, val) => {
    this.setState({
      [name]: val
    })
  }

  render() {
    const state = this.state

    const setClientPutRes = res => {
      this.props.history.push({
        pathname: "/simpool/member/data-detail/" + state.clientIdNo,
        search: "?tenantIdentifier=" + this.props.settings.tenantIdentifier
      })
    }

    const errorExist = {
      title: "Terdapat eror pada forms"
    }
    const errorIdentity = {
      title: "Terdapat eror pada identity"
    }
    const errorAddress = {
      title: "Terdapat eror pada address"
    }
    const errorOthers = {
      title: "Terdapat eror pada others"
    }

    const showErrorExist = () => {
      document.getElementById("errorExist").click()
    }

    const editMember = () => {
      this.props.actions.putClientId(
        {
          "officeId": state.officeId,
          "legalForm": state.legalForm,
          "firstname": state.firstname,
          "middlename": state.middlename,
          "lastname": state.lastname,
          "active": state.active,
          "accountNo": state.accountNo,
          "staffId": state.staffId,
          "externalId": state.externalId,
          "mobileNo": state.mobileNo,
          "genderCodeValue": state.genderCodeValue,
          "address": state.address,
          "typeOfIdentityId": state.typeOfIdentityId,
          "provinceId": state.provinceId,
          "provinceName": state.provinceName,
          "cityId": state.cityId,
          "cityName": state.cityName,
          "countryCodeValue": state.countryCodeValue,
          "flagTaxCodeValue": state.flagTaxCodeValue,
          "placeOfBirth": state.placeOfBirth,
          "motherName": state.motherName,
          "sectorId": state.sectorId,
          "mobileUser": state.mobileUser,
          "nip": state.nip,
          "identityNumber": state.identityNumber,
          "postalCode": state.postalCode,
          "fullname": state.fullname,
          "member": state.member,
          "directorateCode": state.directorateCode,
          "companyCode": state.companyCode,
          "addressBasedOnIdentity": state.addressBasedOnIdentity,
          "phoneNumber": state.phoneNumber,
          "religion": state.religion,
          "email": state.email,
          "merchantCategoryCode": state.merchantCategoryCode,
          "merchantInformationCode": state.merchantInformationCode,
          "spouseIdentityNumber": state.spouseIdentityNumber,
          "spouseName": state.spouseName,
          "prePostNuptialAggreement": state.prePostNuptialAggreement,
          "typeOfIdentitySpouse": state.typeOfIdentitySpouse,
          "clientNonPersonDetails": {
            "businessType": state.clientNonPersonDetails.businessType,
            "corporateId": state.clientNonPersonDetails.corporateId,
            "isLjk": state.clientNonPersonDetails.isLjk,
            "ljkCode": state.clientNonPersonDetails.ljkCode,
            "bankFlag": state.clientNonPersonDetails.bankFlag,
            "incorporationDate": state.clientNonPersonDetails.incorporationDate,
            "incorpValidityTillDate": state.clientNonPersonDetails.incorpValidityTillDate,
            "publicationDate": state.clientNonPersonDetails.publicationDate,
            "legalityEndDate": state.clientNonPersonDetails.legalityEndDate
          },
          "prefixCode": state.prefixCode,
          "suffixCode": state.suffixCode,
          "nickname": state.nickname,
          "identityValidDate": state.identityValidDate,
          "maritalStatusCode": state.maritalStatusCode,
          "lastEducationLevelCode": state.lastEducationLevelCode,
          "lastEducationLevelDescription": state.lastEducationLevelDescription,
          "isCitizen": state.isCitizen,
          "taxNumber": state.taxNumber,
          "taxName": state.taxName,
          "taxAddress": state.taxAddress,
          "rt": state.rt,
          "rw": state.rw,
          "village": state.village,
          "subDistrict": state.subDistrict,
          "faxNumber": state.faxNumber,
          "identitySubDistrict": state.identitySubDistrict,
          "identityVillage": state.identityVillage,
          "identityPostalCode": state.identityPostalCode,
          "identityProvinceId": state.identityProvinceId,
          "identityProvinceName": state.identityProvinceName,
          "identityCityId": state.identityCityId,
          "identityCityName": state.identityCityName,
          "identityCountryCodeValue": state.identityCountryCodeValue,
          "identityRt": state.identityRt,
          "identityRw": state.identityRw,
          "fullnameNonIdentity": state.fullnameNonIdentity,
          "otherHomeOwnershipStatus": state.otherHomeOwnershipStatus,
          "homeOwnershipStatus": state.homeOwnershipStatus,
          "legalFormId": state.legalFormId,
          "locale": this.props.dashboard.language,
          "dateFormat": "dd MMMM yyyy",
          "activationDate": state.activationDate,
          "dateOfBirth": state.dateOfBirth,
          "submittedOnDate": state.submittedOnDate,
          "dateOfBirthSpouse": state.dateOfBirthSpouse
        },
        setClientPutRes,
        showErrorExist,
        state.clientIdNo
      )
    }

    let submitFormIdentity = null
    let submitFormAddress = null
    let submitFormOthers = null

    const handleSubmitForm = e => {
      if (submitFormIdentity) {
        if (Object.getOwnPropertyNames(state.formIdentityErrors).length > 0) {
          document.getElementById("errorIdentity").click()
        }
        submitFormIdentity(e)
      }
      if (submitFormAddress) {
        if (Object.getOwnPropertyNames(state.formAddressErrors).length > 0) {
          document.getElementById("errorAddress").click()
        }
        submitFormAddress(e)
      }
      if (submitFormOthers) {
        if (Object.getOwnPropertyNames(state.formOthersErrors).length > 0) {
          document.getElementById("errorOthers").click()
        }
        submitFormOthers(e)
      }
    }

    const bindFormIdentity = submitForm => {
      submitFormIdentity = submitForm;
    }
    const bindFormAddress = submitForm => {
      submitFormAddress = submitForm;
    }
    const bindFormOthers = submitForm => {
      submitFormOthers = submitForm;
    }

    return (
      <ContentWrapper>
        <Swal options={errorExist} id="errorExist" />
        <Swal options={errorIdentity} id="errorIdentity" />
        <Swal options={errorAddress} id="errorAddress" />
        <Swal options={errorOthers} id="errorOthers" />

        <div className="content-heading">
          <div>Edit Member Data</div>
        </div>

        <Card className="card-default">
          <CardBody>
            <Link
              to={{
                pathname: "/simpool/member/data-detail/" + this.state.clientIdNo,
                search: "?tenantIdentifier=" + this.props.settings.tenantIdentifier
              }}
            >
              <Button outline className="col-4 col-md-2 mb-4" color="primary">Kembali</Button>
            </Link>

            <div role="tabpanel row">
              <Nav tabs justified>
                <NavItem className="nav-tab">
                  <NavLink className={this.state.activeTab === 'identity' ? 'active' : ''}
                    onClick={() => { this.toggleTab('identity'); }}
                  >
                    Identity
                  </NavLink>
                </NavItem>
                <NavItem className="nav-tab">
                  <NavLink className={this.state.activeTab === 'address' ? 'active' : ''}
                    onClick={() => { this.toggleTab('address'); }}
                  >
                    Address
                  </NavLink>
                </NavItem>
                <NavItem className="nav-tab">
                  <NavLink className={this.state.activeTab === 'others' ? 'active' : ''}
                    onClick={() => { this.toggleTab('others'); }}
                  >
                    Others
                  </NavLink>
                </NavItem>
              </Nav>

              <TabContent activeTab={this.state.activeTab}>
                <TabPane className="ft-detail" tabId="identity" role="tabpanel">
                  <Formik
                    initialValues={
                      {
                        officeId: state.officeId,
                        staffId: state.staffId,
                        legalFormId: state.legalFormId,
                        sectorId: state.sectorId,
                        externalId: state.externalId,
                        nip: state.nip,
                        prefixCode: state.prefixCode,
                        fullname: state.fullname,
                        fullnameNonIdentity: state.fullnameNonIdentity,
                        nickname: state.nickname,
                        suffixCode: state.suffixCode,
                        typeOfIdentityId: state.typeOfIdentityId,
                        identityNumber: state.identityNumber,
                        identityValidDate: state.identityValidDate,
                        genderCodeValue: state.genderCodeValue,
                        dateOfBirth: state.dateOfBirth,
                        motherName: state.motherName,
                        placeOfBirth: state.placeOfBirth,
                        mobileNo: state.mobileNo,
                        phoneNumber: state.phoneNumber,
                        faxNumber: state.faxNumber,
                        religion: state.religion,
                        email: state.email,
                        maritalStatusCode: state.maritalStatusCode,
                        typeOfIdentitySpouse: state.typeOfIdentitySpouse,
                        spouseIdentityNumber: state.spouseIdentityNumber,
                        spouseName: state.spouseName,
                        prePostNuptialAggreement: state.prePostNuptialAggreement,
                        dateOfBirthSpouse: state.dateOfBirthSpouse,
                        lastEducationLevelCode: state.lastEducationLevelCode,
                        lastEducationLevelDescription: state.lastEducationLevelDescription,
                        isCitizen: state.isCitizen
                      }
                    }
                    validate={values => {
                      const errors = {}

                      if (!values.officeId) {
                        errors.officeId = <Trans i18nKey='forms.REQUIRED'>Form is required!</Trans>
                      }

                      if (!values.legalFormId) {
                        errors.legalFormId = <Trans i18nKey='forms.REQUIRED'>Form is required!</Trans>
                      }

                      if (!values.sectorId) {
                        errors.sectorId = <Trans i18nKey='forms.REQUIRED'>Form is required!</Trans>
                      }

                      if (/^[a-zA-Z\s'.-]+$/.test(values.fullname) === false) {
                        errors.fullname = "Identitiy Name harus terdiri dari alphabet (a-zA-Z\\s\\'.-)"
                      }
                      if (!values.fullname) {
                        errors.fullname = <Trans i18nKey='forms.REQUIRED'>Form is required!</Trans>
                      }

                      if (/^[a-zA-Z\s'.-]+$/.test(values.fullnameNonIdentity) === false && values.fullnameNonIdentity !== "") {
                        errors.fullnameNonIdentity = "Identitiy Name harus terdiri dari alphabet (a-zA-Z\\s\\'.-)"
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
                      if (!values.typeOfIdentityId) {
                        errors.typeOfIdentityId = <Trans i18nKey='forms.REQUIRED'>Form is required!</Trans>
                      }

                      if (!values.identityNumber) {
                        errors.identityNumber = <Trans i18nKey='forms.REQUIRED'>Form is required!</Trans>
                      }

                      if (!values.genderCodeValue) {
                        errors.genderCodeValue = <Trans i18nKey='forms.REQUIRED'>Form is required!</Trans>
                      }

                      if (!values.dateOfBirth) {
                        errors.dateOfBirth = <Trans i18nKey='forms.REQUIRED'>Form is required!</Trans>
                      }

                      if (/^[a-zA-Z\s]+$/.test(values.placeOfBirth) === false) {
                        errors.placeOfBirth = "Identitiy Name harus terdiri dari alphabet (a-zA-Z\\s\\'.-)"
                      }
                      if (!values.placeOfBirth) {
                        errors.placeOfBirth = <Trans i18nKey='forms.REQUIRED'>Form is required!</Trans>
                      }

                      if (/^[a-zA-Z\s'.-]+$/.test(values.motherName) === false) {
                        errors.motherName = "Mother's Maiden Name harus terdiri dari alphanumeric (a-zA-Z\\s\\'.-)"
                      }
                      if (!values.motherName) {
                        errors.motherName = <Trans i18nKey='forms.REQUIRED'>Form is required!</Trans>
                      }

                      if (/^([0-9]\d*)$/.test(values.mobileNo) === false && values.mobileNo !== "") {
                        errors.mobileNo = "Mobile No. harus berisi angka 0 sampai 9"
                      } else if (values.mobileNo.length < 10 || values.mobileNo.length > 15) {
                        errors.mobileNo = "Mobile No. harus terdiri dari 10-15 angka"
                      }
                      if (!values.mobileNo) {
                        errors.mobileNo = <Trans i18nKey='forms.REQUIRED'>Form is required!</Trans>
                      }

                      if (/^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/.test(values.email) === false && values.email !== "") {
                        errors.email = "Email yang dimasukkan tidak valid"
                      }

                      if (!values.religion) {
                        errors.religion = <Trans i18nKey='forms.REQUIRED'>Form is required!</Trans>
                      }

                      if (values.maritalStatusCode === "Kawin") {
                        if (!values.typeOfIdentitySpouse) {
                          errors.typeOfIdentitySpouse = <Trans i18nKey='forms.REQUIRED'>Form is required!</Trans>
                        }

                        if (!values.spouseIdentityNumber) {
                          errors.spouseIdentityNumber = <Trans i18nKey='forms.REQUIRED'>Form is required!</Trans>
                        }

                        if (!values.spouseName) {
                          errors.spouseName = <Trans i18nKey='forms.REQUIRED'>Form is required!</Trans>
                        }

                        if (!values.prePostNuptialAggreement) {
                          errors.prePostNuptialAggreement = <Trans i18nKey='forms.REQUIRED'>Form is required!</Trans>
                        }

                        if (!values.dateOfBirthSpouse) {
                          errors.dateOfBirthSpouse = <Trans i18nKey='forms.REQUIRED'>Form is required!</Trans>
                        }
                      }


                      if (values.officeId || values.officeId === "") {
                        this.changeState("officeId", values.officeId)
                      }
                      if (values.staffId || values.staffId === "") {
                        this.changeState("staffId", values.staffId)
                      }
                      if (values.legalFormId || values.legalFormId === "") {
                        this.changeState("legalFormId", values.legalFormId)

                        if (Array.isArray(state.clientLegalFormOptions) && state.clientLegalFormOptions.length > 0) {
                          state.clientLegalFormOptions.map(option => {
                            if (option.id === values.legalFormId) {
                              this.changeState("legalForm", option.value)
                            }

                            return null
                          })
                        }
                      }
                      if (values.sectorId || values.sectorId === "") {
                        this.changeState("sectorId", values.sectorId)
                      }
                      if (values.externalId || values.externalId === "") {
                        this.changeState("externalId", values.externalId)
                      }
                      if (values.nip || values.nip === "") {
                        this.changeState("nip", values.nip)
                      }
                      if (values.prefixCode || values.prefixCode === "") {
                        this.changeState("prefixCode", values.prefixCode)
                      }
                      if (values.fullname || values.fullname === "") {
                        this.changeState("fullname", values.fullname)
                      }
                      if (values.fullnameNonIdentity || values.fullnameNonIdentity === "") {
                        this.changeState("fullnameNonIdentity", values.fullnameNonIdentity)

                        const fullnameSplit = values.fullnameNonIdentity.split(" ", 3)
                        this.setState({
                          firstname: fullnameSplit[0],
                          middlename: fullnameSplit[1],
                          lastname: fullnameSplit[2]
                        })
                      }
                      if (values.nickname || values.nickname === "") {
                        this.changeState("nickname", values.nickname)
                      }
                      if (values.suffixCode || values.suffixCode === "") {
                        this.changeState("suffixCode", values.suffixCode)
                      }
                      if (values.typeOfIdentityId || values.typeOfIdentityId === "") {
                        this.changeState("typeOfIdentityId", values.typeOfIdentityId)
                      }
                      if (values.identityNumber || values.identityNumber === "") {
                        this.changeState("identityNumber", values.identityNumber)
                      }
                      if (values.identityValidDate || values.identityValidDate === "") {
                        this.changeState("identityValidDate", values.identityValidDate)
                      }
                      if (values.genderCodeValue || values.genderCodeValue === "") {
                        this.changeState("genderCodeValue", values.genderCodeValue)
                      }
                      if (values.dateOfBirth || values.dateOfBirth === "") {
                        this.changeState("dateOfBirth", values.dateOfBirth)
                      }
                      if (values.placeOfBirth || values.placeOfBirth === "") {
                        this.changeState("placeOfBirth", values.placeOfBirth)
                      }
                      if (values.motherName || values.motherName === "") {
                        this.changeState("motherName", values.motherName)
                      }
                      if (values.mobileNo || values.mobileNo === "") {
                        this.changeState("mobileNo", values.mobileNo)
                      }
                      if (values.phoneNumber || values.phoneNumber === "") {
                        this.changeState("phoneNumber", values.phoneNumber)
                      }
                      if (values.faxNumber || values.faxNumber === "") {
                        this.changeState("faxNumber", values.faxNumber)
                      }
                      if (values.email || values.email === "") {
                        this.changeState("email", values.email)
                      }
                      if (values.religion || values.religion === "") {
                        this.changeState("religion", values.religion)
                      }
                      if (values.maritalStatusCode || values.maritalStatusCode === "") {
                        this.changeState("maritalStatusCode", values.maritalStatusCode)
                      }
                      if (values.typeOfIdentitySpouse || values.typeOfIdentitySpouse === "") {
                        this.changeState("typeOfIdentitySpouse", values.typeOfIdentitySpouse)
                      }
                      if (values.spouseIdentityNumber || values.spouseIdentityNumber === "") {
                        this.changeState("spouseIdentityNumber", values.spouseIdentityNumber)
                      }
                      if (values.spouseName || values.spouseName === "") {
                        this.changeState("spouseName", values.spouseName)
                      }
                      if (values.prePostNuptialAggreement || values.prePostNuptialAggreement === "") {
                        this.changeState("prePostNuptialAggreement", values.prePostNuptialAggreement)
                      }
                      if (values.dateOfBirthSpouse || values.dateOfBirthSpouse === "") {
                        this.changeState("dateOfBirthSpouse", values.dateOfBirthSpouse)
                      }
                      if (values.lastEducationLevelCode || values.lastEducationLevelCode === "") {
                        this.changeState("lastEducationLevelCode", values.lastEducationLevelCode)
                        if (values.lastEducationLevelCode === "0199") {
                          this.changeState("lasEducationOtherIsActive", true)
                        } else {
                          this.changeState("lasEducationOtherIsActive", false)
                        }
                      }
                      if (values.lastEducationLevelDescription || values.lastEducationLevelDescription === "") {
                        this.changeState("lastEducationLevelDescription", values.lastEducationLevelDescription)
                      }
                      if (values.isCitizen) {
                        this.changeState("isCitizen", !values.isCitizen)
                      }

                      this.setState({ formIdentityErrors: errors })

                      return errors
                    }}
                    enableReinitialize="true"
                    onSubmit={(val, { setSubmitting }) => {
                      if (Object.getOwnPropertyNames(state.formIdentityErrors).length === 0) {
                        if (Object.getOwnPropertyNames(state.formAddressErrors).length === 0
                          && Object.getOwnPropertyNames(state.formOthersErrors).length === 0) {
                          editMember()
                        }
                      }

                      setSubmitting(false)
                    }}
                  >
                    {formikProps => {
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

                      bindFormIdentity(submitForm)

                      return (
                        <form id="formIdentity" className="form-font-size mt-3 row" onSubmit={handleSubmit}>
                          <div className="col-lg-6">
                            <FormGroup>
                              <label htmlFor="officeId">
                                Office <span className="red"> *</span>
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
                                disabled readOnly
                              >
                                <Option value="">Select office</Option>
                                {
                                  Array.isArray(this.state.officeOptions) && this.state.officeOptions.length > 0
                                    ? this.state.officeOptions.map((option, i) => {
                                      return (
                                        <Option value={option.id} key={"Office option " + i} >{option.name}</Option>
                                      )
                                    })
                                    : ""
                                }
                              </Select>
                              <div className="input-feedback">{touched.officeId && errors.officeId}</div>
                            </FormGroup>

                            <FormGroup>
                              <label htmlFor="legalFormId">
                                Client Type <span className="red"> *</span>
                              </label>
                              <Select
                                value={values.legalFormId}
                                className={
                                  touched.legalFormId && errors.legalFormId
                                    ? "col-12 input-error"
                                    : "col-12"
                                }
                                name="legalFormId"
                                onChange={val => setFieldValue("legalFormId", val)}
                                onBlur={val => setFieldTouched("legalFormId", val)}
                                showSearch
                                filterOption={(input, option) =>
                                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                size="large"
                                disabled={!state.clientTypeIsActive}
                              >
                                <Option value="">Select client type</Option>
                                {
                                  Array.isArray(state.clientLegalFormOptions) && state.clientLegalFormOptions.length > 0
                                    ? state.clientLegalFormOptions.map((option, i) => {
                                      return (
                                        <Option value={option.id} key={"Client type option " + i} >{option.value}</Option>
                                      )
                                    })
                                    : ""
                                }
                              </Select>
                              <div className="input-feedback">{touched.legalFormId && errors.legalFormId}</div>
                            </FormGroup>

                            <FormGroup>
                              <label htmlFor="sectorId">
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
                                <Option value="">Select sector</Option>
                                {
                                  Array.isArray(state.sectorOptions) && state.sectorOptions.length > 0
                                    ? state.sectorOptions.map((option, i) => {
                                      return (
                                        <Option value={option.code} key={"Sector option " + i} >{option.name}</Option>
                                      )
                                    })
                                    : ""
                                }
                              </Select>
                              <div className="input-feedback">{touched.sectorId && errors.sectorId}</div>
                            </FormGroup>

                            <FormGroup>
                              <label htmlFor="fullname">
                                Identity Name <span className="red"> *</span>
                              </label>
                              <input
                                name="fullname"
                                className={
                                  touched.fullname && errors.fullname
                                    ? "form-control mr-3 input-font-size input-error"
                                    : "form-control mr-3 input-font-size"
                                }
                                type="text"
                                placeholder="Enter identity's name"
                                value={values.fullname}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              <div className="input-feedback">{touched.fullname && errors.fullname}</div>
                            </FormGroup>

                            <FormGroup>
                              <label htmlFor="typeOfIdentityId">
                                Type Of Identity <span className="red"> *</span>
                              </label>
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
                                <Option value="">Select type of identity</Option>
                                {
                                  Array.isArray(state.typeOfIdentityOptions) && state.typeOfIdentityOptions.length > 0
                                    ? state.typeOfIdentityOptions.map((option, i) => {
                                      return (
                                        <Option value={option.name} key={"Type of identity option " + i} >{option.description}</Option>
                                      )
                                    })
                                    : ""
                                }
                              </Select>
                              <div className="input-feedback">{touched.typeOfIdentityId && errors.typeOfIdentityId}</div>
                            </FormGroup>

                            <FormGroup>
                              <label htmlFor="identityNumber">
                                No. {
                                  Array.isArray(state.typeOfIdentityOptions) && state.typeOfIdentityOptions.length > 0
                                    ? state.typeOfIdentityOptions.map((identity, i) => {
                                      if (identity.name === values.typeOfIdentityId) {
                                        return (<span key={"No. Identity " + i}>{identity.description}</span>)
                                      }

                                      return null
                                    })
                                    : null
                                } <span className="red"> *</span>
                              </label>
                              <input
                                name="identityNumber"
                                className={
                                  touched.identityNumber && errors.identityNumber
                                    ? "form-control mr-3 input-font-size input-error"
                                    : "form-control mr-3 input-font-size"
                                }
                                type="text"
                                placeholder="Enter identity number"
                                value={values.identityNumber}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={
                                  values.typeOfIdentityId === ""
                                    ? true
                                    : false
                                }
                              />
                              <div className="input-feedback">{touched.identityNumber && errors.identityNumber}</div>
                            </FormGroup>
                            <FormGroup>
                              <label htmlFor="genderCodeValue">
                                Gender <span className="red"> *</span>
                              </label>
                              <Select
                                value={values.genderCodeValue}
                                className={
                                  touched.genderCodeValue && errors.genderCodeValue
                                    ? "col-12 input-error"
                                    : "col-12"
                                }
                                name="genderCodeValue"
                                onChange={val => setFieldValue("genderCodeValue", val)}
                                onBlur={val => setFieldTouched("genderCodeValue", val)}
                                showSearch
                                filterOption={(input, option) =>
                                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                size="large"
                              >
                                <Option value="">Select gender</Option>
                                {
                                  Array.isArray(this.state.genderOptions) && this.state.genderOptions.length > 0
                                    ? this.state.genderOptions.map((option, i) => {
                                      return (
                                        <Option value={option.name} key={"Gender option " + i} >{option.description}</Option>
                                      )
                                    })
                                    : ""
                                }
                              </Select>
                              <div className="input-feedback">{touched.genderCodeValue && errors.genderCodeValue}</div>
                            </FormGroup>

                            <FormGroup>
                              <label htmlFor="dateOfBirth">
                                Date of Birth <span className="red"> *</span>
                              </label>
                              <Field
                                name="dateOfBirth"
                                onChange={handleChange}
                                component={DateTime}
                                locale={this.props.dashboard.language}
                                value={values.dateOfBirth}
                                touched={touched.dateOfBirth}
                                error={errors.dateOfBirth}
                              />
                              <div className="input-feedback">{touched.dateOfBirth && errors.dateOfBirth}</div>
                            </FormGroup>

                            <FormGroup>
                              <label htmlFor="placeOfBirth">
                                Place of Birth <span className="red"> *</span>
                              </label>
                              <input
                                name="placeOfBirth"
                                className={
                                  touched.placeOfBirth && errors.placeOfBirth
                                    ? "form-control mr-3 input-font-size input-error"
                                    : "form-control mr-3 input-font-size"
                                }
                                type="text"
                                placeholder="Enter place of birth"
                                value={values.placeOfBirth}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              <div className="input-feedback">{touched.placeOfBirth && errors.placeOfBirth}</div>
                            </FormGroup>

                            <FormGroup>
                              <label htmlFor="motherName">
                                Mother's Maiden Name <span className="red"> *</span>
                              </label>
                              <input
                                name="motherName"
                                className={
                                  touched.motherName && errors.motherName
                                    ? "form-control mr-3 input-font-size input-error"
                                    : "form-control mr-3 input-font-size"
                                }
                                type="text"
                                placeholder="Enter mother's maiden name"
                                value={values.motherName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              <div className="input-feedback">{touched.motherName && errors.motherName}</div>
                            </FormGroup>

                            <FormGroup>
                              <label htmlFor="religion">
                                Religion <span className="red"> *</span>
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
                                <Option value="">Select religion</Option>
                                {
                                  Array.isArray(this.state.religionOptions) && this.state.religionOptions.length > 0
                                    ? this.state.religionOptions.map((option, i) => {
                                      return (
                                        <Option value={option.description} key={"Religion option " + i} >{option.description}</Option>
                                      )
                                    })
                                    : ""
                                }
                              </Select>
                              <div className="input-feedback">{touched.religion && errors.religion}</div>
                            </FormGroup>

                            <FormGroup>
                              <label htmlFor="maritalStatusCode">Marital Status</label>
                              <Select
                                value={values.maritalStatusCode}
                                className={
                                  touched.maritalStatusCode && errors.maritalStatusCode
                                    ? "col-12 input-error"
                                    : "col-12"
                                }
                                name="maritalStatusCode"
                                onChange={val => setFieldValue("maritalStatusCode", val)}
                                onBlur={val => setFieldTouched("maritalStatusCode", val)}
                                showSearch
                                filterOption={(input, option) =>
                                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                size="large"
                              >
                                <Option value="">Select marital status</Option>
                                {
                                  Array.isArray(this.state.maritalStatusOption) && this.state.maritalStatusOption.length > 0
                                    ? this.state.maritalStatusOption.map((option, i) => {
                                      return (
                                        <Option value={option.name} key={"Marital option " + i} >{option.description}</Option>
                                      )
                                    })
                                    : ""
                                }
                              </Select>
                            </FormGroup>

                            {
                              values.maritalStatusCode === "Kawin"
                                ? (
                                  <div>
                                    <div className="row justify-content-center">
                                      <hr className="col-6 hr-margin-0" />
                                    </div>

                                    <FormGroup>
                                      <label htmlFor="typeOfIdentitySpouse">
                                        Type Of Identity <span className="red"> *</span>
                                      </label>
                                      <Select
                                        value={values.typeOfIdentitySpouse}
                                        className={
                                          touched.typeOfIdentitySpouse && errors.typeOfIdentitySpouse
                                            ? "col-12 input-error"
                                            : "col-12"
                                        }
                                        name="typeOfIdentitySpouse"
                                        onChange={val => setFieldValue("typeOfIdentitySpouse", val)}
                                        onBlur={val => setFieldTouched("typeOfIdentitySpouse", val)}
                                        showSearch
                                        filterOption={(input, option) =>
                                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                        size="large"
                                      >
                                        <Option value="">Select type of identity</Option>
                                        {
                                          Array.isArray(this.state.typeOfIdentitySpouseOptions) && this.state.typeOfIdentitySpouseOptions.length > 0
                                            ? this.state.typeOfIdentitySpouseOptions.map((option, i) => {
                                              return (
                                                <Option value={option.name} key={"Type of identity bi option " + i} >{option.description}</Option>
                                              )
                                            })
                                            : ""
                                        }
                                      </Select>
                                      <div className="input-feedback">{touched.typeOfIdentitySpouse && errors.typeOfIdentitySpouse}</div>
                                    </FormGroup>

                                    <FormGroup>
                                      <label htmlFor="spouseIdentityNumber">
                                        Spouse Identity Number <span className="red"> *</span>
                                      </label>
                                      <input
                                        name="spouseIdentityNumber"
                                        className={
                                          touched.spouseIdentityNumber && errors.spouseIdentityNumber
                                            ? "form-control mr-3 input-font-size input-error"
                                            : "form-control mr-3 input-font-size"
                                        }
                                        type="text"
                                        placeholder="Enter spouse identity number"
                                        value={values.spouseIdentityNumber}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                      />

                                    </FormGroup>

                                    <FormGroup>
                                      <label htmlFor="spouseName">
                                        Spouse Name <span className="red"> *</span>
                                      </label>
                                      <input
                                        name="spouseName"
                                        className={
                                          touched.spouseName && errors.spouseName
                                            ? "form-control mr-3 input-font-size input-error"
                                            : "form-control mr-3 input-font-size"
                                        }
                                        type="text"
                                        placeholder="Enter spouse name"
                                        value={values.spouseName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                      />
                                      <div className="input-feedback">{touched.spouseName && errors.spouseName}</div>
                                    </FormGroup>

                                    <FormGroup>
                                      <label htmlFor="prePostNuptialAggreement">
                                        Pre-post Nuptial Agreement <span className="red"> *</span>
                                      </label>
                                      <Select
                                        value={values.prePostNuptialAggreement}
                                        className={
                                          touched.prePostNuptialAggreement && errors.prePostNuptialAggreement
                                            ? "col-12 input-error"
                                            : "col-12"
                                        }
                                        name="prePostNuptialAggreement"
                                        onChange={val => setFieldValue("prePostNuptialAggreement", val)}
                                        onBlur={val => setFieldTouched("prePostNuptialAggreement", val)}
                                        showSearch
                                        filterOption={(input, option) =>
                                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                        size="large"
                                      >
                                        <Option value="">Select type of identity</Option>
                                        <Option value="Y">Yes</Option>
                                        <Option value="N">No</Option>
                                      </Select>
                                      <div className="input-feedback">{touched.prePostNuptialAggreement && errors.prePostNuptialAggreement}</div>
                                    </FormGroup>

                                    <FormGroup>
                                      <label htmlFor="dateOfBirthSpouse">
                                        Date of Birth of Spouse <span className="red"> *</span>
                                      </label>
                                      <Field
                                        name="dateOfBirthSpouse"
                                        onChange={handleChange}
                                        component={DateTime}
                                        locale={this.props.dashboard.language}
                                        value={values.dateOfBirthSpouse}
                                        touched={touched.dateOfBirthSpouse}
                                        error={errors.dateOfBirthSpouse}
                                      />
                                      <div className="input-feedback">{touched.dateOfBirthSpouse && errors.dateOfBirthSpouse}</div>
                                    </FormGroup>

                                    <div className="row justify-content-center">
                                      <hr className="col-6 hr-margin-0" />
                                    </div>
                                  </div>
                                )
                                : null
                            }
                          </div>

                          <div className="col-lg-6">
                            <FormGroup>
                              <label htmlFor="staffId">Staff</label>
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
                                <Option value="">Select staff</Option>
                                {
                                  Array.isArray(this.state.staffOptions) && this.state.staffOptions.length > 0
                                    ? this.state.staffOptions.map((option, i) => {
                                      return (
                                        <Option value={option.id} key={"Staff option " + i} >{option.displayName}</Option>
                                      )
                                    })
                                    : ""
                                }
                              </Select>
                            </FormGroup>

                            <FormGroup>
                              <label htmlFor="externalId">External Id</label>
                              <input
                                name="externalId"
                                className="form-control mr-3 input-font-size"
                                type="text"
                                placeholder="Enter external ID"
                                value={values.externalId}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                            </FormGroup>

                            <FormGroup>
                              <label htmlFor="nip">Working ID Number</label>
                              <input
                                name="nip"
                                className="form-control mr-3 input-font-size"
                                type="text"
                                placeholder="Enter working ID number"
                                value={values.nip}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                            </FormGroup>

                            <FormGroup>
                              <label htmlFor="prefixCode">Prefix Title Name</label>
                              <Select
                                value={values.prefixCode}
                                className={
                                  touched.prefixCode && errors.prefixCode
                                    ? "col-12 input-error"
                                    : "col-12"
                                }
                                name="prefixCode"
                                onChange={val => setFieldValue("prefixCode", val)}
                                onBlur={val => setFieldTouched("prefixCode", val)}
                                showSearch
                                filterOption={(input, option) =>
                                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                size="large"
                              >
                                <Option value="">Select prefix title name</Option>
                                {
                                  Array.isArray(state.prefixNameCodeOption) && state.prefixNameCodeOption.length > 0
                                    ? state.prefixNameCodeOption.map((option, i) => {
                                      return (
                                        <Option value={option.code} key={"Prefix option " + i} >{option.code}</Option>
                                      )
                                    })
                                    : ""
                                }
                              </Select>
                            </FormGroup>

                            <FormGroup>
                              <label htmlFor="fullnameNonIdentity">Fullname</label>
                              <input
                                name="fullnameNonIdentity"
                                className={
                                  touched.fullnameNonIdentity && errors.fullnameNonIdentity
                                    ? "form-control mr-3 input-font-size input-error"
                                    : "form-control mr-3 input-font-size"
                                }
                                type="text"
                                placeholder="Enter fullname"
                                value={values.fullnameNonIdentity}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              <div className="input-feedback">{touched.fullnameNonIdentity && errors.fullnameNonIdentity}</div>
                            </FormGroup>

                            <FormGroup>
                              <label htmlFor="nickname">Alias</label>
                              <input
                                name="nickname"
                                className="form-control mr-3 input-font-size"
                                type="text"
                                placeholder="Enter nickname"
                                value={values.nickname}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                            </FormGroup>

                            <FormGroup>
                              <label htmlFor="suffixCode">Suffix Title Name</label>
                              <Select
                                value={values.suffixCode}
                                className={
                                  touched.suffixCode && errors.suffixCode
                                    ? "col-12 input-error"
                                    : "col-12"
                                }
                                name="suffixCode"
                                onChange={val => setFieldValue("suffixCode", val)}
                                onBlur={val => setFieldTouched("suffixCode", val)}
                                showSearch
                                filterOption={(input, option) =>
                                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                size="large"
                              >
                                <Option value="">Select suffix title name</Option>
                                {
                                  Array.isArray(state.suffixNameCodeOption) && state.suffixNameCodeOption.length > 0
                                    ? state.suffixNameCodeOption.map((option, i) => {
                                      return (
                                        <Option value={option.code} key={"Staff option " + i} >{option.code}</Option>
                                      )
                                    })
                                    : ""
                                }
                              </Select>
                            </FormGroup>

                            <FormGroup>
                              <label htmlFor="identityValidDate">
                                Identity Valid Date
                              </label>
                              <Field
                                name="identityValidDate"
                                onChange={handleChange}
                                component={DateTime}
                                locale={this.props.dashboard.language}
                                value={values.identityValidDate}
                              />
                            </FormGroup>

                            <FormGroup>
                              <label htmlFor="mobileNo">
                                Mobile Number
                              </label>
                              <input
                                name="mobileNo"
                                className={
                                  touched.mobileNo && errors.mobileNo
                                    ? "form-control mr-3 input-font-size input-error"
                                    : "form-control mr-3 input-font-size"
                                }
                                type="text"
                                placeholder="Enter mobile number"
                                value={values.mobileNo}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              <div className="input-feedback">{touched.mobileNo && errors.mobileNo}</div>
                            </FormGroup>

                            <FormGroup>
                              <label htmlFor="phoneNumber">Phone Number</label>
                              <input
                                name="phoneNumber"
                                className="form-control mr-3 input-font-size"
                                type="text"
                                placeholder="Enter phone number"
                                value={values.phoneNumber}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                            </FormGroup>

                            <FormGroup>
                              <label htmlFor="faxNumber">Fax Number</label>
                              <input
                                name="faxNumber"
                                className="form-control mr-3 input-font-size"
                                type="text"
                                placeholder="Enter fax number"
                                value={values.faxNumber}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                            </FormGroup>

                            <FormGroup>
                              <label htmlFor="email">Email</label>
                              <input
                                name="email"
                                className={
                                  touched.email && errors.email
                                    ? "form-control mr-3 input-font-size input-error"
                                    : "form-control mr-3 input-font-size"
                                }
                                type="text"
                                placeholder="Enter email"
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              <div className="input-feedback">{touched.email && errors.email}</div>
                            </FormGroup>

                            <FormGroup>
                              <label htmlFor="lastEducationLevelCode">Last Education Level</label>
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
                                <Option value="">Select last education level</Option>
                                {
                                  Array.isArray(this.state.lastEducationLevelCodeOption)
                                    && this.state.lastEducationLevelCodeOption.length > 0
                                    ? this.state.lastEducationLevelCodeOption.map((option, i) => {
                                      return (
                                        <Option value={option.name} key={"Last edu lvl option " + i} >{option.description}</Option>
                                      )
                                    })
                                    : ""
                                }
                              </Select>
                            </FormGroup>

                            <FormGroup>
                              <label htmlFor="lastEducationLevelDescription">Last Education Level Other</label>
                              <input
                                name="lastEducationLevelDescription"
                                className="form-control mr-3 input-font-size"
                                type="text"
                                value={values.lastEducationLevelDescription}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={!state.lasEducationOtherIsActive}
                              />
                            </FormGroup>

                            <FormGroup>
                              <label htmlFor="isCitizen">
                                Is Citizen ? &emsp;
                                <label className="c-checkbox">
                                  <input
                                    name="isCitizen"
                                    type="checkbox"
                                    value={values.isCitizen}
                                    checked={values.isCitizen}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  />
                                  <span className="fa fa-check" />
                                </label>
                              </label>
                            </FormGroup>
                          </div>
                        </form>
                      )
                    }}
                  </Formik>
                </TabPane>

                <TabPane className="ft-detail" tabId="address" role="tabpanel">
                  <Formik
                    initialValues={
                      {
                        addressBasedOnIdentity: state.addressBasedOnIdentity,
                        identityCountryCodeValue: state.identityCountryCodeValue,
                        identityProvinceId: state.identityProvinceId,
                        identityCityId: state.identityCityId,
                        identitySubDistrict: state.identitySubDistrict,
                        identityVillage: state.identityVillage,
                        identityPostalCode: state.identityPostalCode,
                        identityRt: state.identityRt,
                        identityRw: state.identityRw,

                        address: state.address,
                        countryCodeValue: state.countryCodeValue,
                        provinceId: state.provinceId,
                        cityId: state.cityId,
                        subDistrict: state.subDistrict,
                        village: state.village,
                        postalCode: state.postalCode,
                        rt: state.rt,
                        rw: state.rw,

                        homeOwnershipStatus: state.homeOwnershipStatus,
                        otherHomeOwnershipStatus: state.otherHomeOwnershipStatus
                      }
                    }
                    validate={values => {
                      const errors = {};

                      if (!values.addressBasedOnIdentity) {
                        errors.addressBasedOnIdentity = <Trans i18nKey='forms.REQUIRED'>Form is required!</Trans>;
                      }

                      if (!values.identityCountryCodeValue) {
                        errors.identityCountryCodeValue = <Trans i18nKey='forms.REQUIRED'>Form is required!</Trans>;
                      }

                      if (!values.identityProvinceId) {
                        errors.identityProvinceId = <Trans i18nKey='forms.REQUIRED'>Form is required!</Trans>;
                      }

                      if (!values.identityCityId) {
                        errors.identityCityId = <Trans i18nKey='forms.REQUIRED'>Form is required!</Trans>;
                      }

                      if (!values.identitySubDistrict) {
                        errors.identitySubDistrict = <Trans i18nKey='forms.REQUIRED'>Form is required!</Trans>;
                      }

                      if (!values.identityVillage) {
                        errors.identityVillage = <Trans i18nKey='forms.REQUIRED'>Form is required!</Trans>;
                      }

                      if (/^(0|[1-9]\d*)$/.test(values.identityPostalCode) === false && values.identityPostalCode !== "") {
                        errors.identityPostalCode = "Postal Code harus berisi angka 0 sampai 9"
                      } else if (values.identityPostalCode.length !== 5 && values.identityPostalCode !== "") {
                        errors.identityPostalCode = "Postal Code harus berisi 5 angka"
                      }
                      if (!values.identityPostalCode) {
                        errors.identityPostalCode = <Trans i18nKey='forms.REQUIRED'>Form is required!</Trans>;
                      }

                      if (/^(0|[1-9]\d*)$/.test(values.postalCode) === false && values.postalCode !== "") {
                        errors.postalCode = "Postal Code harus berisi angka 0 sampai 9"
                      } else if (values.postalCode.length !== 5 && values.postalCode !== "") {
                        errors.postalCode = "Postal Code harus berisi 5 angka"
                      }

                      if (values.homeOwnershipStatus === "99") {
                        if (!values.otherHomeOwnershipStatus) {
                          errors.otherHomeOwnershipStatus = <Trans i18nKey='forms.REQUIRED'>Form is required!</Trans>;
                        }
                      }


                      if (values.addressBasedOnIdentity) {
                        this.changeState("addressBasedOnIdentity", values.addressBasedOnIdentity)
                      }
                      if (values.identityCountryCodeValue) {
                        this.changeState("identityCountryCodeValue", values.identityCountryCodeValue)
                      }
                      if (values.identityProvinceId) {
                        this.changeState("identityProvinceId", values.identityProvinceId)

                        state.provinceOptions.map(province => {
                          if (province.code === values.identityProvinceId) {
                            this.changeState("identityProvinceName", province.description)
                          }

                          return null
                        })

                        let cityOptions = []

                        this.state.cityOptions.map(city => {
                          if (city.provinceId === values.identityProvinceId) {
                            cityOptions.push(city)
                          }

                          return null
                        })

                        this.setState({
                          identityCityOptionsFilter: cityOptions
                        })
                      }
                      if (values.identityCityId) {
                        this.state.identityCityOptionsFilter.map(city => {
                          if (city.code === values.identityCityId) {
                            this.setState({
                              identityCityId: city.code,
                              identityCityName: city.description
                            })
                          }

                          return null
                        })
                      }
                      if (values.identitySubDistrict) {
                        this.changeState("identitySubDistrict", values.identitySubDistrict)
                      }
                      if (values.identityVillage) {
                        this.changeState("identityVillage", values.identityVillage)
                      }
                      if (values.identityPostalCode) {
                        this.changeState("identityPostalCode", values.identityPostalCode)
                      }
                      if (values.identityRt) {
                        this.changeState("identityRt", values.identityRt)
                      }
                      if (values.identityRw) {
                        this.changeState("identityRw", values.identityRw)
                      }

                      if (values.address) {
                        this.changeState("address", values.address)
                      }
                      if (values.countryCodeValue) {
                        this.changeState("countryCodeValue", values.countryCodeValue)
                      }
                      if (values.provinceId) {
                        this.changeState("provinceId", values.provinceId)

                        state.provinceOptions.map(province => {
                          if (province.code === values.provinceId) {
                            this.changeState("provinceName", province.description)
                          }

                          return null
                        })

                        let cityOptions = []

                        state.cityOptions.map(city => {
                          if (city.provinceId === values.provinceId) {
                            cityOptions.push(city)
                          }

                          return null
                        })

                        this.setState({
                          cityOptionsFilter: cityOptions
                        })
                      }
                      if (values.cityId) {
                        state.cityOptionsFilter.map(city => {
                          if (city.code === values.cityId) {
                            this.setState({
                              cityId: city.code,
                              cityName: city.description
                            })
                          }

                          return null
                        })
                      }
                      if (values.subDistrict) {
                        this.changeState("subDistrict", values.subDistrict)
                      }
                      if (values.village) {
                        this.changeState("village", values.village)
                      }
                      if (values.postalCode) {
                        this.changeState("postalCode", values.postalCode)
                      }
                      if (values.rt) {
                        this.changeState("rt", values.rt)
                      }
                      if (values.rw) {
                        this.changeState("rw", values.rw)
                      }

                      if (values.homeOwnershipStatus) {
                        this.changeState("homeOwnershipStatus", values.homeOwnershipStatus)
                      }
                      if (values.otherHomeOwnershipStatus) {
                        this.changeState("otherHomeOwnershipStatus", values.otherHomeOwnershipStatus)
                      }

                      this.setState({ formAddressErrors: errors })

                      return errors;
                    }}
                    enableReinitialize="true"
                    onSubmit={(val, { setSubmitting }) => {
                      setSubmitting(false)
                    }}
                  >
                    {formikProps => {
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

                      bindFormAddress(submitForm)

                      return (
                        <form id="formAddress" className="form-font-size mt-3" onSubmit={handleSubmit}>
                          <div className="row">
                            <div className="col-lg-6">
                              <p className="lead text-center">Identitas</p>
                              <FormGroup>
                                <label htmlFor="addressBasedOnIdentity">
                                  Address Based on Identity <span className="red"> *</span>
                                </label>
                                <textarea
                                  name="addressBasedOnIdentity"
                                  rows="4"
                                  className={
                                    touched.addressBasedOnIdentity && errors.addressBasedOnIdentity
                                      ? "form-control form-font-size input-error"
                                      : "form-control form-font-size"
                                  }
                                  type="text"
                                  placeholder="Enter office's name"
                                  value={values.addressBasedOnIdentity}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                />
                                <div className="input-feedback">{touched.addressBasedOnIdentity && errors.addressBasedOnIdentity}</div>
                              </FormGroup>

                              <FormGroup>
                                <label htmlFor="identityCountryCodeValue">
                                  Country <span className="red"> *</span>
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
                                  disabled={!this.state.identityCountryIsActive}
                                >
                                  <Option value="">Select country</Option>
                                  {
                                    Array.isArray(this.state.countryOptions) && this.state.countryOptions.length > 0
                                      ? this.state.countryOptions.map((option, i) => {
                                        return (
                                          <Option value={option.name} key={"Country identity option " + i} >{option.description}</Option>
                                        )
                                      })
                                      : ""
                                  }
                                </Select>
                                <div className="input-feedback">{touched.identityCountryCodeValue && errors.identityCountryCodeValue}</div>
                              </FormGroup>

                              <FormGroup>
                                <label htmlFor="identityProvinceId">
                                  Province <span className="red"> *</span>
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
                                  <Option value="">Select province</Option>
                                  {
                                    Array.isArray(this.state.provinceOptions) && this.state.provinceOptions.length > 0
                                      ? this.state.provinceOptions.map((option, i) => {
                                        return (
                                          <Option value={option.code} key={"Province identity option " + i} >{option.description}</Option>
                                        )
                                      })
                                      : ""
                                  }
                                </Select>
                                <div className="input-feedback">{touched.identityProvinceId && errors.identityProvinceId}</div>
                              </FormGroup>

                              <FormGroup>
                                <label htmlFor="identityCityId">
                                  District / City <span className="red"> *</span>
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
                                  <option value="">Select city</option>
                                  {
                                    Array.isArray(this.state.cityOptionsFilter) && this.state.cityOptionsFilter.length > 0
                                      ? this.state.cityOptionsFilter.map((option, i) => {
                                        return (
                                          <Option value={option.code} key={"City identity option " + i} >{option.description}</Option>
                                        )
                                      })
                                      : ""
                                  }
                                </Select>
                                <div className="input-feedback">{touched.identityCityId && errors.identityCityId}</div>
                              </FormGroup>

                              <FormGroup>
                                <label htmlFor="identitySubDistrict">
                                  Sub District <span className="red"> *</span>
                                </label>
                                <input
                                  name="identitySubDistrict"
                                  className={
                                    touched.identitySubDistrict && errors.identitySubDistrict
                                      ? "form-control mr-3 input-font-size input-error"
                                      : "form-control mr-3 input-font-size"
                                  }
                                  type="text"
                                  placeholder="Enter sub district"
                                  value={values.identitySubDistrict}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                />
                                <div className="input-feedback">{touched.identitySubDistrict && errors.identitySubDistrict}</div>
                              </FormGroup>

                              <FormGroup>
                                <label htmlFor="identityVillage">
                                  Village <span className="red"> *</span>
                                </label>
                                <input
                                  name="identityVillage"
                                  className={
                                    touched.identityVillage && errors.identityVillage
                                      ? "form-control mr-3 input-font-size input-error"
                                      : "form-control mr-3 input-font-size"
                                  }
                                  type="text"
                                  placeholder="Enter village"
                                  value={values.identityVillage}
                                  onChange={e => this.changeState("identityVillage", e.target.value)}
                                />
                                <div className="input-feedback">{touched.identityVillage && errors.identityVillage}</div>
                              </FormGroup>

                              <FormGroup>
                                <label htmlFor="identityPostalCode">
                                  Postal Code <span className="red"> *</span>
                                </label>
                                <input
                                  name="identityPostalCode"
                                  className={
                                    touched.identityPostalCode && errors.identityPostalCode
                                      ? "form-control mr-3 input-font-size input-error"
                                      : "form-control mr-3 input-font-size"
                                  }
                                  type="text"
                                  placeholder="Enter postal code"
                                  value={values.identityPostalCode}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                />
                                <div className="input-feedback">{touched.identityPostalCode && errors.identityPostalCode}</div>
                              </FormGroup>

                              <div className="row">
                                <FormGroup className="col-6">
                                  <label htmlFor="identityRt">RT</label>
                                  <input
                                    name="identityRt"
                                    className="form-control mr-3 input-font-size"
                                    type="text"
                                    placeholder="Enter RT"
                                    value={values.identityRt}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  />
                                </FormGroup>

                                <FormGroup className="col-6">
                                  <label htmlFor="identityRw">RW</label>
                                  <input
                                    name="identityRw"
                                    className="form-control mr-3 input-font-size"
                                    type="text"
                                    placeholder="Enter RW"
                                    value={values.identityRw}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  />
                                </FormGroup>
                              </div>
                            </div>

                            <div className="col-lg-6">
                              <p className="lead text-center">Domisili</p>
                              <FormGroup>
                                <div>
                                  <label htmlFor="address">Domicile Address</label>
                                </div>
                                <textarea
                                  name="address"
                                  className="form-control mr-3 form-font-size"
                                  rows="4"
                                  type="text"
                                  placeholder="Enter address"
                                  value={values.address}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                />
                              </FormGroup>

                              <FormGroup>
                                <label htmlFor="countryCodeValue">Country</label>
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
                                  disabled={!this.state.countryIsActive}
                                >
                                  <Option value="">Select country</Option>
                                  {
                                    Array.isArray(this.state.countryOptions) && this.state.countryOptions.length > 0
                                      ? this.state.countryOptions.map((option, i) => {
                                        return (
                                          <Option value={option.name} key={"Country option " + i} >{option.description}</Option>
                                        )
                                      })
                                      : ""
                                  }
                                </Select>
                              </FormGroup>

                              <FormGroup>
                                <label htmlFor="provinceId">Province</label>
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
                                  <Option value="">Select province</Option>
                                  {
                                    Array.isArray(state.provinceOptions) && state.provinceOptions.length > 0
                                      ? state.provinceOptions.map((option, i) => {
                                        return (
                                          <Option value={option.code} key={"Province option " + i} >{option.description}</Option>
                                        )
                                      })
                                      : ""
                                  }
                                </Select>
                              </FormGroup>

                              <FormGroup>
                                <label htmlFor="cityId">District / City</label>
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
                                  <Option value="">Select city</Option>
                                  {
                                    Array.isArray(state.cityOptionsFilter) && state.cityOptionsFilter.length > 0
                                      ? state.cityOptionsFilter.map((option, i) => {
                                        return (
                                          <Option value={option.code} key={"City option " + i} >{option.description}</Option>
                                        )
                                      })
                                      : ""
                                  }
                                </Select>
                              </FormGroup>

                              <FormGroup>
                                <label htmlFor="subDistrict">Sub District</label>
                                <input
                                  name="subDistrict"
                                  className="form-control mr-3 input-font-size"
                                  type="text"
                                  placeholder="Enter sub district"
                                  value={values.subDistrict}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                />
                              </FormGroup>

                              <FormGroup>
                                <label htmlFor="village">Village</label>
                                <input
                                  name="village"
                                  className="form-control mr-3 input-font-size"
                                  type="text"
                                  placeholder="Enter village"
                                  value={values.village}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                />
                              </FormGroup>

                              <FormGroup>
                                <label htmlFor="postalCode">Postal Code</label>
                                <input
                                  name="postalCode"
                                  className={
                                    touched.postalCode && errors.postalCode
                                      ? "form-control mr-3 input-font-size input-error"
                                      : "form-control mr-3 input-font-size"
                                  }
                                  type="text"
                                  placeholder="Enter postal code"
                                  value={values.postalCode}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                />
                                <div className="input-feedback">{touched.postalCode && errors.postalCode}</div>
                              </FormGroup>

                              <div className="row">
                                <FormGroup className="col-6">
                                  <label htmlFor="rt">RT</label>
                                  <input
                                    name="rt"
                                    className="form-control mr-3 input-font-size"
                                    type="text"
                                    placeholder="Enter RT"
                                    value={values.rt}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  />
                                </FormGroup>

                                <FormGroup className="col-6">
                                  <label htmlFor="rw">RW</label>
                                  <input
                                    name="rw"
                                    className="form-control mr-3 input-font-size"
                                    type="text"
                                    placeholder="Enter RW"
                                    value={values.rw}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  />
                                </FormGroup>
                              </div>
                            </div>
                          </div>

                          <div>
                            <FormGroup>
                              <label htmlFor="homeOwnershipStatus">Home Ownership Status</label>
                              <Select
                                value={values.homeOwnershipStatus}
                                className={
                                  touched.homeOwnershipStatus && errors.homeOwnershipStatus
                                    ? "col-12 input-error"
                                    : "col-12"
                                }
                                name="homeOwnershipStatus"
                                onChange={val => setFieldValue("homeOwnershipStatus", val)}
                                onBlur={val => setFieldTouched("homeOwnershipStatus", val)}
                                showSearch
                                filterOption={(input, option) =>
                                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                size="large"
                              >
                                <Option value="">Select Home Ownership Status</Option>
                                {
                                  Array.isArray(this.state.homeOwnershipStatusOption) && this.state.homeOwnershipStatusOption.length > 0
                                    ? this.state.homeOwnershipStatusOption.map((option, i) => {
                                      return (
                                        <Option value={option.id} key={"Home Ownership option " + i} >{option.description}</Option>
                                      )
                                    })
                                    : ""
                                }
                              </Select>
                            </FormGroup>
                            {
                              values.homeOwnershipStatus === "99"
                                ? (
                                  <FormGroup>
                                    <label htmlFor="otherHomeOwnershipStatus">
                                      Other Home Ownership Status <span className="red"> *</span>
                                    </label>
                                    <input
                                      name="otherHomeOwnershipStatus"
                                      className={
                                        touched.otherHomeOwnershipStatus && errors.otherHomeOwnershipStatus
                                          ? "form-control mr-3 input-font-size input-error"
                                          : "form-control mr-3 input-font-size"
                                      }
                                      type="text"
                                      placeholder="Enter RW"
                                      value={values.otherHomeOwnershipStatus}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                    />
                                    <div className="input-feedback">{touched.otherHomeOwnershipStatus && errors.otherHomeOwnershipStatus}</div>
                                  </FormGroup>
                                )
                                : ""
                            }
                          </div>
                        </form>
                      )
                    }}
                  </Formik>
                </TabPane>

                <TabPane className="ft-detail" tabId="others" role="tabpanel">
                  <Formik
                    initialValues={
                      {
                        taxNumber: state.taxNumber,
                        taxName: state.taxName,
                        taxAddress: state.taxAddress,

                        flagTaxCodeValue: state.flagTaxCodeValue,
                        merchantInformationCode: state.merchantInformationCode,
                        merchantCategoryCode: state.merchantCategoryCode,
                        mobileUser: state.mobileUser,
                        submittedOnDate: state.submittedOnDate
                      }
                    }
                    validate={values => {
                      const errors = {};

                      if (/^(0|[1-9]\d*)$/.test(values.taxNumber) === false && values.taxNumber !== "") {
                        errors.taxNumber = "Tax Number harus berisi angka 0 sampai 9"
                      } else if (values.taxNumber.length > 15) {
                        errors.taxNumber = "Tax Number harus <= 15 angka"
                      }
                      if (!values.taxNumber) {
                        errors.taxNumber = <Trans i18nKey='forms.REQUIRED'>Form is required!</Trans>;
                      }

                      if (/^[a-zA-Z\s'.-]+$/.test(values.taxName) === false) {
                        errors.taxName = "Name based on tax harus terdiri dari alphanumeric (a-zA-Z\\s\\'.-)"
                      }
                      if (!values.taxName) {
                        errors.taxName = <Trans i18nKey='forms.REQUIRED'>Form is required!</Trans>;
                      }

                      if (!values.taxAddress) {
                        errors.taxAddress = <Trans i18nKey='forms.REQUIRED'>Form is required!</Trans>;
                      }

                      if (!values.flagTaxCodeValue) {
                        errors.flagTaxCodeValue = <Trans i18nKey='forms.REQUIRED'>Form is required!</Trans>;
                      }

                      if (!values.submittedOnDate) {
                        errors.submittedOnDate = <Trans i18nKey='forms.REQUIRED'>Form is required!</Trans>;
                      }


                      if (values.taxNumber) {
                        this.changeState("taxNumber", values.taxNumber)
                      }
                      if (values.taxName) {
                        this.changeState("taxName", values.taxName)
                      }
                      if (values.taxAddress) {
                        this.changeState("taxAddress", values.taxAddress)
                      }
                      if (values.flagTaxCodeValue) {
                        this.changeState("flagTaxCodeValue", values.flagTaxCodeValue)
                      }
                      if (values.merchantInformationCode) {
                        this.changeState("merchantInformationCode", values.merchantInformationCode)
                      }
                      if (values.merchantCategoryCode) {
                        this.changeState("merchantCategoryCode", values.merchantCategoryCode)
                      }
                      if (values.mobileUser) {
                        this.changeState("mobileUser", values.mobileUser)
                      }
                      if (values.submittedOnDate) {
                        this.changeState("submittedOnDate", values.submittedOnDate)
                      }

                      this.setState({ formOthersErrors: errors })

                      return errors;
                    }}
                    enableReinitialize="true"
                    onSubmit={(val, { setSubmitting }) => {
                      setSubmitting(false)
                    }}
                  >
                    {formikProps => {
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

                      bindFormOthers(submitForm)

                      return (
                        <form id="formOthers" className="form-font-size mt-3" onSubmit={handleSubmit}>
                          <div className="row">
                            <div className="col-lg-6">
                              <FormGroup>
                                <label htmlFor="taxNumber">
                                  Tax Number <span className="red"> *</span>
                                </label>
                                <input
                                  name="taxNumber"
                                  className={
                                    touched.taxNumber && errors.taxNumber
                                      ? "form-control mr-3 input-font-size input-error"
                                      : "form-control mr-3 input-font-size"
                                  }
                                  type="text"
                                  placeholder="Enter Tax Number"
                                  value={values.taxNumber}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                />
                                <div className="input-feedback">{touched.taxNumber && errors.taxNumber}</div>
                              </FormGroup>

                              <FormGroup>
                                <label htmlFor="taxName">
                                  Name Based on Tax <span className="red"> *</span>
                                </label>
                                <input
                                  name="taxName"
                                  className={
                                    touched.taxName && errors.taxName
                                      ? "form-control mr-3 input-font-size input-error"
                                      : "form-control mr-3 input-font-size"
                                  }
                                  type="text"
                                  placeholder="Enter Tax Number"
                                  value={values.taxName}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                />
                                <div className="input-feedback">{touched.taxName && errors.taxName}</div>
                              </FormGroup>
                            </div>

                            <div className="col-lg-6">
                              <FormGroup>
                                <label htmlFor="taxAddress">
                                  Address Based on Tax
                                </label>
                                <textarea
                                  name="taxAddress"
                                  className={
                                    touched.taxAddress && errors.taxAddress
                                      ? "form-control mr-3 form-font-size input-error"
                                      : "form-control mr-3 form-font-size"
                                  }
                                  rows="4"
                                  type="text"
                                  placeholder="Enter Tax Address"
                                  value={values.taxAddress}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                />
                                <div className="input-feedback">{touched.taxAddress && errors.taxAddress}</div>
                              </FormGroup>
                            </div>
                          </div>

                          <hr className="col-6" />

                          <div className="row">
                            <div className="col-lg-6">
                              <FormGroup>
                                <label htmlFor="flagTaxCodeValue">
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
                                  <Option value="">Select Flag Tax</Option>
                                  {
                                    Array.isArray(this.state.flagTaxOptions) && this.state.flagTaxOptions.length > 0
                                      ? this.state.flagTaxOptions.map((option, i) => {
                                        return (
                                          <Option value={option.name} key={"Flag Tax option " + i} >{option.description}</Option>
                                        )
                                      })
                                      : ""
                                  }
                                </Select>
                                <div className="input-feedback">{touched.flagTaxCodeValue && errors.flagTaxCodeValue}</div>
                              </FormGroup>

                              <FormGroup>
                                <label htmlFor="merchantInformationCode">Merchant Account Information Code</label>
                                <Select
                                  value={values.merchantInformationCode}
                                  className={
                                    touched.merchantInformationCode && errors.merchantInformationCode
                                      ? "col-12 input-error"
                                      : "col-12"
                                  }
                                  name="merchantInformationCode"
                                  onChange={val => setFieldValue("merchantInformationCode", val)}
                                  onBlur={val => setFieldTouched("merchantInformationCode", val)}
                                  showSearch
                                  filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                  }
                                  size="large"
                                >
                                  <Option value="">Select Merchant Account Information Code</Option>
                                  {
                                    Array.isArray(this.state.merchantInformationCodeOption) && this.state.merchantInformationCodeOption.length > 0
                                      ? this.state.merchantInformationCodeOption.map((option, i) => {
                                        return (
                                          <Option value={option.code} key={"Merchant Acc info option " + i} >{option.code + " - " + option.description}</Option>
                                        )
                                      })
                                      : ""
                                  }
                                </Select>
                              </FormGroup>

                              <FormGroup>
                                <label htmlFor="merchantCategoryCode">Merchant Category</label>
                                <Select
                                  value={values.merchantCategoryCode}
                                  className={
                                    touched.merchantCategoryCode && errors.merchantCategoryCode
                                      ? "col-12 input-error"
                                      : "col-12"
                                  }
                                  name="merchantCategoryCode"
                                  onChange={val => setFieldValue("merchantCategoryCode", val)}
                                  onBlur={val => setFieldTouched("merchantCategoryCode", val)}
                                  showSearch
                                  filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                  }
                                  size="large"
                                >
                                  <Option value="">Select Merchant Category</Option>
                                  {
                                    Array.isArray(this.state.merchantCategoryOption) && this.state.merchantCategoryOption.length > 0
                                      ? this.state.merchantCategoryOption.map((option, i) => {
                                        return (
                                          <Option value={option.code} key={"Merchant category option " + i} >{option.code + " - " + option.description}</Option>
                                        )
                                      })
                                      : ""
                                  }
                                </Select>
                              </FormGroup>
                            </div>

                            <div className="col-lg-6">
                              <FormGroup>
                                <label htmlFor="mobileUser">Mobile Username</label>
                                <input
                                  name="mobileUser"
                                  className="form-control mr-3 form-font-size"
                                  type="text"
                                  placeholder="Enter Mobile Username"
                                  value={values.mobileUser}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  readOnly disabled
                                />
                              </FormGroup>

                              <FormGroup>
                                <label htmlFor="submittedOnDate">
                                  Submitted on
                                </label>
                                <Field
                                  name="submittedOnDate"
                                  onChange={handleChange}
                                  component={DateTime}
                                  locale={this.props.dashboard.language}
                                  value={values.submittedOnDate}
                                  touched={touched.submittedOnDate}
                                  error={errors.submittedOnDate}
                                  dateParam={state.submittedOnDateStatic}
                                />
                                <div className="input-feedback">{touched.dateOfBirthSpouse && errors.dateOfBirthSpouse}</div>
                              </FormGroup>
                            </div>
                          </div>
                        </form>
                      )
                    }}
                  </Formik>
                </TabPane>
              </TabContent>
            </div>

            <Button className="mt-4 mb-2 col-12" color="warning"
              type="submit" onClick={() => {
                handleSubmitForm()
              }}
            >
              Edit Member
            </Button>
          </CardBody>
        </Card>
      </ContentWrapper >
    )
  }
}


MemberDataEdit.propTypes = {
  actions: PropTypes.object,
  dashboard: PropTypes.object,
  memberData: PropTypes.object,
  search: PropTypes.object,
  settings: PropTypes.object
}

const mapStateToProps = state => ({
  dashboard: state.dashboard,
  memberData: state.memberData,
  search: state.search,
  settings: state.settings
})
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) })

export default compose(connect(mapStateToProps, mapDispatchToProps), withTranslation('translations'))(withRouter(MemberDataEdit))