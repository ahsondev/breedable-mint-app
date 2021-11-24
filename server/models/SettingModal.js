module.exports = (connectionSeq, Sequelize) => {
  const Model = connectionSeq.define(
    'Setting',
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      key: {
        type: Sequelize.STRING,
      },
      value: {
        type: Sequelize.STRING,
      },
    },
    {
      tableName: 'Settings',
    }
  )

  return Model
}
