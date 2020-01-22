import React, { Component } from 'react';
import ContentWrapper from '../../../components/Layout/ContentWrapper';
import { Button, Container, Card, CardBody, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import { Link, withRouter } from 'react-router-dom';

class MemberData extends Component {

  state = {
    activeTab: 'neraca'
  }

  toggleTab = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  render() {
    return (
      <ContentWrapper>
        <div className="content-heading">
          <div>Daftar Kode Akun Tree</div>
        </div>
        <Container fluid>
          <Card>
            <CardBody>
              <div className="ml-1 row">
                <Link to="/accounting/account-chart">
                  <Button outline className="float-left mb-3" color="primary" type="button">List View</Button>
                </Link>
              </div>

              <div role="tabpanel row">
                <Nav tabs justified>
                  <NavItem className="nav-tab">
                    <NavLink className={this.state.activeTab === 'neraca' ? 'active' : ''}
                      onClick={() => { this.toggleTab('neraca'); }}
                    >
                      Neraca</NavLink>
                  </NavItem>
                  <NavItem className="nav-tab">
                    <NavLink className={this.state.activeTab === 'laba' ? 'active' : ''}
                      onClick={() => { this.toggleTab('laba'); }}
                    >
                      Laba</NavLink>
                  </NavItem>
                  <NavItem className="nav-tab">
                    <NavLink className={this.state.activeTab === 'administrasi' ? 'active' : ''}
                      onClick={() => { this.toggleTab('administrasi'); }}
                    >
                      Administrasi</NavLink>
                  </NavItem>
                </Nav>

                <TabContent activeTab={this.state.activeTab}>
                  <TabPane tabId="neraca" role="tabpanel">
                    <Container fluid className="row">
                      <div className="col-6">
                        <div className="card card-default" style={{height:"100%"}}>
                          <div className="card-header">
                            <div className="card-title">Assets</div>
                          </div>
                          <div className="card-body bt">

                          </div>
                          <div className="card-body bb">
                            <div>Bagian 1</div>
                          </div>
                          <div className="card-body">
                            <div>Bagian 2</div>
                          </div>
                          <div className="card-footer text-center">
                            <button type="button" className="btn btn-secondary btn-oval">Footer</button>
                          </div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="card card-default" style={{height:"50%"}}>
                          <div className="card-header">
                            <div className="card-title">Liability</div>
                          </div>
                          <div className="card-body bt"/>
                          <div className="card-body bb">
                            <div>Bagian 1</div>
                          </div>
                          <div className="card-body">
                            <div>Bagian 2</div>
                          </div>
                          <div className="card-footer text-center">
                            <button type="button" className="btn btn-secondary btn-oval">Footer</button>
                          </div>
                        </div>
                        <div className="card card-default" style={{height:"50%"}}>
                          <div className="card-header">
                            <div className="card-title">Equity</div>
                          </div>
                          <div className="card-body bt" />
                          <div className="card-body bb">
                            <div>Bagian 1</div>
                          </div>
                          <div className="card-body">
                            <div>Bagian 2</div>
                          </div>
                          <div className="card-footer text-center">
                            <button type="button" className="btn btn-secondary btn-oval">Footer</button>
                          </div>
                        </div>
                      </div>
                    </Container>
                  </TabPane>

                  <TabPane tabId="laba" role="tabpanel">
                    <Container fluid>
                      <div className="card card-default">
                        <div className="card-header">
                          <div className="card-title">Income</div>
                        </div>
                        <div className="card-body bt" />
                        <div className="card-body bb">
                          <div>Bagian 1</div>
                        </div>
                        <div className="card-body">
                          <div>Bagian 2</div>
                        </div>
                        <div className="card-footer text-center">
                          <button type="button" className="btn btn-secondary btn-oval">Footer</button>
                        </div>
                      </div>
                      <div className="card card-default">
                        <div className="card-header">
                          <div className="card-title">Expense</div>
                        </div>
                        <div className="card-body bt" />
                        <div className="card-body bb">
                          <div>Bagian 1</div>
                        </div>
                        <div className="card-body">
                          <div>Bagian 2</div>
                        </div>
                        <div className="card-footer text-center">
                          <button type="button" className="btn btn-secondary btn-oval">Footer</button>
                        </div>
                      </div>
                    </Container>
                  </TabPane>

                  <TabPane tabId="administrasi" role="tabpanel">
                    <Container fluid>
                      <div className="card card-default">
                        <div className="card-header">
                          <div className="card-title">Administrasi</div>
                        </div>
                        <div className="card-body bt" />
                        <div className="card-body bb">
                          <div>Bagian 1</div>
                        </div>
                        <div className="card-body">
                          <div>Bagian 2</div>
                        </div>
                        <div className="card-footer text-center">
                          <button type="button" className="btn btn-secondary btn-oval">Footer</button>
                        </div>
                      </div>
                    </Container>
                  </TabPane>
                </TabContent>
              </div>
            </CardBody>
          </Card>
        </Container>
      </ContentWrapper>
    );
  }

}

export default withRouter(MemberData);