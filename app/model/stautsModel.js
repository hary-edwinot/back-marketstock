module.exports = (db_connection, DataTypes) => {
  const Status = db_connection.define(
    'status',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      timestamps: false,
      paranoid: false
    }
  )

  Status.associate = models => {
    Status.hasMany(models.Product, {
      foreignKey: {
        name: 'statusId',
        allowNull: false
      },
      as: 'products'
    })
  }
  return Status
}
