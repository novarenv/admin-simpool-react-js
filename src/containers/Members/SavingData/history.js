import React, { Component } from 'react';
import ContentWrapper from '../../../components/Layout/ContentWrapper';
import { Container, Card, CardBody } from 'reactstrap';
import ReactDataGrid from 'react-data-grid';

const COLUMN_WIDTH = 250;

class SavingHistory extends Component {
  constructor(props, context) {
    super(props, context);

    this._columns = [
      {
        key: 'ACTION',
        name: 'ACTION',
        width: 100,
        frozen: true
      },
      {
        key: 'REF_NUMBER',
        name: 'Reference Number',
        width: 200,
        frozen: true
      },
      {
        key: 'TRANSC_DATE',
        name: 'Transaction Date',
        sortable: true,
        width: COLUMN_WIDTH
      },
      {
        key: 'TRANSC_TYPE',
        name: 'Transaction Type',
        sortable: true,
        width: COLUMN_WIDTH
      },
      {
        key: 'DEBIT',
        name: 'Debit',
        sortable: true,
        width: COLUMN_WIDTH
      },
      {
        key: 'CREDIT',
        name: 'Credit',
        sortable: true,
        width: COLUMN_WIDTH
      },
      {
        key: 'BALANCE',
        name: 'Balance',
        sortable: true,
        width: COLUMN_WIDTH
      }
    ];

    let originalRows = this.createRows(1000);
    let rows = originalRows.slice(0);
    this.state = { originalRows, rows };
  }

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
      [1, "20 Jul 2019", "Setor Tunai", 0, 200000, 200000],
      [1, "20 Aug 2019", "Transfer Out", 100000, 0, 100000]
    ]
  }

  createRows = () => {
    let rows = [];
    for (let i = 1; i < 100; i++) {
      rows.push({
        ACTION: '',
        REF_NUMBER: i,
        TRANSC_DATE: i,
        TRANSC_TYPE: 'ABC' + i,
        DEBIT: i,
        CREDIT: i,
        BALANCE: i
      });
    }

    return rows;
  };

  rowGetter = (i) => this.state.rows[i]

  handleGridSort = (sortColumn, sortDirection) => {
    const comparer = (a, b) => {
      if (sortDirection === 'ASC') {
        return (a[sortColumn] > b[sortColumn]) ? 1 : -1;
      } else if (sortDirection === 'DESC') {
        return (a[sortColumn] < b[sortColumn]) ? 1 : -1;
      }
    };

    const rows = sortDirection === 'NONE' ? this.state.originalRows.slice(0) : this.state.rows.sort(comparer);

    this.setState({ rows });
  };

  render() {
    return (
      <ContentWrapper>
        <div className="content-heading">
          <div>History Transaksi Simpanan : No 1</div>
        </div>
        <Container fluid>
          <Card>
            <CardBody>
              <Container fluid>
                <ReactDataGrid
                  onGridSort={this.handleGridSort}
                  columns={this._columns}
                  rowGetter={this.rowGetter}
                  rowsCount={this.state.rows.length}
                  minHeight={700} />
              </Container>
            </CardBody>
          </Card>
        </Container>
      </ContentWrapper>
    );
  }

}

export default SavingHistory;