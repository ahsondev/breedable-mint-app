const config = require('../config')
const CryptoJS = require('crypto-js')
const axios = require('axios')

const encrypt = (data) =>
  CryptoJS.AES.encrypt(JSON.stringify(data), config.CRYPTO_KEY).toString()

const decrypt = (ciphertext) => {
  console.log("key: ", config.REACT_APP_CRYPTO_KEY)
  const bytes = CryptoJS.AES.decrypt(ciphertext, config.CRYPTO_KEY)
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
}

const round = (v, digits) => {
  let factorial = 1;
  for (let i = 0; i < digits; i += 1) {
    factorial *= 10
  }
  return Math.round(v * factorial) / factorial
}

const getUTCSeconds = async () => {
  let date = new Date()
  try {
    const {data} = await axios.get('http://worldtimeapi.org/api/timezone/gmt')
    date = new Date(data.utc_datetime)
  } catch (e) {
  }
  return Math.floor(date.getTime() / 1000)
}

module.exports = {
  encrypt,
  decrypt,
  getUTCSeconds,
  round
}
