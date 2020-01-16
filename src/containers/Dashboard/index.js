import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import ContentWrapper from '../../components/Layout/ContentWrapper';
import Now from '../../components/Common/Now';
import { Row, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import * as actions from '../../store/actions/actions';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';

class Dashboard extends Component {

  state = {
    dropdownTranslateOpen: false,
    activeTab: 'tasks',

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
    this.props.i18n.changeLanguage(lng);
    if (lng === 'en') {
      this.props.actions.changeDropdownLanguage("dropdownLanguage", "English")
    } else if (lng === 'id') {
      this.props.actions.changeDropdownLanguage("dropdownLanguage", "B. Indonesia")
    }
  }

  render() {
    console.log(this.props)

    return (
      <ContentWrapper>
        <div className="content-heading">
          { /* START Language list */}
          <div className="ml-auto">
            <Dropdown isOpen={this.state.dropdownTranslateOpen} toggle={this.toggleDDTranslate}>
              <DropdownToggle>
                {this.props.settings.dropdownLanguage}
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-right-forced animated fadeInUpShort">
                <DropdownItem onClick={() => this.changeLanguage('en')}>English</DropdownItem>
                <DropdownItem onClick={() => this.changeLanguage('id')}>B. Indonesia</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          { /* END Language list */}
        </div>

        <Row>
          <div className="col-xl-4 col-md-6">
            {/* START widget */}
            <div className="card bg-info-light pt-2 b0">
              <div className="px-2">
                <em className="icon-cloud-upload fa-lg float-right"></em>
                <div className="h2 mt0">Pinjaman Kredit</div>
                <div>1 Transaksi bulan ini</div>
                <div>1.154.345.700 Jumlah Transaksi tahun ini</div>
                <div>1.234.232.144 Sisa Transaksi bulan ini</div>
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-md-6">
            {/* START widget */}
            <div className="card bg-purple-light pt-2 b0">
              <div className="px-2">
                <em className="icon-globe fa-lg float-right"></em>
                <div className="h2 mt0">Simpanan Juli 2019</div>
                <div>21.000 Simpanan Anggota</div>
                <div>20.130.000 Jumlah Transaksi tahun ini</div>
                <div>-19.890.000 Sisa Transaksi bulan ini</div>
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-lg-6 col-md-12">
            {/* START widget */}
            <div className="card bg-info-light pt-2 b0">
              <div className="px-2">
                <em className="icon-bubbles fa-lg float-right"></em>
                <div className="h2 mt0">Kas Bulan Juli 2019</div>
                <div>2.500.201.355 Debet</div>
                <div>1.122.342.232 Kredit</div>
                <div>1.232.987.000 Jumlah</div>
              </div>
            </div>
          </div>
        </Row>
        <Row>
          <div className="col-xl-4 col-md-6">
            {/* START widget */}
            <div className="card bg-info-light pt-2 b0">
              <div className="px-2">
                <em className="icon-cloud-upload fa-lg float-right"></em>
                <div className="h2 mt0">Data Anggota</div>
                <div>4 Anggota Aktif</div>
                <div>0 Anggota Tidak Aktif</div>
                <div>4 Jumlah Anggota</div>
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-md-6">
            {/* START widget */}
            <div className="card bg-purple-light pt-2 b0">
              <div className="px-2">
                <em className="icon-globe fa-lg float-right"></em>
                <div className="h2 mt0">Data Peminjam</div>
                <div>10 Peminjam</div>
                <div>5 Sudah Lunas</div>
                <div>5 Belum Lunas</div>
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-lg-6 col-md-12">
            {/* START widget */}
            <div className="card bg-info-light pt-2 b0">
              <div className="px-2">
                <em className="icon-bubbles fa-lg float-right"></em>
                <div className="h2 mt0">Data Pengguna</div>
                <div>3 User Aktif</div>
                <div>0 User non Aktif</div>
                <div>3 Jumlah User</div>
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
  settings: PropTypes.object
}

const mapStateToProps = state => ({ settings: state.settings })
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) })

export default compose(connect(mapStateToProps, mapDispatchToProps), withTranslation('translations'))(Dashboard);
