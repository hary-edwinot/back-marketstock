const db = require('../model/index');
const bcrypt = require('bcrypt'); 
require('dotenv').config();
const User = db.User;

exports.createUser = async (req, res) => {
    try {
        const { firstName, email, password, lastName, country, city, role, enterpriseName, abonmentType } = req.body;

        // Validation des données d'entrée
        if (!firstName || !email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'firstName, email et password sont requis'
            });
        }

        //Hash le mot de passe avec bcrypt (méthode moderne async/await)
        const saltRounds = 12; // Nombre de rounds de salt (recommandé: 10-12)
        const passwordWithIV = password + process.env.PASSWORD_IV; // Ajouter l'IV au mot de passe
        const hashedPassword = await bcrypt.hash(passwordWithIV, saltRounds);

        //Créer l'utilisateur
        const user = await User.create({
            firstName,
            email,
            password: hashedPassword,
            lastName,
            country,
            city,
            role,
            enterpriseName,
            abonmentType
        });

        //Retourner l'utilisateur sans le mot de passe
        const { password: _, ...userWithoutPassword } = user.toJSON();

        res.status(201).json({
            status: 'success',
            message: 'Utilisateur créé avec succès',
            data: userWithoutPassword
        });

    } catch (err) {

        //Gestion d'erreurs spécifiques
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({
                status: 'error',
                message: 'Un utilisateur avec cet email existe déjà'
            });
        }

        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la création de l\'utilisateur',
            error: err.message
        });
    }
};





exports.getAllUsers = async (req, res) => {
    try {
        // Ne pas retourner les mots de passe
        const users = await User.findAll({
            attributes: { exclude: ['password'] }
        });

        res.status(200).json({
            status: 'success',
            data: users,
            count: users.length
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la récupération de la liste des utilisateurs',
            error: err.message
        });
    }
};





exports.getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password'] } // Exclure le mot de passe
        });

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'Aucun utilisateur trouvé avec cet identifiant'
            });
        }

        res.status(200).json({
            status: 'success',
            data: user
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la récupération de l\'utilisateur via son identifiant',
            error: err.message
        });
    }
};
