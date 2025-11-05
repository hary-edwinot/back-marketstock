const db = require('../model/index');
const Commande = db.Commande;
const Facture = db.Facture;
const { generateOrderNumber } = require('../../midellware/generateOrderNumberFunc');
const { db_connection } = require('../config/db_connection')


// ✅ NOUVELLE FONCTION : Créer une nouvelle commande
exports.newCommande = async (req, res) => {
    const t = await db_connection.transaction()
    try {
        // 2. GÉNÉRATION du order_number AVANT la création
        const orderNumber = generateOrderNumber('CMD'); // ou un autre ID
        req.body.commande_number = orderNumber;
        const commande = await Commande.create(req.body, { transaction: t })



        // Création de la facture associée à la commande
        const factureNumber = generateOrderNumber('FAC');
        req.body.facture_number = factureNumber;
        req.body.commande_id = commande.commande_id;
        const facture = await Facture.create(req.body, { transaction: t });
        await t.commit();


        const message = `Commande ${orderNumber} et Facture ${factureNumber} créées avec succès`
        res.status(201).json({ status: 'success', message, data: { commande, facture } })
        
    } catch (error) {
        await t.rollback()
        res.status(500).json({
            status: 'error',
            error: error.message
        })
    }
};

// ✅ NOUVELLE FONCTION : Récupérer les commandes par ID du créateur
exports.getCommandesByCreator = async (req, res) => {
    try {
        const { creator_id } = req.params;

        // VALIDATION: Vérifier que creator_id est fourni et valide
        if (!creator_id || creator_id === 'undefined' || creator_id.trim() === '') {
            return res.status(400).json({
                status: 'error',
                message: 'Le paramètre creator_id est requis et ne peut pas être undefined ou vide',
                received: creator_id
            });
        }

        const commandes = await Commande.findAll({
            where: { commande_creator_id: creator_id },
            include: [
                // ✅ Association avec Client
                {
                    model: db.Client,
                    as: 'client',
                    attributes: ['client_id', 'client_name', 'client_email', 'client_phone', 'client_address']
                },
                // ✅ Association avec Status
                {
                    model: db.Status,
                    as: 'status',
                    attributes: ['status_id', 'status_name', 'status_type']
                },
                // ✅ Association avec User (créateur)
                {
                    model: db.User,
                    as: 'creator',
                    attributes: ['user_id', 'firstName', 'lastName'],
                    required: false // LEFT JOIN au cas où il n'y aurait pas de créateur
                },
                // ✅ Association avec User (livreur)
                {
                    model: db.User,
                    as: 'deliveryPerson',
                    attributes: ['user_id', 'firstName', 'lastName'],
                    required: false // LEFT JOIN au cas où il n'y aurait pas de livreur assigné
                }
            ],
            order: [['created_at', 'DESC']]
        });

        console.log(`${commandes.length} commandes trouvées pour le créateur ${creator_id}`); // DEBUG

        res.status(200).json({
            status: 'success',
            count: commandes.length,
            creator_id: creator_id,
            data: commandes
        });

    } catch (error) {
        console.error("❌ Error fetching commandes by creator:", error);
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la récupération des commandes',
            error: error.message,
            creator_id: req.params.creator_id || 'undefined'
        });
    }
};

// ✅ NOUVELLE FONCTION : Commandes avec relations complètes
exports.getCommandesWithFullDetailsByCreatorId = async (req, res) => {
    try {
        const { creator_id } = req.params;
        const commandes = await Commande.findAll(
            {
                where: { commande_creator_id: creator_id },
                include: [
                    {
                        model: db.Client,
                        as: 'client'
                        // Inclure tous les champs du client
                    },
                    {
                        model: db.Status,
                        as: 'status'
                        // Inclure tous les champs du statut
                    },
                    {
                        model: db.User,
                        as: 'creator',
                        required: false
                        // Inclure tous les champs du créateur
                    },
                    {
                        model: db.User,
                        as: 'deliveryPerson',
                        required: false
                        // Inclure tous les champs du livreur
                    }
                ],
                order: [['created_at', 'DESC']]
            });

        res.status(200).json({
            status: 'success',
            count: commandes.length,
            data: commandes
        });

    } catch (error) {
        console.error("Error fetching commandes with full details:", error);
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la récupération des commandes avec détails',
            error: error.message
        });
    }
};

