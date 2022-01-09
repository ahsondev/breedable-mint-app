const db = require('../models');
const { QueryTypes } = require('sequelize');

const Setting = db.Setting
const {getUTCSeconds, getMerkleData, getMerkleRoot} = require('../services/helper')

async function getSignRoot(req, res) {
  try {
    const signAddresses = (await db.SignAddress.findAll()).map(v => v.get({plane: true}).address)
    const root = getMerkleRoot(signAddresses)
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
    const root = getMerkleRoot(whiteLists)
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
    const recs = await db.connectionSeq.query(
      "SELECT * FROM `sign_addresses` WHERE ISNULL(`used`) OR `used`='0' ORDER BY `id` LIMIT 1",
      { type: QueryTypes.SELECT }
    );
    if (!recs.length) {
      res.status(500).json({ msg: 'No more available users' });
      return;
    }

    await db.connectionSeq.query("UPDATE `sign_addresses` SET `used`='1' WHERE `id`='" + recs[0].id + "'")
    const rows = (await db.SignAddress.findAll()).map(v => v.get({plane: true}).address);
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
