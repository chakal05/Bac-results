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

const bookingSchema = new mongoose.Schema({
  name: String,
  telephone: Number,
  sexe: String,
  date: String,
  hour: String,
  doctor: String,
  rank: Number,
  addedBy: String
});

async function loadTider() {
  let booking = mongoose.model("booking", bookingSchema);
  return booking;
}

// get bookings

router.get("/", async function(req, res) {
  let query = await loadTider();

  if (req.query.date[1] === `hours`) {
    await query.find({ date: req.query.date[0] }, (error, booking) => {
      let timmars = [];

      while (error) return res.status(500).send(error);
      booking.forEach(element => {
        timmars.push(element.hour);
      });

      return res.status(200).send(timmars);
    });
  } else {
    await query.find({ date: req.query.date }, (error, booking) => {
      if (error) return res.status(500).send(error);
      else return res.status(200).send(booking);
    });
  }
});

// Add a new appointment

router.post("/", async function(req, res) {

  const nyTid = {
    name: req.body.name,
    telephone: req.body.telephone,
    sexe: req.body.sexe,
    date: req.body.date,
    hour: req.body.time,
    doctor:req.body.doctor,
    rank: req.body.rank,
    addedBy: req.body.addedBy
  };

  let connexion = await loadTider();
  let post = new connexion(nyTid);

  if (post.save()) {
    res.status(200).send();
  }
});

// Edit item

router.put("/", async function(req, res) {
 
  let query = await loadTider();
  await query.findByIdAndUpdate(req.body.id, req.body, { new: true }, err => {
    if (err) return res.status(500).send(err);
    return res.status(200).end();
  });
});

// Delete item

router.delete("/", async function(req, res) {
  id = req.body.id;
  let query = await loadTider();
  query.findByIdAndRemove(id, (err, doc) => {
    if (err) return res.status(500).send(err);

    return res.status(200).end();
  });
});

module.exports = router;
