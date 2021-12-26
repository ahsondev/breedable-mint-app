const db = require('../models')
const Setting = db.Setting
const {encrypt, decrypt, getUTCSeconds} = require('../services/helper')
const {encryptNumberRsa} = require('../services/rsa')

async function authenticate(req, res, next) {
  const addressToken = (req.header('X-GOLDEN-TOKEN1') || "") + (req.header('X-GOLDEN-TOKEN2') || "")
  const address = req.body.address || req.query.address || req.params.address
  if (address === decrypt(addressToken)) {
    next()
    return
  }

  res.status(401).json({'msg': 'Authentication Error'})
}

async function mint(req, res) {
  try {
    const token = encrypt(encryptNumberRsa(getUTCSeconds()).toString())
    res.json({token})
  } catch (e) {
    console.log(e)
    res.status(500).json({ msg: 'Server Error' })
  }
}

async function setStarttime(req, res) {
  try {
    const rows = await Setting.findAll({ where: { key: 'starttime' }})
    const starttime = Math.round((new Date()).getTime() / 1000)
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

async function setPause(req, res) {
  try {
    const rows = await Setting.findAll({ where: { key: 'pause' }})
    if (rows.length === 0) {
      await Setting.create({ key: 'pause', value: req.body.pause })
    } else {
      await Setting.update(
        { value: req.body.pause },
        { where: { key: 'pause' } }
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
    res.json({ starttime: Number(setting.get({plane: true}).value) })
  } catch (e) {
    console.log(e)
    res.status(500).json({ msg: 'Server Error' })
  }
}


async function getPause(req, res) {
  try {
    const setting = await Setting.findOne({
      where: { key: 'pause' }
    })
    res.json({ pause: Number(setting.get({plane: true}).value) })
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
    res.json({ starttime: Number(setting.get({plane: true}).value) })
  } catch (e) {
    console.log(e)
    res.status(500).json({ msg: 'Server Error' })
  }
}

module.exports = {
  authenticate,
  mint,
  setPause,
  setStarttime,
  getStarttime,
  upgradeNft,
  getPause
}
