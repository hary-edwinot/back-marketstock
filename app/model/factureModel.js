// models/Facture.js
module.exports = (db_connection, DataTypes) => {
  const Facture = db_connection.define(
    'Facture',
    {
      facture_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      commande_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Commandes',
          key: 'commande_id',
        },
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'user_id',
        },
      },
      facture_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      facture_tva: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      facture_montant_total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      facture_total_ttc: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
    },
    {
      tableName: 'Facture',
      timestamps: true,
      createdAt: 'created_at',
      deletedAt: 'deleted_at',
      paranoid: true,
    }
  );

  Facture.associate = (models) => {
    Facture.belongsTo(models.Commande, {
      foreignKey: 'commande_id',
      as: 'commande',
    });

    Facture.hasMany(models.FactureProduct, {
      foreignKey: 'facture_id',
      as: 'factureProduct',
    });
  };

  return Facture;
};
