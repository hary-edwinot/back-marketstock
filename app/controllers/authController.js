const db = require('../model/index');
const bcrypt = require('bcrypt');
const User = db.User;
const jwt = require('jsonwebtoken');

require('dotenv').config();

const nodemailer = require('nodemailer');


// Fonction d'authentification de l'utilisateur depuis son email et mot de passe via postman
exports.authentication = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation des données
        if (!email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Email et mot de passe requis'
            });
        }

        // Trouver l'utilisateur par email
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'Utilisateur non trouvé'
            });
        }

        // Comparer le mot de passe
        const passwordWithIV = password + process.env.PASSWORD_IV;
        const isMatch = await bcrypt.compare(passwordWithIV, user.password);

        if (!isMatch) {
            return res.status(401).json({
                status: 'error',
                message: 'Mot de passe incorrect'
            });
        }

        // Authentification réussie
        const { password: _, ...userWithoutPassword } = user.toJSON();

        // CORRECTION: Utiliser l'ID correct du modèle
        const tokenPayload = {
            id: userWithoutPassword.user_id, // Support des deux formats
            role: userWithoutPassword.role,
            email: userWithoutPassword.email,
            enterpriseName: userWithoutPassword.enterpriseName
        };

        // Générer les tokens
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });
        const refreshToken = jwt.sign(tokenPayload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

        // CORRECTION: Utiliser await et gérer les erreurs
        try {
            await User.update(
                { refreshToken: refreshToken, token: token },
                { where: { user_id: userWithoutPassword.user_id } }
            );
        } catch (updateError) {
            console.log('Erreur lors de la sauvegarde des tokens:', updateError.message);
            // Continuer sans sauvegarder les tokens en DB si problème de taille
        }

        res.status(200).json({
            status: 'success',
            message: 'Authentification réussie',
            token: token,
            refreshToken: refreshToken,
            user: userWithoutPassword
        });

    } catch (err) {
        console.error('Erreur authentification:', err);
        res.status(500).json({
            status: 'error',
            message: 'Impossible d\'authentifier l\'utilisateur',
            error: err.message
        });
    }
};

// Fonction de rafraîchissement du token via url non protégée
exports.refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({
            status: 'error',
            message: 'Refresh token requis'
        });
    }

    try {
        // Vérifier le refresh token
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        // CORRECTION: Utiliser await correctement
        const user = await User.findOne({
            where: {
                [User.primaryKeyAttribute]: decoded.id,
                refreshToken: refreshToken
            }
        });

        if (!user) {
            return res.status(403).json({
                status: 'error',
                message: 'Refresh token invalide ou utilisateur non trouvé'
            });
        }

        // Générer un nouveau access token
        const newTokenPayload = {
            id: userid || user.id,
            role: user.role,
            email: user.email,
            enterpriseName: user.enterpriseName
        };

        const newToken = jwt.sign(newTokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });
        const newRefreshToken = jwt.sign(newTokenPayload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

        // Mettre à jour le refresh token en DB (optionnel)
        try {
            await User.update(
                { refreshToken: newRefreshToken },
                { where: { [User.primaryKeyAttribute]: userid || user.id } }
            );
        } catch (updateError) {
            console.log('Erreur lors de la mise à jour du refresh token:', updateError.message);
        }

        res.status(200).json({
            status: 'success',
            token: newToken,
            refreshToken: newRefreshToken
        });

    } catch (err) {
        console.error('Erreur refresh token:', err);
        return res.status(401).json({
            status: 'error',
            message: 'Refresh token invalide ou expiré'
        });
    }
};


// Fonction de déconnexion (logout) - optionnelle
exports.logout = async (req, res) => {
    try {
        const userId = req.user.id; // Récupéré depuis le middleware d'authentification 

        // Supprimer les tokens de la base de données
        const [updatedRowsCount] = await User.update(
            {
                token: null,
                refreshToken: null,
                lastLogin: new Date() // Optionnel : mettre à jour la dernière activité
            },
            {
                where: { user_id: userId }
            }
        );

        if (updatedRowsCount === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Utilisateur non trouvé'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Déconnexion réussie'
        });

    } catch (err) {
        console.error('Erreur lors de la déconnexion:', err);
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la déconnexion',
            error: err.message
        });
    }
};


//Fonctions de réinitialisation de mot de passe via email (forgot password)
exports.forgotPassword = async (req, res) => {
    // Import the Nodemailer library


    // Create a transporter object

    const transporter = nodemailer.createTransport({
        host: 'demomailtrap.co',
        port: 587,
        secure: false, // use SSL
        auth: {
            user: '1a2b3c4d5e6f7g',
            pass: '1a2b3c4d5e6f7g',
        }
    });

    // Configure the mailoptions object
    const mailOptions = {
        from: 'stokkap@email.com',
        to: 'hedwinot@gmail.com',
        subject: 'Sending Email using Node.js',
        text: 'That was easy!'
    };

    // Send the email
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('Error: ' + error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};