var express = require("express");
var router = express.Router();

var uid2 = require("uid2");
var bcrypt = require("bcrypt");

var userModel = require("../models/user");

router.post("/register", async function (req, res, next) {
  var error = [];
  var result = false;
  var saveUser = null;
  var userToken = null;

  const data = await userModel.findOne({
    email: req.body.email,
  });

  if (data != null) {
    error.push("utilisateur déjà inscrit");
  }

  if (
    req.body.email == "" ||
    req.body.password == "" ||
    req.body.lastName == "" ||
    req.body.firstName == ""
  ) {
    error.push("champs vides");
  }

  if (error.length == 0) {
    var hash = bcrypt.hashSync(req.body.password, 10);
    var newUser = new userModel({
      email: req.body.email,
      password: hash,
      telephone: req.body.telephone,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      typeInvestor: req.body.typeInvestor,
      isAdmin: false,
      avatar: "",
      descriptionUser: "",
      operations: [],
      walletHistory: [],
      investment: [],
      userToken: uid2(32),
    });

    saveUser = await newUser.save();

    if (saveUser) {
      result = true;
      userToken = saveUser.userToken;
    }
  }

  res.json({ result, saveUser, error, userToken });
});

router.post("/sign-in", async function (req, res, next) {
  var result = false;
  var user = null;
  var error = [];
  var userToken = null;
  if (req.body.email == "" || req.body.password == "") {
    error.push("champs vides");
  }

  if (error.length == 0) {
    user = await userModel.findOne({
      email: req.body.email,
    });

    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        result = true;
        userToken = user.userToken;
      } else {
        result = false;
        error.push("mot de passe incorrect");
      }
    } else {
      error.push("email incorrect");
    }
  }

  res.json({ result, error, userToken });
});

router.post("/setTypeInvestor", async function (req, res, next) {
  var result = false;
  var error = [];
  if (req.body.userToken == "") {
    error.push("utilisateur non identifié");
  }

  if (error.length == 0) {
   result = await userModel.updateOne(
      { userToken: req.body.userToken },
      { typeInvestor: req.body.typeInvestor }
    );
  }
  res.json({ result, error });
});

router.get("/getTypeInvestor", async function (req, res, next) {
  var result = false;
  var error = [];
  var user = null;
  var typeInvestor = null;
  if (req.query.userToken == "") {
    error.push("utilisateur non identifié");
  }

  if (error.length == 0) {
    user = await userModel.findOne({
      userToken: req.query.userToken,
    });
    if (user) {
      console.log(user.typeInvestor)
      typeInvestor = user.typeInvestor;
      console.log(typeInvestor)
    } else {
      error.push("utilisateur inconnu");
    }
  }

  res.json({ result, error, typeInvestor });
});
module.exports = router;
