import React, { Component, useState } from 'react';
import { Container, Card, CardBody, Button } from 'reactstrap';
import { Link, withRouter } from 'react-router-dom';
import { withTranslation, Trans } from 'react-i18next';
import ReactDataGrid from 'react-data-grid';
import PropTypes from 'prop-types';
import { createUltimatePagination } from 'react-ultimate-pagination';

import FlatButton from 'material-ui/FlatButton';
import NavigationFirstPage from 'material-ui/svg-icons/navigation/first-page';
import NavigationLastPage from 'material-ui/svg-icons/navigation/last-page';
import NavigationChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
import NavigationChevronRight from 'material-ui/svg-icons/navigation/chevron-right';

import ContentWrapper from '../../../components/Layout/ContentWrapper';

import * as actions from '../../../store/actions/actions';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';

const COLUMN_WIDTH = 314;

const AddBar = () => {
  return (
    <div className="row mb-3 mr-1 justify-content-end">
      <Link to="/simpool/member/data-add" >
        <Button color="primary" type="button">
          <Trans i18nKey='member.data.ADD_MEMBER_DATA'>Add Member Data</Trans>
        </Button>
      </Link>
    </div>
  )
}

const SearchBar = props => {
  const [searchInput, setSearchInput] = useState("")

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
    setSearchInput(e.target.value)
  }

  const clickButton = e => {
    if (e.keyCode === 13) {
      e.preventDefault();

      document.getElementById("searchButton").click()
    }
  }

  return (
    <div className="row mr-1">
      <div className="col-md-8 col-lg-10 mb-3">
        <input className="form-control mr-3" type="text" placeholder="Search member data" onChange={handleChange} onKeyUp={e => clickButton(e)} />
      </div>
      <Button outline id="searchButton" className="col-md-4 col-lg-2 mb-3 btn-search" color="primary" onClick={search}>
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

class MemberData extends Component {
  constructor(props, context) {
    super(props, context);
    this._columns = [
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
        key: 'FULLNAME',
        name: 'Fullname',
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
        width: 200
      }
    ];

    this.state = {
      page: 1,
      res: {},
      searchRes: null,
      totalPages: 0,
      rows: [],
      rowIdx: '',
    };

    this.props.actions.clientIndex(
      {
        limit: 25,
        offset: 0
      },
      this.createRows
    )
  }

  createRows = res => {
    this.setState({
      res: res,
      totalPages: Math.ceil(res.totalFilteredRecords / 25)
    })
    let rowsTemp = [];
    res.pageItems.map(row => {
      rowsTemp.push({
        ID_MEMBER: row.accountNo,
        EXTERNAL_ID: row.legalForm.value,
        FULLNAME: row.displayName,
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
        ID_MEMBER: row.entityAccountNo,
        EXTERNAL_ID: row.entityType,
        FULLNAME: row.entityName,
        OFFICE: row.parentName,
        STATUS: row.entityStatus.value
      })
    })
    this.setState({
      rows: rowsTemp,
      searchRes: rows
    })
  }

  rowGetter = (i) => this.state.rows[i]

  handleGridSort = (sortColumn, sortDirection) => {
    const comparer = (a, b) => {
      if (sortDirection === 'ASC') {
        return (a[sortColumn] > b[sortColumn]) ? 1 : -1;
      } else if (sortDirection === 'DESC') {
        return (a[sortColumn] < b[sortColumn]) ? 1 : -1;
      }
    };

    const rows = sortDirection === 'NONE' ? this.state.rows.slice(0) : this.state.rows.sort(comparer);

    this.setState({ rows });
  };

  deleterow = () => {
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

  swalCallback(isConfirm, swal, deleterow) {
    if (isConfirm) {
      swal("Deleted!", "Your savings has been deleted.", "success")
      deleterow()
    } else {
      swal("Cancelled", "Your savings is safe :)", "error");
    }
  }

  editMember = () => {
    console.log("Edit")
  }

  onCellSelected = ({ rowIdx, idx }) => {
    console.log(rowIdx)
    console.log(idx)
    if (idx !== 0) {
      let clientId

      if (this.state.searchRes != null) {
        this.state.searchRes.map(item => {
          if (item.entityAccountNo === this.state.rows[rowIdx].ID_MEMBER) {
            clientId = item.entityId
          }
        })
      } else {
        this.state.res.pageItems.map(item => {
          if (item.accountNo === this.state.rows[rowIdx].ID_MEMBER) {
            clientId = item.id
          }
        })
      }

      this.props.history.push('/simpool/member/data-detail/' + clientId)
    }

    this.setState({ rowIdx })
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

  changePage = page => {
    console.log(page)
    this.setState({ page: page })

    const offset = parseInt((page - 1) * 25)

    console.log(offset)

    this.props.actions.clientIndex(
      {
        limit: 25,
        offset: offset
      },
      this.createRows
    )
  }

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

              <Container fluid className="center-parent">
                {
                  this.state.rows.length > 0
                    ? (
                      <div>
                        <ReactDataGrid
                          onGridSort={this.handleGridSort}
                          columns={this._columns}
                          rowGetter={this.rowGetter}
                          rowsCount={this.state.rows.length}
                          minHeight={25 * 35 + 50}
                          onCellSelected={this.onCellSelected.bind(this)}
                          onGridRowsUpdated={this.onGridRowsUpdated}
                        />

                        <PaginatedPage
                          className="mt-3"
                          totalPages={this.state.totalPages}
                          currentPage={this.state.page}
                          onChange={page => this.changePage(page)}
                        />
                      </div>
                    )
                    : (
                      <em className="fas fa-circle-notch fa-spin fa-2x text-muted" />
                    )
                }
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
  memberData: PropTypes.object,
  search: PropTypes.object
}

const mapStateToProps = state => ({
  memberData: state.memberData,
  search: state.search
})
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) })

export default compose(connect(mapStateToProps, mapDispatchToProps), withTranslation('translations'))(withRouter(MemberData));