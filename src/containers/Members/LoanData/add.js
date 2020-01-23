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

export default class LoanDataAdd extends Component {
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

    return (
      <ContentWrapper>
        <div className="content-heading">
          <div>Pinjaman Baru</div>
        </div>

        <Card className="card-default">
          <CardBody>
            <form className="form-font-size" onSubmit={this.onSubmit}>
              <label htmlFor="loanType">Jenis Pinjaman</label>
              <select defaultValue="" className="custom-select custom-select-sm input-font-size" name="loanType">
                <option>Jenis Pinjaman</option>
                <option defaultValue="pokok">Pokok</option>
                <option defaultValue="wajib">Wajib</option>
                <option defaultValue="sukarela">Sukarela</option>
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

              <label className="mt-3" htmlFor="openDate">Tanggal Buka</label>
              <Input
                type="text"
                id="openDate"
                name="openDate"
                className="input-font-size"
                placeholder="dd-mm-yyyy"
              />

              <label className="mt-3" htmlFor="initLoanValue">Nilai Pokok Pinjaman</label>
              <Input
                type="number"
                id="initLoanValue"
                name="initLoanValue"
                className="input-font-size"
                placeholder="minimal 3.000.000"
              />

              <label className="mt-3" htmlFor="interest">Bunga</label>
              <Input
                type="number"
                id="interest"
                name="interest"
                className="input-font-size"
                placeholder="7.5"
              />

              <label className="mt-3" htmlFor="timePeriod">Jangka Waktu</label>
              <Input
                type="number"
                id="timePeriod"
                name="timePeriod"
                className="input-font-size"
                placeholder="7.5"
              />

              <label className="mt-3" htmlFor="firstInstallment">Cicilan Awal</label>
              <Input
                type="text"
                id="firstInstallment"
                name="firstInstallment"
                className="input-font-size"
                placeholder="dd-mm-yyyy"
              />

              <label className="mt-3" htmlFor="disbursement">Pencairan</label>
              <select defaultValue="" className="custom-select custom-select-sm input-font-size" name="disbursement" required>
                <option>Jenis Pencairan</option>
                <option defaultValue="depositAccount">Rekening Simpanan</option>
                <option defaultValue="cashAccount">Rekening Cash</option>
              </select>

              {/* Buat jika memilih simpanan */}
              <label className="mt-3" htmlFor="charge">Biaya</label>
              <select defaultValue="" className="custom-select custom-select-sm input-font-size" name="charge" required>
                <option>Jenis Biaya</option>
                <option defaultValue="charge1">Biaya 1</option>  
                <option defaultValue="charge2">Biaya 2</option>
              </select>

              <button className="btn btn-block btn-primary mt-4 justify-content-center" type="submit">Buat Baru</button>
            </form>
          </CardBody>
        </Card>
      </ContentWrapper>
    )
  }
}