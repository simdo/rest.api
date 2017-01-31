// import packages that we need
var express = require('express');

// get an instance of the express Router
var router	= express.Router();

/* get home url */
router.get('/', function(req, res, next) {
  res.json({ message: 'RESTful API Service' });
});

module.exports = router;
