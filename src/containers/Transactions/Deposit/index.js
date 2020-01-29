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

export default class Deposit extends Component {
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
    const dd = String(new Date().getDate()).padStart(2, '0')
    const mm = String(new Date().getMonth() + 1).padStart(2, '0') //January is 0!
    const yyyy = new Date().getFullYear()

    const today = dd + '/' + mm + '/' + yyyy

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
          <div>Deposit</div>
        </div>

        <Card className="card-default">
          <CardBody>
            <form className="form-font-size" onSubmit={this.onSubmit}>
              <label htmlFor="member">Anggota</label>
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

              <label className="mt-3" htmlFor="savingNum">No. Simpanan</label>
              <select defaultValue="" className="custom-select custom-select-sm input-font-size" name="savingNum">
                <option>No. Simpanan</option>
                <option defaultValue="savingNum1">No. Simpanan 1</option>
                <option defaultValue="savingNum2">No. Simpanan 2</option>
              </select>

              <label className="mt-3" htmlFor="transferAmount">Nilai Setoran</label>
              <NumberFormat
                id="transferAmount"
                name="transferAmount"
                className="input-font-size input-number"
                thousandSeparator={'.'}
                decimalSeparator={','}
                prefix={'Rp'}
                placeholder="contoh: Rp3.000.000"
              />

              <label className="mt-3" htmlFor="transactionDate">Tanggal Transaksi</label>
              <Input
                type="text"
                id="transactionDate"
                name="transactionDate"
                className="input-font-size"
                placeholder="dd-mm-yyyy"
                onChange={this.onSubmit}
                value={today}
              />

              <label className="mt-3" htmlFor="description">Keterangan</label>
              <Input
                type="textarea"
                id="description"
                name="description"
                className="input-font-size t-area-h"
                rows="5"
                placeholder="Deskripsi deposit"
              />

              <button className="btn btn-block btn-primary mt-4 justify-content-center" type="submit">Buat Baru</button>
            </form>
          </CardBody>
        </Card>
      </ContentWrapper>
    )
  }
}