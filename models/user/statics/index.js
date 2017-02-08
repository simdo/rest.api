const crypto      = require('crypto')
const {ObjectId}  = require('mongoose').Types

/**
 * Returns array documents of Users matching criteria.
 *
 * Example:
 *
 *      Schema.static({
 *        deleted: function (cb) {
 *          this.items({
 *            criteria: { removed: false },
 *            sort: { name: 'desc' }
 *            limit: 20,
 *            select: 'name email phone'
 *          }, cb)
 *        }
 *      })
 *
 * @param {Object} options
 * @param {Function} callback
 * @return void
 */
exports.findBy = function (options, callback) {
  var criteria = options.criteria || {}
  var sort = options.sort || { createdAt: -1 }
  var limit = options.limit === 0 ? 0 : (options.limit || 16)
  var page = options.page || 0
  var populate = options.populate || []
  var select = options.select || ''

  this.find(criteria)
    .select(options.select)
    .populate(options.populate)
    .sort(sort)
    .limit(limit)
    .skip(limit * page)
    .exec(cb)
}

/**
 * Returns document of User matching criteria.
 *
 * Example:
 *
 *      Schema.static({
 *        deleted: function (cb) {
 *          this.findOneBy({
 *            criteria: { removed: false, email: 'user@domain.mail' },
 *            populate: [{
 *              path: 'account', select: 'name', match: { removed: false }
 *            }]
 *          }, cb)
 *        }
 *      })
 *
 * @param {Object} options
 * @param {Function} callback
 * @return void
 */
exports.findOneBy = function (options, callback) {
  var criteria = options.criteria || {}
  var populate = options.populate || [];
  var select = options.select || '';

  this.findOne(criteria)
    .select(select)
    .populate(populate)
    .exec(callback)
}

/**
 * Sign in user by email and password
 *
 * @param {Object} fields
 * @param {Function} callback
 * @return void
 */
exports.signIn = function (fields, callback) {
  // TODO: validate form fields
  if (! fields.email || fields.email.length === 0)
    callback({ message: 'Fill out email field' })
  else if (! fields.password || fields.password.length === 0)
    callback({ message: 'Fill out password field' })
  else {
    this.findOneBy({
      criteria: {
        removed: false,
        email: fields.email.toLowerCase()
      },
      select: 'name password role'
    }, function(err, doc) {
      if (err)
        callback(err)
      else if (! doc)
        callback({ message: 'Forbidden' })
      else {
        doc.comparePassword(fields.password, function(err, valid) {
          if (! valid)
            callback({ message: 'Forbidden' })
          else {
            callback(null, {
              user: {
                name: doc.name,
                role: doc.role
              },
              token: doc.getToken(fields.useragent)
            })
            // TODO: send email about successfully authorisation with IP address, user-agent, 
            // datetime and other important information if user email notifications is enabled
            doc.sendEmail(doc, 'security', function(err) {})
          }
        })
      }
    })
  }
}

/**
 * Sign Up user by email and password, phone and other form fields
 *
 * @param {Object} fields
 * @param {Function} callback
 * @return void
 */
exports.signUp = function (fields, callback) {
  // TODO: validate form fields
  if (! fields.email || fields.email.length === 0)
    callback({ message: 'Fill out email field' })
  else if (! fields.password || fields.password.length === 0)
    callback({ message: 'Fill out password field' })
  else {
    var self = this
    self.findOneBy({
      criteria: {
        removed: false,
        email: fields.email.toLowerCase()
      },
      select: 'email'
    }, function(err, doc) {
      if (err)
        callback(err)
      else if (doc)
        callback({ message: 'Email address is already in use' })
      else {
        crypto.randomBytes(24, (err, buf) => {
          if (err) // throw err
            callback(err)
          else
            self.create({
              email               : fields.email.toLowerCase(),
              phone               : fields.phone,
              password            : fields.password,
              verifyToken         : buf.toString('hex'),
              verifyTokenExpires  : Date.now() + 3600000 * 24 // 24 hours
            }, (err, doc) => {
              if (err)
                callback(err)
              else if (! doc)
                callback({ error: '' })
              else {
                doc.sendEmail(doc, 'welcome', function(err) {
                  if (err) // throw err
                    callback(err)
                  else
                    callback(null, {
                      user: {
                        name: doc.name,
                        role: doc.role
                      },
                      token: doc.getToken(fields.useragent)
                    })
                })
              }
            })
        })
      }
    })
  }
}

