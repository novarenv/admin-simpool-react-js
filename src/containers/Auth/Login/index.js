import React, { Component } from 'react';
import { Input, CustomInput } from 'reactstrap';
import Cookies from "js-cookie";
import PropTypes from 'prop-types';
import { withTranslation, Trans } from 'react-i18next';

import FormValidator from '../../../components/Forms/FormValidator.js';

import * as actions from '../../../store/actions/actions';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loginSuccess: false,
      transactionReference: '',
      isOtpShown: false,
      rememberMe: false,
      formLogin: {
        username: 'coba',
        password: '123456',
        checkUsername: 'coba',
        checkPassword: '123456'
      }
    }
  }

  /**
   * Validate input using onChange event
   * @param  {String} formName The name of the form in the state object
   * @return {Function} a function used for the event
   */
  validateOnChange = event => {
    const input = event.target;
    const form = input.form;
    const value = input.type === 'checkbox' ? input.checked : input.value;

    const result = FormValidator.validate(input);

    this.setState({
      [form.name]: {
        ...this.state[form.name],
        [input.name]: value,
        errors: {
          ...this.state[form.name].errors,
          [input.name]: result
        }
      }
    });
  }

  onSubmitLogin = e => {
    e.preventDefault()

    const form = e.target;
    const inputs = [...form.elements].filter(i => ['INPUT', 'SELECT'].includes(i.nodeName))
    const formLogin = this.state.formLogin

    const { errors, hasError } = FormValidator.bulkValidate(inputs)

    this.setState({
      [form.name]: {
        ...this.state[form.name],
        errors
      }
    });

    console.log(hasError ? 'Form has errors. Check!' : 'Form Submitted!')

    this.props.actions.loginUser(
      {
        username: formLogin.username,
        password: formLogin.password
      },
      this.onLoginSuccess,
      this.onLoginOtpSuccess
    )
  }

  onSubmitLoginOtp = e => {
    e.preventDefault()

    const state = this.state
    const otp = e.target.elements.otp.value

    this.props.actions.loginOtpUser(
      {
        username: state.formLogin.username,
        password: state.formLogin.password,
        transactionReference: state.transactionReference,
        rememberMe: false,
        otpCode: otp,
      },
      this.onLoginOtpSuccess
    )
  }

  onLoginSuccess = () => {
    this.setState({ loginSuccess: true })
  };

  onLoginOtpSuccess = () => {
    const time = new Date()
    time.setTime(time.getTime() + (10000 * 60 * 1000))

    Cookies.set("loginToken", "Token", { expires: time })
    this.setState({
      OTPStatus: true
    })
    this.props.history.push("/simpool/")
  }

  /* Simplify error check */
  hasError = (formName, inputName, method) => {
    return this.state[formName] &&
      this.state[formName].errors &&
      this.state[formName].errors[inputName] &&
      this.state[formName].errors[inputName][method]
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

    const OTP = () => {
      const formLogin = this.state.formLogin

      const generateOtp = () => {
        this.setState({ isOtpShown: true })
        this.props.actions.otpFun(
          {
            username: formLogin.username,
            password: formLogin.password,
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
        this.setState({rememberMe: !this.state.rememberMe})
      }

      return (
        <div className="card-body">
          {
            this.state.isOtpShown
              ? (
                <form className="mb-3" name="formOTP" onSubmit={this.onSubmitLoginOtp.bind(this)}>
                  <Input
                    type="text"
                    name="otp"
                    maxLength="6"
                    className="otp col-lg-4 offset-lg-4"
                    data-validate='["required"]'
                  />

                  <button className="btn btn-block btn-primary mt-3 btn-color" type="submit">Submit OTP</button>
                </form>
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
                  <form className="mb-3" name="formLogin" onSubmit={this.onSubmitLogin.bind(this)}>
                    <div className="form-group">
                      <label className="text-muted" htmlFor="username"><Trans i18nKey='login.USERNAME'>Username</Trans></label>
                      <div className="input-group with-focus">
                        <input
                          type="text"
                          name="username"
                          className="form-control border-right-0 input-font-size"
                          placeholder="contoh: simpool"
                          invalid={this.hasError('formLogin', 'username', 'required')}
                          onChange={this.validateOnChange}
                          data-validate='["required"]'
                          value={this.state.formLogin.username} />
                        <div className="input-group-append">
                          <span className="input-group-text text-muted bg-transparent border-left-0">
                            <em className="fa fa-envelope"></em>
                          </span>
                        </div>
                        {this.hasError('formLogin', 'username', 'required') && <span className="invalid-feedback"><Trans i18nKey='forms.REQUIRED'>Form is required!</Trans></span>}
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="text-muted" htmlFor="resetInputEmail1"><Trans i18nKey='login.PASSWORD'>Password</Trans></label>
                      <div className="input-group with-focus">
                        <input type="password"
                          id="id-password"
                          name="password"
                          className="form-control border-right-0 input-font-size"
                          placeholder="Xxxx12345"
                          invalid={this.hasError('formLogin', 'password', 'required')}
                          onChange={this.validateOnChange}
                          data-validate='["required"]'
                          value={this.state.formLogin.password}
                        />
                        <div className="input-group-append">
                          <span className="input-group-text text-muted bg-transparent border-left-0">
                            <em className="fa fa-lock"></em>
                          </span>
                        </div>
                        <span className="invalid-feedback"><Trans i18nKey='forms.REQUIRED'>Form is required!</Trans></span>
                      </div>
                    </div>
                    <div className="text-center py-2">
                      <label className="c-radio">
                        <Input id="id" type="radio" name="i-radio" defaultValue="id" defaultChecked={isId} onClick={() => this.changeLanguage('id')} />
                        <span className="fa fa-circle"></span>Bahasa Indonesia</label>
                      <label className="c-radio">
                        <Input id="en" type="radio" name="i-radio" defaultValue="en" defaultChecked={isEn} onClick={() => this.changeLanguage('en')} />
                        <span className="fa fa-circle"></span>English</label>
                    </div>
                    <button className="btn btn-block btn-primary mt-3 btn-color" type="submit"><Trans i18nKey='login.LOGIN'>Login</Trans></button>
                  </form>
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
  dashboard: PropTypes.object
}

const mapStateToProps = state => ({
  auth: state.auth,
  dashboard: state.dashboard
})
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) })

export default compose(connect(mapStateToProps, mapDispatchToProps), withTranslation('translations'))(Login);
