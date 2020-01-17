import React, { Component, useState } from 'react';
import {
  Button,
  Card,
  CardBody,
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

import FormValidator from '../../../components/Forms/FormValidator';

const stepNavitemStyle = {
  backgroundColor: '#fcfcfc'
};

export function DragDrop(props) {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({ multiple: false });

  const files = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <Container className="container-md mt-3">
      <section>
        <div {...getRootProps({ className: 'dropzone' })}>
          <input name={props.name} {...getInputProps()} />
          <p className="text-center box-placeholder m-0">Drag 'n' drop some files here, or click to select files</p>
        </div>
        <aside>
          <h4>Files</h4>
          <ul>{files}</ul>
        </aside>
      </section>
    </Container>
  );
}

export function DragDropMultiple(props) {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

  const files = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <Container className="container-md mt-3">
      <section>
        <div {...getRootProps({ className: 'dropzone' })}>
          <input name={props.name} {...getInputProps()} />
          <p className="text-center box-placeholder m-0">Drag 'n' drop some files here, or click to select files</p>
        </div>
        <aside>
          <h4>Files</h4>
          <ul>{files}</ul>
        </aside>
      </section>
    </Container>
  );
}

class AddValidation extends Component {
  state = {
    dropdownOpen: false,
    activeStep: '2',
    files: [],

    /* Group each form state in an object.
       Property name MUST match the form name */
    privateIdentity: {
      registrationDate: '',
      serviceOffice: '',
      fullName: '',
      birthplace: '',
      birthdate: '',
      noKTP: '',
      NPWP: '',
      oldMemberNumber: '',
      phoneNumber: '',
      email: ''
    },
    address: {
      address: '',
      city: '',
      zipCode: '',
      addressDomicile: '',
      cityDomicile: '',
      zipCodeDomicile: ''
    }
  };

  toggleDropDown = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  toggleStep = activeStep => () => {
    // For submit we can obtain the form from the event
    // but for each step we need a global ref to the element
    const form = this.formWizardRef;
    // To validate only the inputs in the current steps, we use an id to query the tabPane
    // and then find all form elements for the current step only.
    const tabPane = document.getElementById('tabPane' + this.state.activeStep);
    const inputs = [].slice.call(tabPane.querySelectorAll('input,select'));
    // Run validation of inputs
    const { errors, hasError } = FormValidator.bulkValidate(inputs);

    // Update state so the validation message are shown/hidden
    this.setState({
      [form.name]: {
        ...this.state[form.name],
        errors
      }
    });

    // and prevent change the if form is not valid
    if (!hasError) {
      if (this.state.activeStep !== activeStep) {
        this.setState({
          activeStep
        });
      }
    }
  };

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

