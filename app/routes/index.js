const express = require('express');
const router = express.Router();
const userIsAuth = require('../../midellware/userIsAuth');

// Routes utilisateurs
const userController = require('../constrollers/userController');
const authController = require('../constrollers/authController');
const commandeController = require('../constrollers/commandeController');

// Routes pour les utilisateurs
router.get('/get-all-users',userIsAuth, userController.getAllUsers);               // GET /api/v1/users
router.post('/create', userController.createUser);          // POST /api/v1/users
// router.post('/update', userController.updateUser);          // POST /api/v1/users/update
// router.post('/delete', userController.deleteUser);          // POST /api/v1/users/delete
router.get('/get-user/:id', userIsAuth, userController.getUserById);            // GET /api/v1/users/:id


// Authentification
router.post('/authentication', authController.authentication);                    // POST /api/v1/auth/login
router.post('/refresh-token', authController.refreshToken);                    // POST /api/v1/auth/refresh-token
router.post('/deconnexion/:id', userIsAuth, authController.logout);                  // POST /api/v1/auth/logout
router.post('/forgot-password', authController.forgotPassword);  // POST /api/v1/auth/forgot-password
// router.post('/reset-password', authController.resetPassword);    // POST /api/v1/auth/reset-password

// Commande
router.post('/new-commande', commandeController.newCommande); // POST /api/v1/commande/new-commande
router.get('/liste', commandeController.getAllCommandes); // GET /api/v1/commande/all-commandes



module.exports = router;