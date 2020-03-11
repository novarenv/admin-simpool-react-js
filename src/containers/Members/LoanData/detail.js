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

import PropTypes from 'prop-types'
import * as actions from '../../../store/actions/actions'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import ContentWrapper from '../../../components/Layout/ContentWrapper'

const SavingDataDetail = props => {
  const [activeTab, setActiveTab] = useState("detail")
  const [loans, setLoans] = useState({})
  const [loanId] = useState(props.match.params.id)

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

  let clientId
  if (loans && loans.clientId) {
    clientId = loans.clientId
  }

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
  const tHeadLoan = {
    borderWidth: 2,
    borderBottomWidth: 3,
    borderColor: "#DDDDDD",
    borderStyle: "solid"
  }
  const thHeadLoan = {
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderStyle: "solid",
    color: "black",
    fontWeight: "bold"
  }

  const leftDetail = [
    "Repayment Strategy",
    "Repayments",
    "Amortization",
    "Interest",
    "Grace: On Principal Payment",
    "Grace: On Interest Payment",
    "Grace on Arrears Ageing",
    "Fund Source",
    "Sinking Fund",
    "Interest Free Period",
    "Interest Calculation Period",
    "Allow Partial Interest Calculation with same as repayment",
    "Interest Type",
    "Submitted on",
    "Approved on",
    "Disbursed on",
    "Matures on",
    "Recalculate Interest",
    "Days in year",
    "Days in month",
    "is TakeOver ?",
    "Renewal Status",
    "Orientation Usage",
    "Debtor Category",
    "Debtor Type",
    "Loan Usage Province",
    "Loan Usage City",
    "Economic Sector",
    "Economic Sector Detail",
    "Project Value",
    "Nature of Loan/Financing",
    "Traid of Loan/Financing"
  ]

  const repaymentFrequencyType =
    loans && loans.repaymentFrequencyType && loans.repaymentFrequencyType.value
      ? loans.repaymentFrequencyType.value
      : ""

  const interestType =
    loans && loans.interestType && loans.interestType.value
      ? loans.interestType.value
      : ""

  const rightDetail = [
    loans.transactionProcessingStrategyName,
    loans.numberOfRepayments + " every "
    + loans.repaymentEvery
    + " "
    + repaymentFrequencyType
    + " on",
    loans && loans.amortizationType && loans.amortizationType.value
      ? loans.amortizationType.value
      : "",
    loans.annualInterestRate + " per annum ("
    + loans.annualInterestRate + "% Per year) - "
    + interestType,
    "",
    "",
    "",
    "",
    "",
    "",
    loans && loans.interestCalculationPeriodType && loans.interestCalculationPeriodType.value
      ? loans.interestCalculationPeriodType.value
      : "",
    loans.allowPartialPeriodInterestCalcualtion
      ? "true"
      : "false",
    interestType,
    loans
      && loans.timeline
      && loans.timeline.submittedOnDate
      ? Array.isArray(loans.timeline.submittedOnDate) && loans.timeline.submittedOnDate.length > 0
        ? loans.timeline.submittedOnDate[2] + " " + MONTHS_ID[loans.timeline.submittedOnDate[1] - 1] + " " + loans.timeline.submittedOnDate[0]
        : ""
      : "",
    loans
      && loans.timeline
      && loans.timeline.approvedOnDate
      ? Array.isArray(loans.timeline.approvedOnDate) && loans.timeline.approvedOnDate.length > 0
        ? loans.timeline.approvedOnDate[2] + " " + MONTHS_ID[loans.timeline.approvedOnDate[1] - 1] + " " + loans.timeline.approvedOnDate[0]
        : ""
      : "",
    loans
      && loans.timeline
      && loans.timeline.actualDisbursementDate
      ? Array.isArray(loans.timeline.actualDisbursementDate) && loans.timeline.actualDisbursementDate.length > 0
        ? loans.timeline.actualDisbursementDate[2] + " " + MONTHS_ID[loans.timeline.actualDisbursementDate[1] - 1] + " " + loans.timeline.actualDisbursementDate[0]
        : ""
      : "",
    loans
      && loans.timeline
      && loans.timeline.expectedMaturityDate
      ? Array.isArray(loans.timeline.expectedMaturityDate) && loans.timeline.expectedMaturityDate.length > 0
        ? loans.timeline.expectedMaturityDate[2] + " " + MONTHS_ID[loans.timeline.expectedMaturityDate[1] - 1] + " " + loans.timeline.expectedMaturityDate[0]
        : ""
      : "",
    loans.isInterestRecalculationEnabled
      ? "yes"
      : "no",
    loans && loans.daysInYearType && loans.daysInYearType.value
      ? loans.daysInYearType.value
      : "",
    loans && loans.daysInMonthType && loans.daysInMonthType.value
      ? loans.daysInMonthType.value
      : "",
    loans.isTakeOver
      ? "true"
      : "false",
    loans && loans.renewalStatus && loans.renewalStatus.description
      ? loans.renewalStatus.description
      : "",
    loans && loans.orientationUsage && loans.orientationUsage.description
      ? loans.orientationUsage.description
      : "",
    loans && loans.debtorCategory && loans.debtorCategory.description
      ? loans.debtorCategory.description
      : "",
    "",
    loans && loans.province && loans.province.description
      ? loans.province.description
      : "",
    loans && loans.city && loans.city.description
      ? loans.city.description
      : "",
    loans && loans.economicSector && loans.economicSector.description
      ? loans.economicSector.description
      : "",
    loans && loans.economicSectorDetail && loans.economicSectorDetail.description
      ? loans.economicSectorDetail.description
      : "",
    loans.projectValue,
    loans && loans.financingCode && loans.financingCode.description
      ? loans.financingCode.description
      : "",
    loans && loans.traidCode && loans.traidCode.description
      ? loans.traidCode.description
      : ""
  ]

  const summaryHead = [
    "",
    "Original",
    "Paid",
    "Waived",
    "Written Off",
    "Outstanding",
    "Over Due"
  ]

  const summaryBody = [
    [
      "Principal",
      loans && loans.summary && loans.summary.principalDisbursed
        ? loans.summary.principalDisbursed
        : "0",
      loans && loans.summary && loans.summary.principalPaid
        ? loans.summary.principalPaid
        : "0",
      "-",
      loans && loans.summary && loans.summary.principalWrittenOff
        ? loans.summary.principalWrittenOff
        : "0",
      loans && loans.summary && loans.summary.principalOutstanding
        ? loans.summary.principalOutstanding
        : "0",
      loans && loans.summary && loans.summary.principalOverdue
        ? loans.summary.principalOverdue
        : "0"
    ],
    [
      "Interest",
      loans && loans.summary && loans.summary.interestCharged
        ? loans.summary.interestCharged
        : "0",
      loans && loans.summary && loans.summary.interestPaid
        ? loans.summary.interestPaid
        : "0",
      loans && loans.summary && loans.summary.interestWaived
        ? loans.summary.interestWaived
        : "0",
      loans && loans.summary && loans.summary.interestWrittenOff
        ? loans.summary.interestWrittenOff
        : "0",
      loans && loans.summary && loans.summary.interestOutstanding
        ? loans.summary.interestOutstanding
        : "0",
      loans && loans.summary && loans.summary.interestOverdue
        ? loans.summary.interestOverdue
        : "0"
    ],
    [
      "Fees",
      loans && loans.summary && loans.summary.feeChargesCharged
        ? loans.summary.feeChargesCharged
        : "0",
      loans && loans.summary && loans.summary.feeChargesPaid
        ? loans.summary.feeChargesPaid
        : "0",
      loans && loans.summary && loans.summary.feeChargestWaived
        ? loans.summary.feeChargestWaived
        : "0",
      loans && loans.summary && loans.summary.feeChargestWrittenOff
        ? loans.summary.feeChargestWrittenOff
        : "0",
      loans && loans.summary && loans.summary.feeChargestOutstanding
        ? loans.summary.feeChargestOutstanding
        : "0",
      loans && loans.summary && loans.summary.feeChargestOverdue
        ? loans.summary.feeChargestOverdue
        : "0"
    ],
    [
      "Penalties",
      loans && loans.summary && loans.summary.penaltyChargesCharged
        ? loans.summary.penaltyChargesCharged
        : "0",
      loans && loans.summary && loans.summary.penaltyChargesPaid
        ? loans.summary.penaltyChargesPaid
        : "0",
      loans && loans.summary && loans.summary.penaltyChargestWaived
        ? loans.summary.penaltyChargestWaived
        : "0",
      loans && loans.summary && loans.summary.penaltyChargestWrittenOff
        ? loans.summary.penaltyChargestWrittenOff
        : "0",
      loans && loans.summary && loans.summary.penaltyChargestOutstanding
        ? loans.summary.penaltyChargestOutstanding
        : "0",
      loans && loans.summary && loans.summary.penaltyChargestOverdue
        ? loans.summary.penaltyChargestOverdue
        : "0"
    ],
    [
      "Total",
      loans && loans.summary && loans.summary.totalExpectedRepayment
        ? loans.summary.totalExpectedRepayment
        : "0",
      loans && loans.summary && loans.summary.totalRepayment
        ? loans.summary.totalRepayment
        : "0",
      loans && loans.summary && loans.summary.totalWaived
        ? loans.summary.totalWaived
        : "0",
      loans && loans.summary && loans.summary.totalWrittenOff
        ? loans.summary.totalWrittenOff
        : "0",
      loans && loans.summary && loans.summary.totalOutstanding
        ? loans.summary.totalOutstanding
        : "0",
      loans && loans.summary && loans.summary.totalOverdue
        ? loans.summary.totalOverdue
        : "0"
    ]
  ]

  const repaymentScheduleHead = [
    [
      "",
      "Loan Amount and Balance",
      "Total Cost of Loan",
      "Installment Totals"
    ],
    [
      "Id",
      "Days",
      "Date",
      "Paid Date",
      "Principal Due",
      "Balance of Loan",
      "Interest",
      "Fees",
      "Penaltiees",
      "Due",
      "Paid",
      "In Advance",
      "Late",
      "Outstanding"
    ]
  ]
  const [repaymentScheduleBody, setRepaymentScheduleBody] = useState([])
  const [repaymentScheduleTotals, setRepaymentScheduleTotals] = useState([
    "",
    0,
    "Total",
    "",
    0,
    "",
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0
  ])

  const numToMoney = amount => {
    const amountInt = parseInt(amount)
    const amountNum = amount.toFixed(2)
    const amountStr = amountNum.toString()
    let afterComma

    if (amountStr.includes('.')) {
      afterComma = amountStr.slice(amountStr.length - 2, amountStr.length)
    }

    if (afterComma) {
      if (afterComma === "00") {
        return amountInt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      } else {
        return amountInt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "," + afterComma
      }
    } else {
      return amountInt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    }
  }

  useEffect(() => {
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

    const setLoansRes = loans => {
      setLoans(loans)

      if (
        loans && loans.repaymentSchedule
        && Array.isArray(loans.repaymentSchedule.periods)
        && loans.repaymentSchedule.periods.length > 0
      ) {
        let periods = []

        loans.repaymentSchedule.periods.map(period => {
          periods.push([
            period && period.period
              ? period.period
              : "",
            period && period.daysInPeriod
              ? period.daysInPeriod
              : "",
            period && period.dueDate
              && Array.isArray(period.dueDate)
              && period.dueDate.length > 0
              ? period.dueDate[2] + " " + MONTHS_ID[period.dueDate[1] - 1] + " " + period.dueDate[0]
              : "",
            period && period.obligationsMetOnDate
              && Array.isArray(period.obligationsMetOnDate)
              && period.obligationsMetOnDate.length > 0
              ? period.obligationsMetOnDate[2] + " " + MONTHS_ID[period.obligationsMetOnDate[1] - 1] + " " + period.obligationsMetOnDate[0]
              : "",
            period && period.principalDue
              ? period.principalDue
              : "0",
            period && period.principalLoanBalanceOutstanding
              ? period.principalLoanBalanceOutstanding
              : "0",
            period && period.interestDue
              ? period.interestDue
              : "0",
            period && period.feeChargesDue
              ? period.feeChargesDue
              : "0",
            period && period.penaltyChargesDue
              ? period.penaltyChargesDue
              : "0",
            period && period.totalDueForPeriod
              ? period.totalDueForPeriod
              : "0",
            period && period.totalPaidForPeriod
              ? period.totalPaidForPeriod
              : "0",
            period && period.totalPaidInAdvanceForPeriod
              ? period.totalPaidInAdvanceForPeriod
              : "0",
            period && period.totalPaidLateForPeriod
              ? period.totalPaidLateForPeriod
              : "0",
            period && period.totalOutstandingForPeriod
              ? period.totalOutstandingForPeriod
              : "0"
          ])

          return null
        })
        

        setRepaymentScheduleBody(periods)

        periods.map(period => {
          if (period[1] === "") {
            period[1] = 0
          }
          setRepaymentScheduleTotals(prevArray => [
            "",
            prevArray[1] + parseInt(period[1]),
            "Total",
            "",
            prevArray[4] + parseInt(period[4]),
            "",
            prevArray[6] + parseInt(period[6]),
            prevArray[7] + parseInt(period[7]),
            prevArray[8] + parseInt(period[8]),
            prevArray[9] + parseInt(period[9]),
            prevArray[10] + parseInt(period[10]),
            prevArray[11] + parseInt(period[11]),
            prevArray[12] + parseInt(period[12]),
            prevArray[13] + parseInt(period[13]),
          ])
        })
      }
    }
    props.actions.loans(loanId, setLoansRes)

    return () => { }
  }, [loanId, props.actions])

  return (
    <ContentWrapper>
      <div className="content-heading">
        <div>Detail Pinjaman</div>
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
                loans
                  && loans.loanProductName
                  ? loans.loanProductName + " "
                  : "-"
              }
              {
                loans
                  && loans.status
                  && loans.status.id
                  ? loans.status.id === 600
                    ? (<span className="ml-auto circle circle-lg mb-3" style={{ backgroundColor: "gray" }} />)
                    : loans.status.id === 300 && loans.inArrears
                      ? (<span className="ml-auto circle bg-danger circle-lg mb-3" />)
                      : loans.status.id === 300
                        ? (<span className="ml-auto circle bg-success circle-lg mb-3" />)
                        : loans.status.id === 200
                          ? (<span className="ml-auto circle bg-primary circle-lg mb-3" />)
                          : loans.status.id === 100
                            ? (<span className="ml-auto circle bg-warning circle-lg mb-3" />)
                            : null
                  : null
              }
            </h1>
            <h3
              className="mb-0"
            >
              {
                loans
                  && loans.accountNo
                  ? loans.accountNo
                  : "-"
              }
            </h3>
          </div>

          <div className="row justify-content-center">
            <table
              className="table col-md-5 col-lg-4 ft-detail mt-5 mx-2"
              style={{ borderWidth: 2, borderColor: "#DDDDDD", borderStyle: "solid" }}
            >
              <tbody>
                <tr>
                  <td
                    style={leftCol}
                  >
                    <span>Disbursement Date</span>
                  </td>
                  <td
                    style={rightCol}
                  >
                    <strong>
                      {
                        loans
                          && loans.timeline
                          && loans.timeline.actualDisbursementDate
                          ? Array.isArray(loans.timeline.actualDisbursementDate) && loans.timeline.actualDisbursementDate.length > 0
                            ? loans.timeline.actualDisbursementDate[2] + " " + MONTHS_ID[loans.timeline.actualDisbursementDate[1] - 1] + " " + loans.timeline.actualDisbursementDate[0]
                            : "Not Available"
                          : "Not Available"
                      }
                    </strong>
                  </td>
                </tr>
                <tr>
                  <td
                    style={leftCol}
                  >
                    <span>Currency</span>
                  </td>
                  <td
                    style={rightCol}
                  >
                    <strong>
                      {
                        loans
                          && loans.currency
                          && loans.currency.name
                          ? loans.currency.name
                          : "-"
                      }
                    </strong>
                  </td>
                </tr>
                <tr>
                  <td
                    style={leftCol}
                  >
                    <span>Loan Officer</span>
                  </td>
                  <td
                    style={rightCol}
                  >
                    <strong>
                      {
                        loans
                          && loans.loanOfficerName
                          ? loans.loanOfficerName
                          : "Unassigned"
                      }
                    </strong>
                  </td>
                </tr>
                <tr>
                  <td
                    style={leftCol}
                  >
                    <span>Mobile Agent</span>
                  </td>
                  <td
                    style={rightCol}
                  >
                    <strong>
                      {
                        "Unassigned"
                      }
                    </strong>
                  </td>
                </tr>
                <tr>
                  <td
                    style={leftCol}
                  >
                    <span>Product Code</span>
                  </td>
                  <td
                    style={rightCol}
                  >
                    <strong>
                      {
                        loans
                          && loans.externalId
                          ? loans.externalId
                          : "-"
                      }
                    </strong>
                  </td>
                </tr>
                {
                  loans
                    && loans.status
                    && loans.status.id === 300
                    ? (
                      <tr>
                        <td
                          style={leftCol}
                        >
                          <span>Account Collectibility By System</span>
                        </td>
                        <td
                          style={rightCol}
                        >
                          <strong>
                            {
                              loans
                                && loans.categoryNameByLoan
                                && loans.categoryByLoan
                                ? loans.categoryByLoan + " - " + loans.categoryNameByLoan
                                : "-"
                            }
                          </strong>
                        </td>
                      </tr>
                    )
                    : null
                }
                {
                  loans
                    && loans.status
                    && loans.status.id === 300
                    ? (
                      <tr>
                        <td
                          style={leftCol}
                        >
                          <span>CIF Collectibility By System</span>
                        </td>
                        <td
                          style={rightCol}
                        >
                          <strong>
                            {
                              loans
                                && loans.categoryNameByCif
                                && loans.categoryByCif
                                ? loans.categoryByCif + " - " + loans.categoryNameByCif
                                : "-"
                            }
                          </strong>
                        </td>
                      </tr>
                    )
                    : null
                }
                {
                  loans
                    && loans.status
                    && loans.status.id === 300
                    ? (
                      <tr>
                        <td
                          style={leftCol}
                        >
                          <span>Manual Account Collectibility</span>
                        </td>
                        <td
                          style={rightCol}
                        >
                          <strong>
                            {
                              loans
                                && loans.manualCollectibility !== 0
                                ? loans.manualCollectibility
                                : "-"
                            }
                          </strong>
                        </td>
                      </tr>
                    )
                    : null
                }
              </tbody>
            </table>

            <div className="col-1" />

            <table
              className="table col-md-5 col-lg-4 ft-detail mt-5 mx-2"
              style={{ borderWidth: 2, borderColor: "#DDDDDD", borderStyle: "solid" }}
            >
              <tbody>
                <tr>
                  <td
                    style={leftCol}
                  >
                    <span>Loan Purpose</span>
                  </td>
                  <td
                    style={rightCol}
                  >
                    <strong>
                      {
                        loans
                          && loans.loanPurposeName
                          ? loans.loanPurposeName
                          : "Not Provided"
                      }
                    </strong>
                  </td>
                </tr>
                <tr>
                  <td
                    style={leftCol}
                  >
                    <span>Proposed Amount</span>
                  </td>
                  <td
                    style={rightCol}
                  >
                    <strong>
                      {
                        loans
                          && loans.proposedPrincipal
                          ? (
                            <strong>
                              {numToMoney(loans.proposedPrincipal)}
                            </strong>
                          )
                          : "-"
                      }
                    </strong>
                  </td>
                </tr>
                {
                  loans
                    && loans.status
                    && (
                      loans.status.id === 200
                      || loans.status.id === 300
                      || loans.status.id === 600
                    )
                    ? (
                      <tr>
                        <td
                          style={leftCol}
                        >
                          <span>Approved Amount</span>
                        </td>
                        <td
                          style={rightCol}
                        >
                          <strong>
                            {
                              loans
                                && loans.approvedPrincipal
                                ? numToMoney(loans.approvedPrincipal)
                                : "-"
                            }
                          </strong>
                        </td>
                      </tr>
                    )
                    : null
                }
                {
                  loans
                    && loans.status
                    && (
                      loans.status.id === 200
                      || loans.status.id === 300
                      || loans.status.id === 600
                    )
                    ? (
                      <tr>
                        <td
                          style={leftCol}
                        >
                          <span>Disburse Amount</span>
                        </td>
                        <td
                          style={rightCol}
                        >
                          <strong>
                            {
                              loans
                                && loans.principal
                                ? numToMoney(loans.principal)
                                : "-"
                            }
                          </strong>
                        </td>
                      </tr>
                    )
                    : null
                }
                <tr>
                  <td
                    style={leftCol}
                  >
                    <span>Arrears By</span>
                  </td>
                  <td
                    style={rightCol}
                  >
                    <strong>
                      {
                        loans
                          && loans.summary
                          && loans.summary.totalOverdue
                          ? numToMoney(loans.summary.totalOverdue)
                          : "Not Provided"
                      }
                    </strong>
                  </td>
                </tr>
                {
                  loans
                    && loans.status
                    && (
                      loans.status.id === 200
                      || loans.status.id === 300
                      || loans.status.id === 600
                    )
                    ? (
                      <tr>
                        <td
                          style={leftCol}
                        >
                          <span>NPA</span>
                        </td>
                        <td
                          style={rightCol}
                        >
                          <strong>
                            {
                              loans
                                && loans.isNPA
                                ? "Yes"
                                : "No"
                            }
                          </strong>
                        </td>
                      </tr>
                    )
                    : null
                }
                {
                  loans
                    && loans.status
                    && (
                      loans.status.id === 200
                      || loans.status.id === 300
                      || loans.status.id === 600
                    )
                    ? (
                      <tr>
                        <td
                          style={leftCol}
                        >
                          <span>Provision Amount By CIF</span>
                        </td>
                        <td
                          style={rightCol}
                        >
                          <strong>
                            {
                              loans
                                && loans.reservedAmountByCif
                                ? numToMoney(loans.reservedAmountByCif)
                                : "-"
                            }
                          </strong>
                        </td>
                      </tr>
                    )
                    : null
                }
              </tbody>
            </table>
          </div>

          <Nav tabs justified className="mt-5">
            {
              loans
                ? (
                  <NavItem className="nav-tab">
                    <NavLink className={activeTab === 'detail' ? 'active' : ''}
                      onClick={() => { setActiveTab('detail'); }}
                    >
                      Detail
                    </NavLink>
                  </NavItem>
                )
                : null
            }
            {
              loans
                && loans.summary
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
              loans
                && loans.repaymentSchedule
                ? (
                  <NavItem className="nav-tab">
                    <NavLink className={activeTab === 'repaymentSchedule' ? 'active' : ''}
                      onClick={() => { setActiveTab('repaymentSchedule'); }}
                    >
                      Repayment Schedule
                    </NavLink>
                  </NavItem>
                )
                : null
            }

            {
              loans
                && Array.isArray(loans.charges)
                && loans.charges.length > 0
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
              <div className="row justify-content-center my-3">
                <div className="table-responsive col-10">
                  <table className="table">
                    <tbody>
                      {
                        leftDetail.map((detail, key) => {
                          return (
                            <tr
                              key={"leftDetail " + key}
                              style={
                                key % 2 === 0
                                  ? first
                                  : second
                              }
                            >
                              <td style={{ borderWidth: 1, borderStyle: "solid", borderColor: "#DDDDDD" }}>{detail}</td>
                              <td style={{ borderWidth: 1, borderStyle: "solid", borderColor: "#DDDDDD" }}>{rightDetail[key]}</td>
                            </tr>
                          )
                        })
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </TabPane>
            <TabPane className="ft-detail" tabId="summary" role="tabpane2">
              <div className="row justify-content-center my-3">
                <div className="table-responsive col-10">
                  <table className="table">
                    <thead style={tHeadLoan}>
                      <tr>
                        {
                          summaryHead.map((head, key) => {
                            return (<th key={"head " + key} style={thHeadLoan}>{head}</th>)
                          })
                        }
                      </tr>
                    </thead>
                    <tbody>
                      {
                        summaryBody.map((detailRow, key) => {
                          let endRow = false

                          if (summaryBody.length - 1 === key) {
                            endRow = true
                          }

                          return (
                            <tr
                              key={"detailRow " + key}
                              style={
                                key % 2 === 0
                                  ? first
                                  : second
                              }
                            >
                              {
                                detailRow.map((detailCol, key) => {
                                  return (
                                    <td
                                      key={"detailCol " + key}
                                      style={
                                        endRow
                                          ? { borderWidth: 1, borderStyle: "solid", borderColor: "#DDDDDD", color: "black", fontWeight: "bold" }
                                          : key === 0
                                            ? { borderWidth: 1, borderStyle: "solid", borderColor: "#DDDDDD", color: "black", fontWeight: "bold" }
                                            : { borderWidth: 1, borderStyle: "solid", borderColor: "#DDDDDD" }
                                      }
                                    >
                                      {detailCol}
                                    </td>
                                  )
                                })
                              }
                            </tr>
                          )
                        })
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </TabPane>
            <TabPane className="ft-detail" tabId="repaymentSchedule" role="tabpane3">
              <div className="row justify-content-center my-3">
                <div className="table-responsive col-12">
                  <table className="table">
                    <thead style={tHeadLoan}>
                      {
                        repaymentScheduleHead.map((headRow, keyRow) => {
                          return (
                            <tr key={"headRow " + keyRow}>
                              {
                                headRow.map((headCol, keyCol) => {
                                  return (
                                    <th
                                      key={"headCol " + keyCol}
                                      style={thHeadLoan}
                                      colSpan={
                                        keyRow === 0
                                          ? keyCol === 0
                                            ? "4"
                                            : keyCol === 1
                                              ? "2"
                                              : keyCol === 2
                                                ? "3"
                                                : keyCol === 3
                                                  ? "5"
                                                  : ""
                                          : ""
                                      }
                                    >
                                      {headCol}
                                    </th>
                                  )
                                })
                              }
                            </tr>
                          )
                        })
                      }
                    </thead>
                    <tbody>
                      {
                        repaymentScheduleBody.map((detailRow, key) => {
                          return (
                            <tr
                              key={"detailRow " + key}
                              style={
                                key % 2 === 0
                                  ? first
                                  : second
                              }
                            >
                              {
                                detailRow.map((detailCol, key) => {

                                  return (
                                    <td
                                      key={"detailCol " + key}
                                      style={{ borderWidth: 1, borderStyle: "solid", borderColor: "#DDDDDD" }}
                                    >
                                      {detailCol}
                                    </td>
                                  )
                                })
                              }
                            </tr>
                          )
                        })
                      }
                      <tr style={second}>
                        {
                          repaymentScheduleTotals.map((total, key) => {
                            return (
                              <td
                                key={"detailCol " + key}
                                style={{ borderWidth: 1, borderStyle: "solid", borderColor: "#DDDDDD", color: "black", fontWeight: "bold" }}
                              >
                                {total}
                              </td>
                            )
                          })
                        }
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </TabPane>
            <TabPane className="ft-detail" tabId="charges" role="tabpane4">

            </TabPane>
          </TabContent>
        </CardBody>
      </Card>
    </ContentWrapper >
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