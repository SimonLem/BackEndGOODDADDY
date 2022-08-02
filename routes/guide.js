var express = require("express");
var router = express.Router();

var guideModel = require("../models/guide");

router.post("/setGuide", async function (req, res, next) {

    var error = [];
    var result = false;

    if (
        req.body.title == "" ||
        req.body.content == "" ||
        req.body.author == "" ||
        req.body.dateRelease == ""
      ) {
        error.push("champs vides");
      }

    var newGuide = new guideModel({
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        dateRelease: req.body.date
      });

    saveGuide = await newGuide.save();

    if (saveUser) {
        result = true;
        token = saveUser.userToken;
      }

  res.json({ result, error });
});

router.post("/getGuide", async function (req, res, next) {

    var guides = await guideModel.find();
    
  res.json({ guides });
});