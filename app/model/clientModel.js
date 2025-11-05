// Prends comme paramètres dbconnection et DataTypes
module.exports = (db_connection, DataTypes) => {
    const Client = db_connection.define(
        'Client',
        {
            client_id: {                                       // Identifiant unique du client
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4
            },
            user_id: {                                         // Identifiant de l'utilisateur qui a créé le client
                type: DataTypes.UUID,
                allowNull: false
            },
            client_name: {                                     // Nom du client
                type: DataTypes.STRING,
                allowNull: false
            },
            client_last_name: {                                // Prénom du client
                type: DataTypes.STRING,
                allowNull: false
            },
            client_region: {                                   // Région du client
                type: DataTypes.STRING,
                allowNull: true
            },
            client_email: {                                     // Email du client
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            client_phone: {                                      // Numéro de téléphone du client
                type: DataTypes.STRING,
                allowNull: true
            },
            client_address: {                                     // Adresse du client
                type: DataTypes.STRING,
                allowNull: true
            },
            client_type: {                                       // Type de client : particulier ou entreprise
                type: DataTypes.ENUM('particulier', 'entreprise'),
                defaultValue: 'particulier'
            }, 
            client_commande_count: {                            // Nombre total de commandes passées par le client
                type: DataTypes.INTEGER,
                defaultValue: 0
            },
            client_total_spent: {                               // Montant total dépensé par le client   
                type: DataTypes.FLOAT,
                defaultValue: 0
            },
            client_last_date: {                                // Date de la dernière commande passée par le client
                type: DataTypes.DATE,
                allowNull: true
            },
            client_loyalty_status: {                          // Statut de fidélité du client : bronze, argent, or, platine
                type: DataTypes.ENUM('bronze', 'argent', 'or', 'platine'),
                defaultValue: 'bronze'
            },
            client_longitude: {                              // Longitude GPS
                type: DataTypes.DECIMAL(11, 8),
                allowNull: true
            },
            client_latitude: {                              // Latitude GPS
                type: DataTypes.DECIMAL(10, 8),
                allowNull: true
            }
        },
        {
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
            paranoid: true
        }
    )


    return Client
}
