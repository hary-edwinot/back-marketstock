const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Commande = sequelize.define('Commande', {
        order_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        order_number: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        product_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        destination_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        destination_lat: {
            type: DataTypes.FLOAT, // Plus de précision pour GPS
            allowNull: false,
        },
        destination_long: {
            type: DataTypes.FLOAT, // Plus de précision pour GPS
            allowNull: false,
        },
        delivery_person_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'Users',
                key: 'user_id'
            }
        },
        is_delivered: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        status: {
            type: DataTypes.ENUM('en_attente', 'en_cours', 'livree', 'annulee'),
            defaultValue: 'en_attente'
        }
    }, {
        tableName: 'Commandes',
        timestamps: true,
         hooks: {
            beforeCreate: async (commande, options) => {
                if (!commande.order_number) {
                    commande.order_number = await generateShortOrderNumber(commande.client_id, sequelize);
                }
            }
        }
    });

    return Commande;
};




async function generateHashBasedOrderNumber(clientUUID, sequelize) {
    try {
        // Créer un hash court de 4 caractères à partir de l'UUID
        const hash = crypto.createHash('md5').update(clientUUID).digest('hex').slice(0, 4).toUpperCase();
        
        // Compter les commandes existantes pour ce client
        const [results] = await sequelize.query(`
            SELECT COUNT(*) as count 
            FROM Commandes 
            WHERE client_id = :clientId
        `, {
            replacements: { clientId: clientUUID },
            type: sequelize.QueryTypes.SELECT
        });

        const nextNumber = (results.count || 0) + 1;
        const paddedNumber = nextNumber.toString().padStart(4, '0');
        
        // Format: CMD-A1B2-0001
        return `CMD-${hash}-${paddedNumber}`;
        
    } catch (error) {
        console.error('Erreur génération order_number:', error);
        return `CMD-${Date.now().toString().slice(-8)}`;
    }
}