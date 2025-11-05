const db = require('../model/index');
const Client = db.Client;
const { generateOrderNumber } = require('../../midellware/generateOrderNumberFunc');
const { db_connection } = require('../config/db_connection')

exports.newClient = async (req, res) => {
  const t = await db_connection.transaction(); // ✅ CORRECTION: db_connection au lieu de db_connection

  console.log('Data reçue:', req.body); // ✅ DEBUG

  try {

    const client = await Client.create(req.body, { transaction: t });
    await t.commit();

    const message = 'Client ajouté avec succès';
    res.status(201).json({
      status: 'success',
      message,
      data: client
    });

  } catch (error) {
    await t.rollback();
    console.error("❌ Error creating client:", error);
    res.status(500).json({
      status: 'error',
      error: error.message
    });
  }
};

exports.getAllClients = async (req, res) => {
  try {
    const clients = await Client.findAll({
      order: [['created_at', 'DESC']] // ✅ CORRECTION: created_at au lieu de createdAt
    });

    res.status(200).json({
      status: 'success',
      count: clients.length,
      data: clients // ✅ CORRECTION: data au lieu de clients pour cohérence
    });

  } catch (error) {
    console.error("❌ Error fetching clients:", error);
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la récupération des clients',
      error: error.message
    });
  }
};

exports.getClientsListByUserId = async (req, res) => {
  try {
    const { user_id } = req.params;

    // ✅ VALIDATION: Vérifier que user_id est fourni
    if (!user_id || user_id === 'undefined' || user_id.trim() === '') {
      return res.status(400).json({
        status: 'error',
        message: 'Le paramètre user_id est requis'
      });
    }

    console.log('🔍 User ID reçu:', user_id); // ✅ DEBUG

    const clients = await Client.findAll({ // ✅ CORRECTION: Client au lieu de db.Client
      where: { user_id: user_id },
      order: [['created_at', 'DESC']]
    });

    console.log(`✅ ${clients.length} clients trouvés pour l'utilisateur ${user_id}`); // ✅ DEBUG

    res.status(200).json({
      status: 'success',
      count: clients.length,
      data: clients
    });

  } catch (error) {
    console.error("❌ Error fetching clients by user:", error);
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la récupération des clients',
      error: error.message
    });
  }
};

// ✅ NOUVELLE FONCTION: Récupérer un client par ID
exports.getClientById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id === 'undefined' || id.trim() === '') {
      return res.status(400).json({
        status: 'error',
        message: 'Le paramètre id est requis'
      });
    }

    const client = await Client.findByPk(id);

    if (!client) {
      return res.status(404).json({
        status: 'error',
        message: 'Client non trouvé'
      });
    }

    res.status(200).json({
      status: 'success',
      data: client
    });

  } catch (error) {
    console.error("❌ Error fetching client by ID:", error);
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la récupération du client',
      error: error.message
    });
  }
};

// ✅ NOUVELLE FONCTION: Mettre à jour un client
exports.updateClient = async (req, res) => {
  const t = await db_connection.transaction();
  try {
    const { id } = req.params;

    if (!id || id === 'undefined' || id.trim() === '') {
      await t.rollback();
      return res.status(400).json({
        status: 'error',
        message: 'Le paramètre id est requis'
      });
    }

    const client = await Client.findByPk(id);
    if (!client) {
      await t.rollback();
      return res.status(404).json({
        status: 'error',
        message: 'Client non trouvé'
      });
    }

    await client.update(req.body, { transaction: t });
    await t.commit();

    res.status(200).json({
      status: 'success',
      message: 'Client mis à jour avec succès',
      data: client
    });

  } catch (error) {
    await t.rollback();
    console.error("❌ Error updating client:", error);
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la mise à jour du client',
      error: error.message
    });
  }
};

// ✅ FONCTION DE DIAGNOSTIC
exports.getClientColumns = async (req, res) => {
  try {
    const client = await Client.findOne();

    if (client) {
      res.status(200).json({
        status: 'success',
        message: 'Structure de la table Clients',
        columns: Object.keys(client.dataValues)
      });
    } else {
      res.status(404).json({
        status: 'error',
        message: 'Aucun client trouvé'
      });
    }

  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message
    });
  }
};