const { body: bodyCheck } = require('express-validator')
const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256')
const db = require('../models')
const WhiteList = db.WhiteList
const Setting = db.Setting
const {encrypt} = require('../services/helper')

const authCandidates = [
  '0xAB29482938383823838bcdd123',
  '0xAB98762938383823838bcdd123',
  '0xAB2948293838382383123ABFE1',
]

function getMerkleData(address, arr) {
  const leaves = arr.map((v) => keccak256(v))
  const tree = new MerkleTree(leaves, keccak256, { sort: true })
  const root = tree.getHexRoot()
  const leaf = keccak256(address)
  const proof = tree.getHexProof(leaf)
  const verified = tree.verify(proof, leaf, root)
  return { proof, leaf, verified, address }
}

async function authenticate(req, res, next) {
  const addressToken = (req.header('X-GOLDEN-TOKEN1') || "") + (req.header('X-GOLDEN-TOKEN2') || "")
  const address = req.body.address || req.query.address || req.param.address
  if (addressToken === encrypt(address)) {
    next()
    return
  }

  res.status(401).json({'msg': 'Authentication Error'})
}

async function mint(req, res) {
  try {
    const address = authCandidates[Math.floor(Math.random() * 1000) % authCandidates.length]
    const ret = getMerkleData(address, authCandidates)
    res.json(ret)
  } catch (e) {
    console.log(e)
    res.status(500).json({ msg: 'Server Error' })
  }
}

async function mintWhitelist(req, res) {
  try {
    await bodyCheck('address').notEmpty().run(req)
    const rows = await WhiteList.findAll()
    const ret = getMerkleData(
      req.body.address,
      rows.map((row) => row.dataValues.address)
    )
    res.json(ret)
  } catch (e) {
    console.log(e)
    res.status(500).json({ msg: 'Server Error' })
  }
}

async function isWhitelist(req, res) {
  try {
    const rows = await WhiteList.findAll()
    const ret = rows.map((row) => row.dataValues.address).findIndex(val => val.toLowerCase() === req.query.address.toLowerCase()) > -1
    res.json({ whitelist: ret })
  } catch (e) {
    console.log(e)
    res.status(500).json({ msg: 'Server Error' })
  }
}

async function setStarttime(req, res) {
  try {
    const rows = await Setting.findAll({ where: { key: 'starttime' }})
    if (rows.length === 0) {
      await Setting.create({ key: 'starttime', value: req.body.starttime })
    } else {
      await Setting.update(
        { value: req.body.starttime },
        { where: { key: 'starttime' } }
      )
    }
    res.json({ msg: 'success' })
  } catch (e) {
    console.log(e)
    res.status(500).json({ msg: 'Server Error' })
  }
}

async function getStarttime(req, res) {
  try {
    const setting = await Setting.findOne({
      where: { key: 'starttime' }
    })
    res.json({ starttime: setting.get({plane: true}).value })
  } catch (e) {
    console.log(e)
    res.status(500).json({ msg: 'Server Error' })
  }
}

async function upgradeNft(req, res) {
  try {
    const setting = await Setting.findOne({
      where: { key: 'starttime' }
    })
    res.json({ starttime: setting.get({plane: true}).value })
  } catch (e) {
    console.log(e)
    res.status(500).json({ msg: 'Server Error' })
  }
}

module.exports = {
  authenticate,
  mint,
  mintWhitelist,
  isWhitelist,
  setStarttime,
  getStarttime,
  upgradeNft
}
