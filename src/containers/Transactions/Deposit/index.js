import React, { Component } from 'react';
import {
  Card,
  CardBody,
  Col,
  Input
} from 'reactstrap';
import ContentWrapper from '../../../components/Layout/ContentWrapper';
import Select from 'react-select';

const MEMBERS = [
  { value: 'australian-capital-territory', label: 'Australian Capital Territory', className: 'State-ACT' },
  { value: 'new-south-wales', label: 'New South Wales', className: 'State-NSW' },
  { value: 'victoria', label: 'Victoria', className: 'State-Vic' },
  { value: 'queensland', label: 'Queensland', className: 'State-Qld' },
  { value: 'western-australia', label: 'Western Australia', className: 'State-WA' },
  { value: 'south-australia', label: 'South Australia', className: 'State-SA' },
  { value: 'tasmania', label: 'Tasmania', className: 'State-Tas' },
  { value: 'northern-territory', label: 'Northern Territory', className: 'State-NT' },
]

export default class Deposit extends Component {
  state = {
    selectedOption: ''
  };

  onSubmit = e => {
    console.log('Form submitted..');
    e.preventDefault();
  }

  handleChangeSelect = (selectedOption) => {
    this.setState({ selectedOption });
    console.log(`Selected: ${selectedOption.value}`);
  }

  render() {
    const { selectedOption } = this.state;
    const value = selectedOption && selectedOption.value;

    const dd = String(new Date().getDate()).padStart(2, '0')
    const mm = String(new Date().getMonth() + 1).padStart(2, '0') //January is 0!
    const yyyy = new Date().getFullYear()

    const today = dd + '/' + mm + '/' + yyyy

    return (
      <ContentWrapper>
        <div className="content-heading">
          <div>Deposit</div>
        </div>

        <Card className="card-default">
          <CardBody>
            <form className="form-font-size" onSubmit={this.onSubmit}>
              <fieldset>
                <div className="form-group row align-items-center">
                  <label className="col-md-3 col-lg-2 col-form-label" htmlFor="member">Anggota</label>
                  <Col md={9} lg={10}>
                    <Select
                      name="select-name"
                      className="input-font-size"
                      value={this.props.children}
                      onChange={this.handleChangeSelect}
                      options={MEMBERS}
                    />
                  </Col>
                </div>
              </fieldset>

              <fieldset>
                <div className="form-group row align-items-center">
                  <label className="col-md-3 col-lg-2 col-form-label" htmlFor="savingNum">No. Simpanan</label>
                  <Col md={9} lg={10}>
                    <select defaultValue="" className="custom-select custom-select-sm input-font-size" name="savingNum">
                      <option>No. Simpanan</option>
                      <option defaultValue="savingNum1">No. Simpanan 1</option>
                      <option defaultValue="savingNum2">No. Simpanan 2</option>
                    </select>
                  </Col>
                </div>
              </fieldset>

              <fieldset>
                <div className="form-group row align-items-center">
                  <label className="col-md-3 col-lg-2 col-form-label" htmlFor="transferAmount">Nilai Setoran</label>
                  <Col md={9} lg={10}>
                    <Input
                      type="number"
                      id="transferAmount"
                      name="transferAmount"
                      className="input-font-size"
                      placeholder="minimal 3.000.000"
                    />
                  </Col>
                </div>
              </fieldset>

              <fieldset>
                <div className="form-group row align-items-center">
                  <label className="col-md-3 col-lg-2 col-form-label" htmlFor="transactionDate">Tanggal Transaksi</label>
                  <Col md={9} lg={10}>
                    <Input
                      type="text"
                      id="transactionDate"
                      name="transactionDate"
                      className="input-font-size"
                      placeholder="dd-mm-yyyy"
                      onChange={this.onSubmit}
                      value={today}
                    />
                  </Col>
                </div>
              </fieldset>

              <fieldset>
                <div className="form-group row align-items-center">
                  <label className="col-md-3 col-lg-2 col-form-label" htmlFor="description">Keterangan</label>
                  <Col md={9} lg={10}>
                    <Input
                      type="textarea"
                      id="description"
                      name="description"
                      className="input-font-size"
                      rows="5"
                      placeholder="Deskripsi deposit"
                    />
                  </Col>
                </div>
              </fieldset>

              <button className="btn btn-block btn-primary mt-4 d-flex justify-content-center d-md-table mx-auto" type="submit">Buat Baru</button>
            </form>
          </CardBody>
        </Card>
      </ContentWrapper>
    )
  }
}