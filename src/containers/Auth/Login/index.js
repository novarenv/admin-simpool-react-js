import React, { Component } from 'react';
import { Input, CustomInput } from 'reactstrap';
import Cookies from "js-cookie";

import FormValidator from '../../../components/Forms/FormValidator.js';

class Login extends Component {

  state = {
    formLogin: {
      username: 'novarenv',
      password: 'pensjoss',
      checkUsername: 'novarenv',
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
    console.log(this.state.formLogin.username)
    console.log(this.state.formLogin.password)

    e.preventDefault()
    if(this.state.formLogin.username === this.state.formLogin.checkUsername && this.state.formLogin.password === this.state.formLogin.checkPassword ){
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
            <div>
              <img className="block-center rounded" src="img/Simpool Box.png" alt="Logo"/>
            </div>
          </div>
          <div className="card-body">
            <form className="mb-3" name="formLogin" onSubmit={this.onSubmit.bind(this)}>
              <div className="form-group">
                <label className="text-muted" htmlFor="username">Username</label>
                <div className="input-group with-focus">
                  <Input
                    type="text"
                    name="username"
                    className="border-right-0"
                    placeholder="simpoool"
                    invalid={this.hasError('formLogin','username','required')}
                    onChange={this.validateOnChange}
                    data-validate='["required"]'
                    value={this.state.formLogin.username}/>
                  <div className="input-group-append">
                    <span className="input-group-text text-muted bg-transparent border-left-0">
                      <em className="fa fa-envelope"></em>
                    </span>
                  </div>
                  { this.hasError('formLogin','username','required') && <span className="invalid-feedback">Field is required</span> }
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
                <CustomInput type="checkbox" id="remember-me"
                  className="float-left mt-0"
                  name="remember-me"
                  label="Remember Me">
                </CustomInput>
              </div>
              <div className="text-center py-2">
                <label className="c-radio">
                  <Input id="b-indonesia" type="radio" name="i-radio" defaultValue="b-indonesia"/>
                  <span className="fa fa-circle"></span>Bahasa Indonesia</label>
                <label className="c-radio">
                  <Input id="english" type="radio" name="i-radio" defaultValue="english" defaultChecked/>
                  <span className="fa fa-circle"></span>English</label>
              </div>
              <button className="btn btn-block btn-primary mt-3 btn-color" type="submit">Login</button>
            </form>
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
