import React, { Component, useState } from 'react';
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
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import ReactDataGrid from 'react-data-grid';
import { Formik } from 'formik';

import * as actions from '../../../store/actions/actions';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';

import ContentWrapper from '../../../components/Layout/ContentWrapper';
import FormValidator from '../../../components/Forms/FormValidator';

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

const COLUMN_WIDTH = 250;

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

    this._columns = [
      {
        key: 'ID_MEMBER',
        name: 'Id',
        width: 100,
        frozen: true
      },
      {
        key: 'EXTERNAL_ID',
        name: 'External Id',
        sortable: true,
        width: COLUMN_WIDTH
      },
      {
        key: 'FULL_NAME',
        name: 'Full Name',
        sortable: true,
        width: COLUMN_WIDTH
      },
      {
        key: 'OFFICE',
        name: 'Office',
        sortable: true,
        width: COLUMN_WIDTH
      },
      {
        key: 'STATUS',
        name: 'Status',
        sortable: true,
        width: COLUMN_WIDTH
      }
    ];

    this.state = {
      notDuplicate: false,
      privateIdentity: false,
      formValidateDuplicate: false,
      totalFilteredRecords: false,
      pageItems: [],
      today: '',
      activeStep: '3',
      files: [],

      rows: [],
      rowIdx: '',

      /* Group each form state in an object.
         Property name MUST match the form name */
      addValidation: {
        registrationDate: '',
        legalFormId: '1',
        typeOfIdentityId: 'default',
        identityTypeOptions: [],
        fullname: '',
        placeOfBirth: '',
        addressBasedOnIdentity: '',
        identityNumber: '',
        motherName: '',

        officeId: '',
        birthdate: '',
        NPWP: '',
        oldMemberNumber: '',
        religion: '',
        religionOptions: [],
        gender: '',
        mobileNo: '',
        email: '',


        identityProvinceId: 'default',
        provinceOptions: [],
        identityCityId: 'default',
        cityOptions: [],
        cityOptionsFilter: [],
        identityPostalCode: '',
        addressDomicile: '',
        cityDomicile: '',
        zipCodeDomicile: '',


        selfiePhoto: {},
        idCardPhoto: {},
        npwpPhoto: {},
        otherDocuments: []
      }
    };

    this.props.actions.clientTemplate({}, this.setClientTemplate)
  }

  componentDidMount() {
    const dd = String(new Date().getDate()).padStart(2, '0')
    const mmmm = MONTHS_ID[new Date().getMonth()]
    const yyyy = new Date().getFullYear()

    const today = dd + ' ' + mmmm + ' ' + yyyy
    this.setState({
      today: today
    })
  }

  setClientTemplate = res => {
    let identityTypeOptions = [];
    res.typeOfIdentityOptions.map(row => {
      identityTypeOptions.push(row)
    })
    this.setState(prevState =>
      ({
        addValidation: {
          ...prevState.addValidation,
          identityTypeOptions: identityTypeOptions
        }
      })
    )

    let religionOptions = [];
    res.religionOption.map(row => {
      religionOptions.push(row)
    })
    this.setState(prevState =>
      ({
        addValidation: {
          ...prevState.addValidation,
          religionOptions: religionOptions
        }
      })
    )

    let provinceOptions = [];
    res.provinceOptions.map(row => {
      provinceOptions.push(row)
    })
    this.setState(prevState =>
      ({
        addValidation: {
          ...prevState.addValidation,
          provinceOptions: provinceOptions
        }
      })
    )

    let cityOptions = [];
    res.cityOptions.map(row => {
      cityOptions.push(row)
    })
    this.setState(prevState =>
      ({
        addValidation: {
          ...prevState.addValidation,
          cityOptions: cityOptions
        }
      })
    )
    this.setState(prevState =>
      ({
        addValidation: {
          ...prevState.addValidation,
          cityOptionsFilter: cityOptions
        }
      })
    )
  }

  checkDuplicate = () => {
    const addValidation = this.state.addValidation

    const createRows = rows => {
      let rowsTemp = [];
      rows.map(row => {
        rowsTemp.push({
          ID_MEMBER: row.accountNo,
          EXTERNAL_ID: row.legalForm.value,
          FULL_NAME: row.displayName,
          OFFICE: row.officeName,
          STATUS: row.status.value
        })
      })
      this.setState({
        rows: rowsTemp
      })
    };

    const checkTotalFilter = res => {
      if (res.totalFilteredRecords > 0) {
        this.setState({
          totalFilteredRecords: true,
          pageItems: res.pageItems
        })
        createRows(res.pageItems)
      }
    }

    this.props.actions.checkDuplicate(
      {
        fullname: addValidation.fullname,
        dateOfBirth: addValidation.birthdate,
        addressBasedOnIdentity: addValidation.addressBasedOnIdentity,
        motherName: addValidation.motherName,
        typeOfIdentityId: addValidation.typeOfIdentityId,
        identityNumber: addValidation.identityNumber
      },
      checkTotalFilter
    )

    this.setState({
      notDuplicate: true,
      privateIdentity: false
    });
  }

  rowGetter = (i) => this.state.rows[i]

  handleGridSort = (sortColumn, sortDirection) => {
    const comparer = (a, b) => {
      if (sortDirection === 'ASC') {
        return (a[sortColumn] > b[sortColumn]) ? 1 : -1;
      } else if (sortDirection === 'DESC') {
        return (a[sortColumn] < b[sortColumn]) ? 1 : -1;
      }
    };

    const rows = sortDirection === 'NONE' ? this.state.originalRows.slice(0) : this.state.rows.sort(comparer);

    this.setState({ rows });
  };

  ShowNotDuplicate = () => {
    const setNotDuplicate = () => {
      this.setState({
        notDuplicate: false,
        privateIdentity: true
      });
    }

    if (this.state.totalFilteredRecords) {
      return (
        <div>
          <ReactDataGrid
            onGridSort={this.handleGridSort}
            columns={this._columns}
            rowGetter={this.rowGetter}
            rowsCount={this.state.rows.length}
            minHeight={700}
            onCellSelected={this.onCellSelected}
            onGridRowsUpdated={this.onGridRowsUpdated}
          />
          <Button outline color="primary" className="btn btn-block mt-4 justify-content-center"
            onClick={() => setNotDuplicate()}>Create Member</Button>
        </div>
      )
    } else {
      return (
        <div>
          <Button disabled className="col-12">Tidak ada data yang sama!</Button>
          <Button outline color="primary" className="btn btn-block mt-4 justify-content-center"
            onClick={() => setNotDuplicate()}>Create Member</Button>
        </div>
      )
    }
  }

  PrivateIdentity = () => {
    return (
      <div>
        <label className="mt-3" htmlFor="placeOfBirth">Tempat Lahir</label>
        <Input
          name="placeOfBirth"
          className="input-font-size"
          type="text"
          id="placeOfBirth"
          onChange={this.validateOnChange}
          invalid={this.hasError(
            'addValidation',
            'placeOfBirth'
          )}
          placeholder="contoh: Tangerang"
          value={this.state.addValidation.placeOfBirth}
        />

        <label className="mt-3" htmlFor="gender">Jenis Kelamin</label>
        <div className="py-2">
          <label className="c-radio">
            <Input id="man" type="radio" name="gender" className="input-font-size"
              value="M" onChange={e => this.changeGender(e.target.value)}
            />
            <span className="fa fa-circle" />
            Laki-laki
          </label>
          <label className="c-radio">
            <Input id="woman" type="radio" name="gender" className="input-font-size"
              value="F" onChange={e => this.changeGender(e.target.value)}
            />
            <span className="fa fa-circle" />
            Perempuan
            </label>
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
        <select value={this.state.addValidation.religion}
          className="custom-select custom-select-sm input-font-size" name="religion"
          onChange={e => this.changeReligion(e.target.value)}>
          <option value="default">Pilih agama anda</option>
          {
            this.state.addValidation.religionOptions.map((option, i) => {
              return (
                <option value={option.name} key={"identityType " + i} >{option.description}</option>
              )
            })
          }
        </select>

        <label className="mt-3" htmlFor="mobileNo">Nomor Telpon</label>
        <Input
          name="mobileNo"
          className="input-font-size"
          type="text"
          id="mobileNo"
          onChange={this.validateOnChange}
          invalid={this.hasError(
            'addValidation',
            'mobileNo'
          )}
          placeholder="contoh: 123456789"
          value={this.state.addValidation.mobileNo}
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
    e.preventDefault();
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
  };

  handleDate = e => {
    let dd = String(e.toDate().getDate()).padStart(2, '0')
    let mm = MONTHS_ID[e.toDate().getMonth()]
    let yyyy = e.toDate().getFullYear()

    let date = dd + " " + mm + " " + yyyy

    this.setState({
      addValidation: {
        ...this.state.addValidation,
        birthdate: date
      }
    })
  }

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

  changeLegalFormId = val => {
    this.setState(prevState =>
      ({
        addValidation: {
          ...prevState.addValidation,
          legalFormId: val
        }
      })
    )
  }

  changeTypeOfIdentityId = val => {
    this.setState(prevState =>
      ({
        addValidation: {
          ...prevState.addValidation,
          typeOfIdentityId: val
        }
      })
    )
  }

  changeReligion = val => {
    this.setState(prevState =>
      ({
        addValidation: {
          ...prevState.addValidation,
          religion: val
        }
      })
    )
  }

  changeGender = val => {
    this.setState(prevState =>
      ({
        addValidation: {
          ...prevState.addValidation,
          gender: val
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

  changeCity = val => {
    console.log(val)
    this.setState(prevState =>
      ({
        addValidation: {
          ...prevState.addValidation,
          identityCityId: val
        }
      })
    )
  }

  getBase64 = file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
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

    console.log(addValidation.idCardPhoto)

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
      this.props.actions.clientAddImage(clientImage, res)

      this.props.actions.clientAddDocument(clientIdCard, res)

      this.props.actions.clientAddDocument(clientNpwp, res)

      clientOtherDocs.map(doc => {
        this.props.actions.clientAddDocument(doc, res)
      })
    }

    this.props.actions.clientAdd({
      legalFormId: 1,
      officeId: 1,
      flagTaxCodeValue: "Y",
      fullname: addValidation.fullname,
      typeOfIdentityId: addValidation.typeOfIdentityId,
      motherName: addValidation.motherName,
      addressBasedOnIdentity: addValidation.addressBasedOnIdentity,
      taxNumber: addValidation.NPWP,
      identityNumber: addValidation.identityNumber,
      sectorId: 1000,
      identityCountryCodeValue: "IDN",
      identityProvinceId: addValidation.identityProvinceId,
      identityCityId: addValidation.identityCityId,
      identitySubDistrict: "novarenu",
      identityVillage: "novarenu",
      identityPostalCode: addValidation.identityPostalCode,
      placeOfBirth: addValidation.placeOfBirth,
      genderCodeValue: addValidation.gender,
      mobileNo: addValidation.mobileNo,
      phoneNumber: "0310000000022",
      religion: addValidation.religion,
      taxName: "novarenu",
      taxAddress: "novarenu",
      submittedOnDate: state.today,
      dateOfBirth: addValidation.birthdate,

      clientNonPersonDetails: {
        locale: "id",
        dateFormat: "dd MMMM yyyy"
      },
      locale: "id",
      active: false,
      dateFormat: "dd MMMM yyyy",
      activationDate: state.today,
      savingsProductId: null
    },
      setClientAddRes
    )
  }

  render() {
    return (
      <ContentWrapper>
        <div className="content-heading">
          <div>Anggota Baru</div>
        </div>

        <Card className="card-default">
          <CardHeader>
            <div>{this.state.today} | Kantor Pelayanan</div>
            <div>
              <Link to="/simpool/member/data">
                <Button className="btn col-4 col-lg-2 mt-4 justify-content-center" color="primary" outline>Kembali</Button>
              </Link>
            </div>
          </CardHeader>
          <Formik>
            <Form innerRef={this.formRef} name="addValidation" className="form-font-size" onSubmit={this.handleSubmit}
              autoComplete="on"
            >
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
                      <label className="mt-3" htmlFor="legalFormId">Jenis Anggota</label>
                      <div className="py-2">
                        <label className="c-radio">
                          <Input id="individu" type="radio" name="legalFormId" className="input-font-size" value="1" tabIndex="7"
                            defaultChecked required onChange={e => this.changeLegalFormId(e.target.value)}
                          />
                          <span className="fa fa-circle"></span>Individu</label>
                        <span className="span-disabled">
                          <label className="c-radio">
                            <Input id="badanUsaha" type="radio" name="legalFormId" className="input-font-size" value="2" disabled
                              onChange={e => this.changeLegalFormId(e.target.value)}
                            />
                            <span className="fa fa-circle"></span>Badan Usaha</label>
                        </span>
                      </div>
                      <span className="invalid-feedback">Kolom harus diisi!</span>

                      {
                        this.state.addValidation.legalFormId === "1"
                          ? (
                            <div>
                              <label htmlFor="membership">Keanggotaan</label>
                              <div className="py-2">
                                <label className="c-radio">
                                  <Input id="anggota" type="radio" name="membership" value="anggota" />
                                  <span className="fa fa-circle"></span>Anggota</label>
                                <label className="c-radio">
                                  <Input id="anggotaLuarBiasa" type="radio" name="membership" value="anggotaLuarBiasa" />
                                  <span className="fa fa-circle"></span>Anggota Luar Biasa</label>
                                <label className="c-radio">
                                  <Input id="calonAnggota" type="radio" name="membership" value="calonAnggota" />
                                  <span className="fa fa-circle"></span>Calon Anggota</label>
                              </div>
                              <span className="invalid-feedback">Kolom harus diisi!</span>

                              <label className="mt-3" htmlFor="fullname">Nama Lengkap</label>
                              <Input
                                name="fullname"
                                className="input-font-size"
                                type="text"
                                id="fullname"
                                onChange={this.validateOnChange}
                                invalid={this.hasError(
                                  'addValidation',
                                  'fullname',
                                  'required'
                                )}
                                tabIndex="1"
                                placeholder="contoh: Ikkat Inovasi Teknologi"
                                value={this.state.addValidation.fullname}
                                required
                                data-validate='["required"]'
                              />
                              <span className="invalid-feedback">Tolong isi nama lengkap anda!</span>

                              <label className="mt-3" htmlFor="birthdate">Tanggal Lahir</label>
                              <Datetime
                                inputProps={{
                                  name: "birthdate",
                                  className: "form-control input-font-size",
                                  id: "birthdate",
                                  placeholder: "dd mmmm yyyy",
                                  tabIndex: "2",
                                  required: true,
                                  autoComplete: "off"
                                }}
                                value={this.state.addValidation.birthdate}
                                dateFormat="DD MMMM YYYY"
                                timeFormat={false}
                                closeOnSelect={true}
                                onChange={this.handleDate}
                                locale={this.props.dashboard.language}
                                data-validate='["required"]'
                              />
                              <span className="invalid-feedback">Tolong pilih tanggal lahir!</span>

                              <label className="mt-3" htmlFor="addressaddressBasedOnIdentity">Alamat Sesuai Identitas</label>
                              <Input
                                name="addressBasedOnIdentity"
                                className="input-font-size"
                                type="text"
                                id="addressBasedOnIdentity"
                                onChange={this.validateOnChange}
                                invalid={this.hasError(
                                  'addValidation',
                                  'addressBasedOnIdentity',
                                  'required'
                                )}
                                tabIndex="3"
                                placeholder="contoh: One PM, Gading Serpong, Tangerang"
                                value={this.state.addValidation.addressBasedOnIdentity}
                                required
                                data-validate='["required"]'
                              />
                              <span className="invalid-feedback">Tolong isi alamat!</span>

                              <label className="mt-3" htmlFor="motherName">Nama Gadis Ibu Kandung</label>
                              <Input
                                name="motherName"
                                className="input-font-size"
                                type="text"
                                id="motherName"
                                onChange={this.validateOnChange}
                                invalid={this.hasError(
                                  'addValidation',
                                  'motherName',
                                  'required'
                                )}
                                tabIndex="5"
                                placeholder="contoh: Ibu Pertiwi"
                                value={this.state.addValidation.motherName}
                                required
                                data-validate='["required"]'
                              />
                              <span className="invalid-feedback">Tolong isi Nama Gadis Ibu Kandung anda!</span>

                              <label className="mt-3" htmlFor="typeOfIdentityId">Tipe Identitas</label>
                              <select value={this.state.addValidation.typeOfIdentityId}
                                className="custom-select custom-select-sm input-font-size" name="typeOfIdentityId"
                                onChange={e => this.changeTypeOfIdentityId(e.target.value)}>
                                <option value="default">Pilih Kartu Identitas!</option>
                                {
                                  this.state.addValidation.identityTypeOptions.map((option, i) => {
                                    return (
                                      <option value={option.name} key={"identityType " + i} >{option.description}</option>
                                    )
                                  })
                                }
                              </select>

                              {
                                this.state.addValidation.typeOfIdentityId !== "default"
                                  ? (
                                    <div>
                                      <label className="mt-3" htmlFor="identityNumber">
                                        No. {
                                          this.state.addValidation.identityTypeOptions.map((identity, i) => {
                                            if (identity.name === this.state.addValidation.typeOfIdentityId) {
                                              return (<span key={"No. Identity " + i}>{identity.description}</span>)
                                            }
                                          })
                                        }
                                      </label>
                                      <Input
                                        name="identityNumber"
                                        className="input-font-size"
                                        type="number"
                                        id="identityNumber"
                                        onChange={this.validateOnChange}
                                        invalid={this.hasError(
                                          'addValidation',
                                          'identityNumber',
                                          'required'
                                        )}
                                        tabIndex="4"
                                        placeholder="101001002"
                                        value={this.state.addValidation.identityNumber}
                                        required
                                        data-validate='["required"]'
                                      />
                                      <span className="invalid-feedback">Tolong isi {
                                        this.state.addValidation.identityTypeOptions.map((identity, i) => {
                                          if (identity.name === this.state.addValidation.typeOfIdentityId) {
                                            return (<span key={"No. Identity " + i}>{identity.description}</span>)
                                          }
                                        })
                                      }!</span>
                                    </div>
                                  )
                                  : null
                              }
                            </div>
                          )
                          : null
                      }

                      <Button
                        className="btn btn-block mt-4 justify-content-center"
                        type="submit"
                        color="primary"
                        onClick={this.checkDuplicate}
                        onSubmit={this.handleSubmit}
                        tabIndex="6"
                        outlined="true"
                      >
                        Cek Duplikasi
                      </Button>

                      {
                        this.state.notDuplicate
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
                    </fieldset>
                  </div>
                </TabPane>

                <TabPane id="tabPane2" tabId="2">
                  <div className="pt-3 mb-3">
                    <fieldset>
                      <p className="lead text-center">Identitas</p>

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
                        placeholder="contoh: One PM, Gading Serpong, Tangerang"
                        value={this.state.addValidation.addressBasedOnIdentity}
                        readOnly
                      />

                      <label className="mt-3" htmlFor="province">Provinsi</label>
                      <select value={this.state.addValidation.identityProvinceId} className="custom-select custom-select-sm input-font-size" name="province"
                        onChange={e => this.changeProvince(e.target.value)}>
                        <option value="default">Pilih provinsi anda!</option>
                        {
                          this.state.addValidation.provinceOptions.map((option, i) => {
                            return (
                              <option value={option.code} key={"identityType " + i} >{option.description}</option>
                            )
                          })
                        }
                      </select>

                      <label className="mt-3" htmlFor="city">Kabupaten / Kota</label>
                      <select value={this.state.addValidation.identityCityId} className="custom-select custom-select-sm input-font-size" name="city"
                        onChange={e => this.changeCity(e.target.value)}>
                        <option value="default">Pilih kota anda!</option>
                        {
                          this.state.addValidation.cityOptionsFilter.map((option, i) => {
                            return (
                              <option value={option.code} key={"identityType " + i} >{option.description}</option>
                            )
                          })
                        }
                      </select>

                      <label className="mt-3" htmlFor="identityPostalCode">Kode Pos</label>
                      <Input
                        name="identityPostalCode"
                        className="input-font-size"
                        type="number"
                        id="identityPostalCode"
                        onChange={this.validateOnChange}
                        invalid={this.hasError(
                          'addValidation',
                          'identityPostalCode'
                        )}
                        placeholder="101001002"
                        value={this.state.addValidation.identityPostalCode}
                      />


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

                      <label className="mt-3" htmlFor="provinceDomicile">Provinsi</label>
                      <select defaultValue="" className="custom-select custom-select-sm input-font-size" name="provinceDomicile">
                        <option>List Provinsi</option>
                        <option defaultValue="province1">Provinsi 1</option>
                        <option defaultValue="province2">Provinsi 2</option>
                        <option defaultValue="province3">Provinsi 3</option>
                      </select>

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
                  <div className="d-flex">
                    <Button className="ml-auto mr-3" color="secondary" onClick={this.toggleStep('2')}>
                      Sebelumnya
                    </Button>
                    <Button color="primary" type="submit" onClick={() => this.finishForm()}>
                      Finish
                    </Button>
                  </div>
                </TabPane>
              </TabContent>
            </Form >
          </Formik>
        </Card>
      </ContentWrapper>
    );
  }
}

MemberDataAdd.propTypes = {
  actions: PropTypes.object,
  auth: PropTypes.object,
  dasboard: PropTypes.object,
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