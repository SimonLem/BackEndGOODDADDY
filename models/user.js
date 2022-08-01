var mongoose = require("mongoose");
var investmentSchema = mongoose.Schema({
  amountPaid: Number,
  amoutOfTokens: Number,
  frequency: String,
  dateFirstPaiement: Date,
  dateNextPaiement: Date,
  hasPaid: Boolean,
});
var walletHistorySchema = mongoose.Schema({
  date: Date,
  amountBTC: Number,
  amountETH: Number,
});
var operationSchema = mongoose.Schema({
  date: Date,
  typeOperation: String,
  amountOfTokens: Number,
  amountPaid: Number,
});
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
  operations:[operationSchema],
  walletHistory:[walletHistorySchema],
  investment:[investmentSchema],
  userToken:String
});

module.exports = mongoose.model("user", userSchema);
