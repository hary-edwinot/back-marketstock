module.exports = (db_connection, DataTypes) => {
  const History = db_connection.define(
    'History',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      isProduct: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      isOrder: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      }
    },
    {
      timestamps: true,
      createdAt: 'created_at',
      deletedAt: 'deleted_at',
      paranoid: true,
      defaultScope: {
        attributes: { exclude: ['productId'] }
      }
    }
  )

  History.associate = models => {
    History.belongsTo(models.Product, {
      foreignKey: {
        name: 'productId',
        allowNull: false
      },
      as: 'product'
    })
  }

  return History;
}
