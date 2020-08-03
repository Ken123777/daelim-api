var express = require('express');
var router = express.Router();
var PROBLEMS = require("./problems.json");
var cors = require("cors");

router.get('/problems', cors(), function(req, res, next) {
  res.json(PROBLEMS);
});

module.exports = router;
