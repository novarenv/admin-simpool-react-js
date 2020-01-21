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

export default class LoanPayment extends Component {
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
    const { selectedOption } = this.state;
    const value = selectedOption && selectedOption.value;
    const { selectedOptionMulti } = this.state;

    const dd = String(new Date().getDate()).padStart(2, '0')
    const mm = String(new Date().getMonth() + 1).padStart(2, '0') //January is 0!
    const yyyy = new Date().getFullYear()

    const today = dd + '/' + mm + '/' + yyyy

    return (
      <ContentWrapper>
        <div className="content-heading">
          <div>Bayar Angsuran</div>
        </div>

        <Card className="card-default">
          <CardBody>
            <form className="form-font-size" onSubmit={this.onSubmit}>
              <label htmlFor="fundSource">Sumber Dana</label>
              <select defaultValue="" className="custom-select custom-select-sm input-font-size" name="fundSource">
                <option>Pilih Sumber Dana</option>
                <option defaultValue="cash">Cash</option>
                <option defaultValue="account">Account</option>
              </select>

              {/* Jika pilih sumber dana START */}
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

              <label className="mt-3" htmlFor="accountNum">No. Simpanan</label>
              <select defaultValue="" className="custom-select custom-select-sm input-font-size" name="accountNum">
                <option>Pilih Nomor Simpanan</option>
                <option defaultValue="accountNum1">No. Simpanan 1</option>
                <option defaultValue="accountNum2">No. Simpanan 2</option>
              </select>
              {/* Jika pilih sumber dana END */}

              <label className="mt-3" htmlFor="paymentAmount">Nilai Bayar</label>
              <Input
                name="paymentAmount"
                className="input-font-size"
                type="number"
                id="paymentAmount"
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
                placeholder="Deskripsi angsuran"
              />

              <button className="btn btn-block btn-primary mt-4 justify-content-center" type="submit">Buat Baru</button>
            </form>
          </CardBody>
        </Card>
      </ContentWrapper>
    )
  }
}