module.exports = (db_connection, DataTypes) => {
  const Status = db_connection.define(
    'Status',
    {
      status_id: {                          // Identifiant unique du statut
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      user_id: {                           // Référence à l'utilisateur qui a créé ou modifié le statut
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      status_name: {                       // Nom du statut
        type: DataTypes.STRING,
        allowNull: false,
      },
      status_type: {                       // Type de statut : produit, livraison, commandes, etc.
        type: DataTypes.STRING,
        allowNull: false
      },
      is_default: {                        // Indique si c'est un statut par défaut
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      description: {                       // Description du statut
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      timestamps: true,
      createdAt: 'created_at',
      paranoid: true, // soft delete
      tableName: 'Status'
    }
  )

  // Associations avec la table Product et Commande
  Status.associate = models => {
    Status.hasMany(models.Product, {
      foreignKey: {
        name: 'product_status_id',
        allowNull: false
      },
      as: 'Products'
    }),
      Status.hasMany(models.Commande, {
        foreignKey: {
          name: 'status_id',
          allowNull: false
        },
        as: 'Commandes'
      })
  }

  // 🌱 Ajout automatique des statuts par défaut après création de la table
  Status.afterSync(async () => {
    const defaultStatuses = [
      {
        status_name: 'disponible',
        status_type: 'produit',
        is_default: true,
        description: 'Produit disponible en stock'
      },
      {
        status_name: 'rupture',
        status_type: 'produit',
        is_default: true,
        description: 'Produit en rupture de stock'
      },
      {
        status_name: 'en commande',
        status_type: 'produit',
        is_default: true,
        description: 'Produit en attente de livraison fournisseur'
      },
      {
        status_name: 'supprimé',
        status_type: 'produit',
        is_default: true,
        description: 'Produit retiré du catalogue'
      },
      {
        status_name: 'périmé',
        status_type: 'produit',
        is_default: true,
        description: 'Produit périmé'
      },
      {
        status_name: 'obsolète',
        status_type: 'produit',
        is_default: true,
        description: 'Produit obsolète'
      },
      {
        status_name: 'en préparation',
        status_type: 'livraison',
        is_default: true,
        description: 'Produit en attente de livraison fournisseur'
      },
      {
        status_name: 'expédié',
        status_type: 'livraison',
        is_default: true,
        description: 'Produit expédié au client dans les régions'
      },
      {
        status_name: 'livré',
        status_type: 'livraison',
        is_default: true,
        description: 'Produit livré au client'
      },
      {
        status_name: 'annulé',
        status_type: 'livraison',
        is_default: true,
        description: 'Produit annulé'
      },
      {
        status_name: 'retour',
        status_type: 'livraison',
        is_default: true,
        description: 'Produit retourné par le client'
      },
      {
        status_name: 'en attente',
        status_type: 'commandes',
        is_default: true,
        description: 'Commande en attente de traitement'
      },
      {
        status_name: 'confirmée',
        status_type: 'commandes',
        is_default: true,
        description: 'Commande confirmée'
      },
      {
        status_name: 'payé',
        status_type: 'commandes',
        is_default: true,
        description: 'Commande payée'
      },
      {
        status_name: 'remboursé',
        status_type: 'commandes',
        is_default: true,
        description: 'Commande remboursée'
      },
      {
        status_name: 'annulé',
        status_type: 'commandes',
        is_default: true,
        description: 'Commande annulée'
      }
    ]

    // Vérifie si la table est déjà remplie avant d'insérer
    const count = await Status.count()
    if (count === 0) {
      await Status.bulkCreate(defaultStatuses)
      console.log('✅ Statuts par défaut insérés dans la table status')
    }
  })

  return Status
}
