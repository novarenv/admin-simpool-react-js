import React, { Component } from 'react';
import { Button, Container, Card, CardBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import ReactDataGrid from 'react-data-grid';

import ContentWrapper from '../../../components/Layout/ContentWrapper';
import Swal from '../../../components/Common/Swal';

const COLUMN_WIDTH = 250;

const TreeAddBar = () => {
  return (
    <div className="row mb-3">
      <div className="col-md-3 col-lg-2">
        <Link to="/accounting/account-chart-tree">
          <Button className="col-12" color="primary" type="button">Tree View</Button>
        </Link>
      </div>
      <div className="ml-auto col-md-4 offset-md-5 col-lg-2 offset-lg-8">
        <Button outline className="col-12" color="primary" type="button">
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
        name: 'Action',
        width: 100,
        frozen: true
      },
      {
        key: 'ACCOUNT_CHART',
        name: 'Account Chart',
        width: 150,
        frozen: true
      },
      {
        key: 'ACCOUNT_NAME',
        name: 'Account Name',
        sortable: true,
        width: COLUMN_WIDTH
      },
      {
        key: 'ACCOUNT_TYPE',
        name: 'Account Type',
        sortable: true,
        width: COLUMN_WIDTH
      },
      {
        key: 'USED_AS',
        name: 'Used As',
        sortable: true,
        width: COLUMN_WIDTH
      }
    ];

    let originalRows = this.createRows(1000);
    let rows = originalRows.slice(0);

    this.state = {
      originalRows,
      rows,
      rowIdx: ''
    };
  }

  createRows = () => {
    let rows = []; rows.push({
      ACTION: '',
      ACCOUNT_CHART: '',
      ACCOUNT_NAME: '',
      ACCOUNT_TYPE: '',
      USED_AS: ''
    });
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

  deleteRow = () => {
    const rows = [...this.state.rows];
    rows.splice(this.state.rowIdx, 1);
    this.setState({ rows: rows });
  }

  swalOption = {
    title: 'Are you sure?',
    text: 'Your will not be able to recover this imaginary file!',
    icon: 'warning',
    buttons: {
      cancel: {
        text: 'No, cancel plx!',
        value: null,
        visible: true,
        className: "",
        closeModal: false
      },
      confirm: {
        text: 'Yes, delete it!',
        value: true,
        visible: true,
        className: "bg-danger",
        closeModal: false
      }
    }
  }

  swalCallback(isConfirm, swal) {
    if (isConfirm) {
      swal("Deleted!", "Your imaginary file has been deleted.", "success");
    } else {
      swal("Cancelled", "Your imaginary file is safe :)", "error");
    }
  }

  actionCell = [
    {
      icon: <Swal options={this.swalOption} callback={this.swalCallback}> <span className="fas fa-times swal-del" /> </Swal>,
      callback: () => {
        console.log("Delete")
      }
    },
    {
      icon: <span className="fas fa-pen-square" />,
      callback: () => {
        console.log("Edit")
        this.props.history.push('/accounting/account-chart-edit')
      }
    }
  ];
  getCellActions = (column, row) => {
    const cellActions = {
      ACTION: this.actionCell
    };

    console.log(row)

    return cellActions[column.key];
  }

  onCellSelected = ({ rowIdx, idx }) => {
    if (idx !== 0) {
      this.props.history.push('/accounting/account-chart-detail')
    }
    else if (idx === 0) {
      this.state.rowIdx = rowIdx
      this.deleteRow()
    }
  };

  onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
    this.setState(state => {
      const rows = state.rows.slice();
      for (let i = fromRow; i <= toRow; i++) {
        rows[i] = { ...rows[i], ...updated };
      }
      return { rows };
    });
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
                  minHeight={700}
                  getCellActions={this.getCellActions.bind(this)}
                  onCellSelected={this.onCellSelected.bind(this)}
                  onGridRowsUpdated={this.onGridRowsUpdated}
                />
              </Container>
            </CardBody>
          </Card>
        </Container>
      </ContentWrapper>
    );
  }

}

export default MemberData;