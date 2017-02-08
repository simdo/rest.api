// import packages that we need
const express    = require('express')
const bodyParser = require('body-parser')
const mongoose   = require('./middleware/mongoose')

// import our api routes
const index      = require('./routes/index')
const user       = require('./routes/user')

// define base uri with api version protocol defined in package.json
const env         = require('./env.json')

// define app
var app         = express()

// remove x-powered-by header variable
app.disable('x-powered-by')
// ? app.disable('etag');

// 
app.use(mongoose.checkState)

// parse application/json
app.use(bodyParser.json())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// set 3000 port as default if it not specified in env
app.set('port', env.port || 3000)

// register api routes
app.use('/' + env.api.version, index)
app.use('/' + env.api.version + '/user', user)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handlers

// development error handler
// will print stacktrace
if (env.environment === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    })
  })
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  })
})

// start our rest api server
var server = app.listen(app.get('port'), function() {
  console.log('RESTful API server listening on port ' + server.address().port)
})

// prevent too long threshold
server.timeout = 2048
