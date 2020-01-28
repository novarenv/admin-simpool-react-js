import React, { Component } from 'react';
import ContentWrapper from '../../../components/Layout/ContentWrapper';
import { Container, Card, CardBody, Button } from 'reactstrap';
import { Link, withRouter } from 'react-router-dom';
import { withTranslation, Trans } from 'react-i18next';
import ReactDataGrid from 'react-data-grid';

import Swal from './Swal';

const COLUMN_WIDTH = 250;

const AddBar = () => {
  return (
    <div className="row mb-3 mr-1">
      <div className="ml-auto mr-0">
        <Link to="/member/saving-data-add" >
          <Button outline color="primary" type="button">
            <Trans i18nKey='member.data.ADD_SAVINGS'>Add Savings</Trans>
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
        <input className="form-control mr-3" type="text" placeholder="Search savings" />
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
    
    this.state = {
      originalRows,
      rows,
      rowIdx: '',
      swalOption: {
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
    };
  }

  swalOption= {
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

  toSavingDataHistory = () => {
    this.props.history.push("/member/saving-data-history")
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

  deleteRow = () => {
    const rows = [...this.state.rows];
    rows.splice(this.state.rowIdx, 1);
    this.setState({ rows: rows });
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
      icon: <Swal options={this.swalOption} callback={this.swalCallback} className="swal-del"> <span className="fas fa-times swal-del"/> </Swal>,
      callback: () => {
        console.log("Delete")
      }
    },
    {
      icon: <span className="fas fa-pen-square"/>,
      callback: () => {
        console.log("Edit")
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
    this.state.rowIdx = rowIdx
    this.deleteRow()
    
    if (idx != 0) {
      this.props.history.push('/')
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
          <div><Trans i18nKey='member.saving-data.SAVINGS'>Savings</Trans></div>
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

export default withTranslation('translations')(withRouter(MemberData));