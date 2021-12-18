const config = require('../config')
const CryptoJS = require('crypto-js')

const encrypt = (data) =>
  CryptoJS.AES.encrypt(JSON.stringify(data), config.REACT_APP_CRYPTO_KEY || '1234567890').toString()

const decrypt = (ciphertext) => {
  console.log("key: ", config.REACT_APP_CRYPTO_KEY)
  const bytes = CryptoJS.AES.decrypt(ciphertext, config.REACT_APP_CRYPTO_KEY || '1234567890')
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
}

const round = (v, digits) => {
  let factorial = 1;
  for (let i = 0; i < digits; i += 1) {
    factorial *= 10
  }
  return Math.round(v * factorial) / factorial
}

const getUTCSeconds = () => {
  const utcMilliseconds = new Date(
    Date.now() + new Date().getTimezoneOffset() * 60000
  ).getTime() / 1000
  return Math.round(utcMilliseconds)
}

module.exports = {
  encrypt,
  decrypt,
  getUTCSeconds,
  round
}
