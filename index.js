const express = require('express');
const pagination = require('./midellware/pagination');
require('./app/config/db_connection');
const cors = require('cors');
const { options } = require('./app/routes');
require('dotenv').config();
// require('./app/config/configdb')

//Initiation de Express
const server = express()

const optionsCors = {
    origin: 'http://localhost:5173', // Autoriser toutes les origines
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Méthodes HTTP autorisées
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin'
    ],
    credentials: true, // Autoriser l'envoi de cookies avec les requêtes
    optionsSuccessStatus: 200 // Statut de succès pour les requêtes OPTIONS
};


server.use(cors(optionsCors))

//middleware
server.use(express.json())
server.use(pagination)


//Routes
//Utilisation du routeur pour toutes les routes commençant par /api/v1
//Cela permet de centraliser la gestion des routes dans un seul fichier
//et de garder le code organisé et modulaire.
server.use('/api/v1', options);



//Demmarage du serveur
server.listen(process.env.PORT, () => { console.log('Le serveur ecoute sur le PORT' + process.env.PORT); })



