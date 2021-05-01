const express = require("express");
const router = express.Router();
const spawn = require("child_process").spawn;
const Jobs = require("../../models/Job/Job");

router.get("/recommend", async (req, res) => {
  const childPython = spawn("python3", ["./TF-IDF.py"]);
  childPython.stdout.on("data", async (data) => {
    let jobs = JSON.parse(data.toString());
    let jobIDs = [];
    let jobPromise = new Promise((resolve, reject) => {
      for (let i = 0; i < jobs.length; i++) {
        jobIDs.push(jobs[i].jid);
      }
      resolve();
    });
    jobPromise.then(async () => {
      let jobData = await Jobs.find({ jid: { $in: jobIDs } });
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
