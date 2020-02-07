import React, { Component } from 'react';
import { Container, Card, CardBody, Button } from 'reactstrap';
import { Link, withRouter } from 'react-router-dom';
import { withTranslation, Trans } from 'react-i18next';
import ReactDataGrid from 'react-data-grid';
import PropTypes from 'prop-types';

import ContentWrapper from '../../../components/Layout/ContentWrapper';
import Swal from '../../../components/Common/Swal';

import * as actions from '../../../store/actions/actions';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';

const COLUMN_WIDTH = 250;

const AddBar = () => {
  return (
    <div className="row mb-3 mr-1">
      <div className="ml-auto mr-0">
        <Link to="/member/data-add" >
          <Button outline color="primary" type="button">
            <Trans i18nKey='member.data.ADD_MEMBER_DATA'>Add Member Data</Trans>
          </Button>
        </Link>
      </div>
    </div>
  )
}

const SearchBar = props => {
  let searchInput

  const search = () => {
    props.props.actions.search(
      {
        input: searchInput
      },
      searchResponse
    )
  }

  const searchResponse = res => {
    props.searchRows(res)
  }

  const handleChange = e => {
    searchInput = e.target.value
  }

  return (
    <div className="row mr-1">
      <div className="col-md-10 mb-3">
        <input className="form-control mr-3" type="text" placeholder="Search member data" onChange={handleChange} />
      </div>
      <Button outline className="col-md-2 mb-3 btn-search" color="primary" type="button" onClick={search}>
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
        key: 'ID_MEMBER',
        name: 'Id',
        width: 100,
        frozen: true
      },
      {
        key: 'EXTERNAL_ID',
        name: 'External Id',
        sortable: true,
        width: COLUMN_WIDTH
      },
      {
        key: 'FULL_NAME',
        name: 'Full Name',
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
        key: 'STATUS',
        name: 'Status',
        sortable: true,
        width: COLUMN_WIDTH
      }
    ];

    this.props.actions.clientIndex(
      {
        limit: 25,
        offset: 0
      },
      this.createRows
    )

    this.state = {
      rows: [],
      rowIdx: ''
    };
  }

  createRows = rows => {
    let rowsTemp = [];
    rows.map(row => {
      rowsTemp.push({
        ACTION: '',
        ID_MEMBER: row.accountNo,
        EXTERNAL_ID: row.legalForm.value,
        FULL_NAME: row.displayName,
        OFFICE: row.officeName,
        STATUS: row.status.value
      })
    })
    this.setState({
      rows: rowsTemp
    })
  };

  searchRows = rows => {
    let rowsTemp = [];
    rows.map(row => {
      rowsTemp.push({
        ACTION: '',
        ID_MEMBER: row.entityAccountNo,
        EXTERNAL_ID: row.entityType,
        FULL_NAME: row.entityName,
        OFFICE: row.parentName,
        STATUS: row.entityStatus.value
      })
    })
    this.setState({
      rows: rowsTemp
    })
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
    text: 'Do you want to delete this member?',
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
      icon: <span className="fas fa-pen-square" style={{ alignSelf: 'center' }} />,
      callback: () => {
        this.props.history.push('/member/data-edit')
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
      this.props.history.push('/member/data-detail')
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
          <span><Trans i18nKey='member.data.MEMBER_DATA'>Member Data</Trans></span>
        </div>
        <Container fluid>
          <Card>
            <CardBody>
              <AddBar />
              <SearchBar props={this.props} searchRows={this.searchRows} />

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

MemberData.propTypes = {
  actions: PropTypes.object,
  auth: PropTypes.object,
  memberData: PropTypes.object,
  search: PropTypes.object
}

const mapStateToProps = state => ({
  auth: state.auth,
  memberData: state.memberData,
  search: state.search
})
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) })

export default compose(connect(mapStateToProps, mapDispatchToProps), withTranslation('translations'))(withRouter(MemberData));