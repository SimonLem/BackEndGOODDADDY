var express = require("express");
var router = express.Router();

var userModel = require("../models/user");

router.post("/addOperation", async function (req, res, next) {
  var error = [];
  var result = false;

  if (
    req.body.userToken == "" ||
    req.body.date == "" ||
    req.body.typeOperation == "" ||
    req.body.amountOfToken == "" ||
    req.body.amountPaid == "" ||
    req.body.asset == ""
  ) {
    error.push("champs vides");
  }

  result = await userModel.updateOne(
    { userToken: req.body.userToken },
    {
      $push: {
        operations: {
          date: req.body.date,
          typeOperation: req.body.typeOperation,
          amountOfToken: req.body.amountOfToken,
          amountPaid: req.body.amountPaid,
          asset: req.body.asset
        },
      },
    }
  );

  res.json({ result, error });
});

router.get("/getOperation", async function (req, res, next) {
  var error = [];

  const user = await userModel.findOne({
    userToken: req.query.userToken,
  });

  if (user != null) {
    if (user.operations != []) {
      var operations = user.operations;
    } else {
      error.push("utilisateur sans operations");
    }
  } else {
    error.push("utilisateur inconnu");
  }

  res.json({ error, operations });
});

router.post("/deleteOperation", async function (req, res, next) {
  const user = await userModel.findOne({
    userToken: req.body.userToken,
  });

  if (user != null) {
    if (user.operations != []) {
      var result = await userModel.updateOne(
        { userToken: req.body.userToken },
        { $pull: { operations: { _id: req.body.id } } },
        { multi: true }
      );
    } else {
      error.push("utilisateur sans operations");
    }
  } else {
    error.push("utilisateur inconnu");
  }

  res.json({ result });
});
module.exports = router;
