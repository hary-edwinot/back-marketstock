const { Op } = require('sequelize')
const { Product, User, Status, Category } = require('../model')
const paginatedResponse = require('../utils/paginatedResponse')

exports.createProduct = async (req, res) => {
  await Product.create(req.body)
    .then(product => {
      const message = 'Produit ajoute avec succes'
      res.status(200).json({ status: 'success', message, data: product })
    })
    .catch(error => {
      res.status(500).json({
        status: 'error',
        error: error.message
      })
    })
}

exports.findAllProducts = async (req, res) => {
  const search = req.query.search || ''
  const { page, limit, offset, sort, order } = req.pagination

  await Product.findAndCountAll({
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['user_id', 'firstName', 'lastName', 'email', 'isActive']
      },
      {
        model: Category,
        as: 'category'
      },
      {
        model: Status,
        as: 'status'
      }
    ],
    where: {
      [Op.or]: [
        { name: { [Op.like]: `%${search}%` } },
        { lot: { [Op.like]: `%${search}%` } },
        { size: { [Op.like]: `%${search}%` } },
        { color: { [Op.like]: `%${search}%` } }
      ]
    },
    limit,
    offset,
    order: [[sort, order]]
  })
    .then(({ count, rows }) => {
      res.status(200).json(paginatedResponse(rows, count, page, limit))
    })
    .catch(error => {
      res.status(500).json({
        status: 'error',
        message: error.message
      })
    })
}

exports.findById = async (req, res) => {
  const { id } = req.params

  await Product.findOne({
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['user_id', 'firstName', 'lastName', 'email', 'isActive']
      },
      {
        model: Category,
        as: 'category'
      },
      {
        model: Status,
        as: 'status'
      }
    ],
    where: { id }
  })
    .then(product => {
      if (!product) {
        const message = "donnees n'existe plus dans le base de donnees"
        res.status(404).json({ message: message })
      }
      res.status(200).json({ data: product })
    })
    .catch(error => {
      res.status(500).json({
        status: 'error',
        message: error.message
      })
    })
}

exports.updateProduct = async (req, res) => {
  const { id } = req.params

  await Product.update(req.body, {
    where: {
      id: id
    }
  })
    .then(_ => {
      const message = 'modifie avec success'
      Product.findByPk(id).then(product => {
        res.status(200).json({
          status: 'success',
          message: message,
          data: product
        })
      })
    })
    .catch(error => {
      res.status(500).json({
        status: 'error',
        message: error.message
      })
    })
}

exports.deleteProduct = async (req, res) => {
  const { id } = req.params

  const product = await Product.findOne({
    where: { id: id }
  })
  const message = "produit n'existe pas dans la base"
  if (!product) {
    res.status(404).json({
      status: 'error',
      message: message
    })
  }

  await Product.destroy({
    where: {
      id: product.id
    }
  })
    .then(_ => {
      const message = 'suppression effectue avec succes'
      res.status(200).json({
        status: 'success',
        message: message
      })
    })
    .catch(error => {
      res.status(500).json({
        status: 'erreur',
        message: error.message
      })
    })
}
