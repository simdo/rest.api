const {Router}    = require('express')
const controller  = require('../controllers/user')
const app         = Router()

app.route('/')
  .get(controller.list)
  .post(controller.create)

// signin user
app.route('/signin')
  .post(controller.signin)

// signup new user
app.route('/signup')
  .post(controller.signup)

// update user profile
app.route('/profile')
  .put(controller.updateProfile)

// update user password
app.route('/security')
  .put(controller.changePassword)

// resend user email verification token to user.email
app.route('/confirm/resend')
  .get(controller.resendConfirmationEmail)

// validate user token from `email verification` action
app.route('/confirm/:token')
  .get(controller.confirmEmailToken)

// send to user email verification token from `reset password` action
app.route('/reset')
  .post(controller.resetPassword)

// validate user token `reset password` action and update password
app.route('/reset/:token')
  .post(controller.confirmResetToken)

module.exports = app