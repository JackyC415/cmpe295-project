const express = require("express");
const router = express.Router();
const spawn = require("child_process").spawn;
const Jobs = require("../../models/Job/Job");

router.get("/recommend", async (req, res) => {
  const childPython = spawn("python3", ["./TF-IDF.py"]);
  childPython.stdout.on("data", async (data) => {
    let jobs = JSON.parse(data.toString());
    let jobData = [];

    let jobPromise = new Promise(async (resolve, reject) => {
      for (let i = 0; i < jobs.length; i++) {
        await Jobs.findOne({ jid: jobs[i].jid }, (err, job) => {
          if (!err) {
            let jobObj = job.toObject();
            jobObj.score = jobs[i].score;
            jobObj.userId = req.session.ID;
            jobData.push(jobObj);
          }
        });
      }
      resolve();
    });

    jobPromise.then(() => {
      console.log(jobData);
      return res.status(200).send(jobData);
    });
  });

  childPython.stderr.on("data", (err) => {
    console.log("script errors: " + err);
  });

  childPython.on("close", (data) => {
    console.log("ending script...");
  });
});

module.exports = router;
