const mongoose 	= require('mongoose')
const url       = require('../../env.json').mongodb

// Reusable mongoose connect function
const mongooseConnect = function() {
  mongoose.connect(url, { server: { auto_reconnect: true } })
}

// [Use native promises for backwards compatibility. Mongoose 4 returns mpromise
// promises by default.](http://mongoosejs.com/docs/promises.html)
mongoose.Promise = Promise

// Mongoose auto_reconnect flag for true doesn't work when we get error then we need seft reconnect
mongoose.connection.on('error', function() {
  mongoose.disconnect()
})

mongoose.connection.on('disconnected', function() {
  setTimeout(mongooseConnect, 10240)
})

// connect to local mongodb by default if it not specified in env
mongooseConnect()

/**
 *  This function is executed every time the app receives a request and check
 *  mongodb readyState flag: 
 *  0 = disconnected
 *  1 = connected
 *  2 = connecting
 *  3 = disconnecting
 *
 *  @method
 *  @memberOf Mongoose Middleware
 *  @param {Object} req request object
 *  @param {Object} res response object
 *  @param {Object} next next function
 *  @return {Object} error objec
 */
exports.checkState = function (req, res, next) {
    if (mongoose.connection.readyState !== 1) {
        var err = new Error('Database connection is not established')
        err.status = 500
        next(err)
    }

    next()
}
