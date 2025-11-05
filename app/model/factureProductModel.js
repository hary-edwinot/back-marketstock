// models/Facture_product.js
module.exports = (db_connection, DataTypes) => {
  const FactureProduct = db_connection.define(
    'FactureProduct',
    {
      facture_product_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      facture_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Facture', // ou 'Factures' selon le nom de ta table
          key: 'facture_id',
        },
      },
      product_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Products',
          key: 'product_id',
        },
      },
      product_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      product_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      product_total_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      tableName: 'FactureProduct',
      timestamps: true,
      createdAt: 'created_at',
      deletedAt: 'deleted_at',
      paranoid: true,
    }
  );

  FactureProduct.associate = (models) => {
    FactureProduct.belongsTo(models.Facture, {
      foreignKey: 'facture_id',
      as: 'facture',
    });

    FactureProduct.belongsTo(models.Product, {
      foreignKey: 'product_id',
      as: 'produit',
    });
  };

  return FactureProduct;
};
