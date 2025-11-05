const db = require('../model/index');
const FactureProduct = db.FactureProduct;
const { db_connection } = require('../config/db_connection')

exports.createFactureOfProduct = async (req, res) => {
    const t = await db_connection.transaction(); // ✅ CORRECTION: db_connection au lieu de db_connection

    console.log('Data reçue:', req.body); // ✅ DEBUG

    try {
        const facture = await FactureProduct.create(req.body, { transaction: t });
        await t.commit();
        const message = 'FactureProduct créée avec succès';
        res.status(201).json({
            status: 'success',
            message,
            data: facture
        });

    } catch (error) {
        await t.rollback();
        console.error("❌ Error creating factureProduct:", error);
        res.status(500).json({
            status: 'error',
            error: error.message
        });
    }
};