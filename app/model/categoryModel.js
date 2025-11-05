module.exports = (db_connection, DataTypes) => {
  const Category = db_connection.define(
    'Category',
    {
      category_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      category_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: true
      },
      parent_category_id: {
        type: DataTypes.UUID,
        allowNull: true
      },
      category_description: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      tableName: 'Categories',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
      paranoid: true
    }
  );

  Category.associate = models => {
    // Relation avec Product
    Category.hasMany(models.Product, {
      foreignKey: 'category_id',
      as: 'products'
    });

    // Relation avec User
    Category.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });

    // Auto-référence définie via associations
    Category.belongsTo(Category, {
      foreignKey: 'parent_category_id',
      as: 'parentcategory'
    });

    Category.hasMany(Category, {
      foreignKey: 'parent_category_id',
      as: 'subcategories'
    });
  };

  return Category;
};
