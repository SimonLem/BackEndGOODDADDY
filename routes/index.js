var express = require('express');
var router = express.Router();
var userModel = require("../models/user");


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
