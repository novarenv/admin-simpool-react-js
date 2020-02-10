import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Card, CardBody } from 'reactstrap';
import ReactDataGrid from 'react-data-grid';

import ContentWrapper from '../../../components/Layout/ContentWrapper';
import Swal from '../../../components/Common/Swal';

const COLUMN_WIDTH = 250;

const AddBar = () => {
  return (
    <div className="row mb-3">
      <div className="col-md-3 col-lg-2">
        <Link to="/simpool/member/saving-data">
          <Button outline className="col-12" color="primary" type="button">Kembali</Button>
        </Link>
      </div>
      <div className="ml-auto col-md-4 offset-md-5 col-lg-2 offset-lg-8">
        <Link to="/simpool/member/saving-data-add">
          <Button outline className="col-12" color="primary" type="button">
            Add Savings History
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
        <input className="form-control mr-3" type="text" placeholder="Search savings history" />
      </div>
      <Button outline className="col-md-2 mb-3 btn-search" color="primary" type="button">
        <i className="fas fa-search mr-2" />
        Search
      </Button>
    </div>
  )
}

class SavingHistory extends Component {
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

    this.state = {
      originalRows,
      rows,
      rowIdx: ''
    };
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

  deleteRow = () => {
    const rows = [...this.state.rows];
    rows.splice(this.state.rowIdx, 1);
    this.setState({ rows: rows });
  }

  swalOption = {
    title: 'Are you sure?',
    text: 'Do you want to delete saving history?',
    icon: 'warning',
    buttons: {
      cancel: {
        text: 'No, I\'d like to save it!',
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

  swalCallback(isConfirm, swal, deleteRow) {
    if (isConfirm) {
      swal("Deleted!", "Your saving history has been deleted.", "success")
      deleteRow()
    } else {
      swal("Cancelled", "Your saving history is safe :)", "error");
    }
  }

  actionCell = [
    {
      icon: <Swal options={this.swalOption} callback={this.swalCallback} deleteRow={this.deleteRow}> <span className="fas fa-times swal-del" /> </Swal>
    },
    {
      icon: <span className="fas fa-pen-square" />,
      callback: () => {
        this.props.history.push('/simpool/member/saving-data-history-edit')
      }
    }
  ];
  getCellActions = (column, row) => {
    const cellActions = {
      ACTION: this.actionCell
    };

    return cellActions[column.key];
  }

  onCellSelected = ({ rowIdx, idx }) => {
    if (idx !== 0) {
      this.props.history.push('/simpool/member/saving-data-history-detail')
    }
    this.state.rowIdx = rowIdx
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
          <div>History Transaksi Simpanan : No 1</div>
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

export default SavingHistory;