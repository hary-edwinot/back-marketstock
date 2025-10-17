module.exports = (db_connection, DataTypes) => {
  const Product = db_connection.define(
    'Product',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      size: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      color: {
        type: DataTypes.STRING,
        allowNull: false
      },
      lot: {
        type: DataTypes.STRING,
        allowNull: false
      },
      dateExp: {
        type: DataTypes.DATE,
        allowNull: true
      },
      type: {
        type: DataTypes.ENUM('fournisseur', 'entrepot'),
        defaultValue: 'fournisseur'
      }
    },
    {
      timestamps: true,
      createdAt: 'created_at',
      paranoid: true,
      defaultScope: {
        attributes: { exclude: ['userId', 'categoryId', 'statusId'] }
      }
    }
  )

  Product.beforeCreate(product => {
    const dateExp = new Date()
    dateExp.setDate(dateExp.getDate() + 30)
    product.dateExp = dateExp
  })

  //   User.hasMany(Product, { foreignKey: 'userId', as: 'products' })
  //   Product.BelongsTo(User, {foreignKey: 'userId', as: 'user'})

  Product.associate = models => {
    Product.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        allowNull: false
      },
      as: 'user'
    })

    Product.belongsTo(models.Category, {
      foreignKey: {
        name: 'categoryId',
        allowNull: false
      },
      as: 'category'
    })

    Product.belongsTo(models.Status, {
      foreignKey: {
        name: 'statusId',
        allowNull: false
      },
      as: 'status'
    })
  }

  return Product
}
