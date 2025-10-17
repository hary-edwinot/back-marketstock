module.exports = (db_connection, DataTypes) => {
  const Category = db_connection.define(
    'Category',
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
  Category.associate = models => {
    Category.hasMany(models.Product, {
      foreignKey: {
        name: 'categoryId',
        allowNull: false
      },
      as: 'products'
    })
  }
  return Category
}
