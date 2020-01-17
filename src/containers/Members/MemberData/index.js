import React, { Component } from 'react';
import ContentWrapper from '../../../components/Layout/ContentWrapper';
import { Container, Card, CardBody, Button} from 'reactstrap';
import $ from 'jquery';
import { Link, withRouter, useHistory } from 'react-router-dom';

import Datatable from '../Datatable';
import './style.css'

class MemberData extends Component {

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
      }
    },
    datas: [
      [1, 1, "ABC", 1, 1],
      [1, 1, "ABC", 1, 2],
      [1, 1, "ABC", 1, 3],
    ]
  }

  // Access to internal datatable instance for customizations
  dtInstance = dtInstance => {
    const inputSearchClass = 'datatable_input_col_search';    
    const columnInputs = $('tfoot .' + inputSearchClass);
    // On input keyup trigger filtering
    columnInputs
      .keyup(function () {
        dtInstance.fnFilter(this.value, columnInputs.index(this));
      });
  }

  render() {
    return (
      <ContentWrapper>
        <div className="content-heading">
          <div>Member Data</div>
        </div>
        <Container fluid>
          <Card>
            <CardBody>
              <Link to="/member/data-add">
                <Button outline className="float-right mb-3" color="primary" type="button">Add Member Data</Button>
              </Link>
              <Datatable options={this.state.options}>
                <table className="table table-hover table-striped my-4 w-100">
                  <thead>
                    <tr>
                      <th data-priority="1" className="sort-numeric">No. Anggota</th>
                      <th className="sort-numeric">No. Anggota Lama</th>
                      <th>Nama Lengkap</th>
                      <th>Kantor Pelayanan</th>
                      <th data-priority="1">Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    { this.state.datas.map((row, rowKey) => {
                      return (
                        <tr className="tr-cursor" key={rowKey}>
                          { row.map((col, colKey) => {
                            return (
                              <td key={colKey}>{ col }</td>
                            )
                          }) }
                          <td />
                        </tr>
                      ) 
                    })}
                  </tbody>
                </table>
              </Datatable>
            </CardBody>
          </Card>
        </Container>
      </ContentWrapper>
    );
  }

}

export default withRouter(MemberData);