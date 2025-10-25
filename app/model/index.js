const {db_connection} = require('../config/db_connection');
const {Sequelize, DataTypes} = require('sequelize');

// Création de l'objet db pour exporter la connexion et les modèles
const db = {};
db.Sequelize = Sequelize;
db.connection = db_connection;

// // Import des modèles et instanciation avec la connexion
db.User = require('./userModel')(db_connection, DataTypes);
db.Commande = require('./commandeModel')(db_connection, DataTypes);



module.exports = db;
