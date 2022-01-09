const db = require('../models')
const Setting = db.Setting
const {decrypt, getMerkleData, getUTCSeconds} = require('../services/helper')

async function authenticate(req, res, next) {
  const addressToken = (req.header('X-GOLDEN-TOKEN1') || "") + (req.header('X-GOLDEN-TOKEN2') || "")
  const address = req.body.address || req.query.address || req.params.address
  if (address === decrypt(addressToken)) {
    next()
    return
  }

  res.status(401).json({'msg': 'Authentication Error'})
}

async function mintWhitelist(req, res) {
  try {
    if (!req.body.address || !req.body.step) {
      res.status(500).json({ msg: 'Parameter Error' })
      return
    }

    const rows = (await db.WhiteList.findAll({ where: { step: req.body.step }})).map(v => v.get({plane: true}).address)
    const ret = getMerkleData(req.body.address, rows)
    res.json(ret)
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

function getTime(req, res) {
  try {
    res.json({ time: getUTCSeconds() })
  } catch (e) {
    console.log(e)
    res.status(500).json({ msg: 'Server Error' })
  }
}

module.exports = {
  authenticate,
  getStarttime,
  mintWhitelist,
  getTime,
}
