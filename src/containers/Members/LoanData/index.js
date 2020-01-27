import React, { Component } from 'react';
import { Button, Container, Card, CardBody } from 'reactstrap';
import { Link, withRouter } from 'react-router-dom';
import ReactDataGrid from 'react-data-grid';

import ContentWrapper from '../../../components/Layout/ContentWrapper';

const COLUMN_WIDTH = 250;

const AddBar = () => {
  return (
    <div className="row mb-3 mr-1">
      <div className="ml-auto mr-0">
        <Link to="/member/loan-data-add" >
          <Button outline color="primary" type="button">
            Add Data Pinjaman
          </Button>
        </Link>
      </div>
    </div>
  )
}

const SearchBar = () => {
  return (
    <div className="row mr-1">
      <div className="col-md-10 mb-3">
        <input className="form-control mr-3" type="text" placeholder="Search data pinjaman" />
      </div>
      <Button outline className="col-md-2 mb-3 btn-search" color="primary" type="button">
        <i className="fas fa-search mr-2" />
        Search
      </Button>
    </div>
  )
}

class LoanData extends Component {
  constructor(props, context) {
    super(props, context);

    this._columns = [
      {
        key: 'ACTION',
        name: 'Action',
        width: 100,
        frozen: true
      },
      {
        key: 'ACCOUNT',
        name: 'Account',
        width: 100,
        frozen: true
      },
      {
        key: 'MEMBER_ID',
        name: 'Member Id',
        sortable: true,
        width: COLUMN_WIDTH
      },
      {
        key: 'MEMBER',
        name: 'Member',
        sortable: true,
        width: COLUMN_WIDTH
      },
      {
        key: 'BALANCE',
        name: 'Balance',
        sortable: true,
        width: COLUMN_WIDTH
      },
      {
        key: 'OFFICE',
        name: 'Office',
        sortable: true,
        width: COLUMN_WIDTH
      }
    ];

    let originalRows = this.createRows(1000);
    let rows = originalRows.slice(0);
    this.state = { originalRows, rows };
  }

  toLoanDataView = () => {
    this.props.history.push("/member/loan-data-view")
  }

  createRows = () => {
    let rows = [];
    for (let i = 1; i < 100; i++) {
      rows.push({
        ACTION: '',
        ACCOUNT: i,
        MEMBER_ID: i,
        MEMBER: 'ABC' + i,
        BALANCE: i,
        OFFICE: i
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
          <div>Data Pinjaman</div>
        </div>
        <Container fluid>
          <Card>
            <CardBody>
              <AddBar />
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

export default withRouter(LoanData);