// ✅ NOUVELLE FONCTION : Mettre à jour une commande
exports.updateCommandeByCommandeCreatorId = async (req, res) => {
    const t = await db_connection.transaction();
    try {
        const { creator_id } = req.params;
        const updateData = req.body;

        const commande = await Commande.findOne({ where: { commande_creator_id: creator_id } });
        if (!commande) {
            return res.status(404).json({
                status: 'error',
                message: `Aucune commande trouvée pour le créateur avec ID ${creator_id}`
            });
        }
        await commande.update(updateData, { transaction: t });
        await t.commit();

        res.status(200).json({
            status: 'success',
            message: `Commande du créateur ${creator_id} mise à jour avec succès`,
            data: commande
        });
    } catch (error) {
        await t.rollback();
        console.error("Error updating commande:", error);
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la mise à jour de la commande',
            error: error.message,
            creator_id: creator_id
        });
    }
};


// ✅ NOUVELLE FONCTION : Récupérer une commande par ID du créateur
exports.getCommandeByIdAndCreatorId = async (req, res) => {
    try {
        const { commande_id, creator_id } = req.params;
        const commande = await Commande.findOne({
            where: {
                commande_id: commande_id,
                commande_creator_id: creator_id
            },
            include: [
                {
                    model: db.Client,
                    as: 'client'
                },
                {
                    model: db.Status,
                    as: 'status'
                },
                {
                    model: db.User,
                    as: 'creator',
                    required: false
                },
                {
                    model: db.User,
                    as: 'deliveryPerson',
                    required: false
                }
            ]
        });

        if (!commande) {
            return res.status(404).json({
                status: 'error',
                message: `Aucune commande trouvée avec l'ID ${id} pour le créateur ${creator_id}`
            });
        }

        res.status(200).json({
            status: 'success',
            data: commande
        });
    } catch (error) {
        console.error("Error fetching commande:", error);
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la récupération de la commande',
            error: error.message
        });
    }
};








// ✅ NOUVELLE FONCTION : Supprimer une commande
exports.deleteCommandeByCommandeCreatorId = async (req, res) => {
    const t = await db_connection.transaction();
    try {
        const { creator_id } = req.params;
        const commande = await Commande.findOne({ where: { commande_creator_id: creator_id } });
        if (!commande) {
            return res.status(404).json({
                status: 'error',
                message: `Aucune commande trouvée avec l'ID ${creator_id}`
            });
        }
        await commande.destroy({ transaction: t });
        await t.commit();
        res.status(200).json({
            status: 'success',
            message: `Commande avec l'ID ${id} supprimée avec succès`
        });
    } catch (error) {
        await t.rollback();
        console.error("Error deleting commande:", error);
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la suppression de la commande',
            error: error.message,
            id: id
        });
    }
};



















// ✅ NOUVELLE FONCTION : Récupérer toutes les commandes avec relations complètes
exports.getAllCommandes = async (req, res) => {
    try {
        const commandes = await Commande.findAll({
            include: [
                // ✅ Association avec Client
                {
                    model: db.Client,
                    as: 'client',
                    attributes: ['client_id', 'client_name', 'client_email', 'client_phone', 'client_address']
                },
                // ✅ Association avec Status
                {
                    model: db.Status,
                    as: 'status',
                    attributes: ['status_id', 'status_name', 'status_type']
                },
                // ✅ Association avec User (créateur)
                {
                    model: db.User,
                    as: 'creator',
                    attributes: ['user_id', 'firstName', 'lastName'],
                    required: false // LEFT JOIN au cas où il n'y aurait pas de créateur
                },
                // ✅ Association avec User (livreur)
                {
                    model: db.User,
                    as: 'deliveryPerson',
                    attributes: ['user_id', 'firstName', 'lastName'],
                    required: false // LEFT JOIN au cas où il n'y aurait pas de livreur assigné
                }, {
                    model: db.Facture,
                    as: 'facture',
                    attributes: ['facture_id', 'facture_montant_total', 'facture_total_ttc', 'facture_number', 'user_id', 'commande_id', 'facture_tva'],
                    required: false // LEFT JOIN au cas où il n'y aurait pas de facture associée    
                }

            ],
            order: [['created_at', 'DESC']]
        });

        res.status(200).json({
            status: 'success',
            count: commandes.length,
            data: commandes // CORRECTION: utiliser 'data' au lieu de 'commandes'
        });

    } catch (error) {
        console.error("Error fetching commandes:", error);
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la récupération des commandes',
            error: error.message
        });
    }
};
