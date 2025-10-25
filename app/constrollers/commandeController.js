const db = require('../model/index');
const Commande = db.Commande;
const { generateOrderNumber } = require('../../midellware/generateOrderNumberFunc');

exports.newCommande = async (req, res) => {
    try {
        const { price, product_name, quantity, destination_name, destination_lat, destination_long, delivery_person_id } = req.body;

        // ✅ 1. VALIDATION AVANT la création
        if (!price || !product_name || !quantity || !destination_name) {
            return res.status(400).json({
                status: 'error',
                message: 'Les champs price, product_name, quantity et destination_name sont obligatoires'
            });
        }

        // ✅ 2. GÉNÉRATION du order_number AVANT la création
        const orderNumber = generateOrderNumber(); // ou un autre ID

        // ✅ 3. CRÉATION avec le order_number inclus
        const newCommande = await Commande.create({
            order_number: orderNumber, // ✅ Inclure dès la création
            price,
            product_name,
            quantity,
            destination_name,
            destination_lat,
            destination_long,
            delivery_person_id 
        });

        res.status(201).json({
            status: 'success',
            message: 'Commande créée avec succès',
            commande: newCommande
        });

    } catch (error) {
        console.error("Error creating commande:", error);
        res.status(500).json({ 
            status: 'error',
            message: 'Erreur lors de la création de la commande',
            error: error.message 
        });
    }
};

exports.getAllCommandes = async (req, res) => {
    try {
        const commandes = await Commande.findAll({
            order: [['createdAt', 'DESC']]
        });
        
        res.status(200).json({
            status: 'success',
            count: commandes.length,
            commandes
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