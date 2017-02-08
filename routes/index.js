const {Router}    = require('express')
const product     = require('../env.json').product
const version     = require('../package.json').version
const app         = Router()

/* get home url */
app.get('/', function(req, res, next) {
  res.status(200).json({ message: product + ' ' + version })
})

module.exports = app
