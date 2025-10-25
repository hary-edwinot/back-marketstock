const express = require('express')
const router = express.Router()
const userIsAuth = require('../../midellware/userIsAuth')

// Routes utilisateurs
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')
const productController = require('../controllers/productController')
const basicDataController = require('../controllers/basicDataController')
const historyController = require('../controllers/historyController')

// Routes pour les utilisateurs
router.get('/users', userIsAuth, userController.getAllUsers) // GET /api/v1/users
router.post('/user/create', userIsAuth, userController.createUser) // POST /api/v1/users
// router.post('/update', userController.updateUser);          // POST /api/v1/users/update
// router.post('/delete', userController.deleteUser);          // POST /api/v1/users/delete
router.get('/user/:id', userIsAuth, userController.getUserById) // GET /api/v1/users/:id

// Authentification
router.post('/authentication', authController.authentication) // POST /api/v1/auth/login
router.post('/refresh-token', authController.refreshToken) // POST /api/v1/auth/refresh-token
router.post('/deconnexion/:id', userIsAuth, authController.logout) // POST /api/v1/auth/logout
router.post('/forgot-password', authController.forgotPassword) // POST /api/v1/auth/forgot-password
// router.post('/reset-password', authController.resetPassword);    // POST /api/v1/auth/reset-password

//Product
router.post('/product', userIsAuth, productController.createProduct)
router.get('/products', userIsAuth, productController.findAllProducts)
router.get('/product/:id', userIsAuth, productController.findById)
router.put('/product/:id', userIsAuth, productController.updateProduct)
router.delete('/product/:id', userIsAuth, productController.deleteProduct)

//Donnees de base
router.post('/category', basicDataController.createCategory)
router.get('/categorys', basicDataController.findAllCategory)
router.delete('/category/:id', userIsAuth, basicDataController.deleteCategory)
router.get('/status', basicDataController.findAllStatus)
router.post('/status', basicDataController.createStatus)
router.delete('/status/:id', userIsAuth, basicDataController.deleteStatus)

//history
router.put('/history/:id', userIsAuth, historyController.updateHistory)
router.get('/historys', userIsAuth, historyController.getAllHistory)
router.get('/history/:id', userIsAuth, historyController.findById)
router.delete('/history/:id', userIsAuth, historyController.deleteHistory)

module.exports = router
