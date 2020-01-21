import React, { Component } from 'react';
import ContentWrapper from '../../../components/Layout/ContentWrapper';
import { Container, Card, CardBody } from 'reactstrap';
import $ from 'jquery';

import Datatable from '../Datatable';

class LoanHistory extends Component {

  state = {
    options: {
      'paging': true, // Table pagination
      'ordering': true, // Column ordering
      'info': true, // Bottom left status text
      responsive: true,
      // Text translation options
      // Note the required keywords between underscores (e.g _MENU_)
      oLanguage: {
        sSearch: '<em class="fa fa-search"></em>',
        sLengthMenu: '_MENU_ records per page',
        info: 'Showing page _PAGE_ of _PAGES_',
        zeroRecords: 'Nothing found - sorry',
        infoEmpty: 'No records available',
        infoFiltered: '(filtered from _MAX_ total records)',
        oPaginate: {
          sNext: '<em class="fa fa-caret-right"></em>',
          sPrevious: '<em class="fa fa-caret-left"></em>'
        }
      }
    },
    datas: [
      [1, "20 Jul 2019", "Pencairan", 10000000, 0, 0, 0, 0, 0],
      [2, "20 Aug 2019", "Bayar", 1000000, 700000, 200000, 100000, 0, 0]
    ]
  }

  // Access to internal datatable instance for customizations
  dtInstance = dtInstance => {
    const inputSearchClass = 'datatable_input_col_search';
    const columnInputs = $('tfoot .' + inputSearchClass);
    // On input keyup trigger filtering
    columnInputs
      .keyup(function () {
        dtInstance.fnFilter(this.value, columnInputs.index(this));
      });
  }

  render() {
    return (
      <ContentWrapper>
        <div className="content-heading">
          <div>History Transaksi Pinjaman : No 1</div>
        </div>
        <Container fluid>
          <Card>
            <CardBody>
              <Datatable options={this.state.options}>
                <table className="table table-striped my-4 w-100">
                  <thead>
                    <tr>
                      <th data-priority="1" className="sort-numeric">No. Referensi</th>
                      <th>Tanggal Transaksi</th>
                      <th>Tipe Transaksi</th>
                      <th>Jumlah</th>
                      <th>Pokok</th>
                      <th>Bunga</th>
                      <th>Biaya</th>
                      <th>Denda</th>
                      <th>Sisa Pinjaman</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.datas.map((row) => {
                      return (
                        <tr>
                          {row.map((col, key) => {
                            return (
                              <td>{col}</td>
                            )
                          })}
                          <td/>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </Datatable>
            </CardBody>
          </Card>
        </Container>
      </ContentWrapper>
    );
  }

}

export default LoanHistory;