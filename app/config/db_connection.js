const { Sequelize } = require('sequelize');
const config = require('../config/configdb').development;

// Création d'une instance Sequelize
const db_connection = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
        host: config.host,
        dialect: config.dialect
    },
    { logging: config.logging }
);


// Test de la connexion
db_connection.authenticate()
    .then(() => console.log('Connection a labse de données a été établie avec succès.'))
    .catch(err => console.error('Unable to connect to the database:', err)
    );


// Synchronisation des modèles avec la base de données
db_connection.sync({ alter: config.logging })
    .then(() => {
        console.log('Les modèles ont été synchronisés avec succès.');
    })
    .catch(err => {
        console.error('Il y a eu une erreur lors de la synchronisation des modèles :', err);
    });

module.exports = { db_connection };
