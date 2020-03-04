import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import ContentWrapper from '../../components/Layout/ContentWrapper';
import { Row, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import * as actions from '../../store/actions/actions';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';

import { Bar, Pie } from 'react-chartjs-2'

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dropdownTranslateOpen: false,
      activeTab: 'tasks',

    }
  }
  toggleDDTranslate = () => {
    this.setState({
      dropdownTranslateOpen: !this.state.dropdownTranslateOpen
    });
  }

  toggleTab = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  changeLanguage = lng => {
    this.props.actions.changeLanguage("language", lng)
    if (lng === 'en') {
      this.props.actions.changeDropdownLanguage("dropdownLanguage", "English")
    } else if (lng === 'id') {
      this.props.actions.changeDropdownLanguage("dropdownLanguage", "B. Indonesia")
    }
    this.props.i18n.changeLanguage(lng)
  }

  gender = {
    labels: ['Female', 'Male'],
    datasets: [{
      label: 'gender',
      data: [12, 19],
      backgroundColor: [
        'rgba(255, 99, 132, 0.4)',
        'rgba(54, 162, 235, 0.4)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)'
      ],
      borderWidth: 1,
      hoverBackgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)'
      ],
    }]
  };

  province = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [{
      label: "Province",
      barPercentage: 0.5,
      barThickness: 20,
      maxBarThickness: 20,
      minBarLength: 2,
      data: [100, 20, 30, 40, 50, 60, 70],
      backgroundColor: [
        'rgba(255, 99, 132, 0.4)',
        'rgba(54, 162, 235, 0.4)',
        'rgba(255, 206, 86, 0.4)',
        'rgba(75, 192, 192, 0.4)',
        'rgba(153, 102, 255, 0.4)',
        'rgba(255, 159, 64, 0.4)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 1,
      hoverBackgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)'
      ]
    }]
  };

  render() {
    return (
      <ContentWrapper>
        <div className="content-heading">
          <div>Dashboard</div>
          <div className="ml-auto">
            <Dropdown isOpen={this.state.dropdownTranslateOpen} toggle={this.toggleDDTranslate}>
              <DropdownToggle>
                {this.props.dashboard.dropdownLanguage}
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-right-forced animated fadeInUpShort">
                <DropdownItem onClick={() => this.changeLanguage('en')}>English</DropdownItem>
                <DropdownItem onClick={() => this.changeLanguage('id')}>B. Indonesia</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-md-4 mt-3">
            <Pie data={this.gender} />
          </div>
          <div className="col-md-8 mt-3">
            <Bar data={this.province} />
          </div>
        </div>

        <p className="lead text-center mt-3">Pinjaman Kredit</p>
        <Row>
          <div className="col-xl-4 col-md-6">
            <div className="card flex-row align-items-center align-items-stretch border-0">
              <div className="col-4 d-flex align-items-center bg-primary-dark justify-content-center rounded-left">
                <em className="icon-bubbles fa-3x"></em>
              </div>
              <div className="col-8 py-3 bg-primary rounded-right">
                <div className="h2 mt-0">1</div>
                <div className="text-uppercase">Transaksi bulan ini</div>
              </div>
            </div>
          </div>

          <div className="col-xl-4 col-md-6">
            <div className="card flex-row align-items-center align-items-stretch border-0">
              <div className="col-4 d-flex align-items-center bg-purple-dark justify-content-center rounded-left">
                <em className="icon-bubbles fa-3x"></em>
              </div>
              <div className="col-8 py-3 bg-purple rounded-right">
                <div className="h2 mt-0">1.154.345.700</div>
                <div className="text-uppercase">Jumlah Transaksi tahun ini</div>
              </div>
            </div>
          </div>

          <div className="col-xl-4 col-md-6">
            <div className="card flex-row align-items-center align-items-stretch border-0">
              <div className="col-4 d-flex align-items-center bg-primary-dark justify-content-center rounded-left">
                <em className="icon-bubbles fa-3x"></em>
              </div>
              <div className="col-8 py-3 bg-primary rounded-right">
                <div className="h2 mt-0">1.234.232.144</div>
                <div className="text-uppercase">Transaksi bulan ini</div>
              </div>
            </div>
          </div>
        </Row>

        <p className="lead text-center">Simpanan Juli 2019</p>
        <Row>
          <div className="col-xl-4 col-md-6">
            <div className="card flex-row align-items-center align-items-stretch border-0">
              <div className="col-4 d-flex align-items-center bg-primary-dark justify-content-center rounded-left">
                <em className="icon-bubbles fa-3x"></em>
              </div>
              <div className="col-8 py-3 bg-primary rounded-right">
                <div className="h2 mt-0">21.000</div>
                <div className="text-uppercase">Simpanan Anggota</div>
              </div>
            </div>
          </div>

          <div className="col-xl-4 col-md-6">
            <div className="card flex-row align-items-center align-items-stretch border-0">
              <div className="col-4 d-flex align-items-center bg-purple-dark justify-content-center rounded-left">
                <em className="icon-bubbles fa-3x"></em>
              </div>
              <div className="col-8 py-3 bg-purple rounded-right">
                <div className="h2 mt-0">20.130.000</div>
                <div className="text-uppercase">Jumlah Transaksi tahun ini</div>
              </div>
            </div>
          </div>

          <div className="col-xl-4 col-md-6">
            <div className="card flex-row align-items-center align-items-stretch border-0">
              <div className="col-4 d-flex align-items-center bg-primary-dark justify-content-center rounded-left">
                <em className="icon-bubbles fa-3x"></em>
              </div>
              <div className="col-8 py-3 bg-primary rounded-right">
                <div className="h2 mt-0">19.890.000</div>
                <div className="text-uppercase">Sisa Transaksi bulan ini</div>
              </div>
            </div>
          </div>
        </Row>

        <p className="lead text-center">Kas Bulan Juli 2019</p>
        <Row>
          <div className="col-xl-4 col-md-6">
            <div className="card flex-row align-items-center align-items-stretch border-0">
              <div className="col-4 d-flex align-items-center bg-primary-dark justify-content-center rounded-left">
                <em className="icon-bubbles fa-3x"></em>
              </div>
              <div className="col-8 py-3 bg-primary rounded-right">
                <div className="h2 mt-0">2.500.201.355</div>
                <div className="text-uppercase">Debet</div>
              </div>
            </div>
          </div>

          <div className="col-xl-4 col-md-6">
            <div className="card flex-row align-items-center align-items-stretch border-0">
              <div className="col-4 d-flex align-items-center bg-purple-dark justify-content-center rounded-left">
                <em className="icon-bubbles fa-3x"></em>
              </div>
              <div className="col-8 py-3 bg-purple rounded-right">
                <div className="h2 mt-0">1.122.342.232</div>
                <div className="text-uppercase">Kredit</div>
              </div>
            </div>
          </div>

          <div className="col-xl-4 col-md-6">
            <div className="card flex-row align-items-center align-items-stretch border-0">
              <div className="col-4 d-flex align-items-center bg-primary-dark justify-content-center rounded-left">
                <em className="icon-bubbles fa-3x"></em>
              </div>
              <div className="col-8 py-3 bg-primary rounded-right">
                <div className="h2 mt-0">1.232.987.000</div>
                <div className="text-uppercase">Jumlah</div>
              </div>
            </div>
          </div>
        </Row>

        <p className="lead text-center">Data Anggota</p>
        <Row>
          <div className="col-xl-4 col-md-6">
            <div className="card flex-row align-items-center align-items-stretch border-0">
              <div className="col-4 d-flex align-items-center bg-primary-dark justify-content-center rounded-left">
                <em className="icon-bubbles fa-3x"></em>
              </div>
              <div className="col-8 py-3 bg-primary rounded-right">
                <div className="h2 mt-0">4</div>
                <div className="text-uppercase">Anggota Aktif</div>
              </div>
            </div>
          </div>

          <div className="col-xl-4 col-md-6">
            <div className="card flex-row align-items-center align-items-stretch border-0">
              <div className="col-4 d-flex align-items-center bg-purple-dark justify-content-center rounded-left">
                <em className="icon-bubbles fa-3x"></em>
              </div>
              <div className="col-8 py-3 bg-purple rounded-right">
                <div className="h2 mt-0">0</div>
                <div className="text-uppercase">Anggota Tidak Aktif</div>
              </div>
            </div>
          </div>

          <div className="col-xl-4 col-md-6">
            <div className="card flex-row align-items-center align-items-stretch border-0">
              <div className="col-4 d-flex align-items-center bg-primary-dark justify-content-center rounded-left">
                <em className="icon-bubbles fa-3x"></em>
              </div>
              <div className="col-8 py-3 bg-primary rounded-right">
                <div className="h2 mt-0">4</div>
                <div className="text-uppercase">Jumlah Anggota</div>
              </div>
            </div>
          </div>
        </Row>

        <p className="lead text-center">Data Peminjam</p>
        <Row>
          <div className="col-xl-4 col-md-6">
            <div className="card flex-row align-items-center align-items-stretch border-0">
              <div className="col-4 d-flex align-items-center bg-primary-dark justify-content-center rounded-left">
                <em className="icon-bubbles fa-3x"></em>
              </div>
              <div className="col-8 py-3 bg-primary rounded-right">
                <div className="h2 mt-0">10</div>
                <div className="text-uppercase">Peminjam</div>
              </div>
            </div>
          </div>

          <div className="col-xl-4 col-md-6">
            <div className="card flex-row align-items-center align-items-stretch border-0">
              <div className="col-4 d-flex align-items-center bg-purple-dark justify-content-center rounded-left">
                <em className="icon-bubbles fa-3x"></em>
              </div>
              <div className="col-8 py-3 bg-purple rounded-right">
                <div className="h2 mt-0">5</div>
                <div className="text-uppercase">Sudah Lunas</div>
              </div>
            </div>
          </div>

          <div className="col-xl-4 col-md-6">
            <div className="card flex-row align-items-center align-items-stretch border-0">
              <div className="col-4 d-flex align-items-center bg-primary-dark justify-content-center rounded-left">
                <em className="icon-bubbles fa-3x"></em>
              </div>
              <div className="col-8 py-3 bg-primary rounded-right">
                <div className="h2 mt-0">5</div>
                <div className="text-uppercase">Belum Lunas</div>
              </div>
            </div>
          </div>
        </Row>

        <p className="lead text-center">Data Pengguna</p>
        <Row>
          <div className="col-xl-4 col-md-6">
            <div className="card flex-row align-items-center align-items-stretch border-0">
              <div className="col-4 d-flex align-items-center bg-primary-dark justify-content-center rounded-left">
                <em className="icon-bubbles fa-3x"></em>
              </div>
              <div className="col-8 py-3 bg-primary rounded-right">
                <div className="h2 mt-0">3</div>
                <div className="text-uppercase">User Aktif</div>
              </div>
            </div>
          </div>

          <div className="col-xl-4 col-md-6">
            <div className="card flex-row align-items-center align-items-stretch border-0">
              <div className="col-4 d-flex align-items-center bg-purple-dark justify-content-center rounded-left">
                <em className="icon-bubbles fa-3x"></em>
              </div>
              <div className="col-8 py-3 bg-purple rounded-right">
                <div className="h2 mt-0">0</div>
                <div className="text-uppercase">User non Aktif</div>
              </div>
            </div>
          </div>

          <div className="col-xl-4 col-md-6">
            <div className="card flex-row align-items-center align-items-stretch border-0">
              <div className="col-4 d-flex align-items-center bg-primary-dark justify-content-center rounded-left">
                <em className="icon-bubbles fa-3x"></em>
              </div>
              <div className="col-8 py-3 bg-primary rounded-right">
                <div className="h2 mt-0">3</div>
                <div className="text-uppercase">Jumlah User</div>
              </div>
            </div>
          </div>
        </Row>
      </ContentWrapper>
    );
  }
}

Dashboard.propTypes = {
  actions: PropTypes.object,
  dashboard: PropTypes.object
}

const mapStateToProps = state => ({ dashboard: state.dashboard })
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) })

export default compose(connect(mapStateToProps, mapDispatchToProps), withTranslation('translations'))(Dashboard);
