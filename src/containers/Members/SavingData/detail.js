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
import Swal from '../../../components/Common/Swal'

const SavingDataDetail = props => {
  const [activeTab, setActiveTab] = useState("summary")
  const [savingsAssosiations, setSavingsAssosiations] = useState({})
  const [savingsId] = useState(props.match.params.id)
  const [modalQr, setModalQr] = useState(false)
  const [qrCode, setQrCode] = useState(null)
  const [modalTransactions, setModalTransactions] = useState(false)
  const [isAccountTransaction, setIsAccountTransaction] = useState(false)
  const [isAccountTransfer, setIsAccountTransfer] = useState(false)
  const [isReversal, setIsReversal] = useState(false)
  const [accountId, setAccountId] = useState(null)
  const [trxId, setTrxId] = useState(null)

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
  if (savingsAssosiations && savingsAssosiations.clientId) {
    clientId = savingsAssosiations.clientId
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

  const transactionsHead = [
    "ID",
    "Transaction Date",
    "Transaction Type",
    "Debit",
    "Credit",
    "Balance",
    "View Receipt"
  ]
  const [transactions, setTransactions] = useState([])

  const [accountTransaction, setAccountTransaction] = useState({})
  const setAccountTransactionRes = res => {
    setAccountTransaction(res)
    setIsAccountTransaction(true)
  }

  const [accountTransfer, setAccountTransfer] = useState({})
  const setAccountTransferRes = res => {
    setAccountTransfer(res)
    setIsAccountTransfer(true)
  }

  const taxTransactionsHead = [
    "ID",
    "Transaction Date",
    "Amount",
    "View Withholding Tax Slip"
  ]
  const [taxTransactions, setTaxTransactions] = useState([])

  useEffect(() => {
    const setSavingsAssosiationsRes = res => {
      setSavingsAssosiations(res)
      props.actions.qrCode(res.accountNo, setQrCode)

      res.transactions.map(transaction => {
        if (!transaction.reversed) {
          setTransactions(prevArray => [
            ...prevArray,
            {
              id: transaction.id,
              date: transaction.date,
              transactionType: transaction.transactionType,
              coreTransactionCode: transaction.coreTransactionCode,
              runningBalance: transaction.runningBalance,
              debit: transaction.transactionType.code === "savingsAccountTransactionType.withdrawal"
                || transaction.transactionType.code === "savingsAccountTransactionType.feeDeduction"
                || transaction.transactionType.code === "savingsAccountTransactionType.overdraftInterest"
                || transaction.transactionType.code === "savingsAccountTransactionType.withholdTax"
                ? numToMoney(transaction.amount)
                : "-",
              credit: transaction.transactionType.code !== "savingsAccountTransactionType.withdrawal"
                && transaction.transactionType.code !== "savingsAccountTransactionType.feeDeduction"
                && transaction.transactionType.code !== "savingsAccountTransactionType.overdraftInterest"
                && transaction.transactionType.code !== "savingsAccountTransactionType.withholdTax"
                ? numToMoney(transaction.amount)
                : "-",
              transfer: transaction.transfer,
              accountId: transaction.accountId
            }
          ])
        }

        return null
      })
    }

    props.actions.savingsAccountAssosiations(savingsId, setSavingsAssosiationsRes)

    Modal.setAppElement('body')

    return () => { }
  }, [props.actions, savingsId])

  const [colIndex, setColIndex] = useState([])

  useEffect(() => {
    if (savingsAssosiations
      && savingsAssosiations.status
      && savingsAssosiations.status.id
      && savingsAssosiations.status.id !== 600) {
      setColIndex([
        savingsAssosiations
          && savingsAssosiations.summary
          && savingsAssosiations.summary.totalDeposits
          ? numToMoney(savingsAssosiations.summary.totalDeposits)
          : "-",
        savingsAssosiations
          && savingsAssosiations.summary
          && savingsAssosiations.summary.totalWithdrawals
          ? numToMoney(savingsAssosiations.summary.totalWithdrawals)
          : "-",
        savingsAssosiations
          && savingsAssosiations.summary
          && savingsAssosiations.summary.totalInterestEarned
          ? numToMoney(savingsAssosiations.summary.totalInterestEarned)
          : "-",
        savingsAssosiations
          && savingsAssosiations.summary
          && savingsAssosiations.summary.totalInterestPosted
          ? numToMoney(savingsAssosiations.summary.totalInterestPosted)
          : "-"
      ])
    }

    return () => { };
  }, [savingsAssosiations])

  const undoAccountTransaction = res => {
    console.log(res)
    window.location.reload()
  }

  const reversalTransaction = {
    title: 'Are you sure?',
    text: 'Do you want to reverse this transaction?',
    icon: 'warning',
    buttons: {
      cancel: {
        text: 'No, I want to cancel it!',
        value: null,
        visible: true,
        className: "",
        closeModal: false
      },
      confirm: {
        text: 'Yes, reverse it!',
        value: true,
        visible: true,
        className: "bg-danger",
        closeModal: false
      }
    }
  }
  const reversalTransactionCallback = (isConfirm, swal) => {
    if (isConfirm) {
      swal("Deleted!", "Your transaction has been reversed.", "success")
      props.actions.undoAccountTransaction({accountId: accountId, trxId: trxId}, undoAccountTransaction)
    } else {
      swal("Cancelled", "Your transaction is safe :)", "error");
    }
  }

  return (
    <ContentWrapper>
      <Swal options={reversalTransaction} id="reversalTransaction" callback={reversalTransactionCallback}/>
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
                  savingsAssosiations
                    && savingsAssosiations.savingsProductName
                    ? savingsAssosiations.savingsProductName
                    : "-"
                }
              </h1>
              <h3
                style={{ marginBottom: 0 }}
              >
                {
                  savingsAssosiations
                    && savingsAssosiations.accountNo
                    ? savingsAssosiations.accountNo
                    : "-"
                }
              </h3>
            </div>
            {
              qrCode
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


      <Modal
        style={{
          content: {
            width: "50%",
            left: "25%"
          }
        }}
        isOpen={modalTransactions}
        onRequestClose={() => {
          setModalTransactions(false)
          setIsAccountTransaction(false)
          setIsAccountTransfer(false)
          setIsReversal(false)
        }}
      >
        <div className="container-fluid">
          {
            isReversal
              ? (
                <div className="row justify-content-between">
                  <Button
                    outline
                    color="primary"
                    onClick={() => {
                      setModalTransactions(false)
                      setIsAccountTransaction(false)
                      setIsAccountTransfer(false)
                      setIsReversal(false)
                    }}
                  >
                    Tutup
                  </Button>
                  <Button color="danger" onClick={() => document.getElementById("reversalTransaction").click()}>
                    <em className="fa fa-undo-alt" />
                    <span>&ensp; Reversal Transaction</span>
                  </Button>
                </div>
              )
              : (
                <Button
                  outline
                  color="primary"
                  onClick={() => {
                    setModalTransactions(false)
                    setIsAccountTransaction(false)
                    setIsAccountTransfer(false)
                    setIsReversal(false)
                  }}
                >
                  Tutup
              </Button>
              )
          }
          {
            isAccountTransfer
              ? (
                <div className="ft-detail">
                  {
                    console.log(accountTransfer)
                  }
                  <div className="center-parent">
                    <h1>Transfer Details</h1>
                  </div>

                  <div className="row justify-content-center mt-3">
                    <div className="col-4 mr-2">
                      <div><span>Transaction Amount</span></div>
                      <div><span>Transaction Date</span></div>
                      <div><span>Description</span></div>
                    </div>
                    <div className="col-4">
                      <div>
                        <strong>
                          {accountTransfer.transferAmount ? numToMoney(accountTransfer.transferAmount) : "-"}
                        </strong>
                      </div>
                      <div>
                        <strong>
                          {
                            Array.isArray(accountTransfer.transferDate) && accountTransfer.transferDate.length > 0
                              ? accountTransfer.transferDate[2] + " " + MONTHS_ID[accountTransfer.transferDate[1] - 1] + " " + accountTransfer.transferDate[0]
                              : "-"
                          }
                        </strong>
                      </div>
                      <div>
                        <strong>
                          {accountTransfer.transferDescription ? accountTransfer.transferDescription : "-"}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="row justify-content-center mt-5">
                    <div className="col-3 mr-2 list-header">
                      <div><span>Fields</span></div>
                      <div><span>Office</span></div>
                      <div><span>Client</span></div>
                      <div><span>Account Type</span></div>
                      <div><span>Account Id</span></div>
                    </div>
                    <div className="col-3 mr-2 list-detail">
                      <div><strong>From</strong></div>
                      <div><span>{accountTransfer.fromOffice.name}</span></div>
                      <div><span>{accountTransfer.fromClient.displayName}</span></div>
                      <div><span>{accountTransfer.fromAccountType.value}</span></div>
                      <div><span>{accountTransfer.fromAccount.accountNo}</span></div>
                    </div>
                    <div className="col-3 list-detail">
                      <div><strong>To</strong></div>
                      <div><span>{accountTransfer.toOffice.name}</span></div>
                      <div><span>{accountTransfer.toClient.displayName}</span></div>
                      <div><span>{accountTransfer.toAccountType.value}</span></div>
                      <div><span>{accountTransfer.toAccount.accountNo}</span></div>
                    </div>
                  </div>
                </div>
              )
              : null
          }
          {
            isAccountTransaction
              ? (
                <div className="ft-detail">
                  <div className="center-parent">
                    <div><h1>Transaction Detail</h1></div>
                    <div><h3>{accountTransaction.id}</h3></div>
                  </div>

                  <div className="row justify-content-center mt-5">
                    <div className="col-4">
                      <div><span>Type</span></div>
                      <div><span>Transaction Date</span></div>
                      <div><span>Currency</span></div>
                      <div><span>Amount</span></div>
                    </div>
                    <div className="col-4">
                      <div><strong>{accountTransaction.transactionType.value}</strong></div>
                      <div>
                        <strong>
                          {
                            Array.isArray(accountTransaction.date) && accountTransaction.date.length > 0
                              ? accountTransaction.date[2] + " " + MONTHS_ID[accountTransaction.date[1] - 1] + " " + accountTransaction.date[0]
                              : "-"
                          }
                        </strong>
                      </div>
                      <div><strong>{accountTransaction.currency.name}</strong></div>
                        <div><strong>{numToMoney(accountTransaction.amount)}</strong></div>
                    </div>
                  </div>
                </div>
              )
              : null
          }
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
                savingsAssosiations
                  && savingsAssosiations.savingsProductName
                  ? savingsAssosiations.savingsProductName + " "
                  : "-"
              }
              {
                savingsAssosiations
                  && savingsAssosiations.status
                  && savingsAssosiations.status.id
                  ? savingsAssosiations.status.id === 600
                    ? (<span className="ml-auto circle circle-lg mb-3" style={{ backgroundColor: "gray" }} />)
                    : savingsAssosiations.status.id === 300
                      ? (<span className="ml-auto circle bg-success circle-lg mb-3" />)
                      : savingsAssosiations.status.id === 200
                        ? (<span className="ml-auto circle bg-warning circle-lg mb-3" />)
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
                savingsAssosiations
                  && savingsAssosiations.accountNo
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
              <tbody>
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
                        savingsAssosiations
                          && savingsAssosiations.timeline
                          && savingsAssosiations.timeline.activatedOnDate
                          ? Array.isArray(savingsAssosiations.timeline.activatedOnDate) && savingsAssosiations.timeline.activatedOnDate.length > 0
                            ? savingsAssosiations.timeline.activatedOnDate[2] + " " + MONTHS_ID[savingsAssosiations.timeline.activatedOnDate[1] - 1] + " " + savingsAssosiations.timeline.activatedOnDate[0]
                            : "-"
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
                        savingsAssosiations
                          && savingsAssosiations.currency
                          && savingsAssosiations.currency.name
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
                        savingsAssosiations
                          && savingsAssosiations.externalId
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
                        savingsAssosiations
                          && savingsAssosiations.passbook
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
                        savingsAssosiations
                          && savingsAssosiations.isIntermediateAccount
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
                        savingsAssosiations
                          && savingsAssosiations.displayName
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
                        savingsAssosiations
                          && savingsAssosiations.passbookNumber
                          ? savingsAssosiations.passbookNumber
                          : "-"
                      }
                    </strong>
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="col-1" />

            <table
              className="table col-md-5 col-lg-4 ft-detail mt-5 mx-2"
            >
              <tbody>
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
                        savingsAssosiations
                          && savingsAssosiations.fieldOfficerName
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
                      savingsAssosiations
                        && savingsAssosiations.summary
                        && savingsAssosiations.summary.accountBalance
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
                        savingsAssosiations
                          && savingsAssosiations.availableBalance
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
                        savingsAssosiations
                          && savingsAssosiations.openReason
                          && savingsAssosiations.openReason.description
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
                        savingsAssosiations
                          && savingsAssosiations.transactionRestriction
                          && savingsAssosiations.transactionRestriction.name
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
                        savingsAssosiations
                          && savingsAssosiations.officeData
                          && savingsAssosiations.officeData.name
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
              </tbody>
            </table>
          </div>

          <Nav tabs justified className="mt-5">
            {
              savingsAssosiations
                && savingsAssosiations.summary
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
              savingsAssosiations
                && savingsAssosiations.transactions
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
              savingsAssosiations
                && savingsAssosiations.taxTransactions
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
              savingsAssosiations
                && savingsAssosiations.charges
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
                  <tbody>
                    {
                      colIndex[0]
                        ? (
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
                                  colIndex[0]
                                }
                              </strong>
                            </td>
                          </tr>
                        )
                        : null
                    }
                    {
                      colIndex[1]
                        ? (
                          <tr>
                            <td
                              style={leftCol}
                            >
                              <span>Total Withdrawal</span>
                            </td>
                            <td
                              style={rightCol}
                            >
                              <strong>
                                {
                                  colIndex[1]
                                }
                              </strong>
                            </td>
                          </tr>
                        )
                        : null
                    }
                    {
                      colIndex[2]
                        ? (
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
                                  colIndex[2]
                                }
                              </strong>
                            </td>
                          </tr>
                        )
                        : null
                    }
                    {
                      colIndex[3]
                        ? (
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
                                  colIndex[3]
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
                        <span>Normal interest rate</span>
                      </td>
                      <td
                        style={rightCol}
                      >
                        <strong>
                          {
                            savingsAssosiations
                              && savingsAssosiations.nominalAnnualInterestRate
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
                            savingsAssosiations
                              && savingsAssosiations.interestCompoundingPeriodType
                              && savingsAssosiations.interestCompoundingPeriodType.value
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
                            savingsAssosiations
                              && savingsAssosiations.interestPostingPeriodType
                              && savingsAssosiations.interestPostingPeriodType.value
                              ? savingsAssosiations.interestPostingPeriodType.value
                              : "-"
                          }
                        </strong>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="col-1" />

                <table
                  className="table col-lg-5 ft-detail mx-2"
                  style={{ borderWidth: 2, borderColor: "#DDDDDD", borderStyle: "solid" }}
                >
                  <tbody>
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
                            savingsAssosiations
                              && savingsAssosiations.interestCalculationType
                              && savingsAssosiations.interestCalculationType.value
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
                            savingsAssosiations
                              && savingsAssosiations.interestCalculationDaysInYearType
                              && savingsAssosiations.interestCalculationDaysInYearType.value
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
                            savingsAssosiations
                              && savingsAssosiations.summary
                              && savingsAssosiations.summary.totalFeeCharge
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
                            savingsAssosiations
                              && savingsAssosiations.lastActiveTransactionDate
                              ? Array.isArray(savingsAssosiations.lastActiveTransactionDate) && savingsAssosiations.lastActiveTransactionDate.length > 0
                                ? savingsAssosiations.lastActiveTransactionDate[2] + " " + MONTHS_ID[savingsAssosiations.lastActiveTransactionDate[1] - 1] + " " + savingsAssosiations.lastActiveTransactionDate[0]
                                : "-"
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
                            savingsAssosiations
                              && savingsAssosiations.minBalanceForInterestCalculation
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
                            savingsAssosiations
                              && savingsAssosiations.enforceMinRequiredBalance
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
                            savingsAssosiations
                              && savingsAssosiations.minRequiredBalance
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
                            savingsAssosiations
                              && savingsAssosiations.taxGroup
                              && savingsAssosiations.taxGroup.name
                              ? savingsAssosiations.taxGroup.name
                              : "-"
                          }
                        </strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

            </TabPane>
            <TabPane className="ft-detail" tabId="transactions" role="tabpane2">
              <div className="table-responsive mt-3 mb-3">
                <table
                  className="table"
                  style={{ borderWidth: 2, borderColor: "#DDDDDD", borderStyle: "solid" }}
                >
                  <thead style={{ borderWidth: 2, borderBottomWidth: 3, borderColor: "#DDDDDD", borderStyle: "solid" }}>
                    <tr>
                      {
                        transactionsHead.map(head => <th key={"head" + head} style={{ borderWidth: 1, borderColor: "#DDDDDD", borderStyle: "solid", color: "black", fontWeight: "bold" }}>{head}</th>)
                      }
                    </tr>
                  </thead>
                  <tbody>
                    {
                      transactions.map((transaction, key) => {
                        return (
                          <tr
                            key={"transaction" + key}
                            className="list-hover"
                            onClick={() => {
                              setModalTransactions(true)

                              if (transaction.transfer) {
                                props.actions.accountTransfer(transaction.transfer.id, setAccountTransferRes)
                              } else {
                                setAccountId(transaction.accountId)
                                setTrxId(transaction.id)
                                props.actions.accountTransaction(
                                  {
                                    accountId: transaction.accountId,
                                    trxId: transaction.id
                                  },
                                  setAccountTransactionRes
                                )

                                if (transaction.transactionType.id !== 3 && transaction.transactionType.id !== 17) {
                                  setIsReversal(true)
                                }
                              }
                            }}
                          >
                            <td style={{ borderWidth: 1, borderColor: "#DDDDDD", borderStyle: "solid" }}>{transaction.id}</td>
                            <td style={{ borderWidth: 1, borderColor: "#DDDDDD", borderStyle: "solid" }}>
                              {transaction.date[2] + " " + MONTHS_ID[transaction.date[1] - 1] + " " + transaction.date[0]}
                            </td>
                            <td style={{ borderWidth: 1, borderColor: "#DDDDDD", borderStyle: "solid" }}>
                              {
                                transaction.coreTransactionCode.description
                                  ? transaction.coreTransactionCode.description
                                  : transaction.transactionType.value
                              }
                            </td>
                            <td style={{ borderWidth: 1, borderColor: "#DDDDDD", borderStyle: "solid" }}>{transaction.debit}</td>
                            <td style={{ borderWidth: 1, borderColor: "#DDDDDD", borderStyle: "solid" }}>{transaction.credit}</td>
                            <td style={{ borderWidth: 1, borderColor: "#DDDDDD", borderStyle: "solid" }}>{numToMoney(transaction.runningBalance)}</td>
                            <td style={{ borderWidth: 1, borderColor: "#DDDDDD", borderStyle: "solid" }}><em className="fa fa-file-invoice-dollar" /></td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
              </div>
            </TabPane>
            <TabPane className="ft-detail" tabId="taxTransactions" role="tabpane3">
              <div className="table-responsive mt-3 mb-3">
                <table
                  className="table"
                  style={{ borderWidth: 2, borderColor: "#DDDDDD", borderStyle: "solid" }}
                >
                  <thead style={{ borderWidth: 2, borderBottomWidth: 3, borderColor: "#DDDDDD", borderStyle: "solid" }}>
                    <tr>
                      {
                        taxTransactionsHead.map(head => <th key={"head" + head} style={{ borderWidth: 1, borderColor: "#DDDDDD", borderStyle: "solid", color: "black", fontWeight: "bold" }}>{head}</th>)
                      }
                    </tr>
                  </thead>
                  <tbody>
                    {
                      transactions.map((transaction, key) => {
                        return (
                          <tr key={"transaction" + key}>
                            <td style={{ borderWidth: 1, borderColor: "#DDDDDD", borderStyle: "solid" }}>{transaction.id}</td>
                            <td style={{ borderWidth: 1, borderColor: "#DDDDDD", borderStyle: "solid" }}>
                              {transaction.date[2] + " " + MONTHS_ID[transaction.date[1] - 1] + " " + transaction.date[0]}
                            </td>
                            <td style={{ borderWidth: 1, borderColor: "#DDDDDD", borderStyle: "solid" }}>{numToMoney(transaction.runningBalance)}</td>
                            <td style={{ borderWidth: 1, borderColor: "#DDDDDD", borderStyle: "solid" }}><em className="fa fa-file-invoice-dollar" /></td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
              </div>
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