

module.exports = (db_connection, DataTypes) => {
  const Product = db_connection.define(
    'Product',
    {
      product_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      product_name: {                         // Nom du produit
        type: DataTypes.STRING,
        allowNull: false
      },
      product_ref: {                          // Référence du produit ex: "REF12345"
        type: DataTypes.STRING,
        allowNull: true
      },
      category_id: {                          // Catégorie du produit
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'Categories',
          key: 'category_id'
        }
      },
      product_color: {                        // Couleur du produit
        type: DataTypes.STRING,
        allowNull: true
      },
      product_quantity: {                     // Quantité en stock
        type: DataTypes.INTEGER,
        allowNull: false
      },
      product_buying_price: {                 // Prix d'achat
        type: DataTypes.FLOAT,
        allowNull: false
      },
      product_selling_price: {                 // Prix de vente
        type: DataTypes.FLOAT,
        allowNull: false
      },
      product_description: {                  // Description du produit
        type: DataTypes.TEXT,
        allowNull: true
      },
      product_image: {                       // URL de l'image du produit
        type: DataTypes.STRING,
        allowNull: true
      },
      product_unit: {                        // Unité de mesure
        type: DataTypes.ENUM('pièce', 'kg', 'litre', 'mètre'),
        allowNull: false
      },
      product_lot: {                        // Numéro de lot ex: "LOT20231001"
        type: DataTypes.STRING,
        allowNull: true
      },
      product_dateExp: {                    // Date d'expiration pour les produits périssables             
        type: DataTypes.DATE,
        allowNull: true
      },
      product_status_id: {                  // Statut du produit (disponible, en rupture, etc.)
        type: DataTypes.UUID,
        allowNull: false
      },
      product_origin: {                     // Origine du produit
        type: DataTypes.ENUM('fournisseur', 'entrepot'),
        defaultValue: 'fournisseur'
      },
      product_mark: {                       // Marque du produit           
        type: DataTypes.STRING,
        allowNull: true
      },
      product_fournisseur_id: {             // ID du fournisseur
        type: DataTypes.STRING,
        allowNull: true
      },
      product_tva: {                        // Taux de TVA appliqué
        type: DataTypes.FLOAT,
        defaultValue: 20,
        allowNull: true
      },
      product_dimensions: {                 // Dimensions du produit (L x l x h)
        type: DataTypes.STRING,
        allowNull: true
      },
      product_weight: {                     // Poids du produit en kg
        type: DataTypes.FLOAT,
        allowNull: true
      },
      product_location: {                   // Emplacement dans l'entrepôt
        type: DataTypes.STRING,
        allowNull: true
      },
      product_minimum_stock: {               // Quantité minimale avant alerte de rupture
        type: DataTypes.INTEGER,
        allowNull: true
      },
      user_id: {                           // ID de l'utilisateur qui a ajouté le produit
        type: DataTypes.UUID,
        allowNull: false
      }
    },
    {
      timestamps: true,
      tableName: 'Products',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
      paranoid: true,
      // defaultScope: {
      //   attributes: { exclude: ['user_id', 'category_id', 'status_id'] }
      // }
    }
  )

  Product.beforeCreate(product => {
    const dateExp = new Date()
    dateExp.setDate(dateExp.getDate() + 30)
    product.product_dateExp = dateExp
  })

  //   User.hasMany(Product, { foreignKey: 'userId', as: 'products' })
  //   Product.BelongsTo(User, {foreignKey: 'userId', as: 'user'})



  // Product.associate = models => {
  //   Product.belongsTo(models.User, {
  //     foreignKey: {
  //       name: 'userId',
  //       allowNull: false
  //     },
  //     as: 'user'
  //   })

  //   Product.belongsTo(models.Category, {
  //     foreignKey: {
  //       name: 'categoryId',
  //       allowNull: false
  //     },
  //     as: 'category'
  //   })

  //   Product.belongsTo(models.Status, {
  //     foreignKey: {
  //       name: 'statusId',
  //       allowNull: false
  //     },
  //     as: 'status'
  //   })
  // }


  // Creation des historique lors de la création, modification ou suppression d'un produit



  //Apres creation d'un produit
  Product.afterCreate(async (product, options) => {
    const History = db_connection.models.History
    await History.create({
      user_id: product.user_id,
      entity_type: 'produit',
      entity_id: product.product_id,
      action: 'création',
      new_value: product,
    })
  })

  
  return Product
}
