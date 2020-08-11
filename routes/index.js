var express = require("express");
var router = express.Router();
var cors = require("cors");
var Problem = require("../models/Problem");
var vm = require("vm");

router.get("/", cors(), function (req, res, next) {
  res.json({
    message: "준명님, 유리님 다 됐나요?"
  });
});

// RESTful
router.options("/problems/:problem_id", cors());

router.post("/problems/:problem_id", cors(), async function (req, res, next) {
  /*
    1. 클라이언트가 전달해준 사용자의 문제 풀이 내용 -> 실행
    2. 실행한 결과 === 해당 문제의 정답과 일치하는지 비교
    3. 비교 결과를 클라이언트에 응답
   */

  const body = req.body;
  const code = body.code;

  try {
    const problem = await Problem.findById(req.params.problem_id);

    let isCorrect = true;

    for (let i = 0; i < problem.tests.length; i++) {
      try {
        const script = new vm.Script(code + problem.tests[i].code);
        const result = script.runInNewContext();

        if (`${result}` !== problem.tests[i].solution) {
          isCorrect = false;
        }
      } catch (err) {
        res.json({
          result: "에러",
          detail: err.message
        });

        return;
      }
    }

    // Status Code: 200 Success
    if (!isCorrect) {
      res.json({ result: "오답" });
    } else {
      res.json({ result: "정답" });
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});

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
