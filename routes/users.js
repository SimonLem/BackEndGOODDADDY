var express = require("express");
var router = express.Router();

var uid2 = require("uid2");
var bcrypt = require("bcrypt");

var userModel = require("../models/user");

// ******Route Register (SIGNUP) ou la création d'un compte utilisateur*******

router.post("/register", async function (req, res, next) {
  var error = [];
  var result = false;
  var saveUser = null;
  var userToken = null;

  // Vérifier si l'utilisateur est déja présent grace à son email

  const data = await userModel.findOne({
    email: req.body.email,
  });
  // Si l'utilisateur est déja en bdd on push une erreur
  if (data != null) {
    error.push("utilisateur déjà inscrit");
  }

  // Sécurité pour s'assurer que les champs requis sont renseignés pour la création du compte utilisateur
  if (
    req.body.email == "" ||
    req.body.password == "" ||
    req.body.lastName == "" ||
    req.body.firstName == ""
  ) {
    error.push("champs vides");
  }

  // *****Si pas d'erreur on peut alors créer le compte utilisateur******
  if (error.length == 0) {
    var hash = bcrypt.hashSync(req.body.password, 10); // Sécurisation du mot de passe avec bcrypt et définition de la longueur de hash
    var newUser = new userModel({
      email: req.body.email,
      password: hash, // le mot de passe est hashé en bdd
      telephone: req.body.telephone,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      typeInvestor: req.body.typeInvestor,
      isAdmin: false, // If is admin, peut publier des guides
      avatar: "",
      descriptionUser: "",
      operations: [],
      walletHistory: [],
      investment: [],
      userToken: uid2(32), // On affecte un Token à l'utilisateur avec UID2. Un identifiant unique à l'utilisateur
    });
    // Enregistrer l'utilisateur en bdd
    saveUser = await newUser.save();

    if (saveUser) {
      result = true;
      userToken = saveUser.userToken;
    }
  }

  res.json({ result, saveUser, error, userToken });
});

//*******ROUTE POUR LE SIGN-IN D'UN UTILISATEUR************** */

router.post("/sign-in", async function (req, res, next) {
  var result = false;
  var user = null;
  var error = [];
  var userToken = null;
  // Sécurité afin de vérifier que les champs de logins ne sont pas vides
  if (req.body.email == "" || req.body.password == "") {
    error.push("champs vides");
  }
// S'il n'y a pas d'erreur de champs vide, on peut donc aller vérifier la présence du user en bdd avec son email
  if (error.length == 0) {
    user = await userModel.findOne({
      email: req.body.email,
    });
// Si l'utilisateur existe, on compare donc les mots de passe
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        result = true;
        userToken = user.userToken; //Stocke le userToken pour faire la requette
      } else {
        result = false;
        error.push("mot de passe incorrect"); // Renvoyer une erreur
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
      console.log(user.typeInvestor);
      typeInvestor = user.typeInvestor;
      console.log(typeInvestor);
    } else {
      error.push("utilisateur inconnu");
    }
  }

  res.json({ result, error, typeInvestor });
});

router.post("/test", async function (req, res, next) {
  result = await userModel.updateOne(
    { userToken: "SHGO_60RKpZGYkJ_tlE8nSe9aDa_Sevb" },
    {
      walletHistory: [
        {
          date: "August 02, 2022 23:15:00",
          amountBTC: 1,
        },
        {
          date: "August 03, 2022 23:15:00",
          amountBTC: 2,
        },
        {
          date: "August 04, 2022 23:15:00",
          amountBTC: 3,
        },
        {
          date: "August 05, 2022 23:15:00",
          amountBTC: 4,
        },
        {
          date: "August 06, 2022 23:15:00",
          amountBTC: 5,
        },
        {
          date: "August 07, 2022 23:15:00",
          amountBTC: 6,
        },
        {
          date: "August 08, 2022 23:15:00",
          amountBTC: 10,
        },
      ],
    }
  );

  res.json({ result });
});

module.exports = router;
