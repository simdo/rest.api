const bcrypt    = require('bcrypt')
const jwt       = require('jsonwebtoken')
const env       = require('../../../env.json')
const postmark  = require('postmark')

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
  }, env.secret, {
    expiresIn: 7*24*60*60 // expires in 24 hours
  })
}

/**
 * Send Email letter with confirmation url
 *
 * @param {Function} callback
 */
exports.sendEmail = function(doc, type, callback) {
  var options = {
    From: env.from_email,
    To: doc.email || env.to_email,
    TemplateModel: {
      support_email : doc.email,
      product_name  : env.product,
      company_name  : env.company
    }
  }
  switch (type) {

    // send confirmation welcome mail
    case 'welcome':
    // resend confirmation welcome mail
    case 'resend':
      options.TemplateId = env.postmark.welcome
      options.TemplateModel.action_url = env.hosts.app + '/confirm/' + doc.verifyToken + '/'
      options.TemplateModel.login_url  = env.hosts.app + '/signin/'
      options.TemplateModel.username   = doc.email
      break

    // reset password
    case 'reset':
      options.TemplateId = env.postmark.reset
      options.TemplateModel = {
        action_url    : env.hosts.app + '/reset/' + doc.verifyToken + '/',
      }
      break

    // letter about succesfully changed password
    case 'password':
      options.TemplateId = env.postmark.password
      break

    // send email about successfully authorisation with IP address, user-agent, 
    // datetime and other important information if user email notifications is enabled
    case 'security':
      options.TemplateId = env.postmark.security
      break

    // by default
    default:
      return callback('Invalid sendmail type')
  }
  // postmark client send with templates see https://github.com/wildbit/postmark.js
  const client = new postmark.Client(env.postmark.secret)
  client.sendEmailWithTemplate(options, callback)
}