    e.preventDefault()
  }

  /* Simplify error check */
  hasError = (formName, inputName, method) => {
    return (
      this.state[formName] &&
      this.state[formName].errors &&
      this.state[formName].errors[inputName] &&
      this.state[formName].errors[inputName][method]
    );
  };

  handleInputChange = event => {
    const target = event.currentTarget;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  };

  handleSubmit = e => {
    const form = e.target;
    const inputs = [...form.elements].filter(i => ['INPUT', 'SELECT'].includes(i.nodeName));

    const { errors, hasError } = FormValidator.bulkValidate(inputs);

    this.setState({
      [form.name]: {
        ...this.state[form.name],
        errors
      }
    });

    console.log(hasError ? 'Form has errors. Check!' : 'Form Submitted!');

    e.preventDefault();
  };

  // Keep a reference to the form to access from the steps methods
  formRef = node => (this.formWizardRef = node);

  fileReader = acceptedFiles => {
    console.log(acceptedFiles)
    const reader = new FileReader()

    const files = acceptedFiles.map(file => (
      <aside>
        <ul>
          <li key={file.path}>
            {file.path} - {file.size} bytes
          </li>
        </ul>
      </aside>
    ));

    reader.onabort = () => console.log('file reading was aborted')
    reader.onerror = () => console.log('file reading has failed')
    reader.onload = () => {
      // Do whatever you want with the file contents
      const binaryStr = reader.result
      console.log(binaryStr)

      return (
        { files }
      )
    }

    reader.readAsArrayBuffer(acceptedFiles[0])
  }

  render() {
    const dd = String(new Date().getDate()).padStart(2, '0')
    const mm = String(new Date().getMonth() + 1).padStart(2, '0') //January is 0!
    const yyyy = new Date().getFullYear()

    const today = dd + '/' + mm + '/' + yyyy

    return (
      <Form innerRef={this.formRef} name="privateIdentity" onSubmit={this.handleSubmit}>
        <Card className="card-default">
          <CardBody>
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
                    Identitas Pribadi
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
                    Alamat
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
                    Dokumen
                  </h4>
                </NavLink>
              </NavItem>
            </Nav>
          </CardBody>
          <TabContent activeTab={this.state.activeStep}>
            <TabPane id="tabPane1" tabId="1">
              <div className="pt-3 mb-3">
                <fieldset>
                  <label htmlFor="registrationDate">Tanggal Pendaftaran *</label>
                  <Input
                    type="text"
                    id="registrationDate"
                    name="registrationDate"
                    onChange={this.validateOnChange}
                    invalid={this.hasError(
                      'privateIdentity',
                      'registrationDate',
                      'required'
                    )}
                    value={today}
                    placeholder="dd-mm-yyyy"
                    data-validate='["required"]'
                  />
                  <span className="invalid-feedback">Kolom harus diisi!</span>

                  <label className="mt-3" htmlFor="serviceOffice">Kantor Pelayanan *</label>
                  <select defaultValue="" className="custom-select custom-select-sm" name="serviceOffice" required>
                    <option>Kantor Pelayanan</option>
                    <option defaultValue="office1">Kantor 1</option>
                    <option defaultValue="office2">Kantor 2</option>
                    <option defaultValue="office3">Kantor 3</option>
                  </select>
                  <span className="invalid-feedback">Kolom harus diisi!</span>

                  <label className="mt-3" htmlFor="memberType">Jenis Anggota *</label>
                  <div className="py-2">
                    <label className="c-radio">
                      <Input id="individu" type="radio" name="memberType" defaultValue="individu" required />
                      <span className="fa fa-circle"></span>Individu</label>
                    <label className="c-radio">
                      <Input id="badanUsaha" type="radio" name="memberType" defaultValue="badanUsaha" />
                      <span className="fa fa-circle"></span>Badan Usaha</label>
                  </div>
                  <span className="invalid-feedback">Kolom harus diisi!</span>

                  <label htmlFor="membership">Keanggotaan</label>
                  <div className="py-2">
                    <label className="c-radio">
                      <Input id="anggota" type="radio" name="membership" defaultValue="anggota" />
                      <span className="fa fa-circle"></span>Anggota</label>
                    <label className="c-radio">
                      <Input id="calonAnggota" type="radio" name="membership" defaultValue="calonAnggota" />
                      <span className="fa fa-circle"></span>Calon Anggota</label>
                    <label className="c-radio">
                      <Input id="pelanggan" type="radio" name="membership" defaultValue="pelanggan" />
                      <span className="fa fa-circle"></span>Pelanggan</label>
                  </div>
                  <span className="invalid-feedback">Kolom harus diisi!</span>

                  <label htmlFor="fullName">Nama Lengkap *</label>
                  <Input
                    type="text"
                    id="fullName"
                    name="fullName"
                    onChange={this.validateOnChange}
                    invalid={this.hasError(
                      'privateIdentity',
                      'fullName',
                      'required'
                    )}
                    placeholder="contoh: Ikkat Inovasi Teknologi"
                    value={this.state.privateIdentity.fullName}
                    data-validate='["required"]'
                  />
                  <span className="invalid-feedback">Kolom harus diisi!</span>

                  <label className="mt-3" htmlFor="birthplace">Tempat Lahir</label>
                  <Input
                    type="text"
                    id="birthplace"
                    name="birthplace"
                    onChange={this.validateOnChange}
                    invalid={this.hasError(
                      'privateIdentity',
                      'birthplace'
                    )}
                    placeholder="contoh: Tangerang"
                    value={this.state.privateIdentity.birthplace}
                  />

                  <label className="mt-3" htmlFor="birthdate">Tanggal Lahir *</label>
                  <Input
                    type="text"
                    id="birthdate"
                    name="birthdate"
                    onChange={this.validateOnChange}
                    invalid={this.hasError(
                      'privateIdentity',
                      'birthdate',
                      'required'
                    )}
                    placeholder="dd-mm-yyyy"
                    value={this.state.privateIdentity.birthdate}
                    data-validate='["required"]'
                  />
                  <span className="invalid-feedback">Kolom harus diisi!</span>

                  <label className="mt-3" htmlFor="gender">Jenis Kelamin</label>
                  <div className="py-2">
                    <label className="c-radio">
                      <Input id="man" type="radio" name="gender" defaultValue="man" />
                      <span className="fa fa-circle"></span>Laki-laki</label>
                    <label className="c-radio">
                      <Input id="woman" type="radio" name="gender" defaultValue="woman" />
                      <span className="fa fa-circle"></span>Perempuan</label>
                  </div>

                  <label className="mt-3" htmlFor="noKTP">No. KTP</label>
                  <Input
                    type="number"
                    id="noKTP"
                    name="noKTP"
                    onChange={this.validateOnChange}
                    invalid={this.hasError(
                      'privateIdentity',
                      'noKTP'
                    )}
                    placeholder="101001002"
                    value={this.state.privateIdentity.noKTP}
                  />

                  <label className="mt-3" htmlFor="NPWP">NPWP</label>
                  <Input
                    type="text"
                    id="NPWP"
                    name="NPWP"
                    onChange={this.validateOnChange}
                    invalid={this.hasError(
                      'privateIdentity',
                      'NPWP'
                    )}
                    type="number"
                    placeholder="101001002"
                    value={this.state.privateIdentity.NPWP}
                  />

                  <label className="mt-3" htmlFor="oldMemberNumber">No. Anggota Lama</label>
                  <Input
                    type="text"
                    id="oldMemberNumber"
                    name="oldMemberNumber"
                    onChange={this.validateOnChange}
                    invalid={this.hasError(
                      'privateIdentity',
                      'oldMemberNumber'
                    )}
                    placeholder="contoh: 123456789"
                    value={this.state.privateIdentity.oldMemberNumber}
                  />

                  <label className="mt-3" htmlFor="marriageStatus">Status Pernikahan</label>
                  <select defaultValue="" className="custom-select custom-select-sm" name="marriageStatus" required>
                    <option>Status Pernikahan</option>
                    <option defaultValue="married">Menikah</option>
                    <option defaultValue="single">Lajang</option>
                  </select>

                  <label className="mt-3" htmlFor="religion">Agama</label>
                  <select defaultValue="" className="custom-select custom-select-sm" name="religion" required>
                    <option>Agama</option>
                    <option defaultValue="islam">Islam</option>
                    <option defaultValue="kristen">Kristen</option>
                    <option defaultValue="katolik">Katolik</option>
                    <option defaultValue="hindu">Hindu</option>
                    <option defaultValue="buddha">Buddha</option>
                  </select>

                  <label className="mt-3" htmlFor="phoneNumber">Nomor Telpon</label>
                  <Input
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    onChange={this.validateOnChange}
                    invalid={this.hasError(
                      'privateIdentity',
                      'phoneNumber'
                    )}
                    placeholder="contoh: 123456789"
                    value={this.state.privateIdentity.phoneNumber}
                  />


                  <label className="mt-3" htmlFor="email">Email</label>
                  <Input type="email"
                    name="email"
                    invalid={this.hasError('privateIdentity', 'email', 'email')}
                    onChange={this.validateOnChange}
                    value={this.state.privateIdentity.email}
                    placeholder="contoh: simpool@ikkat.com" />
                  {this.hasError('privateIdentity', 'email', 'email') && <span className="invalid-feedback">Field must be valid email</span>}

                  <div>
                    <p className="mt-4">(*) Harus Diisi</p>
                    <div className="d-flex">
                      {/*<Button color="secondary">Previous</Button>*/}
                      <Button
                        className="ml-auto"
                        color="primary"
                        onClick={this.toggleStep('2')}
                      >
                        Lanjutkan
                      </Button>
                    </div>
                  </div>
                </fieldset>
              </div>
            </TabPane>
            <TabPane id="tabPane2" tabId="2">
              <div className="pt-3 mb-3">
                <fieldset>
                  <p className="lead text-center">Identitas</p>
                  <label className="mt-3" htmlFor="address">Alamat Sesuai Identitas</label>
                  <Input
                    type="text"
                    id="address"
                    name="address"
                    onChange={this.validateOnChange}
                    invalid={this.hasError(
                      'privateIdentity',
                      'address'
                    )}
                    placeholder="contoh: One PM, Gading Serpong, Tangerang"
                    value={this.state.address.address}
                  />

                  <label className="mt-3" htmlFor="zipCode">Kode Pos</label>
                  <Input
                    type="number"
                    id="zipCode"
                    name="zipCode"
                    onChange={this.validateOnChange}
                    invalid={this.hasError(
                      'privateIdentity',
                      'zipCode'
                    )}
                    placeholder="101001002"
                    value={this.state.address.zipCode}
                  />

                  <label className="mt-3" htmlFor="city">Kabupaten/Kota</label>
                  <Input
                    type="text"
                    id="city"
                    name="city"
                    onChange={this.validateOnChange}
                    invalid={this.hasError(
                      'privateIdentity',
                      'city'
                    )}
                    placeholder="contoh: Tangerang"
                    value={this.state.address.city}
                  />

                  <label className="mt-3" htmlFor="province">Provinsi</label>
                  <select defaultValue="" className="custom-select custom-select-sm" name="province">
                    <option>List Provinsi</option>
                    <option defaultValue="province1">Provinsi 1</option>
                    <option defaultValue="province2">Provinsi 2</option>
                    <option defaultValue="province3">Provinsi 3</option>
                  </select>


                  <p className="lead text-center mt-5">Domisili</p>
                  <label className="mt-3" htmlFor="addressDomicile">Alamat Sesuai Domisili</label>
                  <Input
                    type="text"
                    id="addressDomicile"
                    name="addressDomicile"
                    onChange={this.validateOnChange}
                    invalid={this.hasError(
                      'privateIdentity',
                      'addressDomicile'
                    )}
                    placeholder="contoh: One PM, Gading Serpong, Tangerang"
                    value={this.state.address.addressDomicile}
                  />

                  <label className="mt-3" htmlFor="zipCodeDomicile">Kode Pos</label>
                  <Input
                    type="number"
                    id="zipCodeDomicile"
                    name="zipCodeDomicile"
                    onChange={this.validateOnChange}
                    invalid={this.hasError(
                      'privateIdentity',
                      'zipCodeDomicile'
                    )}
                    placeholder="101001002"
                    value={this.state.address.zipCodeDomicile}
                  />

                  <label className="mt-3" htmlFor="cityDomicile">Kabupaten/Kota</label>
                  <Input
                    type="text"
                    id="cityDomicile"
                    name="cityDomicile"
                    onChange={this.validateOnChange}
                    invalid={this.hasError(
                      'privateIdentity',
                      'cityDomicile'
                    )}
                    placeholder="contoh: Tangerang"
                    value={this.state.address.cityDomicile}
                  />

                  <label className="mt-3" htmlFor="provinceDomicile">Provinsi</label>
                  <select defaultValue="" className="custom-select custom-select-sm" name="provinceDomicile">
                    <option>List Provinsi</option>
                    <option defaultValue="province1">Provinsi 1</option>
                    <option defaultValue="province2">Provinsi 2</option>
                    <option defaultValue="province3">Provinsi 3</option>
                  </select>

                  <p className="mt-3">(*) Mandatory</p>
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
                    <DragDrop name="photo" />
                  </Container>

                  <Container className="container-md mt-3">
                    <p className="lead text-center">Upload KTP</p>
                    <DragDrop name="ktp" />
                  </Container>

                  <Container className="container-md mt-3">
                    <p className="lead text-center">Upload NPWP</p>
                    <DragDrop name="npwp" />
                  </Container>

                  <Container className="container-md mt-3">
                    <p className="lead text-center">Upload Dokumen Lain</p>
                    <DragDropMultiple name="otherDocuments" />
                  </Container>
                </fieldset>
              </div>
              <hr />
              <div className="d-flex">
                <Button className="ml-auto mr-3" color="secondary" onClick={this.toggleStep('2')}>
                  Sebelumnya
                </Button>
                <Button color="primary" type="submit">
                  Finish
                </Button>
              </div>
            </TabPane>
          </TabContent>
        </Card>
      </Form>
    );
  }
}

export default AddValidation;
