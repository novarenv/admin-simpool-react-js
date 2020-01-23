import React, { Component } from 'react';
import ContentWrapper from '../../../components/Layout/ContentWrapper';
import { Button, Container, Card, CardBody } from 'reactstrap';
import { Link, withRouter } from 'react-router-dom';
import ReactDataGrid from 'react-data-grid';

const COLUMN_WIDTH = 250;

const TreeAddBar = () => {
  return (
    <div className="row mb-3 ml-1 mr-1">
      <Link to="/accounting/account-chart-tree">
        <Button className="float-left" color="primary" type="button">Tree View</Button>
      </Link>

      <div className="ml-auto mr-0">
        <Button outline color="primary" type="button">
          Add Kode Akun
        </Button>
      </div>
    </div>
  )
}

const SearchBar = () => {
  return (
    <div className="row mr-1">
      <div className="col-md-10 mb-3">
        <input className="form-control mr-3" type="text" placeholder="Search kode akun" />
      </div>
      <Button outline className="col-md-2 mb-3 btn-search" color="primary" type="button">
        <i className="fas fa-search mr-2" />
        Search
      </Button>
    </div>
  )
}

class MemberData extends Component {
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
        key: 'ACCOUNT_CHART',
        name: 'ACCOUNT_CHART',
        width: 150,
        frozen: true
      },
      {
        key: 'ACCOUNT_NAME',
        name: 'ACCOUNT_NAME',
        sortable: true,
        width: COLUMN_WIDTH
      },
      {
        key: 'ACCOUNT_TYPE',
        name: 'ACCOUNT_TYPE',
        sortable: true,
        width: COLUMN_WIDTH
      },
      {
        key: 'USED_AS',
        name: 'USED_AS',
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
    }
  }

  createRows = () => {
    let rows = [];
    for (let i = 1; i < 100; i++) {
      rows.push({
        ACTION: '',
        ACCOUNT_CHART: i,
        ACCOUNT_NAME: 'ABC' + i,
        ACCOUNT_TYPE: 'ABC' + i,
        USED_AS: i
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
          <div>Daftar Kode Akun</div>
        </div>
        <Container fluid>
          <Card>
            <CardBody>
              <TreeAddBar />
              <SearchBar />

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

export default withRouter(MemberData);