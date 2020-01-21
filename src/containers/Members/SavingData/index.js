import React, { Component } from 'react';
import ContentWrapper from '../../../components/Layout/ContentWrapper';
import { Container, Card, CardBody, Button } from 'reactstrap';
import $ from 'jquery';
import { Link, withRouter } from 'react-router-dom';
import { withTranslation, Trans } from 'react-i18next';

import Datatable from '../Datatable';
import './style.css';

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

  toSavingDataHistory = () => {
    this.props.history.push("/member/saving-data-history")
  }

  render() {
    return (
      <ContentWrapper>
        <div className="content-heading">
          <div><Trans i18nKey='member.saving-data.SAVINGS'>Savings</Trans></div>
        </div>
        <Container fluid>
          <Card>
            <CardBody>
              <Link to="/member/saving-data-add">
                <Button outline className="float-right mb-3" color="primary" type="button">
                  <Trans i18nKey='member.saving-data.ADD_SAVINGS'>Add Savings</Trans>
                </Button>
              </Link>
              <Datatable options={this.state.options}>
                <table className="table table-hover table-striped my-4 w-100">
                  <thead>
                    <tr>
                      <th data-priority="1"><Trans i18nKey='member.saving-data.ACCOUNT'>Account</Trans></th>
                      <th><Trans i18nKey='member.saving-data.MEMBER_ID'>Member Id</Trans></th>
                      <th><Trans i18nKey='member.saving-data.MEMBER'>Member</Trans></th>
                      <th><Trans i18nKey='member.saving-data.BALANCE'>Balance</Trans></th>
                      <th><Trans i18nKey='member.saving-data.OFFICE'>Office</Trans></th>
                      <th><Trans i18nKey='member.saving-data.ACTION'>Action</Trans></th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.datas.map((row, rowKey) => {
                      return (
                        <tr className="tr-cursor" key={rowKey} onClick={this.toSavingDataHistory}>
                          {row.map((col, colKey) => {
                            return (
                              <td key={colKey}>{col}</td>
                            )
                          })}
                          <td/>
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

export default withTranslation('translations')(withRouter(MemberData));