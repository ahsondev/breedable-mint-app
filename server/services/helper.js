const config = require('../config')
const CryptoJS = require('crypto-js')

const encrypt = (data) =>
  CryptoJS.AES.encrypt(JSON.stringify(data), config.REACT_APP_CRYPTO_KEY || '1234567890').toString()

const decrypt = (ciphertext) => {
  console.log("key: ", config.REACT_APP_CRYPTO_KEY)
  const bytes = CryptoJS.AES.decrypt(ciphertext, config.REACT_APP_CRYPTO_KEY || '1234567890')
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
}

module.exports = {
  encrypt,
  decrypt
}
