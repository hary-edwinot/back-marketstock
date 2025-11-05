const express = require('express')
const router = express.Router()
const userIsAuth = require('../../midellware/userIsAuth')

// Routes utilisateurs
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')
const productController = require('../controllers/productController')
const basicDataController = require('../controllers/basicDataController')
const historyController = require('../controllers/historyController')
const commandeController = require('../controllers/commandeController'); // ✅ Ajouté depuis HEAD
const clientController = require('../controllers/clientController')
const localisationVilleController = require('../controllers/localisationVilleControler')
const factureProductController = require('../controllers/factureProductController')

// Routes pour les utilisateurs
router.post('/user/create', userController.createUser) // POST /api/v1/users
router.get('/users', userIsAuth, userController.getAllUsers) // GET /api/v1/users
// router.post('/update', userController.updateUser);          // POST /api/v1/users/update
// router.post('/delete', userController.deleteUser);          // POST /api/v1/users/delete
router.get('/user/:id', userIsAuth, userController.getUserById) // GET /api/v1/users/:id

// Authentification
router.post('/authentication', authController.authentication) // POST /api/v1/auth/login
router.post('/refresh-token', authController.refreshToken) // POST /api/v1/auth/refresh-token
router.post('/deconnexion/:id', userIsAuth, authController.logout) // POST /api/v1/auth/logout
router.post('/forgot-password', authController.forgotPassword) // POST /api/v1/auth/forgot-password
// router.post('/reset-password', authController.resetPassword);    // POST /api/v1/auth/reset-password

// ✅ Commandes (ajoutées depuis HEAD)
router.post('/new-commande', commandeController.newCommande); // POST /api/v1/new-commande
router.get('/liste-commandes', commandeController.getAllCommandes); // GET /api/v1/liste-commandes
router.get('/commande/:creator_id', userIsAuth, commandeController.getCommandesByCreator); // GET /api/v1/commande/:id
router.put('/update-commande/:creator_id', userIsAuth, commandeController.updateCommandeByCommandeCreatorId); // PUT /api/v1/update-commande/:creator_id
router.delete('/delete-commande/:creator_id', userIsAuth, commandeController.deleteCommandeByCommandeCreatorId); // DELETE /api/v1/delete-commande/:creator_id
router.get('/commandes-full-details/:creator_id', userIsAuth, commandeController.getCommandesWithFullDetailsByCreatorId); // GET /api/v1/commandes-full-details/:creator_id
router.get('/get-commande/:commande_id/:creator_id', userIsAuth, commandeController.getCommandeByIdAndCreatorId); // ✅ NOUVELLE ROUTE


// ✅ Product (priorisé depuis la branche principale)
router.post('/product', userIsAuth, productController.createProduct)
router.get('/products', userIsAuth, productController.findAllProducts)
router.get('/product/:id', userIsAuth, productController.findById)
router.put('/product/:id', userIsAuth, productController.updateProduct)
router.delete('/product/:id', userIsAuth, productController.deleteProduct)


router.get('/products/user/:user_id', productController.getProductsByUserId)









// ✅ Données de base (priorisé depuis la branche principale)
router.post('/category', basicDataController.createCategory)
router.get('/categorys', basicDataController.findAllCategory)
router.delete('/category/:id', userIsAuth, basicDataController.deleteCategory)
router.get('/status', basicDataController.findAllStatus)
router.post('/status', basicDataController.createStatus)
router.delete('/status/:id', userIsAuth, basicDataController.deleteStatus)

// ✅ History (priorisé depuis la branche principale)
router.put('/history/:id', userIsAuth, historyController.updateHistory)
router.get('/historys', userIsAuth, historyController.getAllHistory)
router.get('/history/:id', userIsAuth, historyController.findById)
router.delete('/history/:id', userIsAuth, historyController.deleteHistory)


//Routes clients

router.post('/add-client', userIsAuth, clientController.newClient)   // Création d'un nouveau client
router.get('/clients', userIsAuth, clientController.getAllClients)    // Récupération de tous les clients
router.get('/clients/user/:user_id', clientController.getClientsListByUserId) // Récupération des clients par user_id



router.get('/localisation', localisationVilleController.getLocalisation)



// Facture Products
router.post('/facture-product/create', userIsAuth, factureProductController.createFactureOfProduct) // Création d'une nouvelle facture produit






module.exports = router
