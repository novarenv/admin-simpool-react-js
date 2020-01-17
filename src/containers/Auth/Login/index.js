import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Input, CustomInput } from 'reactstrap';
import Cookies from "js-cookie";

import FormValidator from '../../../components/Forms/FormValidator.js';

class Login extends Component {

  state = {
    formLogin: {
      email: 'novarenv@gmail.com',
      password: 'pensjoss',
      checkEmail: 'novarenv@gmail.com',
      checkPassword: 'pensjoss'
    }
  }

   /**
    * Validate input using onChange event
    * @param  {String} formName The name of the form in the state object
    * @return {Function} a function used for the event
    */
  validateOnChange = event => {
    const input = event.target;
    const form = input.form
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

  onSubmit = e => {
    const form = e.target;
    const inputs = [...form.elements].filter(i => ['INPUT', 'SELECT'].includes(i.nodeName))

    const { errors, hasError } = FormValidator.bulkValidate(inputs)

    this.setState({
      [form.name]: {
        ...this.state[form.name],
        errors
      }
    });

    console.log(hasError ? 'Form has errors. Check!' : 'Form Submitted!')
    console.log(this.state.formLogin.email)
    console.log(this.state.formLogin.password)

    e.preventDefault()
    if(this.state.formLogin.email === this.state.formLogin.checkEmail && this.state.formLogin.password === this.state.formLogin.checkPassword ){
      Cookies.set("loginToken", "Token", { expires: 7 })
      this.props.history.push("/")
    }
  }

  /* Simplify error check */
  hasError = (formName, inputName, method) => {
    return  this.state[formName] &&
        this.state[formName].errors &&
        this.state[formName].errors[inputName] &&
        this.state[formName].errors[inputName][method]
  }

  render() {
    return (
      <div className="block-center mt-4 wd-xl">
        <div className="card card-flat">
          <div className="card-header text-center bg-dark">
            <a href="">
              <img className="block-center rounded" src="img/Simpool Box.png" alt="Logo"/>
            </a>
          </div>
          <div className="card-body">
            <p className="text-center py-2">SIGN IN TO CONTINUE.</p>
            <form className="mb-3" name="formLogin" onSubmit={this.onSubmit.bind(this)}>
              <div className="form-group">
                <label className="text-muted" htmlFor="resetInputEmail1">Email address</label>
                <div className="input-group with-focus">
                  <Input type="email"
                    name="email"
                    className="border-right-0"
                    placeholder="simpool@simpool.com"
                    invalid={this.hasError('formLogin','email','required')||this.hasError('formLogin','email','email')}
                    onChange={this.validateOnChange}
                    data-validate='["required", "email"]'
                    value={this.state.formLogin.email}/>
                  <div className="input-group-append">
                    <span className="input-group-text text-muted bg-transparent border-left-0">
                      <em className="fa fa-envelope"></em>
                    </span>
                  </div>
                  { this.hasError('formLogin','email','required') && <span className="invalid-feedback">Field is required</span> }
                  { this.hasError('formLogin','email','email') && <span className="invalid-feedback">Field must be valid email</span> }
                </div>
              </div>
              <div className="form-group">
                <label className="text-muted" htmlFor="resetInputEmail1">Password</label>
                <div className="input-group with-focus">
                  <Input type="password"
                    id="id-password"
                    name="password"
                    className="border-right-0"
                    placeholder="Xxxx12345"
                    invalid={this.hasError('formLogin','password','required')}
                    onChange={this.validateOnChange}
                    data-validate='["required"]'
                    value={this.state.formLogin.password}
                  />
                  <div className="input-group-append">
                    <span className="input-group-text text-muted bg-transparent border-left-0">
                      <em className="fa fa-lock"></em>
                    </span>
                  </div>
                  <span className="invalid-feedback">Field is required</span>
                </div>
              </div>
              <div className="clearfix">
                <CustomInput type="checkbox" id="rememberme"
                  className="float-left mt-0"
                  name="remember"
                  label="Remember Me">
                </CustomInput>
                <div className="float-right">
                  <Link to="recover" className="text-muted">Forgot your password?</Link>
                </div>
              </div>
              <div className="text-center py-2">
                <label className="c-radio">
                  <Input id="english" type="radio" name="i-radio" defaultValue="english" defaultChecked/>
                  <span className="fa fa-circle"></span>English</label>
                <label className="c-radio">
                  <Input id="b-indonesia" type="radio" name="i-radio" defaultValue="b-indonesia"/>
                  <span className="fa fa-circle"></span>Bahasa Indonesia</label>
              </div>
              <button className="btn btn-block btn-primary mt-3" type="submit">Login</button>
            </form>
            <p className="pt-3 text-center">Need to Signup?</p>
            <Link to="register" className="btn btn-block btn-secondary">Register Now</Link>
          </div>
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

export default Login;
