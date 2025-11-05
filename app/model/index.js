const { db_connection } = require('../config/db_connection')
const { Sequelize, DataTypes } = require('sequelize')

// Création de l'objet db pour exporter la connexion et les modèles
const db = {}
db.Sequelize = Sequelize
db.connection = db_connection

// // Import des modèles et instanciation avec la connexion

db.Commande = require('./commandeModel')(db_connection, DataTypes);
db.User = require('./userModel')(db_connection, DataTypes)
db.Product = require('./productModel')(db_connection, DataTypes)
db.Category = require('./categoryModel')(db_connection, DataTypes)
db.Status = require('./statusModel')(db_connection, DataTypes)
db.History = require('./historyModel')(db_connection, DataTypes)
db.Client = require('./clientModel')(db_connection, DataTypes)
db.Ville = require('./listVilleModel')(db_connection, DataTypes)
db.Facture = require('./factureModel')(db_connection, DataTypes)
db.FactureProduct = require('./factureProductModel')(db_connection, DataTypes)






Object.keys(db).forEach(model => {
  if (db[model].associate) db[model].associate(db)
})

module.exports = db
