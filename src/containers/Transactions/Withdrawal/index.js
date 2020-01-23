import React, { Component } from 'react';
import {
  Card,
  CardBody,
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
    selectedOption: '',
    selectedOptionMulti: []
  };

  onSubmit = e => {
    console.log('Form submitted..');
    e.preventDefault();
  }

  handleChangeSelectMulti = (selectedOptionMulti) => {
    this.setState({ selectedOptionMulti });
  }

  render() {
    const { selectedOption } = this.state;

    const dd = String(new Date().getDate()).padStart(2, '0')
    const mm = String(new Date().getMonth() + 1).padStart(2, '0') //January is 0!
    const yyyy = new Date().getFullYear()

    const today = dd + '/' + mm + '/' + yyyy

    return (
      <ContentWrapper>
        <div className="content-heading">
          <div>Penarikan</div>
        </div>

        <Card className="card-default">
          <CardBody>
            <form className="form-font-size" onSubmit={this.onSubmit}>
              <label htmlFor="member">Anggota</label>
              <Select
                name="select-name"
                className="input-font-size"
                value={this.props.children}
                onChange={this.handleChangeSelect}
                options={MEMBERS}
              />

              <label className="mt-3" htmlFor="savingNum">No. Simpanan</label>
              <select defaultValue="" className="custom-select custom-select-sm input-font-size" name="savingNum">
                <option>No. Simpanan</option>
                <option defaultValue="savingNum1">No. Simpanan 1</option>
                <option defaultValue="savingNum2">No. Simpanan 2</option>
              </select>

              <label className="mt-3" htmlFor="withdrawalAmount">Nilai Penarikan</label>
              <Input
                type="number"
                id="withdrawalAmount"
                name="withdrawalAmount"
                className="input-font-size"
                placeholder="minimal 3.000.000"
              />

              <label className="mt-3" htmlFor="transactionDate">Tanggal Transaksi</label>
              <Input
                type="text"
                id="transactionDate"
                name="transactionDate"
                className="input-font-size"
                placeholder="dd-mm-yyyy"
                value={today}
              />

              <label className="mt-3" htmlFor="description">Keterangan</label>
              <Input
                type="textarea"
                id="description"
                name="description"
                className="input-font-size"
                rows="5"
                placeholder="Deskripsi penarikan"
              />

              <button className="btn btn-block btn-primary mt-4 justify-content-center" type="submit">Buat Baru</button>
            </form>
          </CardBody>
        </Card>
      </ContentWrapper>
    )
  }
}