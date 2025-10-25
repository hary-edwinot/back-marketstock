const { Category, Status } = require('../model')

exports.createCategory = async (req, res) => {
  await Category.create(req.body)
    .then(product => {
      const message = 'categorie ajoute avec succes'
      res.status(200).json({ status: 'success', message, data: product })
    })
    .catch(error => {
      res.status(500).json({
        status: 'error',
        error: error.message
      })
    })
}

exports.findAllCategory = async (req, res) => {
  await Category.findAll()
    .then(category => {
      res.status(200).json({ status: 'success', data: category })
    })
    .catch(error => {
      res.status(500).json({
        status: 'error',
        error: error.message
      })
    })
}

exports.deleteCategory = async (req, res) => {
  const { id } = req.params
  const category = await Category.findOne({
    where: { id: id }
  })
  if (!category) {
    const message = 'Categories introuvable'
    res.status(404).json({
      status: 'error',
      message: message
    })
  }
  await Category.destroy({
    where: {
      id: category.id
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
        status: 'error',
        message: error.message
      })
    })
}

//Status
exports.createStatus = async (req, res) => {
  await Status.create(req.body)
    .then(product => {
      const message = 'status ajoute avec succes'
      res.status(200).json({ status: 'success', message, data: product })
    })
    .catch(error => {
      res.status(500).json({
        status: 'error',
        error: error.message
      })
    })
}

exports.findAllStatus = async (req, res) => {
  await Status.findAll()
    .then(category => {
      res.status(200).json({ status: 'success', data: category })
    })
    .catch(error => {
      res.status(500).json({
        status: 'error',
        error: error.message
      })
    })
}

exports.deleteStatus = async (req, res) => {
  const { id } = req.params
  const status = await Status.findOne({
    where: { id: id }
  })
  if (!status) {
    const message = 'Statut introuvable'
    res.status(404).json({
      status: 'error',
      message: message
    })
  }
  await Status.destroy({
    where: {
      id: status.id
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
        status: 'error',
        message: error.message
      })
    })
}
