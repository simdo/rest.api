const mongoose    = require('mongoose')
const timestamps  = require('mongoose-timestamp')
const bcrypt      = require('bcrypt')

/**
 * Check for bad emails
 * 
 * @param {String} email
 * @return {Boolean}
 */
var validateEmail = function(value) {
  return !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,32}$/i.test(value)
}

// User schema
var UserSchema  = new mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
    // We can set option `unique` for true. But if we want to save relations between
    // user generated content and removed user we can't remove user record from DB.
    // Only that we need it create add boolean flag `removed`.
    // unique: true,
    required: [true, 'Email field is required'],
    // validate: [validateEmail, 'Please fill a valid email address'],
    match: [/@/, 'Please fill a valid email address'],
    minlength: [5, 'The value of path `{PATH}` (`{VALUE}`) is shorter than the minimum allowed length ({MINLENGTH}).'],
    maxlength: [255, 'The value of path `{PATH}` (`{VALUE}`) exceeds the maximum allowed length ({MAXLENGTH}).']
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  name: String,
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [5, 'The value of path `{PATH}` (`{VALUE}`) is shorter than the minimum allowed length ({MINLENGTH}).']
  },
  role: {
    type: String,
    enum: 'User Manager Admin'.split(' '),
    default: 'User'
  },
  phone: {
    type: String,
    validate: {
      validator: function(v) {
        // return /\d{3}-\d{3}-\d{2}-\d{2}/.test(v)
        // 900 123 45 67
        return /\d{10}/.test(v)
      },
      message: '{VALUE} is not a valid phone number!'
    },
    required: [true, 'User phone number required']
  },
  verifyToken: String,
  verifyTokenExpires: Date,
  removed: {
    type: Boolean,
    default: false
  }
})

/**
 * Encrypt the password every time it is modified
 *
 * @type {String}
 */
UserSchema.pre('save', true, function (next, done) {
  next()
  if (this.isModified('password')) {
    bcrypt.hash(this.password, 10, (err, hash) => {
      if (err) {
        done(err)
      } else {
        this.password = hash
        done()
      }
    })
  } else {
    done()
  }
})

/**
 * Check unique not removed User email address
 *
 * @type {String}
 */
// UserSchema.path('email').validate(function (value, respond) {
//   // find not removed users
//   this.findOne({ email: value, removed: false }, function (err, doc) {
//     if (doc) respond(false)
//   })
// }, 'This email address is already in use')

/**
 * Simple plugin for Mongoose which adds createdAt and updatedAt date attributes that
 * get auto-assigned to the most recent create/update timestamp.
 *
 * @type {Dates}
 */
UserSchema.plugin(timestamps)
UserSchema.statics = require('./statics')
UserSchema.methods = require('./methods')

module.exports = mongoose.model('User', UserSchema)
