import React, { Component } from 'react';
import { Input, CustomInput } from 'reactstrap';
import Cookies from "js-cookie";
import PropTypes from 'prop-types';
import { withTranslation, Trans } from 'react-i18next';
import { Formik } from 'formik';

import Swal from '../../../components/Common/Swal';

import * as actions from '../../../store/actions/actions';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loginSuccess: false,
      transactionReference: '',
      isLoadingLogin: false,
      isOtpShown: false,
      isPwdShown: false,
      rememberMe: false,
      wrongFieldMsg: '',

      username: '',
      password: ''
    }
  }

  onSubmitLogin = values => {
    this.setState({
      isLoadingLogin: true
    })

    this.props.actions.loginUser(
      values,
      this.onLoginSuccess,
      this.onLoginFailed,
      this.onCTO,
      this.onServerDown,
      this.onLoginOtpSuccess
    )
  }

  onSubmitLoginOtp = e => {
    const state = this.state
    const otp = e

    this.props.actions.loginOtpUser(
      {
        username: state.username,
        password: state.password,
        transactionReference: state.transactionReference,
        rememberMe: state.rememberMe,
        otpCode: otp,
      },
      this.onLoginOtpSuccess
    )
  }

  onLoginSuccess = () => {
    this.setState({ loginSuccess: true, isLoadingLogin: false })
  }

  onLoginFailed = msg => {
    this.setState({
      isLoadingLogin: false,
      wrongFieldMsg: msg
    })

    document.getElementById("wrongField").click()
  }

  onCTO = () => {
    this.setState({
      isLoadingLogin: false
    })

    document.getElementById("CTO").click()
  }

  onServerDown = () => {
    this.setState({
      isLoadingLogin: false
    })

    document.getElementById("serverDown").click()
  }

  onLoginOtpSuccess = () => {
    const time = new Date()
    time.setTime(time.getTime() + (30 * 60 * 1000))

    Cookies.set("loginToken", "Token", { expires: time })
    this.setState({
      OTPStatus: true
    })
    this.props.history.push({
      pathname: "/simpool/dashboard",
      search: "?tenantIdentifier=" + this.props.settings.tenantIdentifier
    })
  }

  changeLanguage = lng => {
    this.props.actions.changeLanguage("language", lng)
    if (lng === 'en') {
      this.props.actions.changeDropdownLanguage("dropdownLanguage", "English")
    } else if (lng === 'id') {
      this.props.actions.changeDropdownLanguage("dropdownLanguage", "B. Indonesia")
    }
    this.props.i18n.changeLanguage(lng)
  }

  render() {
    let isId, isEn
    if (this.props.dashboard.language === 'id')
      isId = true
    else if (this.props.dashboard.language === 'en')
      isEn = true

    const wrongFieldOpt = {
      title: this.state.wrongFieldMsg
    }

    const CTO = {
      title: this.props.i18n.t('login.CTO')
    }

    const serverDown = {
      title: this.props.i18n.t('login.SERVER_DOWN')
    }

    const OTP = () => {
      const generateOtp = () => {
        this.setState({ isOtpShown: true })
        this.props.actions.otpFun(
          {
            username: this.state.username,
            password: this.state.password,
            rememberMe: this.state.rememberMe
          },
          onOtpSuccess
        )
      }

      const onOtpSuccess = (transactionReference) => {
        this.setState({
          transactionReference: transactionReference
        })
      }

      const rememberMe = () => {
        this.setState({ rememberMe: !this.state.rememberMe })
      }

      return (
        <div className="card-body">
          {
            this.state.isOtpShown
              ? (
                <Formik
                  initialValues={{ otp: '' }}
                  validate={values => {
                    const errors = {};

                    if (!values.otp) {
                      errors.otp = <Trans i18nKey='forms.REQUIRED'>Form is required!</Trans>;
                    }
                    return errors;
                  }}
                  onSubmit={values => {
                    this.onSubmitLoginOtp(values.otp)
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
                      <form className="mb-3" name="formOTP" onSubmit={handleSubmit}>
                        <Input
                          type="text"
                          name="otp"
                          maxLength="6"
                          className={
                            errors.otp && touched.otp
                              ? "otp col-lg-4 offset-lg-4 input-error"
                              : "otp col-lg-4 offset-lg-4"
                          }
                          value={values.otp}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          autoComplete="off"
                        />
                        <div className="input-feedback center-parent">{touched.otp && errors.otp}</div>

                        <div className="clearfix">
                          <CustomInput
                            type="checkbox"
                            id="remember-me"
                            className="float-left mt-0"
                            name="remember-me"
                            checked={this.state.rememberMe}
                            label={<Trans i18nKey='login.REMEMBER_ME'>Remember Me</Trans>}
                            onChange={() => rememberMe()}
                          />
                        </div>

                        <button className="btn btn-block btn-primary mt-3 btn-color" type="submit">Submit OTP</button>
                      </form>
                    )}
                </Formik>
              )
              : (
                <div>
                  <div className="clearfix">
                    <CustomInput
                      type="checkbox"
                      id="remember-me"
                      className="float-left mt-0"
                      name="remember-me"
                      checked={this.state.rememberMe}
                      label={<Trans i18nKey='login.REMEMBER_ME'>Remember Me</Trans>}
                      onChange={() => rememberMe()}
                    />
                  </div>
                  <button className="btn btn-block btn-primary mt-3 btn-color" onClick={() => generateOtp()}>Generate OTP</button>
                </div>
              )
          }
        </div>
      )
    }

    return (
      <div className="block-center mt-4 col-md-6">
        <div className="card card-flat">
          <div className="card-header text-center bg-dark">
            <div>
              <img className="block-center rounded" src="/img/Simpool Box.png" alt="Logo" />
            </div>
          </div>
          {
            this.state.loginSuccess
              ? (<OTP />)
              : (
                <div className="card-body">
                  <Formik
                    initialValues={{ username: this.state.username, password: this.state.password }}
                    validate={values => {
                      const errors = {};

                      if (!values.username) {
                        errors.username = <Trans i18nKey='forms.REQUIRED'>Form is required!</Trans>;
                      }

                      if (!values.password) {
                        errors.password = <Trans i18nKey='forms.REQUIRED'>Form is required!</Trans>;
                      }
                      return errors;
                    }}
                    onSubmit={values => {
                      this.setState({
                        username: values.username,
                        password: values.password
                      })

                      this.onSubmitLogin(values)
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
                        <form className="mb-3" name="formLogin" onSubmit={handleSubmit}>
                          <div className="form-group">
                            <label className="text-muted" htmlFor="username"><Trans i18nKey='login.USERNAME'>Username</Trans></label>
                            <input
                              type="text"
                              name="username"
                              className={
                                errors.username && touched.username
                                  ? "form-control input-font-size input-error"
                                  : "form-control input-font-size"
                              }
                              placeholder={this.props.i18n.t('login.USERNAME_PH')}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.username}
                              tabIndex="1" 
                            />
                            <div className="input-feedback">{touched.username && errors.username}</div>
                          </div>

                          <div className="form-group">
                            <label className="text-muted" htmlFor="resetInputEmail1"><Trans i18nKey='login.PASSWORD'>Password</Trans></label>
                            <div className="input-group with-focus">
                              <input
                                type={
                                  this.state.isPwdShown
                                    ? "text"
                                    : "password"
                                }
                                id="id-password"
                                name="password"
                                className={
                                  errors.password && touched.password
                                    ? "form-control input-font-size border-right-0 input-error"
                                    : "form-control input-font-size border-right-0"
                                }
                                placeholder={this.props.i18n.t('login.PASSWORD_PH')}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.password}
                                tabIndex="2"
                              />
                              <div className="input-group-append cursor-pointer" onClick={() => this.setState({ isPwdShown: !this.state.isPwdShown })}>
                                <span className={
                                  errors.password && touched.password
                                    ? "input-group-text text-muted bg-transparent border-left-0 input-error"
                                    : "input-group-text text-muted bg-transparent border-left-0"
                                }>
                                  {
                                    this.state.isPwdShown
                                      ? (<em className="fa fa-eye-slash" />)
                                      : (<em className="fa fa-eye" />)
                                  }
                                </span>
                              </div>
                            </div>
                            <div className="input-feedback">{touched.password && errors.password}</div>
                          </div>
                          <div className="text-center py-2">
                            <label className="c-radio">
                              <Input id="id" type="radio" name="i-radio" defaultValue="id" defaultChecked={isId} onClick={() => this.changeLanguage('id')} />
                              <span className="fa fa-circle"></span>Bahasa Indonesia</label>
                            <label className="c-radio">
                              <Input id="en" type="radio" name="i-radio" defaultValue="en" defaultChecked={isEn} onClick={() => this.changeLanguage('en')} />
                              <span className="fa fa-circle"></span>English</label>
                          </div>
                          <button className="btn btn-block btn-primary mt-3 btn-color" type="submit" tabIndex="3">
                            {
                              this.state.isLoadingLogin === true
                                ? (
                                  <em className="fas fa-circle-notch fa-spin fa-2x fa-16" />
                                )
                                : (<Trans i18nKey='login.LOGIN'>Login</Trans>)
                            }
                          </button>

                          <Swal options={wrongFieldOpt} id="wrongField" />
                          <Swal options={CTO} id="CTO" />
                          <Swal options={serverDown} id="serverDown" />
                        </form>
                      )}
                  </Formik>
                </div>
              )
          }
        </div>
        <div className="p-3 text-center">
          <span className="mr-2">&copy;</span>
          <span>2020</span>
          <span className="mx-2">-</span>
          <span>Simpool</span>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  actions: PropTypes.object,
  auth: PropTypes.object,
  dashboard: PropTypes.object,
  settings: PropTypes.object
}

const mapStateToProps = state => ({
  auth: state.auth,
  dashboard: state.dashboard,
  settings: state.settings
})
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) })

export default compose(connect(mapStateToProps, mapDispatchToProps), withTranslation('translations'))(Login);
