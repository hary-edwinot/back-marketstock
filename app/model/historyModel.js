module.exports = (db_connection, DataTypes) => {
  const History = db_connection.define(
    'History',
    {
      historique_id: {                      // Identifiant unique de l'historique
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      user_id: {                           // Identifiant de l'utilisateur ayant effectué l'action
        type: DataTypes.UUID,
        allowNull: true
      },
      entity_type: {                       // Type de l'entité concernée par l'action
        type: DataTypes.ENUM('produit','commande','livraison', 'utilisateur', 'catégorie', 'statut'),
        allowNull: true
      },
      entity_id: {                         // Identifiant de l'entité concernée
        type: DataTypes.UUID,
        allowNull: true
      },
      action: {                            // Type d'action effectuée
        type: DataTypes.ENUM('création', 'modification', 'suppression', 'restauration','changement de statut'),
      },
      old_value: {                         // Ancienne valeur de l'entité
        type: DataTypes.JSON,
        allowNull: true
      },
      new_value: {                         // Nouvelle valeur de l'entité
        type: DataTypes.JSON,
        allowNull: true
      }
    },
    {
      timestamps: true,                  // Ajout des champs createdAt et deletedAt
      createdAt: 'created_at',
      deletedAt: 'deleted_at',
      paranoid: true,                     // Activation de la suppression douce (soft delete)
    }
  )

  return History;
}
