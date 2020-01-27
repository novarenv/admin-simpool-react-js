import React, { Component } from 'react';
import { Container, Card, CardBody, Button } from 'reactstrap';
import { Link, withRouter } from 'react-router-dom';
import { withTranslation, Trans } from 'react-i18next';
import ReactDataGrid from 'react-data-grid';

import ContentWrapper from '../../../components/Layout/ContentWrapper';

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

const SearchBar = () => {
  return (
    <div className="row mr-1">
      <div className="col-md-10 mb-3">
        <input className="form-control mr-3" type="text" placeholder="Search member data" />
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

    let originalRows = this.createRows(1000);
    let rows = originalRows.slice(0);
    this.state = { originalRows, rows };
  }

  createRows = () => {
    let rows = [];
    for (let i = 1; i < 100; i++) {
      rows.push({
        ACTION: '',
        ID_MEMBER: i,
        EXTERNAL_ID: i,
        FULL_NAME: 'ABC' + i,
        OFFICE: i,
        STATUS: i
      });
    }

    return rows;
  };

  rowGetter = (i) => this.state.rows[i]

  RowRenderer = ({ row, idx }) => {
    const { firstName, lastName } = row;
    return (
      <h1></h1>
    );
  };

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


  actionCell = [
    {
      icon: <span className="fas fa-search" />,
      actions: [
        {
          text: "Option 1",
          callback: () => {
            alert("Option 1 clicked");
          }
        },
        {
          text: "Option 2",
          callback: () => {
            alert("Option 2 clicked");
          }
        },
        {
          text: "Option 3",
          callback: () => {
            alert("Option 3 clicked");
          }
        }
      ]
    },    
    {
      icon: <span className="fas fa-shopping-cart" />,
      callback: () => {
        console.log("Shopping..")
      }
    }
  ];
  getCellActions = (column, row) => {
    const cellActions = {
      ACTION: this.actionCell
    };
    return cellActions[column.key];
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
              <SearchBar />

              <Container fluid>
                <ReactDataGrid
                  onGridSort={this.handleGridSort}
                  columns={this._columns}
                  rowGetter={this.rowGetter}
                  rowsCount={this.state.rows.length}
                  rowRenderer={RowRenderer}
                  minHeight={700}
                  getCellActions={this.getCellActions}
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