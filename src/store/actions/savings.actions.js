export const SAVINGS_ACCOUNT_ASSOSIATIONS = 'SAVINGS_ACCOUNT_ASSOSIATIONS'
export const QR_CODE = 'QR_CODE'

// Detail
export function savingsAccountAssosiations(payload, setSavingsAssosiations) {
  return { type: SAVINGS_ACCOUNT_ASSOSIATIONS, payload, setSavingsAssosiations }
}

export function qrCode(payload, setQrCode) {
  return { type: QR_CODE, payload, setQrCode }
}