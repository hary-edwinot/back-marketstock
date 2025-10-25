const { Op, where } = require('sequelize')
const { History, Product, User, Category, Status } = require('../model')
const paginatedResponse = require('../utils/paginatedResponse')

exports.updateHistory = async (req, res) => {
  const { id } = req.params

  await History.update(req.body, {
    where: {
      id: id
    }
  })
    .then(_ => {
      const message = 'modifie avec success'
      History.findByPk(id).then(history => {
        res.status(200).json({
          status: 'success',
          message: message,
          data: history
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

exports.getAllHistory = async (req, res) => {
  const search = req.query.search || ''
  const { page, limit, offset, sort, order } = req.pagination

  await History.findAndCountAll({
    include: [
      {
        model: Product,
        as: 'product',
        where: {
          [Op.or]: [
            { name: { [Op.like]: `%${search}%` } },
            { lot: { [Op.like]: `%${search}%` } },
            { size: { [Op.like]: `%${search}%` } },
            { color: { [Op.like]: `%${search}%` } }
          ]
        },
        include: [
          {
            model: User,
            as: 'user',
            where: {
              [Op.or]: [
                { firstName: { [Op.like]: `%${search}%` } },
                { lastName: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } },
                { enterpriseName: { [Op.like]: `%${search}%` } }
              ]
            },
            attributes: [
              'user_id',
              'firstName',
              'lastName',
              'email',
              'isActive'
            ]
          },
          {
            model: Category,
            as: 'category',
            where: {
              name: { [Op.like]: `%${search}%` }
            }
          },
          {
            model: Status,
            as: 'status',
            where: {
              name: { [Op.like]: `%${search}%` }
            }
          }
        ]
      }
    ],
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

  await History.findOne({
    include: [
      {
        model: Product,
        as: 'product',
        include: [
          {
            model: User,
            as: 'user',
            attributes: [
              'user_id',
              'firstName',
              'lastName',
              'email',
              'isActive'
            ]
          },
          {
            model: Category,
            as: 'category'
          },
          {
            model: Status,
            as: 'status'
          }
        ]
      }
    ],
    where: { id }
  })
    .then(history => {
      if (!history) {
        const message = "donnees n'existe plus dans le base de donnees"
        res.status(404).json({ message: message })
      }
      res.status(200).json({ data: history })
    })
    .catch(error => {
      res.status(500).json({
        status: 'error',
        message: error.message
      })
    })
}

exports.deleteHistory = async (req, res) => {
  const { id } = req.params

  const history = await History.findOne({
    where: { id: id }
  })
  const message = "historie n'existe pas dans la base"
  if (!history) {
    res.status(404).json({
      status: 'error',
      message: message
    })
  }

  await History.destroy({
    where: {
      id: history.id
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
