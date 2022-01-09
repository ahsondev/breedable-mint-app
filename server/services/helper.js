const config = require('../config')
const CryptoJS = require('crypto-js')
const axios = require('axios')
const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256')

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

const getUTCSeconds = () => {
  let date = new Date()
  // try {
  //   // const {data} = await axios.get('https://worldtimeapi.org/api/timezone/gmt')
  //   // date = new Date(data.utc_datetime)
  // } catch (e) {
  // }
  return Math.floor(date.getTime() / 1000)
}

function getMerkleData(address, arr) {
  const leaves = arr.map((v) => keccak256(v.toLowerCase()))
  const tree = new MerkleTree(leaves, keccak256, { sort: true })
  const root = tree.getHexRoot()
  const leaf = keccak256(address.toLowerCase())
  const proof = tree.getHexProof(leaf)
  const verified = tree.verify(proof, leaf, root)
  return { proof, leaf, verified, address }
}

function getMerkleRoot(arr) {
  const leaves = arr.map((v) => keccak256(v.toLowerCase()))
  const tree = new MerkleTree(leaves, keccak256, { sort: true })
  return tree.getHexRoot()
}

module.exports = {
  encrypt,
  decrypt,
  getUTCSeconds,
  round,
  getMerkleData,
  getMerkleRoot,
}
