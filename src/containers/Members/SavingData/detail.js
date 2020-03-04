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
    interestCalculationDaysInYearType: {},
    interestCalculationType: {},
    interestCompoundingPeriodType: {},
    interestPostingPeriodType: {},
    officeData: {},
    openReason: {},
    transactionRestriction: {},
    status: {},
    summary: {},
    taxGroup: {},
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

  let clientId
  if (savingsAssosiations.clientId != null) {
    clientId = savingsAssosiations.clientId
  }
  console.log(clientId)

  const leftCol = {
    backgroundColor: "#F5F5F5",
    width: "55%",
    height: 36,
    alignItems: "center",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#DDDDDD"
  }
  const rightCol = {
    backgroundColor: "#FFFFFF",
    width: "45%",
    height: 36,
    alignItems: "center",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#DDDDDD"
  }
  const first = {
    backgroundColor: "#F9F9F9",
    width: "40%",
    height: 36,
    alignItems: "center",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#DDDDDD"
  }
  const second = {
    backgroundColor: "#FFFFFF",
    width: "40%",
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
              pathname: "/simpool/member/data-detail/" + clientId,
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
                  style={first}
                >
                  <span>Activated On</span>
                </td>
                <td
                  style={first}
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
                  style={second}
                >
                  <span>Currency</span>
                </td>
                <td
                  style={second}
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
                  style={first}
                >
                  <span>Product Code</span>
                </td>
                <td
                  style={first}
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
                  style={second}
                >
                  <span>Is Use Passbook ?</span>
                </td>
                <td
                  style={second}
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
                  style={first}
                >
                  <span>Is Intermediate Account ?</span>
                </td>
                <td
                  style={first}
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
                  style={second}
                >
                  <span>Display Name</span>
                </td>
                <td
                  style={second}
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
                  style={first}
                >
                  <span>Passbook Number</span>
                </td>
                <td
                  style={first}
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
                  style={first}
                >
                  <span>Field Officer</span>
                </td>
                <td
                  style={first}
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
                  style={second}
                >
                  <span>Balance</span>
                </td>
                <td
                  style={second}
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
                  style={first}
                >
                  <span>Available Balance</span>
                </td>
                <td
                  style={first}
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
                  style={second}
                >
                  <span>Open Reason</span>
                </td>
                <td
                  style={second}
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
                  style={first}
                >
                  <span>Transaction Restriction</span>
                </td>
                <td
                  style={first}
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
                  style={second}
                >
                  <span>Office</span>
                </td>
                <td
                  style={second}
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
                  style={first}
                >
                  <span>External Account Number</span>
                </td>
                <td
                  style={first}
                >
                  <strong>
                    -
                  </strong>
                </td>
              </tr>
            </table>
          </div>

          <Nav tabs justified className="mt-5">
            {
              savingsAssosiations.summary != null
                ? (
                  <NavItem className="nav-tab">
                    <NavLink className={activeTab === 'summary' ? 'active' : ''}
                      onClick={() => { setActiveTab('summary'); }}
                    >
                      Summary
                    </NavLink>
                  </NavItem>
                )
                : null
            }
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
            <TabPane className="ft-detail" tabId="summary" role="tabpanel">
              <div className="row justify-content-center my-3">
                <table
                  className="table col-lg-5 ft-detail mx-2"
                  style={{ borderWidth: 2, borderColor: "#DDDDDD", borderStyle: "solid" }}
                >
                  <tr>
                    <td
                      style={leftCol}
                    >
                      <span>Total Deposits</span>
                    </td>
                    <td
                      style={rightCol}
                    >
                      <strong>
                        {
                          savingsAssosiations.summary.totalDeposits != null
                            ? numToMoney(savingsAssosiations.summary.totalDeposits)
                            : "-"
                        }
                      </strong>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={leftCol}
                    >
                      <span>Total withdrawals</span>
                    </td>
                    <td
                      style={rightCol}
                    >
                      <strong>
                        {
                          savingsAssosiations.summary.totalWithdrawals != null
                            ? numToMoney(savingsAssosiations.summary.totalWithdrawals)
                            : "-"
                        }
                      </strong>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={leftCol}
                    >
                      <span>Interest earned</span>
                    </td>
                    <td
                      style={rightCol}
                    >
                      <strong>
                        {
                          savingsAssosiations.summary.totalInterestEarned != null
                            ? numToMoney(savingsAssosiations.summary.totalInterestEarned)
                            : "-"
                        }
                      </strong>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={leftCol}
                    >
                      <span>Interest posted</span>
                    </td>
                    <td
                      style={rightCol}
                    >
                      <strong>
                        {
                          savingsAssosiations.summary.totalInterestPosted != null
                            ? numToMoney(savingsAssosiations.summary.totalInterestPosted)
                            : "-"
                        }
                      </strong>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={leftCol}
                    >
                      <span>Normal interest rate</span>
                    </td>
                    <td
                      style={rightCol}
                    >
                      <strong>
                        {
                          savingsAssosiations.nominalAnnualInterestRate != null
                            ? numToMoney(savingsAssosiations.nominalAnnualInterestRate) + " %"
                            : "-"
                        }
                      </strong>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={leftCol}
                    >
                      <span>Interest compounding period</span>
                    </td>
                    <td
                      style={rightCol}
                    >
                      <strong>
                        {
                          savingsAssosiations.interestCompoundingPeriodType.value != null
                            ? savingsAssosiations.interestCompoundingPeriodType.value
                            : "-"
                        }
                      </strong>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={leftCol}
                    >
                      <span>Interest posting period</span>
                    </td>
                    <td
                      style={rightCol}
                    >
                      <strong>
                        {
                          savingsAssosiations.interestPostingPeriodType.value != null
                            ? savingsAssosiations.interestPostingPeriodType.value
                            : "-"
                        }
                      </strong>
                    </td>
                  </tr>
                </table>

                <div className="col-1" />

                <table
                  className="table col-lg-5 ft-detail mx-2"
                  style={{ borderWidth: 2, borderColor: "#DDDDDD", borderStyle: "solid" }}
                >
                  <tr>
                    <td
                      style={leftCol}
                    >
                      <span>Interest calculated using</span>
                    </td>
                    <td
                      style={rightCol}
                    >
                      <strong>
                        {
                          savingsAssosiations.interestCalculationType.value != null
                            ? savingsAssosiations.interestCalculationType.value
                            : "-"
                        }
                      </strong>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={leftCol}
                    >
                      <span>Calculation Days in Year</span>
                    </td>
                    <td
                      style={rightCol}
                    >
                      <strong>
                        {
                          savingsAssosiations.interestCalculationDaysInYearType.value != null
                            ? savingsAssosiations.interestCalculationDaysInYearType.value
                            : "-"
                        }
                      </strong>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={leftCol}
                    >
                      <span>Withdrawal fee</span>
                    </td>
                    <td
                      style={rightCol}
                    >
                      <strong>
                        {
                          savingsAssosiations.summary.totalFeeCharge != null
                            ? savingsAssosiations.summary.totalFeeCharge
                            : "-"
                        }
                      </strong>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={leftCol}
                    >
                      <span>Last Active Transaction Date</span>
                    </td>
                    <td
                      style={rightCol}
                    >
                      <strong>
                        {
                          Array.isArray(savingsAssosiations.lastActiveTransactionDate) && savingsAssosiations.lastActiveTransactionDate.length > 0
                            ? savingsAssosiations.lastActiveTransactionDate[2] + " " + MONTHS_ID[savingsAssosiations.lastActiveTransactionDate[1] - 1] + " " + savingsAssosiations.lastActiveTransactionDate[0]
                            : "-"
                        }
                      </strong>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={leftCol}
                    >
                      <span>Balance Required For Interest Calculation</span>
                    </td>
                    <td
                      style={rightCol}
                    >
                      <strong>
                        {
                          savingsAssosiations.minBalanceForInterestCalculation != null
                            ? numToMoney(savingsAssosiations.minBalanceForInterestCalculation)
                            : "-"
                        }
                      </strong>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={leftCol}
                    >
                      <span>Enforce minimum balance</span>
                    </td>
                    <td
                      style={rightCol}
                    >
                      <strong>
                        {
                          savingsAssosiations.enforceMinRequiredBalance != null
                            ? savingsAssosiations.enforceMinRequiredBalance
                              ? "Yes"
                              : "No"
                            : "-"
                        }
                      </strong>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={leftCol}
                    >
                      <span>Minimum Balance</span>
                    </td>
                    <td
                      style={rightCol}
                    >
                      <strong>
                        {
                          savingsAssosiations.minRequiredBalance != null
                            ? numToMoney(savingsAssosiations.minRequiredBalance)
                            : "-"
                        }
                      </strong>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={leftCol}
                    >
                      <span>Withhold Tax group</span>
                    </td>
                    <td
                      style={rightCol}
                    >
                      <strong>
                        {
                          savingsAssosiations.taxGroup.name != null
                            ? savingsAssosiations.taxGroup.name
                            : "-"
                        }
                      </strong>
                    </td>
                  </tr>
                </table>
              </div>

            </TabPane>
            <TabPane className="ft-detail" tabId="transactions" role="tabpane2">

            </TabPane>
            <TabPane className="ft-detail" tabId="taxTransactions" role="tabpane3">

            </TabPane>
            <TabPane className="ft-detail" tabId="charges" role="tabpane4">

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