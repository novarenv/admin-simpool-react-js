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
  TabPane,
  FormGroup
} from 'reactstrap';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import ContentWrapper from '../../../components/Layout/ContentWrapper';

// DateTimePicker
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';

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

class MemberDataEdit extends Component {
  constructor(props) {
    super(props);

    const clientIdNo = this.props.match.params.id

    const setClientDetail = res => {
      console.log(res)

      let cityOptions = []
      let identityCityOptions = []

      res.cityOptions.map(city => {
        if (city.provinceId === res.identityProvince.code) {
          identityCityOptions.push(city)
        }

        if (city.provinceId === res.province.code) {
          cityOptions.push(city)
        }
      })


      res.lastEducationLevelCode.code === "Other"
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
        })

        return day + " " + monthMMMM + " " + year
      }

      const dateOfBirthSpouse = dateOfBirthSpouseConv(res.biInformation.dateOfBirthSpouse)

      this.setState({
        accountNo: res.accountNo,
        activationDate: res.activationDate[2] + " " + MONTHS_ID[res.activationDate[1]-1] + " " + res.activationDate[0],
        active: res.active,
        address: res.address,
        addressBasedOnIdentity: res.addressBasedOnIdentity,
        nickname: res.nickname,
        cityId: res.city.code,
        cityName: res.city.description,
        cityOptions: res.cityOptions,
        cityOptionsFilter: cityOptions,
        clientIdNo: clientIdNo,
        clientNonPersonDetails: {
          ...this.state.clientNonPersonDetails,
          businessType: res.clientNonPersonDetails.businessType,
          corporateId: res.clientNonPersonDetails.corporateId,
          isLjk: res.clientNonPersonDetails.isLjk,
          ljkCode: res.clientNonPersonDetails.ljkCode,
          bankFlag: res.clientNonPersonDetails.bankFlag,
          incorporationDate: res.clientNonPersonDetails.incorporationDate,
          incorpValidityTillDate: res.clientNonPersonDetails.incorpValidityTillDate,
          publicationDate: res.clientNonPersonDetails.publicationDate,
          legalityEndDate: res.clientNonPersonDetails.legalityEndDate
        },
        clientType: res.legalForm.value,
        clientTypeIsActive: res.clientType.isActive,
        clientTypeOptions: res.clientTypeOptions,
        company: res.company.name,
        country: res.country.name,
        countryOptions: res.countryOptions,
        countryIsActive: res.country.isActive,
        dateOfBirth: res.dateOfBirth[2] + " " + MONTHS_ID[res.dateOfBirth[1] - 1] + " " + res.dateOfBirth[0],
        dateOfBirthSpouse: dateOfBirthSpouse,
        directorate: res.directorate.name,
        email: res.email,
        externalId: res.externalId,
        faxNumber: res.faxNumber,
        firstname: res.firstname,
        flagTax: res.flagTax.name,
        flagTaxOptions: res.flagTaxOptions,
        fullname: res.fullnameNonIdentity,
        gender: res.gender.name,
        genderOptions: res.genderOptions,
        homeOwnershipStatus: res.homeOwnershipStatus.id,
        homeOwnershipStatusOption: res.homeOwnershipStatusOption,
        identityCityId: res.identityCity.code,
        identityCityName: res.identityCity.description,
        identityCityOptionsFilter: identityCityOptions,
        identityName: res.fullname,
        identityNumber: res.identityNumber,
        identityCountry: res.identityCountry.name,
        identityCountryIsActive: res.identityCountry.isActive,
        identityPostalCode: res.identityPostalCode,
        identityProvinceId: res.identityProvince.code,
        identityProvinceName: res.identityProvince.description,
        identityRt: res.identityRt,
        identityRw: res.identityRw,
        identitySubDistrict: res.identitySubDistrict,
        identityValidDate: res.identityValidDate,
        identityVillage: res.identityVillage,
        isCitizen: res.isCitizen,
        lastname: res.lastname,
        lastEducationLevelCode: res.lastEducationLevelCode.name,
        lastEducationLevelCodeOption: res.lastEducationLevelCodeOption,
        lastEducationLevelDescription: res.lastEducationLevelDescription,
        legalFormId: res.legalForm.id,
        maritalStatus: res.maritalStatusCode.name,
        maritalStatusOption: res.maritalStatusCodeOption,
        member: res.member,
        merchantCategoryCode: res.merchantCategoryCode,
        merchantCategoryOption: res.merchantCategoryOption,
        merchantInformationCode: res.merchantInformationCode,
        merchantInformationCodeOption: res.merchantInformationCodeOption,
        middlename: res.middlename,
        mobileNo: res.mobileNo,
        mobileUser: res.mobileUser,
        motherName: res.motherName,
        nip: res.nip,
        office: res.officeId,
        officeOptions: res.officeOptions,
        otherHomeOwnershipStatus: res.otherHomeOwnershipStatus,
        phoneNumber: res.phoneNumber,
        placeOfBirth: res.placeOfBirth,
        postalCode: res.postalCode,
        prefix: res.prefixDescription.code,
        prefixNameCodeOption: res.prefixNameCodeOption,
        prePostNuptialAggreement: res.biInformation.prePostNuptialAggreement,
        provinceId: res.province.code,
        provinceName: res.province.description,
        provinceOptions: res.provinceOptions,
        religion: res.religion.description,
        religionOptions: res.religionOption,
        rt: res.rt,
        rw: res.rw,
        sector: res.sector.code,
        sectorOptions: res.sectorOptions,
        spouseIdentityNumber: res.biInformation.spouseIdentityNumber,
        spouseName: res.biInformation.spouseName,
        staff: res.staffId,
        staffOptions: res.staffOptions,
        submittedOnDate: res.timeline.submittedOnDate[2] + " " + MONTHS_ID[res.timeline.submittedOnDate[1] - 1] + " " + res.timeline.submittedOnDate[0],
        subDistrict: res.subDistrict,
        suffix: res.suffixDescription.code,
        suffixNameCodeOption: res.suffixNameCodeOption,
        taxAddress: res.taxAddress,
        taxName: res.taxName,
        taxNumber: res.taxNumber,
        typeOfIdentity: res.typeOfIdentity.name,
        typeOfIdentityOptions: res.typeOfIdentityOptions,
        typeOfIdentityBi: res.biInformation.typeOfIdentity,
        typeOfIdentityBiOptions: res.typeOfIdentityBiOptions,
        village: res.village
      })
    }

    this.props.actions.getClientDetailParams(clientIdNo, setClientDetail)

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
      clientIdNo: '',
      clientNonPersonDetails: {},
      clientType: "",
      clientTypeIsActive: false,
      clientTypeOptions: [],
      company: '',
      country: '',
      countryOptions: [],
      countryIsActive: false,
      dateOfBirth: "",
      dateOfBirthSpouse: [],
      directorate: '',
      email: '',
      externalId: '',
      faxNumber: '',
      firstname: '',
      flagTax: '',
      flagTaxOptions: [],
      fullname: '',
      gender: '',
      genderOptions: [],
      homeOwnershipStatus: '',
      homeOwnershipStatusOption: [],
      identityCityId: '',
      identityCityName: '',
      identityCityOptionsFilter: [],
      identityCountry: '',
      identityCountryIsActive: false,
      identityName: '',
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
      legalFormId: '',
      maritalStatus: '',
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
      office: "",
      officeOptions: [],
      otherHomeOwnershipStatus: '',
      phoneNumber: '',
      placeOfBirth: '',
      postalCode: '',
      prefix: '',
      prefixNameCodeOption: [],
      prePostNuptialAggreement: "",
      provinceId: '',
      provinceName: '',
      provinceOptions: [],
      religion: '',
      religionOption: [],
      rt: '',
      rw: '',
      sector: "",
      sectorOptions: [],
      spouseIdentityNumber: '',
      spouseName: '',
      staff: "",
      staffOptions: [],
      submittedOnDate: "",
      subDistrict: '',
      suffix: "",
      suffixNameCodeOption: [],
      taxAddress: '',
      taxName: '',
      taxNumber: '',
      typeOfIdentity: "",
      typeOfIdentityBi: "",
      typeOfIdentityOptions: [],
      typeOfIdentityBiOptions: [],
      village: '',
    };
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

    if (name === "identityProvinceId" || name === "provinceId") {
      let cityOptions = []

      this.state.cityOptions.map(city => {
        if (city.provinceId === val) {
          cityOptions.push(city)
        }
      })

      if (name === "provinceId") {
        this.setState({
          cityOptionsFilter: cityOptions
        })
        this.state.provinceOptions.map(province => {
          if (province.code === val) {
            this.setState({
              provinceName: province.description
            })
          }
        })
      }
      else if (name === "identityProvinceId") {
        this.setState({
          identityCityOptionsFilter: cityOptions
        })
        this.state.provinceOptions.map(province => {
          if (province.code === val) {
            this.setState({
              identityProvinceName: province.description
            })
          }
        })
      }
    }

    if (name === "lastEducationLevelCode") {
      if (val === "Other") {
        this.setState({
          lasEducationOtherIsActive: true
        })
      } else {
        this.setState({
          lastEducationLevelDescription: '',
          lasEducationOtherIsActive: false
        })
      }
    }

    if (name === "cityId") {
      this.state.cityOptionsFilter.map(city => {
        if (city.code === val){
          this.setState({
            cityName: city.description
          })
        }
      })
    }

    if (name === "identityCityId") {
      this.state.cityOptionsFilter.map(city => {
        if (city.code === val){
          console.log(city.description)
          this.setState({
            identityCityName: city.description
          })
        }
      })
    }

    if (name === "isCitizen") {
      this.setState({
        isCitizen: !this.state.isCitizen
      })
    }
    
    if (name === "identityName") {
      const fullnameSplit = val.split(" ", 3)
      this.setState({
        firstname: fullnameSplit[0],
        middlename: fullnameSplit[1],
        lastname: fullnameSplit[2]
      })
    }
  }

  onSubmit = e => {
    console.log('Form submitted..');
    e.preventDefault();
  }

  render() {
    const state = this.state

    const setClientPutRes = res => {
      this.props.history.push("/simpool/member/data-detail/" + this.state.clientIdNo)
    }

    const editMember = () => {
      this.props.actions.putClientId(
        {
          "officeId": state.office,
          "legalForm": state.clientType,
          "firstname": state.firstname,
          "middlename": state.middlename,
          "lastname": state.lastname,
          "active": state.active,
          "accountNo": state.accountNo,
          "staffId": state.staff,
          "externalId": state.externalId,
          "mobileNo": state.mobileNo,
          "genderCodeValue": state.gender,
          "address": state.address,
          "typeOfIdentityId": state.typeOfIdentity,
          "provinceId": state.provinceId,
          "provinceName": state.provinceName,
          "cityId": state.cityId,
          "cityName": state.cityName,
          "countryCodeValue": state.country,
          "flagTaxCodeValue": state.flagTax,
          "placeOfBirth": state.placeOfBirth,
          "motherName": state.motherName,
          "sectorId": state.sector,
          "mobileUser": state.mobileUser,
          "nip": state.nip,
          "identityNumber": state.identityNumber,
          "postalCode": state.postalCode,
          "fullname": state.identityName,
          "member": state.member,
          "directorateCode": state.directorate,
          "companyCode": state.company,
          "addressBasedOnIdentity": state.addressBasedOnIdentity,
          "phoneNumber": state.phoneNumber,
          "religion": state.religion,
          "email": state.email,
          "merchantCategoryCode": state.merchantCategoryCode,
          "merchantInformationCode": state.merchantInformationCode,
          "spouseIdentityNumber": state.spouseIdentityNumber,
          "spouseName": state.spouseName,
          "prePostNuptialAggreement": state.prePostNuptialAggreement,
          "typeOfIdentitySpouse": state.typeOfIdentityBi,
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
          "prefixCode": state.prefix,
          "suffixCode": state.suffix,
          "nickname": state.nickname,
          "identityValidDate": state.identityValidDate,
          "maritalStatusCode": state.maritalStatus,
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
          "identityCountryCodeValue": state.identityCountry,
          "identityRt": state.identityRt,
          "identityRw": state.identityRw,
          "fullnameNonIdentity": state.fullname,
          "otherHomeOwnershipStatus": state.otherHomeOwnershipStatus,
          "homeOwnershipStatus": state.homeOwnershipStatus,
          "legalFormId": state.legalFormId,
          "locale": "id",
          "dateFormat": "dd MMMM yyyy",
          "activationDate": state.activationDate,
          "dateOfBirth": state.dateOfBirth,
          "submittedOnDate": state.submittedOnDate,
          "dateOfBirthSpouse": state.dateOfBirthSpouse
        },
        setClientPutRes,
        this.state.clientIdNo
      )
    }

    return (
      <ContentWrapper>
        <div className="content-heading">
          <div>Edit Member Data</div>
        </div>

        <Card className="card-default">
          <CardBody>
            <Link to="/simpool/member/data">
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
                  <form className="form-font-size mt-3 row" onSubmit={this.onSubmit}>
                    <div className="col-lg-6">
                      <FormGroup>
                        <label htmlFor="office">Office</label>
                        <select value={this.state.office}
                          className="custom-select custom-select-sm input-font-size" name="office"
                          onChange={e => this.changeState("office", e.target.value)}
                          disabled readOnly
                        >
                          <option value="">Select office</option>
                          {
                            Array.isArray(this.state.officeOptions) && this.state.officeOptions.length > 0
                              ? this.state.officeOptions.map((option, i) => {
                                return (
                                  <option value={option.id} key={"Office option " + i} >{option.name}</option>
                                )
                              })
                              : null
                          }
                        </select>
                      </FormGroup>

                      <FormGroup>
                        <label htmlFor="staff">Staff</label>
                        <select value={this.state.staff}
                          className="custom-select custom-select-sm input-font-size" name="staff"
                          onChange={e => this.changeState("staff", e.target.value)}
                        >
                          <option value="">Select staff</option>
                          {
                            Array.isArray(this.state.staffOptions) && this.state.staffOptions.length > 0
                              ? this.state.staffOptions.map((option, i) => {
                                return (
                                  <option value={option.id} key={"Staff option " + i} >{option.displayName}</option>
                                )
                              })
                              : null
                          }
                        </select>
                      </FormGroup>

                      <FormGroup>
                        <label htmlFor="clientType">Client Type</label>
                        <select value={this.state.clientType}
                          className="custom-select custom-select-sm input-font-size" name="clientType"
                          onChange={e => this.changeState("clientType", e.target.value)} disabled={!this.state.clientTypeIsActive}
                        >
                          <option value="">Select client type</option>
                          <option value={this.state.clientType}>{this.state.clientType}</option>
                          {
                            Array.isArray(this.state.clientTypeOptions) && this.state.clientTypeOptions.length > 0
                              ? this.state.clientTypeOptions.map((option, i) => {
                                return (
                                  <option value={option.displayName} key={"Client type option " + i} >{option.displayName}</option>
                                )
                              })
                              : null
                          }
                        </select>
                      </FormGroup>

                      <FormGroup>
                        <label htmlFor="sector">Sector</label>
                        <select value={this.state.sector}
                          className="custom-select custom-select-sm input-font-size" name="sector"
                          onChange={e => this.changeState("sector", e.target.value)}
                        >
                          <option value="">Select sector</option>
                          {
                            Array.isArray(this.state.sectorOptions) && this.state.sectorOptions.length > 0
                              ? this.state.sectorOptions.map((option, i) => {
                                return (
                                  <option value={option.code} key={"Sector option " + i} >{option.name}</option>
                                )
                              })
                              : null
                          }
                        </select>
                      </FormGroup>

                      <FormGroup>
                        <label htmlFor="externalId">External Id</label>
                        <input className="form-control mr-3 input-font-size" type="text" placeholder="Enter external ID"
                          value={this.state.externalId} onChange={e => this.changeState("externalId", e.target.value)}
                        />
                      </FormGroup>

                      <FormGroup>
                        <label htmlFor="nip">Working ID Number</label>
                        <input className="form-control mr-3 input-font-size" type="text" placeholder="Enter working ID number"
                          value={this.state.nip} onChange={e => this.changeState("nip", e.target.value)}
                        />
                      </FormGroup>

                      <FormGroup>
                        <label htmlFor="prefix">Prefix Title Name</label>
                        <select value={this.state.prefix}
                          className="custom-select custom-select-sm input-font-size" name="prefix"
                          onChange={e => this.changeState("prefix", e.target.value)}
                        >
                          <option value="">Select prefix title name</option>
                          {
                            Array.isArray(this.state.prefixNameCodeOption) && this.state.prefixNameCodeOption.length > 0
                              ? this.state.prefixNameCodeOption.map((option, i) => {
                                return (
                                  <option value={option.code} key={"Prefix option " + i} >{option.code}</option>
                                )
                              })
                              : null
                          }
                        </select>
                      </FormGroup>

                      <FormGroup>
                        <label htmlFor="identityName">Identity Name</label>
                        <input className="form-control mr-3 input-font-size" type="text" placeholder="Enter identity's name"
                          value={this.state.identityName} onChange={e => this.changeState("identityName", e.target.value)}
                        />
                      </FormGroup>

                      <FormGroup>
                        <label htmlFor="fullname">Full Name</label>
                        <input className="form-control mr-3 input-font-size" type="text" placeholder="Enter office's name"
                          value={this.state.fullname} onChange={e => this.changeState("fullname", e.target.value)}
                        />
                      </FormGroup>

                      <FormGroup>
                        <label htmlFor="nickname">Alias</label>
                        <input className="form-control mr-3 input-font-size" type="text" placeholder="Enter nickname"
                          value={this.state.nickname} onChange={e => this.changeState("nickname", e.target.value)}
                        />
                      </FormGroup>

                      <FormGroup>
                        <label htmlFor="suffix">Suffix Title Name</label>
                        <select value={this.state.suffix}
                          className="custom-select custom-select-sm input-font-size" name="suffix"
                          onChange={e => this.changeState("suffix", e.target.value)}
                        >
                          <option value="">Select suffix title name</option>
                          {
                            Array.isArray(this.state.suffixNameCodeOption) && this.state.suffixNameCodeOption.length > 0
                              ? this.state.suffixNameCodeOption.map((option, i) => {
                                return (
                                  <option value={option.code} key={"Staff option " + i} >{option.code}</option>
                                )
                              })
                              : null
                          }
                        </select>
                      </FormGroup>

                      <FormGroup>
                        <label htmlFor="typeOfIdentity">TypeOfIdentity</label>
                        <select value={this.state.typeOfIdentity}
                          className="custom-select custom-select-sm input-font-size" name="typeOfIdentity"
                          onChange={e => this.changeState("typeOfIdentity", e.target.value)}
                        >
                          <option value="">Select type of identity</option>
                          {
                            Array.isArray(this.state.typeOfIdentityOptions) && this.state.typeOfIdentityOptions.length > 0
                              ? this.state.typeOfIdentityOptions.map((option, i) => {
                                return (
                                  <option value={option.name} key={"Type of identity option " + i} >{option.description}</option>
                                )
                              })
                              : null
                          }
                        </select>
                      </FormGroup>

                      <FormGroup>
                        <label htmlFor="identityNumber">Identity Number</label>
                        <input className="form-control mr-3 input-font-size" type="text" placeholder="Enter identity number"
                          value={this.state.identityNumber} onChange={e => this.changeState("identityNumber", e.target.value)}
                        />
                      </FormGroup>

                      <FormGroup>
                        <label htmlFor="identityValidDate">Identity Valid Date</label>
                        <Datetime
                          inputProps={{
                            name: "identityValidDate",
                            className: "form-control input-font-size dt-bg",
                            id: "identityValidDate",
                            placeholder: "dd mmm yyyy",
                            autoComplete: "off",
                            readOnly: true
                          }}
                          value={
                            Array.isArray(this.state.identityValidDate) && this.state.identityValidDate.length > 0
                              ? this.state.identityValidDate[2] + " " + MONTHS_ID[this.state.identityValidDate[1] - 1] + " " + this.state.identityValidDate[0]
                              : ''
                          }
                          dateFormat="DD MMMM YYYY"
                          timeFormat={false}
                          closeOnSelect={true}
                          onChange={e => this.changeDateState("identityValidDate", e)}
                        />
                      </FormGroup>

                      <FormGroup>
                        <label htmlFor="addressBasedOnIdentity">Address Based on Identity</label>
                        <textarea rows="4" className="form-control mr-3 form-font-size" type="text" placeholder="Enter office's name"
                          value={this.state.addressBasedOnIdentity} onChange={e => this.changeState("addressBasedOnIdentity", e.target.value)}
                        />
                      </FormGroup>

                      <FormGroup>
                        <label htmlFor="identityCountry">Country</label>
                        <select value={this.state.identityCountry}
                          className="custom-select custom-select-sm input-font-size" name="identityCountry"
                          onChange={e => this.changeState("identityCountry", e.target.value)}
                          disabled={!this.state.identityCountryIsActive}
                        >
                          <option value="">Select country</option>
                          {
                            Array.isArray(this.state.countryOptions) && this.state.countryOptions.length > 0
                              ? this.state.countryOptions.map((option, i) => {
                                return (
                                  <option value={option.name} key={"Country identity option " + i} >{option.description}</option>
                                )
                              })
                              : null
                          }
                        </select>
                      </FormGroup>

                      <FormGroup>
                        <label htmlFor="identityProvinceId">Province</label>
                        <select value={this.state.identityProvinceId}
                          className="custom-select custom-select-sm input-font-size" name="identityProvinceId"
                          onChange={e => this.changeState("identityProvinceId", e.target.value)}
                        >
                          <option value="">Select province</option>
                          {
                            Array.isArray(this.state.provinceOptions) && this.state.provinceOptions.length > 0
                              ? this.state.provinceOptions.map((option, i) => {
                                return (
                                  <option value={option.code} key={"Province identity option " + i} >{option.description}</option>
                                )
                              })
                              : null
                          }
                        </select>
                      </FormGroup>

                      <FormGroup>
                        <label htmlFor="identityCityId">District / City</label>
                        <select value={this.state.identityCityId}
                          className="custom-select custom-select-sm input-font-size" name="identityCityId"
                          onChange={e => this.changeState("identityCityId", e.target.value)}
                        >
                          <option value="">Select city</option>
                          {
                            Array.isArray(this.state.identityCityOptionsFilter) && this.state.identityCityOptionsFilter.length > 0
                              ? this.state.identityCityOptionsFilter.map((option, i) => {
                                return (
                                  <option value={option.code} key={"City identity option " + i} >{option.description}</option>
                                )
                              })
                              : null
                          }
                        </select>
                      </FormGroup>

                      <FormGroup>
                        <label htmlFor="identitySubDistrict">Sub District</label>
                        <input className="form-control mr-3 input-font-size" type="text" placeholder="Enter sub district"
                          value={this.state.identitySubDistrict} onChange={e => this.changeState("identitySubDistrict", e.target.value)}
                        />
                      </FormGroup>

                      <FormGroup>
                        <label htmlFor="identityVillage">Village</label>
                        <input className="form-control mr-3 input-font-size" type="text" placeholder="Enter village"
                          value={this.state.identityVillage} onChange={e => this.changeState("identityVillage", e.target.value)}
                        />
                      </FormGroup>

                      <FormGroup>
                        <label htmlFor="identityPostalCode">Postal Code</label>
                        <input className="form-control mr-3 input-font-size" type="text" placeholder="Enter postal code"
                          value={this.state.identityPostalCode} onChange={e => this.changeState("identityPostalCode", e.target.value)}
                        />
                      </FormGroup>
                    </div>

                    <div className="col-lg-6">
                      <div className="row">
                        <FormGroup className="col-6">
                          <label htmlFor="identityRt">RT</label>
                          <input className="form-control mr-3 input-font-size" type="text" placeholder="Enter RT"
                            value={this.state.identityRt} onChange={e => this.changeState("identityRt", e.target.value)}
                          />
                        </FormGroup>

                        <FormGroup className="col-6">
                          <label htmlFor="identityRw">RW</label>
                          <input className="form-control mr-3 input-font-size" type="text" placeholder="Enter RW"
                            value={this.state.identityRw} onChange={e => this.changeState("identityRw", e.target.value)}
                          />
                        </FormGroup>
                      </div>

                      <hr className="col-6" />

                      <FormGroup>
                        <label htmlFor="gender">Gender</label>
                        <select value={this.state.gender}
                          className="custom-select custom-select-sm input-font-size" name="gender"
                          onChange={e => this.changeState("gender", e.target.value)}
                        >
                          <option value="">Select gender</option>
                          {
                            Array.isArray(this.state.genderOptions) && this.state.genderOptions.length > 0
                              ? this.state.genderOptions.map((option, i) => {
                                return (
                                  <option value={option.name} key={"Gender option " + i} >{option.description}</option>
                                )
                              })
                              : null
                          }
                        </select>
                      </FormGroup>

                      <FormGroup>
                        <label htmlFor="dateOfBirth">Date of Birth</label>
                        <Datetime
                          inputProps={{
                            name: "dateOfBirth",
                            className: "form-control input-font-size dt-bg",
                            id: "dateOfBirth",
                            placeholder: "dd mmm yyyy",
                            autoComplete: "off",
                            readOnly: true
                          }}
                          value={this.state.dateOfBirth}
                          dateFormat="DD MMMM YYYY"
                          timeFormat={false}
                          closeOnSelect={true}
                          onChange={e => this.changeDateState("dateOfBirth", e)}
                        />
                      </FormGroup>

                      <FormGroup>
                        <label htmlFor="motherName">Mother's Maiden Name</label>
                        <input className="form-control mr-3 input-font-size" type="text" placeholder="Enter mother's maiden name"
                          value={this.state.motherName} onChange={e => this.changeState("motherName", e.target.value)}
                        />
                      </FormGroup>

                      <FormGroup>
                        <label htmlFor="placeOfBirth">Place of Birth</label>
                        <input className="form-control mr-3 input-font-size" type="text" placeholder="Enter place of birth"
                          value={this.state.placeOfBirth} onChange={e => this.changeState("placeOfBirth", e.target.value)}
                        />
                      </FormGroup>

                      <FormGroup>
                        <label htmlFor="mobileNo">Mobile Number</label>
                        <input className="form-control mr-3 input-font-size" type="text" placeholder="Enter mobile number"
                          value={this.state.mobileNo} onChange={e => this.changeState("mobileNo", e.target.value)}
                        />
                      </FormGroup>

                      <FormGroup>
                        <label htmlFor="phoneNumber">Phone Number</label>
                        <input className="form-control mr-3 input-font-size" type="text" placeholder="Enter phone number"
                          value={this.state.phoneNumber} onChange={e => this.changeState("phoneNumber", e.target.value)}
                        />
                      </FormGroup>

                      <FormGroup>
                        <label htmlFor="faxNumber">Fax Number</label>
                        <input className="form-control mr-3 input-font-size" type="text" placeholder="Enter fax number"
                          value={this.state.faxNumber} onChange={e => this.changeState("faxNumber", e.target.value)}
                        />
                      </FormGroup>

                      <FormGroup>
                        <label htmlFor="religion">Religion</label>
                        <select value={this.state.religion}
                          className="custom-select custom-select-sm input-font-size" name="religion"
                          onChange={e => this.changeState("religion", e.target.value)}
                        >
                          <option value="">Select religion</option>
                          {
                            Array.isArray(this.state.religionOptions) && this.state.religionOptions.length > 0
                              ? this.state.religionOptions.map((option, i) => {
                                return (
                                  <option value={option.description} key={"Religion option " + i} >{option.description}</option>
                                )
                              })
                              : null
                          }
                        </select>
                      </FormGroup>

                      <FormGroup>
                        <label htmlFor="email">Email</label>
                        <input className="form-control mr-3 input-font-size" type="text" placeholder="Enter email"
                          value={this.state.email} onChange={e => this.changeState("email", e.target.value)}
                        />
                      </FormGroup>

                      <FormGroup>
                        <label htmlFor="maritalStatus">Marital Status</label>
                        <select value={this.state.maritalStatus}
                          className="custom-select custom-select-sm input-font-size" name="maritalStatus"
                          onChange={e => this.changeState("maritalStatus", e.target.value)}
                        >
                          <option value="">Select marital status</option>
                          {
                            Array.isArray(this.state.maritalStatusOption) && this.state.maritalStatusOption.length > 0
                              ? this.state.maritalStatusOption.map((option, i) => {
                                return (
                                  <option value={option.name} key={"Marital option " + i} >{option.description}</option>
                                )
                              })
                              : null
                          }
                        </select>
                      </FormGroup>

                      <FormGroup>
                        <label htmlFor="typeOfIdentityBi">Type Of Identity</label>
                        <select value={this.state.typeOfIdentityBi}
                          className="custom-select custom-select-sm input-font-size" name="typeOfIdentityBi"
                          onChange={e => this.changeState("typeOfIdentityBi", e.target.value)}
                        >
                          <option value="">Select type of identity</option>
                          {
                            Array.isArray(this.state.typeOfIdentityBiOptions) && this.state.typeOfIdentityBiOptions.length > 0
                              ? this.state.typeOfIdentityBiOptions.map((option, i) => {
                                return (
                                  <option value={option.name} key={"Type of identity bi option " + i} >{option.description}</option>
                                )
                              })
                              : null
                          }
                        </select>
                      </FormGroup>

                      <FormGroup>
                        <label htmlFor="spouseIdentityNumber">Spouse Identity Number</label>
                        <input className="form-control mr-3 input-font-size" type="text" placeholder="Enter spouse identity number"
                          value={this.state.spouseIdentityNumber} onChange={e => this.changeState("spouseIdentityNumber", e.target.value)}
                        />
                      </FormGroup>

                      <FormGroup>
                        <label htmlFor="spouseName">Spouse Name</label>
                        <input className="form-control mr-3 input-font-size" type="text" placeholder="Enter spouse name"
                          value={this.state.spouseName} onChange={e => this.changeState("spouseName", e.target.value)}
                        />
                      </FormGroup>

                      <FormGroup>
                        <label htmlFor="prePostNuptialAggreement">Pre-post Nuptial Agreement</label>
                        <select value={this.state.prePostNuptialAggreement}
                          className="custom-select custom-select-sm input-font-size" name="prePostNuptialAggreement"
                          onChange={e => this.changeState("prePostNuptialAggreement", e.target.value)}
                        >
                          <option value="">Select type of identity</option>
                          <option value="Y">Yes</option>
                          <option value="N">No</option>
                        </select>
                      </FormGroup>

                      <FormGroup>
                        <label htmlFor="dateOfBirthSpouse">Date of Birth of Spouse</label>
                        <Datetime
                          inputProps={{
                            name: "dateOfBirthSpouse",
                            className: "form-control input-font-size dt-bg",
                            id: "dateOfBirthSpouse",
                            placeholder: "dd mmm yyyy",
                            autoComplete: "off",
                            readOnly: true
                          }}
                          value={
                            this.state.dateOfBirthSpouse != null
                              ? this.state.dateOfBirthSpouse
                              : ''
                          }
                          dateFormat="DD MMMM YYYY"
                          timeFormat={false}
                          closeOnSelect={true}
                          onChange={e => this.changeDateState("dateOfBirthSpouse", e)}
                        />
                      </FormGroup>

                      <FormGroup>
                        <label htmlFor="lastEducationLevelCode">Last Education Level</label>
                        <select value={this.state.lastEducationLevelCode}
                          className="custom-select custom-select-sm input-font-size" name="lastEducationLevelCode"
                          onChange={e => this.changeState("lastEducationLevelCode", e.target.value)}
                        >
                          <option value="">Select type of identity</option>
                          {
                            Array.isArray(this.state.lastEducationLevelCodeOption)
                              && this.state.lastEducationLevelCodeOption.length > 0
                              ? this.state.lastEducationLevelCodeOption.map((option, i) => {
                                return (
                                  <option value={option.name} key={"Last edu lvl option " + i} >{option.description}</option>
                                )
                              })
                              : null
                          }
                        </select>
                      </FormGroup>

                      <FormGroup>
                        <label htmlFor="lastEducationLevelDescription">Last Education Level Other</label>
                        <input className="form-control mr-3 input-font-size" type="text"
                          value={this.state.lastEducationLevelDescription}
                          onChange={e => this.changeState("lastEducationLevelDescription", e.target.value)}
                          disabled={!this.state.lasEducationOtherIsActive}
                        />
                      </FormGroup>

                      <FormGroup>
                        <label htmlFor="isCitizen">
                          Is Citizen ? &emsp;
                            <label className="c-checkbox">
                            <input type="checkbox" value="option1" checked={this.state.isCitizen} onClick={e => this.changeState("isCitizen")} />
                            <span className="fa fa-check" />
                          </label>
                        </label>
                      </FormGroup>
                    </div>
                  </form>
                </TabPane>

                <TabPane className="ft-detail" tabId="address" role="tabpanel">
                  <form className="form-font-size mt-3 row" onSubmit={this.onSubmit}>
                    <div className="col-lg-6">
                      <FormGroup>
                        <div>
                          <label htmlFor="address">Domicile Address</label>
                        </div>
                        <textarea rows="4" className="form-control mr-3 form-font-size" type="text" placeholder="Enter address"
                          value={this.state.address} onChange={e => this.changeState("address", e.target.value)}
                        />
                      </FormGroup>

                      <FormGroup>
                        <label htmlFor="country">Country</label>
                        <select value={this.state.country}
                          className="custom-select custom-select-sm input-font-size" name="country"
                          onChange={e => this.changeState("country", e.target.value)}
                          disabled={!this.state.countryIsActive}
                        >
                          <option value="">Select country</option>
                          {
                            Array.isArray(this.state.countryOptions) && this.state.countryOptions.length > 0
                              ? this.state.countryOptions.map((option, i) => {
                                return (
                                  <option value={option.name} key={"Country option " + i} >{option.description}</option>
                                )
                              })
                              : null
                          }
                        </select>
                      </FormGroup>

                      <FormGroup>
                        <label htmlFor="provinceId">Province</label>
                        <select value={this.state.provinceId}
                          className="custom-select custom-select-sm input-font-size" name="provinceId"
                          onChange={e => this.changeState("provinceId", e.target.value)}
                        >
                          <option value="">Select province</option>
                          {
                            Array.isArray(this.state.provinceOptions) && this.state.provinceOptions.length > 0
                              ? this.state.provinceOptions.map((option, i) => {
                                return (
                                  <option value={option.code} key={"Province option " + i} >{option.description}</option>
                                )
                              })
                              : null
                          }
                        </select>
                      </FormGroup>

                      <FormGroup>
                        <label htmlFor="cityId">District / City</label>
                        <select value={this.state.cityId}
                          className="custom-select custom-select-sm input-font-size" name="cityId"
                          onChange={e => this.changeState("cityId", e.target.value)}
                        >
                          <option value="">Select city</option>
                          {
                            Array.isArray(this.state.cityOptionsFilter) && this.state.cityOptionsFilter.length > 0
                              ? this.state.cityOptionsFilter.map((option, i) => {
                                return (
                                  <option value={option.code} key={"City option " + i} >{option.description}</option>
                                )
                              })
                              : null
                          }
                        </select>
                      </FormGroup>

                      <FormGroup>
                        <label htmlFor="subDistrict">Sub District</label>
                        <input className="form-control mr-3 input-font-size" type="text" placeholder="Enter sub district"
                          value={this.state.subDistrict} onChange={e => this.changeState("subDistrict", e.target.value)}
                        />
                      </FormGroup>
                    </div>

                    <div className="col-lg-6">
                      <FormGroup>
                        <label htmlFor="village">Village</label>
                        <input className="form-control mr-3 input-font-size" type="text" placeholder="Enter village"
                          value={this.state.village} onChange={e => this.changeState("village", e.target.value)}
                        />
                      </FormGroup>

                      <FormGroup>
                        <label htmlFor="postalCode">Postal Code</label>
                        <input className="form-control mr-3 input-font-size" type="text" placeholder="Enter postal code"
                          value={this.state.postalCode} onChange={e => this.changeState("postalCode", e.target.value)}
                        />
                      </FormGroup>

                      <div className="row">
                        <FormGroup className="col-6">
                          <label htmlFor="rt">RT</label>
                          <input className="form-control mr-3 input-font-size" type="text" placeholder="Enter RT"
                            value={this.state.rt} onChange={e => this.changeState("rt", e.target.value)}
                          />
                        </FormGroup>

                        <FormGroup className="col-6">
                          <label htmlFor="rw">RW</label>
                          <input className="form-control mr-3 input-font-size" type="text" placeholder="Enter RW"
                            value={this.state.rw} onChange={e => this.changeState("rw", e.target.value)}
                          />
                        </FormGroup>
                      </div>

                      <FormGroup>
                        <label htmlFor="homeOwnershipStatus">Home Ownership Status</label>
                        <select value={this.state.homeOwnershipStatus}
                          className="custom-select custom-select-sm input-font-size" name="homeOwnershipStatus"
                          onChange={e => this.changeState("homeOwnershipStatus", e.target.value)}
                        >
                          <option value="">Select Home Ownership Status</option>
                          {
                            Array.isArray(this.state.homeOwnershipStatusOption) && this.state.homeOwnershipStatusOption.length > 0
                              ? this.state.homeOwnershipStatusOption.map((option, i) => {
                                return (
                                  <option value={option.id} key={"Home Ownership option " + i} >{option.description}</option>
                                )
                              })
                              : null
                          }
                        </select>
                      </FormGroup>

                      {
                        this.state.homeOwnershipStatus === 99
                          ? (
                            <FormGroup>
                              <label htmlFor="otherHomeOwnershipStatus">Other Home Ownership Status</label>
                              <input className="form-control mr-3 input-font-size"
                                type="text" placeholder="Enter RW"
                                value={this.state.otherHomeOwnershipStatus}
                                onChange={e => this.changeState("otherHomeOwnershipStatus", e.target.value)}
                              />
                            </FormGroup>
                          )
                          : null
                      }
                    </div>
                  </form>
                </TabPane>

                <TabPane className="ft-detail" tabId="others" role="tabpanel">
                  <form className="form-font-size mt-3" onSubmit={this.onSubmit}>
                    <div className="row">
                      <div className="col-lg-6">
                        <FormGroup>
                          <label htmlFor="taxNumber">Tax Number</label>
                          <input className="form-control mr-3 input-font-size" type="text" placeholder="Enter Tax Number"
                            value={this.state.taxNumber} onChange={e => this.changeState("taxNumber", e.target.value)}
                          />
                        </FormGroup>

                        <FormGroup>
                          <label htmlFor="taxName">Name Based on Tax</label>
                          <input className="form-control mr-3 input-font-size" type="text" placeholder="Enter Tax Number"
                            value={this.state.taxName} onChange={e => this.changeState("taxName", e.target.value)}
                          />
                        </FormGroup>
                      </div>

                      <div className="col-lg-6">
                        <FormGroup>
                          <label htmlFor="taxAddress">Address Based on Tax</label>
                          <textarea rows="4" className="form-control mr-3 form-font-size" type="text" placeholder="Enter Tax Address"
                            value={this.state.taxAddress} onChange={e => this.changeState("taxAddress", e.target.value)}
                          />
                        </FormGroup>
                      </div>
                    </div>

                    <hr className="col-6" />

                    <div className="row">
                      <div className="col-lg-6">
                        <FormGroup>
                          <label htmlFor="flagTax">Flag Tax</label>
                          <select value={this.state.flagTax}
                            className="custom-select custom-select-sm input-font-size" name="flagTax"
                            onChange={e => this.changeState("flagTax", e.target.value)}
                          >
                            <option value="">Select Flag Tax</option>
                            {
                              Array.isArray(this.state.flagTaxOptions) && this.state.flagTaxOptions.length > 0
                                ? this.state.flagTaxOptions.map((option, i) => {
                                  return (
                                    <option value={option.name} key={"Flag Tax option " + i} >{option.description}</option>
                                  )
                                })
                                : null
                            }
                          </select>
                        </FormGroup>

                        <FormGroup>
                          <label htmlFor="merchantInformationCode">Merchant Account Information Code</label>
                          <select value={this.state.merchantInformationCode}
                            className="custom-select custom-select-sm input-font-size" name="merchantInformationCode"
                            onChange={e => this.changeState("merchantInformationCode", e.target.value)}
                          >
                            <option value="">Select Merchant Account Information Code</option>
                            {
                              Array.isArray(this.state.merchantInformationCodeOption) && this.state.merchantInformationCodeOption.length > 0
                                ? this.state.merchantInformationCodeOption.map((option, i) => {
                                  return (
                                    <option value={option.code} key={"Merchant Acc info option " + i} >{option.code + " - " + option.description}</option>
                                  )
                                })
                                : null
                            }
                          </select>
                        </FormGroup>

                        <FormGroup>
                          <label htmlFor="merchantCategoryCode">Merchant Category</label>
                          <select value={this.state.merchantCategoryCode}
                            className="custom-select custom-select-sm input-font-size" name="merchantCategoryCode"
                            onChange={e => this.changeState("merchantCategoryCode", e.target.value)}
                          >
                            <option value="">Select Merchant Category</option>
                            {
                              Array.isArray(this.state.merchantCategoryOption) && this.state.merchantCategoryOption.length > 0
                                ? this.state.merchantCategoryOption.map((option, i) => {
                                  return (
                                    <option value={option.code} key={"Merchant category option " + i} >{option.code + " - " + option.description}</option>
                                  )
                                })
                                : null
                            }
                          </select>
                        </FormGroup>
                      </div>

                      <div className="col-lg-6">
                        <FormGroup>
                          <label htmlFor="mobileUser">Mobile Username</label>
                          <input className="form-control mr-3 form-font-size" type="text" placeholder="Enter Mobile Username"
                            value={this.state.mobileUser} onChange={e => this.changeState("mobileUser", e.target.value)}
                            readOnly disabled
                          />
                        </FormGroup>

                        <FormGroup>
                          <label htmlFor="submittedOnDate">Submitted on</label>
                          <Datetime
                            inputProps={{
                              name: "submittedOnDate",
                              className: "form-control input-font-size dt-bg",
                              id: "submittedOnDate",
                              placeholder: "dd mmmm yyyy",
                              autoComplete: "off",
                              readOnly: true
                            }}
                            value={this.state.submittedOnDate}
                            dateFormat="DD MMMM YYYY"
                            timeFormat={false}
                            closeOnSelect={true}
                            onChange={e => this.changeDateState("submittedOnDate", e)}
                          />
                        </FormGroup>
                      </div>
                    </div>
                  </form>
                </TabPane>
              </TabContent>
            </div>

            <Button className="mt-4 mb-2 col-12" color="warning"
              type="submit" onClick={() => editMember()}
            >
              Edit Member
            </Button>
          </CardBody>
        </Card>
      </ContentWrapper>
    )
  }
}


MemberDataEdit.propTypes = {
  actions: PropTypes.object,
  memberData: PropTypes.object,
  search: PropTypes.object
}

const mapStateToProps = state => ({
  memberData: state.memberData,
  search: state.search
})
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) })

export default compose(connect(mapStateToProps, mapDispatchToProps), withTranslation('translations'))(withRouter(MemberDataEdit))