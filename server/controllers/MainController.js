const db = require('../models')
const Setting = db.Setting
const {encrypt, decrypt, getUTCSeconds, round} = require('../services/helper')
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
    const token = encrypt('1')
    res.json({token})
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

async function getToken(req, res) {
  try {
    const utcSeconds = await getUTCSeconds()
    const token = encrypt(encryptNumberRsa(utcSeconds).toString())
    res.json({token})
  } catch (e) {
    console.log(e)
    res.status(500).json({ msg: 'Server Error' })
  }
}

async function getWhitelist(req, res) {
  try {
    const rows = await db.WhiteList.findAll({where: { address: req.body.address }})
    if (rows.length > 0) {
      const utcSeconds = await getUTCSeconds()
      const token = encrypt(encryptNumberRsa(utcSeconds).toString())
      res.json({token})
    } else {
      res.status(500).json({ msg: 'No whitelist' })
    }
  } catch (e) {
    console.log(e)
    res.status(500).json({ msg: 'Server Error' })
  }
}

module.exports = {
  authenticate,
  mint,
  setStarttime,
  getStarttime,
  upgradeNft,
  getToken,
  getWhitelist,
}
