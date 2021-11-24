module.exports = (connectionSeq, Sequelize) => {
  const Model = connectionSeq.define(
    'WhiteList',
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      address: {
        type: Sequelize.STRING,
      },
    },
    {
      tableName: 'whitelists',
    }
  )

  return Model
}
