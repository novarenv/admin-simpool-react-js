import React, { Component } from 'react';
import ContentWrapper from '../../../components/Layout/ContentWrapper';
import { Container, Card, CardBody, Button } from 'reactstrap';
import { Link, withRouter } from 'react-router-dom';
import { withTranslation, Trans } from 'react-i18next';
import ReactDataGrid from 'react-data-grid';

const COLUMN_WIDTH = 500;

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

  state = {
    options: {
      'paging': true, // Table pagination
      'ordering': true, // Column ordering
      'info': true, // Bottom left status text
      responsive: true,
      // Text translation options
      // Note the required keywords between underscores (e.g _MENU_)
      oLanguage: {
        sSearch: '<em class="fa fa-search"></em>',
        sLengthMenu: '_MENU_ records per page',
        info: 'Showing page _PAGE_ of _PAGES_',
        zeroRecords: 'Nothing found - sorry',
        infoEmpty: 'No records available',
        infoFiltered: '(filtered from _MAX_ total records)',
        oPaginate: {
          sNext: '<em class="fa fa-caret-right"></em>',
          sPrevious: '<em class="fa fa-caret-left"></em>'
        }
      },
    }
  }

  // componentDidMount() {
  //   this.props.i18n.changeLanguage('id')
  // }

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

  render() {
    return (
      <ContentWrapper>
        <div className="content-heading">
          <span><Trans i18nKey='member.data.MEMBER_DATA'>Member Data</Trans></span>
        </div>
        <Container fluid>
          <Card>
            <CardBody>
              <Link to="/member/data-add">
                <Button outline className="float-right mb-3" color="primary" type="button"><Trans i18nKey='member.data.ADD_MEMBER_DATA'>Add Member Data</Trans></Button>
              </Link>

              <Container fluid>
                <ReactDataGrid
                  onGridSort={this.handleGridSort}
                  columns={this._columns}
                  rowGetter={this.rowGetter}
                  rowsCount={this.state.rows.length}
                  minHeight={700} />
              </Container>
            </CardBody>
          </Card>
        </Container>
      </ContentWrapper>
    );
  }

}

export default withTranslation('translations')(withRouter(MemberData));