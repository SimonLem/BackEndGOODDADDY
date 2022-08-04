var express = require("express");
var router = express.Router();

var userModel = require("../models/user");

router.post("/addStrategy", async function (req, res, next) {
  var error = [];
  var result = false;

  const data = await userModel.findOne({
    userToken: req.body.userToken,
  });

  if (
    req.body.userToken == "" ||
    req.body.amountPaid == "" ||
    req.body.frequency == "" ||
    req.body.asset == "" ||
    req.body.frequency == ""
  ) {
    error.push("data manquante (userToken, amountPaid ou frequency)");
  }
  if (data != null) {
    result = await userModel.updateOne(
      { userToken: req.body.userToken },
      {
        investment: {
          asset: req.body.asset,
          amountPaid: req.body.amountPaid,
          frequency: req.body.frequency,
        },
      }
    );
  } else {
    error.push("utilisateur inconnu");
  }

  res.json({ result, error });
});

router.get("/getStrategy", async function (req, res, next) {
  var error = [];
  const user = await userModel.findOne({
    userToken: req.query.userToken,
  });

  if (user != null) {
    if (user.investment != []) {
      var strategies = user.investment;
    } else {
      error.push("utilisateur sans investissements");
    }
  } else {
    error.push("utilisateur inconnu");
  }

  res.json({ error, strategies });
});

module.exports = router;
