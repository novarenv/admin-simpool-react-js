import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  Input
} from 'reactstrap';
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

export default class LoanDataHistoryEdit extends Component {
  constructor(props) {
    super(props);

    let originalRows = this.createRows(1000);
    let rows = originalRows.slice(0);
    
    this.state = {
      isPaneOpen: false,
      rows,
      selectedMember: '',
      openDate: ''
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
    this.handleChange.bind(this)
    console.log(this.state.rows[rowIdx].ANGGOTA)
  };

  componentDidUpdate() {
    console.log(this.state.openDate)
  }

  componentDidMount() {
    const dd = String(new Date().getDate()).padStart(2, '0')
    const mm = MONTHS[new Date().getMonth()]
    const yyyy = new Date().getFullYear()

    const today = dd + ' ' + mm + ' ' + yyyy

    this.setState({
      openDate: today
    })


    Modal.setAppElement(this.el);
  }

  handleDate = e => {
    let dd = String(e.toDate().getDate()).padStart(2, '0')
    let mm = MONTHS[e.toDate().getMonth()]
    let yyyy = e.toDate().getFullYear()

    let today = dd + " " + mm + " " + yyyy

    this.setState({
      openDate: today
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
      <ContentWrapper ref={ref => this.el = ref}>
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
              <input className="form-control mr-3 input-font-size" type="text" placeholder="Search anggota.." value={this.state.selectedMember} tabIndex={2} onChange={this.handleChange}/>
            </div>
            <Button outline className="col-md-2 btn-search" color="primary" type="button" onClick={this.openPane} tabIndex={3}>
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
          <div>Edit Loan History</div>
        </div>

        <Card className="card-default">
          <CardBody>
            <Link to="/member/loan-data-history">
              <Button outline className="mt-3 col-4 col-md-2" color="primary" type="submit" tabIndex={7}>Kembali</Button>
            </Link>
            
            <form className="form-font-size mt-3" onSubmit={this.onSubmit}>
              <label htmlFor="savingType">Jenis Simpanan</label>
              <select defaultValue="" className="custom-select custom-select-sm input-font-size" name="savingType" tabIndex={1}>
                <option>Jenis Simpanan</option>
                <option defaultValue="pokok">Pokok</option>
                <option defaultValue="wajib">Wajib</option>
                <option defaultValue="sukarela">Sukarela</option>
              </select>

              <label className="mt-3" htmlFor="member">Anggota</label>
              <div className="row mr-1">
                <div className="col-md-8">
                  <input className="form-control mr-3 input-font-size" type="text" placeholder="Search anggota.."
                      value={this.state.selectedMember} onChange={this.handleChange} tabIndex={2}/>
                </div>
                <Button outline className="col-md-4 btn-search" color="primary" type="button" onClick={this.openPane} tabIndex={3}>
                  <i className="fas fa-search mr-2" />
                  Cari Anggota
                </Button>
              </div>

              <label className="mt-3" htmlFor="openDate">Tanggal Buka</label>
              <Datetime
                inputProps={{
                  name: "birthdate",
                  className: "form-control input-font-size",
                  id: "birthdate",
                  placeholder: "dd mmm yyyy",
                  tabIndex: "2",
                  required: true
                }}
                value={this.state.openDate}
                dateFormat="DD MMM YYYY"
                timeFormat={false}
                closeOnSelect={true}
                renderInput={this.renderInputGroup}
                onChange={this.handleDate}
              />

              <label className="mt-3" htmlFor="initDepositValue">// Nanti Ambil dari API</label><br />
              <label className="mt-3" htmlFor="initDepositValue">Nilai Setoran Awal</label>
              <Input
                type="number"
                id="initDepositValue"
                name="initDepositValue"
                className="input-font-size"
                placeholder="minimal 3.000.000"
                tabIndex={5}
              />

              <label className="mt-3" htmlFor="initDepositValue">// Nomor Rekening Ambil dari Anggota</label><br />
              <label className="mt-3" htmlFor="depositNumber">Nomor Rekening Simpanan</label>
              <Input
                type="text"
                id="depositNumber"
                name="depositNumber"
                className="input-font-size"
                tabIndex={6}
              />

              <Button className="mt-3 col-12" color="warning" type="submit" tabIndex={7}>Edit Loan History</Button>
            </form>
          </CardBody>
        </Card>
      </ContentWrapper>
    )
  }
}