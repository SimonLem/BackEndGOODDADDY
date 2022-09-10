// Import basique d'express
var express = require("express");
var router = express.Router();
// Création des identifiants pour les utilisateurs (imports module uid2)
var uid2 = require("uid2");
// Hash sécurisé des password
var bcrypt = require("bcrypt");
//
var userModel = require("../models/user");


// route pour la création d'un nouvel utilisateur et l'enregistrement de ce dernier dans une bdd
router.post("/register", async function (req, res, next) {
  var error = [];
  var result = false;
  var saveUser = null;
  var userToken = null;
// Checks if user with email exists in DB
  const data = await userModel.findOne({
    email: req.body.email,
  });
// Si l'utilisateur existe, on renvoie error "utilisateur déjà inscrit"
  if (data != null) { // si data n'est pas nul
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

  if (error.length == 0) { // condition de création de nouvel utilisateur si il n'existe pas    
    // para1 mdp para2 salt(var aléatoire)
    // diff hashsync et hash (un retourne promesse[HASH], et l'autre immédiatement[HASHSYNC])
    var hash = bcrypt.hashSync(req.body.password, 10); // création de la méthode hash du mot de passe avec un paramètre 10 par défaut
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

    saveUser = await newUser.save(); // sauvegarde le nouvel utilisateur avec toutes ses infos

    if (saveUser) { // Si saveUser est true 
      result = true;
      userToken = saveUser.userToken; 
    }
  }

  res.json({ result, saveUser, error, userToken }); // retourne le résultat de l'opération POST (true/false, si enregistré, si erreur et le token utilisateur)
});

// route pour le sign in d'un user, comparaison d'infos user(input) avec les infos en bdd.
router.post("/sign-in", async function (req, res, next) { // fonction asynchrone, la ligne suivante est exécutée avant que la fonction ait terminé le traitement
  var result = false; //boolean 
  var user = null;
  var error = []; // type d'error = liste
  var userToken = null;
  if (req.body.email == "" || req.body.password == "") {
    error.push("champs vides");
  }

  if (error.length == 0) {
    user = await userModel.findOne({ // méthode de temporisation AWAIT en lien avec async, on attend la fin de l'exécution de userModel.findOne() avant de continuer le traitement de la suite
      email: req.body.email, //l'utilisateur qui a cet email
    });

    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) { // Comparaison du mot de passe en BDD (user.password) avec le password saisi par l'utilisateur (req.body.password)
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
// userToken : est utilisée pour faire  des requetes, SANS demander username et password à CHAQUE fois.
  res.json({ result, error, userToken }); // prendre result error usertoken et les renvoyer au frontend sous format JSON
});
// route pour update user qui a le token correspondant (userToken) et set type investor
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
  // get usertoken from request , if empty => utilisateur non identifié (si le frontend n'envoie pas de usertoken => non identifié)
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

router.post("/test", async function (req, res, next) {

    result = await userModel.updateOne(
      { userToken: "SHGO_60RKpZGYkJ_tlE8nSe9aDa_Sevb" },
      {
        walletHistory: [{
          date: "August 02, 2022 23:15:00",
          amountBTC: 1
        },{
          date: "August 03, 2022 23:15:00",
          amountBTC: 2
        },{
          date: "August 04, 2022 23:15:00",
          amountBTC: 3
        },{
          date: "August 05, 2022 23:15:00",
          amountBTC: 4
        },{
          date: "August 06, 2022 23:15:00",
          amountBTC: 5
        },{
          date: "August 07, 2022 23:15:00",
          amountBTC: 6
        },{
          date: "August 08, 2022 23:15:00",
          amountBTC: 10
        }]
      }
    );
  
  res.json({ result });
});

module.exports = router;
