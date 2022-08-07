var mongoose = require("mongoose");

// Schema du sous documents investment
var investmentSchema = mongoose.Schema({
  asset: String,
  amountPaid: Number,
  amoutOfTokens: Number,
  frequency: String,
  dateFirstPaiement: Date,
  dateNextPaiement: Date,
  hasPaid: Boolean,
});

// Schema du sous documents wallettHistory
var walletHistorySchema = mongoose.Schema({
  date: Date,
  amountBTC: Number,
  amountETH: Number,
});

// Schema du sous documents operations
var operationSchema = mongoose.Schema({
  date: Date, // Date of operation
  typeOperation: String, // Buy or Sell
  amountOfTokens: Number,
  amountPaid: Number,
});

// definition du Schema de la collection de documents users
var userSchema = mongoose.Schema({
  email: String,
  telephone: Number,
  firstName: String,
  lastName: String,
  password: String,
  typeInvestor: String,
  isAdmin: Boolean,
  avatar: String,
  descriptionUser: String,
  operations: [operationSchema], // sous documents
  walletHistory: [walletHistorySchema], // sous documents
  investment: [investmentSchema], // sous documents
  userToken: String, 
});

module.exports = mongoose.model("user", userSchema);
