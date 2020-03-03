import React, { Component } from 'react';
import { Button, Container, Card, CardBody } from 'reactstrap';
import { Link, withRouter } from 'react-router-dom';
import ReactDataGrid from 'react-data-grid';
import { createUltimatePagination } from 'react-ultimate-pagination';

import FlatButton from 'material-ui/FlatButton';
import NavigationFirstPage from 'material-ui/svg-icons/navigation/first-page';
import NavigationLastPage from 'material-ui/svg-icons/navigation/last-page';
import NavigationChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
import NavigationChevronRight from 'material-ui/svg-icons/navigation/chevron-right';

import ContentWrapper from '../../../components/Layout/ContentWrapper';
import Swal from '../../../components/Common/Swal';

const COLUMN_WIDTH = 250;

const AddBar = () => {
  return (
    <div className="row mb-3">
      <div className="col-md-4 col-lg-2">
        <Link to="/simpool/member/loan-data-history">
          <Button className="col-12" color="primary" type="button">History</Button>
        </Link>
      </div>
      <div className="col-md-3 col-lg-2">
        <Link to="/simpool/member/loan-data-view">
          <Button className="col-12" color="primary" type="button">View</Button>
        </Link>
      </div>
      <div className="ml-auto col-md-4 offset-md-1 col-lg-3 offset-lg-5">
        <Link to="/simpool/member/loan-data-add">
          <Button outline className="col-12" color="primary" type="button">
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

const flatButtonStyle = {
  minWidth: 48
};

const PaginatedPage = createUltimatePagination({
  itemTypeToComponent: {
    PAGE: ({ value, isActive, onClick, isDisabled }) => (
      <FlatButton
        style={flatButtonStyle}
        label={value.toString()}
        primary={isActive}
        onClick={onClick}
        disabled={isDisabled}
      />
    ),
    ELLIPSIS: ({ onClick, isDisabled }) => (
      <FlatButton
        style={flatButtonStyle}
        label="..."
        onClick={onClick}
        disabled={isDisabled}
      />
    ),
    FIRST_PAGE_LINK: ({ onClick, isDisabled }) => (
      <FlatButton
        style={flatButtonStyle}
        icon={<NavigationFirstPage />}
        onClick={onClick}
        disabled={isDisabled}
      />
    ),
    PREVIOUS_PAGE_LINK: ({ onClick, isDisabled }) => (
      <FlatButton
        style={flatButtonStyle}
        icon={<NavigationChevronLeft />}
        onClick={onClick}
        disabled={isDisabled}
      />
    ),
    NEXT_PAGE_LINK: ({ onClick, isDisabled }) => (
      <FlatButton
        style={flatButtonStyle}
        icon={<NavigationChevronRight />}
        onClick={onClick}
        disabled={isDisabled}
      />
    ),
    LAST_PAGE_LINK: ({ onClick, isDisabled }) => (
      <FlatButton
        style={flatButtonStyle}
        icon={<NavigationLastPage />}
        onClick={onClick}
        disabled={isDisabled}
      />
    )
  }
});

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
    this.state = {
      originalRows,
      rows,
      page: 1
    };
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

  // rowGetter = (i) => this.state.rows[i]

  rowGetter = (i) => {
    const rows = [...this.state.rows]
    let rowShown = rows.splice(5, 25)

    return rowShown[i]
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

  deleterow = () => {
    const rows = [...this.state.rows];
    rows.splice(this.state.rowIdx, 1);
    this.setState({ rows: rows });
  }

  swalOption = {
    title: 'Are you sure?',
    text: 'Do you want to delete this loan?',
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

  swalCallback(isConfirm, swal, deleterow) {
    if (isConfirm) {
      swal("Deleted!", "Your loan has been deleted.", "success")
      deleterow()
    } else {
      swal("Cancelled", "Your loan is safe :)", "error");
    }
  }

  actionCell = [
    {
      icon: <Swal options={this.swalOption} callback={this.swalCallback} deleterow={this.deleterow}> <span className="fas fa-times swal-del" /> </Swal>
    },
    {
      icon: <span className="fas fa-pen-square" />,
      callback: () => {
        this.props.history.push('/simpool/member/loan-data-edit')
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
      this.props.history.push('/simpool/member/loan-data-detail')
    }
    this.setState({rowIdx: rowIdx})
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
          <div>Data Pinjaman</div>
        </div>
        <Container fluid>
          <Card>
            <CardBody>
              <AddBar />
              <SearchBar />

              <Container fluid className="center-parent">
                <ReactDataGrid
                  onGridSort={this.handleGridSort}
                  columns={this._columns}
                  rowGetter={this.rowGetter}
                  rowsCount={25}
                  minHeight={25 * 35 + 50}
                  getCellActions={this.getCellActions.bind(this)}
                  onCellSelected={this.onCellSelected.bind(this)}
                  onGridRowsUpdated={this.onGridRowsUpdated}
                />

                <PaginatedPage
                  className="mt-3"
                  totalPages={10}
                  currentPage={this.state.page}
                  onChange={page => this.setState({ page })}
                />
              </Container>
            </CardBody>
          </Card>
        </Container>
      </ContentWrapper>
    );
  }

}

export default withRouter(LoanData);