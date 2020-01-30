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
        <TreeItem nodeId="2" label="Calendar" onClick={() => { props.openPane() }} />
        <TreeItem nodeId="3" label="Chrome" />
        <TreeItem nodeId="4" label="Webstorm" />
      </TreeItem>
      <TreeItem nodeId="5" label="Documents">
        <TreeItem nodeId="6" label="Material-UI">
          <TreeItem nodeId="7" label="src">
            <TreeItem nodeId="8" label="index.js" />
            <TreeItem nodeId="9" label="tree-view.js" />

            <TreeItem nodeId="10" label="src2">
              <TreeItem nodeId="11" label="index.js2" />
              <TreeItem nodeId="12" label="tree-view.js2" />

              <TreeItem nodeId="13" label="src3">
                <TreeItem nodeId="14" label="index.js3" />
                <TreeItem nodeId="15" label="tree-view.js3" />

                <TreeItem nodeId="16" label="src4">
                  <TreeItem nodeId="17" label="index.js4" />
                  <TreeItem nodeId="18" label="tree-view.js4" />

                  <TreeItem nodeId="19" label="src5">
                    <TreeItem nodeId="20" label="index.js5" />
                    <TreeItem nodeId="21" label="tree-view.js5" />

                    <TreeItem nodeId="22" label="src6">
                      <TreeItem nodeId="23" label="index.js6" />
                      <TreeItem nodeId="24" label="tree-view.js6" />
                    </TreeItem>
                  </TreeItem>
                </TreeItem>
              </TreeItem>
            </TreeItem>
          </TreeItem>
        </TreeItem>
      </TreeItem>
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
        key: 'ANGGOTA',
        name: 'Anggota',
        width: 1000
      }
    ];
  }

  createRows = () => {
    let rows = [];
    for (let i = 1; i < 100; i++) {
      rows.push({
        ANGGOTA: i
      });
    }

    return rows;
  };

  rowGetter = (i) => this.state.rows[i]

  onCellSelected = ({ rowIdx, idx }) => {
    // setPaneOpen(false)
    this.setState({
      rowIdx: rowIdx
    })
    // console.log(rows[rowIdx].ANGGOTA)
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
          title='Hasil Pencarian Anggota'
          subtitle='Pilih salah satu'
          onRequestClose={() => {
            this.setState({ isPaneOpen: false });
          }}
        >
          <div className="row mr-1">
            <div className="col-md-10">
              <input className="form-control mr-3 input-font-size" type="text" placeholder="Search anggota.." value={1} tabIndex={1} />
            </div>
            <Button outline className="col-md-2 btn-search" color="primary" type="button" onClick={this.openPane} tabIndex={2}>
              <i className="fas fa-search mr-2" />
              Cari Anggota
          </Button>

            <Card>
              <CardBody>
                <ReactDataGrid
                  // onGridSort={this.handleGridSort}
                  columns={this._columns}
                  rowGetter={this.rowGetter}
                  rowsCount={this.state.rows.length}
                  minHeight={700}
                  minWidth={1000}
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