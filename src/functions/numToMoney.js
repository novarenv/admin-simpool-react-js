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

export default numToMoney