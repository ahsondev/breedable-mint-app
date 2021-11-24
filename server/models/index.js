const Sequelize = require('sequelize')

const connectionSeq = new Sequelize('braindance', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306,
})

const db = {}

db.Sequelize = Sequelize
db.connectionSeq = connectionSeq

db.WhiteList = require('./WhiteListModel')(connectionSeq, Sequelize)

module.exports = db
