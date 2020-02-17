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
        addressBasedOnIdentity: res.addressBasedOnIdentity,
        nickname: res.nickname,
        city: res.city.description,
        cityOptions: res.cityOptions,
        cityOptionsFilter: cityOptions,
        clientType: res.legalForm.value,
        clientTypeIsActive: res.clientType.isActive,
        clientTypeOptions: res.clientTypeOptions,
        country: res.country.description,
        countryOptions: res.countryOptions,
        countryIsActive: res.country.isActive,
        dateOfBirth: res.dateOfBirth,
        dateOfBirthSpouse: dateOfBirthSpouse,
        email: res.email,
        externalId: res.externalId,
        faxNumber: res.faxNumber,
        fullname: res.fullnameNonIdentity,
        gender: res.gender.description,
        genderOptions: res.genderOptions,
        identityCity: res.identityCity.description,
        identityCityOptionsFilter: identityCityOptions,
        identityName: res.fullname,
        identityNumber: res.identityNumber,
        identityCountry: res.identityCountry.description,
        identityCountryIsActive: res.identityCountry.isActive,
        identityPostalCode: res.identityPostalCode,
        identityProvince: res.identityProvince.description,
        identityRt: res.identityRt,
        identityRw: res.identityRw,
        identitySubDistrict: res.identitySubDistrict,
        identityValidDate: res.identityValidDate,
        identityVillage: res.identityVillage,
        isCitizen: res.isCitizen,
        lastEducationLevelCode: res.lastEducationLevelCode.description,
        lastEducationLevelCodeOption: res.lastEducationLevelCodeOption,
        lastEducationLevelDescription: res.lastEducationLevelDescription,
        maritalStatus: res.maritalStatusCode.description,
        maritalStatusOption: res.maritalStatusCodeOption,
        mobileNo: res.mobileNo,
        motherName: res.motherName,
        nip: res.nip,
        office: res.officeName,
        officeOptions: res.officeOptions,
        phoneNumber: res.phoneNumber,
        placeOfBirth: res.placeOfBirth,
        postalCode: res.postalCode,
        prefix: res.prefixDescription.code,
        prefixNameCodeOption: res.prefixNameCodeOption,
        prePostNuptialAggreement: res.biInformation.prePostNuptialAggreement,
        province: res.province.description,
        provinceOptions: res.provinceOptions,
        religion: res.religion.description,
        religionOptions: res.religionOption,
        rt: res.rt,
        rw: res.rw,
        sector: res.sector.name,
        sectorOptions: res.sectorOptions,
        spouseIdentityNumber: res.biInformation.spouseIdentityNumber,
        spouseName: res.biInformation.spouseName,
        staff: res.staffName,
        staffOptions: res.staffOptions,
        subDistrict: res.subDistrict,
        suffix: res.suffixDescription.code,
        suffixNameCodeOption: res.suffixNameCodeOption,
        typeOfIdentity: res.typeOfIdentity.description,
        typeOfIdentityBi: res.biInformation.typeOfIdentity,
        typeOfIdentityOptions: res.typeOfIdentityOptions,
        typeOfIdentityBiOptions: res.typeOfIdentityBiOptions,
        village: res.village
      })
    }

    this.props.actions.getClientDetailParams(clientIdNo, setClientDetail)

    this.state = {
      addressBasedOnIdentity: '',
      activeTab: "identity",
      city: '',
      cityOptions: [],
      cityOptionsFilter: [],
      clientType: "default",
      clientTypeIsActive: false,
      clientTypeOptions: [],
      country: '',
      countryOptions: [],
      countryIsActive: false,
      dateOfBirth: [],
      dateOfBirthSpouse: null,
      email: '',
      externalId: '',
      faxNumber: '',
      fullname: '',
      gender: '',
      genderOptions: [],
      identityCountry: '',
      identityCountryIsActive: false,
      identityName: '',
      identityNumber: '',
      identityPostalCode: '',
      identityProvince: '',
      identityRt: '',
      identityRw: '',
      identitySubDistrict: '',
      identityValidDate: [],
      identityVillage: '',
      isCitizen: false,
      lastEducationLevelCode: "default",
      lastEducationLevelCodeOption: [],
      lastEducationLevelDescription: '',
      lasEducationOtherIsActive: false,
      maritalStatus: '',
      maritalStatusOption: [],
      mobileNo: '',
      motherName: '',
      nickname: '',
      nip: '',
      office: "default",
      officeOptions: [],
      phoneNumber: '',
      placeOfBirth: '',
      postalCode: '',
      prefix: '',
      prefixNameCodeOption: [],
      prePostNuptialAggreement: "default",
      province: '',
      provinceOptions: [],
      religion: '',
      religionOption: [],
      rt: '',
      rw: '',
      sector: "default",
      sectorOptions: [],
      spouseIdentityNumber: '',
      spouseName: '',
      staff: "default",
      staffOptions: [],
      subDistrict: '',
      suffix: "default",
      suffixNameCodeOption: [],
      typeOfIdentity: "default",
      typeOfIdentityBi: "default",
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

    console.log(date)

    this.setState({
      [name]: date
    })
  }

  changeState = (name, val) => {
    this.setState({
      [name]: val
    })

    if (name === "identityProvince" || name === "province") {
      let cityOptions = []
      let provinceId

      this.state.provinceOptions.map(province => {
        if (province.description === val) {
          provinceId = province.code
        }
      })

      this.state.cityOptions.map(city => {
        if (city.provinceId === provinceId) {
          cityOptions.push(city)
        }
      })

      if (name === "province") {
        this.setState({
          cityOptionsFilter: cityOptions
        })
      }
      else if (name === "identityProvince") {
        this.setState({
          identityCityOptionsFilter: cityOptions
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

    if (name === "isCitizen") {
      this.setState({
        isCitizen: !this.state.isCitizen
      })
    }
  }

  onSubmit = e => {
    console.log('Form submitted..');
    e.preventDefault();
  }

  render() {
    return (
      <ContentWrapper>
        <div className="content-heading">
          <div>Edit Member Data</div>
        </div>

        <Card className="card-default">
          <CardBody>
            <Link to="/simpool/member/data">
              <Button outline className="col-4 col-md-2 mb-4" color="primary" type="submit" tabIndex={7}>Kembali</Button>
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
                  <form className="form-font-size mt-3" onSubmit={this.onSubmit}>
                    <div className="row">
                      <div className="col-lg-6">
                        <FormGroup>
                          <label htmlFor="office">Office</label>
                          <select value={this.state.office}
                            className="custom-select custom-select-sm input-font-size" name="office"
                            onChange={e => this.changeState("office", e.target.value)}
                          >
                            <option value="default">Select office</option>
                            {
                              Array.isArray(this.state.officeOptions) && this.state.officeOptions.length > 0
                                ? this.state.officeOptions.map((option, i) => {
                                  return (
                                    <option value={option.name} key={"Office option " + i} >{option.name}</option>
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
                            <option value="default">Select staff</option>
                            {
                              Array.isArray(this.state.staffOptions) && this.state.staffOptions.length > 0
                                ? this.state.staffOptions.map((option, i) => {
                                  return (
                                    <option value={option.displayName} key={"Staff option " + i} >{option.displayName}</option>
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
                            <option value="default">Select client type</option>
                            <option value={this.state.clientType}>{this.state.clientType}</option>
                            {
                              Array.isArray(this.state.clientTypeOptions) && this.state.clientTypeOptions.length > 0
                                ? this.state.clientTypeOptions.map((option, i) => {
                                  return (
                                    <option value={option.displayName} key={"Staff option " + i} >{option.displayName}</option>
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
                            <option value="default">Select sector</option>
                            {
                              Array.isArray(this.state.sectorOptions) && this.state.sectorOptions.length > 0
                                ? this.state.sectorOptions.map((option, i) => {
                                  return (
                                    <option value={option.name} key={"Staff option " + i} >{option.name}</option>
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
                            <option value="default">Select prefix title name</option>
                            {
                              Array.isArray(this.state.prefixNameCodeOption) && this.state.prefixNameCodeOption.length > 0
                                ? this.state.prefixNameCodeOption.map((option, i) => {
                                  return (
                                    <option value={option.code} key={"Staff option " + i} >{option.code}</option>
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
                            <option value="default">Select suffix title name</option>
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
                            <option value="default">Select type of identity</option>
                            {
                              Array.isArray(this.state.typeOfIdentityOptions) && this.state.typeOfIdentityOptions.length > 0
                                ? this.state.typeOfIdentityOptions.map((option, i) => {
                                  return (
                                    <option value={option.description} key={"Staff option " + i} >{option.description}</option>
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
                              className: "form-control input-font-size",
                              id: "identityValidDate",
                              placeholder: "dd mmm yyyy",
                              autoComplete: "off"
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
                          <input className="form-control mr-3 input-font-size" type="text" placeholder="Enter office's name"
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
                            <option value="default">Select country</option>
                            {
                              Array.isArray(this.state.countryOptions) && this.state.countryOptions.length > 0
                                ? this.state.countryOptions.map((option, i) => {
                                  return (
                                    <option value={option.description} key={"Staff option " + i} >{option.description}</option>
                                  )
                                })
                                : null
                            }
                          </select>
                        </FormGroup>

                        <FormGroup>
                          <label htmlFor="identityProvince">Province</label>
                          <select value={this.state.identityProvince}
                            className="custom-select custom-select-sm input-font-size" name="identityProvince"
                            onChange={e => this.changeState("identityProvince", e.target.value)}
                          >
                            <option value="default">Select province</option>
                            {
                              Array.isArray(this.state.provinceOptions) && this.state.provinceOptions.length > 0
                                ? this.state.provinceOptions.map((option, i) => {
                                  return (
                                    <option value={option.description} key={"Staff option " + i} >{option.description}</option>
                                  )
                                })
                                : null
                            }
                          </select>
                        </FormGroup>

                        <FormGroup>
                          <label htmlFor="identityCity">City</label>
                          <select value={this.state.identityCity}
                            className="custom-select custom-select-sm input-font-size" name="identityCity"
                            onChange={e => this.changeState("identityCity", e.target.value)}
                          >
                            <option value="default">Select city</option>
                            {
                              Array.isArray(this.state.cityOptionsFilter) && this.state.cityOptionsFilter.length > 0
                                ? this.state.cityOptionsFilter.map((option, i) => {
                                  return (
                                    <option value={option.description} key={"Staff option " + i} >{option.description}</option>
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
                            <option value="default">Select gender</option>
                            {
                              Array.isArray(this.state.genderOptions) && this.state.genderOptions.length > 0
                                ? this.state.genderOptions.map((option, i) => {
                                  return (
                                    <option value={option.description} key={"Staff option " + i} >{option.description}</option>
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
                              className: "form-control input-font-size",
                              id: "dateOfBirth",
                              placeholder: "dd mmm yyyy",
                              autoComplete: "off"
                            }}
                            value={
                              Array.isArray(this.state.dateOfBirth) && this.state.dateOfBirth.length > 0
                                ? this.state.dateOfBirth[2] + " " + MONTHS_ID[this.state.dateOfBirth[1] - 1] + " " + this.state.dateOfBirth[0]
                                : ''
                            }
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
                            <option value="default">Select religion</option>
                            {
                              Array.isArray(this.state.religionOptions) && this.state.religionOptions.length > 0
                                ? this.state.religionOptions.map((option, i) => {
                                  return (
                                    <option value={option.description} key={"Staff option " + i} >{option.description}</option>
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
                            <option value="default">Select marital status</option>
                            {
                              Array.isArray(this.state.maritalStatusOption) && this.state.maritalStatusOption.length > 0
                                ? this.state.maritalStatusOption.map((option, i) => {
                                  return (
                                    <option value={option.description} key={"Staff option " + i} >{option.description}</option>
                                  )
                                })
                                : null
                            }
                          </select>
                        </FormGroup>

                        <FormGroup>
                          <label htmlFor="typeOfIdentityBi">TypeOfIdentity</label>
                          <select value={this.state.typeOfIdentityBi}
                            className="custom-select custom-select-sm input-font-size" name="typeOfIdentityBi"
                            onChange={e => this.changeState("typeOfIdentityBi", e.target.value)}
                          >
                            <option value="default">Select type of identity</option>
                            {
                              Array.isArray(this.state.typeOfIdentityBiOptions) && this.state.typeOfIdentityBiOptions.length > 0
                                ? this.state.typeOfIdentityBiOptions.map((option, i) => {
                                  return (
                                    <option value={option.name} key={"Staff option " + i} >{option.description}</option>
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
                            <option value="default">Select type of identity</option>
                            <option value="Y">Yes</option>
                            <option value="N">No</option>
                          </select>
                        </FormGroup>

                        <FormGroup>
                          <label htmlFor="dateOfBirthSpouse">Date of Birth of Spouse</label>
                          <Datetime
                            inputProps={{
                              name: "dateOfBirthSpouse",
                              className: "form-control input-font-size",
                              id: "dateOfBirthSpouse",
                              placeholder: "dd mmm yyyy",
                              autoComplete: "off"
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
                            <option value="default">Select type of identity</option>
                            {
                              Array.isArray(this.state.lastEducationLevelCodeOption) && this.state.lastEducationLevelCodeOption.length > 0
                                ? this.state.lastEducationLevelCodeOption.map((option, i) => {
                                  return (
                                    <option value={option.description} key={"Staff option " + i} >{option.description}</option>
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
                              <input type="checkbox" value="option1" checked={this.state.isCitizen} onClick={e => this.changeState("isCitizen")}/>
                              <span className="fa fa-check" />
                            </label>
                          </label>
                        </FormGroup>
                      </div>
                    </div>

                    <Button className="mt-4 mb-2 col-12" color="warning" type="submit">Edit Member</Button>
                  </form>
                </TabPane>
              </TabContent>
            </div>
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