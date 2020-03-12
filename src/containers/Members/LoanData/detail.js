import React, { useEffect, useState } from 'react'
import { Link, withRouter } from 'react-router-dom'
import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane
} from 'reactstrap'
import { withTranslation, Trans } from 'react-i18next'
import { Table } from 'antd'
import 'antd/dist/antd.css'
import { Formik } from 'formik'
import { useDropzone } from 'react-dropzone'
import Modal from 'react-modal'

import PropTypes from 'prop-types'
import * as actions from '../../../store/actions/actions'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import ContentWrapper from '../../../components/Layout/ContentWrapper'
import Swal from '../../../components/Common/Swal'
import Documents from '../../../components/Simpool/Documents'

import MONTHS_ID from '../../../constants/MONTHS_ID'

import numToMoney from '../../../functions/numToMoney'

const DragDrop = props => {
  const { setFieldValue } = props
  const MAX_SIZE = 1048576

  const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
    useDropzone({
      multiple: false,
      maxSize: MAX_SIZE,
      onDrop: acceptedFiles => {
        props.setDocUpload(acceptedFiles[0])
        setFieldValue("docUpload", acceptedFiles[0])

        acceptedFiles.map(file =>
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
      },
      onDropRejected: rejectedFiles => {
        if (rejectedFiles[0].size > MAX_SIZE) {
          document.getElementById("dragReject").click()
        }
      }
    })

  const img = {
    width: "50%",
    height: "50%"
  }

  const dragReject = {
    title: "File size's must be under 1 MB"
  }

  const files = acceptedFiles.map(file => {
    if (file.preview != null) {
      return (
        <div key={"File " + file.path} className="center-parent mt-1">
          <h5>
            {file.path} - {file.size} bytes
          </h5>
          <img src={file.preview} style={img} alt="File Preview" />
        </div>
      )
    } else {
      return (
        <div key={"File " + file.path} className="center-parent mt-1">
          <h4>File's preview is being uploaded..</h4>
          <em className="fas fa-circle-notch fa-spin fa-2x text-muted" />
        </div>
      )
    }
  })

  return (
    <div className="container--md mt-3">
      <Swal options={dragReject} id="dragReject" />
      <section>
        <div {...getRootProps({ className: 'dropzone' })}>
          <input name={props.name} {...getInputProps()} />
          <p className="text-center box-placeholder-upload m-0 ft-detail">
            {!isDragActive && "Drag 'n' drop some files here, or click to select files"}
            {isDragActive && "Drop Here!"}
          </p>
          <aside>
            {files}
          </aside>
        </div>
      </section>
    </div>
  );
}

const LoansDataDetail = props => {
  const [activeTab, setActiveTab] = useState("detail")
  const [loans, setLoans] = useState({})
  const [loanId] = useState(props.match.params.id)
  const [loansDocuments, setLoansDocuments] = useState([])
  const [loansNotes, setLoansNotes] = useState([])
  const [noteValue, setNoteValue] = useState("")

  // Modal Upload 
  const [isModalUploadDoc, setIsModalUploadDoc] = useState(false)
  const [docDesc, setDocDesc] = useState("")
  const [docName, setDocName] = useState("")
  const [docUpload, setDocUpload] = useState(null)

  const uploadDoc = () => {
    const uploadDocRes = () => {
      setIsModalUploadDoc(false)

      props.actions.loansDocuments(loanId, setLoansDocuments)
    }

    if (docUpload && docName) {
      const docUploadFD = new FormData()

      docUploadFD.append(
        "name",
        docName
      )

      if (docDesc) {
        docUploadFD.append(
          "description",
          docDesc
        )
      }

      docUploadFD.append(
        "file",
        docUpload
      )

      props.actions.postLoansDocuments(docUploadFD, { loanId }, uploadDocRes)
    }
  }

  // End Modal Upload

  // Detail
  const transactionsColumn = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: {
        compare: (a, b) => a.id - b.id
      }
    },
    {
      title: "Office",
      dataIndex: "office",
      key: "office",
      sorter: {
        compare: (a, b) => a.office.length - b.office.length
      }
    },
    {
      title: "Transaction Date",
      dataIndex: "trxDate",
      key: "trxDate",
      sorter: {
        compare: (a, b) => a.trxDate.length - b.trxDate.length
      }
    },
    {
      title: "Transaction Type",
      dataIndex: "trxType",
      key: "trxType",
      sorter: {
        compare: (a, b) => a.trxType.length - b.trxType.length
      }
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      sorter: {
        compare: (a, b) => a.amount.length - b.amount.length
      }
    },
    {
      title: "Break Down",
      children: [
        {
          title: "Principal",
          dataIndex: "principal",
          key: "principal",
          sorter: {
            compare: (a, b) => a.principal.length - b.principal.length
          }
        },
        {
          title: "Interest",
          dataIndex: "interest",
          key: "interest",
          sorter: {
            compare: (a, b) => a.interest.length - b.interest.length
          }
        },
        {
          title: "Fees",
          dataIndex: "fees",
          key: "fees",
          sorter: {
            compare: (a, b) => a.fees.length - b.fees.length
          }
        },
        {
          title: "Penalties",
          dataIndex: "penalties",
          key: "penalties",
          sorter: {
            compare: (a, b) => a.penalties.length - b.penalties.length
          }
        },
      ]
    },
    {
      title: "Loan Balance",
      dataIndex: "loanBalance",
      key: "loanBalance",
      sorter: {
        compare: (a, b) => a.loanBalance.length - b.loanBalance.length
      }
    },
  ]
  const [transactionsData, setTransactionsData] = useState([])

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
    loans?.transactionProcessingStrategyName ?? "",
    loans?.numberOfRepayments && loans?.repaymentEvery && repaymentFrequencyType
      ? loans.numberOfRepayments + " every "
      + loans.repaymentEvery
      + " "
      + repaymentFrequencyType
      + " on"
      : "",
    loans && loans.amortizationType && loans.amortizationType.value
      ? loans.amortizationType.value
      : "",
    loans?.annualInterestRate ? loans.annualInterestRate : 0 + " per annum ("
      + loans?.annualInterestRate ? loans.annualInterestRate : 0 + "% Per year) - "
      + interestType ?? "flat",
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

  const deleteLoanDoc = docId => {
    const deleteLoanDocRes = () => {
      props.actions.loansDocuments(loanId, setLoansDocuments)
    }

    props.actions.deleteLoanDoc(
      {
        loanId: loanId,
        docId: docId
      },
      deleteLoanDocRes
    )
  }

  const setNoteValueRes = () => {
    props.actions.loansNotes(loanId, setLoansNotes)
  }

  useEffect(() => {
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

        if (
          loans && loans.transactions
          && loans.transactions.length > 0
        ) {
          let transactions = []

          loans.transactions.map((trx, key) => {
            transactions.push({
              key: key,
              id: trx && trx.id
                ? trx.id
                : "",
              office: trx && trx.officeName
                ? trx.officeName
                : "",
              trxDate: trx && trx.date
                && Array.isArray(trx.date)
                && trx.date.length > 0
                ? trx.date[2] + " " + MONTHS_ID[trx.date[1] - 1] + " " + trx.date[0]
                : "",
              trxType: trx && trx.type && trx.type.value
                ? trx.type.value
                : "",
              amount: trx && trx.amount
                ? numToMoney(trx.amount)
                : "0",
              principal: trx && trx.principalPortion
                ? numToMoney(trx.principalPortion)
                : "0",
              interest: trx && trx.interestPortion
                ? numToMoney(trx.interestPortion)
                : "0",
              fees: trx && trx.feeChargesPortion
                ? numToMoney(trx.feeChargesPortion)
                : "0",
              penalties: trx && trx.penaltyChargesPortion
                ? numToMoney(trx.penaltyChargesPortion)
                : "0",
              loanBalance: trx && trx.outstandingLoanBalance
                ? numToMoney(trx.outstandingLoanBalance)
                : "0"
            })

            return null
          })

          setTransactionsData(transactions)
        }


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

          return null
        })
      }
    }
    props.actions.loans(loanId, setLoansRes)

    props.actions.loansDocuments(loanId, setLoansDocuments)

    props.actions.loansNotes(loanId, setLoansNotes)

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
                          ? numToMoney(loans.proposedPrincipal)
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
                && Array.isArray(loans.transactions)
                && loans.transactions.length > 0
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
            <NavItem className="nav-tab">
              <NavLink className={activeTab === 'loanDocuments' ? 'active' : ''}
                onClick={() => { setActiveTab('loanDocuments'); }}
              >
                Loan Documents
            </NavLink>
            </NavItem>
            <NavItem className="nav-tab">
              <NavLink className={activeTab === 'notes' ? 'active' : ''}
                onClick={() => { setActiveTab('notes'); }}
              >
                Notes
            </NavLink>
            </NavItem>
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
                            <tr
                              key={"headRow " + keyRow}
                              className={
                                keyRow === 0
                                  ? "center-parent"
                                  : null
                              }
                            >
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
            <TabPane className="ft-detail" tabId="transactions" role="tabpane4">
              <div className="table-responsive my-3">
                <Table
                  dataSource={transactionsData}
                  pagination={false}
                  bordered={true}
                  columns={transactionsColumn}
                />
              </div>
            </TabPane>
            <TabPane className="ft-detail" tabId="loanDocuments" role="tabpane5">
              <div className="container-fluid ft-detail">
                <Modal
                  isOpen={isModalUploadDoc}
                  onRequestClose={() => setIsModalUploadDoc(false)}
                  ariaHideApp={false}
                >
                  <div className="container-fluid">
                    <div className="row">
                      <Button outline className="col-4 col-lg-2" color="primary"
                        onClick={() => setIsModalUploadDoc(false)}
                      >
                        Batalkan
                      </Button>
                    </div>

                    <div className="row d-flex justify-content-center">
                      <div className="col-md-6 center-parent form-font-size">
                        <Formik
                          initialValues={{
                            docDesc,
                            docName,
                            docUpload
                          }}
                          validate={values => {
                            const errors = {};

                            if (!values.docName) {
                              errors.docName = <Trans i18nKey='forms.REQUIRED'>Form is required!</Trans>
                            }

                            if (!values.docUpload) {
                              errors.docUpload = <Trans i18nKey='forms.REQUIRED'>Form is required!</Trans>
                            }

                            if (values.docDesc) {
                              setDocDesc(values.docDesc)
                            }
                            if (values.docName) {
                              setDocName(values.docName)
                            }

                            return errors;
                          }}
                          onSubmit={() => {
                            uploadDoc()
                          }}
                        >
                          {({
                            values,
                            errors,
                            touched,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            setFieldValue
                          }) => (
                              <form onSubmit={handleSubmit}>
                                <FormGroup>
                                  <label htmlFor="docName">Name <span className="red"> *</span></label>
                                  <input
                                    id="docName"
                                    className={
                                      errors.docName && touched.docName
                                        ? "form-control mr-3 input-error"
                                        : "form-control mr-3"
                                    }
                                    type="text"
                                    placeholder="Enter document's name"
                                    value={values.docName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  />
                                  <div className="input-feedback center-parent mt-0">{touched.docName && errors.docName}</div>
                                </FormGroup>

                                <FormGroup>
                                  <label htmlFor="docDesc">Description</label>
                                  <textarea
                                    id="docDesc"
                                    rows="4"
                                    className="form-control mr-3"
                                    type="text"
                                    placeholder="Enter descriptions"
                                    value={values.docDesc}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  />
                                </FormGroup>

                                <div className="row d-flex justify-content-center mt-5">
                                  <h1>Upload File <span className="red"> *</span></h1>
                                </div>

                                <DragDrop setDocUpload={setDocUpload} setFieldValue={setFieldValue} />
                                <div className="input-feedback center-parent mt-0">{touched.docUpload && errors.docUpload}</div>

                                <div className="row">
                                  <Button outline className="col-12 mt-3" color="primary" type="submit">
                                    Upload Dokumen
                                  </Button>
                                </div>
                              </form>
                            )}
                        </Formik>
                      </div>
                    </div>
                  </div>
                </Modal>

                <div className="row justify-content-end mr-1 mt-3">
                  <Button outline color="primary" onClick={() => setIsModalUploadDoc(true)}>Tambah Dokumen</Button>
                </div>
                {
                  loans
                    && Array.isArray(loansDocuments)
                    && loansDocuments.length > 0
                    ? (
                      <div className="my-3">
                        <Documents documents={loansDocuments} actions={props.actions} deleteDoc={deleteLoanDoc} docType="loan" />
                      </div>
                    )
                    : (
                      <div className="row justify-content-center">
                        <span>Tidak ada dokumen pinjaman</span>
                      </div>
                    )
                }
              </div>
            </TabPane>
            <TabPane className="ft-detail" tabId="notes" role="tabpane6">
              <div className="col-12 my-3">
                <Formik
                  initialValues={{
                    note: noteValue
                  }}
                  validate={values => {
                    const errors = {};

                    if (values.note > 1000) {
                      errors.note = "Catatan harus kurang dari 1000 huruf"
                    }

                    if (values.note) {
                      setNoteValue(values.note)
                    }

                    return errors;
                  }}
                  onSubmit={() => {
                    console.log(noteValue)
                    if (noteValue) {
                      props.actions.postLoansNotes({loanId: loanId, note: noteValue}, setNoteValueRes)
                    }
                  }}
                >
                  {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit
                  }) => (
                      <form onSubmit={handleSubmit}>
                        <textarea
                          id="note"
                          rows="4"
                          className={errors.note && touched.note ? "input-error" : null}
                          style={{ width: "100%" }}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <div className="input-feedback center-parent">{errors.note && touched.note}</div>

                        <div className="row justify-content-end mr-1 mt-2 mb-3">
                          <Button color="primary" type="submit">Tambah Catatan</Button>
                        </div>
                      </form>
                    )}
                </Formik>
                {/* max length line 80 */}
                {/* max length 1000 */}
                {
                  loansNotes
                    ? loansNotes.map((note, key) => (
                      <div
                        className="mb-3 ft-detail"
                        key={"Note " + key}
                        style={{
                          padding: 20,
                          borderWidth: 0,
                          borderLeftWidth: 3,
                          borderStyle: "solid",
                          borderColor: "#189AD3",
                          backgroundColor: "#F2F2F2",
                          borderRadius: 8
                        }}
                      >
                        <div>
                          <span
                            style={{
                              fontWeight: "bold"
                            }}
                          >
                            {note.id}
                          </span>
                        </div>
                        <div>
                          <span>
                            <em className="fa fa-user" style={{ color: "#189AD3" }} />&ensp; {note.createdByUsername}
                          </span>
                          <em>&emsp;</em>
                          <span>
                            <em className="fa fa-clock" style={{ color: "#189AD3" }} />&ensp; {note.createdOn}
                          </span>
                        </div>
                        <div className="mt-2">
                          <div style={note.note.length >= 167 ? { textIndent: "20px" } : null}>{note.note}</div>
                        </div>
                      </div>
                    ))
                    : null
                }
              </div>
            </TabPane>
          </TabContent>
        </CardBody>
      </Card>
    </ContentWrapper >
  )
}

LoansDataDetail.propTypes = {
  actions: PropTypes.object,
  settings: PropTypes.object
}

const mapStateToProps = state => ({
  settings: state.settings
})
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) })

export default compose(connect(mapStateToProps, mapDispatchToProps), withTranslation('translations'))(withRouter(LoansDataDetail))