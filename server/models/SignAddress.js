module.exports = (connectionSeq, Sequelize) => {
  const Model = connectionSeq.define(
    'SignAddress',
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
      used: {
        type: Sequelize.INTEGER,
      },
    },
    {
      tableName: 'sign_addresses',
    }
  )

  return Model
}
