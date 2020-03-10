export const ACCOUNT_CHARGE = 'ACCOUNT_CHARGE'
export const ACCOUNT_TRANSACTION = 'ACCOUNT_TRANSACTION'
export const UNDO_ACCOUNT_TRANSACTION = 'UNDO_ACCOUNT_TRANSACTION'
export const ACCOUNT_TRANSFER = 'ACCOUNT_TRANSFER'
export const QR_CODE = 'QR_CODE'
export const SAVINGS_ACCOUNT_ASSOSIATIONS = 'SAVINGS_ACCOUNT_ASSOSIATIONS'

// Detail
export function accountCharge(payload, setAccountCharge) {
  return { type: ACCOUNT_CHARGE, payload, setAccountCharge }
}

export function accountTransaction(payload, setAccountTransaction) {
  return { type: ACCOUNT_TRANSACTION, payload, setAccountTransaction }
}

export function accountTransfer(payload, setAccountTransfer) {
  return { type: ACCOUNT_TRANSFER, payload, setAccountTransfer }
}

export function qrCode(payload, setQrCode) {
  return { type: QR_CODE, payload, setQrCode }
}

export function savingsAccountAssosiations(payload, setSavingsAssosiations) {
  return { type: SAVINGS_ACCOUNT_ASSOSIATIONS, payload, setSavingsAssosiations }
}

export function undoAccountTransaction(payload, undoAccountTransaction) {
  return { type: UNDO_ACCOUNT_TRANSACTION, payload, undoAccountTransaction }
}