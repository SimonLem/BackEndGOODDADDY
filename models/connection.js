var mongoose = require('mongoose');

// Déclaration des variables l'authentification à MongoDB Atlas
var user="admin";
var password="admin";
var bdd= "GoodDaddyCrypto";

// Définition des options de connection
var options = {
    connectTimeoutMS: 5000,
    useNewUrlParser: true,
    useUnifiedTopology : true
   }
   // Connection à la Bdd MongoDB Atlas avec Mongoose
   mongoose.connect(
       `mongodb+srv://${user}:${password}@cluster0.f1zmr.mongodb.net/${bdd}`,
       options,
      //  function (err) {
      //    console.log(err); // Gestion des erreurs de connexion
      //  }
     )
     // Gestion des erreurs d'authentification
     .then(() => console.log("Connexion à MongoDB réussie !"))
     .catch(() => console.log("Connexion à MongoDB échouée !"));