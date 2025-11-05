const db = require('../model/index');
const Ville = db.Ville;
const { db_connection } = require('../config/db_connection')

exports.getLocalisation = async (req, res) => {
    const t = await db_connection.transaction()
    try {
        const ville = await Ville.findAll({ transaction: t })
        await t.commit()
        res.status(200).json({ status: 'success', data: ville })
    } catch (error) {
        await t.rollback()
        res.status(500).json({ status: 'error', message: error.message })
    }

};

