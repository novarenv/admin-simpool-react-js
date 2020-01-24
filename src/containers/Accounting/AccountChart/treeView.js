import React, { Component } from 'react';
import ContentWrapper from '../../../components/Layout/ContentWrapper';
import { Button, Container, Card, CardBody, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import { Link, withRouter } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

const useStyles = makeStyles({
  root: {
    height: 216,
    flexGrow: 1,
    maxWidth: 400,
  },
});

export function ControlledTreeView() {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState([]);

  const handleChange = (event, nodes) => {
    setExpanded(nodes);
  };

  return (
    <TreeView
      className={classes.root}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      expanded={expanded}
      onNodeToggle={handleChange}
    >
      <TreeItem nodeId="1" label="Applications">
        <TreeItem nodeId="2" label="Calendar" />
        <TreeItem nodeId="3" label="Chrome" />
        <TreeItem nodeId="4" label="Webstorm" />
      </TreeItem>
      <TreeItem nodeId="5" label="Documents">
        <TreeItem nodeId="6" label="Material-UI">
          <TreeItem nodeId="7" label="src">
            <TreeItem nodeId="8" label="index.js" />
            <TreeItem nodeId="9" label="tree-view.js" />
          </TreeItem>
        </TreeItem>
      </TreeItem>
    </TreeView>
  );
}

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
                    <Container fluid>
                      <div className="row mt-3">
                        <div className="col-lg-6 mb-3">
                          <div className="card card-default" style={{ height: "100%" }}>
                            <div className="card-header">
                              <div className="card-title">Assets</div>
                            </div>
                            <div className="card-body bt">
                              <ControlledTreeView />
                            </div>
                            <div className="card-footer text-center">
                              <button type="button" className="btn btn-secondary btn-oval">Footer</button>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="card card-default mb-4">
                            <div className="card-header">
                              <div className="card-title">Liability</div>
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
                          <div className="card card-default mb-3" style={{ height: "800px" }}>
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