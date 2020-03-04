import React, { useEffect, useState } from 'react'
import { Link, withRouter } from 'react-router-dom'
import {
  Button,
  Card,
  CardBody,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane
} from 'reactstrap'
import { withTranslation } from 'react-i18next'
import Modal from 'react-modal'
import QRCode from 'qrcode.react'

import PropTypes from 'prop-types'
import * as actions from '../../../store/actions/actions'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import ContentWrapper from '../../../components/Layout/ContentWrapper'

const SavingDataDetail = props => {
  const [activeTab, setActiveTab] = useState("summary")
  const [savingsAssosiations, setSavingsAssosiations] = useState({
    currency: {},
    officeData: {},
    openReason: {},
    transactionRestriction: {},
    status: {},
    summary: {},
    timeline: {}
  })
  const [savingsId] = useState(props.match.params.id)
  const [modalQr, setModalQr] = useState(false)
  const [qrCode, setQrCode] = useState(null)

  const MONTHS_ID = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember'
  ]

  const numToMoney = amount => {
    const amountInt = parseInt(amount)
    const amountNum = amount.toFixed(2)
    const amountStr = amountNum.toString()
    let afterComma

    if (amountStr.includes('.')) {
      afterComma = amountStr.slice(amountStr.length - 2, amountStr.length)
    }

    if (afterComma != null) {
      if (afterComma === "00") {
        return amountInt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      } else {
        return amountInt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "," + afterComma
      }
    } else {
      return amountInt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    }
  }

  const downloadQr = () => {
    const canvas = document.getElementById("qrCode");
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = savingsAssosiations.clientName + " savings #" + savingsAssosiations.accountNo + ".png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  const leftFirst = {
    backgroundColor: "#F9F9F9",
    width: "40%",
    height: 36,
    alignItems: "center",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#DDDDDD"
  }
  const leftSecond = {
    backgroundColor: "#FFFFFF",
    width: "40%",
    height: 36,
    alignItems: "center",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#DDDDDD"
  }

  const rightFirst = {
    backgroundColor: "#F9F9F9",
    width: "60%",
    height: 36,
    alignItems: "center",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#DDDDDD"
  }
  const rightSecond = {
    backgroundColor: "#FFFFFF",
    width: "60%",
    height: 36,
    alignItems: "center",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#DDDDDD"
  }

  const tes = false

  useEffect(() => {
    const setSavingsAssosiationsRes = res => {
      setSavingsAssosiations(res)
      props.actions.qrCode(res.accountNo, setQrCode)
    }

    props.actions.savingsAccountAssosiations(savingsId, setSavingsAssosiationsRes)

    Modal.setAppElement('body')

    return () => { }
  }, [props.actions, savingsId])

  return (
    <ContentWrapper>
      <Modal
        style={{
          content: {
            width: "50%",
            left: "25%"
          }
        }}
        isOpen={modalQr}
        onRequestClose={() => setModalQr(false)}
      >
        <div className="container-fluid">
          <div className="row">
            <Button outline className="col-6 col-lg-2" color="primary"
              onClick={() => setModalQr(false)}
            >
              Kembali
            </Button>
          </div>
          <div className="center-parent">
            <div className="mt-3">
              <h1>
                {
                  savingsAssosiations.savingsProductName != null
                    ? savingsAssosiations.savingsProductName
                    : "-"
                }
              </h1>
              <h3
                style={{ marginBottom: 0 }}
              >
                {
                  savingsAssosiations.accountNo != null
                    ? savingsAssosiations.accountNo
                    : "-"
                }
              </h3>
            </div>
            {
              qrCode != null
                ? (
                  <QRCode
                    id="qrCode"
                    style={{ height: "80%", width: "80%" }}
                    value={qrCode.data}
                    size={500}
                    includeMargin={true}
                  />
                )
                : null
            }
            <div>
              <button
                className="btn btn-primary"
                onClick={() => downloadQr()}
              >
                Download QR
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <div className="content-heading">
        <div>Detail Simpanan</div>
      </div>

      <Card className="card-default">
        <CardBody>
          <Link
            to={{
              pathname: "/simpool/member/saving-data",
              search: "?tenantIdentifier=" + props.settings.tenantIdentifier
            }}>
            <Button outline className="mt-3 col-4 col-md-2" color="primary" type="submit">Kembali</Button>
          </Link>

          <div className="center-parent mt-5">
            <h1>
              {
                savingsAssosiations.savingsProductName != null
                  ? savingsAssosiations.savingsProductName + " "
                  : "-"
              }
              {
                savingsAssosiations.status.id != null
                  ? savingsAssosiations.status.id === 300
                    ? (<span className="ml-auto circle bg-success circle-lg mb-3" />)
                    : savingsAssosiations.status.id === 100
                      ? (<span className="ml-auto circle bg-warning circle-lg mb-3" />)
                      : null
                  : null
              }
            </h1>
            <h3
              className="mb-0"
            >
              {
                savingsAssosiations.accountNo != null
                  ? savingsAssosiations.accountNo
                  : "-"
              }
            </h3>
            <button
              className="btn btn-secondary mt-2"
              onClick={() => setModalQr(true)}
            >
              Generate QR
            </button>
          </div>

          <div className="row justify-content-center">
            <table
              className="table col-md-5 col-lg-4 ft-detail mt-5 mx-2"
            >
              <tr>
                <td
                  style={leftFirst}
                >
                  <span>Activated On</span>
                </td>
                <td
                  style={rightFirst}
                >
                  <strong>
                    {
                      Array.isArray(savingsAssosiations.timeline.activatedOnDate) && savingsAssosiations.timeline.activatedOnDate.length > 0
                        ? savingsAssosiations.timeline.activatedOnDate[2] + " " + MONTHS_ID[savingsAssosiations.timeline.activatedOnDate[1] - 1] + " " + savingsAssosiations.timeline.activatedOnDate[0]
                        : "-"
                    }
                  </strong>
                </td>
              </tr>
              <tr>
                <td
                  style={leftSecond}
                >
                  <span>Currency</span>
                </td>
                <td
                  style={rightSecond}
                >
                  <strong>
                    {
                      savingsAssosiations.currency.name != null
                        ? savingsAssosiations.currency.name
                        : "-"
                    }
                  </strong>
                </td>
              </tr>
              <tr>
                <td
                  style={leftFirst}
                >
                  <span>Product Code</span>
                </td>
                <td
                  style={rightFirst}
                >
                  <strong>
                    {
                      savingsAssosiations.externalId != null
                        ? savingsAssosiations.externalId
                        : "-"
                    }
                  </strong>
                </td>
              </tr>
              <tr>
                <td
                  style={leftSecond}
                >
                  <span>Is Use Passbook ?</span>
                </td>
                <td
                  style={rightSecond}
                >
                  <strong>
                    {
                      savingsAssosiations.passbook != null
                        ? savingsAssosiations.passbook
                          ? "Ya"
                          : "Tidak"
                        : "-"
                    }
                  </strong>
                </td>
              </tr>
              <tr>
                <td
                  style={leftFirst}
                >
                  <span>Is Intermediate Account ?</span>
                </td>
                <td
                  style={rightFirst}
                >
                  <strong>
                    {
                      savingsAssosiations.isIntermediateAccount != null
                        ? savingsAssosiations.isIntermediateAccount
                          ? "Ya"
                          : "Tidak"
                        : "-"
                    }
                  </strong>
                </td>
              </tr>
              <tr>
                <td
                  style={leftSecond}
                >
                  <span>Display Name</span>
                </td>
                <td
                  style={rightSecond}
                >
                  <strong>
                    {
                      savingsAssosiations.displayName != null
                        ? savingsAssosiations.displayName
                        : "-"
                    }
                  </strong>
                </td>
              </tr>
              <tr>
                <td
                  style={leftFirst}
                >
                  <span>Passbook Number</span>
                </td>
                <td
                  style={rightFirst}
                >
                  <strong>
                    {
                      savingsAssosiations.passbookNumber != null
                        ? savingsAssosiations.passbookNumber
                        : "-"
                    }
                  </strong>
                </td>
              </tr>
            </table>

            <div className="col-1" />

            <table
              className="table col-md-5 col-lg-4 ft-detail mt-5 mx-2"
            >
              <tr>
                <td
                  style={leftFirst}
                >
                  <span>Field Officer</span>
                </td>
                <td
                  style={rightFirst}
                >
                  <strong>
                    {
                      savingsAssosiations.fieldOfficerName != null
                        ? savingsAssosiations.fieldOfficerName
                        : "Unassigned"
                    }
                  </strong>
                </td>
              </tr>
              <tr>
                <td
                  style={leftSecond}
                >
                  <span>Balance</span>
                </td>
                <td
                  style={rightSecond}
                >
                  {
                    savingsAssosiations.summary.accountBalance != null
                      ? numToMoney(savingsAssosiations.summary.accountBalance).includes("-")
                        ? (
                          <strong style={{ color: "red" }}>
                            {numToMoney(savingsAssosiations.summary.accountBalance)}
                          </strong>
                        )
                        : (
                          <strong>
                            {numToMoney(savingsAssosiations.summary.accountBalance)}
                          </strong>
                        )
                      : "-"
                  }
                </td>
              </tr>
              <tr>
                <td
                  style={leftFirst}
                >
                  <span>Available Balance</span>
                </td>
                <td
                  style={rightFirst}
                >
                  <strong>
                    {
                      savingsAssosiations.availableBalance != null
                        ? numToMoney(savingsAssosiations.availableBalance)
                        : "-"
                    }
                  </strong>
                </td>
              </tr>
              <tr>
                <td
                  style={leftSecond}
                >
                  <span>Open Reason</span>
                </td>
                <td
                  style={rightSecond}
                >
                  <strong>
                    {
                      savingsAssosiations.openReason.description != null
                        ? savingsAssosiations.openReason.description
                        : "-"
                    }
                  </strong>
                </td>
              </tr>
              <tr>
                <td
                  style={leftFirst}
                >
                  <span>Transaction Restriction</span>
                </td>
                <td
                  style={rightFirst}
                >
                  <strong>
                    {
                      savingsAssosiations.transactionRestriction.name != null
                        ? savingsAssosiations.transactionRestriction.name
                        : "-"
                    }
                  </strong>
                </td>
              </tr>
              <tr>
                <td
                  style={leftSecond}
                >
                  <span>Office</span>
                </td>
                <td
                  style={rightSecond}
                >
                  <strong>
                    {
                      savingsAssosiations.officeData.name != null
                        ? savingsAssosiations.officeData.name
                        : "-"
                    }
                  </strong>
                </td>
              </tr>
              <tr>
                <td
                  style={leftFirst}
                >
                  <span>External Account Number</span>
                </td>
                <td
                  style={rightFirst}
                >
                  <strong>
                    -
                  </strong>
                </td>
              </tr>
            </table>
          </div>

          <Nav tabs justified className="mt-5">
            <NavItem className="nav-tab">
              <NavLink className={activeTab === 'summary' ? 'active' : ''}
                onClick={() => { setActiveTab('summary'); }}
              >
                Summary
              </NavLink>
            </NavItem>
            {
              tes
                ? (
                  <NavItem className="nav-tab">
                    <NavLink className={activeTab === 'transactions' ? 'active' : ''}
                      onClick={() => { setActiveTab('transactions'); }}
                    >
                      Transactions
                    </NavLink>
                  </NavItem>
                )
                : null
            }
            {
              tes
                ? (
                  <NavItem className="nav-tab">
                    <NavLink className={activeTab === 'taxTransactions' ? 'active' : ''}
                      onClick={() => { setActiveTab('taxTransactions'); }}
                    >
                      Tax Transactions
                    </NavLink>
                  </NavItem>
                )
                : null
            }
            
            {
              tes
                ? (
                  <NavItem className="nav-tab">
                    <NavLink className={activeTab === 'charges' ? 'active' : ''}
                      onClick={() => { setActiveTab('charges'); }}
                    >
                      Charges
                    </NavLink>
                  </NavItem>
                )
                : null
            }

          </Nav>

          <TabContent activeTab={activeTab}>
            <TabPane className="ft-detail" tabId="detail" role="tabpanel">

            </TabPane>
            <TabPane className="ft-detail" tabId="detail" role="tabpanel">

            </TabPane>
            <TabPane className="ft-detail" tabId="detail" role="tabpanel">

            </TabPane>
          </TabContent>
        </CardBody>
      </Card>
    </ContentWrapper>
  )
}

SavingDataDetail.propTypes = {
  actions: PropTypes.object,
  settings: PropTypes.object
}

const mapStateToProps = state => ({
  settings: state.settings
})
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) })

export default compose(connect(mapStateToProps, mapDispatchToProps), withTranslation('translations'))(withRouter(SavingDataDetail))