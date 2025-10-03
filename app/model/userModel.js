
// Prends comme paramètres dbconnection et DataTypes
module.exports = (db_connection, DataTypes) => {
    const User = db_connection.define('User', {
        user_id:{
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        country: {
            type: DataTypes.STRING,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.ENUM('super-administrateur', 'administrateur', 'gestionnaire', 'magasinier', 'commercial', 'comptable', 'livreur '),
            defaultValue: 'administrateur'
        },
        enterpriseName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        abonmentType: {
            type: DataTypes.ENUM('Basic', 'Pro', 'Premium', 'gratuit'),
            defaultValue: 'gratuit'
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        lastLogin: {
            type: DataTypes.DATE,
            allowNull: true
        },
        token: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        refreshToken: {
            type: DataTypes.TEXT,
            allowNull: true
        },
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
    });

    return User;
};
