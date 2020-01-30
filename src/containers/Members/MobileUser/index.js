import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Card, CardBody, Button } from 'reactstrap';
import ReactDataGrid from 'react-data-grid';

import ContentWrapper from '../../../components/Layout/ContentWrapper';
import Swal from '../../../components/Common/Swal';

const COLUMN_WIDTH = 500;

const AddBar = () => {
  return (
    <div className="row mb-3 mr-1">
      <div className="ml-auto mr-0">
        <Link to="/member/saving-data-add" >
          <Button outline color="primary" type="button">
            Add Mobile User
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

class MobileUser extends Component {
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
        key: 'NAME',
        name: 'Name',
        width: 100,
        frozen: true
      },
      {
        key: 'USER_NAME',
        name: 'User Name',
        sortable: true,
        width: COLUMN_WIDTH
      },
      {
        key: 'EMAIL',
        name: 'Email',
        sortable: true,
        width: COLUMN_WIDTH
      },
      {
        key: 'OFFICE',
        name: 'Office',
        sortable: true,
        width: COLUMN_WIDTH
      },
      {
        key: 'ROLE',
        name: 'Role',
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
    rows.push({
      ACTION: '',
      NAME: '',
      USER_NAME: '',
      EMAIL: '',
      OFFICE: '',
      ROLE: ''
    });
    for (let i = 1; i < 100; i++) {
      rows.push({
        ACTION: '',
        NAME: i,
        USER_NAME: i,
        EMAIL: i,
        OFFICE: i,
        ROLE: i
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
        this.props.history.push('/member/mobile-user-edit')
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
      this.props.history.push('/member/mobile-user-detail')
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
          <span>Mobile User</span>
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

export default MobileUser;