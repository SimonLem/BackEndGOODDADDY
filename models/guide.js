var mongoose = require("mongoose");

// Définition du schéma pour la collection  Guides
// LES DONNEES VONT RESSEMBLER A CA
var guideSchema = mongoose.Schema({
  title: String,
  content: String,
  author: String,
  dateRelease: Date,
  image: String
});

// EXPORT DU MODEL POUR TRAVAILLER AVEC LA BDD
module.exports = mongoose.model("guide", guideSchema);
