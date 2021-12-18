const Sequelize = require('sequelize')
const config = require('../config')

console.log("config: ", process.env.NODE_ENV)
let dbConfig = {}

if (process.env.NODE_ENV === 'development') {
  dbConfig = {
    user: 'root',
    password: '',
    host: '127.0.0.1'
  }
} else {
  dbConfig = {
    user: 'admin',
    password: 'dky#$55Khmdhj009p',
    host: 'mint-braindance-gg-db.c7qko9k9lqby.us-west-2.rds.amazonaws.com'
  }
}

const connectionSeq = new Sequelize('braindance', dbConfig.user, dbConfig.password, {
  host: dbConfig.host,
  dialect: 'mysql',
  port: 3306,
})

const db = {}

db.Sequelize = Sequelize
db.connectionSeq = connectionSeq

db.WhiteList = require('./WhiteListModel')(connectionSeq, Sequelize)
db.Setting = require('./SettingModal')(connectionSeq, Sequelize)
db.AuthTokenModel = require('./AuthTokenModel')(connectionSeq, Sequelize)

module.exports = db
