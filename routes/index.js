var express = require("express");
var router = express.Router();
var cors = require("cors");
var Problem = require("../models/Problem");

// router.get("/problems", cors(), function(req, res, next) {
//   Problem.find().then(function (docs) {
//     res.json(docs);
//   });
// });

router.get("/problems", cors(), async function(req, res, next) {
  try {
    const docs = await Problem.find();
    res.json(docs);
  } catch (err) {
    // error handling
    next(err);
  }
});

module.exports = router;
