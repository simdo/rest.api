const bcrypt    = require('bcrypt')
const jwt       = require('jsonwebtoken')
const jwtSecret = require('../../../env.json').secret

/**
 * Check current password
 *
 * @param {String} password
 * @param {Function} callback
 */
exports.comparePassword = function(password, callback) {
  bcrypt.compare(password, this.password, callback)
}

/**
 * Get jwt token by user object
 * 
 * @param {Object} doc
 * @return token
 */
exports.getToken = function(useragent) {
  // Dont use password and other sensitive fields
  // Use fields that are useful in other parts of the app/collections/models
  return jwt.sign({
    _id: this._id.toString(),
    useragent: useragent
  }, jwtSecret, {
    expiresIn: 7*24*60*60 // expires in 24 hours
  })
}

/**
 * Send Email letter with confirmation url
 *
 * @param {Function} callback
 */
exports.sendEmail = function(type, callback) {
  switch (type) {

    // send confirmation mail
    case 'welcome':
      callback()
      break;

    // resend confirmation mail
    case 'resend':
      callback()
      break;

    // reset password
    case 'reset':
      callback()
      break;

    // letter about succesfully changed password
    case 'password':
      callback()
      break;

    // by default
    default:
      callback('Invalid sendmail type')
  }
}
