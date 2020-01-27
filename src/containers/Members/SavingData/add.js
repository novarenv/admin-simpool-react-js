import React, { Component } from 'react';
import {
  Button,
  Card,
  CardBody,
  Input
} from 'reactstrap';
import Select from 'react-select';
import Modal from 'react-modal';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';

import ContentWrapper from '../../../components/Layout/ContentWrapper';

export default class SavingDataAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPaneOpen: false,
      selectedOptionMulti: []
    };
  }

  componentDidMount() {
    Modal.setAppElement(this.el);
  }

  onSubmit = e => {
    console.log('Form submitted..');
    e.preventDefault();
  }

  handleChangeSelectMulti = (selectedOptionMulti) => {
    this.setState({ selectedOptionMulti });
  }

  openPane = () => {
    this.setState({ isPaneOpen: !this.state.isPaneOpen })
    console.log(this.state.isPaneOpen)
  }

  render() {
    const { selectedOptionMulti } = this.state;

    const dd = String(new Date().getDate()).padStart(2, '0')
    const mm = String(new Date().getMonth() + 1).padStart(2, '0') //January is 0!
    const yyyy = new Date().getFullYear()

    const today = dd + '/' + mm + '/' + yyyy

    return (
      <ContentWrapper>
        <SlidingPane
          className='pos-absolute slide-pane'
          isOpen={this.state.isPaneOpen}
          title='Hey, it is optional pane title.  I can be React component too.'
          subtitle='Optional subtitle.'
          onRequestClose={() => {
            // triggered on "<" on left top click or on outside click
            this.setState({ isPaneOpen: false });
          }}>
          <div>And I am pane content. BTW, what rocks?</div>
          <br />
          <img src='img.png' />
        </SlidingPane>

        <div className="content-heading" ref={ref => this.el = ref}>
          <div>Simpanan Baru</div>
        </div>

        <Card className="card-default">
          <CardBody>
            <form className="form-font-size" onSubmit={this.onSubmit}>
              <label htmlFor="savingType">Jenis Simpanan</label>
              <select defaultValue="" className="custom-select custom-select-sm input-font-size" name="savingType" tabIndex={1}>
                <option>Jenis Simpanan</option>
                <option defaultValue="pokok">Pokok</option>
                <option defaultValue="wajib">Wajib</option>
                <option defaultValue="sukarela">Sukarela</option>
              </select>

              <label className="mt-3" htmlFor="member">Anggota</label>

              <div className="row mr-1">
                <div className="col-md-10">
                  <input className="form-control mr-3 input-font-size" type="text" placeholder="Search savings" tabIndex={2}/>
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
                tabIndex={4}
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

              <button className="btn btn-sm btn-primary mt-3" type="submit">Buat Baru</button>
            </form>
          </CardBody>
        </Card>
      </ContentWrapper>
    )
  }
}