const db = require('../models')
const Setting = db.Setting
const {getUTCSeconds, getMerkleData} = require('../services/helper')
const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256')

async function getSignRoot(req, res) {
  try {
    const signAddresses = (await db.SignAddress.findAll()).map(v => v.get({plane: true}).address)
    const leaves = signAddresses.map(v => keccak256(v))
    const tree = new MerkleTree(leaves, keccak256, { sort: true })
    const root = tree.getHexRoot()
    res.json({root})
  } catch (e) {
    console.log(e)
    res.status(500).json({ msg: 'Server Error' })
  }
}

async function getWhitelistRoot(req, res) {
  try {
    if (!req.body.step) {
      res.status(500).json({ msg: 'Parameter Error' })
      return
    }

    const whiteLists = (await db.WhiteList.findAll({ where: {step: req.body.step} })).map(v => v.get({plane: true}).address)
    const leaves = whiteLists.map(v => keccak256(v))
    const tree = new MerkleTree(leaves, keccak256, { sort: true })
    const root = tree.getHexRoot()
    res.json({root})
  } catch (e) {
    console.log(e)
    res.status(500).json({ msg: 'Server Error' })
  }
}

async function setStarttime(req, res) {
  try {
    const rows = await Setting.findAll({ where: { key: 'starttime' }})
    const starttime = await getUTCSeconds()
    if (rows.length === 0) {
      await Setting.create({ key: 'starttime', value: starttime })
    } else {
      await Setting.update(
        { value: starttime },
        { where: { key: 'starttime' } }
      )
    }
    res.json({ msg: 'success' })
  } catch (e) {
    console.log(e)
    res.status(500).json({ msg: 'Server Error' })
  }
}

async function getProof(req, res) {
  try {
    const recs = await db.connectionSeq.query("SELECT * FROM `sign_addresses` WHERE `used`!='1' ORDER BY `id` LIMIT 1")
    if (!recs.length) {
      res.status(500).json({ msg: 'No more available users' })
      return
    }

    await db.connectionSeq.query("UPDATE `sign_addresses` SET `used`='1' WHERE `id`='" + recs[0].id + "'")

    const rows = (await db.SignAddress.findAll({ where: { used: 1 }})).map(v => v.get({plane: true}).address)
    const ret = getMerkleData(recs[0].address, rows)
    res.json({
      proof: ret.proof,
      leaf: recs[0].address
    })
  } catch (e) {
    console.log(e)
    res.status(500).json({ msg: 'Server Error' })
  }
}

module.exports = {
  getSignRoot,
  getWhitelistRoot,
  setStarttime,
  getProof,
}
