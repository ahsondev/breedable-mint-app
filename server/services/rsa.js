const bigintCryptoUtils = require('bigint-crypto-utils')

const key = {
  n: 1129916252969939289857468463634939333n,
  e: 3n,
  d: 753277501979959525151106678337862579n,
}

function encryptNumberRsa(m) {
  return bigintCryptoUtils.modPow(m, key.d, key.n)
}

function decryptNumberRsa(c) {
  return bigintCryptoUtils.modPow(c, key.e, key.n)
}

module.exports = {
  encryptNumberRsa,
  decryptNumberRsa
}
