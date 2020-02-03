import React, { Component } from 'react';
import ContentWrapper from '../../../components/Layout/ContentWrapper';
import { Button, Container, Card, CardBody } from 'reactstrap';
import { Link, withRouter } from 'react-router-dom';
import { withTranslation, Trans } from 'react-i18next';
import ReactDataGrid from 'react-data-grid';
import { Toolbar, Data } from 'react-data-grid-addons';

import Swal from '../../../components/Common/Swal';

const COLUMN_WIDTH = 250;

const HistoryAddBar = () => {
  return (
    <div className="row mb-3">
      <div className="col-md-3 col-lg-2">
        <Link to="/member/saving-data-history">
          <Button className="col-12" color="primary" type="button">History</Button>
        </Link>
      </div>
      <div className="ml-auto col-md-4 offset-md-5 col-lg-2 offset-lg-8">
        <Link to="/member/saving-data-add">
          <Button outline className="col-12" color="primary" type="button">
            Add Simpanan
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

class SavingData extends Component {
  constructor(props, context) {
    super(props, context);

    this.selectors = Data.Selectors;

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
        frozen: true,
        filterable: true
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
      filters: {}
    };
  }

  onAddFilter = filter => {
    const newFilters = this.handleFilterChange(filter)

    console.log("New Filters: " + newFilters)
    this.setFilters(newFilters)
  }

  handleFilterChange = filter => filters => {
    const newFilters = { ...filters };
    console.log("Handle Filter" + filters)

    if (filter.filterTerm) {
      newFilters[filter.column.key] = filter;
    } else {
      delete newFilters[filter.column.key];
    }

    console.log("New Filters Handle: " + newFilters)
    return newFilters;
  };

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

  getRows(rows, filters) {
    return this.selectors.getRows({ rows, filters });
  }

  setFilters = filters => {
    console.log("Set Filters: " + filters)
    this.setState({
      filters: filters
    })
  }

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
    text: 'Do you want to delete this saving?',
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

  swalCallback = (isConfirm, swal, deleteRow) => {
    if (isConfirm) {
      swal("Deleted!", "Your savings has been deleted.", "success")
      deleteRow()
    } else {
      swal("Cancelled", "Your savings is safe :)", "error");
    }
  }

  actionCell = [
    {
      icon: <Swal options={this.swalOption} callback={this.swalCallback} deleteRow={this.deleteRow}> <span className="fas fa-times swal-del" /> </Swal>
    },
    {
      icon: <span className="fas fa-pen-square" />,
      callback: () => {
        this.props.history.push('/member/saving-data-edit')
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
      this.props.history.push('/member/saving-data-detail')
    }
    this.setState({
      rowIdx: rowIdx
    })
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
    const filteredRows = this.getRows(this.state.rows, this.state.filters);

    return (
      <ContentWrapper>
        <div className="content-heading">
          <div><Trans i18nKey='member.saving-data.SAVINGS'>Savings</Trans></div>
        </div>
        <Container fluid>
          <Card>
            <CardBody>
              <HistoryAddBar />
              <SearchBar />

              <Container fluid>
                <ReactDataGrid
                  onGridSort={this.handleGridSort}
                  columns={this._columns}
                  rowGetter={i => filteredRows[i]}
                  rowsCount={filteredRows.length}
                  minHeight={700}
                  getCellActions={this.getCellActions.bind(this)}
                  onCellSelected={this.onCellSelected.bind(this)}
                  onGridRowsUpdated={this.onGridRowsUpdated}
                  toolbar={<Toolbar enableFilter={true} />}
                  onAddFilter={filter => this.onAddFilter(filter)}
                  onClearFilters={() => this.setFilters({})}
                />
              </Container>
            </CardBody>
          </Card>
        </Container>
      </ContentWrapper>
    );
  }

}

export default withTranslation('translations')(withRouter(SavingData));