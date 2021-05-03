const express = require("express");
const router = express.Router();
const Rating = require("../../models/Job/Rating");

router.post("/rate", async (req, res) => {
  Rating.findOne({
    userId: req.body.userId,
    jobId: req.body.jobId,
    rating: req.body.rating,
  }).then((rating, err) => {
    if (err) throw err;
    if (rating) return res.status(409).send("Duplicate!");

    const newRating = new Rating({
      jobId: req.body.jobId,
      userId: req.body.userId,
      rating: req.body.rating,
    });

    newRating
      .save()
      .then(() => {
        console.log(newRating);
        res.status(200).send("Added user rating!");
      })
      .catch((err) => {
        res.status(400).json("Error: " + err);
      });
  });
});

module.exports = router;
