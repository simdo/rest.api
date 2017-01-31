const User      = require('../models/user')

/**
 * Get all users
 * 
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @return void
 */
exports.list = function (req, res, next) {
  // authorization required
  var user = req.docUser;
  if (! user) {
    return res.status(401).json({ message: 'No authentication data provided' });
  }
  if (user.role !== 'Manager') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  User.findOneBy({
      criteria: { removed: false },
      select: 'email name password role',
      limit: 32
    }, function(err, doc) {
      if (err)
        res.status(500).json(err)
      else if (! doc)
        res.status(500).json({ message: 'Cannot get users list' })
      else
        res.status(200).json(docs)
    })
}

/**
 * Create new user record
 * 
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @return void
 */
exports.create = function (req, res, next) {
  // create
}

/**
 * Sign In User
 * 
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @return void
 */
exports.signin = function (req, res, next) {
  User.signIn({
    email: req.body.email || '',
    password: req.body.password || '',
    useragent: req.headers['user-agent'] || ''
  }, function (err, doc) {
    if (err)
      res.status(400).json(err)
    else if (! doc)
      res.status(400).json({ message: 'Forbidden' })
    else {
      res.status(200).json(doc)
    }
  })
}

/**
 * Sign Up User
 * 
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @return void
 */
exports.signup = function (req, res, next) {
  User.signUp({
    email: req.body.email || '',
    phone: req.body.phone || '',
    password: req.body.password || '',
    useragent: req.headers['user-agent'] || ''
  }, function (err, doc) {
    if (err)
      res.status(400).json(err)
    else if (! doc)
      res.status(400).json({ message: 'Sign Up failed' })
    else {
      res.status(200).json(doc)
    }
  })
}

/**
 * Update User profile w/o password
 * 
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @return void
 */
exports.updateProfile = function (req, res, next) {
  // authorisation required
  const authorised = false
  if (! authorised)
    res.status(401).json({message: 'No authentication data provided'})
  else {
    User.updateProfile(
      user._id,
      {
        name: req.body.name || '',
        phone: req.body.phone || ''
      }, function (err) {
        if (err)
          res.status(400).json(err)
        else
          res.status(204).end() // successfully update user profile
        }
    )
  }
}

/**
 * Update User security w/ password
 * 
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @return void
 */
exports.changePassword = function (req, res, next) {
  // authorisation required
  const authorised = false
  if (! authorised)
    res.status(401).json({message: 'No authentication data provided'})
  else {
    User.changePassword(authorised._id, { current: req.body.currentPassword, password: req.body.password }, function (err) {
      if (err)
        res.status(400).json(err)
      else
        res.status(204).end() // successfully update new user password
    })
  }
}

/**
 * Resend Validation Email to Users email
 * 
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @return void
 */
exports.resendConfirmationEmail = function (req, res, next) {
  // authorisation required
  const authorised = false
  if (! authorised)
    res.status(401).json({message: 'No authentication data provided'})
  else {
    User.confirmationEmail(authorised._id, true, function (err) {
      if (err)
        res.status(400).json(err)
      else
        res.status(204).end() // successfully confirmation user email by token
    })
  }
}

/**
 * Send mail confirmation/notification about reset password action
 * 
 * @param {Object} req
 * @param {Object} res
 * @return void
 */
exports.resetPassword = function (req, res, next) {
  // authorisation doesn't required
  User.confirmationReset(req.body.email, function (err) {
    if (err)
      res.status(400).json(err)
    else
      res.status(204).end() // successfully confirmation user email by token
  })
}

/**
 * Confirm User email from mail letter by token
 * 
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @return void
 */
exports.confirmEmailToken = function (req, res, next) {
  User.confirmEmailToken(req.params.token, function (err) {
    if (err)
      res.status(400).json(err)
    else
      res.status(204).end() // successfully confirmation user email by token
  })
}

/**
 * Validate Reset Password Token from email and update User password and send email notification
 * 
 * @param {Object} req
 * @param {Object} res
 * @return void
 */
exports.confirmResetToken = function (req, res, next) {
  const password = req.body.password
  if (! password || password.length === 0)
    res.status(400).json({ message: 'Fill out password field' })
  else {
    User.confirmEmailToken(req.params.token, function (err, doc) {
      if (err)
        res.status(400).json(err)
      else if (! doc)
        res.status(400)({ message: 'User document undefined after email confirmation token' })
      else {
        doc.password = password
        doc.save(function (err) {
          if (err)
            res.status(400).json(err)
          else
            // TODO: send email about successfully changed password like gmail letters...
            res.status(204).end() // successfully confirmation user email by token
        })
      }
    })
  }
}