/**
 * Confirm Email by token
 *
 * @param {String} token
 * @param {Function} callback
 * @return void
 */
exports.confirmEmailToken = function (token, callback) {
  // TODO: validate token
  if (! token || token.length === 0) {
    callback({ message: 'Invalid email confirmation token' })
  }
  else {
    this.findOneBy({
      criteria: {
        removed: false,
        verifyToken: token,
        verifyTokenExpires: {
          $gt: Date.now()
        }
      }
      // , select: 'name password role'
    }, function(err, doc) {
      if (err)
        callback(err)
      else if (! doc) {
        callback({ message: 'Invalid or otherwise expired email confirmation token' })
      }
      else {
        doc.isEmailVerified = true
        doc.verifyToken = undefined
        doc.verifyTokenExpires = undefined
        doc.save(callback)
      }
    })
  }
}

/**
 * Send confirmation email
 *
 * @param {String} id
 * @param {Boolean} resend
 * @param {Function} callback
 * @return void
 */
exports.confirmationEmail = function (id, resend, callback) {
  // TODO: validate form fields
  if (! id)
    callback({ message: 'No authentication data provided' })
  else {
    this.findOneBy({
      criteria: {
        removed: false,
        _id: ObjectId(id)
      },
      select: 'email name password role'
    }, function(err, doc) {
      if (err)
        callback(err)
      else if (! doc)
        callback({ message: 'User not found' })
      else {
        doc.sendEmail(doc, resend ? 'resend' : 'welcome', function(err) {
          if (err)
            callback(err)
          else
            callback()
        })
      }
    })
  }
}

/**
 * Send confirmation reset password email
 *
 * @param {String} email
 * @param {Function} callback
 * @return void
 */
exports.confirmationReset = function (email, callback) {
  // TODO: validate form fields
  if (! email)
    callback({ message: 'Fill out email field' })
  else {
    this.findOneBy({
      criteria: {
        removed: false,
        email: email
      },
      select: 'email name password role'
    }, function(err, doc) {
      if (err)
        callback(err)
      else if (! doc)
        callback({ message: 'User not found' })
      else {
        doc.sendEmail(doc, 'reset', function(err) {
          if (err)
            callback(err)
          else
            callback()
        })
      }
    })
  }
}

/**
 * Change current user password on new password
 *
 * @param {String} id
 * @param {Object} fields
 * @param {Function} callback
 * @return void
 */
exports.changePassword = function (id, fields, callback) {
  // TODO: validate form fields
  if (! fields.current || fields.current.length === 0)
    callback({ message: 'Incorrect current password' })
  else if (! fields.password || fields.password.length === 0)
    callback({ message: 'Fill out both password fields' })
  else {
    this.findOneBy({
      criteria: {
        removed: false,
        _id: ObjectId(id)
      }
      // , select: 'name password role'
    }, function(err, doc) {
      if (err)
        callback(err)
      else if (! doc)
        callback({ message: 'User not found' })
      else {
        doc.comparePassword(fields.current, function(err, valid) {
          if (! valid)
            callback({ message: 'Incorrect current password' })
          else {
            doc.password = fields.password
            doc.save(callback)
            // TODO: send email about successfully changed password like gmail letters...
            doc.sendEmail(doc, 'password', function(err) {})
          }
        })
      }
    })
  }
}

/**
 * Update user profile
 *
 * @param {String} id
 * @param {Object} fields
 * @param {Function} callback
 * @return void
 */
exports.updateProfile = function (id, fields, callback) {
  // TODO: validate form fields
  if (! fields.name || fields.name.length === 0)
    callback({ message: 'Fill out name field' })
  else {
    this.findOneBy({
      criteria: {
        removed: false,
        _id: ObjectId(id)
      }
      // , select: 'name password role'
    }, function(err, doc) {
      if (err)
        callback(err)
      else if (! doc)
        callback({ message: 'Invalid or otherwise expired token' })
      else {
        doc.name = fields.name
        doc.phone = fields.name
        doc.save(callback)
      }
    })
  }
}
