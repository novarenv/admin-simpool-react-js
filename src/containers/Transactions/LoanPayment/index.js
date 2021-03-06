import React, { Component } from 'react';
import {
  Button,
  Card,
  CardBody,
  Input
} from 'reactstrap';
import NumberFormat from 'react-number-format';
import Modal from 'react-modal';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import ReactDataGrid from 'react-data-grid';

import ContentWrapper from '../../../components/Layout/ContentWrapper';

// DateTimePicker
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';

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

export default class LoanPayment extends Component {
  constructor(props) {
    super(props);

    let originalRows = this.createRows(1000);
    let rows = originalRows.slice(0);
    
    this.state = {
      isPaneOpen: false,
      rows,
      selectedMember: '',
      transactionDate: ''
    };
    
    this._columns = [
      {
        key: 'ANGGOTA',
        name: 'Anggota',
        width: 1000
      }
    ];
  }

  createRows = () => {
    let rows = [];
    for (let i = 1; i < 100; i++) {
      rows.push({
        ANGGOTA: i
      });
    }

    return rows;
  };

  rowGetter = (i) => this.state.rows[i]

  onCellSelected = ({ rowIdx, idx }) => {
    this.setState({
      isPaneOpen: false,
      rowIdx: rowIdx,
      selectedMember: this.state.rows[rowIdx].ANGGOTA
    })
    console.log(this.state.rows[rowIdx].ANGGOTA)
  };

  componentDidMount() {
    const dd = String(new Date().getDate()).padStart(2, '0')
    const mm = MONTHS[new Date().getMonth()]
    const yyyy = new Date().getFullYear()

    const today = dd + ' ' + mm + ' ' + yyyy

    this.setState({
      transactionDate: today
    })

    Modal.setAppElement(this.el);
  }

  handleDate = e => {
    let dd = String(e.toDate().getDate()).padStart(2, '0')
    let mm = MONTHS[e.toDate().getMonth()]
    let yyyy = e.toDate().getFullYear()

    let today = dd + " " + mm + " " + yyyy

    this.setState({
      transactionDate: today
    })
  }

  handleChange = e => {
    this.setState({selectedMember: e.target.value});
    console.log(this.state.selectedMember)
  }

  onSubmit = e => {
    console.log('Form submitted..');
    e.preventDefault();
  }
  
  openPane = () => {
    this.setState({ isPaneOpen: !this.state.isPaneOpen })
    console.log(this.state.isPaneOpen)
  }

  render() {
    return (
      <ContentWrapper>
        <SlidingPane
          className='pos-absolute slide-pane'
          closeIcon={<i className="fas fa-angle-right" />}
          isOpen={this.state.isPaneOpen}
          title='Hasil Pencarian Anggota'
          subtitle='Pilih salah satu'
          onRequestClose={() => {
            this.setState({ isPaneOpen: false });
          }}
        >
          <div className="row mr-1">
            <div className="col-md-10">
              <input className="form-control mr-3 input-font-size" type="text" placeholder="Search anggota.." value={this.state.selectedMember} tabIndex={1} onChange={this.handleChange} />
            </div>
            <Button outline className="col-md-2 btn-search" color="primary" type="button" onClick={this.openPane} tabIndex={2}>
              <i className="fas fa-search mr-2" />
              Cari Anggota
            </Button>

            <Card>
              <CardBody>
                <ReactDataGrid
                  onGridSort={this.handleGridSort}
                  columns={this._columns}
                  rowGetter={this.rowGetter}
                  rowsCount={this.state.rows.length}
                  minHeight={700}
                  minWidth={1000}
                  onCellSelected={this.onCellSelected}
                />
              </CardBody>
            </Card>
          </div>
        </SlidingPane>

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

              {/* Jika pilih sumber dana account START */}
              <label className="mt-3" htmlFor="member">Anggota</label>
              <div className="row mr-1">
                <div className="col-md-8">
                  <input className="form-control mr-3 input-font-size" type="text" placeholder="Search anggota.."
                      value={this.state.selectedMember} onChange={this.handleChange} tabIndex={1}/>
                </div>
                <Button outline className="col-md-4 btn-search" color="primary" type="button" onClick={this.openPane} tabIndex={2}>
                  <i className="fas fa-search mr-2" />
                  Cari Anggota
                </Button>
              </div>

              <label className="mt-3" htmlFor="accountNum">No. Simpanan</label>
              <select defaultValue="" className="custom-select custom-select-sm input-font-size" name="accountNum">
                <option>Pilih Nomor Simpanan</option>
                <option defaultValue="accountNum1">No. Simpanan 1</option>
                <option defaultValue="accountNum2">No. Simpanan 2</option>
              </select>
              {/* Jika pilih sumber dana account END */}

              <label className="mt-3" htmlFor="paymentAmount">Nilai Bayar</label>
              <NumberFormat
                id="paymentAmmount"
                name="paymentAmmount"
                className="input-font-size input-number"
                thousandSeparator={'.'}
                decimalSeparator={','}
                prefix={'Rp'}
                placeholder="contoh: Rp3.000.000"
              />

              <label className="mt-3" htmlFor="transactionDate">Tanggal Transaksi</label>
              <Datetime
                inputProps={{
                  name: "birthdate",
                  className: "form-control input-font-size",
                  id: "birthdate",
                  placeholder: "dd mmm yyyy",
                  tabIndex: "2",
                  required: true
                }}
                value={this.state.transactionDate}
                dateFormat="DD MMM YYYY"
                timeFormat={false}
                closeOnSelect={true}
                renderInput={this.renderInputGroup}
                onChange={this.handleDate}
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