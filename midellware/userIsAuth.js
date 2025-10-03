const jwt = require('jsonwebtoken');
const db = require('../app/model/index');
require('dotenv').config();

const userIsAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        
        if (!token) {
            return res.status(401).json({
                status: 'error',
                message: 'Token d\'accès requis'
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // CORRECTION: Vérifier si l'utilisateur existe ET si le token est encore valide en base
            const user = await db.User.findOne({ 
                where: { 
                    user_id: decoded.id,
                    token: token  // Vérifier que le token fourni correspond à celui en base
                },
                attributes: ['user_id', 'email', 'role', 'isActive', 'enterpriseName', 'token']
            });
            
            if (!user) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Token révoqué ou utilisateur non trouvé',
                    code: 'TOKEN_REVOKED'
                });
            }
            
            // Vérifier si le token en base correspond exactement à celui fourni
            if (user.token !== token) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Token révoqué - Veuillez vous reconnecter',
                    code: 'TOKEN_REVOKED'
                });
            }
            
            if (!user.isActive) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Compte utilisateur désactivé',
                    code: 'USER_INACTIVE'
                });
            }
            
            req.user = {
                id: user.user_id,
                role: user.role,
                email: user.email,
                enterpriseName: user.enterpriseName,
                isActive: user.isActive
            };
            
            next();
            
        } catch (jwtError) {
            if (jwtError.name === 'TokenExpiredError') {
                return res.status(401).json({
                    status: 'error',
                    message: 'Token expiré',
                    code: 'TOKEN_EXPIRED'
                });
            } else if (jwtError.name === 'JsonWebTokenError') {
                return res.status(403).json({
                    status: 'error',
                    message: 'Token invalide',
                    code: 'TOKEN_INVALID'
                });
            } else {
                throw jwtError;
            }
        }

    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Erreur interne du serveur'
        });
    }
};

module.exports = userIsAuth;