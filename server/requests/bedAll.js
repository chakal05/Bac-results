const express = require("express");
let router = express.Router();
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/peltier", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// 'useFindAndModify' set to false
mongoose.set("useFindAndModify", false);
//Connection to db

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

// Schema

const bedSchema = new mongoose.Schema({
  bedNumber: Number,
  patient: String,
  dateIn: String,
  dateOut: String,
  addedBy: String
});

async function loadBeds() {
  let bed = mongoose.model("beds", bedSchema);
  return bed;
}

// get bookings

router.get("/", async function(req, res) {
  let query = await loadBeds();

  if (req.query.data === "beds") {
    let beds = [];
    await query.find({}, (error, booking) => {
      if (error) return res.status(500).send(error);
      booking.forEach(el => {
        beds.push(el.bedNumber);
      });
      return res.status(200).send(beds);
    });
  } else {
    await query.find({}, (error, booking) => {
      if (error) return res.status(500).send(error);
      else return res.status(200).send(booking);
    });
  }
});

// Add a new bed allotment

router.post("/", async function(req, res) {
  const nyBed = {
    bedNumber: req.body.bedNumber,
    patient: req.body.patient,
    dateIn: req.body.dateIn,
    dateOut: req.body.dateOut,
    addedBy: req.body.addedBy
  };

  let connexion = await loadBeds();
  let post = new connexion(nyBed);

  if (post.save()) {
    res.status(200).send();
  }
});

// Edit item

router.put("/", async function(req, res) {
  let query = await loadBeds();
  await query.findByIdAndUpdate(req.body.id, req.body, { new: true }, err => {
    if (err) return res.status(500).send(err);
    return res.status(200).end();
  });
});

// Delete item

router.delete("/", async function(req, res) {
  id = req.body._id;
  let query = await loadBeds();
  query.findByIdAndRemove(id, (err, doc) => {
    if (err) return res.status(500).send(err);

    return res.status(200).end();
  });
});

module.exports = router;
