import React, { Component, useState } from 'react';
import { Container, Card, CardBody, Button } from 'reactstrap';
import { Link, withRouter } from 'react-router-dom';
import { withTranslation, Trans } from 'react-i18next';
import PropTypes from 'prop-types';
import { createUltimatePagination } from 'react-ultimate-pagination';
import { Table } from 'antd'
import 'antd/dist/antd.css'

import FlatButton from 'material-ui/FlatButton';
import NavigationFirstPage from 'material-ui/svg-icons/navigation/first-page';
import NavigationLastPage from 'material-ui/svg-icons/navigation/last-page';
import NavigationChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
import NavigationChevronRight from 'material-ui/svg-icons/navigation/chevron-right';

import ContentWrapper from '../../../components/Layout/ContentWrapper';

import * as actions from '../../../store/actions/actions';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';

const AddBar = props => {
  return (
    <div className="row mb-3 mr-1 justify-content-end">
      <Link to={{
        pathname: "/simpool/member/data-add",
        search: "?tenantIdentifier=" + props.tenant
      }} >
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
}

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
})

class MemberData extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      page: 1,
      res: {},
      searchRes: null,
      totalPages: 0,
      rows: [],
      rowIdx: '',
      memberData: []
    };

    this.props.actions.clientIndex(
      {
        limit: 25,
        offset: 0
      },
      this.createRows
    )
  }

  memberCol = [
    {
      title: "ID",
      dataIndex: "ID_MEMBER",
      key: "ID_MEMBER",
      sorter: {
        compare: (a, b) => a.ID_MEMBER - b.ID_MEMBER
      },
      fixed: "left"
    },
    {
      title: "External Id",
      dataIndex: "EXTERNAL_ID",
      key: "EXTERNAL_ID",
      sorter: {
        compare: (a, b) => a.EXTERNAL_ID.length - b.EXTERNAL_ID.length
      }
    },
    {
      title: "Fullname",
      dataIndex: "FULLNAME",
      key: "FULLNAME",
      sorter: {
        compare: (a, b) => a.FULLNAME.length - b.FULLNAME.length
      }
    },
    {
      title: "Office",
      dataIndex: "OFFICE",
      key: "OFFICE",
      sorter: {
        compare: (a, b) => a.OFFICE.length - b.OFFICE.length
      }
    },
    {
      title: "Status",
      dataIndex: "STATUS",
      key: "STATUS",
      sorter: {
        compare: (a, b) => a.STATUS.length - b.STATUS.length
      }
    }
  ]

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
        STATUS:
          <span>
            {
              row?.status?.id === 300
                ? (<span className="ml-auto circle bg-success circle-lg" />)
                : row?.status?.id === 100
                  ? (<span className="ml-auto circle bg-warning circle-lg" />)
                  : null
            }
            {row.status.value}
          </span>
      })

      return null
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

      return null
    })
    this.setState({
      rows: rowsTemp,
      searchRes: rows
    })
  }

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

  changePage = page => {
    this.setState({ page: page })

    const offset = parseInt((page - 1) * 25)

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
              <AddBar tenant={this.props.settings.tenantIdentifier} />
              <SearchBar props={this.props} searchRows={this.searchRows} />

              <Container fluid className="center-parent">
                {
                  this.state.rows.length > 0
                    ? (
                      <div>



                        <div className="table-responsive">
                          <Table
                            dataSource={this.state.rows}
                            pagination={false}
                            bordered={true}
                            columns={this.memberCol}
                            onRow={(_, rowIndex) => {
                              return {
                                onClick: () => {
                                  let clientId

                                  if (this.state.searchRes != null) {
                                    this.state.searchRes.map(item => {
                                      if (item.entityAccountNo === this.state.rows[rowIndex].ID_MEMBER) {
                                        clientId = item.entityId
                                      }

                                      return null
                                    })
                                  } else {
                                    this.state.res.pageItems.map(item => {
                                      if (item.accountNo === this.state.rows[rowIndex].ID_MEMBER) {
                                        clientId = item.id
                                      }

                                      return null
                                    })
                                  }

                                  this.props.history.push({
                                    pathname: '/simpool/member/data-detail/' + clientId,
                                    search: "?tenantIdentifier=" + this.props.settings.tenantIdentifier
                                  })
                                }
                              }
                            }}
                          />
                        </div>
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
  search: PropTypes.object,
  settings: PropTypes.object
}

const mapStateToProps = state => ({
  memberData: state.memberData,
  search: state.search,
  settings: state.settings
})
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) })

export default compose(connect(mapStateToProps, mapDispatchToProps), withTranslation('translations'))(withRouter(MemberData));