// models/Commande.js
const { DataTypes } = require('sequelize');

module.exports = (db_connection) => {
  const Commande = db_connection.define(
    'Commande',
    {
      commande_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      commande_creator_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'user_id',
        },
      },
      commande_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      client_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Clients',
          key: 'client_id',
        },
      },
      commande_destination_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      commande_destination_lat: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: true,
      },
      commande_destination_long: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: true,
      },
      commande_delivery_person_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'user_id',
        },
      },
      commande_is_delivered: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      commande_rest_to_pay: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.0,
      },
      status_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Status',
          key: 'status_id',
        },
      },
    },
    {
      tableName: 'Commandes',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      paranoid: true,
      deletedAt: 'deleted_at',
    }
  );

  // ✅ Associations
  Commande.associate = (models) => {
    Commande.belongsTo(models.Client, {
      foreignKey: 'client_id',
      as: 'client',
    });

    Commande.belongsTo(models.Status, {
      foreignKey: 'status_id',
      as: 'status',
    });

    Commande.belongsTo(models.User, {
      foreignKey: 'commande_creator_id',
      as: 'creator',
    });

    Commande.belongsTo(models.User, {
      foreignKey: 'commande_delivery_person_id',
      as: 'deliveryPerson',
    });

    // ✅ Une commande a UNE facture
    Commande.hasOne(models.Facture, {
      foreignKey: 'commande_id',
      as: 'facture',
    });
  };

  return Commande;
};
