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

export default class SavingDataAdd extends Component {
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

    return (
      <ContentWrapper>
        <div className="content-heading">
          <div>Simpanan Baru</div>
        </div>

        <Card className="card-default">
          <CardBody>
            <form onSubmit={this.onSubmit}>
              <label className="mt-3" htmlFor="savingType">Jenis Simpanan</label>
              <select defaultValue="" className="custom-select custom-select-sm" name="savingType">
                <option>Jenis Simpanan</option>
                <option defaultValue="pokok">Pokok</option>
                <option defaultValue="wajib">Wajib</option>
                <option defaultValue="sukarela">Sukarela</option>
              </select>

              <label className="mt-3" htmlFor="member">Anggota</label>
              <Select
                name="member"
                multi
                simpleValue
                value={selectedOptionMulti}
                onChange={this.handleChangeSelectMulti}
                options={MEMBERS}
              />

              <label htmlFor="openDate">Tanggal Buka</label>
              <Input
                type="text"
                id="openDate"
                name="openDate"
                placeholder="dd-mm-yyyy"
              />

              <label className="mt-3" htmlFor="initDepositValue">Nilai Setoran Awal</label>
              <Input
                type="number"
                id="initDepositValue"
                name="initDepositValue"
                placeholder="minimal 3.000.000"
              />

              <label className="mt-3" htmlFor="depositNumber">Nomor Rekening Simpanan</label>
              <Input
                type="text"
                id="depositNumber"
                name="depositNumber"
              />

              <button className="btn btn-sm btn-primary mt-3" type="submit">Buat Baru</button>
            </form>
          </CardBody>
        </Card>
      </ContentWrapper>
    )
  }
}