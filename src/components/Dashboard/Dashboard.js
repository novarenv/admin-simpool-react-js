import React, { Component } from 'react';
import { withTranslation, Trans } from 'react-i18next';
import ContentWrapper from '../Layout/ContentWrapper';
import { Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';

class Dashboard extends Component {

    state = {

        dropdownLanguage: "English",
        dropdownTranslateOpen: false,
        activeTab: 'tasks',

    }

    toggleDDTranslate = () => {
        this.setState({
            dropdownTranslateOpen: !this.state.dropdownTranslateOpen
        });
    }

    toggleTab = tab => {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    changeLanguage = lng => {
        this.props.i18n.changeLanguage(lng);
        if (lng === 'en'){
            this.state.dropdownLanguage = "English"
        } else if (lng === 'id'){
            this.state.dropdownLanguage = "B. Indonesia"
        }
    }

    render() {
        return (
            <ContentWrapper>
                <div className="content-heading">
                    { /* START Language list */ }
                    <div className="ml-auto">
                        <Dropdown isOpen={this.state.dropdownTranslateOpen} toggle={this.toggleDDTranslate}>
                            <DropdownToggle>
                                { this.state.dropdownLanguage }
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu-right-forced animated fadeInUpShort">
                                <DropdownItem onClick={() => this.changeLanguage('en')}>English</DropdownItem>
                                <DropdownItem onClick={() => this.changeLanguage('id')}>B. Indonesia</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                    { /* END Language list */ }
                </div>

                <Row>
                    <div className="col-xl-3 col-md-6">
                        {/* START widget */}
                        <div className="card bg-info-light pt-2 b0">
                            <div className="px-2">
                                <em className="icon-cloud-upload fa-lg float-right"></em>
                                <div className="h2 mt0">1700</div>
                                <div className="text-uppercase">Uploads</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-md-6">
                        {/* START widget */}
                        <div className="card bg-purple-light pt-2 b0">
                            <div className="px-2">
                                <em className="icon-globe fa-lg float-right"></em>
                                <div className="h2 mt0">700
                                    <span className="text-sm text-white">GB</span>
                                </div>
                                <div className="text-uppercase">Quota</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-lg-6 col-md-12">
                        {/* START widget */}
                        <div className="card bg-info-light pt-2 b0">
                            <div className="px-2">
                                <em className="icon-bubbles fa-lg float-right"></em>
                                <div className="h2 mt0">500</div>
                                <div className="text-uppercase">Reviews</div>
                            </div> 
                        </div>
                    </div>
                    <div className="col-xl-3 col-lg-6 col-md-12">
                        {/* START widget */}
                        <div className="card bg-purple-light pt-2 b0">
                            <div className="px-2">
                                <em className="icon-pencil fa-lg float-right"></em>
                                <div className="h2 mt0">35</div>
                                <div className="text-uppercase">Annotations</div>
                            </div>
                        </div>
                    </div>
                </Row>
            </ContentWrapper>
            );
    }

}

export default withTranslation('translations')(Dashboard);
