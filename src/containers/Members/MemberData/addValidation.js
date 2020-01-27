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

import FormValidator from '../../../components/Forms/FormValidator';

// DateTimePicker
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';

const stepNavitemStyle = {
  backgroundColor: '#fcfcfc'
};

const MONTHS = [
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
          <h4>File</h4>
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
    notDuplicate: false,
    formValidateDuplicate: false,
    activeStep: '1',
    files: [],

    /* Group each form state in an object.
       Property name MUST match the form name */
    addValidation: {
      fullName: '',
      birthplace: '',
      address: '',
      noKTP: '',
      motherName: '',

      registrationDate: '',
      serviceOffice: '',
      birthdate: '',
      NPWP: '',
      oldMemberNumber: '',
      phoneNumber: '',
      email: '',


      address1: '',
      city: '',
      zipCode: '',
      addressDomicile: '',
      cityDomicile: '',
      zipCodeDomicile: ''
    }
  };

  isNotDuplicate = () => {
    this.setState({
      notDuplicate: !this.state.notDuplicate
    });
  }

  showNotDuplicate = () => {
    return (
      <div>
        <label className="mt-3" htmlFor="memberType">Jenis Anggota *</label>
        <div className="py-2">
          <label className="c-radio">
            <Input id="individu" type="radio" name="memberType" className="input-font-size" defaultValue="individu" tabIndex="7" defaultChecked required />
            <span className="fa fa-circle"></span>Individu</label>
          <span className="span-disabled">
            <label className="c-radio">
              <Input id="badanUsaha" type="radio" name="memberType" className="input-font-size" defaultValue="badanUsaha" disabled />
              <span className="fa fa-circle"></span>Badan Usaha</label>
          </span>
        </div>
        <span className="invalid-feedback">Kolom harus diisi!</span>

        <label htmlFor="membership">Keanggotaan</label>
        <div className="py-2">
          <label className="c-radio">
            <Input id="anggota" type="radio" name="membership" defaultValue="anggota" />
            <span className="fa fa-circle"></span>Anggota</label>
          <label className="c-radio">
            <Input id="anggotaLuarBiasa" type="radio" name="membership" defaultValue="anggotaLuarBiasa" />
            <span className="fa fa-circle"></span>Anggota Luar Biasa</label>
          <label className="c-radio">
            <Input id="calonAnggota" type="radio" name="membership" defaultValue="calonAnggota" />
            <span className="fa fa-circle"></span>Calon Anggota</label>
        </div>
        <span className="invalid-feedback">Kolom harus diisi!</span>

        <label className="mt-3" htmlFor="birthplace">Tempat Lahir</label>
        <Input
          name="birthplace"
          className="input-font-size"
          type="text"
          id="birthplace"
          onChange={this.validateOnChange}
          invalid={this.hasError(
            'addValidation',
            'birthplace'
          )}
          placeholder="contoh: Tangerang"
          value={this.state.addValidation.birthplace}
        />

        <label className="mt-3" htmlFor="gender">Jenis Kelamin</label>
        <div className="py-2">
          <label className="c-radio">
            <Input id="man" type="radio" name="gender" className="input-font-size" defaultValue="man" />
            <span className="fa fa-circle"></span>Laki-laki</label>
          <label className="c-radio">
            <Input id="woman" type="radio" name="gender" className="input-font-size" defaultValue="woman" />
            <span className="fa fa-circle"></span>Perempuan</label>
        </div>

        <label className="mt-3" htmlFor="NPWP">NPWP</label>
        <Input
          name="NPWP"
          className="input-font-size"
          type="text"
          id="NPWP"
          onChange={this.validateOnChange}
          invalid={this.hasError(
            'addValidation',
            'NPWP'
          )}
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
          invalid={this.hasError(
            'addValidation',
            'oldMemberNumber'
          )}
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
        <select defaultValue="" className="custom-select custom-select-sm input-font-size" name="religion" required>
          <option>Agama</option>
          <option defaultValue="islam">Islam</option>
          <option defaultValue="kristen">Kristen</option>
          <option defaultValue="katolik">Katolik</option>
          <option defaultValue="hindu">Hindu</option>
          <option defaultValue="buddha">Buddha</option>
        </select>

        <label className="mt-3" htmlFor="phoneNumber">Nomor Telpon</label>
        <Input
          name="phoneNumber"
          className="input-font-size"
          type="text"
          id="phoneNumber"
          onChange={this.validateOnChange}
          invalid={this.hasError(
            'addValidation',
            'phoneNumber'
          )}
          placeholder="contoh: 123456789"
          value={this.state.addValidation.phoneNumber}
        />

        <label className="mt-3" htmlFor="email">Email</label>
        <Input
          name="email"
          className="input-font-size"
          type="email"
          id="email"
          invalid={this.hasError('addValidation', 'email', 'email')}
          onChange={this.validateOnChange}
          value={this.state.addValidation.email}
          placeholder="contoh: simpool@ikkat.com" />
        {this.hasError('addValidation', 'email', 'email') && <span className="invalid-feedback">Field must be valid email</span>}

        <div>
          <p className="mt-4">(*) Harus Diisi</p>
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

    this.setState({
      [this.state.address1]: this.state.address
    })

    console.log(hasError ? 'Form has errors. Check!' : 'Form Submitted!');

    e.preventDefault();
  };

  handleDate(birthdate) {
    this.setState({ birthdate });

    console.log(birthdate);
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

  render() {
    const dd = String(new Date().getDate()).padStart(2, '0')
    const mm = MONTHS[new Date().getMonth()]
    const yyyy = new Date().getFullYear()

    const today = dd + ' ' + mm + ' ' + yyyy

    return (
      <Form innerRef={this.formRef} name="addValidation" className="form-font-size" onSubmit={this.handleSubmit}>
        <Card className="card-default">
          <CardHeader>
            <div>{today}</div>
            <div>Kantor Pelayanan</div>
          </CardHeader>
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
          </CardBody>


          <TabContent activeTab={this.state.activeStep}>
            <TabPane id="tabPane1" tabId="1">
              <div className="pt-3 mb-3">
                <fieldset>

                  <label htmlFor="fullName">Nama Lengkap</label>
                  <Input
                    name="fullName"
                    className="input-font-size"
                    type="text"
                    id="fullName"
                    onChange={this.validateOnChange}
                    invalid={this.hasError(
                      'addValidation',
                      'fullName',
                      'required'
                    )}
                    tabIndex="1"
                    placeholder="contoh: Ikkat Inovasi Teknologi"
                    value={this.state.addValidation.fullName}
                    data-validate='["required"]'
                  />
                  <span className="invalid-feedback">Kolom harus diisi!</span>

                  <label className="mt-3" htmlFor="birthdate">Tanggal Lahir</label>
                  <Datetime
                    inputProps={{
                      name: "birthdate",
                      className: "form-control input-font-size",
                      id: "birthdate",
                      placeholder: "dd-mm-yyyy",
                      tabIndex: "2",
                      required: true
                    }}
                    value={this.state.addValidation.birthdate}
                    dateFormat="DD MMM YYYY"
                    closeOnSelect={true}
                    renderInput={this.renderInputGroup}
                    onChange={this.props.handleDate}
                  />

                  <label className="mt-3" htmlFor="address1">Alamat Sesuai Identitas</label>
                  <Input
                    name="address1"
                    className="input-font-size"
                    type="text"
                    id="address1"
                    onChange={this.validateOnChange}
                    invalid={this.hasError(
                      'addValidation',
                      'address1'
                    )}
                    tabIndex="3"
                    placeholder="contoh: One PM, Gading Serpong, Tangerang"
                    value={this.state.addValidation.address}
                  />

                  <label className="mt-3" htmlFor="noKTP">No. KTP</label>
                  <Input
                    name="noKTP"
                    className="input-font-size"
                    type="number"
                    id="noKTP"
                    onChange={this.validateOnChange}
                    invalid={this.hasError(
                      'addValidation',
                      'noKTP'
                    )}
                    tabIndex="4"
                    placeholder="101001002"
                    value={this.state.addValidation.noKTP}
                    required
                  />

                  <label className="mt-3" htmlFor="motherName">Nama Gadis Ibu Kandung</label>
                  <Input
                    name="motherName"
                    className="input-font-size"
                    type="text"
                    id="motherName"
                    onChange={this.validateOnChange}
                    invalid={this.hasError(
                      'addValidation',
                      'motherName'
                    )}
                    tabIndex="5"
                    placeholder="contoh: Ibu Pertiwi"
                    value={this.state.addValidation.motherName}
                    required
                  />

                  <button
                    className="btn btn-block btn-primary mt-4 justify-content-center"
                    type="submit"
                    onClick={this.isNotDuplicate}
                    tabIndex="6"
                  >
                    Cek Duplikasi
                  </button>

                  {
                    this.state.notDuplicate ? (
                      <this.showNotDuplicate />
                    ) : null
                  }
                </fieldset>
              </div>
            </TabPane>

            <TabPane id="tabPane2" tabId="2">
              <div className="pt-3 mb-3">
                <fieldset>
                  <p className="lead text-center">Identitas</p>

                  <label className="mt-3" htmlFor="address">Alamat Sesuai Identitas</label>
                  <Input
                    name="address"
                    className="input-font-size"
                    type="text"
                    id="address"
                    onChange={this.validateOnChange}
                    invalid={this.hasError(
                      'addValidation',
                      'address'
                    )}
                    placeholder="contoh: One PM, Gading Serpong, Tangerang"
                    value={this.state.addValidation.address1}
                    readOnly
                  />

                  <label className="mt-3" htmlFor="zipCode">Kode Pos</label>
                  <Input
                    name="zipCode"
                    className="input-font-size"
                    type="number"
                    id="zipCode"
                    onChange={this.validateOnChange}
                    invalid={this.hasError(
                      'addValidation',
                      'zipCode'
                    )}
                    placeholder="101001002"
                    value={this.state.addValidation.zipCode}
                  />

                  <label className="mt-3" htmlFor="city">Kabupaten/Kota</label>
                  <Input
                    name="city"
                    className="input-font-size"
                    type="text"
                    id="city"
                    onChange={this.validateOnChange}
                    invalid={this.hasError(
                      'addValidation',
                      'city'
                    )}
                    placeholder="contoh: Tangerang"
                    value={this.state.addValidation.city}
                  />

                  <label className="mt-3" htmlFor="province">Provinsi</label>
                  <select defaultValue="" className="custom-select custom-select-sm input-font-size" name="province">
                    <option>List Provinsi</option>
                    <option defaultValue="province1">Provinsi 1</option>
                    <option defaultValue="province2">Provinsi 2</option>
                    <option defaultValue="province3">Provinsi 3</option>
                  </select>


                  <p className="lead text-center mt-5">Domisili</p>
                  <label className="mt-3" htmlFor="addressDomicile">Alamat Sesuai Domisili</label>
                  <Input
                    name="addressDomicile"
                    className="input-font-size"
                    type="text"
                    id="addressDomicile"
                    onChange={this.validateOnChange}
                    invalid={this.hasError(
                      'addValidation',
                      'addressDomicile'
                    )}
                    placeholder="contoh: One PM, Gading Serpong, Tangerang"
                    value={this.state.addValidation.addressDomicile}
                  />

                  <label className="mt-3" htmlFor="zipCodeDomicile">Kode Pos</label>
                  <Input
                    name="zipCodeDomicile"
                    className="input-font-size"
                    type="number"
                    id="zipCodeDomicile"
                    onChange={this.validateOnChange}
                    invalid={this.hasError(
                      'addValidation',
                      'zipCodeDomicile'
                    )}
                    placeholder="101001002"
                    value={this.state.addValidation.zipCodeDomicile}
                  />

                  <label className="mt-3" htmlFor="cityDomicile">Kabupaten/Kota</label>
                  <Input
                    name="cityDomicile"
                    className="input-font-size"
                    type="text"
                    id="cityDomicile"
                    onChange={this.validateOnChange}
                    invalid={this.hasError(
                      'addValidation',
                      'cityDomicile'
                    )}
                    placeholder="contoh: Tangerang"
                    value={this.state.addValidation.cityDomicile}
                  />

                  <label className="mt-3" htmlFor="provinceDomicile">Provinsi</label>
                  <select defaultValue="" className="custom-select custom-select-sm input-font-size" name="provinceDomicile">
                    <option>List Provinsi</option>
                    <option defaultValue="province1">Provinsi 1</option>
                    <option defaultValue="province2">Provinsi 2</option>
                    <option defaultValue="province3">Provinsi 3</option>
                  </select>
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
                    <DragDrop name="npwpUpload" />
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
      </Form >
    );
  }
}

export default AddValidation;
