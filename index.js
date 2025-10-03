const exepress = require('express')
require('./app/config/db_connection');
// require('./app/config/configdb')

//Initiation de Express
const server = exepress()

//middleware
server.use(exepress.json())


//Routes
//Utilisation du routeur pour toutes les routes commençant par /api/v1
//Cela permet de centraliser la gestion des routes dans un seul fichier
//et de garder le code organisé et modulaire.
server.use('/api/v1', require('./app/routes')); 



//Demmarage du serveur
server.listen(process.env.PORT,()=>{console.log('Le serveur ecoute sur le PORT' + process.env.PORT);})



