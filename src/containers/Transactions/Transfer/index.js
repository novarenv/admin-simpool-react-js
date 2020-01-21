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
    const { selectedOptionMulti } = this.state;
    
    const dd = String(new Date().getDate()).padStart(2, '0')
    const mm = String(new Date().getMonth() + 1).padStart(2, '0') //January is 0!
    const yyyy = new Date().getFullYear()

    const today = dd + '/' + mm + '/' + yyyy

    return (
      <ContentWrapper>
        <div className="content-heading">
          <div>Transfer</div>
        </div>

        <Card className="card-default">
          <CardBody>
            <form className="form-font-size" onSubmit={this.onSubmit}>
              <label htmlFor="serviceOffice">Pilih Kantor Pelayanan</label>
              <select defaultValue="" className="custom-select custom-select-sm input-font-size" name="serviceOffice">
                <option>Pilih Kantor Pelayanan</option>
                <option defaultValue="serviceOffice1">Kantor 1</option>
                <option defaultValue="serviceOffice2">Kantor 2</option>
              </select>

              <label className="mt-3" htmlFor="member">Anggota</label>
              <Select
                name="member"
                className="input-font-size"
                multi
                simpleValue
                value={selectedOptionMulti}
                onChange={this.handleChangeSelectMulti}
                options={MEMBERS}
              />

              <label className="mt-3" htmlFor="serviceNum">No. Pelayanan</label>
              <select defaultValue="" className="custom-select custom-select-sm input-font-size" name="serviceNum">
                <option>Pilih Kantor Pelayanan</option>
                <option defaultValue="serviceNum1">No. 1</option>
                <option defaultValue="serviceNum2">No. 2</option>
              </select>

              <label className="mt-3" htmlFor="transferAmount">Nilai Transfer</label>
              <Input
                name="transferAmount"
                className="input-font-size"
                type="number"
                id="transferAmount"
                placeholder="minimal 3.000.000"
              />

              <label className="mt-3" htmlFor="transactionDate">Tanggal Transaksi</label>
              <Input
                name="transactionDate"
                className="input-font-size"
                type="text"
                id="transactionDate"
                placeholder="dd-mm-yyyy"
                value={today}
              />

              <label className="mt-3" htmlFor="description">Keterangan</label>
              <Input
                name="description"
                className="input-font-size"
                type="textarea"
                id="description"
                rows="5"
                placeholder="Deskripsi transfer"
              />

              <button className="btn btn-block btn-primary mt-4 justify-content-center" type="submit">Buat Baru</button>
            </form>
          </CardBody>
        </Card>
      </ContentWrapper>
    )
  }
}