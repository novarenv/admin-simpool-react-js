import React, { Component } from 'react';
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

export default class LoanDataAdd extends Component {
  constructor(props) {
    super(props);

    let originalRows = this.createRows(1000);
    let rows = originalRows.slice(0);
    
    this.state = {
      isPaneOpen: false,
      rows,
      selectedMember: ''
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
    Modal.setAppElement(this.el);
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
    const dd = String(new Date().getDate()).padStart(2, '0')
    const mm = String(new Date().getMonth() + 1).padStart(2, '0') //January is 0!
    const yyyy = new Date().getFullYear()

    const today = dd + '/' + mm + '/' + yyyy

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
              <input className="form-control mr-3 input-font-size" type="text" placeholder="Search anggota.." tabIndex={2}/>
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
              <div className="row mr-1">
                <div className="col-md-10">
                  <input className="form-control mr-3 input-font-size" type="text" placeholder="Search anggota.." value={this.state.selectedMember} tabIndex={2}/>
                </div>
                <Button outline className="col-md-2 btn-search" color="primary" type="button" onClick={this.openPane} tabIndex={3}>
                  <i className="fas fa-search mr-2" />
                  Cari Anggota
                </Button>
              </div>

              <label className="mt-3" htmlFor="openDate">Tanggal Buka</label>
              <Input
                type="text"
                id="openDate"
                name="openDate"
                className="input-font-size"
                placeholder="dd-mm-yyyy"
                defaultValue={today}
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
                placeholder="contoh: 3.000.000"
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