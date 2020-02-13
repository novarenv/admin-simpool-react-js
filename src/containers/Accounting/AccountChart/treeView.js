import React, { Component, useEffect, useState } from 'react';
import ContentWrapper from '../../../components/Layout/ContentWrapper';
import { Button, Container, Card, CardBody, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import { Link, withRouter } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import ReactDataGrid from 'react-data-grid';

const useStyles = makeStyles({
  root: {
    minHeight: 200,
    flexGrow: 1,
    maxWidth: 1600,
  }
});

export function ACTreeView(props) {

  const classes = useStyles();
  const [expanded, setExpanded] = useState([]);
  const [treeItems, setTreeItem] = useState([
    {
      nodeId: 101003600000000,
      label: "101003600000000 Kas",
      children1: [
        {
          nodeId: 101013600000000,
          label: "101013600000000 Kas Besar"
        },
        {
          nodeId: 101023600000000,
          label: "101023600000000 Kas Teller"
        },
        {
          nodeId: 101033600000000,
          label: "101033600000000 Kas Kecil"
        },
        {
          nodeId: 101014600000000,
          label: "101014600000000 Kas ATM"
        }
      ]
    },
    {
      nodeId: 102003600000000,
      label: "102003600000000 Bank",
      children1: [
        {
          nodeId: 102003600000001,
          label: "102003600000001 Bank - Dassa"
        },
        {
          nodeId: 102003600000002,
          label: "102003600000002 Bank - BCA"
        },
        {
          nodeId: 102003600000003,
          label: "102003600000003 Bank - Mandiri"
        },
        {
          nodeId: 102003600000004,
          label: "102003600000004 Bank BRI"
        },
        {
          nodeId: 102003600000005,
          label: "102003600000005 Bank BNI"
        },
        {
          nodeId: 102003600000006,
          label: "102003600000006 Bank Permata"
        }
      ]
    },
    {
      nodeId: 103003600000000,
      label: "Surat Berharga",
      children1: []
    }
  ])

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
      {
        treeItems.map(treeItem => {
          if (treeItem.children1.length == 0) {
            return (
              <TreeItem nodeId={treeItem.nodeId} label={treeItem.label} onClick={props.openPane} />
            )
          }
          else {
            return (
              <TreeItem nodeId={treeItem.nodeId} label={treeItem.label}>
                {
                  treeItem.children1.map(child1 => {
                    return (
                      <TreeItem nodeId={child1.nodeId} label={child1.label} onClick={props.openPane} />
                    )
                  })
                }
              </TreeItem>
            )
          }
        })
      }
    </TreeView>
  );
}

class MemberData extends Component {
  constructor(props) {
    super(props)

    let originalRows = this.createRows(1000);
    let rows = originalRows.slice(0);

    this.state = {
      isPaneOpen: false,
      rows,
      activeTab: 'neraca'
    };

    this._columns = [
      {
        key: 'FIELD',
        name: 'Field',
        width: 500,
        resizable: true
      },
      {
        key: 'VALUE',
        name: 'Value',
        width: 500,
        resizable: true
      }
    ];
  }

  createRows = () => {
    let rows = [];

    rows.push({
      FIELD: "GL Code",
      VALUE: 102003600000001
    })
    rows.push({
      FIELD: "Account Type",
      VALUE: "ASSET"
    })
    rows.push({
      FIELD: "Account Usage",
      VALUE: "DETAIL"
    })
    rows.push({
      FIELD: "Manual Entries Allowed",
      VALUE: "true"
    })
    rows.push({
      FIELD: "Is General Transaction",
      VALUE: "Yes"
    })
    rows.push({
      FIELD: "Description",
      VALUE: ""
    })

    return rows;
  };

  rowGetter = (i) => this.state.rows[i]

  onCellSelected = ({ rowIdx, idx }) => {
    this.setState({
      isPaneOpen: false,
      rowIdx: rowIdx
    })
  };

  toggleTab = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  openPane = () => {
    this.setState({ isPaneOpen: !this.state.isPaneOpen })
    console.log(this.state.isPaneOpen)
  }

  render() {
    return (
      <ContentWrapper>
        <SlidingPane
          className='pos-absolute slide-pane'
          closeIcon={<i className="fas fa-angle-right" />}
          isOpen={this.state.isPaneOpen}
          title='Account Chart'
          subtitle='Assets Detail'
          onRequestClose={() => {
            this.setState({ isPaneOpen: false });
          }}
        >
          <div className="row mr-1">
            <Card>
              <CardBody>
                <ReactDataGrid
                  columns={this._columns}
                  rowGetter={this.rowGetter}
                  rowsCount={this.state.rows.length}
                  minHeight={700}
                  minWidth={1300}
                  onCellSelected={this.onCellSelected}
                />
              </CardBody>
            </Card>
          </div>
        </SlidingPane>

        <div className="content-heading">
          <div>Daftar Kode Akun Tree</div>
        </div>
        <Container fluid>
          <Card>
            <CardBody>
              <div className="ml-1 row">
                <Link to="/simpool/accounting/account-chart">
                  <Button outline className="float-left mb-3" color="primary" type="button">List View</Button>
                </Link>
              </div>

              <div role="tabpanel row">
                <Nav tabs justified>
                  <NavItem className="nav-tab">
                    <NavLink className={this.state.activeTab === 'neraca' ? 'active' : ''}
                      onClick={() => { this.toggleTab('neraca'); }}
                    >
                      Neraca
                    </NavLink>
                  </NavItem>
                  <NavItem className="nav-tab">
                    <NavLink className={this.state.activeTab === 'laba' ? 'active' : ''}
                      onClick={() => { this.toggleTab('laba'); }}
                    >
                      Laba
                    </NavLink>
                  </NavItem>
                  <NavItem className="nav-tab">
                    <NavLink className={this.state.activeTab === 'administrasi' ? 'active' : ''}
                      onClick={() => { this.toggleTab('administrasi'); }}
                    >
                      Administrasi
                    </NavLink>
                  </NavItem>
                </Nav>

                <TabContent activeTab={this.state.activeTab}>
                  <TabPane tabId="neraca" role="tabpanel">
                    <Container fluid>
                      <div className="row mt-3 flex-grow-1">
                        <div className="col-lg-6 mb-3">
                          <div className="card card-default" style={{ height: "100%" }}>
                            <div className="card-header">
                              <div className="card-title">Assets</div>
                            </div>
                            <div className="card-body bt">
                              <ACTreeView openPane={this.openPane} />
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